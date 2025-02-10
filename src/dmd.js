import { apiConfig } from './auth.js';

export function triggerAimTag(apiKey) {
    //document.addEventListener("DOMContentLoaded", (event) => {
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
    //});
}

function formatPayload(data, hcaId) {
    const { country_code, dgid, email, first_name, last_name, npi_number, primary_specialty_code, professional_designation, state, zip_code } = data;
    return {
        dgid: dgid,
        email: email,
        firstName: first_name, 
        isoCountry: country_code,
        lastName: last_name,
        locale: "",
        postalCode: zip_code,
        professionalType: professional_designation, // API needs an OneKey code
        specialty: primary_specialty_code, // API needs an OneKey code
        state: state,
        uci: npi_number,
        userID: hcaId
    };
}

async function resolveFromUserRecord(data, callback) {
    const endpoint = `https://onekey-hcl-dev-eastus-apim.azure-api.net/api/hca/identities/resolve`;
    console.log('endpoint', endpoint);
    const request = new Request(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ocp-apim-subscription-key": "c790311934d34f639025433d01e2e19c"
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
