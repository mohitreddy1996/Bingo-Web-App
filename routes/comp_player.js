var express = require('express');
var mongoHelper = require('../app/mongo_helper');
var props = require('../app/properties');
var cons = require('../app/constants');

var playRouter = express.Router();

playRouter.route('/')
    .post(function(req, res, next){
        //req.body to get all the values from the matrix.
        res.render('play', {value1: req.body["11"],
            value2: req.body["12"],
            value3: req.body["13"],value4: req.body["14"], value5: req.body["15"], value6: req.body["21"], value7: req.body["22"], value8: req.body["23"], value9: req.body["24"], value10: req.body["25"], value11: req.body["31"], value12: req.body["32"], value13: req.body["33"], value14: req.body["34"],
            value15: req.body["35"], value16: req.body["41"], value17: req.body["42"], value18: req.body["43"], value19: req.body["44"], value20: req.body["45"], value21: req.body["51"], value22: req.body["52"], value23: req.body["53"], value24: req.body["54"], value25: req.body["55"]});
    });

playRouter.route('/score')
    .get(function (req, res, next) {
        res.send("Hello");
    });



module.exports = playRouter;