
/**
	* Role Model
	*/

module.exports = function(sequelize, DataTypes) {

	var Role = sequelize.define('Role', 
		{
			name: DataTypes.STRING,
			description: DataTypes.STRING
		},
		{
			associate: function(models) {
				Role.hasMany(models.User, {through: models.UserRole, onDelete: 'RESTRICT'});
				Role.hasMany(models.SubSystem, {through: models.RoleSubSystem, onDelete: 'cascade'});
			}
		}
	);

	return Role;
};
