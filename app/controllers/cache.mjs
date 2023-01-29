import { TypeValidator } from "../utils/validators/typeValidator.mjs";


export class CacheController {
    #cacheService;
    #typeValidator;

    constructor(cacheService, typeValidator = null) {
        this.#cacheService = cacheService;
        this.#typeValidator = typeValidator || new TypeValidator();
    }

    updateTtl(request, response) {
        const newTtl = request.body.ttl;
        if (this.#typeValidator.isNumeric(newTtl)) {
            const oldTtl = this.#cacheService.getTtl();
            this.#cacheService.setTtl(newTtl);
            response.json({
                oldTtl: oldTtl,
                newTtl: newTtl
            })
        } else {
            response.status(400).json({
                error: "Invalid ttl value"
            });
        }
    }
}   