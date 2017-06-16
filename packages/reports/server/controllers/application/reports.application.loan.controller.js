/**
 * Getting contact information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getLoan = function(data) {
    var contents = [],
        header, i; 

    header = {
        text: '10. การกู้ยืมเงินรัฐบาล\n',
        style: 'header'
    };        

    if(data.UserLoan.length) {
        contents.push(header);

        // Generate loan
        for(i = 0; i < data.UserLoan.length; i++) {
            contents.push(generateLoanInfo(data.UserLoan[i]));
        }
    }
    return contents;
};

/**
 * Generate loan information
 * @param  {Object} loan from DB
 * @return {Object} data
 */
function generateLoanInfo(loan) {
    var data = {};

    data.text = [
        '- ชื่อทุน ',
        loan.typeName,
        'ประเภททุน ',
        loan.goalName,
        'ภาคการศึกษา :',
        loan.firstSemester? ' ภาคต้น': '',
        loan.secondSemester? ' ภาคปลาย': ''
    ];

    return data;
}
