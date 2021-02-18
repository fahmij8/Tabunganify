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

const showListTransaction = (mail) => {
    let data = JSON.parse(localStorage.getItem(mail));
    let transactionListElement = document.querySelector(".transaction-list");
    if (data[new Date().getFullYear().toString()] === undefined) {
        transactionListElement.innerHTML = `
            <div class="transaction-empty">
                <img src="./assets/images/empty.png" />
                <span>Belum ada data, Yuk tambahkan dulu datanya!</span>
            </div>
        `;
    } else {
        let html = `
            <table class="striped highlight">
                <tbody>
        `;
        let actualDay;
        let actualMonth;
        let actualYear;
        let actualKind;
        Object.entries(data)
            .reverse()
            .forEach((yearAndData) => {
                actualYear = yearAndData[0];
                Object.entries(yearAndData[1])
                    .reverse()
                    .forEach((monthAndData) => {
                        actualMonth = monthAndData[0];
                        Object.entries(monthAndData[1])
                            .reverse()
                            .forEach((dayAndData) => {
                                actualDay = dayAndData[0];
                                Object.entries(dayAndData[1])
                                    .reverse()
                                    .forEach((kindAndData) => {
                                        actualKind = kindAndData[0];
                                        Object.entries(kindAndData[1])
                                            .reverse()
                                            .forEach((timeAndData) => {
                                                let amount;
                                                let color;
                                                let icon;
                                                let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                                                if (actualKind == "Pengeluaran") {
                                                    amount = "-" + timeAndData[1].amount;
                                                    color = "red";
                                                    icon = "<i class='bx bx-basket'></i>";
                                                    if (timeAndData[1].category === "Medis" || timeAndData[1].category === "Obat") {
                                                        icon = "<i class='bx bx-plus-medical' ></i>";
                                                    } else if (timeAndData[1].category === "Belanja") {
                                                        icon = "<i class='bx bxs-shopping-bags'></i>";
                                                    } else if (timeAndData[1].category === "Makanan") {
                                                        icon = "<i class='bx bx-dish'></i>";
                                                    }
                                                } else {
                                                    amount = timeAndData[1].amount;
                                                    color = "green";
                                                    icon = "<i class='bx bx-dollar'></i>";
                                                }
                                                html += `
                                                        <tr>
                                                            <td class="valign-wrapper" style="padding: 0px">
                                                                <a class="btn-floating btn-medium waves-effect waves-light ${color}" style="min-width: 40px;">${icon}</a>
                                                                <div>
                                                                    <h4 class="transaction-name">${timeAndData[1].name}</h4>
                                                                    <p class="transaction-date">${actualDay} ${month[actualMonth]} ${actualYear}</p>
                                                                </div>
                                                            </td>
                                                            <td class="transaction-amount">${amount}</td>
                                                        </tr>
                                                        `;
                                            });
                                    });
                            });
                    });
            });
        html += `
                </tbody>
            </table>
        `;
        document.querySelector(".transaction-list").innerHTML = html;
    }
};

export { fillTopElement, onClickNav, showListTransaction };
