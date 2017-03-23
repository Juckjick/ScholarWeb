"use strict";

var ctrl = require('../controllers/cores.controller');


module.exports = function (app, passport, auth) {

    // Sign-in and Sign-out
    app.get('/signin', ctrl.signin);
    app.get('/signout', auth.requiresLogin, ctrl.signout);

    // Register page
    app.get('/register', ctrl.register);

    // Setting the local strategy route for logging in
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true,
        badRequestMessage: 'กรุณากรอกข้อมูลชื่อผู้ใช้งานและรหัสผ่าน'
    }), ctrl.session);

    // requiresRoleSubSystem function with no parameter
    // means that the request is called from the frontend
    app.post('/api/authorization/verify', auth.requiresLogin, auth.hasAuthorizationForPartial);
    app.post('/api/authorization/isscholarshipopen', auth.requiresLogin, auth.verifyIsScholarshipOpen);
    app.post('/api/authorization/load/authorized-subsystemid', auth.requiresLogin, auth.loadAuthorizationSubSystemId);

    // Partials template for angular.js
    app.get('/partials/*', ctrl.views);

    // Home route
    app.get('/', auth.requiresLogin, ctrl.render);

    // Errors
    app.get('/403', function (req, res, next) {
        var errorType = req.query.type,
            error = {
                scholarship: 'ระบบยังไม่เปิดรับสมัครทุนการศึกษา',
                authorization: 'ท่านไม่มีสิทธิในการเข้าถึงหน้าดังกล่าว'
            };
        res.status(403).render('errors/403', { error: error[errorType] });
    });

    //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        //Treat as 404
        if (~err.message.indexOf('not found')) return next();

        //Log it
        console.error(err.stack);

        //Error page
        res.status(500).render('errors/500', {
            error: err.stack
        });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('errors/404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

};
