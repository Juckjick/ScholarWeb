/**
 * Module dependencies.
 */
var config = require('../../../../../config/config'),
    db = require('../../../../../config/sequelize'),
    async = require('async'),
    utils = require('../../../../cores/server/controllers/cores.utils.controller'),
    report = require('../reports.controller.js'),
    excel = require('excel4node'),
    moment = require('moment'),
    _ = require('lodash'),
    data;


// Set default local time
moment.locale('th');

/**
 * Functions
 */
exports.loadExcel = loadExcel;


function loadExcel(req, res) {
    // Verify whether the data has been set 
    // from the report object or not
    if (report.loanData)
        data = JSON.parse(report.loanData);
    else {
        res.sendStatus(500);
        return;
    }

    // Create a new work book
    var wb = new excel.WorkBook();
    var ws = wb.WorkSheet('รายงานเงินกู้ยืมรัฐบาล');

    // Create a style
    var style = getStyle(wb);

    // Generate contents
    getContents(ws, style);

    wb.write('loan.xlsx', res);

    // Delete the report.LoanData to prevent some people accessing the url without outside our application
    report.LoanData = null;


}

/**
 * Set page styles
 * @return {Object} with default and other properties
 */
function getStyle(wb) {
    var style = {};

    // Topic
    style.topic = wb.Style();
    style.topic.Font.Bold();
    style.topic.Font.Size(20);
    style.topic.Font.Alignment.Horizontal('center');
    style.topic.Font.Alignment.Vertical('center');
    style.topic.Font.Color('#FFFFFF');
    style.topic.Fill.Pattern('solid');
    style.topic.Fill.Color('#97B316');
    style.topic.Border({
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        },
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        }
    });

    // description
    style.description = wb.Style();
    style.description.Font.Size(16);
    style.description.Border({
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        },
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        }
    });

    // Header
    style.header = wb.Style();
    style.header.Font.Bold();
    style.header.Font.Size(18);
    style.header.Font.Alignment.Horizontal('center');
    style.header.Font.Alignment.Vertical('bottom');
    style.header.Border({
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        },
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        }
    });

    // Body
    style.body = wb.Style();
    style.body.Font.Size(16);
    style.body.Border({
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        },
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        }
    });

    // Footer
    style.footer = wb.Style();
    style.footer.Font.Size(16);
    style.footer.Font.Bold();
    style.footer.Font.Alignment.Horizontal('center');
    style.footer.Font.Alignment.Vertical('bottom');
    style.footer.Fill.Pattern('solid');
    style.footer.Fill.Color('#FCF8E3');
    style.footer.Border({
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        },
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        }
    });

    return style;

}


/**
 * Collect all the contents
 * @return {Array} contents
 */
