/**
 * Cover page
 */
exports.getCover = function(data) {
    var cover = [],
        header, photo, underphoto, criteria, body, footer;
    if (data.UserFile) {
        for (var i = 0; i < data.UserFile.length; i++) {
            if (data.UserFile[i].FileId === 1 && (data.UserFile[i].mimetype === 'image/jpeg' || data.UserFile[i].mimetype === 'image/png')) {
                photo = {
                    image: 'data:' + data.UserFile[i].mimetype + ';base64,' + data.UserFile[i].data,
                    fit: [120, 150],
                    alignment: 'right'
                };
                break;
            }
        }
    }

    header = {
        text: 'ใบสมัครขอรับทุนการศึกษา\nของนิสิตจุฬาลงกรณ์มหาวิทยาลัย\nประจำปีการศึกษา ' + data.UserProfile[0].AcademicYear.name,
        alignment: 'center',
        style: 'header',
        margin: [0, 0, 0, 20]
    };

    underphoto = {
        // text: 'เลขประจำตัวนิสิต: ' + data.UserProfile[0].studentId,
        // alignment: 'right',
        // margin: [0, 0, 0, 20]
    };


    body = {
        stack: [
            'ข้าพเจ้าชื่อ (ภาษาไทย): ' + data.UserProfile[0].Title.nameTh + ' ' + data.UserProfile[0].firstnameTh + ' ' + data.UserProfile[0].lastnameTh,
            '(ภาษาอังกฤษ): ' + data.UserProfile[0].Title.nameEn + ' ' + data.UserProfile[0].firstnameEn + ' ' + data.UserProfile[0].lastnameEn,
            'เลขที่บัตรประจำตัวประชาชน: ' + data.UserProfile[0].identityCard
        ],
        margin: [0, 0, 0, 20]
    };

    criteria = {
        table: {
            widths: ['*'],
            body: [
                [{
                    stack: [{
                            text: 'เฉพาะเจ้าหน้าที่',
                            alignment: 'right',
                            bold: true,
                            margin: [0, 10, 10, 10]
                        },
                        'ผลการตรวจสอบใบสมัครและหลักฐานเอกสารการสมัคร', {
                            ol: [
                                'คำรับรองฐานะความเป็นอยู่ของครอบครัว    จำนวน  1 ชุด',
                                'ใบรายงานผลการเรียนในภาคการศึกษาที่ผ่านมา  จำนวน  1 ชุด',
                                'รูปถ่ายสภาพบ้านและทรัพย์สินของครอบครัวผู้สมัครทุนฯ (ติดในใบสมัคร)',
                                'สำเนาทะเบียนบ้านของนิสิตและผู้ปกครองพร้อมเซ็นชื่อรับรองสำเนาถูกต้อง จำนวน  1 ชุด',
                                'สำเนาบัตรประชาชนของนิสิต พร้อมเซ็นชื่อรับรองฯ   จำนวน  1 ชุด',
                                'สำเนาบัตรประจำตัวนิสิต พร้อมเซ็นชื่อรับรองฯ    จำนวน  2 ชุด',
                                'แบบคำขอรับเงินผ่านธนาคาร กรอกข้อมูล พร้อมเซ็นชื่อเรียบร้อย จำนวน  2  ชุด',
                                'แบบใบสำคัญรับเงิน กรอกข้อมูล พร้อมเซ็นชื่อเรียบร้อย จำนวน  2 ชุด ',
                                'สำเนาสมุดบัญชีธนาคาร(เฉพาะหน้าแรก) พร้อมเซ็นชื่อรับรองฯ    จำนวน  2 ชุด',
                                'สำเนาบัตรประชาชนของผู้ปกครอง พร้อมเซ็นชื่อรับรองฯ จำนวน  1 ชุด',
                                'หนังสือรับรองเงินเดือนบิดา มารดา ฯ กรณีมีรายได้ประจำ  จำนวน  1 ชุด',
                                'หนังสือรับรองของคณะกรรมการสัมภาษณ์    จำนวน  1 ชุด',
                                'เอกสารอื่น ๆ (ถ้ามี)'
                            ],
                            margin: [20, 0, 0, 0]
                        }
                    ],
                    margin: [10, 10, 10, 10]
                }],
            ]
        },
        margin: [0, 0, 0, 10]
    };

    footer = {
        stack: [{
            text: [{
                    text: 'หมายเหตุ ',
                    bold: true
                },
                'นิสิตให้ข้อมูลในใบสมัครครบถ้วนตามข้อเท็จจริง หากปรากฏว่าข้อมูลที่ให้มาเป็นเท็จ นิสิตต้องชดใช้ เงินทุนการศึกษาที่ได้รับคืนทั้งหมด และยินยอมให้พิจารณาลงโทษตามระเบียบจุฬาลงกรณ์มหาวิทยาลัย'
            ],
            margin: [0, 0, 0, 30]

        }, {
            text: 'ลงชื่อนิสิต..................................................................... (รับทราบ)',
            alignment: 'right'
        }]
    };

    cover.push(header);
    if (photo) cover.push(photo);
    cover.push(underphoto);
    cover.push(body);
    cover.push(criteria);
    cover.push(footer);

    return cover;
};
