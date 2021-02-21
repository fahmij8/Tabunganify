import { getData } from "./app-data.js";
import { currencyToInteger, integerToCurrency } from "./app-pages-add.js";

let graphInitiate = (mail) => {
    // Element initiate
    let balanceGraphElement = document.getElementById("balanceGraph").getContext("2d");
    let incomeGraphElement = document.getElementById("incomeGraph").getContext("2d");
    let outcomeGraphElement = document.getElementById("outcomeGraph").getContext("2d");

    // Gradient color
    let gradientBalance = balanceGraphElement.createLinearGradient(0, 0, 0, 250);
    gradientBalance.addColorStop(0, "rgb(3, 70, 242)");
    gradientBalance.addColorStop(1, "rgba(255,255,255,0)");
    let gradientIncome = incomeGraphElement.createLinearGradient(0, 0, 0, 250);
    gradientIncome.addColorStop(0, "rgb(3, 70, 242)");
    gradientIncome.addColorStop(1, "rgba(255,255,255,0)");
    let gradientOutcome = outcomeGraphElement.createLinearGradient(0, 0, 0, 250);
    gradientOutcome.addColorStop(0, "rgb(3, 70, 242)");
    gradientOutcome.addColorStop(1, "rgba(255,255,255,0)");

    // Global Options Chart
    let listMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    let globalOptions = {
        tooltips: {
            mode: "single",
            callbacks: {
                label: (tooltipItems) => {
                    let converted = integerToCurrency(tooltipItems.yLabel.toString());
                    return `Tanggal ${tooltipItems.xLabel} : Rp. ${converted}`;
                },
                title: () => {
                    return `Bulan ${listMonth[new Date().getMonth()]}`;
                },
            },
        },
        legend: {
            display: true,
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        scales: {
            yAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            ],
            xAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        display: false,
                    },
                },
            ],
        },
    };

    // Retrieve Data
    let data = getData(mail);
    let label = [];
    let balanceData = [];
    let incomeData = [];
    let outcomeData = [];
    if (data[new Date().getFullYear().toString()] !== undefined) {
        Object.values(data).forEach((month) => {
            Object.entries(month).forEach((day) => {
                let tempBalance = 0;
                let month = day[0];
                let monthLabel = [];
                let monthBalance = [];
                let monthIncome = [];
                let monthOutcome = [];
                Object.entries(day[1]).forEach((kind) => {
                    let tempDay = kind[0];
                    let tempIncome = 0;
                    let tempOutcome = 0;
                    Object.entries(kind[1]).forEach((time) => {
                        let kinds = time[0];
                        Object.values(time[1]).forEach((detail) => {
                            let amount = currencyToInteger(detail.amount);
                            if (kinds === "Pemasukan") {
                                tempIncome += amount;
                            } else {
                                tempOutcome += amount;
                            }
                        });
                    });
                    tempBalance = tempIncome - tempOutcome;
                    if (monthBalance.length !== 0) {
                        tempBalance += monthBalance[monthBalance.length - 1];
                    }
                    monthBalance.push(tempBalance);
                    monthIncome.push(tempIncome);
                    monthOutcome.push(tempOutcome);
                    monthLabel.push(tempDay);
                });
                balanceData.push({ [month]: monthBalance });
                incomeData.push({ [month]: monthIncome });
                outcomeData.push({ [month]: monthOutcome });
                label.push({ [month]: monthLabel });
            });
        });
        // Showing this month chart
        let retrieveObject = (objects) => {
            let toReturn;
            Object.values(objects).forEach((data) => {
                Object.entries(data).forEach((datas) => {
                    if (parseInt(datas[0]) === new Date().getMonth() + 1) {
                        toReturn = datas[1];
                    }
                });
            });
            return toReturn;
        };
        let shownLabels = retrieveObject(label);
        let shownIncome = retrieveObject(incomeData);
        let shownOutcome = retrieveObject(outcomeData);
        let shownBalance = retrieveObject(balanceData);
        let listMonth = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        if (shownLabels.length > 4) {
            new Chart(balanceGraphElement, {
                type: "line",
                data: {
                    labels: shownLabels,
                    datasets: [
                        {
                            label: `Bulan ${listMonth[new Date().getMonth()]}`,
                            backgroundColor: gradientBalance,
                            borderColor: "rgb(3, 70, 242)",
                            data: shownBalance,
                        },
                    ],
                },
                options: globalOptions,
            });
            new Chart(incomeGraphElement, {
                type: "line",
                data: {
                    labels: shownLabels,
                    datasets: [
                        {
                            label: `Bulan ${listMonth[new Date().getMonth()]}`,
                            backgroundColor: gradientBalance,
                            borderColor: "rgb(3, 70, 242)",
                            data: shownIncome,
                        },
                    ],
                },
                options: globalOptions,
            });
            new Chart(outcomeGraphElement, {
                type: "line",
                data: {
                    labels: shownLabels,
                    datasets: [
                        {
                            label: `Bulan ${listMonth[new Date().getMonth()]}`,
                            backgroundColor: gradientBalance,
                            borderColor: "rgb(3, 70, 242)",
                            data: shownOutcome,
                        },
                    ],
                },
                options: globalOptions,
            });
        } else {
            insertEmptyElement();
        }
    } else {
        insertEmptyElement();
    }
};

let insertEmptyElement = () => {
    document.querySelector("#balanceGraph").style.height = "0px";
    document.querySelector("#incomeGraph").style.height = "0px";
    document.querySelector("#outcomeGraph").style.height = "0px";
    let emptyDataElement = document.querySelectorAll(".dataEmpty");
    emptyDataElement.forEach((elements) => {
        elements.innerHTML = `
    <div class="transaction-empty">
        <img src="./assets/images/empty.png" />
        <span>Datanya kurang banyak, Yuk tambahkan dulu datanya!</span>
    </div>
    `;
    });
};

export { graphInitiate };
