import './auth.js';
import './dmd.js';
import './ui.js';
import './profile.js';

export { setHcaSdkConfig, signIn, signInPopup, signUpPopup, signOut, getAccessTokenSilent, isAccountLogged, signUp, setLocaleParams, setStateParams, setRedirectStartPage } from './auth.js';
export { triggerAimTag } from './dmd.js';
export { setLoginCallBack, setTokenCallBack, setCancelCallBack, setErrorCallBack, setLabels, setBeforeSignOutCallback, setCustomLogoUrl, setCustomButtonClass, displayActiveButtons, setDefaultBtnStyles } from './ui.js';
export { getAccount, getProfile } from './profile.js';
