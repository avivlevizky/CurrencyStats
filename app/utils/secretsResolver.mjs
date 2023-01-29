import Promise from 'bluebird';
import fs from 'fs';

export class SecretsResolver {
    #secretsFilePath;
    #asyncFs;
    
    constructor(secretsFilePath, asyncFs = null) {
        this.#secretsFilePath = secretsFilePath;
        this.#asyncFs = asyncFs || Promise.promisifyAll(fs);
    }

    async getSecrets() {
        const secretsContent = await this.#asyncFs.readFileAsync(this.#secretsFilePath);
        return secretsContent.toString().split("\n");
    }
}
