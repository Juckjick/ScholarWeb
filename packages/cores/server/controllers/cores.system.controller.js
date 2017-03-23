/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');

/**
 * Load all systems joined with subsystems
 */
exports.load = function(req, res) {
    db.System.findAll({
        include: [{
            model: db.SubSystem
        }]
    }).success(function(systems) {
        res.json(systems);
    }).error(function(err) {
        res.send(500);
    });
};


