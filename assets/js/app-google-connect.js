import { routePage } from "./app-load-content.js";
import { fillTopElement, onClickNav } from "./app-pages-dashboard.js";
import { destroySplashScreen } from "./app-component-preloader.js";
import { backHandler } from "./app-component-back.js";
import { fillProfileElement, onClickMenu } from "./app-pages-profile.js";

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
        onClickMenu();
        destroySplashScreen();
    } else {
        // Tambah page
        backHandler();
        destroySplashScreen();
        // Select init
        let select = document.querySelectorAll("select");
        M.FormSelect.init(select);
        // Chips init
        let chips = document.querySelectorAll(".chips");
        M.Chips.init(chips, {
            autocompleteOptions: {
                data: {
                    Apple: null,
                    Microsoft: null,
                    Google: null,
                },
                limit: 1,
            },
            placeholder: "Kategori",
            secondaryPlaceholder: " ",
            limit: 1,
        });
        //  Picker init
        let datePicker = document.querySelectorAll(".datepicker");
        M.Datepicker.init(datePicker);
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
