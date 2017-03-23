
/**
	* UserCash Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserCash = sequelize.define('UserCash', 
		{
			isIncome: DataTypes.BOOLEAN,
			typeId: DataTypes.INTEGER,
			typeName: DataTypes.STRING,
			total: DataTypes.DECIMAL(10,2),
			source: DataTypes.STRING
		},
		{
			associate: function(models) {
                UserCash.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserCash;
};
