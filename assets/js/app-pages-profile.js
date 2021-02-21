import { signOut } from "./app-google-connect.js";
import { localStorageCreation } from "./app-data.js";

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

const onClickMenu = (googleUser) => {
    let mail = googleUser.getBasicProfile().getEmail();
    document.querySelector("#delete-data").onclick = () => {
        Swal.fire({
            title: "<strong>Apakah kamu yakin?</strong>",
            html: "Operasi menghapus data ini tidak dapat dikembalikan",
            icon: "info",
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Ya, hapus saja",
            cancelButtonText: "Tidak sekarang",
        }).then((result) => {
            if (result.isConfirmed) {
                let errorCatch = "";
                try {
                    localStorageCreation(googleUser, "remove");
                } catch (error) {
                    errorCatch = error;
                    Swal.fire("Data gagal dihapus", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
                } finally {
                    if (errorCatch === "") {
                        Swal.fire("Data berhasil dihapus", "", "success");
                    }
                }
            }
        });
    };
    document.querySelector("#download-data").onclick = () => {
        let errorCatch = "";
        try {
            let data = localStorage.getItem(mail);
            let fileToSave = new Blob([data], {
                type: "application/json",
                name: mail,
            });
            saveAs(fileToSave, `${mail}-data_${new Date().toDateString()}_${new Date().toLocaleTimeString()}.json`);
        } catch (error) {
            errorCatch = error;
            Swal.fire("Data gagal di unduh", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
        } finally {
            if (errorCatch === "") {
                Swal.fire(
                    "Data berhasil di unduh",
                    `Untuk menggunakan di perangkat lain, unggah data tadi di perangkat lain lalu masukkan secret key berikut ini <b>${localStorage.getItem("secret")}</b>`,
                    "success"
                );
            }
        }
    };
    document.querySelector("#jsonData").onchange = (data) => {
        if (data.target.files && data.target.files[0]) {
            let reader = new FileReader();
            reader.readAsText(data.target.files[0]);
            reader.onload = async (event) => {
                Swal.fire({
                    title: "<strong>Apakah kamu yakin?</strong>",
                    html: "Operasi menimpa data yang sudah ada (bila ada)",
                    icon: "info",
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: "Ya",
                    cancelButtonText: "Tidak sekarang",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const { value: secretKey } = await Swal.fire({
                            title: "Masukkan Secret Key",
                            input: "text",
                            inputLabel: "Secret key didapatkan saat anda mengunduh data di perangkat sebelumnya",
                            inputPlaceholder: "Masukkan Secret Key",
                        });

                        if (secretKey) {
                            let errorCatch = "";
                            try {
                                localStorage.setItem("secret", secretKey);
                                localStorage.setItem(mail, event.target.result);
                            } catch (error) {
                                errorCatch = error;
                                Swal.fire("Data gagal di unggah", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
                            } finally {
                                if (errorCatch === "") {
                                    Swal.fire("Data berhasil di unggah", "", "success");
                                }
                            }
                        }
                    }
                });
            };
        }
    };
    document.querySelector("#info-app").onclick = () => {
        Swal.mixin({
            confirmButtonText: "Selanjutnya &rarr;",
            showCancelButton: false,
            cancelButtonText: "Tutup",
            progressSteps: ["1", "2", "3"],
        }).queue([
            {
                title: "Tentang kami",
                html: `
                <div class="row">
                    <div class="col s12">
                        <div class="card">
                            <div class="card-image">
                                <img src="./assets/images/Fah.png" style="height:250px;object-fit:cover;" />
                                <span class="card-title">Fahmi Jabbar</span>
                                <a class="btn-floating halfway-fab waves-effect waves-light red" href="https://www.instagram.com/fahmij8/" target="_blank"><i class="material-icons">favorite_border</i></a>
                            </div>
                            <div class="card-content">
                                <p>Ketua tim. Tech Enthusiast.</p>
                                <p style="font-size: 12px;margin-top: 5px;font-weight: 700;">Universitas Pendidikan Indonesia</p>
                            </div>
                        </div>
                    </div>`,
            },
            {
                title: "Tentang kami",
                html: `
                <div class="row">
                    <div class="col s12">
                        <div class="card">
                            <div class="card-image">
                                <img src="./assets/images/Nad.png" style="height:250px;object-fit: cover;" />
                                <span class="card-title">Nada Sadidah</span>
                                <a class="btn-floating halfway-fab waves-effect waves-light red" href="https://www.instagram.com/byedadah00/" target="_blank"><i class="material-icons">favorite_border</i></a>
                            </div>
                            <div class="card-content">
                                <p>Anggota 1. Bentar ya ditanyain dulu.</p>
                                <p style="font-size: 12px;margin-top: 5px;font-weight: 700;">Universitas Pendidikan Indonesia</p>
                            </div>
                        </div>
                    </div>`,
            },
            {
                title: "Tentang kami",
                html: `
                <div class="row">
                    <div class="col s12">
                        <div class="card">
                            <div class="card-image">
                                <img src="./assets/images/Bur.png" style="height:250px;object-fit: cover;" />
                                <span class="card-title">Nurfaridha Ariyani</span>
                                <a class="btn-floating halfway-fab waves-effect waves-light red" href="https://www.instagram.com/frwyash/" target="_blank"><i class="material-icons">favorite_border</i></a>
                            </div>
                            <div class="card-content">
                                <p>Anggota 2. Bentar ya ditanyain dulu.</p>
                                <p style="font-size: 12px;margin-top: 5px;font-weight: 700;">Universitas Pendidikan Indonesia</p>
                            </div>
                        </div>
                    </div>`,
            },
        ]);
    };
    document.querySelector("#log-out").onclick = () => {
        signOut();
    };
};

export { fillProfileElement, onClickMenu };
