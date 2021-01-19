class splashScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
          <div class="preloader-bg">
               <div>
                    <img src="/assets/icons/logocolor-transparent.png" class="preloader-img"></img>
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

export { splashScreen };
