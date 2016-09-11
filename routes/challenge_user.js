var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');
var utils = require('../app/utils');
var nodeCache = require('node-cache');
var async = require('async');

var challenge_user_router = express.Router();

var userId = 0;
var myCache = new nodeCache();

// User map from uid to userId.
var userMap = {};

var userRevMap = {};

// User to user map. Required for match ups.
var userToUserMap = {};

// user to the matrix for the game.
var userMatrixMap = {};

// user's done matrix map.
var userDoneMatrixMap = {};

// value to the Coordinates map. For faster access.
var userValueToXYMap = {};

// Chance of the user.
var userChance = {};


var userLastMove = {};


challenge_user_router.route('/')
    .post(function (req, res, next) {
        if(!(req.query.uid in userMap)){
            userMap[req.query.uid] = ++userId;
            userRevMap[userId] = req.query.uid;
            userToUserMap[userId] = -1;
        }
        res.render('challenge_user');
});

// Cache to store the users available to play.
// Map an user to another. Consider double mapping.
// Lock design to assign chances. Randomly allocate to anyone in the beginning.
// client side : if the chance is not his, disable submit button. make calls every particular to listen to any data being sent.
// clear user data when game done.

challenge_user_router.route('/play')
    .post(function (req, res, next) {
        // Get the matrix of the user. Reverse map the value to the XY.
        // Cache the uid.
        // Then check for another user in the cache. Once found redirect to another route.
        var Id = req.query.uid;
        var uId = userMap[Id];

        // Required User steps.
        var Mat = [];
        var doneMat = [];
        userValueToXYMap[uId] = {};
        for(var row = 1; row<=5; row++){
            doneMat[row] = [];
            Mat[row] = [];
            for(var col = 1; col<=5; col++){
                doneMat[row][col] = 0;
                Mat[row][col] = req.body[(row.toString()).concat(col.toString())];
                var userXYMap = {};
                userXYMap["X"] = row;
                userXYMap["Y"] = col;
                userValueToXYMap[uId][Mat[row][col]] = userXYMap;
            }
        }
        userMatrixMap[uId] = Mat;
        userDoneMatrixMap[uId] = doneMat;

        myCache.set(Id, uId);

        // render the file.
        res.render('play2', {value1: req.body["11"],
            value2: req.body["12"],
            value3: req.body["13"],value4: req.body["14"], value5: req.body["15"], value6: req.body["21"], value7: req.body["22"], value8: req.body["23"], value9: req.body["24"], value10: req.body["25"], value11: req.body["31"], value12: req.body["32"], value13: req.body["33"], value14: req.body["34"],
            value15: req.body["35"], value16: req.body["41"], value17: req.body["42"], value18: req.body["43"], value19: req.body["44"], value20: req.body["45"], value21: req.body["51"], value22: req.body["52"], value23: req.body["53"], value24: req.body["54"], value25: req.body["55"]
        });
    });

challenge_user_router.route("/search")
    .get(function(req, res, next){
        var Id = req.query.uid;
        var oppId;
        var resObj = {};
        resObj.oppFound = false;
        resObj.oppId = oppId;
        if(userToUserMap[userMap[Id]] != -1){
            resObj.oppFound = true;
            resObj.oppId = userRevMap[userToUserMap[userMap[Id]]];
            res.send(resObj);
            return;
        }
        var keys = myCache.keys();
        var ind = utils.getRandomInt(0, keys.length -1);
        oppId = keys[ind];

        if(oppId != Id && userToUserMap[userMap[oppId]] == -1 && userToUserMap[userMap[Id]] == -1){
            userToUserMap[userMap[oppId]] = userMap[Id];
            userToUserMap[userMap[Id]] = userMap[oppId];
            userChance[userMap[Id]] = 1;
            userChance[userMap[oppId]] = 0;
            userLastMove[userMap[Id]] = -1;
            userLastMove[userMap[oppId]] = -1;
            myCache.del(oppId);
            myCache.del(Id);
            resObj.oppFound = true;
            resObj.oppId = oppId;
        }
        res.send(resObj);
    });

challenge_user_router.route("/chance")
    .get(function (req, res, pass) {
        var resObj = {};
        resObj.isMyTurn = userChance[userMap[req.query.uid]] == 1;
        resObj.oppLastVal = userLastMove[userToUserMap[userMap[req.query.uid]]];
        resObj.isBingo = false;
        resObj.winner = -1;
        utils.checkBingo(userDoneMatrixMap[userMap[req.query.uid]], function (isBingo) {
            if(isBingo>=5){
                resObj.isBingo = true;
                resObj.winner = req.query.uid;
                res.send(resObj);
            } else{
                utils.checkBingo(userDoneMatrixMap[userToUserMap[userMap[req.query.uid]]], function (isBingo2) {
                    if(isBingo2>=5){
                        resObj.isBingo = true;
                        resObj.winner = userRevMap[userToUserMap[req.query.uid]];
                        res.send(resObj);
                    }else {
                        res.send(resObj);
                    }
                })
            }
        });
    });

challenge_user_router.route("/data")
    .get(function (req, res, next) {
        var Id = req.query.uid; 
        var X = req.query.Xcoord;
        var Y = req.query.Ycoord;
        // update for user done matrix. update for opponent done matrix.
        // Change chance. update opponent last move.
        userDoneMatrixMap[userMap[Id]][X][Y] = 1;
        var val = userMatrixMap[userMap[Id]][X][Y];
        var XYMap = userValueToXYMap[userToUserMap[userMap[Id]]][val];
        userDoneMatrixMap[userToUserMap[userMap[Id]]][XYMap["X"]][XYMap["Y"]] = 1;
        userLastMove[userMap[Id]] = (XYMap["X"]-1)*5 + XYMap["Y"];
        
        userChance[userMap[Id]] = 0;
        userChance[userToUserMap[userMap[Id]]] = 1;
        res.send("Hello");
    });

module.exports = challenge_user_router;