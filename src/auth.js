import * as msal from '@azure/msal-browser';
import { addSignInButton, addSignUpButton, loginCallBack, tokenCallBack, toggleSignInButton, toggleSignUpButton } from './ui.js';


export let signInType;
export let accountId = "";

// Create the main myMSALObj instance
export let myMSALObj;  // instantiation in setHcaSdkConfig


// Config object to be passed to Msal on creation
export let msalConfig = {
    auth: {
        clientId: "",
        authority: "",
        knownAuthorities: []
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export let tokenRequest = {
    scopes: [],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Request to call SignUp flow
export let signUpFlowRequest = {
    scopes: [],
    authority: ""
  };


// Add here the endpoints for API services you would like to use.
export let apiConfig = {
    subscriptionKey: "",
    endpoint: ""
};

export function setHcaSdkConfig(clientId, displaySignInButton = true, displaySignUpButton = true,
    scopes = ["https://auth.onekeyconnect.com/user/profile.basic"],
    knownAuthorities =  ["auth.onekeyconnect.com"], tenantDomain = "auth.onekeyconnect.com",
    policyId = "B2C_1A_HCA_SIGNUP_SIGNIN_REST_API_IDP", signupPolicyId="B2C_1A_HCASIGNUPONLY",
    apimSubscriptionKey="***REMOVED***",
    apiBasePath="https://api.healthcaresdks.com/api") {

    msalConfig.auth.clientId = clientId;
    msalConfig.auth.knownAuthorities = knownAuthorities.slice();

    //  authority: "https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<your-policyID>",
    const authority = "https://" +  knownAuthorities[0] + "/" + tenantDomain + "/" + policyId;
    msalConfig.auth.authority = authority;
 
    // Token request
    tokenRequest.scopes = scopes.slice();

    // SignUp request
    const signupAuthority = "https://" +  knownAuthorities[0] + "/" + tenantDomain + "/" + signupPolicyId;
    signUpFlowRequest.authority = signupAuthority;
    signUpFlowRequest.scopes = scopes.slice();   

    // Create the main myMSALObj instance
    myMSALObj = new msal.PublicClientApplication(msalConfig);
 
    // Register Callbacks for Redirect flow
     myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
        console.error(err);
    });

    // Api config
    apiConfig.subscriptionKey = apimSubscriptionKey;
    apiConfig.endpoint = apiBasePath + "/hca";

     if (displaySignInButton) {
         addSignInButton();
     }

     if (displaySignUpButton) {
        addSignUpButton();
    }
}

export function handleResponse(response) {
    if (response !== null) {
        accountId = response.account.homeAccountId;
        myMSALObj.setActiveAccount(response.account);
        toggleSignInButton();
        toggleSignUpButton();
        if (loginCallBack !== undefined) {
            loginCallBack(response.account);
        }
    } else {
        // need to call getAccount here?
        const currentAccounts = myMSALObj.getAllAccounts();
        if (!currentAccounts || currentAccounts.length < 1) {
            // No account add ssoSilent here ?
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
        } else if (currentAccounts.length === 1) {
            const activeAccount = currentAccounts[0];
            myMSALObj.setActiveAccount(activeAccount);
            accountId = activeAccount.homeAccountId;
            toggleSignInButton();
            toggleSignUpButton();
            if (loginCallBack !== undefined) {
                loginCallBack(activeAccount);
            }
        }
    }

}

export async function signIn() {
    myMSALObj.loginRedirect();
}

export function signOut() {
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    myMSALObj.logout(currentAcc);
}


export function handleTokenResponse(response) {
    if (response !== null) {
        if (tokenCallBack !== undefined) {
            tokenCallBack(response);
        }
    }
}

export function getAccessTokenSilent() {
    let request = tokenRequest
    request.account = myMSALObj.getAccountByHomeId(accountId);
    myMSALObj.acquireTokenSilent(request).then(handleTokenResponse).catch(error => {
        console.log(error);
    })
}

export function isAccountLogged() {
    const currentAccounts = myMSALObj.getAllAccounts();
    if (!currentAccounts || currentAccounts.length < 1) {
        return false;
    } else if (currentAccounts.length > 1) {
        return true;
    } else if (currentAccounts.length === 1) {
        return true;
    }
}

export async function signUp() {
    myMSALObj.loginRedirect(signUpFlowRequest);
}