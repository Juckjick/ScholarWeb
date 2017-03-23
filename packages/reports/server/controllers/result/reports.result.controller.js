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


function loadExcel(req, res){
    // Verify whether the data has been set 
    // from the report object or not
    if (report.resultData)
        data = JSON.parse(report.resultData);
    else {
        return res.sendStatus(500);
    }

    // Create a new work book
    var wb = new excel.WorkBook();
    var ws = wb.WorkSheet('รายงานสรุปผลรวมทุน');

    // Create a style
    var style = getStyle(wb);

    // Generate contents
    getContents(ws, style);

    wb.write('result.xlsx', res);

    // Delete the report.resultData to prevent some people accessing the url without outside our application
    report.resultData = null;


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

    // Info
    style.info = wb.Style();
    style.info.Font.Bold();
    style.info.Font.Size(18);
    style.info.Font.Alignment.Horizontal('center');
    style.info.Font.Alignment.Vertical('bottom');
    style.info.Fill.Pattern('solid');
    style.info.Fill.Color('#D9EDF7');
    style.info.Border({
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

    // Set all columns width
    ws.Column(1).Width(10);
    ws.Column(2).Width(20);
    ws.Column(3).Width(50);
    ws.Column(4).Width(20);
    ws.Column(5).Width(20);
    ws.Column(6).Width(20);
    ws.Column(7).Width(20);
    ws.Column(8).Width(20);
    ws.Column(9).Width(20);
    ws.Column(10).Width(40);
    ws.Column(11).Width(20);
    ws.Column(12).Width(20);
    ws.Column(13).Width(90);
    ws.Column(14).Width(20);
    ws.Column(15).Width(20);


    // Topic
    ws.Row(1).Height(50);
    ws.Cell(1, 1, 1, 12, true).Style(style.topic);
    ws.Cell(1, 1).String('รายงานนิสิตที่รับทุนการศึกษา ประจำปีการศึกษา ' + data[0].AcademicYearName);

    // Header
    ws.Row(2).Height(30);
    ws.Cell(2, 1, 3, 1, true).Style(style.header);
    ws.Cell(2, 1).String('ลำดับ');
    ws.Cell(2, 2, 3, 2, true).Style(style.header);
    ws.Cell(2, 2).String('รหัสประจำตัวนิสิต');
    ws.Cell(2, 3, 3, 3, true).Style(style.header);
    ws.Cell(2, 3).String('ชื่อ - นามสกุล');

    ws.Cell(2, 4, 2, 7, true).Style(style.header);
    ws.Cell(2, 4).String('ทุนอุดหนุนมหาวิทยาลัย');
    ws.Cell(3, 4).Style(style.header).String('ก');
    ws.Cell(3, 5).Style(style.header).String('ข (1)');
    ws.Cell(3, 6).Style(style.header).String('ข (2)');
    ws.Cell(3, 7).Style(style.header).String('ค');

    ws.Cell(2, 8, 2, 9, true).Style(style.header);
    ws.Cell(2, 8).String('กองทุนรายได้คณะฯ');
    ws.Cell(3, 8).Style(style.header).String('ภาคต้น');
    ws.Cell(3, 9).Style(style.header).String('ภาคปลาย');

    ws.Cell(2, 10, 3, 10, true).Style(style.header);
    ws.Cell(2, 10).String('ทุนผู้บริจาค(ผ่านมหาวิทยาลัย)');

    ws.Cell(2, 11, 2, 12, true).Style(style.header);
    ws.Cell(2, 11).String('ทุนผู้บริจาค(ผ่านคณะฯ)');
    ws.Cell(3, 11).Style(style.header).String('เข้าบัญชีคณะฯ');
    ws.Cell(3, 12).Style(style.header).String('ไม่เข้าบัญชีคณะฯ');


    ws.Cell(2, 13, 3, 13, true).Style(style.info);
    ws.Cell(2, 13).String('ประเภททุนที่ได้รับ');
    ws.Cell(2, 14, 3, 14, true).Style(style.info);
    ws.Cell(2, 14).String('จำนวน (บาท)');
    ws.Cell(2, 15, 3, 15, true).Style(style.info);
    ws.Cell(2, 15).String('วันที่สมัคร');

    // Contents
    _.times(data.length, function(i) {
        ws.Cell(i + 4, 1).Style(style.body).Number(i + 1);
        ws.Cell(i + 4, 2).Style(style.body).String(data[i].StudentId);
        ws.Cell(i + 4, 3).Style(style.body).String(data[i].firstNameTh + ' ' + data[i].lastNameTh);
        ws.Cell(i + 4, 13).Style(style.body).String(data[i].scholarship);
        ws.Cell(i + 4, 14).Style(style.body).Number(data[i].amount).Format.Number('#,##0.00');
        ws.Cell(i + 4, 15).Style(style.body).String(moment(data[i].updatedAt).add(543, 'years').format('D MMMM YYYY'));

        //Apply borders 
        _.forEach(_.range(4, 13), function(j) {
            ws.Cell(i + 4, j).Style(style.body);
        });
    });

    // Footer
    ws.Row(data.length + 4).Height(30);
    ws.Cell(data.length + 4, 1, data.length + 4, 12).Style(style.footer);
    ws.Cell(data.length + 4, 1).String('รวม');
    ws.Cell(data.length + 4, 4).Formula('SUM(D4:D' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 5).Formula('SUM(E4:E' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 6).Formula('SUM(F4:F' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 7).Formula('SUM(G4:G' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 8).Formula('SUM(H4:H' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 9).Formula('SUM(I4:I' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 10).Formula('SUM(J4:J' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 11).Formula('SUM(K4:K' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 12).Formula('SUM(L4:L' + (data.length + 3) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 4, 13).Style(style.body).Formula('SUM(D' + (data.length + 4) + ':L' + (data.length + 4) + ')').Format.Number('#,##0.00');

}
