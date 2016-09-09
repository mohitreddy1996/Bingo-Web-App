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

utils.checkBingo = function (compMat, cb) {
    var ans = 0;

    // check rows;
    for(var i1 = 1; i1<=5; i1++){
        var flag1 = 0;
        for(var j1 = 1; j1<=5; j1++){
            if(compMat[i1][j1] == 0){
                flag1 = 1;
            }
        }
        if(flag1 == 0){
            ans++;
        }
    }

    // check cols;
    for(var i2 = 1; i2<=5; i2++){
        var flag2 = 0;
        for(var j2 = 1; j2<=5; j2++){
            if(compMat[j2][i2] == 0){
                flag2 = 1;
            }
        }
        if(flag2 == 0){
            ans++;
        }
    }

    // check diagonals.
    var flag3 = 0, flag4 = 0;
    for(var i3 = 1; i3<=5; i3++){
        if(compMat[i3][i3] == 0){
            flag3 = 1;
        }

        if(compMat[i3][5-i3+1] == 0){
            flag4 = 1;
        }
    }

    if(flag3 == 0){
        ans++;
    }
    if(flag4 == 0){
        ans++;
    }

    cb(ans);

};

module.exports = utils;