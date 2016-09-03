var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');

var loginRouter = express.Router();

loginRouter.route("/")
    .post(function (req, res, next) {
        var userId = req.body.userId;
        var password = req.body.password;

        mongoHelper.findUser(props.BINGO_USER, props.USERS, userId, function (err, dbResults) {
            if(err){
                res.status(500).json("Error while logging in. Error : " + err);
            } else{
                if(dbResults.length>0){
                    if(dbResults[0].userPassword == password){
                        mongoHelper.getUserScore(props.BINGO_USER, props.SCORE, userId, function(err2, dbRes) {
                            if(err){
                                res.status(500).json("Error while fetching user Score details.");
                            } else{
                                var matches = dbRes[0].matches;
                                var wins = dbRes[0].wins;
                                res.render('main', {name : dbResults[0].userName, matches : matches, wins: wins});
                            }
                        });
                    }else{
                        res.status(500).json("Wrong Password!! Try again!!");
                    }
                }else{
                    res.status(500).json("No such user exists in the Database. Register!");
                }
            }
        });

});


module.exports = loginRouter;