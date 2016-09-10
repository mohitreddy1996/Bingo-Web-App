var mongoClient = require('mongodb').MongoClient;
var props = require('./properties');
var cons = require('./constants');

var mongo_client = {};
var dbClient = {};

dbClient[props.BINGO_USER] = {url : props.getDBUrl(props.BINGO_USER)};

mongo_client.getDB = function(cb, dbName){
    if(dbName == null){
        dbName = props.BINGO_USER;
    }
    var reqDB = dbName;
    var dbUrl = dbClient[reqDB].url;
    mongoClient.connect(dbUrl, function(err, db){
        if(err){
            console.error('Failed to connect to %s, %s', dbUrl, err, {});
        }else{
            console.log('Mongo Client connected to: ' + dbUrl);
            cb(db);
        }
    });
};

mongo_client.findInDB = function(dbName, collName, query, start, count, cb){
    mongo_client.getDB(function(db){
        var coll = db.collection(collName);
        coll.find(query, {skip: start}).limit(count).toArray(cb);
    }, dbName);
};

mongo_client.insertInDB = function(dbName, collName, dbObj, cb){
    mongo_client.getDB(function(db){
        var coll = db.collection(collName);
        coll.insert(dbObj, cb);
    }, dbName);
};

mongo_client.updateInDB = function(dbName, collName, query, updateObj, upsert, cb){
    mongo_client.getDB(function(db){
        var coll = db.collection(collName);
        coll.update(query, updateObj, {upsert : upsert, w:1}, cb);
    }, dbName);
};



module.exports = mongo_client;