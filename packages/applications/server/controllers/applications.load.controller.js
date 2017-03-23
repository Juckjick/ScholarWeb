/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');

// Load Title
exports.loadTitles = function (req, res) {
    db.Title.findAll().success(function (titles) {
        res.json(titles);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Province
exports.loadProvinces = function (req, res) {
    db.Province.findAll().success(function (provinces) {
        res.json(provinces);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserProfile
exports.loadProfile = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserProfile.find({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        },
        include: [{
            model: db.Title,
            required: false
        },
            {
                model: db.ChildCare,
                required: false
            }, {
                model: db.Department,
                required: false
            }, {
                model: db.Faculty,
                required: false
            }, {
                model: db.FamilyStatus,
                required: false
            }, {
                model: db.Job,
                required: false
            }]
    }).success(function (profile) {
        res.json(profile);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserAddress
exports.loadAddresses = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserAddress.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        },
        include: [{
            model: db.Province,
            required: false
        }]
    }).success(function (addresses) {
        res.json(addresses);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Faculty joined with Department
exports.loadFacultiesDepartments = function (req, res) {
    db.Faculty.findAll({
        include: [{
            model: db.Department
        }]
    }).success(function (addresses) {
        res.json(addresses);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Majors
exports.loadMajors = function (req, res) {
    db.Major.findAll().then(function (majors) {
        res.json(majors);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserScholarships
exports.loadScholarships = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserScholarship.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (addresses) {
        res.json(addresses);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserScholarships
exports.loadFamilies = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserFamily.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        },
        include: [{
            model: db.FamilyRelation
        }]
    }).success(function (families) {
        res.json(families);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserAdoption
exports.loadAdoption = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserAdoption.find({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (adoption) {
        res.json(adoption);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserCashes
exports.loadCashes = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserCash.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (cashes) {
        res.json(cashes);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserHealth
exports.loadHealth = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserHealth.find({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (health) {
        res.json(health);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserActivity
exports.loadActivity = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserActivity.find({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (activity) {
        res.json(activity);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserContacts
exports.loadContacts = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserContact.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (contacts) {
        res.json(contacts);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load UserReason
exports.loadReason = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserReason.find({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (reason) {
        res.json(reason);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Job
exports.loadJobs = function (req, res) {
    db.Job.findAll().success(function (jobs) {
        res.json(jobs);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Loans
exports.loadLoans = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserLoan.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        }
    }).success(function (loans) {
        res.json(loans);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Files
exports.loadFiles = function (req, res) {
    db.File.findAll().success(function (files) {
        res.json(files);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

// Load Uploaded files
exports.loadUploadedFiles = function (req, res) {
    var data = req.body,
        id = data.id,
        AcademicYearId = data.AcademicYearId;

    db.UserFile.findAll({
        where: {
            UserId: id,
            AcademicYearId: AcademicYearId
        },
        attributes: ['id', 'mimetype', 'AcademicYearId', 'UserId'],
        order: 'FileId',
        include: [{
            model: db.File
        }]
    }).success(function (files) {
        res.json(files);
    }).error(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Load the maximum AcademicYearId
 * @param req
 * @param res
 */
exports.loadMaxAcademicYear = function (req, res) {
    var UserId = req.body.UserId;

    // UserProfile represents the overall data
    db.UserProfile.max('AcademicYearId', {
        where: {
            UserId: UserId
        }
    }).then(function (AcademicYearId) {
        res.json(AcademicYearId);
    }).catch(function (err) {
        console.error(err);
    });
};

