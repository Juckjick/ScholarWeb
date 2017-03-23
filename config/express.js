'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var compression = require('compression');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var methodOverride = require('method-override');
var config = require('./config');

module.exports = function(app, passport) {

    console.log('Initializing Express');

    app.set('showStackError', true);

    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Set the favicon and static folder
    app.use(favicon(config.root + '/public/img/icons/favicon.ico'));

    //Set public folders
    app.use(express.static(config.root + '/public'));
    app.use(express.static(config.root + '/packages'));
    app.use('/assets', express.static(config.root + '/bower_components'));

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/packages/cores/server/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.json({
        limit: '5mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));
    app.use(methodOverride());

    // Multer for uploading files
    app.use(multer({
        inMemory: true
    }));

    // Setup session store in mysql
    var sessionStore = new SessionStore({
        host: 'localhost',
        port: config.db.port,
        database: config.db.name,
        user: config.db.username,
        password: config.db.password
    });

    //express/mysql session storage
    app.use(session({
        secret: 'zorqFD=JbGXPBVDtwRD*Qmup2QFXY6',
        store: sessionStore,
        cookie: {
            maxAge: 60*60*1000 // an hour
        },
        resave: true,
        saveUninitialized: true,
        rolling: true
    }));

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //connect flash for flash messages, should be below all the session()
    app.use(flash());

    //set local variables of the entire application
    app.locals.jsLibFiles = config.assets.lib.js;
    app.locals.cssLibFiles = config.assets.lib.css;
    app.locals.jsSmsFiles = config.assets.sms.js;
};
