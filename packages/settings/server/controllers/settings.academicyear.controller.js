/**
 * Module dependencies.
 */
var async = require('async');
var db = require('../../../../config/sequelize');
var utils = require('../../../cores/server/controllers/cores.utils.controller');

/**
 * Update or insert an academic year by using utils function
 * @param  {Request} req
 * @param  {Response} res
 */
exports.upsert = function(req, res) {
    var ay = req.body.ay;
    async.parallel([
        function(callback) {
            utils.upsertData('AcademicYear', ay, callback);
        }
    ], function(err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

/**
 * Load academic year from AcademicYear table
 * @param  {Request} req
 * @param  {Response} res
 */
exports.load = function(req, res) {
    db.AcademicYear.findAll().success(function(ay){
        res.json(ay);
    }).error(function(err){
        res.sendStatus(500);
    });

};

/**
 * Delete an academic year
 * @param  {Request} req
 * @param  {Response} res
 */
exports.delete = function(req, res) {
    var ay = req.body.ay;    
    db.AcademicYear.find({
        where: {
            id: ay.id
        }
    }).success(function(data) {
        data.destroy().success(function() {
            res.sendStatus(200);
        }).error(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

