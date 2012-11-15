var Grid = require('./Grid');
var GridSection = require('./GridSection');
var Hatchery = require('./all/Hatchery');
var Egg = require('./all/Environment/Egg');
var Bush = require('./all/Environment/Bush');
var Rock = require('./all/Environment/Rock');
var Tree = require('./all/Environment/Tree');
var GameObject = require('./all/GameObject');
var Teams = require('./all/Teams');
var Point = require('./all/Point');
var Debug = require('./Debug');
var d = new Debug();


function World()
{
	var gridSize = 512;
	var grid;
	var a = 0;
	var storedTime = (new Date()).getTime();

	function init()
	{
		grid = new Grid();
		grid.init();

		InitEnvironment();
	};

	function InitEnvironment()
	{
		var bounds;
		// set up Hatcherys

		var g = grid.getGrid(0, 1);
		g.addGameObject(new Hatchery(0));
		g.hasHatchery = Teams.Red;
		bounds = grid.getBoundsOfGrid(g);
		g.gameObjects[0].position.set(bounds.x + bounds.width/2, bounds.y + bounds.height/2);


		g = grid.getGrid(2, 1);
		g.addGameObject(new Hatchery(1));
		g.hasHatchery = Teams.Blue;
		bounds = grid.getBoundsOfGrid(g);
		g.gameObjects[0].position.set(bounds.x + bounds.width/2, bounds.y + bounds.height/2);

		// Surround the world with rocks
		console.log("Surrounding world with rocks ...");
		SurroundWorld();

		// populate random environment
		console.log("Populating world with environment ...");
		PopulateEnvironment(grid.getGrid(0, 0));
		PopulateEnvironment(grid.getGrid(0, 2));
		PopulateEnvironment(grid.getGrid(1, 0));
		PopulateEnvironment(grid.getGrid(1, 1));
		PopulateEnvironment(grid.getGrid(1, 2));
		PopulateEnvironment(grid.getGrid(2, 0));
		PopulateEnvironment(grid.getGrid(2, 2));
	};

	function SurroundWorld() {
		function genRock(x, y, id) {
			var r = new Rock();
			r.id = id;
			r.position.set(x, y);
			return r;
		}
		var bottomRow = grid.rows - 1,
			rightColumn = grid.columns - 1,
			rock = new Rock(),
			rH = rock.height,
			rW = rock.width,
			rH2 = rH / 2,
			rW2 = rW / 2;
		// Top of world
		for (var i = 0, l = grid.columns; i < l; ++i) {
			var g = grid.getGrid(0, i),
				gX = grid.getBoundsOfGrid(g).x;
			for (var j = rW2 + gX, w = gX + g.width; j < w; j += rW) {
				var r = genRock(j, rH2, a++);
				g.addGameObject(r);
			}
		}
		// Bottom of world
		for (var i = 0, l = grid.columns; i < l; ++i) {
			var g = grid.getGrid(bottomRow, i),
				gB = grid.getBoundsOfGrid(g),
				gX = gB.x,
				y = gB.y + gB.width - rH2;
			for (var j = rW2 + gX, w = gX + g.width; j < w; j += rW) {
				var r = genRock(j, y, a++);
				g.addGameObject(r);
			}
		}
		// Left of world
		for (var i = 0, l = grid.columns; i < l; ++i) {
			var g = grid.getGrid(i, 0)
				gY = grid.getBoundsOfGrid(g).y;
			for (var j = rH2 + gY, h = gY + g.height; j < h; j += rH) {
				var r = genRock(rW2, j, a++);
				g.addGameObject(r);
			}
		}
		// Right of world
		for (var i = 0, l = grid.columns; i < l; ++i) {
			var g = grid.getGrid(i, rightColumn),
				gB = grid.getBoundsOfGrid(g),
				gY = gB.y,
				x = gB.x + gB.width - rW2;
			for (var j = rH2 + gY, h = gY + g.height; j < h; j += rH) {
				var r = genRock(x, j, a++);
				g.addGameObject(r);
			}
		}
	};

	function PopulateEnvironment(grid)
	{
		var number = Math.floor((Math.random()*3));
		for(var i = 0; i < number; i++)
		{
			/*
			 * 1 = bush
			 * 2 = tree
			 * 3 = rock
			 */
			var type = Math.floor((Math.random()*3)+1);
			switch(type)
			{
				case 1:
					var bush = FindNewPosition(new Bush(), grid);
					grid.addGameObject(bush);
					break;
				case 2:
					var tree = FindNewPosition(new Tree(), grid);
					grid.addGameObject(tree);
					break;
				case 3:
					var rock = FindNewPosition(new Rock(), grid);
					grid.addGameObject(rock);
					break;
			}

		}

	};

	function FindNewPosition(obj, g)
	{
		var gridsObj = g.getGameObjects();
		var gb = grid.getBoundsOfGrid(g);
		var found = false;

		if (!obj.id) {
			//TODO: this will collide eventually
			obj.id = a++;
		}

		var found = false;
		while (!found) {
			found = true;
			var x = Math.floor(Math.random()*(gb.width - obj.width) + obj.width / 2);
			var y = Math.floor(Math.random()*(gb.height - obj.height) + obj.height / 2);
			x += gb.x;
			y += gb.y;
			obj.position.set(x,y);

			for(var i = 0, l = gridsObj.length; i < l; ++i) {
				if(gridsObj[i].collision(obj)) {
					found = false;
				}
			}

		}
		return obj;
	};

	function GetHatcheryGrid(team) {
		for (var i = 0; i < grid.rows; ++i) {
			for (var j = 0; j < grid.columns; ++j) {
				var g = grid.getGrid(i, j);
				if (g.hasHatchery == team) {
					return g;
				}
			}
		}
	}

	this.AddSnake = function(user) {
		var snake = user.getSnake();
		var size = this.GetCurrentSize();
		var g;
		switch(snake.team)
		{
			case Teams.Red:
				g = GetHatcheryGrid(Teams.Red);
				break;
			case Teams.Blue:
				g = GetHatcheryGrid(Teams.Blue);
				break;
		}
		FindNewPosition(snake, g);
		snake.grid = g;
		user.joinGridRoom(g.id)
		g.addGameObject(snake);

		return size;
	};

	this.GetCurrentSize = function() {
		var size = {
			height: 0,
			width: 0
		};


		if (grid) {
			return size;
		}
		for (var i = 0; i < grid.rows; ++i) {
			size.height += grid.getGrid(i, 0).height;
		}
		for (var i = 0; i < grid.columns; ++i) {
			size.width += grid.getGrid(0, i).width;
		}

		return size;
	};

	this.update = function(users) {
		var curTime = (new Date()).getTime();
		var elapsedTime = (curTime - storedTime) / 1000;
		storedTime = curTime;

		for (var u = 0, U = users.length; u < U; ++u) {
			var user = users[u],
				snake = user.getSnake(),
				velocity = snake.velocity.to,
				oldX = snake.position.x,
				oldY = snake.position.y,
				newX = oldX + (velocity.x * elapsedTime),
				newY = oldY + (velocity.y * elapsedTime),
				collision = false,
				OoB = false;

			snake.position.set(newX, newY);
			var g = updateSnakeGrid(snake, velocity);
			if (g) {
				if (g != snake.grid) {
					user.leaveGridRoom(snake.grid.id);
					snake.grid = g;
					user.joinGridRoom(g.id);
				}
			} else {
				OoB = true;
			}

			if (!OoB) {
				var gObjs = snake.grid.getGameObjects();
				for (var i = 0, l = gObjs.length; i < l; ++i) {
					var gObj = gObjs[i];
					if (snake.collision(gObj)) {
						collision = true;
						break;
					}
				}
			}
			if (OoB || collision) {
				snake.position.set(oldX, oldY);
				snake.velocity.set(0, 0);
				user.sendUpdatePacket(true);
			}
		}

	};

	function updateSnakeGrid(snake, vector) {
		var g = snake.grid,
			up = (vector.y > 0),
			down = (vector.y < 0),
			right = (vector.x > 0),
			left = (vector.x < 0),
			row = (up) ? 1 : (down) ? -1 : 0,
			column = (right) ? 1 : (left) ? -1 : 0;

		if (grid.positionInsideGrid(snake.position, g)) {
			return g;
		}
		// console.log(g.id);
		if (up || down) {
			g = grid.getGrid(g.row + row, g.column);
			if (!g) {
				return null;
			}
			if (grid.positionInsideGrid(snake.position, g)) {
				return g;
			}
		}
		if (left || right) {
			g = grid.getGrid(g.row, g.column + column);
			if (!g) {
				return null;
			}
			if (grid.positionInsideGrid(snake.position, g)) {
				return g;
			}
		}
		return null;
	}

	function environment(gameObject) {
		var grids = surroundingGrids(gameObject),
			env = [];
		for (var i = 0, l = grids.length; i < l; ++i) {
			if (grids[i] instanceof Object) {
				env = env.concat(grids[i].getGameObjects());
			}
		}
		return env;
	};

	function surroundingGrids(gameObject) {
		var g = gameObject.grid,
			row = g.row,
			column = g.column,
			grids = [g];
		var above = (row > 0),
			below = (row < grid.rows - 1),
			left = (column > 0),
			right = (column < grid.columns - 1);

		if (above) {
			if (left) {
				grids = grids.concat(grid.getGrid(row - 1, column - 1));
			}
			if (right) {
				grids = grids.concat(grid.getGrid(row - 1, column + 1));
			}
			grids = grids.concat(grid.getGrid(row - 1, column));
		}
		if (below) {
			if (left) {
				grids = grids.concat(grid.getGrid(row + 1, column - 1));
			}
			if (right) {
				grids = grids.concat(grid.getGrid(row + 1, column + 1));
			}
			grids = grids.concat(grid.getGrid(row + 1, column));
		}
		if (left) {
			grids = grids.concat(grid.getGrid(row, column - 1));
		}
		if (right) {
			grids = grids.concat(grid.getGrid(row, column + 1));
		}
		return grids;
	};

	this.surroundingGridIds = function(gameObject) {
		var grids = surroundingGrids(gameObject),
			gids = [];
		for (var i = 0, l = grids.length; i < l; ++i) {
			gids.push(grids[i].id);
		}
		return gids;
	};

	this.surroundingSnakes = function(gameObject) {
		var env = environment(gameObject).filter(function(obj) {
			return (obj.type == 'Snake' && obj != gameObject);
		});
		return env;
	};

	this.surroundingEnvironment = function(gameObject) {
		var env = environment(gameObject).filter(function(obj) {
			return obj.type != 'Snake';
		});

		return env;
	};

	init();
}

module.exports = World;
