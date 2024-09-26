import './auth.js';
import './ui.js';
import './profile.js';

export { setHcaSdkConfig, signIn, signInPopup, signOut, getAccessTokenSilent, isAccountLogged, signUp, setLocaleParams } from './auth.js';
export { setLoginCallBack, setTokenCallBack, setCancelCallBack, setErrorCallBack, setLabels, setBeforeSignOutCallback, setLogoSignInButton, setCustomButtonClass, displayActiveButtons } from './ui.js';
export { getAccount, getProfile } from './profile.js';
