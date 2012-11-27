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

	this.name = 'Guest' + id;
	this.team = Teams.Red;
	this.color = 'FF0000';
	this.velocity = new Vector(
		new Point(1, 0)
	);// float
	this.currentPowerups = [];
	this.numSegments = 1;
	this.grid = null;
	this.height = 20;
	this.width = 20;
	this.position = new Point();
	this.eggs = [];
	this.segments = new CubicBezierSpline();
	this.addSegment();
}

Snake._extends(GameObject);
Snake.prototype.extend({
	wiggle: function() {
		this.segments.wiggle(this.velocity);
	},
	move: function(pointOrX, y) {
		var point = (pointOrX instanceof Point) ? pointOrX : new Point(x, y),
			d = this.position.subtract(point).multiply(-1);
		this.position = point;
		this.segments = this.segments.translate(d);
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
					gameObject.score('bite', 1);
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

	addSegment: function() {
		var last = this.segments.last(),
			lastFrom = (last) ? last.from : this.velocity.to,
			lastPoint = (last) ? last.to : this.position,
			v = new Vector(
				lastFrom.subtract(lastPoint)
			).normalize(),
			angle = v.angleRadians(),
			x = Math.cos(angle),
			y = Math.sin(angle),
			cp1 = lastPoint.add(new Point(
				x * 2,
				y * 2
			)),
			cp2 = lastPoint.add(new Point(
				x * 4,
				y * 4
			)),
			to = lastPoint.add(new Point(
				x * 6,
				y * 6
			));
		var segment = new CubicBezierSegment(
			lastPoint,
			cp1,
			cp2,
			to
		);
		this.segments.push(segment);
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

	hasEggs: function() {
		return (this.eggs.length > 0);
	},

	pickUpEgg: function(egg) {
		this.eggs.push(egg);
		this.addSegment();
	}
});

module.exports = Snake;
