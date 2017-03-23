"use strict";

var budgetCtrl = require('../controllers/budgets.controller');
var transCtrl = require('../controllers/budgets.transaction.controller');


module.exports = function (app, passport, auth) {

    app.post('/api/budgets/load/main-budgets', auth.requiresLogin, auth.hasAuthorizationForApi, budgetCtrl.loadMainBudget);
    app.post('/api/budgets/load/sub-budgets', auth.requiresLogin, auth.hasAuthorizationForApi, budgetCtrl.loadSubBudget);
    app.post('/api/budgets/load/main-sub-budgets', auth.hasAuthorizationForApi, auth.requiresLogin, budgetCtrl.loadMainSubBudget);
    app.post('/api/budgets/load/main-sub-budgets/current-academicyear', auth.hasAuthorizationForApi, auth.requiresLogin, budgetCtrl.loadMainSubBudgetOfCurrentAcademicYear);
    app.post('/api/budgets/upsert', auth.requiresLogin, auth.hasAuthorizationForApi, budgetCtrl.upsertBudget);
    app.post('/api/budgets/delete', auth.requiresLogin, auth.hasAuthorizationForApi, budgetCtrl.delete);

    app.post('/api/budgets/create/transaction', auth.requiresLogin, auth.hasAuthorizationForApi, transCtrl.create);
    app.post('/api/budgets/load/transaction-graph-academicyear', auth.requiresLogin, auth.hasAuthorizationForApi, transCtrl.findGraphDataGroupByAcademicYearId);
    app.post('/api/budgets/load/transaction-graph-main', auth.requiresLogin, auth.hasAuthorizationForApi, transCtrl.findGraphDataGroupByBudgetId);
    app.post('/api/budgets/load/transaction-graph-sub', auth.requiresLogin, auth.hasAuthorizationForApi, transCtrl.findGraphDataGroupBySubBudgetId);
    app.post('/api/budgets/load/transaction-table', auth.requiresLogin, auth.hasAuthorizationForApi, transCtrl.findAllBetweenDate);

};
