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
                    <h1 class="preloader-title">Coming Soon</h1>
               </div>
          </div> 
     `;
     }
}

export { splashScreen };
