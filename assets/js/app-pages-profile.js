import { signOut } from "./app-google-connect.js";

const fillProfileElement = (googleUser) => {
    let userAvatar = googleUser.getBasicProfile().getImageUrl();
    let userNickname = googleUser.getBasicProfile().getName();
    let userMail = googleUser.getBasicProfile().getEmail();
    if (userNickname.length > 12) {
        userNickname = googleUser.getBasicProfile().getGivenName();
    }
    let userAvatarElement = document.getElementById("profile-ava");
    let userNicknameElement = document.getElementById("profile-nick");
    let userMailElement = document.getElementById("profile-mail");
    userAvatarElement.setAttribute("src", userAvatar);
    userNicknameElement.innerHTML = `${userNickname}`;
    userMailElement.innerHTML = `${userMail}`;
};

const onClickMenu = () => {
    document.querySelector("#delete-data").onclick = () => {
        console.log("Soon!1");
    };
    document.querySelector("#download-data").onclick = () => {
        console.log("Soon!2");
    };
    document.querySelector("#upload-data").onclick = () => {
        console.log("Soon!3");
    };
    document.querySelector("#info-app").onclick = () => {
        console.log("Soon!4");
    };
    document.querySelector("#log-out").onclick = () => {
        signOut();
    };
};

export { fillProfileElement, onClickMenu };
