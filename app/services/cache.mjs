import { TypeValidator } from "../utils/validators/typeValidator.mjs";

export class CacheService {
    #ttl;
    #cache;
    #typeValidator;

    constructor(ttl = 60000, typeValidator = null) {
        this.#ttl = ttl;
        this.#cache = new Map();
        this.#typeValidator = typeValidator || new TypeValidator();
    }

    get(key) {
        let resultValue = null;
        if (this.#cache.has(key)) {
            const [value, existTtl] = this.#cache.get(key);
            if (existTtl + this.#ttl >= Date.now()) {
                this.set(key, value);
                resultValue = value;
            } else {
                this.#cache.delete(key);
            }
        }
        return resultValue;
    }

    set(key, value) {
        this.#cache.set(key, [value, Date.now()]);
    }

    getTtl() {
        return this.#ttl;
    }

    setTtl(ttl) {
        if (this.#typeValidator.isNumeric(ttl)) {
            this.#ttl = ttl;
        } else {
            throw new Error('ttl must be a number');
        }
    }
}