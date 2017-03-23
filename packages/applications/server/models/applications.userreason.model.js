
/**
	* UserReason Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserReason = sequelize.define('UserReason', 
		{
			reason: DataTypes.STRING(2000),
			solution: DataTypes.STRING(2000)
		},
		{
			associate: function(models) {
                UserReason.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserReason;
};
