import { routePage } from "./app-load-content.js";
import { fillTopElement, onClickNav, showListTransaction } from "./app-pages-dashboard.js";
import { destroySplashScreen } from "./app-component-preloader.js";
import { backHandler } from "./app-component-back.js";
import { fillProfileElement, onClickMenu } from "./app-pages-profile.js";
import { materializeInit, formEventHandler } from "./app-pages-add.js";
import { localStorageCreation } from "./app-data.js";
import { graphInitiate } from "./app-pages-recap.js";

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
    // Local Storage Creation
    let mail = googleUser.getBasicProfile().getEmail();
    localStorageCreation(googleUser, "first");
    // Page Utilities
    let location = window.location.hash.substr(1);
    if (location === "") {
        window.location.href = "./#dashboard";
        routePage();
    } else if (location === "dashboard") {
        fillTopElement(googleUser);
        onClickNav();
        destroySplashScreen();
        showListTransaction(mail);
    } else if (location === "rekapitulasi") {
        backHandler();
        destroySplashScreen();
        graphInitiate(mail);
    } else if (location === "analisis") {
        backHandler();
        destroySplashScreen();
    } else if (location === "profil") {
        backHandler();
        fillProfileElement(googleUser);
        onClickMenu(googleUser);
        destroySplashScreen();
    } else {
        // Tambah page
        backHandler();
        destroySplashScreen();
        materializeInit(mail);
        formEventHandler(mail);
    }
};

const onSignInError = (error) => {
    console.error(JSON.stringify(error, undefined, 2));
};

const signOut = () => {
    auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        window.location.href = "./";
        routePage();
    });
};

export { prepLogin, auth2, signOut };
