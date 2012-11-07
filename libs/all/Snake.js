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
	this.isStationary = false;

	this.name = 'Guest' + id;	// String
	this.team = Teams.Red;		// Teams obj
	this.color = 'FF0000';		// Hex ex: 00FF00
	this.velocity = new Vector();// float
	this.currentPowerups = null;	// Powerup Object
	this.numSegments = 1;		// int
	this.gridID = "";
	this.segments = [
		new CubicBezierSegment()
	];							// array of segments

	this.height = 20;
	this.width = 20;

	
	this.position = new Point();
}

Snake.prototype.extend(GameObject.prototype).extend({
	collision: function(gameObject) {
		if (gameObject.isStationary) {
			return gameObject.collision(this);
		} else {
			var offset = gameObject.position;
			var velocity = gameObject.velocity;
			var angle = velocity.angle();
			var magnitude = velocity.magnitude();
			for (var i = 0; i < this.segments.length; ++i) {
				var s = this.segments[i].translate(offset);
				s = s.rotate(-1 * angle);
				return s.isZero(magnitude);
			}
		}
	},
	
	//passes in a string "Red" or "Blue"
	changeTeam: function(team) {
		if (Teams.hasOwnProperty(team)) {
			this.team = team;
		}
		return this;
	},
	
	//passes in a Powerup Object
	usePowerup: function(powerup) {
		return this;
	}
});

module.exports = Snake;
