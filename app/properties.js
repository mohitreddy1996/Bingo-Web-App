var cons = require('./constants');
var props = {};

props.BINGO_USER = "BingoScore";
props.USERS = "users";

props.SCORE = "user_score";

props.getDBUrl = function (dbName) {
    if(dbName == props.BINGO_USER){
        return "mongodb://" + cons.host + ":" + cons.PORT + "/" + props.BINGO_USER;
    }
};

module.exports = props;