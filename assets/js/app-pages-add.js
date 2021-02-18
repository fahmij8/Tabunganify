import { routePage } from "./app-load-content.js";
const materializeInit = (mail) => {
    let select = document.querySelectorAll("select");
    M.FormSelect.init(select);
    // Category Init
    let data = JSON.parse(localStorage.getItem(mail));
    let listCategory = {};
    if (data[new Date().getFullYear().toString()] !== undefined) {
        Object.values(data).forEach((month) => {
            Object.values(month).forEach((day) => {
                Object.values(day).forEach((kind) => {
                    Object.values(kind).forEach((time) => {
                        Object.values(time).forEach((detail) => {
                            if (listCategory[detail.category] === undefined) {
                                listCategory[detail.category] = null;
                            }
                        });
                    });
                });
            });
        });
    }

    // Chips init
    let chips = document.querySelectorAll(".chips");
    M.Chips.init(chips, {
        autocompleteOptions: {
            data: listCategory,
            limit: 1,
        },
        placeholder: "Kategori",
        secondaryPlaceholder: " ",
        limit: 1,
    });
    //  Picker init
    let datePicker = document.querySelectorAll(".datepicker");
    M.Datepicker.init(datePicker, {
        format: "dd mmmm yyyy",
        defaultDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        setDefaultDate: true,
        i18n: {
            cancel: "Batal",
            clear: "Hapus",
            done: "Pilih",
            months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
        },
    });
};

const formEventHandler = (mail) => {
    let elementAmount = document.querySelector("#amount");
    let elementName = document.querySelector("#name");
    let elementKind = document.querySelector("#kind");
    let elementCategory = document.querySelector("#category");
    let elementDate = document.querySelector("#date");
    let buttonChecker = document.querySelector("#submit");
    // Currency conversion
    elementAmount.addEventListener("keyup", () => {
        integerToCurrency(elementAmount.value, elementAmount);
    });
    // Empty form handler
    buttonChecker.addEventListener("click", (event) => {
        let countInvalid = 0;
        if (elementName.value === "") {
            countInvalid += 1;
            elementName.classList.add("invalid");
        }
        if (elementAmount.value === "") {
            countInvalid += 1;
            elementAmount.classList.add("invalid");
        }
        if (elementKind.value === "") {
            countInvalid += 1;
            document.querySelector(".select-wrapper").classList.add("invalid");
            setTimeout(() => {
                document.querySelector(".select-wrapper").classList.remove("invalid");
            }, 5000);
        }
        if (elementCategory.M_Chips.chipsData.length == 0) {
            countInvalid += 1;
            document.querySelector(".red-text").classList.remove("hide");
            setTimeout(() => {
                document.querySelector(".red-text").classList.add("hide");
            }, 5000);
        }
        if (elementDate.value === "") {
            countInvalid += 1;
            elementDate.classList.add("invalid");
        }

        if (countInvalid === 0) {
            let dateSet = elementDate.value.split(" ");
            let year = dateSet[2];
            let month = new Date(Date.parse(dateSet[1] + " 1, 2012")).getMonth() + 1;
            let day = dateSet[0];
            let exactTime = new Date().getTime();
            let data = JSON.parse(localStorage.getItem(mail));
            if (data[year] === undefined) {
                data[year] = {};
            }
            if (data[year][month] === undefined) {
                data[year][month] = {};
            }
            if (data[year][month][day] === undefined) {
                data[year][month][day] = {};
                if (elementKind.value == 1) {
                    createDetailedData("Pemasukan", exactTime, day, month, year, data, elementName, elementAmount, elementCategory);
                } else {
                    createDetailedData("Pengeluaran", exactTime, day, month, year, data, elementName, elementAmount, elementCategory);
                }
            } else {
                if (elementKind.value == 1) {
                    createDetailedData("Pemasukan", exactTime, day, month, year, data, elementName, elementAmount, elementCategory);
                } else {
                    createDetailedData("Pengeluaran", exactTime, day, month, year, data, elementName, elementAmount, elementCategory);
                }
            }
            let errorCatch = "";
            try {
                localStorage.setItem(mail, JSON.stringify(data));
            } catch (error) {
                errorCatch = error;
                Swal.fire("Data gagal tersimpan", `${error}\nSilahkan hubungi pengembang untuk melaporkan masalah ini`, "error");
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
                        title: "Data telah ditambahkan",
                    });
                    setTimeout(() => {
                        window.location.href = "./#dashboard";
                        routePage();
                    }, 1000);
                }
            }
        }
    });
};

let createDetailedData = (type, exactTime, day, month, year, data, elementName, elementAmount, elementCategory) => {
    if (data[year][month][day][type] === undefined) {
        data[year][month][day][type] = {};
        data[year][month][day][type][exactTime] = {};
        data[year][month][day][type][exactTime]["name"] = elementName.value;
        data[year][month][day][type][exactTime]["amount"] = elementAmount.value;
        data[year][month][day][type][exactTime]["category"] = elementCategory.M_Chips.chipsData[0].tag;
    } else {
        data[year][month][day][type][exactTime] = {};
        data[year][month][day][type][exactTime]["name"] = elementName.value;
        data[year][month][day][type][exactTime]["amount"] = elementAmount.value;
        data[year][month][day][type][exactTime]["category"] = elementCategory.M_Chips.chipsData[0].tag;
    }
};

let integerToCurrency = (value, element = null) => {
    let number_string = value.replace(/[^,\d]/g, "").toString(),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    if (element !== null) {
        element.value = "Rp. " + rupiah;
    }
    return;
};

let currencyToInteger = (value) => {
    let toRemove = value.toLocaleString("ID").match(/(\D+)/g);
    let currency = value;
    if (currency.length > 3) {
        toRemove.forEach((element) => {
            currency = currency.split(element).join("");
        });
        return currency;
    }
    return;
};

export { materializeInit, formEventHandler };
