var cons = require('./constants');
var props = {};

props.BINGO_USER = "BingoScore";

props.getDBUrl = function (dbName) {
    if(dbName == props.BINGO_USER){
        return cons.host + ":" + cons.PORT;
    }
};

module.exports = props;