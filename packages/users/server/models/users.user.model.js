
/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			fullname: DataTypes.STRING,
			email: DataTypes.STRING,
			username: { type: DataTypes.STRING, unique: true},
			startDate: DataTypes.DATE,
			endDate: DataTypes.DATE,
			hashedPassword: DataTypes.STRING,
			provider: DataTypes.STRING,
			salt: DataTypes.STRING 
		},
		{
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) return '';
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				}
			},
			associate: function(models) {
                User.hasOne(models.UserAdoption, {onDelete: 'RESTRICT'});
                User.hasOne(models.UserProfile, {onDelete: 'RESTRICT'});
                User.hasOne(models.UserReason, {onDelete: 'RESTRICT'});
                User.hasOne(models.UserHealth, {onDelete: 'RESTRICT'});
                User.hasOne(models.UserActivity, {onDelete: 'RESTRICT'});
								
				User.hasMany(models.Role, {through: models.UserRole, onDelete: 'CASCADE'});
                User.hasMany(models.UserAddress, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserCash, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserContact, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserFamily, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserLoan, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserScholarship, {onDelete: 'RESTRICT'});
                User.hasMany(models.UserFile, {onDelete: 'RESTRICT'});
			}
		}
	);

	return User;
};
