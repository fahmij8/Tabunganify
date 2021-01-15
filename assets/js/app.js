import { registerServiceWorker } from "./app-regis-sw.js";
import { splashScreen } from "./app-component-preloader.js";

// registerServiceWorker();
customElements.define("splash-screen", splashScreen);
