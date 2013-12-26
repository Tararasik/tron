(function() {

	"use strict";

	var debug = true;

	var log = function(message) {
		if (debug) {
			console.log(message);
		}
	}


	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');

	var GAME_OVER = 'over';
	var GAME_START = 'start';
	var GAME_PENDING = 'pending';

	var Game = (function() {
		var options = {
			speed: 10, // 1s / speed
			width: 500
		};

		var state = GAME_PENDING;
		var mainLoop = null;
	 	var snakes = [];


		var clearCanvas = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

	 	return {
			init: function() {
				canvas.width = options.width;
				canvas.height = options.height || options.width;

				snakes.push(new Snake({
					startX: canvas.width / 2 + 20
				}));

				snakes.push(new Snake({
					color: '#FC6E47',
					keys: {
						left: 65, //w
						up: 87,   //a
						right: 68,//s
						down: 83  //d
					}
				}));

				Game.ready();
			},

			ready: function() {
				state = GAME_PENDING;
				clearCanvas();

				$.each(snakes, function(index, snake) {
					snake.ready();
				});
			},

			start: function() {
				var turn = 1;
				state = GAME_START;
				mainLoop = setInterval(function() {
					if (state == GAME_START) {
						log('turn ' + turn);

						$.each(snakes, function(index, snake) {
							snake.move();
						});

						turn++;
					}
				}, 1000 / options.speed);
			},

			stop: function(player) {
				state = GAME_OVER;
				clearInterval(mainLoop);

				log(player + ' lost');
			},

			switchState: function() {
				switch (state) {
					case GAME_OVER:
						Game.ready();
					case GAME_PENDING:
						Game.start();
				}
			}
	 	}
	})();


	var Snake = function(options) {
		this.init(options);
	};

	Snake.prototype.init = function(options) {
		this.options = {
			size: 10, //px
			color: '#47D5FC',
			startX: canvas.width / 2 - 20,
			startY: canvas.height / 2,
			keys: {
				left: 37,
				up: 38,
				right: 39,
				down: 40
			}
		};

		this.direction = 'up';

		if(options) this.options = $.extend(this.options, options);

		var self = this;

		addEventListener("keydown", function(e) {
			var lastKey = e.keyCode;
		    switch (lastKey) {
		    	case self.options.keys.left:
			    	self.direction = 'left';
						Game.switchState();
			    	break;
		    	case self.options.keys.up:
			    	self.direction = 'up';
						Game.switchState();	
			    	break;
		    	case self.options.keys.right:
			    	self.direction = 'right';
						Game.switchState();	
			    	break;
		    	case self.options.keys.down:
			    	self.direction = 'down';
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

		switch (this.direction) {
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

		log(this.options.color + ' move');

		if (!this.isCollision()) {
			this.draw();
		}
	};

	Snake.prototype.draw = function() {
		ctx.fillStyle = this.options.color;
		ctx.fillRect(this.options.x, this.options.y, this.options.size, this.options.size);

		log(this.options.color + ' draw');
	};

	Snake.prototype.isCollision = function() {
		if (this.isCrossBorder() || this.isCrossSnake()) {
			Game.stop(this.options.color);

			return true;
		}

		return false;

	};

	Snake.prototype.isCrossBorder = function() {
		if (this.options.x > canvas.width || this.options.x < 0 || this.options.y > canvas.height + this.options.size || this.options.y < 0) {
			return true;
		}

		return false
	};

	Snake.prototype.isCrossSnake = function() {
		var imgData = ctx.getImageData(this.options.x, this.options.y, 1, 1);

		for (var i = 0; i < 4; i++) {
			//if pixel is coloured
			if (imgData.data[i] != 0) {
				return true;
			}
		}

		return false;
	};
	
	Game.init();
	document.getElementById('start').onclick = Game.init;
})();
