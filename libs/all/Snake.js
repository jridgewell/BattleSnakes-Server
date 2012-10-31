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
	this.gridID = "";
	this.segments = [
		new CubicBezierSegment()
	];							// array of segments
	
	this.position = new Point();
}

Snake.prototype.extend(GameObject.prototype).extend({
	// I (snakeA) report I hit something (gameObject)
	// Use bounding box in my region to find the id of gameObject
	// gameObject.collision(myPosition, myVelocity)
	collide: function(gameObject) {
		return gameObject.collision(this.position, this.velocity);
	},
	
	// A snake (snakeA) reports hit it me
	collision: function(offset /*Point*/, v /*Vector*/) {
		if(v != null)
		{
			var angle = v.angle();
			var magnitude = v.magnitude();
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
