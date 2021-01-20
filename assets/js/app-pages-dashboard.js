import { auth2 } from "./app-google-connect.js";

const fillTopElement = () => {
    let userAvatar = auth2.currentUser.get().getBasicProfile().getImageUrl();
    let userNickname = auth2.currentUser.get().getBasicProfile().getName();
    let userAvatarElement = document.getElementById("user-ava");
    let userNicknameElement = document.getElementById("user-nick");
    userAvatarElement.setAttribute("src", userAvatar);
    userNicknameElement.innerHTML = `${userNickname}`;
};

export { fillTopElement };
