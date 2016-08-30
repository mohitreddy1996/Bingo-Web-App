var express = require('express');
var request = require('request');
var mongoHelper = require('../app/mongo_helper');
var registerRouter = express.Router();

/* GET Register Page */

registerRouter.get('/', function (req, res, next) {
    res.render('register');
});


registerRouter.route("/submit")
    .post(function (req, res) {

    });


module.exports = registerRouter;