/**
 * Getting reason information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getReason = function(data) {
    var contents = [],
        header = {}, 
        reason, scholarship;

    header.text = [{
        text: '\n8. ความจำเป็นในการขอรับทุน',
        style: 'header'
    }, {
        text: ' (พร้อมทั้งให้เขียนสรุปข้อมูลเกี่ยวกับการดำเนินชีวิตของผู้ขอรับทุน ซึ่งแสดงถึงสภาวะความยากลำบากของครอบครัว ตลอดจนปัญหาต่าง ๆ ที่มี  พร้อมทั้งความคาดหวังในการศึกษาหรือ การประกอบอาชีพในอนาคต)'
    }];

    header.style = 'linespace';

    // Generate reason
    reason = {};
    reason.text = [
        '- เหตุผลที่ต้องสมัครขอรับทุน: ',
        data.UserReason[0].reason,
        '\n\n- หากไม่ได้รับทุน ผู้สมัครจะมีวิธีการแก้ปัญหาคือ ',
        data.UserReason[0].solution
    ];

    contents.push(header);
    contents.push(reason);
    return contents;

};

/**
 * Getting scholarship information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getScholarship = function(data) {
    var contents = [],
        gotScholarship = false,
        i, header, hasScholarship, scholarship;

    header = {
        text: '\n- ขณะนี้ผู้สมัครกำลังสมัครขอรับทุนอื่นอยู่ '
    };

    // Verify if the user are applying to another scholarship
    if(data.UserScholarship) {
        for( i = 0; i < data.UserScholarship.length; i++) {
            if (data.UserScholarship[i].momentId === 2) gotScholarship = true;
        }
    }

    // Scholarship
    if (gotScholarship) {
        scholarship = {};
        hasScholarship = { text: 'เคยได้รับทุนการศึกษา\n'};
        scholarship.table = {};
        scholarship.table.widths = ['*', '*', '*']; 
        scholarship.table.body = [[{ text: 'ประเภท', style: 'tableHeader'}, { text: 'ชื่อทุนการศึกษา', style : 'tableHeader' }, {text:'จำนวนเงิน',style:'tableHeader' }]];
        for (i = 0; i < data.UserScholarship.length; i++) {
            if (data.UserScholarship[i].momentId === 2) {
                scholarship.table.body.push([
                    data.UserScholarship[i].type,
                    data.UserScholarship[i].name,
                    data.UserScholarship[i].total.toString()
                ]);
            }
        }
    } else {
        hasScholarship = { text: 'ไม่เคยได้รับทุนการศึกษา\n'};
    }

    contents.push(header);
    contents.push(hasScholarship);
    if(scholarship)
        contents.push(scholarship);

    return contents;
};
