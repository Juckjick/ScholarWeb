
/**
	* File Model
	*/

module.exports = function(sequelize, DataTypes) {

	var File = sequelize.define('File', 
		{
			name: DataTypes.STRING		},
		{
			associate: function(models) {
			}
		}
	);

	return File;
};
