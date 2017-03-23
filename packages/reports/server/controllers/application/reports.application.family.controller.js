//Global variables
var sectionNumber;

exports.getFamily = function (data) {
    var contents = [],
        member = {},
        i, header;

    // Initialize sectionNumber
    sectionNumber = 0;

    // Header
    header = {
        text: '\n3. ครอบครัว / ผู้อุปการะ\n',
        style: 'header'
    };


    // Members
    for (i = 0; i < data.UserFamily.length; i++) {
        if (data.UserFamily[i].FamilyRelationId === 1) {
            member.father = data.UserFamily[i];
        }
        else if (data.UserFamily[i].FamilyRelationId === 2) {
            member.mother = data.UserFamily[i];
        }
        else if (data.UserFamily[i].FamilyRelationId === 3) {
            member.adopter = data.UserFamily[i];
        }
    }

    contents.push(header);

    // Add members if exist
    if (member.father) {
        contents.push(generateFamilyInfo(member.father));
    }
    if (member.mother) {
        contents.push(generateFamilyInfo(member.mother));

    }
    if (member.adopter) {
        contents.push(generateFamilyInfo(member.adopter));
    }


    return contents;
};

exports.getStatus = function (data) {
    var contents = [],
        status = {};

    sectionNumber += 1;

    status.text = [
        '3.' + sectionNumber.toString() + ' สถานภาพครอบครัว\n',
        'สถานะ\t',
        data.UserProfile[0].FamilyStatus.name
    ];

    // In case of 'อื่นๆ'
    if (data.UserProfile[0].FamilyStatusId === 4) {
        status.text = status.text.concat([
            '\t(โปรดระบุ)\t',
            data.UserProfile[0].familyStatusNote
        ]);
    } else if (data.UserProfile[0].FamilyStatusId !== 1) {
        status.text = status.text.concat([
            '\tผู้ส่งเสีย\t',
            data.UserProfile[0].ChildCare.name
        ]);
    }

    status.style = 'linespace';
    contents.push(status);

    return contents;
};

exports.getStepParent = function (data) {
    var contents = [],
        step = {},
        i;
    // Find step parent and create a content if it exist
    for (i = 0; i < data.UserFamily.length; i++) {
        if (data.UserFamily[i].FamilyRelationId === 4) {
            sectionNumber += 1;

            step.text = [
                '3.' + sectionNumber.toString() + ' กรณีบิดา มารดามีครอบครัวใหม่\n',
                'สามีใหม่ / ภรรยาใหม่ ชื่อ - สกุล\t',
                data.UserFamily[i].fullname,
                '\tอายุ\t',
                data.UserFamily[i].age.toString(),
                '\tอาชีพ\t',
                data.UserFamily[i].job,
                '\nรายได้ประมาณปีละ\t',
                data.UserFamily[i].revenueYear.toString(),
                '\nสถานที่ติดต่อ\t',
                data.UserFamily[i].place,
                '\nโทรศัพท์\t',
                data.UserFamily[i].phone ? data.UserFamily[i].phone : '-'
            ];
            step.style = 'linespace';
            contents.push(step);
            break;
        }
    }


    return contents;
};

exports.getSibling = function (data) {
    var contents = [],
        header = {},
        sibling = {},
        number = 1,
        i;

    sectionNumber += 1;

    header.text = [
        '3.' + sectionNumber.toString() + ' ข้าพเจ้ามีพี่น้อง\t',
        data.UserProfile[0].numberSibling.toString() + '\tคน',
        '\tผู้ขอทุนเป็นบุตร-ธิดา คนที่ ',
        data.UserProfile[0].birthOrder.toString(),
    ];


    header.style = 'linespace';
    contents.push(header);

    // If he/she has siblings, the number of siblings
    // is included him/her self
    if (data.UserProfile[0].numberSibling > 1) {

        // Print header text
        header.text = header.text.concat([
            '\n\t\t\t - พี่น้องร่วมบิดา มารดา ที่กำลังศึกษา / ที่สำเร็จการศึกษา (มีงานทำ / ไม่มีงานทำ)'
        ]);

        sibling.table = {};
        sibling.table.widths = ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 50];
        sibling.table.body = [[{text: '#', style: 'tableHeader'}, {
            text: 'ความสัมพันธ์',
            style: 'tableHeader'
        }, {text: 'ชื่อ - นามสกุล', style: 'tableHeader'}, {text: 'อายุ', style: 'tableHeader'}, {
            text: 'ระดับการศึกษา',
            style: 'tableHeader'
        }, {text: 'อาชีพ', style: 'tableHeader'}, {text: 'ทำงาน / ศึกษาที่', style: 'tableHeader'}, {
            text: 'รายได้',
            style: 'tableHeader'
        }]];

        for (i = 0; i < data.UserFamily.length; i++) {
            if (data.UserFamily[i].FamilyRelationId === 5) {
                sibling.table.body.push([
                    number.toString(),
                    data.UserFamily[i].FamilyRelationNote,
                    data.UserFamily[i].fullname,
                    data.UserFamily[i].age.toString(),
                    data.UserFamily[i].education,
                    data.UserFamily[i].job,
                    data.UserFamily[i].place,
                    data.UserFamily[i].revenue ? data.UserFamily[i].revenue.toString() : '0'
                ]);
                number += 1;
            }
        }
        sibling.style = 'linespace';
        contents.push(sibling);
    }

    return contents;

};

