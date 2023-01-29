import { BaseMiddleware } from "./baseMiddleware.mjs";

export class CacheMiddleware extends BaseMiddleware{
    #cacheService;

    constructor(cacheService, debug = false) {
        super(debug);
        this.#cacheService = cacheService;
    }

    getMiddlewareCallback() {
        return (request, response, next) => {
            const url = request.url;
            const responseValue = this.#cacheService.get(url);
            if (responseValue) {
                this.printForDebug(`Cache hit for ${url}`);
                response.json(responseValue);
                return;
            } else {
                this.printForDebug(`Cache miss for ${url}`);
                response.sendResponse = response.json;
                response.json = (resultBody) => {
                    this.#cacheService.set(url, resultBody);
                    response.sendResponse(resultBody);
                };
            }
            next();
        }
    }
}