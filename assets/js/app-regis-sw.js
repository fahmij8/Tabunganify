const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("/service-worker.js", { scope: "/" })
                .then((info) => {
                    info.update();
                    console.warn("[!] Service Worker OK\n", info);
                })
                .catch((error) => {
                    console.error("[!] Service Worker Error\n", error);
                });
        });
    } else {
        console.error("[!] Service Worker Unsupported");
        alert("Please update your browser/use newest Google Chrome Browser");
    }
};

export { registerServiceWorker };
