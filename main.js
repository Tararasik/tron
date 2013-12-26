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

	var Board = (function() {
		var snakeSize = 0;
		var boardArray = [];

		return {
			setSnakeSize: function(size) {
				snakeSize = size;
			},

			setBoardSize: function(size) {
				canvas.width = canvas.height = size * snakeSize;
			},

			getCoord: function(px) {
				if (typeof px === 'number') {
					return px / snakeSize;
				} else if (typeof px === 'object') {
					return px.map(function(el) {
						return el / snakeSize;
					});
				}
			},

			getPx: function(coord) {
				if (typeof coord === 'number') {
					return coord * snakeSize;
				} else if (typeof coord === 'object') {
					return coord.map(function(el) {
						return el * snakeSize;
					});
				}
			},

			setOccupied: function(coord) {
				boardArray.push(coord);
				// var y = [];
				// y[coord[1]] = 1;
				// boardArray[coord[0]] = y;

				log(boardArray);
			},

			checkOccupied: function(coord) {
				return boardArray.indexOf(coord) > -1;
				if (boardArray[coord[0]]) {
					return boardArray[coord[0]][coord[1]] === 1;
				}

				return false;
			},

			clearBoard: function() {
				boardArray = [];
			}
		}
	})();

	var Game = (function() {
		var options = {
			speed: 10, // 1s/speed
			snakeSize: 10, //px
			boardWidth: 50, // snake sizes
		};

		Board.setSnakeSize(options.snakeSize);
		Board.setBoardSize(options.boardWidth);

		var state = GAME_PENDING;
		var mainLoop = null;
	 	var snakes = [];

		var clearCanvas = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

	 	return {
			init: function() {
				snakes.push(new Snake({
					size: options.snakeSize,
					startX: Board.getCoord(canvas.width) / 2 + 3
				}));

				snakes.push(new Snake({
					size: options.snakeSize,
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
				Board.clearBoard();

				$.each(snakes, function(index, snake) {
					snake.ready();
					Board.setOccupied(snake.getCoord());
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
							Board.setOccupied(snake.getCoord());
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
			color: '#47D5FC',
			startX: Board.getCoord(canvas.width) / 2 - 3,
			startY: Board.getCoord(canvas.height) / 2,
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
		this.x = this.options.startX;
		this.y = this.options.startY;
		this.draw();
	}

	Snake.prototype.move = function() {

		switch (this.direction) {
			case 'up':
				this.y -= 1;
				break;
			case 'down':
				this.y += 1;
				break;
			case 'left':
				this.x -= 1;
				break;
			case 'right':
				this.x += 1;
				break;
		};

		log(this.options.color + ' move');

		if (!this.isCollision()) {
			this.draw();
		}

	};

	Snake.prototype.draw = function() {
		ctx.fillStyle = this.options.color;
		ctx.fillRect(Board.getPx(this.x), Board.getPx(this.y), this.options.size, this.options.size);

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
		if (this.x > canvas.width || this.x < 0 || this.y > canvas.height + this.options.size || this.y < 0) {
			return true;
		}

		return false
	};

	Snake.prototype.isCrossSnake = function() {
		return Board.checkOccupied(this.getCoord());
	};

	Snake.prototype.getCoord = function() {
		return ''+this.x + ',' + this.y;
	}
	
	Game.init();
	document.getElementById('start').onclick = Game.init;
})();
