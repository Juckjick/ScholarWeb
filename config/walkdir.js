var fs = require('fs');
var path = require('path');

/**
 * Walk through all model files in all packages directories, ignoring hidden files and an index file
 * @param dir directory path
 * @param callback called for every file item
 */
module.exports = function walkDir(dir, callback) {
    var stat, itemPath;
    fs.readdirSync(dir)
        .filter(function (item) {
            return (item.indexOf('.') !== 0) && (item !== 'index.js');
        })
        .forEach(function (item) {
            itemPath = path.join(dir, item);
            stat = fs.statSync(itemPath);
            if (stat && stat.isDirectory()) {
                walkDir(itemPath, callback);
            } else {
                callback(item, itemPath);
            }
        });
};