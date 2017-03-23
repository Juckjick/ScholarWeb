/**
 * ScholarshipSetting Model
 */

module.exports = function(sequelize, DataTypes) {

    var ScholarshipSetting = sequelize.define('ScholarshipSetting', {
			startDate: DataTypes.DATE,
			endDate: DataTypes.DATE
        },

        {
            associate: function(models) {
                ScholarshipSetting.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
            }
        }
    );

    return ScholarshipSetting;
};
