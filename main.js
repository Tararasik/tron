var Tron = (function() {

	var canvas = document.getElementById('viewport');
	var ctx = canvas.getContext('2d');

	var GAME_OVER = 'over';
	var GAME_START = 'start';
	var GAME_PENDING = 'pending';

	var Game = {
		options: {
			speed: 10, // 1s / speed
			width: 500,
			//height: 500
		},

		state: GAME_OVER,
		mainLoop: null,

		init: function() {
			canvas.width = Game.options.width;
			canvas.height = Game.options.height || Game.options.width;

			var options = Game.options;

			Game.clearCanvas();
			Game.state = GAME_PENDING;

			Snake.init();
		},

		start: function() {
			Game.state = GAME_START;

			mainLoop = setInterval(function() {
				if (Game.state == GAME_START) {
					Snake.move();
				}
			}, 1000 / Game.options.speed);
		},

		stop: function() {
			Game.state = GAME_OVER;
			clearInterval(mainLoop);
			alert("Game over");
		},

		clearCanvas: function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	var Snake = {
		size: 10, //px 
		color: 'blue',
		direction: null,
		x: canvas.width / 2,
		y: canvas.height / 2,

		init: function() {
			Snake.x = canvas.width / 2;
			Snake.y = canvas.height / 2;

			Snake.draw(Snake.x, Snake.y);

			addEventListener("keydown", function (e) {
		    var lastKey = e.keyCode;

		    switch (lastKey) {
		    	case 37:
			    	Snake.direction = 'left';
			    	if (Game.state != GAME_START) Game.start();
			    	break;
		    	case 38:
			    	Snake.direction = 'up';
			    	if (Game.state != GAME_START) Game.start();
			    	break;
		    	case 39:
			    	Snake.direction = 'right';
			    	if (Game.state != GAME_START) Game.start();
			    	break;
		    	case 40:
			    	Snake.direction = 'down';
			    	if (Game.state != GAME_START) Game.start();
			    	break;
		    }
			}, false);
		},

		move: function() {
			switch (Snake.direction) {
				case 'up':
					Snake. y -= Snake.size;
					break;
				case 'down':
					Snake.y += Snake.size;
					break;
				case 'left':
					Snake.x -= Snake.size;
					break;
				case 'right':
					Snake.x += Snake.size;
					break;
			};

			if (!Snake.isCollision()) {
				Snake.draw(Snake.x, Snake.y);
			}
		},

		draw: function(x, y) {
			var size = Snake.size;

			ctx.fillStyle = Snake.color;
			ctx.fillRect(x, y, size, size);
		},

		isCollision: function() {
			if (Snake.isCrossBorder() || Snake.isCrossSnake()) {
				Game.stop();
				return true;
			}

			return false;

		},

		isCrossBorder: function() {
			if (Snake.x + Snake.size > canvas.width || Snake.x < 0 || Snake.y + Snake.size > canvas.height + Snake.size || Snake.y < 0) {
				return true;
			}

			return false
		},

		isCrossSnake: function() {
			var imgData = ctx.getImageData(Snake.x, Snake.y, 1, 1);

			for (i = 0; i < 4; i++) {
				//if pixel is coloured
				if (imgData.data[i] != 0) {
					return true;
				}
			}

			return false;
		}

	}
	
	document.getElementById('start').onclick = Game.init;
	Game.init();
})();
