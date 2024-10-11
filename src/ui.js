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

let signInLabel = 'Sign In'
let signOutLabel = 'Sign Out'
let signUpLabel = 'Sign Up'
let signInCustomClass = 'hca-signIn btn btn-dark'
let signUpCustomClass = 'hca-signUp btn btn-secondary'
let signOutCustomClass = 'hca-signOut btn btn-success'
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

export function setLabels(signIn = signInLabel, signUp = signUpLabel, signOut = signOutLabel) {
    signInLabel = signIn
    signUpLabel = signUp
    signOutLabel = signOut
    updateLabels()
}

export function setLogoSignInButton(url) {
    signInLogoUrl = url
    updateSignInLogo()

    if (typeof isUseDefaultStyle == 'undefined') {
        addSignInBtnDefaultStyle()
    }
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
            signInBtn.setAttribute('class',  signInCustomClass);
            signInBtn.textContent = signInLabel;
        } else {
            signInBtn.setAttribute("onclick", "hcaSdk.signOut();");
            signInBtn.setAttribute('class', signOutCustomClass);
            signInBtn.textContent = signOutLabel
        }
        return signInBtn
    }

    const signInDivs = document.querySelectorAll('#hca_signin');
    if (signInDivs && signInDivs.length) {
        signInDivs.forEach((node) => {
            node.textContent = ''
            node.appendChild(createSignInBtnNode())
        })
        updateSignInLogo();
    }
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
            signUpBtn.setAttribute('class', signUpCustomClass);
            signUpBtn.textContent = signUpLabel;
        }
        return signUpBtn
    }
    
    signUpDivs.forEach((node) => {
        node.textContent = "";
        node.appendChild(createSignUpNode())
    })
    
}
/**
 * @param {() => Promise<boolean>} callback: This callback need to return a Promise which resolve a boolean value. If true --> proceed signout. If false --> keep loggedIn
 */


export function setBeforeSignOutCallback(callback) {
   beforeSignOutCallback = callback;
}

function updateLabels() {
    const signInBtn = document.querySelectorAll('#hca_signin > #SignIn')
    const signInOutLabel = isSignedIn ? signOutLabel : signInLabel
    if (signInBtn && signInBtn.length) {
        signInBtn.forEach((node) => {
            node.textContent = signInOutLabel;
        });
    }
    if (!isSignedIn) {
        updateSignInLogo();
    }

    const signUpBtn = document.querySelectorAll('#hca_signup > #SignUp')
    if (signUpBtn) {
        signUpBtn.forEach((node) => {
            node.textContent = signUpLabel;
        });
    }
}

export function addSignInBtnDefaultStyle() {
    let styleNode = document.querySelector('#hca-internal-style');
    if (styleNode) {
        return;
    }
    styleNode = document.createElement('style');
    styleNode.id = 'hca-internal-style';
    styleNode.textContent = styles.signInBtnStyle;
    document.head.prepend(styleNode);
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
            node.setAttribute('class', signInCustomClass)
        })
    } else if (signInBtns && signInBtns.length && isSignedIn) {
        signInBtns.forEach((node) => {
            node.setAttribute('class', signOutCustomClass);
        })
    }
}

function updateButtonSignUp() {
    const signUpBtns = document.querySelectorAll("button#SignUp");
    if (signUpBtns && signUpBtns.length) {
        signUpBtns.forEach((node) => {
            node.setAttribute('class', signUpCustomClass)
        })
    }
}

function updateButtonClasses() {
    updateButtonSignIn();
    updateButtonSignUp(); 
}

function updateSignInLogo() {
    const signInBtns = document.querySelectorAll("#hca_signin > #SignIn");
    if (signInBtns && signInBtns.length && signInLogoUrl && !isSignedIn) {
        signInBtns.forEach((btnSignin) => {
            let logoWrapper = btnSignin.querySelector('.hca-signIn-logo__wrapper');
            // logo
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
                    btnSignin.setAttribute('class', signInCustomClass);
                }
            }
            
            if (signInCustomClass.indexOf('with-logo') > -1) {
                btnSignin.setAttribute('class', signInCustomClass);
            } else {
                signInCustomClass += ' with-logo';
            }
            
            btnSignin.setAttribute('class', signInCustomClass);
            logoWrapper.textContent = "";
            logoWrapper.append(logoNode);
            btnSignin.prepend(logoWrapper);
        })
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
