const config                = require('./config/index.config.js');
const ManagersLoader        = require('./loaders/ManagersLoader.js');
const mongoConnection = require('./connect/mongodb.js');

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception:`)
    console.log(err, err.stack);

    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason:`, reason);
    process.exit(1)
})

// MongoDB connection
mongoConnection({
    uri: config.MONGO_URI
});


// const cache      = require('./cache/cache.dbh')({
//     prefix: config.dotEnv.CACHE_PREFIX ,
//     url: config.dotEnv.CACHE_REDIS
// });

const managersLoader = new ManagersLoader({config});
const managers = managersLoader.load();

managers.userServer.run();