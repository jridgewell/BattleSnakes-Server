var GameObject = require('./GameObject');
var Teams = require('./Teams');

function Snake(id) {
	this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;

	var name = 'Guest' + id;	// String
	var team = Teams.Red;		// Teams obj
	var color = 'FF0000';		// Hex ex: 00FF00
	var velocity = 1;			// float
	var currentPowerups = null;	// Powerup Object
	var numSegments = 1;		// int
	var segments = [];			// array of segments
	
	this.collision = function(data) {
		// Collision override 
	};
	
	//passes in a string "Red" or "Blue"
	function ChangeTeam(newTeam) {
		if (Teams.hasOwnProperty(newTeam)) {
			team = newTeam;
		}
	}
	
	//passes in a Powerup Object
	function UsePowerup(powerup) {
		
	}
	
	this.send = function() {
		return {
			name: name,
			id: id,
			position: this.position,
			team: team,
			color: color,
			segments: segments
		}
	}
}

Snake.prototype.extend(GameObject.prototype);

module.exports = Snake;
