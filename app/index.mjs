import express from 'express';
import bodyParser from 'body-parser';

import { CacheMiddleware } from './middlewares/cache.mjs';
import { CoinsRouter } from './routes/coins.mjs';
import { CacheRouter } from './routes/cache.mjs';
import { CacheController } from './controllers/cache.mjs';
import { CacheService } from './services/cache.mjs';
import { SecretsResolver } from "./utils/secretsResolver.mjs";
import { AdminAuthenticatorMiddleware } from './middlewares/adminAuthenticator.mjs';

const DEFAULT_SECRETS_FILE_PATH = 'app/secrets/admin-key';
const IS_DEBUG_MODE = false;

const { SERVER_PORT: port = 5010 } = process.env;
const app = express();

// authentication
const secretsResolver = new SecretsResolver(DEFAULT_SECRETS_FILE_PATH);
const secrets = await secretsResolver.getSecrets();
const adminAuthenticatorMiddleware = new AdminAuthenticatorMiddleware(secrets, IS_DEBUG_MODE)

// cache
const cacheService = new CacheService();
const cacheMiddleware = new CacheMiddleware(cacheService, IS_DEBUG_MODE);

// TODO: move to a new middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const coinsRouter = new CoinsRouter();
app.use('/coins', [cacheMiddleware.getMiddlewareCallback(), coinsRouter.getRouter()]);

const cacheController = new CacheController(cacheService);
const cacheRouter = new CacheRouter(cacheController);
app.use('/cachettl', [adminAuthenticatorMiddleware.getMiddlewareCallback(), cacheRouter.getRouter()]);

app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${port}`);
});