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
        '\t\t\t- ข้าพเจ้าเคยเจ็บป่วยครั้งสุดท้ายเมื่อปี\t',
        data.UserHealth[0].lastYear.toString(),
        '\tด้วยโรค\t',
        data.UserHealth[0].lastDisease,
        '\tรวมระยะเวลาที่ต้องรักษา\t',
        data.UserHealth[0].lastDay.toString() + ' วัน',
        '\n\t\t\t- ข้าพเจ้าเคยรับการรักษาและต้องอยู่โรงพยาบาลเมื่อปี\t',
        data.UserHealth[0].admitYear? data.UserHealth[0].admitYear.toString() : '-',
        '\tด้วยโรค\t',
        data.UserHealth[0].admitDisease? data.UserHealth[0].admitDisease: '-',
        '\n\t\t\t  รวมเวลาที่รับการรักษา\t',
        data.UserHealth[0].admitDay? data.UserHealth[0].admitDay.toString() + ' วัน' : '-',
        '\tค่าใช้จ่ายในการรักษา\t',
        data.UserHealth[0].admitMoney? data.UserHealth[0].admitMoney.toString() + ' บาท': '-',
        '\n\t\t\t- โรคที่ข้าพเจ้าเจ็บป่วยบ่อยที่สุด คือ\t',
        data.UserHealth[0].frequentlySick,
    ];


    contents.push(header);
    contents.push(health);
    return contents;

};
