## Sample SDK JS 

This project is an example how to integrate the HCA SDK JS in a website

### Connection settings 
If you want to change the connection settings :

- Edit the file `.\src\index.html`
- Update the parameters in the javascript method :


    hcaSdk.setHcaSdkConfig(<clientId>, 
                           [<knownAuthorities>], 
                           [<scopes>],
                           <tenantId>,
                           <policyId>,
                           <displaySignInButton>);


### Running the sample 

- In a command prompt, run `npm install`

### Running the sample 
- In a command prompt, run `npm start`

- Navigate to http://localhost:4200 with the browser of your choice. (another port can be specified in the `server.js` file)

- In the web page, click on the "Sign In" button to begin the authentication flow.