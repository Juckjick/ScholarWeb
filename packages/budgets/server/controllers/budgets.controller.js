/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var utils = require('../../../cores/server/controllers/cores.utils.controller');

/**
 * Update or insert a main/sub budget by using utils function
 * @param  {Request} req
 * @param  {Response} res
 */
exports.upsertBudget = function(req, res) {
    var dbName = req.body.dbName;
    var budget = req.body.budget;
    async.parallel([
        function(callback) {
            utils.upsertData(dbName, budget, callback);
        }
    ], function(err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

/**
 * Load main budget from Budget table
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadMainBudget = function(req, res) {
    db.Budget.findAll({
        include: [db.AcademicYear]
    }).success(function(budgets) {
        res.json(budgets);
    }).error(function(err) {
        res.sendStatus(500);
    });

};

/**
 * Delete a budget
 * @param  {Request} req
 * @param  {Response} res
 */
exports.delete = function(req, res) {
    var dbName = req.body.dbName;
    var budget = req.body.budget;

    // Verify whether the SubBudget has been used in the process of InterviewSummary or not
    if (dbName === 'SubBudget') {
        verifyInterviewSummary(budget.id, function(hasInInterviewSummary) {
            if (hasInInterviewSummary) return res.sendStatus(500); 
            else deleteBudget(res, dbName, budget);
        });
    } else deleteBudget(res, dbName, budget);
};

/**
 * Load sub budget from SubBudget table
 * joined with Budget
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadSubBudget = function(req, res) {
    db.SubBudget.findAll({
        include: [db.Budget, db.AcademicYear]
    }).success(function(budgets) {
        res.json(budgets);
    }).error(function(err) {
        res.sendStatus(500);
    });

};

/**
 * Load Budget
 * joined with SubBudget
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadMainSubBudget = function(req, res) {
    db.Budget.findAll({
        include: [{
            model: db.SubBudget
        }]
    }).success(function(budgets) {
        res.json(budgets);
    }).error(function(err) {
        res.sendStatus(500);
    });
};


/**
 * Load Budget joined with SubBudget that have AcademicYearId
 * equal to the current ScholarshipSetting.AcademicYearId
 * @param  {Request} req
 * @param  {Response} res
 */
exports.loadMainSubBudgetOfCurrentAcademicYear = function(req, res) {
    // Load Setting in order to get
    // an startDate and an endDate
    db.ScholarshipSetting.findAll().success(function(data) {
        // Get a setting object
        var setting = data[0].dataValues;
        db.Budget.findAll({
            include: [{
                model: db.SubBudget
            }],
            where: {
                AcademicYearId: setting.AcademicYearId
            }
        }).success(function(budgets) {
            res.json(budgets);
        }).error(function(err) {
            res.sendStatus(500);
        });

    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
};

function deleteBudget(res, dbName, budget) {
    db[dbName].find({
        where: {
            id: budget.id
        }
    }).success(function(data) {
        data.destroy().success(function() {
            return res.sendStatus(200);
        }).error(function(err) {
            console.error(err);
            return res.sendStatus(500);
        });
    }).error(function(err) {
        console.error(err);
        return res.sendStatus(500);
    });
}

/**
 * Verify whether the SubBudget has been used for InterviewSummary or not
 *
 * @param subBudgetId
 * @param callback
 * @return {Boolean}
 */
function verifyInterviewSummary(subBudgetId, callback) {
    db.BudgetTransaction.find({
        where: {
            SubBudgetId: subBudgetId,
            InterviewSummaryId: {
                ne: null
            }
        }
    }).success(function(transaction) {
        if (transaction) return callback(true);
        return callback(false);
    });
}
