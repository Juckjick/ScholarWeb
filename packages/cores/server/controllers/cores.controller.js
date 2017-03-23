/**
 * Module dependencies.
 */
var _ = require('underscore');
var userCtrl = require('../../../users/server/controllers/users.controller');

// Render SPA for angular.js
exports.render = function (req, res) {
    res.render('index', {
        user: JSON.stringify(req.user)
    });
};

// Partials template, jade format, for angular.js
exports.views = function (req, res) {
    //Get data from regex (*)
    var path = req.params['0'];
    res.render('../../../../packages/' + path + '.jade');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
    res.render('authentications/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show register form
 */
exports.register = function (req, res) {
    res.render('authentications/register', {
        title: 'Register'
    });


};

/**
 * Logout
 */
exports.signout = function (req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
    res.redirect('/');
};
