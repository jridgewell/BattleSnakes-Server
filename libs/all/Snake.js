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
		new Point(1, 0)
	);// float
	this.currentPowerups = null;	// Powerup Object
	this.numSegments = 1;		// int
	this.grid = null;
	this.height = 20;
	this.width = 20;
	this.position = new Point();
	this.eggs = [];
	this.segments = new CubicBezierSpline([
		new CubicBezierSegment(
			this.position,
			{
				x: this.position.x - 20,
				y: this.position.y
			},
			{
				x: this.position.x - 40,
				y: this.position.y
			},
			{
				x: this.position.x - 60,
				y: this.position.y
			}
		),
		new CubicBezierSegment(
			{
				x: this.position.x - 60,
				y: this.position.y
			},
			{
				x: this.position.x - 80,
				y: this.position.y
			},
			{
				x: this.position.x - 100,
				y: this.position.y
			},
			{
				x: this.position.x - 120,
				y: this.position.y
			}
		),
	]);// array of segments
}

Snake.prototype.extend(GameObject.prototype).extend({
	wiggle: function() {
		this.segments.wiggle(this.velocity);
	},
	collision: function(gameObject) {
		if (gameObject.id == this.id) {
			return false;
		}
		if (gameObject.isStationary) {
			return gameObject.collision(this);
		} else {
			var offset = gameObject.position,
				velocity = gameObject.velocity,
				angle = velocity.angle(),
				magnitude = velocity.magnitude(),
				segments = this.segments.translate(offset);
			for (var i = 0; i < segments.length; ++i) {
				var s = segments[i];
				s = s.rotate(-1 * angle);
				var hit = s.isZero(magnitude);
				if (hit) {
					this.segments.splice(i);
					return i;
				}
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
	},

	pickUpEgg: function(egg) {
		this.eggs.push(egg);
	},

	hasEggs: function() {
		return (this.eggs.length > 0);
	},

	dropOffEggs: function(hatchery) {
		return this.eggs.splice(0);
	}
});

module.exports = Snake;
