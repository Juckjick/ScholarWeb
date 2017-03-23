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
        '\t\t\t- ชื่อทุน\t',
        loan.typeName,
        '\tประเภททุน\t',
        loan.goalName,
        '\tภาคการศึกษา\t',
        loan.firstSemester? '\tภาคต้น\t': '',
        loan.secondSemester? '\tภาคปลาย\t': ''
    ];

    return data;
}
