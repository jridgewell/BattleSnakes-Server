var GameObject = require('./GameObject');
var Environment = require('./Environment/Environment');
var Point = require('./Point');
var Vector = require('./Vector');
var CubicBezierSpline = require('./CubicBezierSpline');
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
	this.velocity = new Vector(
		new Point(50, 0)
	);// float
	this.currentPowerups = null;	// Powerup Object
	this.numSegments = 1;		// int
	this.grid = null;
	this.segments = new CubicBezierSpline();// array of segments

	this.height = 20;
	this.width = 20;


	this.position = new Point();
}

Snake.prototype.extend(GameObject.prototype).extend({
	collision: function(gameObject) {
		if (gameObject.id == this.id) {
			return;
		}
		if (gameObject.isStationary) {
			return gameObject.collision(this);
		} else {
			var offset = gameObject.position;
			var velocity = gameObject.velocity;
			var angle = velocity.angle();
			var magnitude = velocity.magnitude();
			var segments = this.segments.translate(offset);
			for (var i = 0; i < segments.length; ++i) {
				var s = segments[i];
				s = s.rotate(-1 * angle);
				return s.isZero(magnitude);
			}
		}
	},

	toJSON: function() {
		return {
			id: this.id,
			position: this.position.toJSON(),
			velocity: this.velocity.toJSON(),
			currentPowerup: null,
			segments: this.segments.toJSON()
		};
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
