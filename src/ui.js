import * as styles from './style'
// calback function to handle login and accessToken
export let loginCallBack;
export let tokenCallBack;
export let cancelCallBack;
export let errorCallBack;
export let beforeSignOutCallback;
export let loginPopup;
export let isSignedIn = false
export let displaySignIn = false
export let displaySignUp = false

const customizeBtns = {
    signIn: {
        label: 'Sign In',
        classList: 'hca-signIn btn btn-dark',
        logo: {
            wrapperClass: 'hca-signIn-logo__wrapper',
            logoClass: 'hca-signIn-logo',
            logoAlt: 'signin-logo',
            url: ''
        }
    },
    signUp: {
        label: 'Sign Up',
        classList: 'hca-signUp btn btn-secondary',
        logo: {
            wrapperClass: 'hca-signUp-logo__wrapper',
            logoClass: 'hca-signUp-logo',
            logoAlt: 'signup-logo',
            url: ''
        }
    },
    signOut: {
        label: 'Sign Out',
        classList: 'hca-signOut btn btn-success',
        logo: {
            wrapperClass: 'hca-signOut-logo__wrapper',
            logoClass: 'hca-signOut-logo',
            logoAlt: 'signout-logo',
            url: ''
        }
    }
}
const signIn = customizeBtns.signIn;
const signUp = customizeBtns.signUp;
const signOut = customizeBtns.signOut;

let signInCustomClass = 'hca-signIn btn btn-dark'
let signInLogoUrl = ''
let isUseDefaultStyle = undefined

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

export function setLabels(signInLabel = signIn.label, signUpLabel = signUp.label, signOutLabel = signOut.label) {
    signIn.label = signInLabel
    signUp.label = signUpLabel
    signOut.label = signOutLabel
    updateLabels()
}

export function setCustomLogoUrl(url) {
    signIn.logo.url = url;
    signUp.logo.url = url;
    signOut.logo.url = url;
    updateAllCustomLogo();

    if (typeof isUseDefaultStyle == 'undefined') {
        addStyles()
    }
}

export function setCustomButtonClass({signInClass = '', signUpClass = '', signOutClass = '', replacement = false}) {
    if (replacement) {
        signIn.classList = signInClass;
        signUp.classList = signUpClass;
        signOut.classList = signOutClass;
    } else {
        signIn.classList = signIn.classList + ' ' + signInClass;
        signUp.classList = signUp.classList + ' ' + signUpClass;
        signOut.classList = signOut.classList + ' ' + signOutClass;
    }
    updateButtonClasses()
}

export function setDefaultBtnStyles(useDefaultStyle = false) {
    isUseDefaultStyle = useDefaultStyle;
    if (useDefaultStyle) {
        addStyles();
    } else {
        const styleNode = document.querySelector('#hca-internal-style');
        if (styleNode) {
            styleNode.remove();
        }
    }
}

export function toggleSignInButton() {
    function createSignInBtnNode() {
        const signInBtn = document.createElement("button");
        signInBtn.id = "SignIn";
    
        if (!isSignedIn) {
            signInBtn.setAttribute("onclick", loginPopup ? "hcaSdk.signInPopup();" :"hcaSdk.signIn();");
            signInBtn.setAttribute('class',  signIn.classList);
            signInBtn.textContent = signIn.label;
        } else {
            signInBtn.setAttribute("onclick", "hcaSdk.signOut();");
            signInBtn.setAttribute('class', signOut.classList);
            signInBtn.textContent = signOut.label;
        }
        return signInBtn
    }

    const signInDivs = document.querySelectorAll('#hca_signin');
    if (signInDivs && signInDivs.length) {
        signInDivs.forEach((node) => {
            node.textContent = ''
            node.appendChild(createSignInBtnNode())
        })
    }
    updateAllCustomLogo();
}

export function toggleSignUpButton() {
    const signUpDivs = document.querySelectorAll("#hca_signup");
    
    if (!signUpDivs || !signUpDivs.length) {
        return;
    }

    if (signUpDivs && isSignedIn) {
        signUpDivs.forEach(node => node.textContent = "");
        return;
    }

    function createSignUpNode() {
        const signUpBtn = document.createElement("button");
        signUpBtn.id = "SignUp";
        if (!isSignedIn) {
            signUpBtn.setAttribute("onclick", loginPopup ? "hcaSdk.signUpPopup();" : "hcaSdk.signUp();");
            signUpBtn.setAttribute('class', signUp.classList);
            signUpBtn.textContent = signUp.label;
        }
        return signUpBtn
    }
    
    signUpDivs.forEach((node) => {
        node.textContent = "";
        node.appendChild(createSignUpNode())
    })
    updateAllCustomLogo();
}
/**
 * @param {() => Promise<boolean>} callback: This callback need to return a Promise which resolve a boolean value. If true --> proceed signout. If false --> keep loggedIn
 */


