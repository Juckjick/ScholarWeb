/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var path = require('path');
var walkDir = require('./config/walkdir');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config');
var auth = require('./config/middlewares/authorization');
var db = require('./config/sequelize');
var passport = require('./config/passport');

var app = express();

//Initialize Express
require('./config/express')(app, passport);

//Initialize Routes
console.log('Initializing Routes');
walkDir(config.packagesDir, function (item, itemPath) {
    // Should contain .route.js and stay in the server folder
    // Shouldn't be core.route.js because it should be required at the end
    if (item.indexOf('.route.js') > -1 && itemPath.indexOf('server') > -1 && item !== 'cores.route.js')
        require(itemPath)(app, passport, auth);
});
// Finally require cores.route
require(path.join(config.root, 'packages/cores/server/routes/cores.route.js'))(app, passport, auth);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
// var port = 80;
app.listen(port);
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;
