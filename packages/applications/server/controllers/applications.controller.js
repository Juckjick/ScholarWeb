/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var stream = require('stream');
var utils = require('../../../cores/server/controllers/cores.utils.controller');
var dbNames = [
    'UserActivity',
    'UserAddress',
    'UserAdoption',
    'UserCash',
    'UserContact',
    'UserFamily',
    'UserFile',
    'UserHealth',
    'UserLoan',
    'UserProfile',
    'UserReason',
    'UserScholarship'
];

/**
 * Insert or update a new user newObj
 */
function upsertData(dbName, newObj, callback) {
    db[dbName].find({
        where: {
            id: newObj.id
        }
    }).success(function (obj) {
        // if it already exists in DB 
        if (obj) {
            // Get object's properties without enumerating over the prototype chain
            var keys = Object.keys(newObj);

            // Loop through all the exist keys of new newObj
            for (var i = 0; i < keys.length; i++) {
                obj[keys[i]] = newObj[keys[i]];
            }
        } else {
            // Build a new newObj
            obj = db[dbName].build(newObj);

        }
        obj.save().success(function () {
            callback();
        }).error(function (err) {
            callback(err);
        });

    }).error(function (err) {
        callback(err);
    });
}

function updateVersion(dbName, UserId, AcademicYearId, t, callback) {
    // Find the latest data, AcademicYearId is equal to null,
    // for a given user
    db[dbName].findAll({
        where: {
            UserId: UserId,
            AcademicYearId: null
        }
    }).then(function (objects) {

        // Verify if data has been entered 
        // by the user or it's optional
        if (objects.length) {
            // Contacts should be at least two persons
            if (dbName === 'UserContact' && objects.length < 2)
                callback('SMS: User\'s contacts should be at least two persons');

            async.eachSeries(objects, function (obj, eachCallback) {
                obj.AcademicYearId = AcademicYearId;
                obj.save({
                    transaction: t
                }).success(function () {
                    eachCallback();
                }).error(function (err) {
                    eachCallback(err);
                });
            }, function (err) {
                callback(err);
            });
        }
        // If it's optional
        else if (dbName === 'UserAdoption' || dbName === 'UserLoan' || dbName === 'UserScholarship') {
            callback();
        } else callback('SMS: User has not entered some information');

    }).catch(function (err) {
        callback(err);
    });
}

// Insert or update a new user profile
exports.upsertProfile = function (req, res) {
    var profile = req.body.data,
        oldAddress = req.body.oldAddress,
        currentAddress = req.body.newAddress,
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    async.parallel([
        function (callback) {
            // Profile
            profile.UserId = UserId;
            profile.AcademicYearId = AcademicYearId;

            upsertData('UserProfile', profile, callback);
        },
        function (callback) {
            // Old address 
            oldAddress.momentId = '1';
            oldAddress.momentName = 'old';
            oldAddress.UserId = UserId;
            oldAddress.AcademicYearId = AcademicYearId;

            upsertData('UserAddress', oldAddress, callback);
        },
        function (callback) {
            // Current address 
            currentAddress.momentId = '2';
            currentAddress.momentName = 'new';
            currentAddress.UserId = UserId;
            currentAddress.AcademicYearId = AcademicYearId;

            upsertData('UserAddress', currentAddress, callback);
        }
    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });

};


