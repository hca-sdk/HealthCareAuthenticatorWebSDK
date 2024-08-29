// calback function to handle login and accessToken
export let loginCallBack;
export let tokenCallBack;
export let cancelCallBack;
export let errorCallBack;

let signInLabel = 'Sign In'
let signOutLabel = 'Sign Out'
let signUpLabel = 'Sign Up'
let isToggledSignIn = false

export function addSignInButton() {
    const signInBtn = document.createElement("button");
    signInBtn.id = "SignIn";
    signInBtn.setAttribute("onclick", "hcaSdk.signIn();");
    signInBtn.setAttribute('class', "btn btn-dark")
    signInBtn.innerHTML = signInLabel;
    const signInDiv = document.getElementById("hca_signin");
    if (signInDiv) {
        signInDiv.appendChild(signInBtn);
        isToggledSignIn = false;
    }
}

export function toggleSignInButton() {
    const signInButton = document.getElementById("SignIn");
    if (signInButton) {
        signInButton.setAttribute("onclick", "hcaSdk.signOut();");
        signInButton.setAttribute('class', "btn btn-success")
        signInButton.innerHTML = signOutLabel;
        isToggledSignIn = true;
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

export function addSignUpButton() {
    const signUpBtn = document.createElement("button");
    signUpBtn.id = "SignUp";
    signUpBtn.setAttribute("onclick", "hcaSdk.signUp();");
    signUpBtn.setAttribute('class', "btn btn-secondary")
    signUpBtn.innerHTML = signUpLabel;

    const signUpDiv = document.getElementById("hca_signup");
    if (signUpDiv) {
        signUpDiv.appendChild(signUpBtn);
    }
}

export function toggleSignUpButton() {
    const signUpButton = document.getElementById("SignUp");
    if (signUpButton) {
        signUpButton.remove();
    }
}

function updateLabels() {
    const signInBtn = document.querySelector('#hca_signin > #SignIn')
    if (signInBtn && !isToggledSignIn) {
        signInBtn.textContent = (signInLabel)
    } else if (signInBtn && isToggledSignIn) {
        signInBtn.textContent = (signOutLabel)
    }

    const signUpBtn = document.querySelector('#hca_signup > #SignUp')
    if (signUpBtn) {
        signUpBtn.textContent = (signUpLabel)
    }
}
