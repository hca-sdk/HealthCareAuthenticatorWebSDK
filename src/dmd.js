import { apiConfig } from './auth.js';

export function initAIM(aimApiKey) {
    aimTag(aimApiKey, "signal", async (error, data) => {
        if (error) {
            console.error(error);
        } else if (data?.identity_type === "AUT") {
            const payload = formatPayload(data);
            const response = await resolveUserIdentity(payload);
            const hcaId = response?.hca_id;
            if (hcaId) {
                saveHCAID(hcaId);
                notifyAIM(hcaId);
                // For testing purpose only
                sendResponseToDemoAppWidget();
            } else {
                console.error("Error: No HCAID returned.");
            }
        }
    });
}

function formatPayload(data) {
    const { country_code, dgid, email, first_name, last_name, npi_number, primary_specialty_code, professional_designation, state, zip_code } = data;
    return {
        external_id: dgid,
        email: email,
        first_name: first_name, 
        iso_country: country_code,
        last_name: last_name,
        locale: localStorage.getItem("locale"),
        postal_code: zip_code,
        professional_type: professional_designation,
        specialty: primary_specialty_code,
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
        console.error("Identity resolver request failed", error);
        return {};
    }
}

function saveHCAID(hcaId) {
    window.hcaid = hcaId;
    localStorage.setItem("hcaid", hcaId);
    document.querySelector("body").dataset.hcaId = hcaId;
}

function notifyAIM(hcaId) {
    aimTag(aimApiKey, 'authenticate', { hca_id: hcaId });
}

/**
 * For testing purpose only.
 * Need testing widget to be present in demo app.
 */
function sendResponseToDemoAppWidget() {
    const signalInput = document.getElementById('signal');
    const responseInput = document.getElementById('response');
    if (signalInput && responseInput) {
        signalInput.innerText = JSON.stringify(data, null, 2);
        responseInput.innerText = JSON.stringify(response, null, 2);
    }
}