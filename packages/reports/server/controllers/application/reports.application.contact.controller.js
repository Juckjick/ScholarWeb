/**
 * Getting contact information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getContact = function(data) {
    var contents = [],
        header, i; 

    header = {
        text: '7. นิสิตหรืออาจารย์ผู้อื่นที่ไม่ใช่อาจารย์ที่ปรึกษาที่ทางคณะกรรมการฯ สามารถสอบถามได้\n',
        style: 'header'
    };        

    contents.push(header);

    // Generate contact
    if(data.UserContact) {
        for(i = 0; i < data.UserContact.length; i++) {
            contents.push(generateContactInfo(data.UserContact[i]));
        }
    }

    return contents;
};

/**
 * Generate contact information
 * @param  {Object} contact from DB
 * @return {Object} data
 */
function generateContactInfo(contact) {
    var data = {};

    // Add a contact type
    if(contact.typeId === 1) {
        data.text = ['(อาจารย์)'];
    } else {
        data.text = ['(นิสิต)'];
    }

    data.text = data.text.concat([
        ' ชื่อ\t',
        contact.fullname,
        contact.academicYear ? '\tปี\t' + contact.academicYear : '',
        '\tคณะ\t',
        contact.faculty,
        '\tภาควิชา\t',
        contact.department,
        '\tที่อยู่\t',
        contact.address
    ]);

    return data;
}
