"use strict";

var loadCtrl = require('../controllers/applications.load.controller');
var appCtrl = require('../controllers/applications.controller');
var settingCtrl = require('../controllers/applications.setting.controller');


module.exports = function (app, passport, auth) {

    // Setting up the scholarships api for loading data
    app.post('/api/scholarships/load/titles', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadTitles);
    app.post('/api/scholarships/load/provinces', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadProvinces);
    app.post('/api/scholarships/load/profile', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadProfile);
    app.post('/api/scholarships/load/addresses', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAddresses);
    app.post('/api/scholarships/load/faculties-departments', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadFacultiesDepartments);
    app.post('/api/scholarships/load/majors', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadMajors);
    app.post('/api/scholarships/load/scholarships', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadScholarships);
    app.post('/api/scholarships/load/families', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadFamilies);
    app.post('/api/scholarships/load/adoption', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadAdoption);
    app.post('/api/scholarships/load/cashes', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadCashes);
    app.post('/api/scholarships/load/health', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadHealth);
    app.post('/api/scholarships/load/activity', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadActivity);
    app.post('/api/scholarships/load/contacts', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadContacts);
    app.post('/api/scholarships/load/reason', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadReason);
    app.post('/api/scholarships/load/jobs', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadJobs);
    app.post('/api/scholarships/load/loans', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadLoans);
    app.post('/api/scholarships/load/files', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadFiles);
    app.post('/api/scholarships/load/uploaded-files', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadUploadedFiles);
    app.post('/api/scholarships/load/max-academicyearid', auth.requiresLogin, auth.hasAuthorizationForApi, loadCtrl.loadMaxAcademicYear);

    // Export file
    app.post('/api/scholarships/save/primarykeyid', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.savePrimaryKeyId);
    app.get('/scholarships/export/:name', auth.requiresLogin, appCtrl.exportFile);


    // Setting up the scholarships api for updating or inserting data
    app.post('/api/scholarships/upsert/profile', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertProfile);
    app.post('/api/scholarships/upsert/old-scholarships', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertOldScholarship);
    app.post('/api/scholarships/upsert/families', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertFamily);
    app.post('/api/scholarships/upsert/cashes', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertCash);
    app.post('/api/scholarships/upsert/health', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertHealth);
    app.post('/api/scholarships/upsert/activity', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertActivity);
    app.post('/api/scholarships/upsert/contacts', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertContact);
    app.post('/api/scholarships/upsert/reason', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertReason);
    app.post('/api/scholarships/upsert/job', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertJob);
    app.post('/api/scholarships/upsert/loan', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertLoan);
    app.post('/api/scholarships/upsert/file', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.upsertFile);
    app.post('/api/scholarships/copy/ancient-to-current', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.copyDataToCurrentYear);

    // Setting up the scholarships api for deleting data
    app.post('/api/scholarships/delete/file', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.deleteFile);
    app.post('/api/scholarship/delete/all-data', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.deleteAllCurrentData);

    // Set student application
    app.post('/api/scholarships/send/application', auth.requiresLogin, auth.hasAuthorizationForApi, appCtrl.sendApplication);

    // Setting
    app.post('/api/scholarships/load/setting', auth.requiresLogin, auth.hasAuthorizationForApi, settingCtrl.loadSetting);
    app.post('/api/scholarships/upsert/setting', auth.requiresLogin, auth.hasAuthorizationForApi, settingCtrl.upsertSetting);

};
