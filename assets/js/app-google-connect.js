import { routePage } from "./app-load-content.js";
import { fillTopElement, onClickNav } from "./app-pages-dashboard.js";
import { destroySplashScreen } from "./app-component-preloader.js";

let auth2 = gapi.auth2.init({
    client_id: "34406752556-4o4ekkabd87m3711gi3r14sv19or5rdm.apps.googleusercontent.com",
    scope: "profile email",
});

let prepLogin = () => {
    gapi.load("auth2", () => {
        auth2.then(() => {
            let isSignedIn = auth2.isSignedIn.get();
            let currentUser = auth2.currentUser.get();
            if (isSignedIn === true) {
                onSignIn(currentUser);
            } else {
                let location = window.location.hash.substr(1);
                if (location !== "") {
                    window.location.href = "./";
                    routePage();
                } else {
                    auth2.attachClickHandler(document.getElementById("googleSignIn"), {}, onSignIn, onSignInError);
                    destroySplashScreen();
                }
            }
        });
    });
};

const onSignIn = (googleUser) => {
    let location = window.location.hash.substr(1);
    if (location === "") {
        window.location.href = "./#dashboard";
        routePage();
    } else if (location === "dashboard") {
        fillTopElement(googleUser);
        onClickNav();
        destroySplashScreen();
    } else if (location === "rekapitulasi") {
        let isLoggedIn = checkExistingUser();
        destroySplashScreen();
    } else if (location === "analisis") {
        let isLoggedIn = checkExistingUser();
        destroySplashScreen();
    } else if (location === "profil") {
        let isLoggedIn = checkExistingUser();
        destroySplashScreen();
    } else {
        let isLoggedIn = checkExistingUser();
        destroySplashScreen();
    }
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
    let currentUser = gapi.auth2.getAuthInstance().currentUser.get();
    if (currentUser.Ea === null) {
        return false;
    }
    return true;
};

export { prepLogin, auth2 };
