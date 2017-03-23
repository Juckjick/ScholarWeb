/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var utils = require('../../../cores/server/controllers/cores.utils.controller');
var _ = require('lodash');

/**
 * Upsert an evaluation to DB
 * @param  {Request} req
 * @param  {Response} res
 */
exports.upsertEvaluation = function(req, res) {
    var result = req.body.result;

    utils.upsertData('InterviewEvaluation', result, function(err) {
        if (err) res.sendStatus(500);
        else res.sendStatus(200);
    });
};

/**
 * Upsert a summary to DB
 * @param  {Request} req
 * @param  {Response} res
 */
exports.upsertSummary = function(req, res) {
    var data = req.body;

    db.SubBudget.findAll().then(function (subBudgets) {

        // Convert subBudgets to be a plain array
        subBudgets = _.map(subBudgets, function (sub) {
            return sub.get({plain: true});
        });

        // Start transaction to ensure that
        // a transaction and summary have been inserted
        db.sequelize.transaction().then(function (t) {
            async.waterfall([

                // Delete all old BudgetTransactions
                function (callback) {

                    // If no oldBudgetTransactions
                    if (!data.oldBudgetTransactions.length) return callback(null);

                    async.each(data.oldBudgetTransactions, function (transaction, eachCallback) {
                        utils.deleteDataWithTransaction('BudgetTransaction', transaction, t, eachCallback);
                    }, function (err) {
                        if (err) return callback(err);
                        else return callback(null);
                    });
                },

                // Upsert InterviewSummary
                function (callback) {
                    utils.upsertDataWithTransaction('InterviewSummary', data.summary, t, callback);
                },

                // Upsert new BudgetTransactions
                function (summary, callback) {
                    // If no budgetTransactions
                    if (!data.budgetTransactions.length) return callback(null);

                    async.each(data.budgetTransactions, function (transaction, eachCallback) {
                        transaction.InterviewSummaryId = summary.id;
                        utils.upsertDataWithTransaction('BudgetTransaction', transaction, t, eachCallback);
                    }, function (err) {
                        if (err) callback(err);
                        else callback(null);
                    });
                },

                // Upsert new calculated sub-budgets
                function (callback) {

                    var updatedSubBudgets = calculateBudgetTransactions(data.oldBudgetTransactions, data.budgetTransactions, subBudgets);
                    async.each(updatedSubBudgets, function (subBudget, eachCallback) {

                        // The new balance shouldn't lesser than 0
                        if (subBudget.balance < 0) return eachCallback('Sub-budget named ' + subBudget.name + ' has balance lesser than 0');

                        utils.upsertDataWithTransaction('SubBudget', subBudget, t, eachCallback);
                    }, function (err) {
                        if (err) return callback(err);
                        else return callback(null);
                    });
                }

            ], function (err) {
                if (err) {
                    t.rollback();
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    t.commit();
                    res.sendStatus(200);
                }
            });
        });

    }).catch(function (err) {
        console.error(err);
        res.sendStatus(500);
    });

};

/**
 * Calculate new sub-budget's balance
 * @param oldBudgetTransactions
 * @param newBudgetTransactions
 * @param subBudgets
 * @returns {Array}
 */
function calculateBudgetTransactions(oldBudgetTransactions, newBudgetTransactions, subBudgets) {
    var updatedSubBudgets = [];

    if (oldBudgetTransactions.length) {

        // Put old BudgetTransactions' amount back to their subBudgets
        _.each(oldBudgetTransactions, function (transaction) {
            var subBudget = _.find(subBudgets, {id: transaction.SubBudgetId});
            subBudget.balance += transaction.amount;
            updatedSubBudgets.push(subBudget);
        });
    }

    if (newBudgetTransactions.length) {

        // Subtract new BudgetTransactions' amount from subBudgets
        _.each(newBudgetTransactions, function (transaction) {
            var subBudget = _.find(subBudgets, {id: transaction.SubBudgetId});
            subBudget.balance -= transaction.amount;
            updatedSubBudgets.push(subBudget);
        });
    }

    // Delete any duplicate subBudgets in the array and return it
    return _.unique(updatedSubBudgets);
}

