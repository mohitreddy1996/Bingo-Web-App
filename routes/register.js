var express = require('express');
var request = require('request');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/properties');

var registerRouter = express.Router();

/* GET Register Page */

registerRouter.get('/', function (req, res, next) {
    res.render('register');
});


registerRouter.post("/submit", function (req, res) {
    var userId = req.body.userId;
    var name = req.body.userName;
    var password = req.body.password;

    if(userId == null || name == null || password == null){
        res.status(500).send("The fields can not be empty");
        return;
    }

    mongoHelper.findUser(props.BINGO_USER, props.USERS, userId, function (err, dbRes) {
        if(err){
            res.status(500).json("Error while saving data into database. Error : " + err);
        }else{
            if(dbRes.length>0){
                res.status(500).json("User Name Already Exists." + err);
            }else{
                mongoHelper.addUser(props.BINGO_USER, props.USERS, name, userId, password, function (err, dbRes) {
                    if(err){
                        res.status(500).json("Error while saving data into database. Error : " + err);
                    } else{
                        res.status(200).json("Saved!");
                    }
                });
            }
        }
    });
});


module.exports = registerRouter;