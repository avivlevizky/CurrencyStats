import express from 'express';

//TODO: extends interface of Router with getRouter method
export class CacheRouter {
    #cacheController;
    #router;

    constructor(cacheController, router = null) {
        this.#cacheController = cacheController;
        this.#router = router || express.Router();
    }

    getRouter() {
        this.#router.post("/", async (request, response) => this.#cacheController.updateTtl(request, response));
        return this.#router;
    }
}