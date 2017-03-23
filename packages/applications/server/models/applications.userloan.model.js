
/**
	* UserLoan Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserLoan = sequelize.define('UserLoan', 
		{
			typeId: DataTypes.INTEGER,
			typeName: DataTypes.STRING,
			goalId: DataTypes.INTEGER,
			goalName: DataTypes.STRING,
			firstSemester: DataTypes.BOOLEAN,
			secondSemester: DataTypes.BOOLEAN
		},
		{
			associate: function(models) {
                UserLoan.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserLoan;
};
