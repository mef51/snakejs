
$(document).ready(function() {

    // Canvas stuff
    var canvas = $("#snakecanvas")
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();

    var fps = 20; // 1000 / fps is the amount in ms each frame should last to have a frame rate of fps

    // the snake
    var length = 5;
    var cellWidth = w / 40;
    var cellHeight = cellWidth;
    var snake; // an array of cells. A "cell" is a point in space
    var direction; // by default
    var isAlive = false;

    var score = 0;
    var food = {x: Math.floor(Math.random() * w), y: Math.floor(Math.random() * h)};

    var gameLoop = setInterval(function() {
        if(isAlive){
            drawSnake(snake);
            moveSnake(snake, direction);
        }
        else { // sets up the game
            snake = createSnake(length);
            direction = "right"; // "right" by default
            isAlive = true;
        }
    }, 1000 / fps);

    // arrow key controls
    var keyHandler = $(document).keydown(function(e){
        // some constants
        var KEY_LEFT = 37;
        var KEY_UP = KEY_LEFT + 1; // 38
        var KEY_RIGHT = KEY_UP + 1; // 39
        var KEY_DOWN = KEY_RIGHT + 1; // 40
        // vim mode LOL
        var KEY_H = 72;
        var KEY_J = 74;
        var KEY_K = 75;
        var KEY_L = 76;

        // don't allow snake to go in reverse on itself
        var key = e.which;
        if((key == KEY_RIGHT || key == KEY_L) && direction != "left") direction = "right";
        if((key == KEY_LEFT || key == KEY_H) && direction != "right") direction = "left";
        if((key == KEY_UP || key == KEY_K) && direction != "down") direction = "up";
        if((key == KEY_DOWN || key == KEY_J) && direction != "up") direction = "down";
    });


    function moveSnake(snake, direction) {
        var head = snake[snake.length - 1];
        var nx = head.x;
        var ny = head.y;

        var tail = snake.shift(); // snake lost its first element
        
        if(direction == "right") nx++;
        else if(direction == "left") nx--;
        else if(direction == "up") ny--; 
        else if(direction == "down") ny++;

        tail.x = nx;
        tail.y = ny;
        snake.push(tail);

        // check if snake is still within board
        if(isOutOfBounds(snake, w, h)) isAlive = false;
    }

    function isOutOfBounds(snake, boardWidth, boardHeight) {
        // no part of the snake will go where the head did not.
        // therefore, we only need to check the head.
        var head = snake[snake.length - 1];
        var realX = head.x * cellWidth;
        var realY = head.y * cellHeight;
        if(realX >= boardWidth || realX < 0 || realY >= boardHeight || realY < 0) return true;
        else return false;
    }

    function drawSnake(snake) {
        // draw background
        drawBackground();
        // renders the snake
        for(var i = 0; i < snake.length; i++) {
            var c = snake[i];
            ctx.fillStyle = "blue";
            ctx.fillRect(c.x * cellWidth, c.y * cellHeight, cellWidth, cellHeight);
            ctx.strokeStyle = "white";
            ctx.strokeRect(c.x * cellWidth, c.y * cellHeight, cellWidth, cellHeight);
        }
    }

    function drawBackground() {
        // the background and border of the canvas.
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
    }

    function createSnake(length) {
        var snake = [];

        for(var i = 0; i < length; i++) {
            snake.push({x : i, y : 0});
        }
        return snake;
    }

    function log(x) {
        console.log(x);
    }
});
