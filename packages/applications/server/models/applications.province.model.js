
/**
	* Province Model
	*/

module.exports = function(sequelize, DataTypes) {

	var Province = sequelize.define('Province', 
		{
			name: DataTypes.STRING
		},
		{
			associate: function(models) {
			}
		}
	);

	return Province;
};