export function setBeforeSignOutCallback(callback) {
   beforeSignOutCallback = callback;
}

function updateLabels() {
    const signInBtn = document.querySelectorAll('#hca_signin > #SignIn')
    const signInOutLabel = isSignedIn ? signOut.label : signIn.label
    if (signInBtn && signInBtn.length) {
        signInBtn.forEach((node) => {
            node.textContent = signInOutLabel;
        });
    }

    const signUpBtn = document.querySelectorAll('#hca_signup > #SignUp')
    if (signUpBtn) {
        signUpBtn.forEach((node) => {
            node.textContent = signUp.label;
        });
    }
    updateAllCustomLogo();
}

export function addStyles() {
    let styleNode = document.querySelector('#hca-internal-style');
    let isStyleNode = true
    if (!styleNode) {
        styleNode = document.createElement('style');
        isStyleNode = false
        styleNode.id = 'hca-internal-style';
    }
    styleNode.textContent = styles.signInBtnStyle + styles.signOutBtnStyle + styles.signUpBtnStyle;
    if (!isStyleNode) {
        document.head.prepend(styleNode);
    }
}

function updateButtonSignIn() {
    const signInBtns = document.querySelectorAll("#hca_signin > #SignIn");

    if (signInBtns && signInBtns.length && !isSignedIn) {
        signInBtns.forEach((node) => {
            node.setAttribute('class', signIn.classList)
        })
    } else if (signInBtns && signInBtns.length && isSignedIn) {
        signInBtns.forEach((node) => {
            node.setAttribute('class', signOut.classList);
        })
    }
}

function updateButtonSignUp() {
    const signUpBtns = document.querySelectorAll("button#SignUp");
    if (signUpBtns && signUpBtns.length) {
        signUpBtns.forEach((node) => {
            node.setAttribute('class', signUp.classList)
        })
    }
}

function updateButtonClasses() {
    updateButtonSignIn();
    updateButtonSignUp(); 
}

function updateBtnItemLogo(node, type) {
    const btnTypeData = customizeBtns[type];
    const logoAttrs = btnTypeData.logo;
    if (!logoAttrs) {
        return;
    }
    let logoWrapper = node.querySelector(`.${logoAttrs.wrapperClass}`);
    if (!logoWrapper) {
        logoWrapper = document.createElement('span');
        logoWrapper.classList.add(logoAttrs.wrapperClass);
    }

    const logoNode = document.createElement('img');
    logoNode.src = logoAttrs.url;
    logoNode.alt = logoAttrs.alt;
    logoNode.classList = logoAttrs.logoClass;
    logoNode.onerror = function()  {
        this.style.display = 'none';
        if (btnTypeData.classList.indexOf('with-logo') > -1) {
            btnTypeData.classList.replace('with-logo', '');
            node.setAttribute('class', btnTypeData.classList);
        }
    }
    if (btnTypeData.classList.indexOf('with-logo') > -1) {
        node.setAttribute('class', btnTypeData.classList);
    } else {
        btnTypeData.classList = btnTypeData.classList + ' with-logo';
    }
    
    node.setAttribute('class', btnTypeData.classList);
    logoWrapper.textContent = "";
    logoWrapper.append(logoNode);
    node.prepend(logoWrapper);
}

function updateAllCustomLogo() {
    const signInBtns = document.querySelectorAll("#hca_signin > #SignIn");
    if (signInBtns && signInBtns.length && signIn.logo.url && !isSignedIn) {
        signInBtns.forEach((signInBtn) => updateBtnItemLogo(signInBtn, 'signIn'));
    }

    const signUpBtns = document.querySelectorAll("#hca_signup > #SignUp");
    if (signUpBtns && signUpBtns.length && signUp.logo.url && !isSignedIn) {
        signUpBtns.forEach((signUpBtn) => updateBtnItemLogo(signUpBtn, 'signUp'));
    }

    const signOutBtns = document.querySelectorAll("#hca_signin > #SignIn");
    if (signOutBtns && signOutBtns.length && signOut.logo.url && isSignedIn) {
        signOutBtns.forEach((signOutBtn) => updateBtnItemLogo(signOutBtn, 'signOut'));
    }
}

export function displayActiveButtons() {
    if (displaySignIn) {
        toggleSignInButton(isSignedIn)
    }
    if (displaySignUp) {
        toggleSignUpButton(isSignedIn)
    }
}

export function displayLoadingOverlay() {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    });
    const spinner = document.createElement('img');
    spinner.src = "https://form-generator.dev.healthcaresdks.com/spinner_light.svg";
    Object.assign(spinner.style, {
        width: '96px',
        height: '96px'
    });
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
}