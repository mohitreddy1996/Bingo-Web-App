var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');

var playRouter = express.Router();

playRouter.route('/')
    .post(function(req, res, next){
        //req.body to get all the values from the matrix.
        res.render('play');
    });

module.exports = playRouter;