var mongoClient = require('./mongoClient');
var props = require('./properties');
var cons = require('./constants');

var mongo_helper = {};

mongo_helper.addUser = function (dbName, collName, userName, userId, userPassword, callbackFn) {
    var mongoObj = {};
    mongoObj._id = userId;
    mongoObj.userName = userName;
    mongoObj.userId = userId;
    mongoObj.userPassword = userPassword;
    mongoClient.insertInDB(dbName, collName, mongoObj, callbackFn);

};

mongo_helper.findUser = function (dbName, collName, userId, callbackFn) {
    var mongoObj = {};
    mongoObj.userId = userId;
    mongoClient.findInDB(dbName, collName, mongoObj, 0, 100, callbackFn);
};


mongo_helper.updateScore = function (dbName, collName, userId, matches, wins, upsert, callbackFn) {
    var mongoQueryObj = {};
    mongoQueryObj.userId = userId;

    var mongoUpdateObj = {};
    mongoUpdateObj.matches = matches;
    mongoUpdateObj.wins = wins;

    mongoClient.updateInDB(dbName, collName, mongoQueryObj,mongoUpdateObj, upsert, callbackFn);
};

module.exports = mongo_helper;