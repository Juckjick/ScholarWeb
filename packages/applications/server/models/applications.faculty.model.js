
/**
	* Faculty Model
	*/

module.exports = function(sequelize, DataTypes) {

	var Faculty = sequelize.define('Faculty', 
		{
			name: DataTypes.STRING
		},
		{
			associate: function(models) {
				Faculty.hasMany(models.Department);
			}
		}
	);

	return Faculty;
};
