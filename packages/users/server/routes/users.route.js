"use strict";

var ctrl = require('../controllers/users.controller');

module.exports = function (app, passport, auth) {

    // Setting up the users api
    app.post('/api/users/load', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.load);
    app.post('/api/users/load-roles', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.loadRoles);
    app.post('/api/users/create', auth.requiresLogin, auth.hasAuthorizationForApi,ctrl.create);
    app.post('/api/users/create_x', ctrl.create_x);
    app.post('/api/users/edit', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.edit);
    app.post('/api/users/update/profile', auth.requiresLogin, ctrl.updateProfile);
    app.post('/api/users/delete', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.delete);

};
