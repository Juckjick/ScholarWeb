
/**
	* ChildCare Model
	*/

module.exports = function(sequelize, DataTypes) {

	var ChildCare = sequelize.define('ChildCare', 
		{
			name: DataTypes.STRING		},
		{
			associate: function(models) {
			}
		}
	);

	return ChildCare;
};
