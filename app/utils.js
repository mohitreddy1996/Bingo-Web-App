var utils = {};

utils.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

utils.getRow = function(value){
    return parseInt((value-1)/5) + 1;
};

utils.getCol = function (value) {
    return (value-1)%5 + 1;  
};

module.exports = utils;