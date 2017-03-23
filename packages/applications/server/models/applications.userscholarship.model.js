
/**
	* UserScholarship Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserScholarship = sequelize.define('UserScholarship', 
		{
			academicYear: DataTypes.STRING,
			type: DataTypes.STRING,
			name: DataTypes.STRING,
			total: DataTypes.DECIMAL(10,2),
			momentId: DataTypes.INTEGER,
			momentName: DataTypes.STRING
		},
		{
			associate: function(models) {
                UserScholarship.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserScholarship;
};
