/**
 * Major Model
 */

module.exports = function (sequelize, DataTypes) {

    var Major = sequelize.define('Major',
        {
            name: DataTypes.STRING
        },
        {
            associate: function (models) {
            }
        }
    );

    return Major;
};
