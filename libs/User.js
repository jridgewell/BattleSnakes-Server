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
	
	init();
	
	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});
	
	function init()
	{
		snake = new Snake(snakeID);
		socketID = socket.id;
		
		var introPacket = 
		{
			type: "intro",
			id: snake.id,
			name: snake.name,
			position: snake.position,
			team: snake.team,
			color: snake.color,
			segments: snake.segments
		};
		
		playerevent({type: 'intro',socketID: socketID, packet: introPacket});
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
		d.log(3, e);
	 	socket.emit('message', e);
	};

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
}

module.exports = User;