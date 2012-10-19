var settings = require('./Settings');
var Debug = require('./Debug');
var Snake = require('./all/Snake');
var d = new Debug();

/*
 * playerevent is your callback method to report anything to server class
 */
function User(socket, playerevent, snakeID)
{
	var snake;

	__construct = function()
	{
		snake = new Snake(snakeID);
		// put initlize code here
	}();


	socket.on('message', function (msg){handleMessage(socket,msg);});
	socket.on('disconnect', function (msg) {handleDisconnect(msg);});



	function handleMessage(socket,e)
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

	};

	function handleDisconnect(e)
	{
		/*
		 * Let the server know that his user disconnected
		 * so it can let the rest of the world know. use playerevent callback
		 */

		var disconnectMsg =
		{
			type: 'Disconnect',
			userid: '4985729', // just a example id
		};

		playerevent(disconnectMsg);
	};
}

module.exports = User;