
<a name="v2.3"></a>
## v2.3

### Feature

* use Access Token for method getProfile & getAccount instead of Id Token from
* add ME/profile endpoint query params ?api-version=230505
* change oidc mode and knownAuthorities to contruct new custom dicovery url domain - SSOv2

<a name="v2.1"></a>
## v2.1

### Feature

* add `redirectStartPage` and `state` for signIn signUp args
* add new setting to enable signUp popup
* expose new `setStateParams` methods to add state parameters for login request
* add custom button className and logo url
* expose method `displayActiveButtons` to display button actively
* expose method `setLocaleParams` for setting locale in login and signup
* export `signInPopup` method and `isLoginPopup` args in `setHcaSdkConfig` for popup login
* add `postLogoutRedirectUri` args in `setHcaSdkConfig`
* expose method `setLabels` to enable setup dynamic labels for signin / signup / signout
* expose async method `setBeforeSignOutCallback` to block logout process when signout button clicked. (To add confirm dialog / promt etc)

### Fix

* remove default internal style for hca-sdks
* enable to add custom logo for signup and signout buttons 20091d4