function getContents(ws, style) {
    var cellIndex,
        emptyCells = [5, 6, 8, 9, 10, 13];

    // Set all columns width
    ws.Column(1).Width(10);
    ws.Column(2).Width(20);
    ws.Column(3).Width(50);
    ws.Column(4).Width(30);
    ws.Column(5).Width(20);
    ws.Column(6).Width(30);
    ws.Column(7).Width(30);
    ws.Column(8).Width(40);
    ws.Column(9).Width(30);
    ws.Column(10).Width(20);
    ws.Column(11).Width(20);
    ws.Column(12).Width(20);
    ws.Column(13).Width(30);


    // Topic
    ws.Row(1).Height(50);
    ws.Cell(1, 1, 1, 13, true).Style(style.topic);
    ws.Cell(1, 1).String('ใบนำส่งเอกสารแบบคำขอกู้ยืมเงิน กยศ.');

    // Description
    ws.Cell(2, 1, 2, 8, true).Style(style.description);
    ws.Cell(2, 1).Style(style.description).String('เรื่อง ส่งเอกสารแบบคำขอกู้ยืมเงิน กยศ. สำนักบริหารกิจการนิสิต');
    ws.Cell(2, 9, 2, 13, true).Style(style.description);
    ws.Cell(2, 9).Style(style.description).String('เลขที่เอกสาร ....กยศ.........../...............');

    ws.Cell(3, 1, 3, 8, true).Style(style.description);
    ws.Cell(3, 1).Style(style.description).String('ชื่อหน่วยงาน :.......คณะเภสัชศาสตร์......................');
    ws.Cell(3, 9, 3, 13, true).Style(style.description);
    ws.Cell(3, 9).Style(style.description).String('ลำดับที่เอกสาร.........1..................');

    ws.Cell(4, 1, 4, 13, true).Style(style.description);
    ws.Cell(4, 1).Style(style.description).String('        ขอส่งแบบคำขอกู้ยืมเงินกู้ยืมเพื่อการศึกษา ของนิสิตผู้ขอรับทุน  ปีการศึกษา ' + data[0].AcademicYearName + ' จุฬาลงกรณ์มหาวิทยาลัย');
    ws.Cell(5, 1, 5, 13, true).Style(style.description);
    ws.Cell(5, 1).Style(style.description).String('ภาคการศึกษา.../.... ต่อสำนักบริหารกิจการนิสิต..................(คน)...............................ฉบับ โดยมีรายละเอียด ดังต่อไปนี้');
    ws.Cell(6, 1, 6, 13, true).Style(style.description);
    ws.Cell(6, 1).Style(style.description).String('        ทั้งนี้ หน่วยงาน/คณะ ได้ตรวจสอบเอกสารของนิสิตผู้ยื่นแบบคำขอกู้ยืมเงิน กองทุนเงินให้กู้ยืมเพื่อการศึกษา  พร้อมทั้งเรียงเอกสารตามลำดับปรากกฏว่าถูกต้องครบถ้วน  แล้วจึงขอนำส่ง สำนักบริหารกิจการนิสิต');
    ws.Cell(7, 1, 7, 13, true).Style(style.description);
    ws.Cell(7, 1).Style(style.description).String('เพื่อดำเนินการต่อไป โดยมีรายชื่อนิสิตดังนี้');

    // Header
    ws.Row(9).Height(30);
    ws.Cell(9, 1).Style(style.header).String('ลำดับ');
    ws.Cell(9, 2).Style(style.header).String('รหัสประจำตัวนิสิต');
    ws.Cell(9, 3).Style(style.header).String('ชื่อ - นามสกุล');
    ws.Cell(9, 4).Style(style.header).String('เลขที่บัตรประชาชน');
    ws.Cell(9, 5).Style(style.header).String('ประเภทผู้กู้ยืม');
    ws.Cell(9, 6).Style(style.header).String('รายได้ผู้ปกครองรวมกัน/ปี');
    ws.Cell(9, 7).Style(style.header).String('ผลการเรียน (GPX)');
    ws.Cell(9, 8).Style(style.header).String('ค่าเล่าเรียน/ค่าบำรุงการศึกษา');
    ws.Cell(9, 9).Style(style.header).String('ค่าใช้จ่ายเกี่ยวเนื่องฯ');
    ws.Cell(9, 10).Style(style.header).String('ค่าใช้จ่ายส่วนตัว');
    ws.Cell(9, 11).Style(style.header).String('รวม');
    ws.Cell(9, 12).Style(style.header).String('เบอร์ติดต่อ');
    ws.Cell(9, 13).Style(style.header).String('ลงในระบบ e-Studentloan');

    // Contents
    _.times(data.length, function (i) {
        cellIndex = i + 10;
        ws.Cell(cellIndex, 1).Style(style.body).Number(i + 1);
        ws.Cell(cellIndex, 2).Style(style.body).String(data[i].StudentId);
        ws.Cell(cellIndex, 3).Style(style.body).String(data[i].firstNameTh + ' ' + data[i].lastNameTh);
        ws.Cell(cellIndex, 4).Style(style.body).String(data[i].identityCard);
        ws.Cell(cellIndex, 7).Style(style.body).Number(data[i].gradeAvg);
        ws.Cell(cellIndex, 11).Style(style.body).Formula('SUM(H' + cellIndex + ' + I' + cellIndex + '+ J' + cellIndex + ')').Format.Number('#,##0.00');
        ws.Cell(cellIndex, 12).Style(style.body).String(data[i].mobile);

        // Create border for empty cells
        _.forEach(emptyCells, function (cell) {
            ws.Cell(cellIndex, cell).Style(style.body);
        });
    });


    // Footer
    ws.Row(data.length + 10).Height(30);
    ws.Cell(data.length + 10, 1, data.length + 10, 5, true);
    ws.Cell(data.length + 10, 1, data.length + 10, 13).Style(style.footer);
    ws.Cell(data.length + 10, 1).String('รวมทั้งสิ้น จำนวน..............รวม เป็นเงิน');
    ws.Cell(data.length + 10, 8).Formula('SUM(H10:H' + (data.length + 9) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 10, 9).Formula('SUM(I10:I' + (data.length + 9) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 10, 10).Formula('SUM(J10:J' + (data.length + 9) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 10, 11).Formula('SUM(K10:K' + (data.length + 9) + ')').Format.Number('#,##0.00');

}
