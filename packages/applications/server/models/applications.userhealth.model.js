
/**
	* UserHealth Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserHealth = sequelize.define('UserHealth', 
		{
			lastYear: DataTypes.INTEGER,
			lastDay: DataTypes.INTEGER,
			lastDisease: DataTypes.STRING,
			admitYear: DataTypes.INTEGER,
			admitDay: DataTypes.INTEGER,
			admitDisease: DataTypes.STRING,
			admitMoney: DataTypes.DECIMAL(10,2),
			frequentlySick: DataTypes.STRING
		},
		{
			associate: function(models) {
                UserHealth.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserHealth;
};
