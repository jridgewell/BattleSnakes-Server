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
	World = require('./libs/World'),
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
var user_ids = 1000;
var users = new Array();
var EnvironmentObjects = new Array();
var MiniSnakes = new Array();
var gameScore = 0;
var currentGameTime = 0;
var RedTeam = [];
var BlueTeam = [];
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
	var user = new User(socket, Server.PlayerEvent, user_ids++);
	d.log(1,'User '+user.userID+' at ('+socket.handshake.address.address+') connected!');
	users.push(user);
});

/*
 * Server Functions
 */

Server.CreateWorld = function()
{
	world = new World();
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

Server.PlayerEvent = function(event)
{
	var user = event.user,
		snake = user.getSnake();
	switch(event.type) {
		case 'team':
			var blueTeamLength = BlueTeam.length,
				redTeamLength = RedTeam.length,
				team;
			if (blueTeamLength > redTeamLength) {
				team = 'Red';
				RedTeam.push(user);
			} else if (redTeamLength > blueTeamLength) {
				team = 'Blue';
				BlueTeam.push(user);
			} else {
				if (Math.random() < .5) {
					team = 'Red';
					RedTeam.push(user);
				} else {
					team = 'Blue';
					BlueTeam.push(user);
				}
			}
			snake.changeTeam(team);
			break;
		case 'intro':
			user.sendIntroPacket(world.AddSnake(user));
			user.sendAddEnvironmentPacket(world.surroundingEnvironment(snake));
			//Send other snakes to the user
			user.sendPlayerUpdate(world.surroundingSnakes(snake));
			//Send user to the  other snakes
			user.broadcastPlayerUpdate();
			break;
		case 'playerUpdate':
			//Send other snakes to the user
			user.broadcastPlayerUpdate();
			break;
		case 'disconnect':
			d.log(1,'User '+event.user+' has disconnected!');
			--num_users;
		default:
	}
};


/*
 * Init functions
 */
console.log("Creating World ...");
this.CreateWorld();
console.log("Starting Game ...");
this.StartGame();


function update() {
	world.update.call(world, users);
	process.nextTick(update);
}

update();
