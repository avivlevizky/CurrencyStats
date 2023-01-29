import { AxiosClient } from "../utils/http/axiosClient.mjs";

export class CoinsService {
    #COINS_DATA_LIST_EXTERNAL_API = 'https://min-api.cryptocompare.com/data/all/coinlist';
    #SYMBOL_CURRENCY_EXTERNAL_API = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=';
    #CURRENCY_QUERY_PARAM = 'tsyms=USD';

    #axiosClient;

    constructor(axiosClient = null) {
        this.#axiosClient = axiosClient || new AxiosClient();
    }

    async getCoinsNames(algorithms = [], symbols = []) {
        //TODO: add error handling
        const filteredCoinsData = await this.#getFilteredCoinsData(algorithms, symbols);
        return filteredCoinsData.length > 0 ? this.#extractCoinsNames(filteredCoinsData) : [];
    }

    async getCoins(symbolCoins) {
        //TODO: add error handling
        let result = [];
        const symbolCoinsStringList = symbolCoins.join(',');
        const filteredCoinsData = await this.#getFilteredCoinsData([], symbolCoinsStringList);
    
        if (filteredCoinsData.length > 0) {
            result = await this.#getCurrencyCoinsData(filteredCoinsData, symbolCoinsStringList);
        }
        return result;
    }

    async #getFilteredCoinsData(algorithms, symbols) {
        let filteredCoinsData = [];
        const coinsDataResponse = (await this.#axiosClient.get(this.#COINS_DATA_LIST_EXTERNAL_API))?.data?.Data;
        if (coinsDataResponse) {
            const coinsData = Object.values(coinsDataResponse);
            filteredCoinsData = coinsData.filter(coinData => this.#isCoinDataMatch(coinData, algorithms, symbols));
        }
        return filteredCoinsData;
    }

    async #getCurrencyCoinsData(coinsData, symbolCoinsStringList) {
        let result = [];
        const retrieveCoinCurrencyUrl = `${this.#SYMBOL_CURRENCY_EXTERNAL_API}${symbolCoinsStringList}&${this.#CURRENCY_QUERY_PARAM}`;
        const coinCurrencyResponse = (await this.#axiosClient.get(retrieveCoinCurrencyUrl))?.data;
        if (coinCurrencyResponse) {
            result = coinsData.map(symbolCoin => {
                return {
                    id: symbolCoin.Id,
                    symbol: symbolCoin.Symbol,
                    coinName: symbolCoin.CoinName,
                    algorithm: symbolCoin.Algorithm,
                    toUSD: coinCurrencyResponse[symbolCoin.Symbol].USD,
                }
            })
        }
        return result;
    }

    #isCoinDataMatch(coinData, algorithms, symbols) {
        let result = true;
        if (algorithms.length > 0) {
            result = algorithms.includes(coinData.Algorithm);
        }
        if (result && symbols.length > 0) {
            result = symbols.includes(coinData.Symbol);
        }
        return result;
    }

    #extractCoinsNames(coinsData) {
        return coinsData.map(coinData => coinData.CoinName);
    }
}   
