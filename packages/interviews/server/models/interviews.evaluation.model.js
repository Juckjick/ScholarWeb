
/**
	* InterviewEvaluation Model
	*/

module.exports = function(sequelize, DataTypes) {

	var InterviewEvaluation = sequelize.define('InterviewEvaluation', 
		{
			score1: DataTypes.INTEGER,
			score2: DataTypes.INTEGER,
			score3: DataTypes.INTEGER,
			score4: DataTypes.INTEGER,
			score5: DataTypes.INTEGER,
			getScholarship: DataTypes.BOOLEAN
		},
		{
			associate: function(models) {
                InterviewEvaluation.belongsTo(models.AcademicYear, {onDelete: 'RESTRICT'});
                InterviewEvaluation.belongsTo(models.SubBudget, {onDelete: 'RESTRICT'});
				InterviewEvaluation.belongsTo(models.User, {as: 'Student'});
				InterviewEvaluation.belongsTo(models.User, {as: 'Evaluator'});
			}
		}
	);

	return InterviewEvaluation;
};
