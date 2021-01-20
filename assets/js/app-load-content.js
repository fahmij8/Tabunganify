import { renderButton, signOut, auth2, checkExistingUser } from "./app-google-connect.js";

let timeoutDestroy;

const loadPage = (page) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (document.getElementById("preloader-active") !== null) {
                clearTimeout(timeoutDestroy); // Prevent 2 times calling timeout
                timeoutDestroy = setTimeout(() => {
                    document.querySelector("splash-screen").destroy();
                }, 500);
            }
            let content = document.querySelector(".content");
            if (xhttp.status === 200) {
                content.innerHTML = xhttp.responseText;
                if (page === "login") {
                    renderButton();
                } else if (page === "dashboard") {
                    checkExistingUser();
                }
            } else if (xhttp.status == 404) {
                content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
                content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
        }
    };
    xhttp.open("GET", `assets/pages/${page}.html`, true);
    xhttp.send();
};

const routePage = () => {
    let page = window.location.hash.substr(1);
    if (page == "") page = "login";
    loadPage(page);
};

export { routePage };
