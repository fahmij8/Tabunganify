import { routePage } from "./app-load-content.js";
import { getData, insertData } from "./app-data.js";
import { currencyToInteger, integerToCurrency } from "./app-pages-add.js";

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

    let totalIncomeElement = document.querySelector("#transactionIn");
    let totalOutcomeElement = document.querySelector("#transactionOut");
    let totalBalanceElement = document.querySelector("#transactionBalance");

    let notifIcon = document.querySelector("#icon-bell");
    notifIcon.onclick = () => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "info",
            title: "Belum ada notifikasi",
        });
    };

    let data = getData(googleUser.getBasicProfile().getEmail());
    let kinds;
    let totalIncome = 0;
    let totalOutcome = 0;
    let totalBalance = 0;
    if (data[new Date().getFullYear().toString()] !== undefined) {
        Object.values(data).forEach((month) => {
            Object.entries(month).forEach((day) => {
                let currentMonth = parseInt(day[0]);
                Object.values(day[1]).forEach((kind) => {
                    Object.entries(kind).forEach((time) => {
                        kinds = time[0];
                        Object.values(time[1]).forEach((detail) => {
                            let amount = currencyToInteger(detail.amount);
                            if (currentMonth === new Date().getMonth() + 1) {
                                if (kinds === "Pemasukan") {
                                    totalIncome += amount;
                                } else {
                                    totalOutcome += amount;
                                }
                            }
                        });
                    });
                });
            });
        });
    }
    totalBalance = totalIncome - totalOutcome;
    totalIncome = integerToCurrency(totalIncome.toString(), totalIncomeElement);
    totalOutcome = integerToCurrency(totalOutcome.toString(), totalOutcomeElement);
    totalBalance = integerToCurrency(totalBalance.toString(), totalBalanceElement);
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
    let data = getData(mail);
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
                                                let time = timeAndData[0];
                                                let amount;
                                                let color;
                                                let icon;
                                                let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                                                if (actualKind == "Pengeluaran") {
                                                    amount = "-" + timeAndData[1].amount;
                                                    color = "red";
                                                    icon = "<i class='bx bx-basket'></i>";
                                                    if (
                                                        timeAndData[1].category.toUpperCase() === "MEDIS" ||
                                                        timeAndData[1].category.toUpperCase() === "OBAT" ||
                                                        timeAndData[1].category.toUpperCase() === "BEROBAT"
                                                    ) {
                                                        icon = "<i class='bx bx-plus-medical' ></i>";
                                                    } else if (timeAndData[1].category.toUpperCase() === "BELANJA" || timeAndData[1].category.toUpperCase() === "JAJAN") {
                                                        icon = "<i class='bx bx-basket'></i>";
                                                    } else if (timeAndData[1].category.toUpperCase() === "MAKANAN" || timeAndData[1].category.toUpperCase() === "MAKAN") {
                                                        icon = "<i class='bx bx-dish'></i>";
                                                    } else if (timeAndData[1].category.toUpperCase() === "MINUMAN" || timeAndData[1].category.toUpperCase() === "NGOPI") {
                                                        icon = "<i class='bx bxs-coffee'></i>";
                                                    } else if (
                                                        timeAndData[1].category.toUpperCase() === "TAGIHAN" ||
                                                        timeAndData[1].category.toUpperCase() === "HUTANG" ||
                                                        timeAndData[1].category.toUpperCase() === "CICILAN"
                                                    ) {
                                                        icon = "<i class='bx bxs-shopping-bags'></i>";
                                                    } else if (timeAndData[1].category.toUpperCase() === "ASURANSI") {
                                                        icon = "<i class='bx bx-shield-quarter'></i>";
                                                    } else if (
                                                        timeAndData[1].category.toUpperCase() === "TRANSPORTASI" ||
                                                        timeAndData[1].category.toUpperCase() === "MOBIL" ||
                                                        timeAndData[1].category.toUpperCase() === "MOTOR"
                                                    ) {
                                                        icon = "<i class='bx bxs-car-mechanic'></i>";
                                                    } else if (timeAndData[1].category.toUpperCase() === "DONASI" || timeAndData[1].category.toUpperCase() === "SEDEKAH") {
                                                        color = "blue";
                                                        icon = "<i class='bx bxs-donate-heart'></i>";
                                                    }
                                                } else {
                                                    amount = timeAndData[1].amount;
                                                    color = "green";
                                                    icon = "<i class='bx bx-dollar'></i>";
                                                }
                                                html += `
                                                        <tr data-year="${actualYear}" data-month="${actualMonth}" data-day="${actualDay}" data-time="${time}" data-kind="${actualKind}">
                                                            <td class="valign-wrapper" style="padding: 0px">
                                                                <a class="btn-floating btn-medium waves-effect waves-light ${color}" style="min-width: 40px;">${icon}</a>
                                                                <div>
                                                                    <h4 class="transaction-name">${timeAndData[1].name}</h4>
                                                                    <p class="transaction-date">${actualDay} ${month[actualMonth - 1]} ${actualYear}</p>
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
        document.querySelectorAll("tr").forEach((rows) => {
            rows.onclick = () => {
                Swal.fire({
                    title: "Pilih operasi untuk data yang anda pilih",
                    icon: "question",
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Edit data",
                    cancelButtonText: "Hapus data",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        M.Modal.init(document.querySelector(".modal"), {
                            dismissible: false,
                            onOpenStart: () => {
                                document.querySelector("#name").value =
                                    data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")][rows.getAttribute("data-kind")][
                                        rows.getAttribute("data-time")
                                    ].name;
                                document.querySelector("label[for='name']").classList.add("active");
                                let elementAmount = document.querySelector("#amount");
                                elementAmount.addEventListener("keyup", () => {
                                    integerToCurrency(elementAmount.value, elementAmount);
                                });
                            },
                            onCloseEnd: () => {
                                let errorCatch = "";
                                try {
                                    data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")][rows.getAttribute("data-kind")][
                                        rows.getAttribute("data-time")
                                    ].name = document.querySelector("#name").value;
                                    data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")][rows.getAttribute("data-kind")][
                                        rows.getAttribute("data-time")
                                    ].amount = document.querySelector("#amount").value;
                                    insertData(mail, data);
                                } catch (error) {
                                    errorCatch = error;
                                    Swal.fire("Data gagal di hapus", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
                                } finally {
                                    if (errorCatch === "") {
                                        const Toast = Swal.mixin({
                                            toast: true,
                                            position: "top-end",
                                            showConfirmButton: false,
                                            timer: 3000,
                                            timerProgressBar: true,
                                            didOpen: (toast) => {
                                                toast.addEventListener("mouseenter", Swal.stopTimer);
                                                toast.addEventListener("mouseleave", Swal.resumeTimer);
                                            },
                                        });

                                        Toast.fire({
                                            icon: "success",
                                            title: "Data telah dirubah",
                                        });
                                        routePage();
                                    }
                                }
                            },
                            endingTop: "20%",
                        });
                        M.Modal.getInstance(document.querySelector(".modal")).open();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        let errorCatch = "";
                        try {
                            delete data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")][rows.getAttribute("data-kind")][rows.getAttribute("data-time")];
                            delete data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")][rows.getAttribute("data-kind")];
                            delete data[rows.getAttribute("data-year")][rows.getAttribute("data-month")][rows.getAttribute("data-day")];
                            insertData(mail, data);
                        } catch (error) {
                            errorCatch = error;
                            Swal.fire("Data gagal di hapus", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
                        } finally {
                            if (errorCatch === "") {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "top-end",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener("mouseenter", Swal.stopTimer);
                                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                                    },
                                });

                                Toast.fire({
                                    icon: "success",
                                    title: "Data telah dihapus",
                                });
                                routePage();
                            }
                        }
                    }
                });
            };
        });
    }
};

export { fillTopElement, onClickNav, showListTransaction };
