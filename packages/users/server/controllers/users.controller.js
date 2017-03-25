/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var _ = require('lodash');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};


/**
 * Load all users
 */
exports.load = function(req, res) {
    db.User.findAll().success(function(users) {
        res.json(users);
    }).error(function(err) {
        res.send(500);
    });
};

/**
 * Load all users joined with roles
 */
exports.loadRoles = function(req, res) {
    db.User.findAll({
        include: [{
            model: db.Role
        }]
    }).success(function(users) {
        res.json(users);
    }).error(function(err) {
        res.send(500);
    });
};


/**
 * Create a user
 */
exports.create = function(req, res) {
    
    console.log("create");
    var user = db.User.build(req.body);

    // Set user properties
    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);

    // Persist the user
    user.save().then(function(user) {
        // Verify whether the user has assigned roles or not
        if (req.body.roles) {
            // Bind roles to the user
            async.each(req.body.roles, function(eachRole, callback) {
                db.Role.find({
                    where: {
                        id: eachRole.id
                    }
                }).then(function(role) {
                    user.addRole(role).then(function() {
                        callback();
                    }).catch(function(err) {
                        callback(err);
                    });
                });
            }, function(err) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else
                    res.json(user);

            });
        } else {

            res.json(user);
        }

    }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);
    });
};

/**
 * Create a user by register page
 */
exports.create_x = function(req, res) {
    
    console.log("create_x");
    console.log(req.body);

    var today = new Date();
    req.body.startDate = today.toString();
    req.body.endDate = new Date(today.setFullYear(today.getFullYear() + 1)).toISOString();
    
    var user = db.User.build(req.body);

    // Set user properties
    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);

    // Persist the user
    user.save().then(function(user) {
        // Verify whether the user has assigned roles or not
        db.Role.find({
            where: {
                    id: 3
            }
        }).then(function(role) {
            user.addRole(role).then(function() {
                res.json(user);
            }).catch(function(err) {
                console.log(err);
                // callback(err);
                // res.json(user);
                res.sendStatus(500);
            });
        });
            // res.json(user);
    }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);
    });
};


/**
 * Edit a user
 */
exports.edit = function(req, res) {
    // Find and edit user data
    db.User.find({
        where: {
            id: req.body.id
        }
    }).success(function(user) {
        user.fullname = req.body.fullname;
        user.email = req.body.email;
        user.username = req.body.username;
        user.startDate = req.body.startDate;
        user.endDate = req.body.endDate;

        // Modify if password was given
        if (req.body.password) {
            user.salt = user.makeSalt();
            user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
        }

        // Persist the user
        user.save().success(function(user) {

            // Remove all roles
            user.setRoles([]).success(function() {
                // Bind new roles to the user
                async.each(req.body.Roles, function(eachRole, callback) {
                    db.Role.find({
                        where: {
                            id: eachRole.id
                        }
                    }).success(function(role) {
                        user.addRole(role, {
                            startDate: req.body.startDate,
                            endDate: req.body.endDate
                        });
                        callback();
                    });
                }, function(err) {
                    if (err) res.sendStatus(500);
                    else res.json(user);
                });

            }).error(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
        }).error(function(err) {
            console.log(err);
            res.sendStatus(500);
        });


    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Update a user's profile
 * @param  {Request}   req
 * @param  {Response}   res
 * @param  {Function} next
 */
exports.updateProfile = function (req, res, next) {
    // Find and edit user data
    db.User.find({
        where: {
            id: req.body.id
        }
    }).success(function (user) {
        _.extend(user, req.body);

        // Modify if password was given
        if (req.body.password) {
            user.salt = user.makeSalt();
            user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
        }

        // Persist the user
        user.save().success(function (user) {
            return res.json(user);
        }).error(function (err) {
            return next(err);
        });


    }).error(function (err) {
        return next(err);
    });

};


/**
 * Delete a user
 */
exports.delete = function(req, res) {
    db.User.find({
        where: {
            id: req.body.id
        }
    }).success(function(user) {
        user.destroy().success(function() {
            res.sendStatus(200);
        }).error(function(err) {
            res.sendStatus(500);
        });
    }).error(function(err) {
        res.sendStatus(500);
    });
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.find({
        where: {
            id: id
        }
    }).success(function(user) {
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    }).error(function(err) {
        next(err);
    });
};
