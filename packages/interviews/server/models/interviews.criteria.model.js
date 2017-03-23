/**
 * InterviewCriteria Model
 */

module.exports = function(sequelize, DataTypes) {

    var InterviewCriteria = sequelize.define('InterviewCriteria', {
        name: DataTypes.STRING
    }, {
        associate: function(models) {}
    });

    return InterviewCriteria;
};
