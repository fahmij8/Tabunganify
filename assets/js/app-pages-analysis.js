import { getData } from "./app-data.js";
import { currencyToInteger, integerToCurrency } from "./app-pages-add.js";

let predictionInitiate = async (mail) => {
    let balancePredictGraphElement = document.getElementById("balancePredictGraph").getContext("2d");
    let gradientBalance = balancePredictGraphElement.createLinearGradient(0, 0, 0, 250);
    gradientBalance.addColorStop(0, "rgb(3, 70, 242)");
    gradientBalance.addColorStop(1, "rgba(255,255,255,0)");

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
                        display: true,
                        borderDash: [13, 5],
                    },
                    ticks: {
                        display: false,
                        suggestedMin: 50,
                        suggestedMax: 100,
                    },
                },
            ],
            xAxes: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false,
                    },
                    ticks: {
                        maxTicksLimit: 31,
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
        let shownBalance = retrieveObject(balanceData);
        let shownOutcome = retrieveObject(outcomeData);
        let need = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - shownLabels[shownLabels.length - 1];
        if (shownLabels.length > 9) {
            waitBuildingModel();
            let shownPrediction = await createModel(shownBalance, need);
            integerToCurrency(shownPrediction[2], document.querySelector("#nextOutcome"));
            let labelsTarget = parseInt(shownLabels.length + shownPrediction.length) - 2;
            if (labelsTarget === new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) {
                document.querySelector("#daysPrediction").innerHTML = "Akhir Bulan";
            } else {
                document.querySelector("#daysPrediction").innerHTML = `Tanggal ${labelsTarget}`;
            }
            while (parseInt(shownLabels.length) !== labelsTarget) {
                let dateString = parseInt(shownLabels[shownLabels.length - 1]) + 1;
                shownLabels.push(dateString.toString());
                shownBalance.push(null);
            }
            while (parseInt(shownPrediction.length) !== labelsTarget) {
                shownPrediction.unshift(null);
            }
            new Chart(balancePredictGraphElement, {
                type: "line",
                data: {
                    labels: shownLabels,
                    datasets: [
                        {
                            label: `Data Bulan ${listMonth[new Date().getMonth()]}`,
                            backgroundColor: gradientBalance,
                            borderColor: "rgb(3, 70, 242)",
                            data: shownBalance,
                            pointRadius: 5,
                            pointHoverRadius: 5,
                        },
                        {
                            label: `Prediksi Bulan ${listMonth[new Date().getMonth()]}`,
                            backgroundColor: "rgb(253, 214, 206)",
                            borderColor: "rgb(249, 91, 61)",
                            data: shownPrediction,
                            pointRadius: 5,
                            pointHoverRadius: 5,
                        },
                    ],
                },
                options: globalOptions,
            });
            let outcomeAvg = 0;
            shownOutcome.forEach((outcome) => {
                outcomeAvg += outcome;
            });
            outcomeAvg /= shownOutcome.length;
            outcomeAvg = Math.floor(outcomeAvg);
            integerToCurrency(outcomeAvg, document.querySelector("#averageOutcome"));
            let indexLabel = 0;
            let predictTable = document.querySelector("#analystDetail");
            let predictTableDetail = ``;
            shownPrediction.forEach((prediction) => {
                if (prediction !== null) {
                    predictTableDetail += `
                    <tr>
                        <td>${shownLabels[indexLabel]} ${listMonth[new Date().getMonth()]}</td>
                        <td>Rp. ${integerToCurrency(prediction)}</td>
                    </tr>
                    `;
                }
                indexLabel += 1;
            });
            predictTable.innerHTML = predictTableDetail;
            finishBuildingModel();
        } else {
            insertEmptyElement();
        }
    } else {
        insertEmptyElement();
    }
};

