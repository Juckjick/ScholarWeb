/**
 * Budget Model
 */

module.exports = function(sequelize, DataTypes) {

    var Budget = sequelize.define('Budget', {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        associate: function(models) {
            Budget.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
            Budget.hasMany(models.SubBudget, {onDelete: 'RESTRICT'});
        }
    });

    return Budget;
};
