let graphInitiate = () => {
    Chart.defaults.global.legend.display = false;
    var ctx1 = document.getElementById("balanceGraph").getContext("2d");
    var gradient = ctx1.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgb(3, 70, 242)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    var chart1 = new Chart(ctx1, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: gradient,
                    borderColor: "rgb(3, 70, 242)",
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                },
            ],
        },

        // Configuration options go here
        options: {
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
                        ticks: {
                            beginAtZero: false,
                            stepSize: 0.1,
                        },
                    },
                ],
            },
        },
    });
};

export { graphInitiate };
