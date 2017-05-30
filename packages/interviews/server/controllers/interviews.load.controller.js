/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');

/**
 * Load InterviewCriteria data
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadCriteria = function(req, res) {
    db.InterviewCriteria.findAll().success(function(criteria) {
        res.json(criteria);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Load Students' profile
 * who applied the scholarship this year
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadStudents = function(req, res) {
    // Load Setting in order to get
    // an startDate and an endDate
    db.ScholarshipSetting.findAll().success(function(data) {
        // Get a setting object
        var setting = data[0].dataValues;

        // Find students that have applied
        // scholarships between startDate and
        // endDate
        db.UserProfile.findAll({
            where: {
                AcademicYearId: setting.AcademicYearId
            },
            include: [db.Faculty, db.Department, db.AcademicYear],
            order: 'FacultyId'
        }).success(function(students) {
            res.json(students);
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
 * Load a result from InterviewEvaluation table
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadEvaluation = function(req, res) {
    var StudentId = req.body.StudentId,
        EvaluatorId = req.body.EvaluatorId,
        AcademicYearId = req.body.AcademicYearId;
    dbName = req.body.dbName;

    db.InterviewEvaluation.find({
        where: {
            StudentId: StudentId,
            EvaluatorId: EvaluatorId,
            AcademicYearId: AcademicYearId
        },
        include: [db.SubBudget]
    }).success(function(evaluation) {
        res.json(evaluation);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Load an entire evaluations by a given EvaluatorId
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadAllEvaluationsByEvaluatorId = function(req, res) {
    db.InterviewEvaluation.findAll({
        where: {
            EvaluatorId: req.body.EvaluatorId
        }
    }).success(function(evaluations) {
        res.json(evaluations);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });

};

/**
 * Load an entire evaluations by a given StudentId and AcademicYearId
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadAllEvaluationsByStudentIdAcademicYearId = function(req, res) {
    db.InterviewEvaluation.findAll({
        where: {
            StudentId: req.body.StudentId,
            AcademicYearId: req.body.AcademicYearId
        },
        include: [{
            model: db.User,
            as: 'Evaluator'
        }, {
            model: db.SubBudget,
            include: [db.Budget]
        }]
    }).success(function(evaluations) {
        res.json(evaluations);
    }).error(function(err) {
        console.error(err);
        res.sendStatus(500);
    });

};

/**
 * Load a result from InterviewSummary table
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadSummary = function(req, res) {
    var StudentId = req.body.StudentId,
        AcademicYearId = req.body.AcademicYearId;

    db.InterviewSummary.find({
        where: {
            StudentId: StudentId,
            AcademicYearId: AcademicYearId
        },
        include: [{
            model: db.BudgetTransaction,
            include: [db.SubBudget]
        }]
    }).success(function(summary) {
        res.json(summary);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

/**
 * Load an entire summary
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadAllSummaries = function(req, res) {
    db.InterviewSummary.findAll({
        include: [{
            model: db.BudgetTransaction,
            include: [{
                model: db.SubBudget,
                include: [db.Budget]
            }]
        }]
    }).success(function(summaries) {
        res.json(summaries);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });

};

/**
 * Load a result from InterviewSummary table by
 * the given StudentId and AcademicYearId
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadAllOldSummariesByStudentIdAcademicYearId = function(req, res) {
    var StudentId = req.body.StudentId,
        AcademicYearId = req.body.AcademicYearId;

    db.ScholarshipSetting.findAll().then(function(data) {
        // Get a setting object
        var setting = data[0].dataValues;

        db.InterviewSummary.findAll({
            where: [ '`InterviewSummary`.`StudentId` = ? AND `InterviewSummary`.`AcademicYearId` != ?',
                StudentId,
                setting.AcademicYearId
            ],
            include: [{
                model: db.BudgetTransaction,
                include: [{
                    model: db.SubBudget,
                    include: [db.Budget]
                }]
            }]
        }).then(function(summaries) {
            res.json(summaries);
        }).catch(function(err) {
            console.error(err);
            res.sendStatus(500);
        });

    }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);

    });
};

/**
 * Find a profile picture for the particular student
 * @param  {Request} req
 * @param  {Response} res
 * @return {Json} profile picture file
 */
exports.loadProfilePic = function (req, res) {
    var StudentId = req.body.StudentId,
        AcademicYearId = req.body.AcademicYearId;

    db.UserFile.find({
        where: {
            FileId: 1,
            UserId: StudentId,
            AcademicYearId: AcademicYearId
        }
    }).then(function (file) {
        if (file)
            file.dataValues.data = file.dataValues.data.toString('base64');
        res.json(file);
    }).catch(function (err) {
        console.error(err);
        return res.send(500);
    });
};
