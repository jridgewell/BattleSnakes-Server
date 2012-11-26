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



	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});

	function init()
	{
		snake = new Snake(snakeID);
		socketID = socket.id;
		socket.join('chat');

		playerevent({
			type: 'intro',
			socketID: socketID,
			user: user
		});

		snake.score = function(type, increment) {
			var get = (increment == undefined),
				scoreSet = (type in score),
				scoreOfType = (scoreSet) ? score[type] : 0;
			if (get) {
				return scoreOfType;
			}
			scoreOfType += increment;
			score[type] = scoreOfType;
		};
	};

	this.sendIntroPacket = function(env)
	{
		var introPacket = {
				type: 'intro',
				name: snake.name,
				id: snake.id,
				position: snake.position,
				velocity: snake.velocity,
				team: snake.team,
				color: snake.color,
				segments: snake.segments,
				sizeOfWorld: env
			};

			socket.emit('message', introPacket);
	};

	this.sendUpdatePacket = function(broadcast) {
		var message = snake.toJSON();
		message.type = 'update';
		socket.emit('message', message);

		if (broadcast) {
			this.broadcastPlayerUpdate();
		}
	};

	this.sendAddEnvironmentPacket = function(env) {
		socket.emit('message', {
			type: 'addEnvironment',
			items: env
		});
	}

	this.sendRemoveEnvironmentPacket = function(env) {
		socket.emit('message', {
			type: 'removeEnvironment',
			items: env
		});
	}

	this.sendPlayerUpdate = function(env) {
		socket.emit('message', {
			type: 'playerUpdate',
			snakes: env
		});
	}

	this.broadcast = function(to, message) {
		if (Array.isArray(to)) {
			for (var i = 0, l = to.length; i < l; ++i) {
				socket.broadcast.to(to[i]).emit('message', message);
			}
		} else {
			socket.broadcast.to(to).emit('message', message);
		}
	}

	this.broadcastPlayerUpdate = function() {
		this.broadcast(this.surroundingGridRooms(), {
			type: 'playerUpdate',
			snake: [snake]
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
		}
	};

	function handleUpdate(data) {
		var position = snake.position;
		var velocity = snake.velocity;

		position = position.translate(data.position);

		snake.velocity.set(data.velocity.to);
		if (Math.abs(position.x) < 1 &&
			Math.abs(position.y) < 1) {
			snake.position.set(
				data.position.x,
				data.position.y
			);
		} else {
			user.sendUpdatePacket();
		}

		this.broadcastPlayerUpdate();
	}

	function handleChat(data) {
		this.broadcast('chat', {
			type: 'chat',
			from: snake.name,
			message: data.message
		});
	}

	function handlePowerup(data) {
		var powerUpTime = 2000;
		var powerups = snake.currentPowerups.filter(function(element) {
			return element.id == data.id;
		});
		if (!Array.isArray(powerups)) {
			return null;
		}
		var powerup = powerups[0];
		switch (powerup.type) {
			case 1:
				this.snake.velocity.multiply(2);
				setTimeout.call(this.snake.velocity, this.snake.velocity.divide, powerUpTime, 2);
		}
	}

	function handleDisconnect(e)
	{
		var msg = {
			type: 'disconnect',
			userid: user.userID
		};

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

	init();
}

module.exports = User;
