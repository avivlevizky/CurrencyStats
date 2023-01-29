import express from 'express';
import { CoinsController } from "../controllers/coins.mjs";

//TODO: extends interface of Router with getRouter method
export class CoinsRouter {
    #coinsController;
    #router;

    constructor(coinsController = null, router = null) {
        this.#coinsController = coinsController || new CoinsController();
        this.#router = router || express.Router();
    }

    getRouter() {
        this.#router.get("/", async (request, response) => await this.#coinsController.getCoinNames(request, response));
        this.#router.get("/:symbol", async (request, response) => await this.#coinsController.getCoins(request, response));
        return this.#router;
    }
}