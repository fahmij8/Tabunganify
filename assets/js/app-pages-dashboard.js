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

export { fillTopElement };
