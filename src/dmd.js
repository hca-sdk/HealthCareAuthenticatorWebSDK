import { apiConfig } from './auth.js';

export function triggerAimTag(apiKey) {
    document.addEventListener("DOMContentLoaded", (event) => {
        aimTag(apiKey, "signal", function(error, data) {
            if (error) {
                // Occurs when API key is disabled
                console.log(error);
            } else if (data && data?.identity_type === "AUT") {
                console.log(data);
                const hcaId = localStorage.getItem('HCAIDKey');
                const payload = formatPayload(data, hcaId);
                console.log('payload', payload);
                resolveFromUserRecord(payload, async (response) => {
                    const json = await response.json();
                    const hcaId = json?.userID;
                    if (hcaId) {
                        localStorage.setItem('HCAIDKey', hcaId);
                        // dmd notify (hcaId, personal info)
                    }
                });
            }
        });
    });
}

function formatPayload(data, hcaId) {
    const { country_code, first_name, last_name, npi_number, email, state } = data;
    return {
        country: country_code,
        email: email,
        firstName: first_name, 
        lastName: last_name,
        npi: npi_number,
        state: state,
        userID: hcaId
    };
}

async function resolveFromUserRecord(data, callback) {
    const endpoint = `${apiConfig.endpoint}/myNewEndPoint`;
    console.log('endpoint', endpoint);
    const request = new Request(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    try {
        const response = await fetch(request);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        callback(response);
      } catch (error) {
        console.error(error.message);
      }
}
