/*jshint expr:true */

/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');
var utils = require('../../../cores/server/controllers/cores.utils.controller');


/**
 * Variables
 */

// Used to save StudentId and AcademicYear data before
// requesting the "get" data for exporting a pdf file
exports.studentData;

// Used to save loadResult data before
// requesting the "get" data for exporting an excel file
exports.resultData;

// Used to save loadLoan data before
// requesting the "get" data for exporting an excel file
exports.loanData;

// Used to save loadScholarship data before
// requesting the "get" data for exporting an excel file
exports.scholarshipData;

/**
 * Functions
 */

exports.loadResult = loadResult;
exports.loadLoan = loadLoan;
exports.loadScholarship = loadScholarship;
exports.loadAllStudents = loadAllStudents;
exports.loadStudentProfiles = loadStudentProfiles;
exports.saveStudentIdAcademicYearId = saveStudentIdAcademicYearId;

//////////////////////////////////////////

/**
 * Load all studens from InterviewSummary who got a scholarship
 * joined with Users, BudgetTransactions, SubBudgets, and Budgets
 * @param  {Request} req
 * @param  {Response} res
 */

function loadResult(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        AcademicYear = req.body.AcademicYear,
        startDateQuery = '',
        endDateQuery = '',
        dateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        dateQuery = 'AND ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        dateQuery = 'AND ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        dateQuery = 'AND ' + startDateQuery + ' AND ' + endDateQuery;
    }
    
    // add AcademicYearId to the where query, if it isn't null
    if (AcademicYear) {
        dateQuery += 'AND ay.name = "' + AcademicYear.name + '"';
    }

    var query = 'SELECT profile.updatedAt, profile.StudentId, profile.firstNameTh, profile.lastNameTh,  ay.name as AcademicYearName FROM ';
    query += 'UserProfiles as profile JOIN AcademicYears as ay ON ';
    // query += 'summary.AcademicYearId = ay.id JOIN UserProfiles as profile ON ';
    query += 'ay.id = profile.AcademicYearId';// LEFT JOIN (SELECT transaction.InterviewSummaryId, SUM(amount) as amount, group_concat(concat(main.name, "/", sub.name) separator ", ") as scholarship  from BudgetTransactions AS transaction LEFT JOIN SubBudgets sub ON ';
    // query += 'transaction.SubBudgetId = sub.id LEFT JOIN Budgets main ON ';
    // query += 'sub.BudgetId = main.id GROUP BY transaction.InterviewSummaryId) as transaction ON ';
    // query += 'summary.id = transaction.InterviewSummaryId ';
    query += ' WHERE ay.id >= 0 ' + dateQuery + ' ORDER BY profile.StudentId';

    // var query = 'SELECT profile.updatedAt, profile.StudentId, profile.firstNameTh, profile.lastNameTh, transaction.amount, transaction.scholarship, ay.name as AcademicYearName FROM ';
    // query += 'InterviewSummaries as summary JOIN AcademicYears as ay ON ';
    // query += 'summary.AcademicYearId = ay.id JOIN UserProfiles as profile ON ';
    // query += '(summary.StudentId = profile.UserId AND summary.AcademicYearId = profile.AcademicYearId) LEFT JOIN (SELECT transaction.InterviewSummaryId, SUM(amount) as amount, group_concat(concat(main.name, "/", sub.name) separator ", ") as scholarship  from BudgetTransactions AS transaction LEFT JOIN SubBudgets sub ON ';
    // query += 'transaction.SubBudgetId = sub.id LEFT JOIN Budgets main ON ';
    // query += 'sub.BudgetId = main.id GROUP BY transaction.InterviewSummaryId) as transaction ON ';
    // query += 'summary.id = transaction.InterviewSummaryId ';
    // query += 'WHERE summary.getScholarship = 1 ' + dateQuery + ' ORDER BY profile.StudentId';

    db.sequelize.query(query).success(function(result) {
        exports.resultData = JSON.stringify(result);
        res.json(result);
    }).error(function(err) {
        res.sendStatus(500);
    });

}

/**
 * Load all studens from InterviewSummary, whether they got it or not
 * joined with Users, BudgetTransactions, SubBudgets, and Budgets
 * @param  {Request} req
 * @param  {Response} res
 */
