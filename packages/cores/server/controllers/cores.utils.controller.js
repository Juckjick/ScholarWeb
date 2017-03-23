/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var async = require('async');

/**
 * Insert or update a new object 
 * @param  {String}   dbName, a database name
 * @param  {Object}   newObject, an object to be inserted or updated
 * @param  {Function} callback from async
 * @see    https://github.com/caolan/async
 */
exports.upsertData = function(dbName, newObj, callback) {
    db[dbName].find({
        where: {
            id: newObj.id
        }
    }).success(function(obj) {
        // if it already exists in DB 
        if (obj) {
            // Get object's properties without enumerating over the prototype chain
            var keys = Object.keys(newObj);

            // Loop through all the exist keys of new newObj
            for (var i = 0; i < keys.length; i++) {
                obj[keys[i]] = newObj[keys[i]];
            }
        } else {
            // Build a new newObj
            obj = db[dbName].build(newObj);

        }
        obj.save().success(function() {
            callback();
        }).error(function(err) {
            callback(err);
        });

    }).error(function(err) {
        callback(err);
    });
};

/**
 * Insert or update a new object with a transaction
 * @param  {String}   dbName, a database name
 * @param  {Object}   newObject, an object to be inserted or updated
 * @param  {Transaction}   transaction         
 * @param  {Function} callback from async
 * @see    https://github.com/caolan/async
 */
exports.upsertDataWithTransaction = function(dbName, newObj, transaction, callback) {
    db[dbName].find({
        where: {
            id: newObj.id
        }
    }).success(function(obj) {
        // if it already exists in DB 
        if (obj) {
            // Get object's properties without enumerating over the prototype chain
            var keys = Object.keys(newObj);

            // Loop through all the exist keys of new newObj
            for (var i = 0; i < keys.length; i++) {
                obj[keys[i]] = newObj[keys[i]];
            }
        } else {
            // Build a new newObj
            obj = db[dbName].build(newObj);

        }
        obj.save({
            transaction: transaction
        }).success(function(obj) {
            callback(null, obj);
        }).error(function(err) {
            console.error(err);
            callback(err);
        });

    }).error(function(err) {
        callback(err);
    });
};

/**
 * Delete a given obj from the given Dbname
 * @param  {String}   dbName, a database name
 * @param  {Object}   deleteObj, an object to be deleted
 * @param  {Transaction}   transaction         
 * @param  {Function} callback from async
 * @see    https://github.com/caolan/async
 */
exports.deleteDataWithTransaction = function(dbName, deleteObj, transaction, callback) {
    db[dbName].find({
        where: {
            id: deleteObj.id
        }
    }).success(function(obj) {
        obj.destroy({
            transaction: transaction
        }).success(function() {
            callback();
        }).error(function(err) {
            console.error(err);
            callback(err);
        });

    }).error(function(err) {
        callback(err);
    });

};


/**
 * Find latest data of a student's application
 * @param  {String}   UserId
 * @param  {Integer}  AcademicYearId
 * @param  {Function} callback for async
 * @return {Array}    of an object
 */
exports.findApplicationByUserIdAcademicYearId = function(UserId, AcademicYearId, callback) {
    var databases = [],
        data = {};

    // Add all database objects
    databases.push({name: 'UserActivity'});
    databases.push({name: 'UserAddress', include: [db.Province]});
    databases.push({name: 'UserAdoption'});
    databases.push({name: 'UserCash'});
    databases.push({name: 'UserContact'});
    databases.push({name: 'UserFamily', include: [db.FamilyRelation]});
    databases.push({name: 'UserFile', include: [db.File]});
    databases.push({name: 'UserHealth'});
    databases.push({name: 'UserLoan'});
    databases.push({
        name: 'UserProfile',
        include: [db.FamilyStatus, db.ChildCare, db.Faculty, db.Department, db.Major, db.Job, db.Title, db.AcademicYear]
    });
    databases.push({name: 'UserReason'});
    databases.push({name: 'UserScholarship'});

    // Get all data from DB
    async.eachSeries(databases, function(database, eachCallback) {

        var query = {};

        // Find a student that have applied
        // by using a given AcademicYearId and UserId
        query.where = [
            database.name + '.AcademicYearId = ? && ' + database.name + '.UserId = ?',
            AcademicYearId,
            UserId
        ];

        if (database.include) {
            query.include = database.include;
        }

        db[database.name].findAll(query).success(function(results) {

            // If get files, convert the buffer to base64
            // before convert them to JSON
            if (database.name === 'UserFile') {
                bufferToBase64(results);
            }
            data[database.name] = JSON.parse(JSON.stringify(results));

            eachCallback();

        }).error(function(err) {
            console.log(err);
            eachCallback(err);
        });

    }, function(err) {
        if (err) {
            console.error(err);
            callback(err);
        } else callback(null, data);
    });

      
};

/**
 * Loop through all files and transform Buffer object
 * to ASCII (Base64)
 * @param  {Array} files
 * @return {Array} files
 */
function bufferToBase64(files) {
    for (var i = 0; i < files.length; i++) {
        files[i].dataValues.data = files[i].dataValues.data.toString('base64');
    }
    return files;
}
