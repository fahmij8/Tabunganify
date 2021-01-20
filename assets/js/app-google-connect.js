import { routePage } from "./app-load-content.js";
import { fillTopElement } from "./app-pages-dashboard.js";

let auth2 = gapi.auth2.init({
    client_id: "34406752556-4o4ekkabd87m3711gi3r14sv19or5rdm.apps.googleusercontent.com",
    scope: "profile email",
});

let renderButton = () => {
    gapi.load("auth2", () => {
        auth2.then(() => {
            let isSignedIn = auth2.isSignedIn.get();
            let currentUser = auth2.currentUser.get();
            if (isSignedIn == true) {
                onSignIn(currentUser);
            } else {
                auth2.attachClickHandler(document.getElementById("googleSignIn"), {}, onSignIn, onSignInError);
            }
        });
    });
};

const onSignIn = (googleUser) => {
    console.log("Signed in as " + googleUser.getBasicProfile().getName());
    // let profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId());
    // console.log("Name: " + profile.getName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());
    window.location.href = "./#dashboard";
    routePage();
};

const onSignInError = (error) => {
    console.error(JSON.stringify(error, undefined, 2));
};

const signOut = () => {
    auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log("User signed out.");
    });
};

const checkExistingUser = () => {
    setTimeout(() => {
        let currentUser = gapi.auth2.getAuthInstance().currentUser.get();
        if (currentUser.Ea === null) {
            window.location.href = "./";
            routePage();
        } else {
            fillTopElement();
        }
    }, 1000);
};

export { renderButton, signOut, auth2, checkExistingUser };
