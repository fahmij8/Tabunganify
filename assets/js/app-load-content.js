import { prepLogin } from "./app-google-connect.js";

const loadPage = (page) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            prepLogin();
            let content = document.querySelector(".content");
            if (xhttp.status === 200) {
                content.innerHTML = xhttp.responseText;
                document.querySelector(".content").style.opacity = 1;
                // if (page === "login" || page === "dashboard") {

                // }
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
    document.querySelector(".content").style.opacity = 0;
    let page = window.location.hash.substr(1);
    if (page == "") page = "login";
    setTimeout(() => loadPage(page), 300);
};

export { routePage };
