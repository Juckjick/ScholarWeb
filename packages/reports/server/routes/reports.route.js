"use strict";

var reportCtrl = require('../controllers/reports.controller');
var applicationCtrl = require('../controllers/application/reports.application.index.controller');
var resultCtrl = require('../controllers/result/reports.result.controller');
var loanCtrl = require('../controllers/loan/reports.loan.controller');
var scholarshipCtrl = require('../controllers/scholarship/reports.scholarship.controller');


module.exports = function (app, passport, auth) {
    // Student
    app.post('/api/reports/load/all-students', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.loadAllStudents);
    app.post('/api/reports/load/student-profiles', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.loadStudentProfiles);
    app.post('/api/reports/save/studentid-academicyearid', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.saveStudentIdAcademicYearId);

    // Result
    app.post('/api/reports/load/results', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.loadResult);

    // Loan
    app.post('/api/reports/load/loans', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.loadLoan);

    // Scholarship
    app.post('/api/reports/load/scholarships', auth.requiresLogin, auth.hasAuthorizationForApi, reportCtrl.loadScholarship);

    // Generate PDF and Excels
    app.get('/reports/application.pdf', auth.requiresLogin, auth.hasAuthorizationForApi, applicationCtrl.loadPdf);
    app.get('/reports/result', auth.requiresLogin, auth.hasAuthorizationForApi, resultCtrl.loadExcel);
    app.get('/reports/loan', auth.requiresLogin, auth.hasAuthorizationForApi, loanCtrl.loadExcel);
    app.get('/reports/scholarship', auth.requiresLogin, auth.hasAuthorizationForApi, scholarshipCtrl.loadExcel);

};
