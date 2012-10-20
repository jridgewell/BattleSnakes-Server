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
var settings = require('./libs/Settings') ,
	arrays = require('./libs/misc'),
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
var num_users = 1;
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

server.listen(settings.PORT);

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res, next) {
    res.render('public/index.html');
});

console.log('Server running at http://'+settings.HOST+':'+settings.PORT+'/');

dbm = new DBManager(settings.MONGO);

io.set('log level', settings.DEBUGLEVEl);
io.sockets.on('connection', function (socket) {
    d.log(1,'A user with id '+num_users+' at ('+socket.handshake.address.address+') connected!');
    user = new User(socket, function(data){Server.PayerEvent(data);}, num_users);
    users.push(user);
    num_users++;
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

Server.PayerEvent = function(data)
{
	// example of how you should handle the data
	switch(data.type)
	{
		case 'Disconnect':
			//handle the disconnect
		default:
			
	}
	
	d.log(1,data.type);
};
