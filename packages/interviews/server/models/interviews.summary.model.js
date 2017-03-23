/**
 * InterviewSummary Model
 */

module.exports = function (sequelize, DataTypes) {

    var InterviewSummary = sequelize.define('InterviewSummary',
        {
            getScholarship: DataTypes.BOOLEAN
        },
        {
            associate: function (models) {
                InterviewSummary.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
                InterviewSummary.belongsTo(models.User, {as: 'Student'});
                InterviewSummary.belongsTo(models.User, {as: 'Evaluator'});

                InterviewSummary.hasMany(models.BudgetTransaction, {onDelete: 'RESTRICT'});
            }
        }
    );

    return InterviewSummary;
};
