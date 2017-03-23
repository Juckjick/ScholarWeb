/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');

/**
 * Load all roles
 */
exports.load = function(req, res) {
    db.Role.findAll().success(function(roles) {
        res.json(roles);
    }).error(function(err) {
        res.sendStatus(500);
    });
};

/**
 * Load all roles joined with subsystems
 */
exports.loadSubSystems = function(req, res) {
    db.Role.findAll({
        include: [db.SubSystem]
    }).success(function(roles) {
        res.json(roles);
    }).error(function(err) {
        res.sendStatus(500);
    });
};



/**
 * Create a role
 */
exports.create = function(req, res) {

    var role = db.Role.build();

    // Bind properties
    role.name = req.body.name;
    role.description = req.body.description;

    // Persist new role to DB
    role.save().success(function(role) {
        // Bind roles to subsystems
        async.each(req.body.subSystems, function(SubSystemId, callback) {
            db.SubSystem.find({
                where: {
                    id: SubSystemId
                }
            }).success(function(subSystem) {
                role.addSubSystem(subSystem).success(function(){
                    callback();
                });
            });
        }, function(err) {
            if (err) res.sendStatus(500);
            else
                res.json(role);
        });
    }).error(function(err) {
        res.sendStatus(500);
    });

};

/**
 * Edit a role
 */
exports.edit = function(req, res) {
    // Find and edit role data
    db.Role.find({
        where: {
            id: req.body.id
        }
    }).success(function(role) {
        role.name = req.body.name;
        role.description = req.body.description;

        // Persist the role
        role.save().success(function(role) {

            // Remove all binded sub systems
            role.setSubSystems([]).success(function() {
                // Bind new sub systems to the role
                async.each(req.body.subSystems, function(SubSystemId, callback) {
                    db.SubSystem.find({
                        where: {
                            id: SubSystemId
                        }
                    }).success(function(subSystem) {
                        role.addSubSystem(subSystem).success(function() {
                            callback();
                        });
                    });
                }, function(err) {
                    if (err) res.sendStatus(500);
                    else res.json(role);
                });

            }).error(function(err) {
                res.sendStatus(500);
            });
        }).error(function(err) {
            res.sendStatus(500);
        });


    }).error(function(err) {
        res.sendStatus(500);
    });
};


/**
 * Delete a role
 */
exports.delete = function(req, res) {
    db.Role.find({
        where: {
            id: req.body.id
        }
    }).success(function(role) {
        role.destroy().success(function() {
            res.sendStatus(200);
        }).error(function(err) {
            res.sendStatus(500);
        });
    }).error(function(err) {
        res.sendStatus(500);
    });
};


