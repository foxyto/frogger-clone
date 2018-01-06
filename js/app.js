// Superclass for all characters, enemies and player(s)
var Character = function(x, y) {
    this.x = x;
    this.y = y;
};

Character.prototype.update = function() {
};

// Draw any character on the screen
Character.prototype.render = function() {
    Resources.load(this.sprite);
    ctx.drawImage(Resources.get(this.sprite), 101 * this.x, 83 * this.y - 20);
};

// Enemies our player must avoid
var Enemy = function(x, y) {
    Character.call(this, x, y);
    // The image/sprite for our enemies, this uses
    // a helper Udacity provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = 0.1 + Math.random();
};

// Variables applied to each of our instances
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // multiple movement by the dt parameter
    // which ensures the game runs at the same speed for all computers.
    if (this.x < 5) {
        this.x += this.speed * dt + 0.001 * score; 
        // game gets harder every time player scores a point
    } else {
        this.x = 0;
        this.speed = 0.1 + Math.random();
    }
};

// Player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    Character.call(this, 2, 5);

    this.sprite = 'images/char-cat-girl.png';
};

var score = 0;

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.reset = function() {
    this.x = 2;
    this.y = 5;
};
Player.prototype.handleInput = function(direction) {
  if (direction == 'up' && this.y == 1) {
    this.reset();
    score ++;
    console.log(score);
  } else if (direction == 'up' && this.y > 0) {
    this.y--;
  } else if (direction == 'left' && this.x > 0) {
    this.x--;
  } else if (direction == 'right' && this.x < 4) {
    this.x++;
  } else if (direction == 'down' && this.y < 5) {
    this.y++;
  }
};

// Check for collision between the player and any enemies
// Player goes back to the starting square after collision and the score resets
var checkCollisions = function() {
    for (var e in allEnemies) {
        var enemy = allEnemies[e];

        var enemyRect = {x: enemy.x, y: enemy.y, width: 0.8, height: 0.8};
        var playerRect = {x: player.x, y: player.y, width: 0.8, height: 0.8};

        if (enemyRect.x < playerRect.x + playerRect.width &&
            enemyRect.x + enemyRect.width > playerRect.x &&
            enemyRect.y < playerRect.y + playerRect.height &&
            enemyRect.height + enemyRect.y > playerRect.y) {
            // collision detected!
            console.log("Collision!");
            console.log(enemyRect);
            console.log(playerRect);
            player.reset();
            score = 0;
            console.log(score);
        }
    }
};

// Create instances of Character
// All enemy objects are in an array called allEnemies
// The player object is in a variable called player
var allEnemies = [];
var enemy1 = new Enemy(0, 1);
var enemy2 = new Enemy(0, 2);
var enemy3 = new Enemy(0, 3);
allEnemies.push(enemy1, enemy2, enemy3);
var player = new Player();

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Add scoring to the game
var scoreElement = document.getElementById("score");