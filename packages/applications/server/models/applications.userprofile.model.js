
/**
	* UserProfile Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserProfile = sequelize.define('UserProfile', 
		{
			firstnameTh: DataTypes.STRING,
			lastnameTh: DataTypes.STRING,
			firstnameEn: DataTypes.STRING,
			lastnameEn: DataTypes.STRING,
			studentId: DataTypes.STRING,
			identityCard: DataTypes.STRING,
			email: DataTypes.STRING,
			birthday: DataTypes.DATE,
			religion: DataTypes.STRING,
			numberSibling: DataTypes.INTEGER,
			birthOrder: DataTypes.INTEGER,
			mobile: DataTypes.STRING,
			isNewStudent: DataTypes.BOOLEAN,
			gradeAvg: DataTypes.DECIMAL(10,2),
			major: DataTypes.STRING,
			advisor: DataTypes.STRING,
			gpa: DataTypes.DECIMAL(10,2),
			academicYear: DataTypes.INTEGER,	
			hasScholarship: DataTypes.BOOLEAN,
			credit: DataTypes.DECIMAL(10,2),
			stayWith: DataTypes.STRING,
			familyStatusNote: DataTypes.STRING,
			JobNote: DataTypes.STRING
		},
		{
			associate: function(models) {
				UserProfile.belongsTo(models.Faculty);
				UserProfile.belongsTo(models.Department);
                UserProfile.belongsTo(models.Major);
				UserProfile.belongsTo(models.FamilyStatus);
				UserProfile.belongsTo(models.ChildCare);
				UserProfile.belongsTo(models.Job);
                UserProfile.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
	            UserProfile.belongsTo(models.Title);
			}
		}
	);

	return UserProfile;
};
