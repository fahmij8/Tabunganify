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

export { fillProfileElement };
