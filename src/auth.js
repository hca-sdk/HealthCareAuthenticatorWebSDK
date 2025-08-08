import * as msal from '@azure/msal-browser';
import {
    loginCallBack,
    tokenCallBack,
    toggleSignInButton,
    toggleSignUpButton,
    beforeSignOutCallback,
    cancelCallBack, 
    errorCallBack,
    loginPopup,
    isSignedIn,
    displaySignIn,
    displaySignUp,
} from './ui.js';

export let signInType;
export let accountId = "";
export let clientLocale;
export let aimIdentityTypes = ["AUT", "POI", "UNK"];
export let isTestMode = false;

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
    knownAuthorities = ["auth.hcn.health"],
    tenantDomain = "auth.onekeyconnect.com",
    policyId = "b2c_1a_hca_signup_signin",
    signupPolicyId = "b2c_1a_hca_signuponly",
    apimSubscriptionKey = "",
    apiBasePath = "https://api.healthcaresdks.com/api/hca",
    errorRedirectUrl = "",
    redirectURL = "", // This URL must be configured in portal,
    postLogoutRedirectUri = "",
    isLoginPopup = false,
    ) {

    // TASK-13748
    // Rewrite client's apiBasePath argument which could already ends with "/user/me" by removing this path.
    // Now, default apiBasePath no longer ends with "/user/me", its use was moved to specific API calls (see profile.js).
    // TODO: This could be removed in case all clients are aware of this update and applied it in their own SDK JS implementation.
    if (apiBasePath.endsWith("/user/me")) {
        apiBasePath = apiBasePath.replace("/user/me", "");
    }
    
    const firstKnownAuthorities = knownAuthorities.slice()
    const firstKnownAuthority = firstKnownAuthorities[0]

    // Set the global variables
    msalConfig.auth.clientId = clientId;
    msalConfig.auth.knownAuthorities = firstKnownAuthorities;
    
    let authority
    const isB2cAuthority = ["b2clogin.com", "onekeyconnect.com"].some(domain => firstKnownAuthority.indexOf(domain) != -1)
    if (isB2cAuthority) {
        //  authority: "https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<your-policyID>",
        authority = "https://" + knownAuthorities[0] + "/" + tenantDomain + "/" + policyId;
    } else {
        authority = "https://" + knownAuthorities[0] + '/hca'
        msalConfig.auth.protocolMode = msal.ProtocolMode.OIDC
    }
    msalConfig.auth.authority = authority;

    if (postLogoutRedirectUri) {
        msalConfig.auth.postLogoutRedirectUri = postLogoutRedirectUri;
    }

    if (redirectURL) {
        msalConfig.auth.redirectUri = redirectURL;
    }
    
    // Api config
    apiConfig.subscriptionKey = apimSubscriptionKey;
    apiConfig.endpoint = apiBasePath;

    // Login request
    loginRequest.scopes = scopes.slice();

    // Token request
    tokenRequest.scopes = scopes.slice();

    // SignUp request
    let signupAuthority
    if (isB2cAuthority) {
        // authority: "https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<your-policyID>",
        signupAuthority = "https://" + firstKnownAuthority + "/" + tenantDomain + "/" + signupPolicyId;
    } else {
        signupAuthority = "https://" + firstKnownAuthority + '/hca'
    }

    signUpFlowRequest.authority = signupAuthority;
    signUpFlowRequest.scopes = scopes.slice();

    // Set display buttons variables
    displaySignIn = displaySignInButton
    displaySignUp = displaySignUpButton

    // Set login Popup
    loginPopup = isLoginPopup

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
            setTimeout(() => {
                // To clean the url with query params / hash
                window.history.pushState(null, null, window.location.pathname); 
            }, 500);
        } catch (err) {
            setSignInUI();
            if (err.message && err.message.indexOf("AADB2C90091") > -1) {
                if (cancelCallBack !== undefined) {
                    cancelCallBack();
                    return;
                }
                redirectToLoginPage(scopes);
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
            setSignInUI();
            if (err.message && err.message.indexOf("AADB2C90091") > -1) {
                if (cancelCallBack !== undefined) {
                    cancelCallBack();
                    return;
                }
                // Fix for BUG-15045:
                // When user clicks on Login link in the sign-up form, silently it triggers click on hidden B2C cancel button.
                // If no cancel callback is configured in the SDK implementation, then SDK redirects to login form.
                // Same applied in previous else-if block.
                redirectToLoginPage(scopes);
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
        setSignInUI();
        if (loginCallBack !== undefined) {
            loginCallBack(response.account, response.state);
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
            if (loginCallBack !== undefined) {
                loginCallBack(activeAccount);
            }
        }
        setSignInUI();
    }
}

export async function signIn(redirectStartPage, state) {
    if (typeof redirectStartPage == 'string' && !!redirectStartPage) {
        loginRequest.redirectStartPage = redirectStartPage
    }

    if (typeof state == 'string' && !!state) {
        loginRequest.state = state
    }
    
    const hcaId = localStorage.getItem("hcaid");
    if (hcaId) {
        if (typeof loginRequest.extraQueryParameters === 'object' && loginRequest.extraQueryParameters !== null) {
            loginRequest.extraQueryParameters = { ...loginRequest.extraQueryParameters, hca_id: hcaId };
        } else {
            loginRequest.extraQueryParameters = { hca_id: hcaId };
        }
    }

    myMSALObj.loginRedirect(loginRequest);
}

export async function signOut() {
    let allowSignOut = true
    if (typeof beforeSignOutCallback == 'function') {
        allowSignOut = await beforeSignOutCallback()
    }

    if (!allowSignOut) {
        return
    }
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    myMSALObj.logout(currentAcc);
}

export async function signInPopup() {
    const loginResponse = await myMSALObj.loginPopup(loginRequest);
    handleResponse(loginResponse);
    return loginResponse
}

export async function signUpPopup() {
    const signUpResponse = await myMSALObj.loginPopup(signUpFlowRequest);
    handleResponse(signUpResponse);
    return signUpResponse
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

export async function signUp(redirectStartPage, state) {
    if (typeof redirectStartPage == 'string' && !!redirectStartPage) {
        signUpFlowRequest.redirectStartPage = redirectStartPage
    }

    if (typeof state == 'string' && !!state) {
        signUpFlowRequest.state = state
    }

    myMSALObj.loginRedirect(signUpFlowRequest);
}

export async function setLocaleParams(locale) {
    if (typeof locale == 'string' && !!locale) {
        clientLocale = locale;
        loginRequest.extraQueryParameters = { ui_locales: locale, locale };
        signUpFlowRequest.extraQueryParameters = { ui_locales: locale, locale };
        return;
    }
    
    if (loginRequest.extraQueryParameters?.ui_locales) {
        delete (loginRequest.extraQueryParameters.ui_locales);
        delete (loginRequest.extraQueryParameters.locale);
    }
    if (signUpFlowRequest.extraQueryParameters?.ui_locales) {
        delete (signUpFlowRequest.extraQueryParameters.ui_locales);
        delete (signUpFlowRequest.extraQueryParameters.locale);
    }
    clientLocale = undefined;
}

export async function setRedirectStartPage(redirectStartPage) {
    if (typeof redirectStartPage == 'string' && !!redirectStartPage) {
        loginRequest.redirectStartPage = redirectStartPage;
        signUpFlowRequest.redirectStartPage = redirectStartPage;
    }
}

export async function setStateParams(state) {
    if (typeof state == 'string' && !!state) {
        loginRequest.state = state;
        signUpFlowRequest.state = state;
    }
}

export async function setAimIdentityTypesParams(types) {
    const autorizedTypes = ["AUT", "POI", "UNK", "TST"];
    if (Array.isArray(types) && types.every(type => autorizedTypes.includes(type))) {
        aimIdentityTypes = types;
    }
}

export async function setTestMode(bool) {
    if (typeof bool == "boolean") {
        isTestMode = bool;
    }
}

function setSignInUI() {
    isSignedIn = isAccountLogged();
    toggleButtons();
}

function toggleButtons() {
    if (displaySignIn) {
        toggleSignInButton();
    }
    if (displaySignUp) {
        toggleSignUpButton();
    }
}

function redirectToLoginPage(scopes) {
    myMSALObj.loginRedirect({ prompt: "login", scopes });
}