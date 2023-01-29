import { CoinsService } from "../services/coins.mjs";


export class CoinsController {

    constructor(coinsService = null) {
        this.coinsService = coinsService || new CoinsService();
    }

    async getCoinNames(request, response) {
        // TODO: need to add validator
        const algorithms = request.query.algorithm?.split(',');
        const symbols = request.query.symbol?.split(',');
        const allCoinsNames = await this.coinsService.getCoinsNames(algorithms, symbols);
        response.json(allCoinsNames)
    }

    async getCoins(request, response) {
        // TODO: need to add validator
        const symbols = request.params.symbol?.split(',');
        const coinsData = await this.coinsService.getCoins(symbols);
        response.json(coinsData)
    }
}   