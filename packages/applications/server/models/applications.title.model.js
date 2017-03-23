/**
 * Title Model
 */

module.exports = function(sequelize, DataTypes) {

    var Title = sequelize.define('Title', {
        nameTh: DataTypes.STRING,
        nameEn: DataTypes.STRING
    }, {
        associate: function(models) {}
    });

    return Title;
};
