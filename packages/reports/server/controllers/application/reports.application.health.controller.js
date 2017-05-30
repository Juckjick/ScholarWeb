/**
 * Getting health information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getHealth = function(data) {
    var contents = [],
        header, health; 

    header = {
        text: '5. สุขภาพ\n',
        style: 'header'
    };        

    health = {};
    health.style = 'linespace';
    health.text = [
        ' - ข้าพเจ้าเคยเจ็บป่วยครั้งสุดท้ายเมื่อปี ',
        data.UserHealth[0].lastYear.toString(),
        '\tด้วยโรค ',
        data.UserHealth[0].lastDisease,
        '\tรวมระยะเวลาที่ต้องรักษา ',
        data.UserHealth[0].lastDay.toString() + ' วัน',
        '\n- ข้าพเจ้าเคยรับการรักษาและต้องอยู่โรงพยาบาลเมื่อปี ',
        data.UserHealth[0].admitYear? data.UserHealth[0].admitYear.toString() : '-',
        '\tด้วยโรค: ',
        data.UserHealth[0].admitDisease? data.UserHealth[0].admitDisease: '-',
        '\n  รวมเวลาที่รับการรักษา: ',
        data.UserHealth[0].admitDay? data.UserHealth[0].admitDay.toString() + ' วัน' : '-',
        '  ค่าใช้จ่ายในการรักษา: ',
        data.UserHealth[0].admitMoney? data.UserHealth[0].admitMoney.toString() + ' บาท': '-',
        '\n- โรคที่ข้าพเจ้าเจ็บป่วยบ่อยที่สุด คือ ',
        data.UserHealth[0].frequentlySick,
    ];


    contents.push(header);
    contents.push(health);
    return contents;

};
