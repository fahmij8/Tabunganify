let localStorageCreation = (googleUser, mode) => {
    let mail = googleUser.getBasicProfile().getEmail();
    let makeStorage = (mail) => {
        if (localStorage.getItem("secret") === null) {
            localStorage.setItem("secret", Math.random().toString(36).substring(7));
        }
        if (localStorage.getItem(mail) === null) {
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify({}), localStorage.getItem("secret"));
            localStorage.setItem(mail, encrypted.toString());
        }
    };
    if (mode === "first") {
        makeStorage(mail);
    } else {
        localStorage.removeItem("secret");
        localStorage.removeItem(googleUser.getBasicProfile().getEmail());
        makeStorage(mail);
    }
};

let encryptData = (data) => {
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), localStorage.getItem("secret"));
    return encrypted.toString();
};

let getData = (mail) => {
    let decrypted = CryptoJS.AES.decrypt(localStorage.getItem(mail), localStorage.getItem("secret"));
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};

let insertData = (mail, data) => {
    let encryptDataResult = encryptData(data);
    localStorage.setItem(mail, encryptDataResult);
};

export { localStorageCreation, insertData, getData };
