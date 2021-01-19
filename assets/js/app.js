import { registerServiceWorker } from "./app-regis-sw.js";
import { splashScreen } from "./app-component-preloader.js";
import { strictScreen } from "./app-component-strict.js";
import { routePage } from "./app-load-content.js";

// registerServiceWorker();
customElements.define("splash-screen", splashScreen);
customElements.define("strict-screen", strictScreen);
routePage();
