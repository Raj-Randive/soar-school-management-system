const loader = require('./_common/fileLoaderObject.js');

module.exports = class MongoLoader {
    constructor({ schemaExtension }){
        this.schemaExtension = schemaExtension
    }

    load(){
        /** load Mongo Models */
        const models = loader(`./managers/entities/**/*.${this.schemaExtension}`);;
        return models
    }
}