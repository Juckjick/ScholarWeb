
/**
	* RoleSubSystem Model
	*/

module.exports = function(sequelize, DataTypes) {

	var RoleSubSystem = sequelize.define('RoleSubSystem', 
		{
			// adding: { type: DataTypes.BOOLEAN, defaultValue: false },
			// updating: { type: DataTypes.BOOLEAN, defaultValue: false },
			// deleting: { type: DataTypes.BOOLEAN, defaultValue: false },
			// viewing: { type: DataTypes.BOOLEAN, defaultValue: false }
		}
	);

	return RoleSubSystem;
};
