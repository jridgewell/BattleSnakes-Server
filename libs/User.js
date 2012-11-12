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
	this.socketID;
	this.userID = snakeID;
	
	
	
	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});
	
	function init()
	{
		snake = new Snake(snakeID);
		socketID = socket.id;
		
		playerevent({
			type: 'intro',
			socketID: socketID,
			user: user
		});
	};
	
	this.sendIntroPacket = function(env)
	{
		var introPacket =  {
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
	
	this.sendUpdatePacket = function() {
		socket.emit('message', {
			type: 'update',
			position: snake.position,
			velocity: snake.velocity
		});
	};

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
		}
	};
	
	function handleUpdate(data) {
		if (data.id !== this.userID) {
			return;
		}
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