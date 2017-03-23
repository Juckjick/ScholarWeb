
/**
	* UserFamily Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserFamily = sequelize.define('UserFamily', 
		{
			fullname: DataTypes.STRING,
			age: DataTypes.INTEGER,
			isAlive: DataTypes.BOOLEAN,
			education: DataTypes.STRING,
			job: DataTypes.STRING,
			place: DataTypes.STRING,
			phone: DataTypes.STRING,
			mobile: DataTypes.STRING,
			revenue: DataTypes.DECIMAL(10,2),
			revenueYear: DataTypes.DECIMAL(10,2),
			revenueExtra: DataTypes.DECIMAL(10,2),
			revenueNet: DataTypes.DECIMAL(10,2),
			FamilyRelationNote: DataTypes.STRING
		},
		{
			associate: function(models) {		
				UserFamily.belongsTo(models.FamilyRelation);
                UserFamily.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserFamily;
};
