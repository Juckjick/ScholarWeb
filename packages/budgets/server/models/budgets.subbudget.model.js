/**
 * SubBudget Model
 */

module.exports = function(sequelize, DataTypes) {

    var SubBudget = sequelize.define('SubBudget', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        balance: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
    }, {
        associate: function(models) {
            SubBudget.belongsTo(models.Budget, {onDelete: 'RESTRICT'});
            SubBudget.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
            SubBudget.hasMany(models.BudgetTransaction, {onDelete: 'CASCADE'});
        }
    });

    return SubBudget;
};
