class strictScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <div class="strict-bg">
            <div class="strict-bg">
                <div>
                    <img src="/assets/icons/logocolor-transparent.png" class="strict-img" />
                    <h1 class="strict-title">Mohon maaf, layanan kami hanya tersedia pada device Handphone untuk saat ini.</h1>
                </div>
            </div>
        </div>
    `;
    }
}

export { strictScreen };
