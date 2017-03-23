/**
 * AcademicYear Model
 */

module.exports = function(sequelize, DataTypes) {

    var AcademicYear = sequelize.define('AcademicYear', {
    		name: DataTypes.STRING,
			startDate: DataTypes.DATE,
			endDate: DataTypes.DATE
        },

        {
            associate: function(models) {}
        }
    );

    return AcademicYear;
};
