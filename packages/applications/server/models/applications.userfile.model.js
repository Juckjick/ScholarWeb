
/**
	* UserFile Model
	*/

module.exports = function(sequelize, DataTypes) {

	var UserFile = sequelize.define('UserFile', 
		{
			data: DataTypes.BLOB('medium'),
			mimetype: DataTypes.STRING
		},
		{
			associate: function(models) {
				UserFile.belongsTo(models.File);
                UserFile.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
			}
		}
	);

	return UserFile;
};
