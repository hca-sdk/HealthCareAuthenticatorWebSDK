## Sample SDK JS 

This project is an example how to integrate the HCA SDK JS in a website

### Connection settings 
If you want to change the connection settings :

- Edit the file `./index.html` and `./dashboard.html` and `./expired-link.html`
- Update the parameters in the javascript method :


    hcaSdk.setHcaSdkConfig(<clientId>);


### Install dependencies sample 
- Make sure NodeJs has been installed already
- In a command prompt, run `npm install`

### Running the sample 
- In a command prompt, run `npm start` (to start with Express server) or run `npm run dev` (to start with Vite server)

- Navigate to http://localhost:8080 with the browser of your choice. (another port can be specified in the `server.js` file for Express server or `vite.config.js` for Vite server)

- In the web page, click on the "Sign In" button to begin the authentication flow.

### Build Static Website
- To build static site content, run `npm run build`. The static site content would be placed in `dist/` folder

