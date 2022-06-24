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
            console.log(error);
        })
        const userProfileUrl = `${apiConfig.endpoint}/user`;
        callAPI(userProfileUrl, response.idToken, callback);
    }
}