// Insert or update a user and old scholarship
exports.upsertOldScholarship = function (req, res) {
    var profile = req.body.profile,
        scholarships = req.body.scholarships,
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;


    async.series([
        function (callback) {
            // Profile
            profile.UserId = UserId;
            profile.AcademicYearId = AcademicYearId;

            upsertData('UserProfile', profile, callback);
        },
        //Delete all old scholarships before inserting edited ones
        function (callback) {
            db.UserScholarship.destroy({
                where: {
                    UserId: UserId,
                    momentId: 1,
                    AcademicYearId: AcademicYearId
                }
            }).success(function () {
                callback();
            }).error(function (err) {
                callback(err);
            });
        },
        function (callback) {
            // Scholarship fields are optionals, so, persist if exist
            if (scholarships) {
                async.each(scholarships, function (scholarship, eachCallback) {
                    // Bind other attributes
                    scholarship.UserId = req.body.UserId;
                    scholarship.AcademicYearId = AcademicYearId;

                    scholarship.momentId = 1;
                    scholarship.momentName = 'old';

                    upsertData('UserScholarship', scholarship, eachCallback);
                }, function (err) {
                    if (err) callback(err);
                    else callback();
                });
            } else {
                callback();
            }
        }

    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user family
exports.upsertFamily = function (req, res) {
    var UserId = req.body.UserId;
    var profile = req.body.profile;
    var families = req.body.families;
    var adoption = req.body.adoption;
    var AcademicYearId = req.body.AcademicYearId;

    async.parallel([
        function (callback) {
            // Profile
            profile.UserId = UserId;
            profile.AcademicYearId = AcademicYearId;

            upsertData('UserProfile', profile, callback);
        },
        function (callback) {
            // Family
            async.each(families, function (family, eachCallback) {
                // Bind other attributes
                family.UserId = UserId;
                family.AcademicYearId = AcademicYearId;

                upsertData('UserFamily', family, eachCallback);
            }, function (err) {
                if (err) callback(err);
                else callback();
            });
        },
        function (callback) {
            // Adoption
            // Don't persist if it's empty
            if (adoption && Object.getOwnPropertyNames(adoption).length) {
                adoption.UserId = UserId;
                adoption.AcademicYearId = AcademicYearId;
                upsertData('UserAdoption', adoption, callback);
            } else {
                callback();
            }


        }

    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user revenue and expense
exports.upsertCash = function (req, res) {
    var UserId = req.body.UserId;
    var cashes = req.body.cashes;
    var AcademicYearId = req.body.AcademicYearId;

    async.parallel([
        function (callback) {
            // Family
            async.each(cashes, function (cash, eachCallback) {
                // Bind other attributes
                cash.UserId = UserId;
                cash.AcademicYearId = AcademicYearId;

                upsertData('UserCash', cash, eachCallback);
            }, function (err) {
                if (err) callback(err);
                else callback();
            });
        }

    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user health
exports.upsertHealth = function (req, res) {
    var health = {},
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    health = req.body.health;

    async.parallel([
        function (callback) {
            // Health
            health.UserId = UserId;
            health.AcademicYearId = AcademicYearId;

            upsertData('UserHealth', health, callback);
        }
    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user activity 
exports.upsertActivity = function (req, res) {
    var activity = {},
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    activity = req.body.activity;

    async.parallel([
        function (callback) {
            // Health
            activity.UserId = UserId;
            activity.AcademicYearId = AcademicYearId;
            upsertData('UserActivity', activity, callback);
        }
    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user contact 
exports.upsertContact = function (req, res) {
    var contacts = req.body.contacts,
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    async.series([
            //Delete all contacts before inserting edited ones
            function (callback) {
                db.UserContact.destroy({
                    where: {
                        UserId: UserId,
                        AcademicYearId: AcademicYearId
                    }
                }).success(function () {
                    callback();
                }).error(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                // Contacts fields are optionals, so, persist if exist
                if (contacts) {
                    async.each(contacts, function (contact, eachCallback) {
                        // Bind other attributes
                        contact.UserId = UserId;
                        contact.AcademicYearId = AcademicYearId;

                        // Persist contacts
                        upsertData('UserContact', contact, eachCallback);
                    }, function (err) {
                        if (err) callback(err);
                        else callback();
                    });
                } else {
                    callback();
                }
            }

        ],
        function (err) {
            if (err) res.sendStatus(500);
            else res.sendStatus(200);
        });

};

// Insert or update a new user reason 
exports.upsertReason = function (req, res) {
    var reason = req.body.reason,
        UserId = req.body.UserId,
        scholarships = req.body.scholarships,
        AcademicYearId = req.body.AcademicYearId;

    async.series([
        function (callback) {
            // Bind other attributes
            reason.UserId = UserId;
            reason.AcademicYearId = AcademicYearId;

            upsertData('UserReason', reason, callback);

        },
        //Delete all new scholarships before inserting edited ones
        function (callback) {
            db.UserScholarship.destroy({
                where: {
                    UserId: UserId,
                    momentId: 2,
                    AcademicYearId: AcademicYearId
                }
            }).success(function () {
                callback();
            }).error(function (err) {
                callback(err);
            });
        },
        function (callback) {
            // Scholarship
            async.each(scholarships, function (scholarship, eachCallback) {
                // Bind other attributes
                scholarship.UserId = UserId;
                scholarship.AcademicYearId = AcademicYearId;

                scholarship.momentId = 2;
                scholarship.momentName = 'new';
                upsertData('UserScholarship', scholarship, eachCallback);
            }, function (err) {
                if (err) callback(err);
                else callback();
            });

        }
    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user job 
exports.upsertJob = function (req, res) {
    var profile = req.body.profile,
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    profile.UserId = UserId;
    profile.AcademicYearId = AcademicYearId;

    async.parallel([
        function (callback) {
            upsertData('UserProfile', profile, callback);
        }

    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

// Insert or update a new user loan 
exports.upsertLoan = function (req, res) {
    var loans = req.body.loans,
        UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    async.series([
        //Delete all loans before inserting edited ones
        function (callback) {
            db.UserLoan.destroy({
                where: {
                    UserId: UserId,
                    AcademicYearId: AcademicYearId
                }
            }).success(function () {
                callback();
            }).error(function (err) {
                callback(err);
            });
        },
        function (callback) {
            async.each(loans, function (loan, eachCallback) {
                // Bind other attributes
                loan.UserId = UserId;
                loan.AcademicYearId = AcademicYearId;

                // Persist loans
                upsertData('UserLoan', loan, eachCallback);

            }, function (err) {
                if (err) callback(err);
                else callback();
            });
        }
    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });


};

/**
 * Upsert file attachments to DB
 * @param  {Request} req
 * @param  {Response} res
 * @see Multer (https://github.com/expressjs/multer)
 * @see Angular-file-upload (https://github.com/nervgh/angular-file-upload)
 */
exports.upsertFile = function (req, res) {
    // Get files using multer 
    var uploadFile = req.files.file,
        AcademicYearId = req.body.AcademicYearId;

    var file = {};

    // Bind other attributes
    file.UserId = req.body.UserId;
    file.AcademicYearId = AcademicYearId;
    file.FileId = req.body.FileId;
    file.data = uploadFile.buffer;
    file.mimetype = uploadFile.mimetype;

    async.parallel([
        function (callback) {
            // Persist file
            upsertData('UserFile', file, callback);
        }

    ], function (err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });

};

exports.deleteFile = function (req, res) {
    var file = req.body.file;

    db.UserFile.find({
        where: {
            id: file.id
        }
    }).success(function (data) {
        data.destroy().success(function () {
            res.sendStatus(200);
        }).error(function (err) {
            res.sendStatus(500);
        });
    }).error(function (err) {
        res.sendStatus(500);
    });

};

/**
 * Send an application, updating all UserTables
 * that has a AcademicYearId is equal to null
 * @param  {Request} req
 * @param  {Response} res
 */
exports.sendApplication = function (req, res) {
    // Get a user id
    var UserId = req.body.UserId;

    // Load Setting in order to get
    // an startDate and an endDate
    db.ScholarshipSetting.findAll().success(function (data) {
        // Get a setting object
        var setting = data[0].dataValues;

        // Start transaction to ensure that
        // a user has entered all data saved in all tables
        db.sequelize.transaction().then(function (t) {
            async.eachSeries(dbNames, function (dbName, callback) {
                updateVersion(dbName, UserId, setting.AcademicYearId, t, callback);
            }, function (err) {
                if (!err) {
                    t.commit();
                    res.sendStatus(200);
                } else {
                    t.rollback();
                    console.error(err);
                    res.sendStatus(500);
                }
            });
        });

    }).error(function (err) {
        console.error(err);
        res.sendStatus(500);
    });
};

/**
 * Delete all current data
 * @param req
 * @param res
 */
exports.deleteAllCurrentData = function (req, res) {
    var UserId = req.body.UserId;


    async.eachSeries(dbNames, function (dbName, callback) {
        db[dbName].findAll({
            where: {
                UserId: UserId,
                AcademicYearId: null
            }
        }).then(function (objs) {
            async.eachSeries(objs, function (obj, removeCallBack) {
                obj.destroy().success(function () {
                    removeCallBack();
                }).error(function (err) {
                    removeCallBack(err);
                });

            }, function (err) {
                if (err) callback(err);
                else callback();
            });

        }).catch(function (err) {
            callback(err);
        });
    }, function (err) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    });
};


/**
 * Copy all application data from last year to this year
 * @param req
 * @param res
 */
exports.copyDataToCurrentYear = function (req, res) {
    var UserId = req.body.UserId,
        AcademicYearId = req.body.AcademicYearId;

    // Start transaction to ensure that
    // a transaction and summary have been inserted
    db.sequelize.transaction().then(function (t) {
        async.eachSeries(dbNames, function (dbName, callback) {
            db[dbName].findAll({
                where: {
                    UserId: UserId,
                    AcademicYearId: AcademicYearId
                }
            }).then(function (objs) {

                async.eachSeries(objs, function (obj, insertCallBack) {

                    // Get a data and delete the id and the AcademicYearId fields
                    var data = obj.dataValues;
                    delete data.id;
                    delete data.AcademicYearId;

                    // Insert these data
                    utils.upsertDataWithTransaction(dbName, data, t, insertCallBack);
                }, function (err) {
                    if (err) callback(err);
                    else callback();

                });
            }).catch(function (err) {
                callback(err);
            });
        }, function (err) {
            if (err) {
                t.rollback();
                console.error(err);
                return res.sendStatus(500);
            } else {
                t.commit();
                return res.sendStatus(200);

            }
        });
    });
};

// Used to save a UserFile primary key data before
// requesting the "get" data for exporting a file
var exportFileData;

/**
 * Save a UserFile primary key data before
 * requesting the "get" data for exporting a file
 * @param  {Request} req
 * @param  {Response} res
 */
exports.savePrimaryKeyId = function (req, res) {
    exportFileData = {};
    exportFileData.primaryKeyId = req.body.primaryKeyId;
    res.sendStatus(200);
};

/**
 * Export a file
 * @param  {Request} req
 * @param  {Response} res
 */
exports.exportFile = function (req, res) {
    var readableStream = new stream.PassThrough();

    if (!exportFileData) {
        return res.sendStatus(500);
    }

    db.UserFile.find({
        where: {
            id: exportFileData.primaryKeyId
        }
    }).then(function (file) {

        // Convert buffer to the readable stream, and then, end the buffer
        readableStream.end(file.dataValues.data);

        readableStream.pipe(res);
        exportFileData = null;

    }).catch(function (err) {
        console.error(err);
        return res.sendStatus(500);
    });
};