let insertEmptyElement = () => {
    Swal.fire("Informasi", "Kamu perlu menambahkan data transaksi minimal sebanyak 10 hari untuk melihat analisis keuangan yang terprediksi", "info");
    document.querySelector("#balancePredictGraph").style.display = "none";
    document.querySelector("#balancePredictExtras").style.display = "none";
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

let waitBuildingModel = () => {
    document.querySelector("#balancePredictGraph").style.display = "none";
    document.querySelector("#balancePredictExtras").style.display = "none";
    let emptyDataElement = document.querySelectorAll(".dataEmpty");
    emptyDataElement.forEach((elements) => {
        elements.innerHTML = `
    <div class="transaction-empty">
        <img src="./assets/images/empty.png" />
        <span>Tunggu sebentar, Sistem cerdas kami sedang mengkalkulasi keuangan kamu!</span>
    </div>
    `;
    });
};

let finishBuildingModel = () => {
    document.querySelector("#balancePredictGraph").style.display = "block";
    document.querySelector("#balancePredictExtras").style.display = "block";
    let emptyDataElement = document.querySelectorAll(".dataEmpty");
    emptyDataElement.forEach((elements) => {
        elements.innerHTML = "";
    });
};

let createModel = async (retrievedData, need) => {
    // Prep model
    const model = await tf.sequential();
    model.add(
        tf.layers.simpleRNN({
            units: 128,
            recurrentInitializer: "glorotNormal",
            inputShape: [2, 1],
        })
    );
    model.add(
        tf.layers.dense({
            units: 8,
            activation: "relu",
        })
    );
    model.add(
        tf.layers.dense({
            units: 1,
        })
    );
    model.compile({
        loss: tf.losses.huberLoss,
        optimizer: "adam",
        metrics: ["mae"],
    });

    // Prep data
    let maxValue = Math.max(...retrievedData);
    let minValue = 0;
    let normalizedData = [];
    retrievedData.forEach((each) => {
        normalizedData.push((each - minValue) / (maxValue - minValue));
    });
    let ratio = Math.floor((normalizedData.length + 1) * 0.8);
    let guess = 1;
    let getValidation = () => {
        if (normalizedData.slice(ratio - guess).length < 3) {
            guess += 1;
            getValidation;
        }
        return normalizedData.slice(ratio - guess);
    };
    let trainData = normalizedData.slice(0, ratio - guess);
    let validationData = getValidation();
    let attributeAndLabel = (someArr) => {
        let keyStart = 0;
        let datasX = [];
        let datasY = [];
        while (keyStart + 3 <= someArr.length) {
            datasX.push(someArr[keyStart]);
            datasX.push(someArr[keyStart + 1]);
            datasY.push(someArr[keyStart + 2]);
            keyStart += 1;
        }
        return [datasX, datasY];
    };
    trainData = attributeAndLabel(trainData);
    let trainX = trainData[0];
    let trainY = trainData[1];
    validationData = attributeAndLabel(validationData);
    let validX = validationData[0];
    let validY = validationData[1];
    let x_train = tf.tensor3d(trainX, [trainX.length / 2, 2, 1]);
    let y_train = tf.tensor2d(trainY, [trainY.length, 1]);
    let x_test = tf.tensor3d(validX, [validX.length / 2, 2, 1]);
    let y_test = tf.tensor2d(validY, [validY.length, 1]);
    let mae = 100;
    let val_mae = 100;
    let epoch = 299;
    let history = await model.fit(x_train, y_train, { epochs: 1, yieldEvery: "epoch", validationData: [x_test, y_test] });
    while (epoch > 0) {
        history = await model.fit(x_train, y_train, { epochs: 1, yieldEvery: "epoch", validationData: [x_test, y_test] });
        mae = history.history.mae[0];
        val_mae = history.history.val_mae[0];
        epoch -= 1;
    }
    let predictionResult = normalizedData.slice(-2);
    while (predictionResult[predictionResult.length - 1] >= 0) {
        if (predictionResult.length <= need + 1) {
            let result = model.predict(tf.tensor3d(predictionResult.slice(-2), [1, 2, 1]));
            if (result.dataSync()[0] <= 0) {
                break;
            }
            predictionResult.push(result.dataSync()[0]);
        } else {
            break;
        }
    }
    let inversNormalizedData = [];
    predictionResult.forEach((number) => {
        inversNormalizedData.push(Math.ceil(number * (maxValue - minValue) + minValue));
    });
    return inversNormalizedData;
};

export { predictionInitiate };
