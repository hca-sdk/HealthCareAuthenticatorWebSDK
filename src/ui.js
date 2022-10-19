// calback function to handle login and accessToken
export let loginCallBack;
export let tokenCallBack;
export let cancelCallBack;
export let errorCallBack;

export function addSignInButton() {
    const signInBtn = document.createElement("button");
    signInBtn.id="SignIn";
    signInBtn.setAttribute("onclick", "hcaSdk.signIn();");
    signInBtn.setAttribute('class', "btn btn-dark")
    signInBtn.innerHTML = "Sign In";

    const signInDiv = document.getElementById("hca_signin");
    signInDiv.appendChild(signInBtn);
}

export function toggleSignInButton() {
    const signInButton = document.getElementById("SignIn");
    if (signInButton) {
        signInButton.setAttribute("onclick", "hcaSdk.signOut();");
        signInButton.setAttribute('class', "btn btn-success")
        signInButton.innerHTML = "Sign Out";
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

export function addSignUpButton() {
    const signUpBtn = document.createElement("button");
    signUpBtn.id="SignUp";
    signUpBtn.setAttribute("onclick", "hcaSdk.signUp();");
    signUpBtn.setAttribute('class', "btn btn-secondary")
    signUpBtn.innerHTML = "Sign Up";

    const signUpDiv = document.getElementById("hca_signup");
    signUpDiv.appendChild(signUpBtn);
}

export function toggleSignUpButton() {
    const signUpButton = document.getElementById("SignUp");
    if (signUpButton) {
        signUpButton.remove();
    }
}
