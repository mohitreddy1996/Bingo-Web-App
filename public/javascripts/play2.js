var intervalId;
var oppId = -1;
var gameWinner;

function getUserId(){
    var url = window.location.href;
    return url.substring(url.indexOf("=")+1, url.length);
}

function enableLoader() {
    $("#loading").removeClass('hide');
}

function disableLoader(){
    $("#loading").addClass('hide');
}

function enableDOM(Id) {
    document.getElementById(Id).disabled = false;
}

function disableDOM(Id) {
    document.getElementById(Id).disabled = true;
}

function changeHeaderOpp(oppId) {
    document.getElementById("header_opp").innerHTML = "Your Opponent " + oppId;
}

function endBingo(winner) {
    gameWinner = winner;
    document.getElementById("finalResult").innerHTML = "Winner is : " + winner;
    disableDOM("submit");
    $("#redirect").show();
    document.getElementById("redirect").style.visibility = "visible";
}



function check_error() {
    window.alert("Not Allowed Try again!");
}

function displayBingo() {
    var ans = 0;
    var Id;
    for(var i = 1; i <= 5; i++){
        var flag = 1;
        for(var j=0; j<5; j++){
            Id = "value".concat((i + 5*j).toString());
            if(document.getElementById(Id).disabled == false){
                flag = 0;
            }
        }
        if(flag == 1){
            ans++;
        }
    }

    // check rows.
    for(var col = 0; col<5; col++){
        var flag1 = 1;
        for(var row = 1; row<=5; row++){
            Id = "value".concat((row + col*5).toString());
            if(document.getElementById(Id).disabled == false){
                flag1 = 0;
            }
        }
        if(flag1 == 1){
            ans++;
        }
    }

    // check diagonals1.
    var flag3 = 1, flag4 = 1
    for(var xdiag = 1, ydiag=0; xdiag<=5; xdiag++, ydiag++){
        Id = "value".concat((xdiag + ydiag*5).toString());
        if(document.getElementById(Id).disabled == false){
            flag3 = 0;
        }
        Id = "value".concat((ydiag*5 + (5 - xdiag + 1)).toString());
        if(document.getElementById(Id).disabled == false){
            flag4 = 0;
        }
    }

    if(flag3 == 1){
        ans++;
    }
    if(flag4 == 1){
        ans++;
    }

    switch (ans) {
        case 0:
            document.getElementById("output_ans").innerHTML = "";
            break;
        case 1:
            document.getElementById("output_ans").innerHTML = "B";
            break;
        case 2:
            document.getElementById("output_ans").innerHTML = "BI";
            break;
        case 3:
            document.getElementById("output_ans").innerHTML = "BIN";
            break;
        case 4:
            document.getElementById("output_ans").innerHTML = "BING";
            break;
        case 5:
            document.getElementById("output_ans").innerHTML = "BINGO";
            break;
        default:
            document.getElementById("output_ans").innerHTML = "BINGO";
    }
}

function updateBingo(value) {
    document.getElementById("value" + value.toString()).disabled = true;
    displayBingo();
}

function fetch_chances() {
    var params = {};
    params.oppId = oppId;
    $.get('/challenge_user/chance?uid=' + getUserId(), params, function (data) {
        // check for isBingo, isMyTurn, value selected by opponent, winner.
        if(data.isBingo){
            gameWinner = data.winner;
            endBingo(gameWinner);
        }
        else if(data.isMyTurn){
            if(data.oppLastVal != -1)
                updateBingo(data.oppLastVal);
            disableLoader();
            enableDOM("submit");
        }else {
            // if opponents chance.
            if(data.oppLastVal != -1)
                updateBingo(data.oppLastVal);
            setTimeout(fetch_chances, 5000);
        }
    });

}

$(document).ready(function () {
    document.getElementById("redirect").style.visibility = "hidden";
    document.getElementById("submit").disabled = true;
    intervalId = setInterval(function () {
        var params = {};
        $.get('/challenge_user/search?uid=' + getUserId(), params, function(data){
            if(data.oppFound == true){
                // Output opposition name. abort setInterval. call function.
                oppId = data.oppId;
                changeHeaderOpp(data.oppId);
                enableLoader();
                fetch_chances();
                clearTimeout(intervalId);
            }
        });
    }, 2000);

});

$(function () {
    $("#submit").on('click', function () {
        // find X and Y coordinates.
        var id;
        var flag = 0;
        var elems = document.getElementsByName("bingo");
        for(var i=0; i<elems.length; i++){
            if(elems[i].checked && elems[i].disabled == false){
                id = elems[i].id;
                flag=1
                break;
            }
        }
        // check for error.
        if(flag === 0){
            check_error();
            return;
        }
        document.getElementById(id).disabled = true;
        // disable submit button.
        disableDOM("submit");
        enableLoader();
        displayBingo();
        var value = id.substring(id.indexOf("e")+1, id.length);
        value = parseInt(value);
        x = parseInt((value-1)/5) + 1;
        y = (value-1)%5 + 1;
        var parameters = {Xcoord: x, Ycoord: y};
        // send to server.
        $.get('/challenge_user/data?uid=' + getUserId(), parameters, function (data) {
            fetch_chances();
        });
    });

    $("#redirect").on('click', function () {
        var params = {};
        params.uid = getUserId();
        params.oppId = oppId;
        params.winner = gameWinner;
        $.get('/challenge_user/winner', params, function (data) {

        }) ;
    });
});