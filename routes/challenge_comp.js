var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');

var challenge_comp_router = express.Router();

challenge_comp_router.route('/')
    .post(function (req, res, next) {
        res.render('challenge_comp');
});

module.exports = challenge_comp_router;