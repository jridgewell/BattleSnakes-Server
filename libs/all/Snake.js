var GameObject = require('./GameObject');
var Environment = require('./Environment/Environment');
var Point = require('./Point');
var Vector = require('./Vector');
var CubicBezierSegment = require('./CubicBezierSegment');
var Teams = require('./Teams');

function Snake(id) {
	this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
	this.stationary = false;

	this.name = 'Guest' + id;	// String
	this.team = Teams.Red;		// Teams obj
	this.color = 'FF0000';		// Hex ex: 00FF00
	this.velocity = new Vector();// float
	this.currentPowerups = null;	// Powerup Object
	this.numSegments = 1;		// int
	this.segments = [
		new CubicBezierSegment()
	];							// array of segments
	
	// I (snakeA) report I hit another snake (snakeB)
	// Use bounding box in my region to find the id of snakeB
	// snakeB.collision(offset, angle, v)
	this.collide = function(gameObject) {
		if (gameObject.stationary) {
			return gameObject.collision(this.position);
		}
		return gameObject.collision(this.position, this.velocity);
	};

	// A snake (snakeA) reports hit it me
	this.collision = function(offset /*Point*/, v /*Vector*/) {
		for (var i = 0; i < this.segments.length; ++i) {
			var s = this.segments[i].translate(offset);
			var angle = v.angle();
			s = s.rotate(-1 * angle);
			var m = v.magnitude();
			return s.isZero(m);
		}
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
}

Snake.prototype.extend(GameObject.prototype);

module.exports = Snake;
