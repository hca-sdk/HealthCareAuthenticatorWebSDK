import * as msal from '@azure/msal-browser';
import {
    addSignInButton,
    addSignUpButton,
    loginCallBack,
    tokenCallBack,
    toggleSignInButton,
    toggleSignUpButton,
    cancelCallBack, errorCallBack
} from './ui.js';

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
export let loginRequest = {
    scopes: []
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

export async function setHcaSdkConfig(clientId,
    displaySignInButton = true,
    displaySignUpButton = true,
    scopes = ["https://auth.onekeyconnect.com/x/profile.basic"],
    knownAuthorities = ["auth.onekeyconnect.com"],
    tenantDomain = "auth.onekeyconnect.com",
    policyId = "b2c_1a_hca_signup_signin",
    signupPolicyId = "b2c_1a_hca_signuponly",
    apimSubscriptionKey = "",
    apiBasePath = "https://api.healthcaresdks.com/api/hca/user/me",
    errorRedirectUrl = "") {

    // Set the global variables
    msalConfig.auth.clientId = clientId;
    msalConfig.auth.knownAuthorities = knownAuthorities.slice();
    
    //  authority: "https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<your-policyID>",
    const authority = "https://" + knownAuthorities[0] + "/" + tenantDomain + "/" + policyId;
    msalConfig.auth.authority = authority;

    // Api config
    apiConfig.subscriptionKey = apimSubscriptionKey;
    apiConfig.endpoint = apiBasePath;

    // Login request
    loginRequest.scopes = scopes.slice();

    // Token request
    tokenRequest.scopes = scopes.slice();

    // SignUp request
    const signupAuthority = "https://" + knownAuthorities[0] + "/" + tenantDomain + "/" + signupPolicyId;
    signUpFlowRequest.authority = signupAuthority;
    signUpFlowRequest.scopes = scopes.slice();

    // Display buttons
    if (displaySignInButton) {
        addSignInButton();
    }

    if (displaySignUpButton) {
        addSignUpButton();
    }

    // Check for SSO authentication & expired Magic Link
    const searchParams = new URL(window.location.href).searchParams;
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    // decode state
    let state = searchParams.get("state") || hashParams.get("state")
    if (state) {
        try {
            state = atob(state)
            try {
                state = JSON.parse(state)
            } catch (err) {
                console.log("could not parse state")
            }
        } catch (err) {
            console.log("could not decode state")
        }
    }

    const code = searchParams.get("code") || hashParams.get("code");
    const error = searchParams.get("error") || hashParams.get("error");
    const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");

    // lookup verifier local stroage, query and state
    let verifier = localStorage.getItem("pkce_code_verifier")
    if (!verifier && ( searchParams.get("verifier") || hashParams.get("verifier") ) ) {
        verifier = searchParams.get("verifier") || hashParams.get("verifier") 
    }
    if (!verifier && state && state.verifier) {
        verifier = state.verifier
    }

    if (error && error == "expired" && errorDescription) {
        if (errorRedirectUrl) {
            window.location.href = errorRedirectUrl;
        }
    } else if (code && verifier) {
        const tokenRequest = {
            code: code,
            scopes: scopes,
            codeVerifier: verifier,
        };
        try {
            myMSALObj = new msal.PublicClientApplication(msalConfig);
            await myMSALObj.initialize();
            const response = await myMSALObj.acquireTokenByCode(tokenRequest);
            handleResponse(response);
            setTimeout(() => { window.location.href = "/" }, 1000);
        } catch (err) {
            if (err.message && err.message.indexOf("AADB2C90091") > -1) {
                if (cancelCallBack !== undefined) {
                    cancelCallBack();
                    return;
                }
            }
            if (errorCallBack !== undefined) {
                errorCallBack(err);
            } else {
                console.log(err);
            }
        }
    } else {
        try {
            // Create the main myMSALObj instance
            myMSALObj = new msal.PublicClientApplication(msalConfig);
            await myMSALObj.initialize();
            // Register Callbacks for Redirect flow
            const response = await myMSALObj.handleRedirectPromise();
            handleResponse(response);
        } catch (err) {
            if (err.message && err.message.indexOf("AADB2C90091") > -1) {
                if (cancelCallBack !== undefined) {
                    cancelCallBack();
                    return;
                }
            }
            if (errorCallBack !== undefined) {
                errorCallBack(err);
            } else {
                console.log(err);
            }
        }
    }
}

export async function handleResponse(response) {
    if (response && response.account) {
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
    myMSALObj.loginRedirect(loginRequest);
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

export async function getAccessTokenSilent() {
    try {
        let request = tokenRequest;
        request.account = myMSALObj.getAccountByHomeId(accountId);
        const response = await myMSALObj.acquireTokenSilent(request);
        handleTokenResponse(response);
    } catch (error) {
        console.log(error);
    }
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

export async function setLocaleParams(locale) {
    if (typeof locale == 'string' && !!locale) {
        loginRequest.extraQueryParameters = { ui_locales: locale, locale };
        signUpFlowRequest.extraQueryParameters = { ui_locales: locale, locale };
    }
}