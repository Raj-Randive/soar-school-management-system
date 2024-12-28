const MiddlewareLoader = require('./MiddlewareLoader');
const MongodbLoader = require('./MongodbLoader');
const fileLoaderObject = require('./_common/fileLoaderObject');
const fileLoaderArray = require('./_common/fileLoaderArray');
const UserServer = require('../managers/http/UserServer.manager');
const utils = require('../libs/utils');

/**
 * Load and manage modules
 * @return modules tree with instance of each module
 */
module.exports = class ManagersLoader {
    constructor({ config, cache }) {
        this.managers = {};
        this.config = config;
        this.cache = cache;

        this._preload();
        this.injectable = {
            utils,
            cache,
            config,
            managers: this.managers,
        };
    }

    _preload() {
        const mongodbLoader = new MongodbLoader({
            schemaExtension: "mongoModel.js",
        });
        this.mongoModels = mongodbLoader.load();
    }

    load() {
        const middlewareLoader = new MiddlewareLoader(this.injectable);
        const middlewares = middlewareLoader.load();
        this.injectable.middlewares = middlewares;

        this.managers.userServer = new UserServer({
            config: this.config,
            managers: this.managers,
        });

        this.managers.fileLoaderObject = fileLoaderObject;
        this.managers.fileLoaderArray = fileLoaderArray;

        return this.managers;
    }
};
