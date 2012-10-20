var settings = require('./Settings');
var Debug = require('./Debug');
var Snake = require('./all/Snake');
var d = new Debug();

/*
 * playerevent is your callback method to report anything to server class
 */
function User(socket, playerevent, snakeID)
{
	var snake = new Snake(snakeID);

	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});
 	socket.emit('message', snake.send());

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
	 	socket.emit('message', snake.send());
	};

	function handleDisconnect(e)
	{
		var disconnectMsg = {
			type: 'Disconnect',
			userid: snakeID
		};

		playerevent(disconnectMsg);
	};
}

module.exports = User;