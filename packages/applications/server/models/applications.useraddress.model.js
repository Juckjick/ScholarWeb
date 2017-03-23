
/**
	* UserAddress Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserAddress = sequelize.define('UserAddress', 
		{
			momentId: DataTypes.INTEGER,
			momentName: DataTypes.STRING,
			address: DataTypes.STRING,
			zipcode: DataTypes.STRING,
			telephone: DataTypes.STRING
		},
		{
			associate: function(models) {
                UserAddress.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
				UserAddress.belongsTo(models.Province);
			}
		}
	);

	return UserAddress;
};
