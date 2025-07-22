import * as msal from '@azure/msal-browser';
import { myMSALObj, accountId, apiConfig, tokenRequest } from './auth.js';

// Helper function to call API endpoint 
// using authorization bearer token scheme
export function callAPI(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Ocp-Apim-Subscription-Key", apiConfig.subscriptionKey);

    const options = {
        method: "GET",
        headers: headers
    };
    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response))
        .catch(error => console.log(error));
}


export async function getProfile(callback) {
    let request = tokenRequest
    request.account = myMSALObj.getAccountByHomeId(accountId);
    if (request.account) {
        const response = await myMSALObj.acquireTokenSilent(request).catch(error => {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return myMSALObj.acquireTokenRedirect(request)
                    .then(response => {
                        // get access token from response
                        // response.accessToken
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            }

        });

        if (response) {
            const userProfileUrl = `${apiConfig.endpoint}/user/me/profile?api-version=230505`;
            callAPI(userProfileUrl, response.accessToken, callback);
        }
    }
}

export async function getAccount(callback) {
    let request = tokenRequest
    request.account = myMSALObj.getAccountByHomeId(accountId);
    if (request.account) {
        const response = await myMSALObj.acquireTokenSilent(request).catch(error => {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return myMSALObj.acquireTokenRedirect(request)
                    .then(response => {
                        // get access token from response
                        // response.accessToken
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                    });
            }
        });

        if (response) {
            const userProfileUrl = `${apiConfig.endpoint}/user/me/account?api-version=230505`;
            callAPI(userProfileUrl, response.accessToken, callback);
        }
    }
}
