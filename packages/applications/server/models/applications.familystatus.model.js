
/**
	* FamilyStatus Model
	*/

module.exports = function(sequelize, DataTypes) {

	var FamilyStatus = sequelize.define('FamilyStatus', 
		{
			name: DataTypes.STRING,
		},
		{
			associate: function(models) {
			}
		}
	);

	return FamilyStatus;
};
