exports.getEducation = function(data) {
    var contents = [],
        education, header;

    header = {
        text: '\n2. ประวัติการศึกษา และการรับทุนการศึกษา\n',
        style: 'header'
    };

    // Education
    education = {};
    education.text = [
        '\n2.1 ผู้สมัครผ่านการสอบคัดเลือกเข้าศึกษาในคณะ: ',
        data.UserProfile[0].Faculty.name,
        '\tภาควิชา: ',
        data.UserProfile[0].Department.name
    ];

    // A new student data
    if (data.UserProfile[0].isNewStudent) {
        education.text = education.text.concat([
            '\tผลการเรียนระดับมัธยมปลาย เกรดเฉลี่ยสะสม: ',
            data.UserProfile[0].gradeAvg.toString(),
            '\t สายการศึกษา: ',
            data.UserProfile[0].major
            // '\t หน่วยกิตที่ลงทะเบียนจนถึงขณะนี้ รวม \t',
            // data.UserProfile[0].credit.toString()
        ]);
    } else {
        education.text = education.text.concat([
            '\nสาขาวิชา \t',
            data.UserProfile[0].Major.name,
            '\tอาจารย์ที่ปรึกษา \t',
            data.UserProfile[0].advisor,
            '\tผลการเรียนภาคการศึกษา \t',
            data.UserProfile[0].gpa.toString(),
            '\tปีการศึกษา \t',
            data.UserProfile[0].academicYear.toString(),
            '\tเกรดเฉลี่ยสะสม \t',
            data.UserProfile[0].gradeAvg.toString(),
            '\t หน่วยกิตที่ลงทะเบียนจนถึงขณะนี้ รวม \t',
            data.UserProfile[0].credit.toString()

        ]);
    }


    contents.push(header);
    contents.push(education);
    return contents;

};

exports.getScholarship = function(data) {
    var contents = [],
        i, hasScholarship, scholarship;

    // Scholarship
    if (data.UserProfile[0].hasScholarship) {
        scholarship = {};
        hasScholarship = {
            text: '\n2.2 เคยได้รับทุนการศึกษา\n'
        };
        scholarship.table = {};
        scholarship.table.widths = ['*', '*', '*', '*'];
        scholarship.table.body = [
            [{
                text: 'ปีการศึกษา',
                style: 'tableHeader'
            }, {
                text: 'ประเภท',
                style: 'tableHeader'
            }, {
                text: 'ชื่อทุนการศึกษา',
                style: 'tableHeader'
            }, {
                text: 'จำนวนเงิน',
                style: 'tableHeader'
            }]
        ];
        for (i = 0; i < data.UserScholarship.length; i++) {
            if (data.UserScholarship[i].momentId === 1) {
                scholarship.table.body.push([
                    data.UserScholarship[i].academicYear,
                    data.UserScholarship[i].type,
                    data.UserScholarship[i].name,
                    data.UserScholarship[i].total.toString()
                ]);
            }
        }
    } else {
        hasScholarship = {
            text: '\n2.2 ไม่เคยได้รับทุนการศึกษา\n'
        };
    }

    contents.push(hasScholarship);
    if(scholarship)
        contents.push(scholarship);

    return contents;
};
