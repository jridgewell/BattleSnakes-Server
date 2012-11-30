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
	this._velocity = new Vector(
		new Point(0, 0)
	);
	this.shouldMove = false;
	this.numSegments = 1;
	this.grid = null;
	this.height = 20;
	this.width = 20;
	this.position = new Point();
	this.eggs = [];
	this.powerups = [];
	this.sprintObj = {
		current: 'regen',
		remaining: 3
	};
	this.segments = new CubicBezierSpline();
	this.addSegment();

	(function(snake) {
		snake.segments.vel = function() {
			return snake.velocity;
		};
	})(this);
	this.update = function() {};
	this.updateSprint = function() {};
}

Snake._extends(GameObject);
Snake.prototype.extend({
	wiggle: function() {
		if (!this.shouldMove) {
			return;
		}
		this.segments.wiggle();
		return this;
	},
	move: function(pointOrX, y) {
		if (!this.shouldMove) {
			return;
		}
		var point = (pointOrX instanceof Point) ? pointOrX : new Point(pointOrX, y),
			p  = this.position.clone(),
			d = p.subtract(point);
		this.position = point;
		this.segments.move(d);
		return this;
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
				segments = this.segments.clone().translate(offset).rotate(-1 * angle);
			for (var i = 0; i < segments.length; ++i) {
				var hit = segments[i].isZero(magnitude);
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
			lastPoint = (last) ? last.to : this.position;
		lastFrom.clone();
		var v = new Vector(
				lastFrom.subtract(lastPoint)
			),
			angle = v.angleRadians(),
			x = Math.cos(angle),
			y = Math.sin(angle),
			cp1 = (new Point(
				x * 2,
				y * 2
			)).add(lastPoint),
			cp2 = (new Point(
				x * 4,
				y * 4
			)).add(lastPoint),
			to = (new Point(
				x * 6,
				y * 6
			)).add(lastPoint);
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
		var sprintObj = this.sprintObj;
		switch (sprintObj.current) {
			case 'use':
				if (sprintObj.remaining <= 0) {
					sprintObj.remaining = 0;
					sprintObj.current = 'regen';
					this.updateSprint();
					this.velocity = this.velocity.clone().divide(2);
					return;
				}
				// Drain at 1 unit per second
				sprintObj.remaining -= 1 * elapsedTime;
				break;
			case 'regen':
				if (sprintObj.remaining >= 3) {
					sprintObj.remaining = 3;
					sprintObj.current = 'full';
					this.updateSprint();
					return;
				}
				// Regen at 1/3 unit per second
				sprintObj.remaining += 1 / 3 * elapsedTime;
				break;
			case 'full':
				break;
		}
	},

	handleSprint: function(startStop) {
		sprintObj = this.sprintObj;
		console.log(sprintObj);
		switch (startStop) {
			case 'start':
				if (sprintObj.current != 'use' && sprintObj.remaining >= 1) {
					sprintObj.current = 'use';
					this.updateSprint();
					this.velocity = this.velocity.clone().multiply(2);
				}
				break;
			case 'stop':
				if (sprintObj.current == 'use') {
					sprintObj.current = 'regen';
					this.updateSprint();
					this.velocity = this.velocity.clone().divide(2);
				}
				break;
		}
	},

	get velocity() {
		return this._velocity;
	},

	set velocity(vel) {
		var oldVelocity = this._velocity;
		this._velocity = new Vector(vel);
		if (!oldVelocity.equals(this._velocity)) {
			this.update();
		}
	}
});

module.exports = Snake;
