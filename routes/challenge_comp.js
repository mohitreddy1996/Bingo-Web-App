var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');
var utils = require('../app/utils');

var playRouter = express.Router();
// made global. increased for every new user.
var userId = 0;

// user map from UserId(userId in database) to an integer.
var userMap = {};

// Game status 1 if a game is going on.
// Game status 0 if a new game is to be started.
var userGameStatus = {};

// User matrix.
var userMatrixMap = {};

// User matrix already marked
var userMatrixDoneMap = {};

// Comp Matrix for a user.
var compMatrixMap = {};

// Comp matrix already marked matrix.
var compMatrixDoneMap = {};

// Comp value to X, Y Co Ordinates.
var compValueCoOrdMap = {};

// User value to X, Y Co Ordinates.
var userValueCoOrdMap = {};


playRouter.route('/')
    .post(function (req, res, next) {
        var Id = req.query.uid;
        if(!(Id in userMap)){
            userMap[Id] = ++userId;
        }
        res.render('challenge_comp');

    });

playRouter.route("/play")
    .post(function(req, res, next){
        var Id = req.query.uid;
        var uId = userMap[Id];

        // Required User steps.
        var Mat = [], compMat = [];
        var doneMat = [], compDoneMat = [];
        userValueCoOrdMap[uId] = {};
        for(var row = 1; row<=5; row++){
            doneMat[row] = []; compDoneMat[row] = [];
            Mat[row] = []; compMat[row] = [];
            for(var col = 1; col<=5; col++){
                doneMat[row][col] = 0; compDoneMat[row][col] = 0;
                Mat[row][col] = req.body[(row.toString()).concat(col.toString())];
                var userXYMap = {};
                userXYMap["X"] = row;
                userXYMap["Y"] = col;
                userValueCoOrdMap[uId][Mat[row][col]] = userXYMap;
            }
        }
        userMatrixMap[uId] = Mat; compMatrixMap[uId] = compMat;
        userMatrixDoneMap = doneMat; compMatrixDoneMap[uId] = compDoneMat;
        userGameStatus[uId] = 1;

        // Required Computer steps.
        var doneUserMap = {};
        doneUserMap[uId] = {};
        compValueCoOrdMap[uId] = {};
        for(var values = 1; values<=25;){
            while(1){
                var randInt = utils.getRandomInt(1,25);
                if(!(randInt in doneUserMap[uId])){
                    doneUserMap[uId][randInt] = 1;
                    var r = utils.getRow(values);
                    var c = utils.getCol(values);
                    compMatrixMap[uId][r][c] = randInt;
                    var XYMap = {};
                    XYMap["X"] = r;
                    XYMap["Y"] = c;
                    compValueCoOrdMap[uId][randInt] = XYMap;
                    break;
                }
            }
            values++;
        }

        res.render('play', {value1: req.body["11"],
            value2: req.body["12"],
            value3: req.body["13"],value4: req.body["14"], value5: req.body["15"], value6: req.body["21"], value7: req.body["22"], value8: req.body["23"], value9: req.body["24"], value10: req.body["25"], value11: req.body["31"], value12: req.body["32"], value13: req.body["33"], value14: req.body["34"],
            value15: req.body["35"], value16: req.body["41"], value17: req.body["42"], value18: req.body["43"], value19: req.body["44"], value20: req.body["45"], value21: req.body["51"], value22: req.body["52"], value23: req.body["53"], value24: req.body["54"], value25: req.body["55"]
        });

    });

playRouter.route("/play/score")
    .get(function (req, res, next) {
        var uId = req.query.uid;
        uId = userMap[uId];

        // receive data from user. Mark in user map.
        var xCoOrd = req.query.xCoOrd;
        var yCoOrd = req.query.yCoOrd;
        var userValueAtCoOrds = userMatrixMap[uId][xCoOrd][yCoOrd];
        userMatrixDoneMap[uId][xCoOrd][yCoOrd] = 1;

        // mark it for comp player also.
        var XYMap = compValueCoOrdMap[uId][userValueAtCoOrds];
        xCoOrd = XYMap["X"];
        yCoOrd = XYMap["Y"];

        compMatrixDoneMap[uId][xCoOrd][yCoOrd] =1;

        // check comp player bingo.
        utils.checkBingo(compMatrixDoneMap[uId], function(ans){
            if(ans>=5){
                // is bingo.
                res.send({val: -1, isBingo: true});
            }else{
                // not bingo.
                // select a random number from comp matrix.
                var r,c;
                while(1){
                    r = utils.getRandomInt(1,5);
                    c = utils.getRandomInt(1,5);
                    if(compMatrixDoneMap[uId][r][c] == 0){
                        break;
                    }
                }
                var val = compMatrixMap[uId][r][c];
                compMatrixDoneMap[uId][r][c] = 1;
                // check comp player bingo.
                utils.checkBingo(compMatrixDoneMap[uId], function (isBingo) {
                    // send required data.
                    if(isBingo>=5){
                        // is Bingo.
                        res.send({val: -1, isBingo: true});
                    } else{
                        // Not Bingo.
                        var xymap = userValueCoOrdMap[uId][val];
                        var indVal = (xymap["X"]-1)*5 + xymap["Y"];
                        res.send({val: val, isBingo: false, indVal: indVal});
                    }
                });
            }
        });

    });


playRouter.route("/winner")
    .get(function (req, res, pass) {
        // Update The Winner and user stats.
        var winner = req.query.winner;
        mongoHelper.addWinner(props.BINGO_USER, props.SCORE, req.query.uid, winner, function (err, dbResults) {
            if(err){
                res.status(500).json("Error while updating database.");
            }else{
                res.redirect('/home?uid=' + req.query.uid);
            }
        });
    });

module.exports = playRouter;