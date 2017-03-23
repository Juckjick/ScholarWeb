'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var async = require('async');
var _ = require('lodash');

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'กรุณาล็อกอินเพื่อเข้าสู่ระบบ');
        return res.redirect('/signin');
    }
    next();
};

/**
 * Verify if the user's autorized to access the api's link or not
 * @param  {Request}   req
 * @param  {Response}   res
 * @param  {Function} next
 * @return {Function} of a callback route or 403 Forbidden — The user is logged in but isn’t allowed access
 */
exports.hasAuthorizationForApi = function (req, res, next) {
    var link = req.originalUrl;
    verifyAuthorization(req, res, link, function (isAutorized) {
        if (isAutorized) next();
        else return res.sendStatus(403);
    });
};

/**
 * Verify if the user's autorized to access the given sub-systems.
 * He/she can access the system if he/she has autorized at least one of
 * the given SubSystemIds
 * @param  {Array} SubSystemIds
 * @return {Function} of a callback route or 403 Forbidden — The user is logged in but isn’t allowed access
 */
exports.hasAuthorizationForPartial = function (req, res, next) {
    var link = req.body.link;

    verifyAuthorization(req, res, link, function (isAutorized) {
        if (isAutorized) return res.sendStatus(200);
        else return res.sendStatus(403);
    });
};

/**
 * Load all SubSystemId authorized for a current logged in user
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadAuthorizationSubSystemId = function(req, res) {
    var query = 'SELECT rss.SubSystemId FROM Users u JOIN UserRoles ur ON ';
    query += 'u.id = ur.UserId JOIN Roles r ON ur.RoleId = r.id JOIN RoleSubSystems rss ON ';
    query += 'ur.RoleId = rss.RoleId  WHERE u.id = ' + req.body.UserId;
    db.sequelize.query(query).success(function(results) {
        return res.json(results);
    }).error(function(err) {
        console.error(err);
        return res.sendStatus(500);
    });
};

/**
 * Verify whether the scholarship has opend or not
 * @param  {Request} req
 * @param  {Response} res
 */
exports.verifyIsScholarshipOpen = function(req, res) {
    db.ScholarshipSetting.find({
        where: ['NOW() >= startDate AND NOW() <= endDate']
    }).success(function(setting) {
        console.log(setting);
        return res.json(setting);
    }).error(function(err) {
        console.error(err);
        return res.sendStatus(500);
    });
};


function verifyAuthorization(req, res, link, callback) {
    var isAutorized = false;
    var today = Date();

    // Verify by id and also verify whether today 
    // is still between user's startDate and user's endDate.
    var condition;
    if (req.user.startDate && req.user.endDate) {
        condition = '`User`.`id` = ? && NOW() >= `User`.`startDate` && NOW() <= `User`.`endDate`';
    } else if (req.user.startDate && !req.user.endDate) {
        condition = '`User`.`id` = ? && NOW() >= `User`.`startDate`';
    } else if (!req.user.startDate && req.user.endDate) {
        condition = '`User`.`id` = ? && NOW() <= `User`.`endDate`';
    } else {
        condition = '`User`.`id` = ?';
    }
    db.User.find({
        where: [
            condition,
            req.user.id
        ],
        include: [{
            model: db.Role,
            include: [{
                model: db.SubSystem,
                include: [{
                    model: db.Api
                }]
            }]
        }]
    }).success(function (user) {
        // If no user returned, return unautorized
        if (!user)
            return res.sendStatus(403);

        // Verify whether the user has an authorization for the particular system or not
        _.each(user.Roles, function (role) {
            _.each(role.SubSystems, function (sub) {
                _.find(sub.Apis, function (api) {
                    if (api.link === link) {
                        return isAutorized = true;
                    }
                })
            });
        });

        callback(isAutorized);


    }).error(function (err) {
        console.error(err);
        return res.sendStatus(403);
    });

}
