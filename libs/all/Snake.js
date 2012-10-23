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

	var name = 'Guest' + id;	// String
	var team = Teams.Red;		// Teams obj
	var color = 'FF0000';		// Hex ex: 00FF00
	var velocity = new Vector();// float
	var currentPowerups = null;	// Powerup Object
	var numSegments = 1;		// int
	var segments = [
		new CubicBezierSegment();
	];							// array of segments
	
	// I (snakeA) report I hit another snake (snakeB)
	// Use bounding box in my region to find the id of snakeB
	// snakeB.collision(offset, angle, v)
	this.collide = function(gameObject) {
		if (gameObject.stationary) {
			return gameObject.collision(this.velocity.to);
		}
		var offset = this.velocity.from;
		var angle = this.velocity.angle();
		var v = this.velocity.center().unRotate();
		return gameObject.collision()
	};

	// A snake (snakeA) reports it me
	this.collision = function(offset /*Point*/, angle /*degrees*/, v /*Vector*/) {
		for (var i = 0; i < segments.length; ++i) {
			var s = segments[i].translate(offset);
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
