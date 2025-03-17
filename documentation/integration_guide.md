# OneKey HCA SDK integration guide


## To install and integrate the HCA SDK within a website or JavaScript app


1. Add HCA SDK &ndash; The library can be loaded directly from our CDN. You can also download and host it by yourself. Just append the following line of code inside your HTML template. We recommend to place it at the end of the body tag to avoid blocking the website initial rendering. For example:


```html

  <body>
  
    <script src="https://static.healthcaresdks.com/hca/v1/onekey-hca-sdk.js"></script>

  </body>

```


2. Display the 'Sign In' button UI


```html

  <body>
      <div>

            <!-- Place you want to display the SignIn button -->
            <div id="hca_signin"> 
            </div>
            <!-- Place you want to display the SignUp button -->
            <div id="hca_signup"> 
            </div>

        </div>

  </body>

```


3. Initialize the HCA SDK


```html

  <body>

    <!-- HCA SDK Set Configuration -->
    <script>
      hcaSdk.setHcaSdkConfig(
        <clientId>,
        <displaySignInButton>, 
        <displaySignUpButton>,
        [<scopes>],
        [<knownAuthorities>],
        <tenantDomain>,
        <policyId>,
        <signupPolicyId>,
        <apimSubscriptionKey>,
        <apiBasePath>,
        <expiredUrl>,
        <redirectUrl>,
        <postLogoutRedirectUri>,
        <isLoginPopup>
      );
    </script>

  </body>

```
  The parameter `&lt;clientId&gt;` must have be filled with the value provided during registration.

  The parameter `&lt;displaySignInButton&gt;` must have the value true to display the SignIn button false otherwise with a default value set to true.

  The parameter `&lt;displaySignUpButton&gt;` must have the value true to display the SignUp button false otherwise with a default value set to true.

  The Parameter `&lt;scopes&gt;` is an array and has a default value set to ["https://auth.onekeyconnect.com/user/profile.basic"].

  The Parameter `&lt;knownAuthorities&gt;` is an array and has a default value set to ["auth.onekeyconnect.com"].

  The Parameter `&lt;tenantDomain&gt;` has a default value set to "auth.onekeyconnect.com".

  The Parameter `&lt;policyId&gt;` has a default value set to "B2C_1A_HCA_SIGNUP_SIGNIN".

  The Parameter `&lt;signupPolicyId&gt;` has a default value set to "B2C_1A_HCASIGNUPONLY".

  The Parameter `&lt;apimSubscriptionKey&gt;` has a default value. *Do not change it*.

  The Parameter `&lt;apiBasePath&gt;` has a default value. *Do not change it*.

  The Parameter &lt;expiredUrl&gt; could be filled with url link, which to be redirected to, when Magic-link has expired.

  The Parameter &lt;redirectUrl&gt; could be filled with url link, which to be redirected to, after user logged in.

  The Parameter &lt;postLogoutRedirectUri&gt; could be filled with url link, which to be redirected to, after user logged out.

  The Parameter &lt;isLoginPopup&gt; the config to enabling loginPopup instead of loginRedirect on button signIn and signUp render by hcaSdk, default to false.

  4. Define the return function to handle the login

```html

  <body>

    <!-- HCA SDK Set Configuration -->
    <script>
      
      hcaSdk.setLoginCallBack(updateUILogin);
      
    </script>

  </body>

```

The callback function below displays the ID of the logged user:

```js

  function updateUILogin(account) {
    console.log(account.userId);
  }

```


5. Service calls for additional data

  - hcaSdk.isAccountLogged() : get if a user is logged in
    
```js

  function isLogged() {
    console.log("isLogged: " + hcaSdk.isAccountLogged());
  }

```

  - hcaSdk.getProfile() : retrieve the profile data of the logged user

```js

  function getProfile() {
      hcaSdk.getProfile(callbackProfile);
  }

  function callbackProfile(data) {
     console.log(data);
  }

```

6. Customize button labels:
  - `hcaSdk.setLabels(<signInButtonLabel>, <signUpButtonLabel>, <signOutButtonLabel>)`: For customizing labels of sign in, sign-up and sign-out buttons

```js
  hcaSdk.setLabels('Sign-in', 'Sign-up', 'Sign-out')
```

7. Customize locale params:
  - `hcaSdk.setLocaleParams(<localeString>)`: allows to specify the language or regional settings (locale) for the HCA’s sign-in / sign-up page
page

```js
  hcaSdk.setLocaleParams('en-GB')
```

8. Customize `redirectStartPage`:
After signup success, users could be redirect back to the application where the signup redirect was initialized. If you want to change the destination start page, you can specify `redirectStartPage` 

  - `hcaSdk.setRedirectStartPage(<redirectStartPageUri>)`: allows to specify the start page after redirect sign-in / sign-up finish.

This methods `hcaSdk.setRedirectStartPage` is the only way to setup `redirectStartPage` when you are using button rendered by hcaSdk.

Incase you are using `hcaSdk.signIn` and `hcaSdk.signUp` methods for sign-in and sign-up redirect, you can also custom `redirectStartPage` by
`hcaSdk.signIn(<redirectStartPage>, <state>)` or `hcaSdk.signUp(<redirectStartPage>, <state>)`

```js
  hcaSdk.setRedirectStartPage("/dashboard")
```

9. Customize `state` parameters:

`State` parameters are often used to maintain the state between authentication requests and responses, store information about the user’s context or the current page they are on before redirecting them to the sign-in / sign-up page

- `hcaSdk.setStateParams(<state>)`: allow to specify the state parameter before sign-in or sign-up action.

- `hcaSdk.signIn(<redirectStartPage>, <state>)` or `hcaSdk.signUp(<redirectStartPage>, <state>)` could also be used to setup state parameter when initialize sign-in / sign-up

```js
  hcaSdk.setStateParams('HealthCare Authenticator');
```

After authentication succeeded and redirect user back to page init login (or `redirectUri` - if specified), the state parameters could be retrieve at `loginCallback`. (loginCallback could be register by hcaSdk.setLoginCallback methods)

```js
  hcaSdk.setLoginCallback((account, state) => {
    console.log({state}); // HealthCare Authenticator
  });
```

*Note*: State parameters can only retrieve for the first time after authentication response is received by your application. (loginCallback triggered first time after user redirect back from login)

10. Use AIM feature

To use AIM feature along with HCA SDK JS, you need to:
- Load AIM JS library
```js
  <script async src="https://aim-tag.hcn.health/js/client.js?dl=aimDataLayer"></script>
```  
- Copy/Past following JS script and replace `<aimApiKey>` by you own AIM API key.
```js
  <script>
    window.aimDataLayer = window.aimDataLayer || [];
    function aimTag() { aimDataLayer.push(arguments); }
    window.addEventListener("load", function() {
      hcaSdk.initAIM(<aimApiKey>);
    }, false);
  </script>
```
Once your page is loaded, this JS script will run AIM Tag Signal function.
As soon as it captures user data, it will be processed within HCA system (e.g. create user).