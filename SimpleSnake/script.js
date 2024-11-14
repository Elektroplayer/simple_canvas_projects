let elm = document.getElementById("canvas");
let ctx = elm.getContext("2d");
let scoreElm = document.getElementById("score");

function fillBlackScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,500,500);
}

function fillCell(x,y) {
    ctx.fillRect(25*x+1.5, 25*y+1.5, 22, 22);
}

let tail = [[3,9],[4,9],[5,9]];
let direction = "right";

let moves = {
    right: function () { return [...tail, [tail[tail.length-1][0]+1, tail[tail.length-1][1]] ] },
    left:  function () { return [...tail, [tail[tail.length-1][0]-1, tail[tail.length-1][1]] ] },
    up:    function () { return [...tail, [tail[tail.length-1][0], tail[tail.length-1][1]-1] ] },
    down:  function () { return [...tail, [tail[tail.length-1][0], tail[tail.length-1][1]+1] ] }
}

function drawSnake(gameover = false) {
    ctx.fillStyle = "blue";

    for(let i = 0; i < tail.length-1 ;i++) {
        fillCell(tail[i][0],tail[i][1])
    }

    ctx.fillStyle = gameover ? "red" : "purple";

    fillCell(tail[tail.length-1][0], tail[tail.length-1][1])
}

function drawFood() {
    ctx.fillStyle = "green";

    food.forEach(elm => {
        fillCell(elm[0], elm[1]);
    });
}

function move(shift = true) {
    if(shift) tail.shift();

    tail = moves[direction]();
}

function checkCollision() {
    let future = moves[direction]();
    let head = future.pop();

    return future.some(elm => elm[0] == head[0] && elm[1] == head[1]) || head[0] < 0 || head[0] > 19 || head[1] < 0 || head[1] > 19
}

let food = [];

function genFood() {
    let freeSpace = [];

    for(let i = 0;i<20;i++) {
        for(let j = 0;j<20;j++) {
            if(!tail.some(elm => elm[0] == i && elm[1] == j) && !food.some(elm => elm[0] == i && elm[1] == j)) freeSpace.push([i,j]);
        }
    }

    if(freeSpace.length == 0) return;

    return freeSpace[Math.floor(Math.random() * freeSpace.length)]
}

food = [genFood(), genFood(), genFood()];

function checkFood() {
    let head = moves[direction]().pop();

    return food.some(elm => elm[0] == head[0] && elm[1] == head[1]);
}

fillBlackScreen();
drawFood();
drawSnake();

let timeInterval = 300;
let interval;

function game() {
    let collision = checkCollision();
    let eating = checkFood();

    if(!collision) {
        move(!eating);

        let head = tail[tail.length-1];

        if(eating) {
            scoreElm.innerHTML = +scoreElm.innerHTML + 1

            food = food.filter(elm => !(elm[0] == head[0] && elm[1] == head[1]))
            food.push(genFood());

            // food = [];
        }
    }

    fillBlackScreen();
    drawFood();
    drawSnake(collision);

    if(collision) {
        clearInterval(interval);
        interval = undefined;
    }
}

interval = setInterval(game, timeInterval);

window.addEventListener("keydown", function(e) {
    if(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
        let futureDirection = e.key.toLocaleLowerCase().slice(5);

        if(!interval) return;

        if(direction == futureDirection) {
            game();
            clearInterval(interval);
            interval = setInterval(game, timeInterval);
        } else if(!(
            futureDirection == "up" && direction == "down" ||
            futureDirection == "down" && direction == "up" ||
            futureDirection == "left" && direction == "right" ||
            futureDirection == "right" && direction == "left"
        )) {
            direction = futureDirection;
            game();
            clearInterval(interval);
            interval = setInterval(game, timeInterval);
        }
    }
});