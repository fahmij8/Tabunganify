class splashScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
          <div class="preloader-bg" id="preloader-active">
               <div>
                    <img src="./assets/icons/logocolor-transparent.png" class="preloader-img" alt="Logo Tabunganify" />
                    <h1 class="preloader-title">Aplikasi pengelola keuangan andalan kamu</h1>
               </div>
          </div> 
     `;
    }

    destroy() {
        let getElement = document.getElementsByClassName("preloader-bg")[0];
        getElement.style.opacity = "0";
        setTimeout(() => {
            getElement.style.visibility = "hidden";
            getElement.style.display = "none";
            this.innerHTML = "";
        }, 300);
    }
}

let destroySplashScreen = () => {
    if (document.getElementById("preloader-active") !== null) {
        document.querySelector("splash-screen").destroy();
    }
};

export { splashScreen, destroySplashScreen };
