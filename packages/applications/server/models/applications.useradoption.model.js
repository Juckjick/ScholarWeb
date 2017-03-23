
/**
	* UserAdoption Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserAdoption = sequelize.define('UserAdoption', 
		{
			number: DataTypes.INTEGER,
			person: DataTypes.STRING,
			debt: DataTypes.INTEGER,
			reason: DataTypes.STRING,
			payment: DataTypes.INTEGER
		},
		{
			associate: function(models) {
                UserAdoption.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserAdoption;
};
