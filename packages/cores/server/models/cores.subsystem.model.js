'use strict';
/**
 * SubSystem Model
 */

module.exports = function(sequelize, DataTypes) {

    var SubSystem = sequelize.define('SubSystem', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        link: DataTypes.STRING,
        icon: DataTypes.STRING
    }, {
        associate: function (models) {
            SubSystem.hasMany(models.Role, {
                through: models.RoleSubSystem,
                onDelete: 'cascade'
            });
            SubSystem.hasMany(models.Api);
        }
    });

    return SubSystem;
};
