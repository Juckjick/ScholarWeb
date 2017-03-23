
/**
	* FamilyRelation Model
	*/

module.exports = function(sequelize, DataTypes) {

	var FamilyRelation = sequelize.define('FamilyRelation', 
		{
			name: DataTypes.STRING
		},
		{
			associate: function(models) {
			}
		}
	);

	return FamilyRelation;
};
