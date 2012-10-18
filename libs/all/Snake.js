var GameObject = require('./GameObject');

Snake.prototype = new GameObject();
Snake.prototype.constructor = Snake;

var Teams = {"Red":0, "Blue":1}; 

function Snake(id)
{
	this.id = id;
	var name;  // String
	var team; // Teams obj
	var color;  // Hex ex: 00FF00
	var velocity; // float
	var currentPowerups; // Powerup Object
	var numSegments; // int
	var segments; // array of segments
	
    __construct = function() 
    {
    	
    	// put initlize code here
    }();
	
	this.Collision = function(data)
	{
		// Collision override 
	};
	
	//passes in a string "Red" or "Blue"
	function ChangeTeam(team)
	{
		
	};
	
	//passes in a Powerup Object
	function UsePowerup(powerup)
}

module.exports = Snake;
module.exports = Teams;