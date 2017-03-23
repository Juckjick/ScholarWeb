var moment = require('moment');

// Set default local time
moment.locale('th');

exports.getProfile = function(data) {
    var contents = [],
        i, profile, oldAddress, newAddress;

    // Assign addresses to variable for the sake of
    // getting their data
    for (i = 0; i < data.UserAddress.length; i++) {
        if (data.UserAddress[i].momentId === 1) oldAddress = data.UserAddress[i];
        else if (data.UserAddress[i].momentId === 2) newAddress = data.UserAddress[i];
    }

    // Profile
    profile = {
        text: [{
                text: '1. ประวัติส่วนตัวผู้สมัครขอรับทุน\n',
                style: 'header'
            },
            '1.1 วัน เดือน ปี ที่เกิด\t',
            moment(data.UserProfile[0].birthday).add(543, 'years').format('D MMMM YYYY'),
            '\tนับถือศาสนา\t',
            data.UserProfile[0].religion,
            '\tภูมิลำเนาเดิม\t',
            oldAddress.address,
            '\t จังหวัด\t',
            oldAddress.Province.name,
            '\tรหัสไปรษณีย์\t',
            oldAddress.zipcode,
            '\tโทรศัพท์\t',
            oldAddress.telephone,
            '\tโทรศัพท์มือถือ\t',
            data.UserProfile[0].mobile,
            '\tอีเมลล์\t',
            data.UserProfile[0].email,
            '\n\n1.2 ที่อยู่ปัจจุบัน\t',
            newAddress.address,
            '\t จังหวัด\t',
            newAddress.Province.name,
            '\tรหัสไปรษณีย์\t',
            newAddress.zipcode,
            '\tโทรศัพท์\t',
            newAddress.telephone
        ]
    };

    contents.push(profile);

    return contents;
};

