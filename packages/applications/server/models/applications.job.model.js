
/**
	* Job Model
	*/

module.exports = function(sequelize, DataTypes) {

	var Job = sequelize.define('Job', 
		{
			name: DataTypes.STRING
		},
		{
			associate: function(models) {
			}
		}
	);

	return Job;
};
