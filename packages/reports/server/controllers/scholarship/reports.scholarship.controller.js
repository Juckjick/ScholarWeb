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
    if (report.scholarshipData)
        data = JSON.parse(report.scholarshipData);
    else {
        res.sendStatus(500);
        return;
    }

    // Create a new work book
    var wb = new excel.WorkBook();
    var ws1 = wb.WorkSheet('รายงานทุนอุดหนุน');
    var ws2 = wb.WorkSheet('ข้อมูลเพิ่มเติม');

    // Create a style
    var style = getStyle(wb);

    // Generate contents
    getWs1Contents(ws1, style);
    getWs2Contents(ws2, style);

    wb.write('scholarship.xlsx', res);

    // Delete the report.scholarshipData to prevent some people accessing the url without outside our application
    report.scholarshipData = null;


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
function getWs1Contents(ws, style) {

    // Set all columns width
    ws.Column(1).Width(10);
    ws.Column(2).Width(20);
    ws.Column(3).Width(30);
    ws.Column(4).Width(30);
    ws.Column(5).Width(30);
    ws.Column(6).Width(20);
    ws.Column(7).Width(40);
    ws.Column(8).Width(20);
    ws.Column(9).Width(20);
    ws.Column(10).Width(20);
    ws.Column(11).Width(20);
    ws.Column(12).Width(20);
    ws.Column(13).Width(20);
    ws.Column(14).Width(20);
    ws.Column(15).Width(20);
    ws.Column(16).Width(20);
    ws.Column(17).Width(20);
    ws.Column(18).Width(20);
    ws.Column(19).Width(20);
    ws.Column(20).Width(20);
    ws.Column(21).Width(20);
    ws.Column(22).Width(20);
    ws.Column(23).Width(20);
    ws.Column(24).Width(40);

    // Topic
    ws.Row(1).Height(25);
    ws.Cell(1, 1, 1, 24, true).Style(style.topic);
    ws.Cell(1, 1).String('ข้อมูลรายชื่อนิสิตที่ขอรับทุนการศึกษา ประจำปีการศึกษา ' + data[0].AcademicYearName);
    ws.Row(2).Height(25);
    ws.Cell(2, 1, 2, 24, true).Style(style.topic);
    ws.Cell(2, 1).String('คณะเภสัชศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย');

    // Header
    ws.Row(4).Height(30);
    ws.Cell(4, 1, 6, 1, true).Style(style.header);
    ws.Cell(4, 1).String('ลำดับที่');
    ws.Cell(4, 2, 6, 2, true).Style(style.header);
    ws.Cell(4, 2).String('เลขประจำตัว');
    ws.Cell(4, 3, 6, 3, true).Style(style.header);
    ws.Cell(4, 3).String('ชื่อ');
    ws.Cell(4, 4, 6, 4, true).Style(style.header);
    ws.Cell(4, 4).String('นามสกุล');
    ws.Cell(4, 5, 6, 5, true).Style(style.header);
    ws.Cell(4, 5).String('ภาควิชา');
    ws.Cell(4, 6, 6, 6, true).Style(style.header);
    ws.Cell(4, 6).String('GPAX');
    ws.Cell(4, 7, 6, 7, true).Style(style.header);
    ws.Cell(4, 7).String('ภูมิลำเนา');

    ws.Cell(4, 8, 4, 9, true).Style(style.header);
    ws.Cell(4, 8).String('อาชีพ');
    ws.Cell(5, 8, 6, 8, true).Style(style.header);
    ws.Cell(5, 8).String('บิดา');
    ws.Cell(5, 9, 6, 9, true).Style(style.header);
    ws.Cell(5, 9).String('มารดา');

    ws.Cell(4, 10, 4, 12, true).Style(style.header);
    ws.Cell(4, 10).String('รายได้รวมของผู้ปกครอง');
    ws.Cell(5, 10).Style(style.header).String('ต่ำกว่า');
    ws.Cell(6, 10).Style(style.header).String('150,000 บาท');
    ws.Cell(5, 11).Style(style.header).String('เกิน');
    ws.Cell(6, 11).Style(style.header).String('150,000 บาท');
    ws.Cell(5, 12).Style(style.header).String('รายได้เฉลี่ย');
    ws.Cell(6, 12).Style(style.header).String('ต่อคน / ต่อปี');

    ws.Cell(4, 13, 4, 14, true).Style(style.header);
    ws.Cell(4, 13).String('จำนวนพี่น้อง');
    ws.Cell(5, 13).Style(style.header).String('ผู้ปกครอง');
    ws.Cell(6, 13).Style(style.header).String('ยังอุปการะ');
    ws.Cell(5, 14).Style(style.header).String('ทำงาน');
    ws.Cell(6, 14).Style(style.header).String('แล้ว');

    ws.Cell(4, 15, 4, 18, true).Style(style.header);
    ws.Cell(5, 15, 6, 15, true).Style(style.header);
    ws.Cell(5, 15).String('ก');
    ws.Cell(5, 16, 6, 16, true).Style(style.header);
    ws.Cell(5, 16).String('ข (1)');
    ws.Cell(5, 17, 6, 17, true).Style(style.header);
    ws.Cell(5, 17).String('ข (2)');
    ws.Cell(5, 18, 6, 18, true).Style(style.header);
    ws.Cell(5, 18).String('ค');

    ws.Cell(4, 19, 4, 23, true).Style(style.header);
    ws.Cell(4, 19).String('สถานภาพผู้ปกครอง');
    ws.Cell(5, 19, 6, 19, true).Style(style.header);
    ws.Cell(5, 19).String('หย่า');
    ws.Cell(5, 20, 6, 20, true).Style(style.header);
    ws.Cell(5, 20).String('อยู่ด้วยกัน');
    ws.Cell(5, 21, 6, 21, true).Style(style.header);
    ws.Cell(5, 21).String('แยกกันอยู่');
    ws.Cell(5, 22, 5, 23, true).Style(style.header);
    ws.Cell(5, 22).String('เสียชีวิต');
    ws.Cell(6, 22).Style(style.header).String('บิดา');
    ws.Cell(6, 23).Style(style.header).String('มารดา');

    ws.Cell(4, 24, 6, 24, true).Style(style.header);
    ws.Cell(4, 24).String('ที่อยู่ของนิสิตที่สามารถติดต่อได้');

    // Contents
    _.times(data.length, function(i) {
        ws.Cell(i + 7, 1).Number(i + 1);
        ws.Cell(i + 7, 2).String(data[i].StudentId);
        ws.Cell(i + 7, 3).String(data[i].firstNameTh);
        ws.Cell(i + 7, 4).String(data[i].lastNameTh);
        ws.Cell(i + 7, 5).String(data[i].department);
        ws.Cell(i + 7, 6).Number(data[i].gradeAvg);
        ws.Cell(i + 7, 7).String(data[i].oldAddress + ' ' + data[i].oldZipcode);

        // Family Status
        if (data[i].statusId === 1)
            ws.Cell(i + 7, 20).Number(1); // อยู่ด้วยกัน
        else if (data[i].statusId === 2)
            ws.Cell(i + 7, 21).Number(1); // แยกกันอยู่
        else if (data[i].statusId === 3)
            ws.Cell(i + 7, 19).Number(1); // หย่า

        // Put values only if they aren't null, otherwise, just draw borders
        if (data[i].fatherIsAlive) {
            ws.Cell(i + 7, 8).String(data[i].fatherJob);
            ws.Cell(i + 7, 22).Number(1 - data[i].fatherIsAlive); // Swap value between 0 and 1
        } else {
            ws.Cell(i + 7, 8);
            ws.Cell(i + 7, 22);
        }
        if (data[i].motherIsAlive) {
            ws.Cell(i + 7, 9).String(data[i].motherJob);
            ws.Cell(i + 7, 23).Number(1 - data[i].motherIsAlive);
        } else {
            ws.Cell(i + 7, 9);
            ws.Cell(i + 7, 23);
        }

        ws.Cell(i + 7, 24).String(data[i].newAddress + ' ' + data[i].newZipcode);

        //Apply borders 
        _.times(25, function(j) {
            ws.Cell(i + 7, j).Style(style.body);
        });
    });

    // Footer
    ws.Row(data.length + 7).Height(30);
    ws.Cell(data.length + 7, 1, data.length + 7, 24).Style(style.footer);
    ws.Cell(data.length + 7, 14).String('รวม');
    ws.Cell(data.length + 7, 15).Formula('SUM(O7:O' + (data.length + 6) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 7, 16).Formula('SUM(P7:P' + (data.length + 6) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 7, 17).Formula('SUM(Q7:Q' + (data.length + 6) + ')').Format.Number('#,##0.00');
    ws.Cell(data.length + 7, 18).Formula('SUM(R7:R' + (data.length + 6) + ')').Format.Number('#,##0.00');

}

