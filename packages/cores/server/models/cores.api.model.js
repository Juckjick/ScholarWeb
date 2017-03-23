'use strict';
/**
 * Api Model
 */

module.exports = function (sequelize, DataTypes) {

    var Api = sequelize.define('Api', {
        link: DataTypes.STRING
    }, {
        associate: function (models) {
            Api.hasMany(models.SubSystem);
        }
    });

    return Api;
};
