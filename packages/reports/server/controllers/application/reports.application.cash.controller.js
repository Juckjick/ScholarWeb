/**
 * Getting cash information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getCash = function(data) {
    var contents = [],
        i, header, income, expense;

    income = {};
    income.text = ['4.1 รายรับ\n'];
    income.style = 'linespace';
    income.total = 0;

    expense = {};
    expense.text = ['4.2 รายจ่าย\n'];
    expense.style = 'linespace';
    expense.total = 0;

    header = {
        text: '4. รายรับ / รายจ่ายในภาคการศึกษาที่ผ่านมา\n',
        style: 'header'
    };

    // Generate cash information
    for (i = 0; i < data.UserCash.length; i++) {
        if (data.UserCash[i].isIncome) {
            income.text = income.text.concat(generateCashInfo(data.UserCash[i]));
            income.total += data.UserCash[i].total;
        } else {
            expense.text = expense.text.concat(generateCashInfo(data.UserCash[i]));
            expense.total += data.UserCash[i].total;
        }
    }

    // Calculate total money
    income.text = income.text.concat(calculateTotal(income.total));
    expense.text = expense.text.concat(calculateTotal(expense.total));

    contents.push(header);
    contents.push(income);
    contents.push(expense);
    return contents;
};

/**
 * Generate cash informatino
 * @param  {Object} cash
 * @return {Array} data
 */
function generateCashInfo(cash) {
    var data;

    data = [
        '\t\t\t- ' + cash.typeName + ' เดือนละ\t',
        cash.total.toString() + '\tบาท'
    ];

    // Income has a source field,
    // expense doesn't
    if (cash.isIncome) {
        if(cash.typeId === 3) {
            data = data.concat([
                '\tลักษณะงานที่ทำ\t',
                cash.source
            ]);
        } else {
            data = data.concat([
                '\tจาก\t',
                cash.source
            ]);
        }
    }

    data = data.concat(['\n']);

    return data;
}

/**
 * Calculate total income/expense
 * @param  {Int} total 
 * @return {Array} data
 */
function calculateTotal(total) {
    var data;

    data = [
        '\t\t\tรวมทั้งสิ้น เดือนละ\t',
        total.toString() + '\tบาท'
    ];

    return data;
}
