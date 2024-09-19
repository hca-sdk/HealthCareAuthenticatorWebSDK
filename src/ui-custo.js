// Update UI - Profile
function updateUIProfile(data) {
    const profileDiv = document.getElementById("profile-div");

    const oldProfileDiv = document.getElementById('profile-info-div');
    if (oldProfileDiv) {
        oldProfileDiv.remove();
    }
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.id = "profile-info-div";
    profileDiv.appendChild(profileInfoDiv);


    const gender = document.createElement('p');
    gender.innerHTML = "<strong>Gender: </strong>" + data.gender;
    const firstname = document.createElement('p');
    firstname.innerHTML = "<strong>Firstname: </strong>" + data.firstName;
    const lastname = document.createElement('p');
    lastname.innerHTML = "<strong>Lastname: </strong>" + data.lastName;
    const email = document.createElement('p');
    email.innerHTML = "<strong>Mail: </strong>" + data.email;
    const phone = document.createElement('p');
    phone.innerHTML = "<strong>Phone: </strong>" + data.phone;
    profileInfoDiv.appendChild(gender);
    profileInfoDiv.appendChild(firstname);
    profileInfoDiv.appendChild(lastname);
    profileInfoDiv.appendChild(email);
    profileInfoDiv.appendChild(phone);
}


// Update UI - Login
function updateUILogin(account) {
    const welcomeDiv = document.getElementById("WelcomeMessage");
    const cardDiv = document.getElementById("card-div");

    cardDiv.style.display = 'initial';
    welcomeDiv.innerHTML = `UserId: ${account.idTokenClaims.userId}`;

    const trustLevel = document.createElement('p');
    trustLevel.innerHTML = "<strong>Trust Level: </strong>" + account.idTokenClaims.trustLevel;

    welcomeDiv.appendChild(trustLevel);


    // isLogged Function
    console.log("isLogged:" + hcaSdk.isAccountLogged());
}


// Update UI - Token
function updateUIToken(response) {
    const tokenDiv = document.getElementById("token-div");

    const oldAccessTokenDiv = document.getElementById('access-token-info');
    if (oldAccessTokenDiv) {
        oldAccessTokenDiv.remove();
    }
    const accessTokenDiv = document.createElement('div');
    accessTokenDiv.id = "access-token-info";
    tokenDiv.appendChild(accessTokenDiv);

    const scopes = document.createElement('p');
    scopes.innerHTML = "<strong>Access Token Acquired for Scopes: </strong>" + response.scopes;

    accessTokenDiv.appendChild(scopes);
}

function onCancel() {
    console.log("cancelled");
}

function onError(err) {
    console.log(err);
}

const listLocale = ['en-GB', 'fr-FR', 'it-IT'];
function registerLocale() {
    const currentStorage = localStorage.getItem('locale');
    if (currentStorage === 'fr-FR') {
        hcaSdk.setLabels('Se connecter', "S'enregistrer", 'Déconnectez-vous');
        hcaSdk.setLocaleParams('fr-FR')
      } else if (currentStorage === 'it-IT') {
        hcaSdk.setLabels('Accedi', 'Registrati', 'Esci');
        hcaSdk.setLocaleParams('it-IT');
      } else {
        hcaSdk.setLabels('Sign in with Onekey', 'Sign up with Onekey', 'Sign out with Onekey');
        hcaSdk.setLocaleParams('en-GB');
      }

    const countrySelect = document.querySelector("#country-select");
    if (!countrySelect) {
        return;
    }
    if (!!currentStorage && listLocale.includes(currentStorage)) {
        countrySelect.value = currentStorage;
    }
    countrySelect.addEventListener('change', function (e) {
        const newValue = e.target.value;
        localStorage.setItem('locale', newValue)
    })
}
