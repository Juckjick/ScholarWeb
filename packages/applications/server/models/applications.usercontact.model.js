
/**
	* UserContact Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserContact = sequelize.define('UserContact', 
		{
			fullname: DataTypes.STRING,
			department: DataTypes.STRING,
			faculty: DataTypes.STRING,
			address: DataTypes.STRING,			
			academicYear: DataTypes.INTEGER,
			typeId: DataTypes.INTEGER,
			typeName: DataTypes.STRING
		},
		{
			associate: function(models) {
                UserContact.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserContact;
};
