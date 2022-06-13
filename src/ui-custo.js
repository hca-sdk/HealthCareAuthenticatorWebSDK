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