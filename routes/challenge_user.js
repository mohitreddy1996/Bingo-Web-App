var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');

var challenge_user_router = express.Router();

challenge_user_router.route('/')
    .post(function (req, res, next) {
        res.render('challenge_user');
});

module.exports = challenge_user_router;