"use strict";

var ctrl = require('../controllers/roles.controller');

module.exports = function (app, passport, auth) {

    // Setting up the roles api
    app.post('/api/roles/load', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.load);
    app.post('/api/roles/load-subsystems', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.loadSubSystems);
    app.post('/api/roles/create', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.create);
    app.post('/api/roles/edit', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.edit);
    app.post('/api/roles/delete', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.delete);

};