function loadLoan(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        AcademicYear = req.body.AcademicYear,
        startDateQuery = '',
        endDateQuery = '',
        dateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        dateQuery = 'WHERE ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        dateQuery = 'WHERE ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        dateQuery = 'WHERE ' + startDateQuery + ' AND ' + endDateQuery;
    }

    // add AcademicYearId to the where query, if it isn't null
    if (AcademicYear) {
        if (dateQuery !== '')
            dateQuery += ' AND ay.name = "' + AcademicYear.name + '"';
        else
            dateQuery += 'WHERE ay.name = "' + AcademicYear.name + '"';
    }

    var query = 'SELECT profile.updatedAt, profile.StudentId, profile.firstNameTh, profile.lastNameTh, profile.identityCard, profile.gradeAvg, profile.mobile, ay.name as AcademicYearName FROM ';
    query += 'InterviewSummaries as summary JOIN AcademicYears as ay ON ';
    query += 'summary.AcademicYearId = ay.id JOIN UserProfiles as profile ON ';
    query += '(summary.StudentId = profile.UserId AND summary.AcademicYearId = profile.AcademicYearId) ';
    query += dateQuery + ' ORDER BY profile.StudentId';

    db.sequelize.query(query).success(function(result) {
        exports.loanData = JSON.stringify(result);
        res.json(result);
    }).error(function(err) {
        res.sendStatus(500);
    });

}

/**
 * Load all studens from InterviewSummary who got a scholarship
 * joined with Users, BudgetTransactions, SubBudgets, and Budgets
 * @param  {Request} req
 * @param  {Response} res
 */
function loadScholarship(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate,
        AcademicYear = req.body.AcademicYear,
        startDateQuery = '',
        endDateQuery = '',
        dateQuery = '';

    // startDate was defined
    if (startDate) {
        startDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) >= EXTRACT(YEAR_MONTH FROM "' + startDate + '")';

        dateQuery = 'AND ' + startDateQuery;
    }

    // endDate was defined
    if (endDate) {
        endDateQuery = 'EXTRACT(YEAR_MONTH FROM profile.updatedAt) <= EXTRACT(YEAR_MONTH FROM "' + endDate + '")';

        dateQuery = 'AND ' + endDateQuery;
    }

    // both startDate and endDate were defined
    if (startDate && endDate) {
        dateQuery = 'AND ' + startDateQuery + ' AND ' + endDateQuery;
    }
    
    // add AcademicYearId to the where query, if it isn't null
    if (AcademicYear) {
        dateQuery += 'AND ay.name = "' + AcademicYear.name + '"';
    }

    var query = 'SELECT profile.updatedAt, profile.identityCard, profile.firstNameTh, profile.lastNameTh, profile.gradeAvg, profile.mobile, ';
    query += 'status.id as statusId,status.name as statusName, ';
    query += 'department.name as department, faculty.name as faculty, ';
    query += 'oldAdd.address as oldAddress, province.name as oldProvince, oldAdd.zipcode as oldZipcode, oldAdd.telephone as oldTelephone, ';
    query += 'newAdd.address as newAddress, province2.name as newProvince, newAdd.zipcode as newZipcode, newAdd.telephone as newTelephone, ';
    query += 'father.job as fatherJob, father.isAlive as fatherIsAlive, father.revenueYear as fatherRevenueYear, ';
    query += 'mother.job as motherJob, mother.isAlive as motherIsAlive, mother.revenueYear as motherRevenueYear, ';
    query += 'sponsor.job as sponsorJob, sponsor.isAlive as sponsorIsAlive, sponsor.revenueYear as sponsorRevenueYear, ';
    query += 'ay.name as AcademicYearName ';
    query += 'FROM UserProfiles as profile JOIN AcademicYears as ay ON profile.AcademicYearId = ay.id ';
    query += 'JOIN FamilyStatuses as status ON profile.FamilyStatusId = status.id ';
    query += 'JOIN Departments as department ON profile.DepartmentId = department.id ';
    query += 'JOIN Faculties as faculty ON profile.FacultyId = faculty.id ';
    query += 'JOIN (SELECT * FROM UserAddresses WHERE momentId=1) oldAdd ON profile.UserId = oldAdd.UserId ';
    query += 'JOIN (SELECT * FROM UserAddresses WHERE momentId=2) newAdd ON profile.UserId = newAdd.UserId ';
    query += 'JOIN Provinces as province ON oldAdd.ProvinceId = province.id ';
    query += 'JOIN Provinces as province2 ON oldAdd.ProvinceId = province2.id ';
    query += 'LEFT JOIN (SELECT * FROM UserFamilies WHERE FamilyRelationId=1) father ON profile.UserId = father.UserId ';
    query += 'LEFT JOIN (SELECT * FROM UserFamilies WHERE FamilyRelationId=2) mother ON profile.UserId = mother.UserId ';
    query += 'LEFT JOIN (SELECT * FROM UserFamilies WHERE FamilyRelationId=3) sponsor ON profile.UserId = sponsor.UserId ';
    query += 'WHERE ay.id>=0 ' + dateQuery + ' ORDER BY profile.FacultyId AND profile.DepartmentId AND profile.StudentId';


    // var query = 'SELECT profile.updatedAt, profile.StudentId, profile.firstNameTh, profile.lastNameTh, profile.identityCard, profile.gradeAvg, ';
    // query += 'profile.mobile, transaction.amount, transaction.scholarship, status.id as statusId,status.name as statusName, department.name as department, oldAdd.address as oldAddress, oldAdd.zipcode as oldZipcode, oldAdd.telephone as oldTelephone, ';
    // query += 'newAdd.address as newAddress, newAdd.zipcode as newZipcode, newAdd.telephone as newTelephone, ';
    // query += 'father.job as fatherJob, father.isAlive as fatherIsAlive, father.revenueYear as fatherRevenueYear, mother.job as motherJob, mother.isAlive as motherIsAlive, mother.revenueYear as motherRevenueYear, ay.name as AcademicYearName FROM InterviewSummaries as summary JOIN AcademicYears as ay ON ';
    // query += 'summary.AcademicYearId = ay.id JOIN UserProfiles as profile ON ';
    // query += '(summary.StudentId = profile.UserId AND summary.AcademicYearId = profile.AcademicYearId) JOIN (SELECT * FROM UserAddresses WHERE momentId=1) oldAdd ON ';
    // query += '(summary.StudentId = oldAdd.UserId AND summary.AcademicYearId = oldAdd.AcademicYearId) JOIN (SELECT * FROM UserAddresses WHERE momentId=2) newAdd ON ';
    // query += '(summary.StudentId = newAdd.UserId AND summary.AcademicYearId = newAdd.AcademicYearId) LEFT JOIN (SELECT * FROM UserFamilies WHERE FamilyRelationId=1) father ON ';
    // query += '(summary.StudentId = father.UserId AND summary.AcademicYearId = father.AcademicYearId) LEFT JOIN (SELECT * FROM UserFamilies WHERE FamilyRelationId=2) mother ON ';
    // query += '(summary.StudentId = mother.UserId AND summary.AcademicYearId = mother.AcademicYearId) JOIN FamilyStatuses as status ON ';
    // query += 'profile.FamilyStatusId = status.id JOIN Departments as department ON ';
    // query += 'profile.DepartmentId = department.id LEFT JOIN (SELECT transaction.InterviewSummaryId, SUM(amount) as amount, group_concat(concat(main.name, "/", sub.name) separator ", ") as scholarship  from BudgetTransactions AS transaction LEFT JOIN SubBudgets sub ON ';
    // query += 'transaction.SubBudgetId = sub.id LEFT JOIN Budgets main ON ';
    // query += 'sub.BudgetId = main.id GROUP BY transaction.InterviewSummaryId) as transaction ON ';
    // query += 'summary.id = transaction.InterviewSummaryId WHERE summary.getScholarship = 1 ' + dateQuery + ' ORDER BY profile.StudentId';

    db.sequelize.query(query).success(function(result) {
        exports.scholarshipData = JSON.stringify(result);
        res.json(result);
    }).error(function(err) {
        res.sendStatus(500);
    });

}


