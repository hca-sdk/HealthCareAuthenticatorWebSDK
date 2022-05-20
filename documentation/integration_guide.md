# OneKey HCA SDK integration guide


##To install and integrate the HCA SDK within a website or JavaScript app


1. Add HCA SDK – The library can be loaded directly from our CDN. You can also download and host it by yourself. Just append the following line of code inside your HTML template. We recommend to place it at the end of the body tag to avoid blocking the website initial rendering. For example:


```html

  <body>


    <script src="https://onekeystaticdata.azureedge.net/hca/v1/onekey-hca-sdk.js"></script>

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
      hcaSdk.setHcaSdkConfig(<clientId>, 
                             [<knownAuthorities>], 
                             [<scopes>],
                             <tenantId>,
                             <policyId>,
                             <displaySignInButton>);
    </script>

  </body>

```

  The parameter <displaySignInButton> must have the value true to display the SignIn button false otherwise.


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

  - hcaSdk.isLoggedAccount() : get if a user is logged in
    
```js

  function isLogged() {
    console.log("isLogged:" + hcaSdk.isLoggedAccount());
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
