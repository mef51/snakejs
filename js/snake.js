
$(document).ready(function() {

    // setup Canvas stuff
    var Canvas = getCanvas("snakecanvas");
    var canvas = Canvas.canvas;
    var ctx = Canvas.context;
    var w = Canvas.width;
    var h = Canvas.height;

    // some constants
    var FPS = 20; // 1000 / FPS is the amount in ms each frame should last to have a frame rate of FPS
    var START_LENGTH = 5;
    var SCORE_INCREMENT = 5;

    // the snake
    var length = START_LENGTH;
    var numCells = 40; // should be > length
    var cellWidth = w / numCells;
    var cellHeight = cellWidth;
    var snake; // an array of cells. A "cell" is a point in space
    var direction; // by default
    var isAlive = false;

    var score = 0;
    var food = getRandomCell(numCells);

    /**
    * All the important stuff happens here.
    * Hence the multi-line comment.
    */
    var gameLoop = setInterval(function() {
        if(isAlive){
            drawSnake(snake);
            moveSnake(snake, direction);
            drawScore(score);
            placeFood(food);
        }
        else { // sets up the game
            reset()
            snake = createSnake(length);
            direction = "right"; // "right" by default
            isAlive = true;
        }
    }, 1000 / FPS);

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

    function reset() {
        length = START_LENGTH;
        food = getRandomCell(numCells);
        score = 0;
    }

    function drawScore(score) {
        var text = "Score: " + score;
        fillString(text, 5, h - 5, Canvas);
    }

    function placeFood(foodCell) {
        // using 'foodCell' instead of just 'food' cuz I don't know how
        // to refer to the global "food" from inside the function
        if(hasEaten(snake, foodCell)){
            eat();
            drawCell(food);
        }
        else {
            drawCell(foodCell);
        }
    }

    function eat() {
        score += SCORE_INCREMENT;
        food = getRandomCell(numCells);
        grow(snake);
    }

    function grow(snake) {
        length++;
        var newCell = {
            x: snake[0].x,
            y: snake[0].y
        };

        if(direction == "right") newCell.x--;
        if(direction == "left") newCell.x++;
        if(direction == "up") newCell.y++;
        if(direction == "right") newCell.y--;

        snake.unshift(newCell);
    }

    function hasEaten(snake, food) {
        // if the snakes head is on the food, it is eaten.
        var head = snake[snake.length - 1];
        if(head.x == food.x && head.y == food.y){
            log("has eaten");
            return true;
        }
        else return false;
    }

    function getRandomCell(numCells) {
        return {
            x: Math.floor(Math.random() * numCells),
            y: Math.floor(Math.random() * numCells)
        };
    }

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
            drawCell(c);
        }
    }

    function drawCell(c) {
        ctx.fillStyle = "blue";
        ctx.fillRect(c.x * cellWidth, c.y * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = "white";
        ctx.strokeRect(c.x * cellWidth, c.y * cellHeight, cellWidth, cellHeight);
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
