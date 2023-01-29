import { BaseMiddleware } from "./baseMiddleware.mjs";

export class AdminAuthenticatorMiddleware extends BaseMiddleware {
    #HEADER_KEY_NAME = 'x-admin-key';

    #secrets;

    constructor(secrets, debug = false) {
        super(debug);
        this.#secrets = secrets
    }

    getMiddlewareCallback() {
        return (request, response, next) => {
            this.printForDebug("Authenticating request");
            const adminKeyHeader = request.headers[this.#HEADER_KEY_NAME];
            if (!(adminKeyHeader && this.#secrets.includes(adminKeyHeader))) {
                response.status(401);
                response.send();
                return;
            }
            this.printForDebug("Authenticated")
            next();
        }
    }
}