// calback function to handle login and accessToken
export let loginCallBack;
export let tokenCallBack;
export let cancelCallBack;
export let errorCallBack;
export let beforeSignOutCallback;
export let loginPopup;

let signInLabel = 'Sign In'
let signOutLabel = 'Sign Out'
let signUpLabel = 'Sign Up'
let isToggledSignIn = false

export function toggleSignInButton(loggedIn = false) {
    const signInBtn = document.createElement("button");
    signInBtn.id = "SignIn";

    if (!loggedIn) {
        signInBtn.setAttribute("onclick", loginPopup ? "hcaSdk.signInPopup();" :"hcaSdk.signIn();");
        signInBtn.setAttribute('class',  "btn btn-dark");
        signInBtn.textContent = signInLabel;
        isToggledSignIn = false
    } else {
        signInBtn.setAttribute("onclick", "hcaSdk.signOut();");
        signInBtn.setAttribute('class', "btn btn-success");
        signInBtn.textContent = signOutLabel
        isToggledSignIn = true
    }

    const signInDiv = document.getElementById("hca_signin");
    if (signInDiv) {
        signInDiv.textContent = "";
        signInDiv.appendChild(signInBtn)
    }
}

export function setLoginCallBack(callback) {
    loginCallBack = callback;
}

export function setTokenCallBack(callback) {
    tokenCallBack = callback;
}

export function setCancelCallBack(callback) {
    cancelCallBack = callback;
}

export function setErrorCallBack(callback) {
    errorCallBack = callback;
}

/**
 * 
 * @param {string | undefined} signIn: SignIn label
 * @param {string | undefined} signUp: SignUp label
 * @param {string | undefined} signOut: SignOut label
 */

export function setLabels(signIn = signInLabel, signUp = signUpLabel, signOut = signOutLabel) {
    signInLabel = signIn
    signUpLabel = signUp
    signOutLabel = signOut
    updateLabels()
}

export function toggleSignUpButton(loggedIn = false) {
    const signUpDiv = document.getElementById("hca_signup");
    if (!signUpDiv) {
        return;
    }
    if (signUpDiv && loggedIn) {
        signUpDiv.textContent = "";
        return;
    }
    const signUpBtn = document.createElement("button");
    signUpBtn.id = "SignUp";
    if (!loggedIn) {
        signUpBtn.setAttribute("onclick", "hcaSdk.signUp();");
        signUpBtn.setAttribute('class', "btn btn-secondary");
        signUpBtn.textContent = signUpLabel;
    }
    signUpDiv.appendChild(signUpBtn)
    
}
/**
 * @param {() => Promise<boolean>} callback: This callback need to return a Promise which resolve a boolean value. If true --> proceed signout. If false --> keep loggedIn
 */


export function setBeforeSignOutCallback(callback) {
   beforeSignOutCallback = callback;
}

function updateLabels() {
    const signInBtn = document.querySelector('#hca_signin > #SignIn')
    if (signInBtn && !isToggledSignIn) {
        signInBtn.textContent = signInLabel;
    } else if (signInBtn && isToggledSignIn) {
        signInBtn.textContent = signOutLabel;
    }

    const signUpBtn = document.querySelector('#hca_signup > #SignUp')
    if (signUpBtn) {
        signUpBtn.textContent = signUpLabel
    }
}
