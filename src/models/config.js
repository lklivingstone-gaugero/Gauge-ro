class config {
    constructor() {
        this.port = process.env.PORT;
    }
}

export default new config();
