var Grid = require('./Grid');
var Hatchery = require('./all/Hatchery');
var Egg = require('./all/Environment/Egg');
var Bush = require('./all/Environment/Bush');
var Rock = require('./all/Environment/Rock');
var Tree = require('./all/Environment/Tree');
var GameObject = require('./all/GameObject');
var Point = require('./all/Point');
var Debug = require('./Debug');
var d = new Debug();


function World()
{
	var gridSize = 0;
	var grid;
	var a = 0;
	var storedTime = (new Date()).getTime();
	
	function init()
	{
		gridSize = 512;
		
		grid = new Array();
		grid[0] = [new Grid("0x0"),new Grid("0x1"),new Grid("0x2")];
		grid[1] = [new Grid("1x0"),new Grid("1x1"),new Grid("1x2")];
		grid[2] = [new Grid("2x0"),new Grid("2x1"),new Grid("2x2")];
		
		InitEnvironment();
	};
	
	function InitEnvironment()
	{
		// set up Hatcherys
		
		grid[0][1].AddGameObject(new Hatchery(0));
		grid[0][1].hasHatchery = 0;
		grid[0][1].gameObjects[0].position.set(grid[0][1].GetBounds().width/2,grid[0][1].GetBounds().height/2);
		grid[2][1].AddGameObject(new Hatchery(1));
		grid[2][1].hasHatchery = 1;
		grid[2][1].gameObjects[0].position.set(grid[2][1].GetBounds().width/2,grid[2][1].GetBounds().height/2);

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
					grid.AddGameObject(bush);
					break;
				case 2:
					var tree = FindNewPosition(new Tree(), grid);
					grid.AddGameObject(tree);
					break;
				case 3:
					var rock = FindNewPosition(new Rock(), grid);
					grid.AddGameObject(rock);
					break;
			}
			
		}
		
	};
	
	function FindNewPosition(obj, grid)
	{
		var gridsObj = grid.GetGameObjects();
		var gb = grid.GetBounds();
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
		var env;
		switch(snake.team)
		{
			case 0:
				var grid = GetHatcheryGrid(0);
				var s = FindNewPosition(snake, grid);
				s.gridID = grid.id;
				grid.AddGameObject(s);
				env = grid.GetGameObjects();
				break;
			case 1:
				var grid = GetHatcheryGrid(1);
				var s = FindNewPosition(snake, grid);
				s.gridID = grid.id;
				grid.AddGameObject(s);
				env = grid.GetGameObjects();
				break;
		}
		
		return env;
	};
	
	this.GetCurrentSize = function()
	{
		
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
	
	init();
}

module.exports = World;