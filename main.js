var board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var score = 0;
var moved;

//초기화
function init() {
    for(var i=0; i<4; i++)
        for(var j=0; j<4; j++)
            board[i][j] = 0;
    score = 0;
    makeTwo();
    makeTwo();
    draw();
}

//화면 갱신
function draw() {
    document.getElementById("score").innerHTML = score;
    for(var i=0; i<4; i++)
        for(var j=0; j<4; j++) {
            if(board[i][j] == 0)
                document.getElementById(i.toString()+j.toString()).innerHTML = "";
            else
                document.getElementById(i.toString()+j.toString()).innerHTML = board[i][j];
            if(board[i][j] <= 4096)
                document.getElementById(i.toString()+j.toString()).className = "block" + board[i][j];
            else
                document.getElementById(i.toString()+j.toString()).className = "blockOver";
        }
}

//랜덤한 위치에 2(또는 4) 생성
function makeTwo() {
    var x, y
    do {
        x = Math.floor(Math.random() * 4);
        y = Math.floor(Math.random() * 4);
    }
    while(board[x][y] != 0);
    if(Math.random() < 0.1)
        board[x][y] = 4;
    else
        board[x][y] = 2;
}

//게임오버
function gameOver() {
    alert("Game Over!\nScore: " + score);
    init();
}

//타일 밀기
function push(arr) {
    var prev = [arr[0], arr[1], arr[2], arr[3]]
    arr = arr.filter(arr => arr != 0);
    for(var i=0; i<arr.length-1; i++){
        if(arr[i] == arr[i+1]) {
            arr[i] *= 2;
            arr[i+1] = 0;
            score += arr[i];
        }
    }
    arr = arr.filter(arr => arr != 0);
    while(arr.length < 4) {
        arr.push(0);
    }
    for(var i=0; i<4; i++)
        if(arr[i] != prev[i])
            moved = true
    return arr;
}

//타일 이동
//push()에 밀 값을 정리해 보내고, 밀어진 값을 리턴받아 board에 적용
function move(dir) {
    var temp;
    moved = false;
    switch(dir) {
        case 1:     //Left
            for(var i=0; i<4; i++) {
                temp = push([board[i][0], board[i][1], board[i][2], board[i][3]]);
                board[i][0] = temp[0];
                board[i][1] = temp[1];
                board[i][2] = temp[2];
                board[i][3] = temp[3];
            }
            break;
        case 2:     //Up
            for(var i=0; i<4; i++) {
                temp = push([board[0][i], board[1][i], board[2][i], board[3][i]]);
                board[0][i] = temp[0];
                board[1][i] = temp[1];
                board[2][i] = temp[2];
                board[3][i] = temp[3];
            }
            break;
        case 3:     //Right
            for(var i=0; i<4; i++) {
                temp = push([board[i][3], board[i][2], board[i][1], board[i][0]]);
                board[i][3] = temp[0];
                board[i][2] = temp[1];
                board[i][1] = temp[2];
                board[i][0] = temp[3];
            }
            break;
        case 4:     //Down
            for(var i=0; i<4; i++) {
                temp = push([board[3][i], board[2][i], board[1][i], board[0][i]]);
                board[3][i] = temp[0];
                board[2][i] = temp[1];
                board[1][i] = temp[2];
                board[0][i] = temp[3];
            }
            break;
    }

    //밀었으면 makeTow()로 새로운 2 생성
    var flag = false
    for(var i=0; i<4; i++)
        for(var j=0; j<4; j++)
            if(board[i][j] == 0)
                flag = true;
    if(flag) {
        if(moved) {
            makeTwo();
            var sound_push = new Audio('./sound/effect.mp3');
            sound_push.play();
        }
    }
    else {  //게임오버 조건 확인
        flag = true
        for(var i=0; i<4; i++)
            for(var j=0; j<3; j++)
                if(board[i][j] == board[i][j+1] || board[j][i] == board[j+1][i])
                    flag = false;
        if(flag) {
            var sound_fail = new Audio('./sound/fail.mp3');
            sound_fail.play()
            gameOver();
        }
    }
    draw();
}

//키 입력
document.addEventListener("keydown", keyInput, false);
function keyInput(e) {
    switch(e.keyCode) {
        case 37:    //Left
            move(1);
            break;
        case 38:    //Up
            move(2);
            break;
        case 39:    //Right
            move(3);
            break;
        case 40:    //Down
            move(4);
            break;
    }
}

init();