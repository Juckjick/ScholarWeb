
/**
	* System Model
	*/

module.exports = function(sequelize, DataTypes) {

	var System = sequelize.define('System', 
		{
			name: DataTypes.STRING,
			description: DataTypes.STRING,
			link: DataTypes.STRING,
			icon: DataTypes.STRING
		},
		{
			associate: function(models) {
				System.hasMany(models.SubSystem);
			}
		}
	);

	return System;
};
