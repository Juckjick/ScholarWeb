/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var utils = require('../../../cores/server/controllers/cores.utils.controller');

/**
 * Insert a transaction by using utils function
 * @param  {Request} req
 * @param  {Response} res
 */
exports.create = function(req, res) {
    var transaction = req.body.transaction;
    var SubBudget = req.body.SubBudget;

    // Start transaction to ensure that
    // a transaction and subbudget have been inserted
    db.sequelize.transaction().then(function(t) {
        async.parallel([
            function(callback) {
                utils.upsertDataWithTransaction('BudgetTransaction', transaction, t, callback);
            },
            function(callback) {
                utils.upsertDataWithTransaction('SubBudget', SubBudget, t, callback);
            }
        ], function(err) {
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
};

exports.findGraphDataGroupByAcademicYearId = function(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        query = '',
        startDateQuery = '',
        endDateQuery = '',
        uniqueDateQuery = '',
        balanceDateQuery = '',
        sumDateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM bt.updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        uniqueDateQuery = 'WHERE ' + startDateQuery;
        sumDateQuery = 'AND ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM bt.updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        uniqueDateQuery = 'WHERE ' + endDateQuery;
        sumDateQuery = 'AND ' + endDateQuery;
        balanceDateQuery = 'AND ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        uniqueDateQuery = 'WHERE ' + startDateQuery + ' AND ' + endDateQuery;
        sumDateQuery = 'AND ' + startDateQuery + ' AND ' + endDateQuery;
    }

    // Generate query
    query = 'SELECT getBalance.AcademicYearId, ay.name, getBalance.balance, revenue, expense FROM ';

    // Get a unique SubBudget between the chosen dates, if exist
    query += '(SELECT a.AcademicYearId, (IFNULL(income, 0) - IFNULL(expense, 0)) as balance FROM ';
    query += '(SELECT DISTINCT sb.AcademicYearId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id ';
    query += uniqueDateQuery + ') as a LEFT JOIN ';

    // Get a balance by SUM all the revenue and expense behind the chosen endDate 
    query += '(SELECT SUM(amount) as income, sb.AcademicYearId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 1 ';
    query += balanceDateQuery + ' GROUP BY AcademicYearId) b ON a.AcademicYearId = b.AcademicYearId LEFT JOIN ';
    query += '(SELECT SUM(amount) as expense, sb.AcademicYearId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 0 ';
    query += balanceDateQuery + ' GROUP BY AcademicYearId) c ON a.AcademicYearId = c.AcademicYearId) as getBalance LEFT JOIN ';

    // Get a revenue by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as revenue, sb.AcademicYearId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 1 ';
    query += sumDateQuery + ' GROUP BY AcademicYearId) as getRevenue ON getBalance.AcademicYearId = getRevenue.AcademicYearId LEFT JOIN ';

    // Get a expense by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as expense, sb.AcademicYearId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 0 ';
    query += sumDateQuery + ' GROUP BY AcademicYearId)as getExpense ON getBalance.AcademicYearId = getExpense.AcademicYearId JOIN ';

    // Join SubBudget for getting SubBudget.name
    query += 'AcademicYears as ay ON getBalance.AcademicYearId = ay.id  ORDER BY getBalance.AcademicYearId';

    db.sequelize.query(query).success(function(results) {
        res.json(results);
    }).error(function(err) {
        console.error(err);
        res.sendStatus(500);
    });


};

/**
 * Find a graph data grouped by BudgetIds
 * It find balance, revenue, and expense of each SubBudget
 * in order to generate graphs
 * @param  {Request} req
 * @param  {Response} res
 * @return {JSON} Graph data
 */
exports.findGraphDataGroupByBudgetId = function(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        query = '',
        startDateQuery = '',
        endDateQuery = '',
        uniqueDateQuery = '',
        balanceDateQuery = '',
        sumDateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM bt.updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        uniqueDateQuery = 'WHERE ' + startDateQuery;
        sumDateQuery = 'AND ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM bt.updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        uniqueDateQuery = 'WHERE ' + endDateQuery;
        sumDateQuery = 'AND ' + endDateQuery;
        balanceDateQuery = 'AND ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        uniqueDateQuery = 'WHERE ' + startDateQuery + ' AND ' + endDateQuery;
        sumDateQuery = 'AND ' + startDateQuery + ' AND ' + endDateQuery;
    }

    // Generate query
    query = 'SELECT Budgets.AcademicYearId, getBalance.BudgetId, Budgets.name, getBalance.balance, revenue, expense FROM ';

    // Get a unique SubBudget between the chosen dates, if exist
    query += '(SELECT a.BudgetId, (IFNULL(income, 0) - IFNULL(expense, 0)) as balance FROM ';
    query += '(SELECT DISTINCT sb.BudgetId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id ';
    query += uniqueDateQuery + ') as a LEFT JOIN ';

    // Get a balance by SUM all the revenue and expense behind the chosen endDate 
    query += '(SELECT SUM(amount) as income, sb.BudgetId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 1 ';
    query += balanceDateQuery + ' GROUP BY BudgetId) b ON a.BudgetId = b.BudgetId LEFT JOIN ';
    query += '(SELECT SUM(amount) as expense, sb.BudgetId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 0 ';
    query += balanceDateQuery + ' GROUP BY BudgetId) c ON a.BudgetId = c.BudgetId) as getBalance LEFT JOIN ';

    // Get a revenue by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as revenue, sb.BudgetId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 1 ';
    query += sumDateQuery + ' GROUP BY BudgetId) as getRevenue ON getBalance.BudgetId = getRevenue.BudgetId LEFT JOIN ';

    // Get a expense by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as expense, sb.BudgetId FROM BudgetTransactions bt JOIN SubBudgets sb ON bt.SubBudgetId = sb.id WHERE isIncome = 0 ';
    query += sumDateQuery + ' GROUP BY BudgetId)as getExpense ON getBalance.BudgetId = getExpense.BudgetId JOIN  ';

    // Join SubBudget for getting SubBudget.name
    query += 'Budgets as Budgets ON getBalance.BudgetId = Budgets.id  ORDER BY getBalance.BudgetId';

    db.sequelize.query(query).success(function(results) {
        res.json(results);
    }).error(function(err) {
        console.error(err);
        res.sendStatus(500);
    });

};

/**
 * Find a graph data grouped by SubBudgetIds
 * It find balance, revenue, and expense of each SubBudget
 * in order to generate graphs
 * @param  {Request} req
 * @param  {Response} res
 * @return {JSON} Graph data
 */
exports.findGraphDataGroupBySubBudgetId = function(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        query = '',
        startDateQuery = '',
        endDateQuery = '',
        uniqueDateQuery = '',
        balanceDateQuery = '',
        sumDateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        uniqueDateQuery = 'WHERE ' + startDateQuery;
        sumDateQuery = 'AND ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        uniqueDateQuery = 'WHERE ' + endDateQuery;
        sumDateQuery = 'AND ' + endDateQuery;
        balanceDateQuery = 'AND ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        uniqueDateQuery = 'WHERE ' + startDateQuery + ' AND ' + endDateQuery;
        sumDateQuery = 'AND ' + startDateQuery + ' AND ' + endDateQuery;
    }

    // Generate query
    query = 'SELECT SubBudgets.BudgetId, getBalance.SubBudgetId, SubBudgets.name, getBalance.balance, revenue, expense FROM ';

    // Get a unique SubBudget between the chosen dates, if exist
    query += '(SELECT a.SubBudgetId, (IFNULL(income, 0) - IFNULL(expense, 0)) as balance FROM ';
    query += '(SELECT DISTINCT SubBudgetId FROM BudgetTransactions ';
    query += uniqueDateQuery + ') as a LEFT JOIN ';

    // Get a balance by SUM all the revenue and expense behind the chosen endDate 
    query += '(SELECT SUM(amount) as income, SubBudgetId FROM BudgetTransactions WHERE isIncome = 1 ';
    query += balanceDateQuery + ' GROUP BY SubBudgetId) b ON a.SubBudgetId = b.SubBudgetId LEFT JOIN ';
    query += '(SELECT SUM(amount) as expense, SubBudgetId FROM BudgetTransactions WHERE isIncome = 0 ';
    query += balanceDateQuery + ' GROUP BY SubBudgetId) c ON a.SubBudgetId = c.SubBudgetId) as getBalance LEFT JOIN ';

    // Get a revenue by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as revenue, SubBudgetId FROM BudgetTransactions WHERE isIncome = 1 ';
    query += sumDateQuery + ' GROUP BY SubBudgetId) as getRevenue ON getBalance.SubBudgetId = getRevenue.SubBudgetId LEFT JOIN ';

    // Get a expense by SUM all expense between the chosen dates
    query += '(SELECT SUM(amount) as expense, SubBudgetId FROM BudgetTransactions WHERE isIncome = 0 ';
    query += sumDateQuery + ' GROUP BY SubBudgetId)as getExpense ON getBalance.SubBudgetId = getExpense.SubBudgetId JOIN ';

    // Join SubBudget for getting SubBudget.name
    query += 'SubBudgets as SubBudgets ON getBalance.SubBudgetId = SubBudgets.id  ORDER BY getBalance.SubBudgetId';

    db.sequelize.query(query).success(function(results) {
        res.json(results);
    }).error(function(err) {
        console.error(err);
        res.sendStatus(500);
    });
};

/**
 * Find transactions between the given dates
 * @param  {Request} req
 * @param  {Response} res
 * @return {JSON} Transactions data
 */
exports.findAllBetweenDate = function(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        startDateQuery = '',
        endDateQuery = '',
        dateQuery = '';
            // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM `BudgetTransaction`.`updatedAt`) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';
        dateQuery = startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM `BudgetTransaction`.`updatedAt`) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';
        dateQuery = endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        dateQuery = startDateQuery + ' AND ' + endDateQuery;
    }

    db.BudgetTransaction.findAll({
        include: [{
            model: db.SubBudget,
            include: [db.Budget]
        }],
        where: [dateQuery]
    }).then(function(results){
        res.json(results);
    }).catch(function(err){
        console.error(err);
        res.sendStatus(500);
    });
};

