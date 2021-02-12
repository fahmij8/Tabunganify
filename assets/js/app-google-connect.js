import { routePage } from "./app-load-content.js";
import { fillTopElement, onClickNav } from "./app-pages-dashboard.js";
import { destroySplashScreen } from "./app-component-preloader.js";
import { backHandler } from "./app-component-back.js";
import { fillProfileElement } from "./app-pages-profile.js";

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
        backHandler();
        destroySplashScreen();
    } else if (location === "analisis") {
        backHandler();
        destroySplashScreen();
    } else if (location === "profil") {
        backHandler();
        fillProfileElement(googleUser);
        destroySplashScreen();
    } else {
        // Tambah page
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

export { prepLogin, auth2 };
