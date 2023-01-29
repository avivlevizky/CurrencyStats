import axios from 'axios';

export class AxiosClient {
    #axios;

    constructor(config = null) {
        config = config || {
            timeout: 5000,
        };
        this.#axios= axios.create(config);
    }

    async get(url) {
        console.log(`Requesting all coins names from ${url}`);
        const response = this.#axios.get(url).catch(error => {
            console.log(`Error when try to request ${url}: ${error.message}`);
            throw error;
        });
        return response
    }
}
