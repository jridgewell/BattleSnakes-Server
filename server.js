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
var RedTeamScore = 0;
var BlueTeamScore = 0;
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
    user.gameScore = function (increment) {
        Server.updateGameScore(user.getSnake().team, increment);
    }
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
    var old = BlueTeam;
    old = old.concat(RedTeam);
    BlueTeam = [];
    RedTeam = [];
    old.sort(function(a, b) {
        return a.scored() - b.scored();
    });
    for (var i = 0; i < old.length; ++i) {
        old[i].reset();
    }
    world.resetWorld();
    for (var i = 0; i < old.length; ++i) {
        var user = old[i];
        user.inti2();
    }
};

Server.StartGame = function()
{
    BlueTeamScore = 0;
    RedTeamScore = 0;
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
			if (redTeamLength > blueTeamLength) {
				team = 'Blue';
				BlueTeam.push(user);
			} else {
				team = 'Red';
				RedTeam.push(user);
			}
			snake.changeTeam(team);
			break;
		case 'intro':
			user.sendIntroPacket(world.AddUser(user));
			user.sendAddEnvironmentPacket(world.surroundingEnvironment(snake));
			//Send other snakes to the user
			var otherSnakes = world.surroundingSnakes(snake);
			user.sendAddSnakePacket(otherSnakes);
			// user.sendPlayerUpdate(otherSnakes);
			//Send user to the  other snakes
			user.broadcastAddSnake();
			// user.broadcastPlayerUpdate();
			break;
		case 'disconnect':
			d.log(1,'User '+event.user+' has disconnected!');
            event.user.remove();
            switch (snake.team) {
                case 0:
                    var team = RedTeam;
                case 1:
                    var team = BlueTeam;
            }
            team.remove(user);
            users.remove(user);
			//--num_users;
		default:
	}
};

Server.updateGameScore = function(team, increment) {
    switch(team) {
        case 0:
            RedTeamScore += increment;
        case 1:
            BlueTeamScore += increment;
    }
    if (Math.abs(RedTeamScore - BlueTeamScore) > 20) {
        Server.EndGame();
        Server.StartGame();
    }
    io.sockets.emit('message', {
        type: 'updateGameState',
        divider: (50 + (RedTeamScore - BlueTeamScore) * 5 / 2)
    });
}


/*
 * Init functions
 */
console.log("Creating World ...");
this.CreateWorld();
console.log("Starting Game ...");
//this.StartGame();


function update() {
	world.update.call(world, users);
	process.nextTick(update);
}

update();
