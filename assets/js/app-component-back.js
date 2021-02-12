import { routePage } from "./app-load-content.js";

const backHandler = () => {
    document.querySelector(".back-icon").onclick = () => {
        window.location.href = `./#dashboard`;
        routePage();
    };
};

export { backHandler };
