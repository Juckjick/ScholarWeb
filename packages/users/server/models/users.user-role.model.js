
/**
	* UserRole Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserRole = sequelize.define('UserRole', 
		{
			startDate: DataTypes.DATE,
			endDate: DataTypes.DATE
		}
	);

	return UserRole;
};
