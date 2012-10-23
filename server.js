/*
 * Node libs
 */
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose');


/*
 * Server libs
 */
require('./libs/misc');
var Settings = require('./libs/Settings') ,
	DBManager = require('./libs/DBManager'),
	User = require('./libs/User'),
	Debug = require('./libs/Debug'),
	Server = this;

/*
 * This is a example of how you would include a js file from the client.
 *
 * So you do not need to write two snake classes.
 *
 * Snake = require(__dirname +'/public/js/Snake');
 */ 

/*
 * Vars
 */
var num_users = 0;
var users = new Array();
var EnvironmentObjects = new Array();
var MiniSnakes = new Array();
var gameScore = 0;
var currentGameTime = 0;
var RedBase; // Hatchery object;
var BlueBase; // Hatchery Object;
var PlayField; // PlayField object;
var d = new Debug();

/*
 * Express and SocketIO config
 */

server.listen(Settings.PORT);

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res, next) {
    res.render('public/index.html');
});

console.log('Server running at http://'+Settings.HOST+':'+Settings.PORT+'/');

dbm = new DBManager(Settings.MONGO);

io.set('log level', Settings.DEBUGLEVEl);
io.sockets.on('connection', function (socket) {
	++num_users;
    d.log(1,'A user with id '+num_users+' at ('+socket.handshake.address.address+') connected!');
    user = new User(socket, Server.PayerEvent, num_users);
    users.push(user);
});

/*
 * Server Functions
 */

Server.CreateWorld = function()
{
};

Server.EndGame = function()
{
};

Server.StartGame = function()
{
};

Server.UpdateTimer = function()
{
};

Server.PayerEvent = function(event)
{
	// example of how you should handle the data
	switch(event.type)
	{
		case 'intro':
			return event.data.extend({
				score: gameScore,
				currentTime: currentGameTime
			});
			break;
		case 'disconnect':
			--num_users;
		default:
	}
};