/**
 * Load all unique students' profiles from database
 * who have applied a scholarship in order to generate
 * a list of students
 * @param  {Request} req
 * @param  {Response} res
 */
function loadAllStudents(req, res) {
    // var query = 'SELECT * FROM UserProfiles WHERE AcademicYearId IS NOT NULL  GROUP BY UserId ORDER BY studentId';
    // db.sequelize.query(query).success(function(students) {
    //     res.json(students);
    // }).error(function(err) {
    //     console.log(err);
    //     res.sendStatus(500);
    // });
    db.UserProfile.findAll({
        where: {
            AcademicYearId: !null
        },
        include: [db.Faculty, db.Department, db.AcademicYear],
        order: 'FacultyId'
    }).success(function(profiles) {
        res.json(profiles);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
}


/**
 * Load a students' profile from database
 * who have applied a scholarship
 * @param  {Request} req
 * @param  {Response} res
 * @return {JSON} JSON array of profiles of all AcademicYearIds */
function loadStudentProfiles(req, res) {
    db.UserProfile.findAll({
        where: {
            UserId: req.body.UserId
        },
        include: [db.Faculty, db.Department, db.AcademicYear],
        order: 'AcademicYearId DESC'
    }).success(function(profiles) {
        res.json(profiles);
    }).error(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
}

/**
 * Save a StudentId and AcademicYearId data before
 * requesting the "get" data for exporting a pdf file
 * @param  {Request} req
 * @param  {Response} res
 */
function saveStudentIdAcademicYearId(req, res) {
    exports.studentData = {};
    exports.studentData.StudentId = req.body.StudentId;
    exports.studentData.AcademicYearId = req.body.AcademicYearId;
    res.sendStatus(200);
}
