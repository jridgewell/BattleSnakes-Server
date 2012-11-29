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
	this.velocity = new Vector(
		new Point(0, 0)
	);// float
	this.numSegments = 1;
	this.grid = null;
	this.height = 20;
	this.width = 20;
	this.position = new Point();
	this.eggs = [];
	this.powerups = [];
	this.sprintObj = {
		current: 'regen'
		remaining: 3,
		intervalID: undefined
	};
	this.segments = new CubicBezierSpline();
	this.addSegment();

	(function(snake) {
		snake.segments.vel = function() {
			return snake.velocity;
		};
	})(this);
}

Snake._extends(GameObject);
Snake.prototype.extend({
	wiggle: function() {
		this.segments.wiggle();
	},
	move: function(pointOrX, y) {
		var point = (pointOrX instanceof Point) ? pointOrX : new Point(pointOrX, y),
			d = this.position.subtract(point);
		this.position = point;
		this.segments.move(d);
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

	addSnakePacket: function() {
		return {
			id: this.id,
			team: this.team,
			position: this.position,
			velocity: this.velocity,
			segments: this.segments
		};
	},

	addSegment: function() {
		var last = this.segments.last(),
			lastFrom = (last) ? last.from : this.velocity.to,
			lastPoint = (last) ? last.to : this.position,
			v = new Vector(
				lastFrom.subtract(lastPoint)
			),
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
			this.team = Teams[team];
		}
		return this;
	},

	//passes in a Powerup Object
	usePowerup: function(powerup) {
		var index = this.powerups.indexOf(powerup);
		return (index > -1) ? this.powerups.splice(index, 1) : undefined;
	},

	hasEggs: function() {
		return (this.eggs.length > 0);
	},

	pickUpEgg: function(egg) {
		this.eggs.push(egg);
		this.addSegment();
	},

	pickUpPowerup: function(powerup) {
		this.powerups.push(powerup);
	},

	usePowerup: function(powerup) {
		var index = this.powerups.indexOf(powerup);
		if (index > -1) {
			return this.powerup.splice(index, 1);
		}
	},

	sprint: function(elapsedTime) {
		var snake = this;
		switch (this.sprintObj.current) {
			case 'use':
				if (snake.sprint.remaining <= 0) {
					this.sprint.current = 'regen';
					this.velocity.set(
						this.velocity.divide(2);
					);
					return;
				}
				// Drain at 1 unit per second
				this.sprint.remaining -= 1 * elapsedTime;
				break;
			case 'regen':
				if (snake.sprint.remaining >= 3) {
					return;
				}
				// Regen at 1/3 unit per second
				this.sprint.remaining += 1 / 3 * elapsedTime;
				break;
		}
	}
});

module.exports = Snake;
