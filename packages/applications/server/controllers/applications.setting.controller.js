/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var utils = require('../../../cores/server/controllers/cores.utils.controller');

/**
 * Find a setting which always has only one row
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadSetting = function(req, res) {
    db.ScholarshipSetting.findAll().success(function(setting) {
        res.json(setting[0]);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Update or insert a setting by using utils function
 * @param  {Request} req
 * @param  {Response} res
 */
exports.upsertSetting = function(req, res) {
    var setting = req.body.setting;
    async.parallel([
        function(callback) {
            utils.upsertData('ScholarshipSetting', setting, callback);
        }
    ], function(err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};
