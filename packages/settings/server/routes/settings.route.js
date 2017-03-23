"use strict";

var ctrl = require('../controllers/settings.academicyear.controller');


module.exports = function (app, passport, auth) {
    app.post('/api/settings/academicyear/load', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.load);
    app.post('/api/settings/academicyear/upsert', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.upsert);
    app.post('/api/settings/academicyear/delete', auth.requiresLogin, auth.hasAuthorizationForApi, ctrl.delete);
};
