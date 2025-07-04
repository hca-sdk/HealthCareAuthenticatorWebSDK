import { aimIdentityTypes, apiConfig, clientLocale, isTestMode, signIn } from './auth.js';

export function initAIM(apiKey, cssSelector) {
    if (arguments.length !== 2 && !document.querySelector(cssSelector)) {
        console.error("Error: initAIM function expects 2 arguments: <aimApiKey>, <elementSelector>");
        return;
    }
    configureLoginButton(cssSelector);
    setAimSignalListener(apiKey, cssSelector);
}

function configureLoginButton(cssSelector) {
    const button = document.querySelector(cssSelector);
    button.style.visibility = "hidden";
    button.addEventListener("click", (event) => {
        event.preventDefault();
        signIn();
    });
}

function showLoginButton(cssSelector) {
    const button = document.querySelector(cssSelector);
    button.style.visibility = "visible";
}

function setAimSignalListener(apiKey, cssSelector) {
    aimTag(apiKey, "signal", async (error, data) => {
        if (error) {
            console.error("Error: AIM signal has failed.", error);
            return;
        } else if (data !== null && typeof data === 'object' && aimIdentityTypes.includes(data?.identity_type)) {
                const payload = formatPayload(data);
                const response = await resolveUserIdentity(payload);
                const hcaId = response?.hca_id;
                if (!hcaId) {
                    console.error("Error: Identity resolver has not returned any HCA Id.");
                    return;
                }
                saveHcaId(hcaId, cssSelector);
                notifyAim(apiKey, hcaId);
                showLoginButton(cssSelector);
                // For DEV/UAT testing purpose only
                if (isTestMode) {
                    sendResponseEvent(data, payload, response);
                }
            }  
        }
    );
}

function formatPayload(data) {
    const { country_code, dgid, email, first_name, last_name, npi_number, primary_specialty_code, professional_designation, state, zip_code } = data;
    return {
        external_id: dgid,
        business_email: email,
        first_name: first_name, 
        iso_country: country_code,
        last_name: last_name,
        locale: clientLocale,
        postal_code: zip_code,
        //professional_type: professional_designation,
        //specialty: primary_specialty_code,
        state: state,
        uci: npi_number
    };
}

async function resolveUserIdentity(data) {
    try {
        const endpoint = `${apiConfig.endpoint}/identities/resolve/dmd`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ocp-apim-subscription-key": apiConfig.subscriptionKey
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result || {};
    } catch (error) {
        console.error("Error: Identity resolver request has failed.", error);
        return {};
    }
}

function saveHcaId(id, cssSelector) {
    localStorage.setItem("hcaid", id);
    document.querySelector(cssSelector).dataset.hcaId = id;
}

function notifyAim(apiKey, hcaId) {
    aimTag(apiKey, 'authenticate', { hca_id: hcaId });
}

function sendResponseEvent(data, payload, response) {
    const customEvent = new CustomEvent("hcaIdReceived", {
        detail: {
            signal: JSON.stringify(data, null, 2),
            payload: JSON.stringify(payload, null, 2),
            response: JSON.stringify(response, null, 2)
        }
    });
    document.dispatchEvent(customEvent);
};