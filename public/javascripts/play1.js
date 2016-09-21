var already_checked_elements = [];
var x,y;
var gameWinner;
function disable_element(Id) {
    //document.getElementById(Id).checked = true;
    document.getElementById(Id).disabled = true;
}
function enable_element(Id) {
    document.getElementById(Id).disabled = false;
}
function init_X_Y(Id) {
    var value = Id.substring(Id.indexOf("e")+1, Id.length);
    value = parseInt(value);
    x = (value-1)/5 + 1;
    y = (value-1)%5 + 1;
}

function check_error() {
    window.alert("Not Allowed Try again!");
}

function enable_loader() {
    $("#loading").removeClass('hide');
}

function disable_loader(){
    $("#loading").addClass('hide');
}

function checkAndDisable(value) {
    document.getElementById("value" + value.toString()).disabled = true;

}

function endGame(winner) {
    gameWinner = winner;
    document.getElementById("finalResult").innerHTML = "Winner is : " + winner;
    $("#redirect").show();
    document.getElementById("redirect").style.visibility = "visible";
}

$(function () {
    $("#redirect").on('click', function () {
        location.href = "/challenge_comp/winner?winner=" + gameWinner + "&uid=" + getUserId();
    });
});


function check_for_bingo() {
    var ans = 0;
    // check columns.
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
            return;

    }

    return ans;
}

function getUserId() {
    var url = window.location.href;
    return url.substring(url.indexOf("=")+1, url.length);
}

$(document).ready(function () {
    document.getElementById("redirect").style.visibility = "hidden";
});

$(function(){
    $('#submit').on('click', function () {
        //get_checked_elements();
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
        if(flag === 0){
            check_error();
            return;
        }
        document.getElementById(id).disabled = true;
        disable_element("submit");
        enable_loader();
        var ans;
        ans = check_for_bingo();
        if(ans>=5){
            endGame(getUserId());
            return;
        }
        var value = id.substring(id.indexOf("e")+1, id.length);
        value = parseInt(value);
        x = parseInt((value-1)/5) + 1;
        y = (value-1)%5 + 1;
        var parameters = {xCoOrd: x, yCoOrd: y};
        $.get('/challenge_comp/play/score?uid=' + getUserId(), parameters, function (data) {
            if(data.val == -1){
                endGame("Computer");
                return;
            }
            checkAndDisable(data.indVal);
            $("#results").html("Value Selected by the Computer : " + (data.val).toString());
            ans = check_for_bingo();
            if(ans>=5){
                endGame(getUserId());
                return;
            }
            disable_loader();
            enable_element("submit");
        });
    });
});