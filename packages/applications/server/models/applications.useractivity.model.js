
/**
	* UserActivity Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserActivity = sequelize.define('UserActivity', 
		{
			university: DataTypes.STRING(500),
			faculty: DataTypes.STRING(500),
			outside: DataTypes.STRING(500)
		},
		{
			associate: function(models) {
                UserActivity.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserActivity;
};
