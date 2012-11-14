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

	function PopulateEnvironment(grid)
	{
		var number = Math.floor((Math.random()*3));
		for(var i = 0; i < number; i++)
		{
			/*
			 *  1 = bush
			 *  2 = tree
			 *  3 = rock
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

	function FindNewPosition(obj, grid)
	{
		var gridsObj = grid.getGameObjects();
		var gb = grid.getBounds();
		var found = false;

		obj.id = ""+a++;

		while(!found)
		{
			var collided = false;


			var x = Math.floor((Math.random()*(gb.width - obj.width))+gb.width-gridSize);
			var y = Math.floor((Math.random()*(gb.height - obj.height))+gb.height-gridSize);
			obj.position.set(x,y);

			if(gridsObj.length > 0)
			{
				for(var i = 0; i < gridsObj.length; i++)
				{
					if(gridsObj[i].collision(obj))
					{
						collided = true;
					}

				}

				if(!collided || gridsObj.length == 0)
					found = true;

			}
			else
			{
				found = true;
			}
		}
		return obj;
	};

	function GetHatcheryGrid(team) {
		for (var i = 0; i < grid.rows; ++i) {
			for (var j = 0; j < grid.columns; ++j) {
				var g = grid.getGrid(i, j);
				if(g.hasHatchery == team) {
					return g;
				}
			}
		}
	}

	this.AddSnake = function(snake)
	{
		var size = this.GetCurrentSize();
		switch(snake.team)
		{
			case Teams.Red:
				var grid = GetHatcheryGrid(Teams.Red);
				var s = FindNewPosition(snake, grid);
				s.grid = grid;
				grid.addGameObject(s);
				break;
			case Teams.Blue:
				var grid = GetHatcheryGrid(Teams.Blue);
				var s = FindNewPosition(snake, grid);
				s.grid = grid;
				grid.addGameObject(s);
				break;
		}

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
			size.width += grid.getGrid(0, i).height;
		}

		return size;
	};

	this.update = function(users) {
		var curTime = (new Date()).getTime();
		var elapsedTime = (curTime - storedTime) / 1000;

		for (var u in users) {
			var snake = users[u].getSnake();

			snake.position.set(
				snake.position.x + (snake.velocity.to.x * elapsedTime),
				snake.position.y + (snake.velocity.to.y * elapsedTime)
			);
			updateUserGrid(users[u]);
		}

		storedTime = (new Date()).getTime();
	};

	function updateUserGrid(user) {

	}

	function environment(gameObject) {
		var g = gameObject.grid,
			row = g.row,
			column = g.column,
			env = [];
		var above = (row > 0),
			below = (row < grid.rows),
			left = (column > 0),
			right = (column < grid.columns);

		env = env.concat(g.getGameObjects());
		if (above) {
			if (left) {
				env = env.concat(grid.getGrid(row - 1, column - 1).getGameObjects());
			}
			if (right) {
				env = env.concat(grid.getGrid(row - 1, column + 1).getGameObjects());
			}
			env = env.concat(grid.getGrid(row - 1, column).getGameObjects());
		}
		if (below) {
			if (left) {
				env = env.concat(grid.getGrid(row + 1, column - 1).getGameObjects());
			}
			if (right) {
				env = env.concat(grid.getGrid(row + 1, column + 1).getGameObjects());
			}
			env = env.concat(grid.getGrid(row + 1, column).getGameObjects());
		}
		if (left) {
			env = env.concat(grid.getGrid(row, column - 1).getGameObjects());
		}
		if (right) {
			env = env.concat(grid.getGrid(row, column + 1).getGameObjects());
		}
		return env;
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
