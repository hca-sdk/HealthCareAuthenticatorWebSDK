import * as styles from './style'
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
let signInCustomClass = 'hca-signIn btn btn-dark'
let signUpCustomClass = 'hca-signUp btn btn-secondary'
let signOutCustomClass = 'hca-signOut btn btn-success'
let signInLogoUrl = ''
let isToggledSignIn = false

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

export function setLogoSignInButton(url) {
    signInLogoUrl = url
    updateSignInLogo()
}

export function setCustomButtonClass({signInClass = '', signUpClass = '', signOutClass = '', replacement = false}) {
    if (replacement) {
        signInCustomClass = signInClass;
        signUpCustomClass = signUpClass;
        signOutCustomClass = signOutClass;
    } else {
        signInCustomClass += ' ' + signInClass;
        signUpCustomClass += ' ' + signUpClass;
        signOutCustomClass += ' ' + signOutClass;
    }
    updateButtonClasses()
}

export function toggleSignInButton(loggedIn = false) {
    const signInBtn = document.createElement("button");
    signInBtn.id = "SignIn";

    if (!loggedIn) {
        signInBtn.setAttribute("onclick", loginPopup ? "hcaSdk.signInPopup();" :"hcaSdk.signIn();");
        signInBtn.setAttribute('class', signInCustomClass);
        signInBtn.textContent = signInLabel;
        isToggledSignIn = false
    } else {
        signInBtn.setAttribute("onclick", "hcaSdk.signOut();");
        signInBtn.setAttribute('class', signOutCustomClass);
        signInBtn.textContent = signOutLabel
        isToggledSignIn = true
    }

    const signInDiv = document.getElementById("hca_signin");
    if (signInDiv) {
        signInDiv.textContent = "";
        signInDiv.appendChild(signInBtn)
        updateSignInLogo();
    }
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
        signUpBtn.setAttribute('class', signUpCustomClass);
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
        updateSignInLogo();
    } else if (signInBtn && isToggledSignIn) {
        signInBtn.textContent = signOutLabel;
    }

    const signUpBtn = document.querySelector('#hca_signup > #SignUp')
    if (signUpBtn) {
        signUpBtn.textContent = signUpLabel
    }
}

export function addStyles() {
    const styleNode = document.createElement('style');
    styleNode.textContent = styles.signInBtnStyle + styles.signOutBtnStyle + styles.signUpBtnStyle

    document.head.prepend(styleNode);
}

function updateButtonSignIn() {
    const signInBtn = document.querySelector("#hca_signin > #SignIn");

    if (signInBtn && !isToggledSignIn) {
        signInBtn.setAttribute('class', signInCustomClass);
    } else if (signInBtn && isToggledSignIn) {
        signInBtn.setAttribute('class', signOutCustomClass);
    }
}

function updateButtonSignUp() {
    const signUpBtn = document.querySelector("button#SignUp");
    if (signUpBtn) {
        signUpBtn.setAttribute('class', signUpCustomClass)
    }
}

function updateButtonClasses() {
    updateButtonSignIn();
    updateButtonSignUp(); 
}

function updateSignInLogo() {
    const signInBtn = document.querySelector("#hca_signin > #SignIn");
    if (signInBtn && signInLogoUrl && !isToggledSignIn) {
        // logo
        let logoWrapper = signInBtn.querySelector('.hca-signIn-logo__wrapper');
        if (!logoWrapper) {
            logoWrapper = document.createElement('span');
            logoWrapper.classList.add('hca-signIn-logo__wrapper')
        }
        const logoNode = document.createElement('img');
        logoNode.src = signInLogoUrl;
        logoNode.alt = 'signin-logo';
        logoNode.classList = 'hca-signIn-logo';
        logoNode.onerror = function()  {
            this.style.display = 'none';
            if (signInCustomClass.indexOf('with-logo') > -1) {
                signInCustomClass.replace('with-logo', '');
                updateButtonSignIn();
            }
        }
        signInCustomClass += ' with-logo';
        updateButtonSignIn();
        logoWrapper.textContent = "";
        logoWrapper.append(logoNode);
        signInBtn.prepend(logoWrapper);
    }
}