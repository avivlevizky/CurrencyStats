export class BaseMiddleware {
    #debug;

    constructor(debug = false) {
        if (new.target === BaseMiddleware) {
          throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.#debug = debug;
      }

    getMiddlewareCallback() {
        throw new Error('Need to Implement getMiddlewareCallback');
    }

    printForDebug(message) {
        if (this.#debug) {
            console.log(message);
        }
    }
}