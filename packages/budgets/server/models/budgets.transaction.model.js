/**
 * BudgetTransaction Model
 */

module.exports = function(sequelize, DataTypes) {

    var BudgetTransaction = sequelize.define('BudgetTransaction', {
        isIncome: DataTypes.BOOLEAN,
        amount: DataTypes.DECIMAL(10,2),
        description: DataTypes.STRING
    }, {
        associate: function(models) {
            BudgetTransaction.belongsTo(models.SubBudget, {onDelete: 'CASCADE'});
        }
    });

    return BudgetTransaction;
};
