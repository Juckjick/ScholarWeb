var Sequelize = require('sequelize');
var _ = require('lodash');
var walkDir = require('./walkdir');
var config = require('./config');
var db = {};

console.log('Initializing Sequelize');

// create your instance of sequelize
var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    dialect: 'mysql',
    storage: config.db.storage,
    port: config.db.port,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

// Import all models
console.log('Initializing Models');
walkDir(config.packagesDir, function (item, itemPath) {
    var model;
    // Do only files contained .model.js
    if (item.indexOf('.model.js') > -1) {
        model = sequelize.import(itemPath);
        db[model.name] = model;
    }
});

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db)
    }
});

// Synchronizing any model changes with database. 
// WARNING: this will DROP your database everytime you re-run your application
sequelize
    .sync()
    .complete(function (err) {
        if (err) console.log("An error occured %j", err);
        else console.log("Database dropped and synchronized");
    });

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
