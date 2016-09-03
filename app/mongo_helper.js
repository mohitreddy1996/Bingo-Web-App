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


mongo_helper.addScore = function (dbName, collName, userId, matches, wins, callback) {
    var mongoObj = {};
    mongoObj._id = userId;
    mongoObj.userId = userId;
    mongoObj.matches = matches;
    mongoObj.wins = wins;

    mongoClient.insertInDB(dbName, collName, mongoObj, callback);
};

mongo_helper.getUserScore = function(dbName, collName, userId, callback) {
    var mongoObj = {};
    mongoObj._id = userId;

    mongoClient.findInDB(dbName, collName, mongoObj, 0, 100, callback);

};

module.exports = mongo_helper;