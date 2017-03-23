"use strict";

var interviewCtrl = require('../controllers/interviews.controller');
var loadCtrl = require('../controllers/interviews.load.controller');


module.exports = function (app, passport, auth) {

    app.post('/api/scholarships/load/criteria', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadCriteria);
    app.post('/api/scholarships/load/student-profiles', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadStudents);
    app.post('/api/scholarships/load/evaluation', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadEvaluation);
    app.post('/api/scholarships/load/all-evaluation-by-evaluatorid', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAllEvaluationsByEvaluatorId);
    app.post('/api/scholarships/load/all-evaluation-by-studentid-academicyearid', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAllEvaluationsByStudentIdAcademicYearId);
    app.post('/api/scholarships/load/summary', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadSummary);
    app.post('/api/scholarships/load/all-summaries', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAllSummaries);
    app.post('/api/scholarships/load/all-old-summary-by-studentid-academicyearid', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAllOldSummariesByStudentIdAcademicYearId);
    app.post('/api/interviews/load/profile-pic', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadProfilePic);

    app.post('/api/scholarships/upsert/evaluation', auth.requiresLogin, auth.hasAuthorizationForApi, interviewCtrl.upsertEvaluation);
    app.post('/api/scholarships/upsert/summary', auth.requiresLogin, auth.hasAuthorizationForApi, interviewCtrl.upsertSummary);

};
