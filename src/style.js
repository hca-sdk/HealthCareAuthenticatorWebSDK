export const signInBtnStyle = `
    .hca-signIn {
        -webkit-appearance: button;
        margin: 0;
        box-sizing: border-box;
        cursor: pointer;
        color: #fff;
        background-color: #343a40;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        padding: .375em .75em;
        font-size: 1em;
        line-height: 1.5;
        border-radius: .25em;
        border: 0;
        height: 2.25em;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    .hca-signIn:hover {
        background-color: #23272b;
    }
    .hca-signIn.with-logo {
        display: inline-flex;
        align-items: center;
        gap: 1.25em;
    }
    .hca-signIn .hca-signIn-logo__wrapper {
        display: inline-flex;
        position: relative;
        align-items: center;
        height: 100%;
    }
    .hca-signIn .hca-signIn-logo__wrapper::before {
        content: '';
        background-color: rgba(255, 255, 255, 0.1);
        height: calc(100% + .375em * 2);
        width: calc(100% + .75em * 2);
        position: absolute;
        left: -.75em;
        top: -.375em;
        border-radius: .25em 0 0 .25em;
    }
    .hca-signIn .hca-signIn-logo {
        height: 1em;
        width: auto;
    }
    `;
export const signUpBtnStyle = `
    .hca-signUp {
        -webkit-appearance: button;
        margin: 0;
        box-sizing: border-box;
        cursor: pointer;
        color: #fff;
        background-color: #6c757d;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        padding: .375em .75em;
        font-size: 1em;
        line-height: 1.5;
        border-radius: .25em;
        border: 0;
        height: 2.25em;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    .hca-signUp:hover {
        background-color: #5a6268;
    }
    .hca-signUp.with-logo {
        display: inline-flex;
        align-items: center;
        gap: 1.25em;
    }
    .hca-signUp .hca-signUp-logo__wrapper {
        display: inline-flex;
        position: relative;
        align-items: center;
        height: 100%;
    }
    .hca-signUp .hca-signUp-logo__wrapper::before {
        content: '';
        background-color: rgba(255, 255, 255, 0.1);
        height: calc(100% + .375em * 2);
        width: calc(100% + .75em * 2);
        position: absolute;
        left: -.75em;
        top: -.375em;
        border-radius: .25em 0 0 .25em;
    }
    .hca-signUp .hca-signUp-logo {
        height: 1em;
        width: auto;
    }
`;
export const signOutBtnStyle = `
    .hca-signOut {
        -webkit-appearance: button;
        margin: 0;
        box-sizing: border-box;
        cursor: pointer;
        color: #fff;
        background-color: #28a745;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        padding: .375em .75em;
        font-size: 1em;
        line-height: 1.5;
        border-radius: .25em;
        border: 0;
        height: 2.25em;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    .hca-signOut:hover {
        background-color: #218838;
    }
    .hca-signOut.with-logo {
        display: inline-flex;
        align-items: center;
        gap: 1.25em;
    }
    .hca-signOut .hca-signOut-logo__wrapper {
        display: inline-flex;
        position: relative;
        align-items: center;
        height: 100%;
    }
    .hca-signOut .hca-signOut-logo__wrapper::before {
        content: '';
        background-color: rgba(255, 255, 255, 0.1);
        height: calc(100% + .375em * 2);
        width: calc(100% + .75em * 2);
        position: absolute;
        left: -.75em;
        top: -.375em;
        border-radius: .25em 0 0 .25em;
    }
    .hca-signOut .hca-signOut-logo {
        height: 1em;
        width: auto;
    }
`;