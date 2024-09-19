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
            <div id="hcaSdk">
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
        <redirectUrl>
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

  The Parameter `&lt;expiredUrl&gt;` could be filled with url link, which to be redirected to, when Magic-link has expired.

  The Parameter `&lt;redirectUrl&gt;` could be filled with url link, which to be redirected to, after user logged in.

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
  - hcaSdk.setLabels(<signInButtonLabel>, <signUpButtonLabel>, <signOutButtonLabel>): For customizing labels of sign in, sign-up and sign-out buttons

```js
  hca.setLabels('Sign-in', 'Sign-up', 'Sign-out')
```

7. Customize locale params:
  - hcaSdk.setLocaleParams(<localeString>): allows to specify the language or regional settings (locale) for the HCA’s sign-in / sign-up page
page

```js
  hca.setLocaleParams('en-GB')
```
