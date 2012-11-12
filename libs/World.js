var Grid = require('./Grid');
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
		grid = new Array();
		grid[0] = [new Grid("0x0"), new Grid("0x1"), new Grid("0x2")];
		grid[1] = [new Grid("1x0"), new Grid("1x1"), new Grid("1x2")];
		grid[2] = [new Grid("2x0"), new Grid("2x1"), new Grid("2x2")];
		
		InitEnvironment();
	};
	
	function InitEnvironment()
	{
		var bounds;
		// set up Hatcherys
		
		grid[0][1].addGameObject(new Hatchery(0));
		grid[0][1].hasHatchery = Teams.Red;
		bounds = grid[0][1].getBounds();
		grid[0][1].gameObjects[0].position.set(bounds.width/2, bounds.height/2);
		

		grid[2][1].addGameObject(new Hatchery(1));
		grid[2][1].hasHatchery = Teams.Blue;
		bounds = grid[2][1].getBounds();
		grid[2][1].gameObjects[0].position.set(bounds.width/2, bounds.height/2);

		// populate random environment
		
		console.log("Populating world with environment ...");
		PopulateEnvironment(grid[0][0]);
		PopulateEnvironment(grid[0][2]);
		PopulateEnvironment(grid[1][0]);
		PopulateEnvironment(grid[1][1]);
		PopulateEnvironment(grid[1][2]);
		PopulateEnvironment(grid[2][0]);
		PopulateEnvironment(grid[2][2]);
		
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
		
		obj.id = ""+obj.type+a++;
		
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
	
	function GetHatcheryGrid(team)
	{
		for (var i = 0; i < grid.length; i++)
		{
		    for (var j = 0; j < grid[i].length; j++)
		    {
		         if(grid[i][j].hasHatchery == team)
		         {
		        	 return grid[i][j];
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
	
	this.GetCurrentSize = function()
	{
		var size = {
			height: 0,
			width: 0
		};
		
		
		if (!grid || !grid[0]) {
			return size;
		}
		size.height = gridSize * grid.length;
		size.width = gridSize * grid[0].length;

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
		}
		
		
		storedTime = (new Date()).getTime();
	};
	
	this.surroundingEnvironment = function(gameObject) {
		var g = gameObject.grid,
			row,
			column,
			env = [];
		// Find the grid
		for (var i = 0, l = grid.length; i < l; ++i) {
			if ((column = grid[i].indexOf(g)) > -1) {
				row = i;
				break;
			}
		}
		
		if (row != undefined) {
			var above = (row > 0),
				below = (row < grid.length - 2),
				left = (column > 0),
				right = (column < grid[row].length - 2);
				
			env = env.concat(grid[row][column].getGameObjects());
			if (above) {
				if (left) {
					env = env.concat(grid[row - 1][column - 1].getGameObjects());
				}
				if (right) {
					env = env.concat(grid[row - 1][column + 1].getGameObjects());
				}
				env = env.concat(grid[row - 1][column].getGameObjects());
			}
			if (below) {
				if (left) {
					env = env.concat(grid[row + 1][column - 1].getGameObjects());
				}
				if (right) {
					env = env.concat(grid[row + 1][column + 1].getGameObjects());
				}
				env = env.concat(grid[row + 1][column].getGameObjects());
			}
			if (left) {
				env = env.concat(grid[row][column - 1].getGameObjects());
			}
			if (right) {
				env = env.concat(grid[row][column + 1].getGameObjects());
			}
		}
		
		env = env.filter(function(obj) {
			return obj.type != 'Snake';
		});
		
		return env;
	}
	
	init();
}

module.exports = World;