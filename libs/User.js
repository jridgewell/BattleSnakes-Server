var settings = require('./Settings');
var Debug = require('./Debug');
var Snake = require('./all/Snake');
var d = new Debug();

/*
 * playerevent is your callback method to report anything to server class
 *
 * Have all your communication socket wise in here. The User controls the snake.
 */
function User(socket, playerevent, snakeID)
{
	var user = this;
	var snake;
	var score = {};
	this.socketID;
	this.userID = snakeID;
    this.reset = function () {};
    this.gameScore = function () {};

	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});

	function init()
	{
		snake = new Snake(snakeID);
		socketID = socket.id;
		socket.join('chat');

        user.inti2();

        // Kick the kids who send too much data.
        this.packetsThisSecond = 0;
        this.packetKickingInterval = setInterval(function() {
            //Reset the packetsThisSecond every second
            user.packetsThisSecond = 0;
        }, 5000);


		// Snake functions that must be aware of the User object
		snakeScore = snake.score;
		snake.score = function(type, increment) {
			if (snakeScore) {
				snakeScore.call(snake, type, increment);
			}
			var get = (increment == undefined),
				scoreSet = (type in score),
				scoreOfType = (scoreSet) ? score[type] : 0;
			if (get) {
				return scoreOfType;
			}
			scoreOfType += increment;
			score[type] = scoreOfType;
            if (type == 'dropOffEggs') {
                user.gameScore(increment);
            }
		};

		snakePickUpEgg = snake.pickUpEgg;
		snake.pickUpEgg = function(egg) {
			if (snakePickUpEgg) {
				snakePickUpEgg.call(snake, egg);
			}
			this.score('pickUpEgg', 1);
			user.removeGameObject(egg);
			user.broadcast(user.surroundingGridRooms(), user.sendRemoveEnvironmentPacket([egg]));
			user.sendUpdatePacket();
			user.broadcastPlayerUpdate();
			user.sendEggPacket();
			return this;
		},

		snakeDropOffEggs = snake.dropOffEggs;
		snake.dropOffEggs = function(hatchery) {
			if (snakeDropOffEggs) {
				snakeDropOffEggs.call(snake, hatchery);
			}
			var eggs = this.eggs.splice(0);
			this.score('dropOffEggs', eggs.length);
            user.sendUpdatePacket();
            user.broadcastPlayerUpdate();
			user.sendEggPacket();
			world.respawnEggs(eggs.length);
			return eggs;
		}

		snakeUpdate = snake.update;
		snake.update = function() {
			if (snakeUpdate) {
				snakeUpdate.call(snake);
			}
			user.sendUpdatePacket();
			user.broadcastPlayerUpdate();
		}

		snakeUpdateSprint = snake.updateSprint;
		snake.updateSprint = function() {
			if (snakeUpdateSprint) {
				snakeUpdateSprint.call(snake);
			}
			user.sendSprintPacket();
		}

        snakeDie = snake.die;
        snake.die = function () {
			this.score('death', 1);
            this.leaveGridRoom(snake.grid.id);
            this.reset(snake);
            this.joinGridRoom(snake.grid.id);
            if (snakeDie) {
                snakeDie.call(snake);
            }
        }

        snakeLostEggs = snake.lostEggs;
        snake.lostEggs = function(number) {
            world.respawnEggs(number);
        }
	};

    this.inti2 = function() {
        score = {};
		playerevent({type: 'team', user: user})
		playerevent({
			type: 'intro',
			socketID: socketID,
			user: user
		});
    }

	this.sendIntroPacket = function(env)
	{
		var introPacket = {
				type: 'intro',
				name: snake.name,
				id: snake.id,
				position: snake.position,
				velocity: snake.velocity,
				team: snake.team,
				segments: snake.segments,
				sizeOfWorld: env
			};

			socket.emit('message', introPacket);
	};

	this.sendEggPacket = function() {
		var message = {
			type: 'egg',
			eggs: [snake.eggs]
		};
		socket.emit('message', message);
		return message;
	}

	this.sendCollisionPacket = function(obj) {
		var message = snake.toJSON();
		message.type = 'update';
        message.collision = true;
        message.collidedWith = obj;
		socket.emit('message', message);
		return message;
	};
	this.sendUpdatePacket = function() {
		var message = snake.toJSON();
		message.type = 'update';
		socket.emit('message', message);
		return message;
	};

	this.sendSprintPacket = function() {
		var message = {
			type: 'sprint',
			sprint: snake.sprintObj
		};
		socket.emit('message', message);
		return message;
	}

	this.sendAddEnvironmentPacket = function(env) {
		var message = {
			type: 'addEnvironment',
			items: env
		};
		socket.emit('message', message);
		return message;
	}

	this.sendRemoveEnvironmentPacket = function(env) {
		var items = env.map(function(element) {
			if (element instanceof Object) {
				return element.id;
			} else {
				return element;
			}
		});
		var message = {
			type: 'removeEnvironment',
			items: items
		};
		socket.emit('message', message);
		return message;
	}

	this.sendAddSnakePacket = function(env) {
		var items = env.map(function(element) {
			if (element instanceof Snake) {
				return element.addSnakePacket();
			} else {
				return element;
			}
		});
		var message = {
			type: 'addSnake',
			snakes: items
		}
		socket.emit('message', message);
		return message;
	}

	this.sendRemoveSnakePacket = function(env) {
		var items = env.map(function(element) {
			if (element instanceof Object) {
				return element.id;
			} else {
				return element;
			}
		});
		var message = {
			type: 'removeSnake',
			snakes: items
		}
		socket.emit('message', message);
		return message;
	}

	this.sendPlayerUpdate = function(env) {
		console.log('sendPlayerUpdate', user.userID);
		var message = {
			type: 'playerUpdate',
			snakes: env
		};
		socket.emit('message', message);
		return message;
	}

	this.broadcast = function(to, message) {
        if (!message || !to.length) {
            console.trace('here');
        }
        if (!Array.isArray(to)) {
            to = [to]
        }
        to = to.map(function(element) {
            if (element instanceof Object) {
                return element.id;
            } else {
                return element;
            }
        });
        for (var i = 0, l = to.length; i < l; ++i) {
            socket.broadcast.to(to[i]).emit('message', message);
        }
	}


	this.broadcastRemoveSnake = function(grids) {
        var to = (grids && grids.length) ? grids : this.surroundingGridRooms();
		this.broadcast(to, {
			type: 'removeSnake',
			snakes: [snake.id]
		});
    }

	this.broadcastAddSnake = function(grids) {
        var to = (grids && grids.length) ? grids : this.surroundingGridRooms();
		this.broadcast(to, {
			type: 'addSnake',
			snakes: [snake.addSnakePacket()]
		});
	}

	this.broadcastPlayerUpdate = function(grids) {
        var to = (grids && grids.length) ? grids : this.surroundingGridRooms();
		console.log('broadcastPlayerUpdate', user.userID);
		this.broadcast(to, {
			type: 'playerUpdate',
			snakes: [snake.get()]
		});
	}


	function handleMessage(socket, e)
	{
		/*
		 * parse JSON and read in the var 'type' to
		 * determine how to handle the rest of the data.
		 *
		 * example:
		 *
		 * var data = JSON.parse(e);
		 * if(data.type == 'init')
		 */
        ++this.packetsThisSecond;
        if (this.packetsThisSecond > 1000) {
            // Kick this kid.
            socket.disconnect();
        }
		if (!e || !e.type) {
			return;
		}
		switch (e.type) {
			case 'update':
				handleUpdate(e);
				break;
			case 'chat':
				handleChat(e);
				break;
			case 'usePowerup':
				handlePowerup(e);
				break;
			case 'sprint':
				snake.handleSprint(e.sprint);
				break;
		}
	};

	function handleUpdate(data) {
		var position = snake.position.clone(),
			dVelocity = data.velocity;

		if ('angle' in dVelocity && 'magnitude' in dVelocity) {
			var angle = dVelocity.angle *= Math.PI / 180;
			snake.velocity._angle = angle;
			dVelocity = {
				to: {
					x: Math.cos(angle) * dVelocity.magnitude,
					y: Math.sin(angle) * dVelocity.magnitude
				}
			};
		}
		// dVelocity = new Vector(dVelocity.to);

		position = position.subtract(data.position);

		snake.velocity.set(dVelocity.to);
		if (Math.abs(position.x) < 1 &&
			Math.abs(position.y) < 1) {
		} else {
			user.sendUpdatePacket();
		}

		console.log('user update');
		user.broadcastPlayerUpdate();
	}

	function handleChat(data) {
		user.broadcast('chat', {
			type: 'chat',
			from: snake.name,
			message: data.message
		});
	}

	function handlePowerup(data) {
		var powerUpTime = 3000;
		var powerups = snake.powerups.filter(function(element) {
			return element.id == data.id;
		});
		if (!Array.isArray(powerups) || powerups.length === 0) {
			return null;
		}
		var powerup = powerups[0];
		switch (powerup.powerupType) {
			case 1:
				//handleSprint instead?
		}
	}

	function handleDisconnect(e)
	{
		var msg = {
			type: 'disconnect',
			user: user
		};

		world.respawnEggs(snake.eggs.length);
		playerevent(msg);
	};

	this.joinGridRoom = function(gridID)
	{
		socket.join(gridID);
	};


	this.leaveGridRoom = function(gridID)
	{
		socket.leave(gridID);
	};

	this.getSnake = function()
	{
		return snake;
	};

    this.remove = function () {
		clearInterval(this.packetKickingInterval);
        this.broadcastRemoveSnake();
        this.removeGameObject(snake);
    }

    this.scored = function(argument) {
        return score['dropOffEggs'] || 0;
    }

	init();
}

module.exports = User;
