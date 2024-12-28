require('dotenv').config({path: "./.env"})

const pjson                            = require('../package.json');
const utils                            = require('../libs/utils');

const SERVICE_NAME                     = (process.env.SERVICE_NAME)? utils.slugify(process.env.SERVICE_NAME):pjson.name;

const USER_PORT                        = process.env.USER_PORT || 5111;
const ADMIN_PORT                       = process.env.ADMIN_PORT || 5222;
const ADMIN_URL                        = process.env.ADMIN_URL || `http://localhost:${ADMIN_PORT}`;
const ENV                              = process.env.ENV || "development";

const REDIS_URI                        = process.env.REDIS_URI || "redis://127.0.0.1:6379";
const REDIS_PORT                       = process.env.REDIS_PORT || 6379;
const REDIS_HOST                       = process.env.REDIS_HOST || "127.0.0.1";

const MONGO_URI                        = process.env.MONGO_URI || `mongodb://localhost:27017/sm`;

const LONG_TOKEN_SECRET                = process.env.LONG_TOKEN_SECRET || null;
const SHORT_TOKEN_SECRET               = process.env.SHORT_TOKEN_SECRET || null;
const JWT_SECRET                       = process.env.JWT_SECRET || null;

if(!LONG_TOKEN_SECRET || !SHORT_TOKEN_SECRET) {
    throw Error('missing .env variables check index.config');
}

config = {
    USER_PORT,
    ADMIN_PORT,
    ADMIN_URL,
    ENV,
    REDIS_URI,
    MONGO_URI,
    LONG_TOKEN_SECRET,
    SHORT_TOKEN_SECRET,
    SERVICE_NAME,
    REDIS_PORT,
    REDIS_HOST,
    JWT_SECRET
}

module.exports = config;