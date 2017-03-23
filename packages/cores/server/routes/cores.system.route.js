"use strict";

var ctrl = require('../controllers/cores.system.controller');


module.exports = function (app, passport, auth) {

    // Setting up the systems api
    app.post('/api/systems/load', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.load);

};
