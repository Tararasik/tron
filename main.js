var Tron = (function() {

	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');

	var GAME_OVER = 'over';
	var GAME_START = 'start';
	var GAME_PENDING = 'pending';

	var Game = {
		options: {
			speed: 10, // 1s / speed
			width: 5
		},

		state: GAME_PENDING,
		mainLoop: null,
		snakes: [],

		init: function() {
			Game.snakes = [];
			canvas.width = Game.options.width;
			canvas.height = Game.options.height || Game.options.width;

			var options = Game.options;

			Game.snakes.push(new Snake({
				startX: canvas.width / 2 + 20
			}));

			Game.snakes.push(new Snake({
				color: 'red',
				keys: {
					left: 65,
					up: 87,
					right: 68,
					down: 83
				}
			}));

			Game.ready();
		},

		ready: function() {
			Game.state = GAME_PENDING;

			Game.clearCanvas();
			$.each(Game.snakes, function(index, snake) {
				snake.ready();
			});
		},

		start: function() {
			Game.state = GAME_START;

			Game.mainLoop = setInterval(function() {
				if (Game.state == GAME_START) {
					$.each(Game.snakes, function(index, snake) {
						snake.move();
					});
				}
			}, 1000 / Game.options.speed);
		},

		stop: function(player) {
			Game.state = GAME_OVER;

			alert(player + ' lost');
			clearInterval(Game.mainLoop);
		},

		clearCanvas: function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		switchState: function() {
			switch (Game.state) {
				case GAME_OVER:
					Game.ready();
				case GAME_PENDING:
					Game.start();
			}
		}
	}

	var Snake = function(options) {
		this.init(options);
	};

	Snake.prototype.init = function(options) {
		this.options = {
			size: 10, //px 
			color: 'blue',
			direction: 'up',
			startX: canvas.width / 2,
			startY: canvas.height / 2,
			keys: {
				left: 37,
				up: 38,
				right: 39,
				down: 40
			}
		}

		if(options) this.options = $.extend(this.options, options);

		var self = this;

		addEventListener("keydown", function(e) {
			var lastKey = e.keyCode;

	    switch (lastKey) {
	    	case self.options.keys.left:
		    	self.options.direction = 'left';
					Game.switchState();	
		    	break;
	    	case self.options.keys.up:
		    	self.options.direction = 'up';
					Game.switchState();	
		    	break;
	    	case self.options.keys.right:
		    	self.options.direction = 'right';
					Game.switchState();	
		    	break;
	    	case self.options.keys.down:
		    	self.options.direction = 'down';
					Game.switchState();
		    	break;
	    }
		}, false);
	};

	Snake.prototype.ready = function() {
		this.options.x = this.options.startX;
		this.options.y = this.options.startY;
		this.draw();
	}

	Snake.prototype.move = function() {

		switch (this.options.direction) {
			case 'up':
				this.options.y -= this.options.size;
				break;
			case 'down':
				this.options.y += this.options.size;
				break;
			case 'left':
				this.options.x -= this.options.size;
				break;
			case 'right':
				this.options.x += this.options.size;
				break;
		};

		if (!this.isCollision()) {
			this.draw();
		}
	};

	Snake.prototype.draw = function() {
		ctx.fillStyle = this.options.color;
		ctx.fillRect(this.options.x, this.options.y, this.options.size, this.options.size);
	};

	Snake.prototype.isCollision = function() {
		if (this.isCrossBorder() || this.isCrossSnake()) {
			Game.stop(this.options.color);

			return true;
		}

		return false;

	};

	Snake.prototype.isCrossBorder = function() {
		if (this.options.x + this.size > canvas.width || this.options.x < 0 || this.options.y + this.options.size > canvas.height + this.options.size || this.options.y < 0) {
			return true;
		}

		return false
	};

	Snake.prototype.isCrossSnake = function() {
		var imgData = ctx.getImageData(this.options.x, this.options.y, 1, 1);

		for (i = 0; i < 4; i++) {
			//if pixel is coloured
			if (imgData.data[i] != 0) {
				return true;
			}
		}

		return false;
	};
	
	document.getElementById('start').onclick = Game.init;
	Game.init();
})();
