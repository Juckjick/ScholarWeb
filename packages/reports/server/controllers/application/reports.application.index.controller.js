/**
 * Module dependencies.
 */
var config = require('../../../../../config/config'),
    db = require('../../../../../config/sequelize'),
    utils = require('../../../../cores/server/controllers/cores.utils.controller'),
    report = require('../reports.controller'),
    async = require('async'),
    PdfPrinter = require('pdfmake'),

    // All pages
    cover = require('./reports.application.cover.controller'),
    profile = require('./reports.application.profile.controller'),
    scholarship = require('./reports.application.scholarship.controller'),
    family = require('./reports.application.family.controller'),
    cash = require('./reports.application.cash.controller'),
    health = require('./reports.application.health.controller'),
    activity = require('./reports.application.activity.controller'),
    contact = require('./reports.application.contact.controller'),
    reason = require('./reports.application.reason.controller'),
    job = require('./reports.application.job.controller'),
    loan = require('./reports.application.loan.controller'),
    backCover = require('./reports.application.backcover.controller');

/**
 * Global variables
 */
var data = {};

/**
 * Functions
 */
exports.loadPdf = loadPdf;


/**
 * Load an application using pdfkit
 * @param  {Request} req
 * @param  {Response} res
 * @see http://pdfkit.org
 */
function loadPdf(req, res) {
    // Set a global variable
    var studentData = report.studentData;

    if (!studentData) {
        res.sendStatus(500);
        return;
    }

    // Get all data and set them to the global data object
    getData(studentData.StudentId, studentData.AcademicYearId, function(err) {

        if (!err) {
            // Create an doc object and pipe to the express response
            var printer = new PdfPrinter(getFont()),
                pdfDoc = printer.createPdfKitDocument(generateDoc());
            pdfDoc.pipe(res);
            pdfDoc.end();

            // Delete the report.studentData to prevent some people directly accessing via url 
            report.studentData = null; 
        }

    });
}

/**
 * Config custom fonts
 * @return {Object} specified fonts
 */
function getFont() {

    return {
        THSarabun: {
            normal: config.root + '/public/fonts/thsarabun.ttf',
            bold: config.root + '/public/fonts/thsarabun-bold.ttf',
            italics: config.root + '/public/fonts/thsarabun-italic.ttf',
            bolditalics: config.root + '/public/fonts/thsarabun-bolditalic.ttf'
        }
    };
}

/**
 * Set page styles
 * @return {Object} with default and other properties
 */
function getStyle() {
    var style = {};

    // Default style
    style.default = {
        font: 'THSarabun',
        fontSize: 16
    };

    // Other styles
    style.other = {
        header: {
            fontSize: 20,
            bold: true
        },
        tableHeader: {
            bold: true,
            alignment: 'center'
        },
        structure: {

        },
        linespace: {
            margin: [0, 0, 0, 10]
        },
        clearfix: {
            margin: [0, 0, 0, 20]
        }
    };
    return style;
}

/**
 * Get all data from DB and convert them to JSON format
 * @param  {Function} callback to the caller when it finished
 */
function getData(UserId, AcademicYearId, callback) {

    // If the AcademicYearId has been pass through this function
    if (AcademicYearId) {
        utils.findApplicationByUserIdAcademicYearId(UserId, AcademicYearId, function(err, results) {
            if (err) callback(err);
            else {
                data = results;
                callback();
            }
        });
    }
    // Else find the maximum AcademicYearId number, this is the case when a user just sent an application
    // from complete.jade
    else {
        // Load Setting in order to get an AcademicYearId
        db.ScholarshipSetting.findAll().success(function(settings) {
            // Get a setting object
            var setting = settings[0].dataValues;

            utils.findApplicationByUserIdAcademicYearId(UserId, setting.AcademicYearId, function(err, results) {
                if (err) callback(err);
                else {
                    data = results;
                    callback();
                }
            });
        });
    }

}

/**
 * Generate all information of an application
 * @return {Object} definition of a document

 */
function generateDoc() {
    var doc = {},
        style = getStyle();

    // Set styles
    doc.defaultStyle = style.default;
    doc.styles = style.other;

    // Page
    doc.pageSize = 'A4';

    //Get all the content
    doc.content = getContents();

    return doc;
}

/**
 * Collect all the contents
 * @return {Array} contents
 */
function getContents() {
    var contents = [],
        pageBreak = {
            text: '',
            pageBreak: 'after'
        };

    // Concat all the contents from each section
    contents = contents.concat(cover.getCover(data));
    contents.push(pageBreak);

    contents = contents.concat(profile.getProfile(data));

    contents = contents.concat(scholarship.getEducation(data));
    contents = contents.concat(scholarship.getScholarship(data));

    contents = contents.concat(family.getFamily(data));
    contents = contents.concat(family.getStatus(data));
    contents = contents.concat(family.getStepParent(data));
    contents = contents.concat(family.getSibling(data));
    contents = contents.concat(family.getAdoption(data));

    contents = contents.concat(cash.getCash(data));

    contents = contents.concat(health.getHealth(data));

    contents = contents.concat(activity.getActivity(data));

    contents = contents.concat(contact.getContact(data));

    contents = contents.concat(reason.getReason(data));
    contents = contents.concat(reason.getScholarship(data));

    contents = contents.concat(job.getJob(data));

    contents = contents.concat(loan.getLoan(data));

    contents.push(pageBreak);
    contents = contents.concat(backCover.getBackCover(data));

    return contents;
}
