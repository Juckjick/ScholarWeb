
/**
	* Department Model
	*/

module.exports = function(sequelize, DataTypes) {

	var Department = sequelize.define('Department', 
		{
			name: DataTypes.STRING
		},
		{
			associate: function(models) {
			}
		}
	);

	return Department;
};