exports.getAdoption = function (data) {
    var contents = [],
        adoption = {};

    // Find adoption if it exist
    if (data.UserAdoption[0]) {
        sectionNumber += 1;

        adoption.text = [
            '3.' + sectionNumber.toString() + ' บิดา - มารดา มีภาระต้องอุปการะเลี้ยงดูผู้อื่น (นอกเหนือจากบุตร - ธิดา)\t',
            data.UserAdoption[0].number.toString() + '\tคน',
            '\nบุคคลอื่นที่ต้องอุปการะเลี้ยงดูคือ\t',
            data.UserAdoption[0].person,
            '\nมีภาระหนี้สินในปัจจุบันเป็นจำนวน\t',
            data.UserAdoption[0].debt.toString() + '\tบาท',
            '\tเนื่องจาก\t',
            data.UserAdoption[0].reason,
            '\nการผ่อนชำระเดือนละ\t',
            data.UserAdoption[0].payment.toString() + '\tบาท',
            '\nปัจจุบันนิสิตอาศัยอยู่กับ\t',
            data.UserProfile[0].stayWith

        ];
        adoption.style = 'linespace';
        contents.push(adoption);
    }
    return contents;

};

function generateFamilyInfo(member) {
    var person = {};

    sectionNumber += 1;

    person.text = [
        '3.' + sectionNumber.toString(),
        {text: ' ชื่อ / สกุล ', style: 'structure'},
        {text: member.FamilyRelation.name, style: 'structure'},
        '\t' + member.fullname
    ];

    if (member.isAlive) {
        person.text = person.text.concat([
            '\t มีชีวิตอยู่',
            {text: '\t อายุ \t', style: 'structure'},
            '\t' + member.age + '\t ',
            {text: '\t ปี', style: 'structure'}
        ]);
    } else {
        person.text = person.text.concat([
            '\tถึงแก่กรรม'
        ]);
    }

    person.text = person.text.concat([
        {text: '\t วุฒิการศึกษาสูงสุด \t', style: 'structure'},
        member.education,
        {text: '\n อาชีพ \t', style: 'structure'},
        member.job,
        {text: '\t สถานที่ทำงาน \t', style: 'structure'},
        member.place,
        {text: '\t โทรศัพท์ \t', style: 'structure'},
        member.phone ? member.phone : '-',
        {text: '\t โทรศัพท์มือถือ \t', style: 'structure'},
        member.mobile,
        {text: '\n รายได้ต่อเดือน (ยังไม่หักค่าใช้จ่าย) \t', style: 'structure'},
        member.revenue.toString(),
        {text: '\t บาท', style: 'structure'},
        {text: '\n รวมรายได้ประมาณปีละ \t', style: 'structure'},
        member.revenueYear.toString(),
        {text: '\t บาท', style: 'structure'},
        {text: '\n รายได้พิเศษต่อเดือน (ถ้ามี) \t', style: 'structure'},
        (member.revenueExtra ? member.revenueExtra.toString() : '0'),
        {text: '\t บาท', style: 'structure'},
        {text: '\n รวมรายได้ทั้งหมดประมาณปีละ \t', style: 'structure'},
        member.revenueNet.toString(),
        {text: '\t บาท', style: 'structure'}
    ]);

    person.style = 'linespace';
    return person;
}
