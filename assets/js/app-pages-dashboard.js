import { routePage } from "./app-load-content.js";

const fillTopElement = (googleUser) => {
    let userAvatar = googleUser.getBasicProfile().getImageUrl();
    let userNickname = googleUser.getBasicProfile().getName();
    if (userNickname.length > 12) {
        userNickname = googleUser.getBasicProfile().getGivenName();
    }
    let userAvatarElement = document.getElementById("user-ava");
    let userNicknameElement = document.getElementById("user-nick");
    userAvatarElement.setAttribute("src", userAvatar);
    userNicknameElement.innerHTML = `${userNickname}`;
};

const onClickNav = () => {
    onClickAdd();
    document.querySelectorAll("body > div > div.dash-bottom > div.dash-navbar a").forEach((link) => {
        link.onclick = () => {
            let linklen = link.href.split("/");
            window.location.href = `./${linklen[linklen.length - 1]}`;
            routePage();
        };
    });
};

const onClickAdd = () => {
    document.querySelector(".dash-fab").onclick = () => {
        window.location.href = "./#tambah";
        routePage();
    };
};

export { fillTopElement, onClickNav };
