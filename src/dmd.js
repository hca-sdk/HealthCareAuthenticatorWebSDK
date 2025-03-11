// TASK-13748
import { apiConfig } from './auth.js';

export function listenToAimSignal(aimApiKey, subscriptionKey) {
    aimTag(aimApiKey, "signal", async (error, data) => {
        if (error) {
            console.error(error);
        } else if (data?.identity_type === "AUT") {
            console.log('AIM signal data', data);
            const lsHcaIdKey = "HCAIDKey";
            const hcaID = localStorage.getItem(lsHcaIdKey);
            const payload = formatPayload(data, hcaID);
            console.log('API Request payload', payload);
            const response = await resolveUserIdentity(payload, subscriptionKey);
            console.log('API Response', response);
            const hcaId = response?.hca_id;
            if (hcaId) {
                localStorage.setItem(lsHcaIdKey, hcaId);
                aimTag(aimApiKey, 'authenticate', { hca_id: hcaId });
                console.log('Notification sent to AIM');                                                                                                                                                                                 
            }
            /* BEGIN: FOR TESTING PURPOSE ONLY - TO BE REMOVED */
            const signalInput = document.getElementById('signal');
            const responseInput = document.getElementById('response');
            if (signalInput && responseInput) {
                signalInput.innerText = JSON.stringify(data, null, 2);
                responseInput.innerText = JSON.stringify(response, null, 2);
            }
            /* END: FOR TESTING PURPOSE ONLY - TO BE REMOVED */
        }
    });
}

function formatPayload(data, hcaId) {
    const { country_code, dgid, email, first_name, last_name, npi_number, primary_specialty_code, professional_designation, state, zip_code } = data;
    return {
        external_id: dgid,
        email: email,
        first_name: first_name, 
        iso_country: country_code,
        last_name: last_name,
        locale: localStorage.getItem("locale"),
        postal_code: zip_code,
        //professional_type: professional_designation,
        //specialty: primary_specialty_code,
        state: state,
        uci: npi_number,
        //user_id: hcaId
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