/**
 * Collect all the contents
 * @return {Array} contents
 */
function getWs2Contents(ws, style) {
    // Set all columns width
    ws.Column(1).Width(10);
    ws.Column(2).Width(20);
    ws.Column(3).Width(30);
    ws.Column(4).Width(30);
    ws.Column(5).Width(20);
    ws.Column(6).Width(20);
    ws.Column(7).Width(90);
    ws.Column(8).Width(20);
    // Topic
    ws.Row(1).Height(25);
    ws.Row(2).Height(25);
    ws.Cell(1, 1, 2, 8, true).Style(style.topic);
    ws.Cell(1, 1).String('ข้อมูลเพิ่มเติม');

    // Header
    ws.Row(4).Height(30);
    ws.Cell(4, 1).Style(style.header).String('ลำดับที่');
    ws.Cell(4, 2).Style(style.header).String('เลขประจำตัว');
    ws.Cell(4, 3).Style(style.header).String('ชื่อ');
    ws.Cell(4, 4).Style(style.header).String('นามสกุล');
    ws.Cell(4, 5).Style(style.header).String('รายได้บิดา');
    ws.Cell(4, 6).Style(style.header).String('รายได้มารดา');
    ws.Cell(4, 7).Style(style.header).String('ทุนที่ได้รับ');
    ws.Cell(4, 8).Style(style.header).String('จำนวน (บาท)');

    // Contents
    for (var i = 0; i < data.length; i++) {
        ws.Cell(i + 5, 1).Style(style.body).Number(i + 1);
        ws.Cell(i + 5, 2).Style(style.body).String(data[i].StudentId);
        ws.Cell(i + 5, 3).Style(style.body).String(data[i].firstNameTh);
        ws.Cell(i + 5, 4).Style(style.body).String(data[i].lastNameTh);
        ws.Cell(i + 5, 5).Style(style.body).Number(data[i].fatherRevenueYear).Format.Number('#,##0.00');
        ws.Cell(i + 5, 6).Style(style.body).Number(data[i].motherRevenueYear).Format.Number('#,##0.00');
        ws.Cell(i + 5, 7).Style(style.body).String(data[i].scholarship);
        ws.Cell(i + 5, 8).Style(style.body).Number(data[i].amount).Format.Number('#,##0.00');
    }
}
