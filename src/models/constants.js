class constants {
    constructor() {
        this.httpStatus = {
            success: 200,
            badRequest: 400,
            unauthorized: 401,
            notFound: 404,
            serverError: 500
        };
    }
}

export default new constants();
