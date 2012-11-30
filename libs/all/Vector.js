require('../misc');
var Point = require('./Point');
/* Vector class
 *
 */
var Vector = function(to /*Point*/, y) {
	this.set(to, y);
	this._angle = undefined;
};

Vector.prototype.extend({
	get to() {
		return this._to;
	},
	set to(p) {
		this._to = p;
		if (!(p.x === 0 && p.y === 0)) {
			this.computeAngle();
		}
	},

	computeAngle: function() {
		var dx = this.dx,
			dy = this.dy;
		if (dx === 0 && dy === 0) {
			return 0;
		}
		var angle = (Math.atan(dy / dx));
		if (dx < 0) {
			angle += Math.PI;
		} else if (dx >= 0 && dy < 0) {
			angle = 2 * Math.PI + angle;
		}
		this._angle = angle;
	},

	get: function() {
		return {
			to: this.to
		};
	},
	set: function(vec, y) {
		if (vec instanceof Vector) {
			this.set(vec.to);
		} else {
			this.to = (vec instanceof Point) ? vec.clone() : new Point(vec, y);
		}
		return this;
	},
	rotate: function(theta /*degrees*/) {
		this.to.rotate(theta)
		this.computeAngle();
		return this;
	},
	angleRadians: function() {
		return this._angle;
	},
	angle: function() { /*degrees*/
		return this.angleRadians() * 180 / Math.PI;
	},
	get dx() {
		return this.to.x;
	},
	get dy() {
		return this.to.y;
	},
	magnitude: function() {
		var dy = this.dy,
			dx = this.dx;
		return Math.sqrt( (dy * dy) + (dx * dx) );
	},
	multiply: function(scalar) {
		this.to.multiply(scalar)
		this.computeAngle();
		return this;
	},
	divide: function(scalar) {
		this.to.divide(scalar)
		this.computeAngle();
		return this;
	},
	add: function(offset) {
		this.to.add(offset)
		this.computeAngle();
		return this;
	},
	subtract: function(offset) {
		this.to.subtract(offset)
		this.computeAngle();
		return this;
	},
	normalize: function() {
		var m = this.magnitude();
		this.to.divide(m);
		return this;
	},
	clone: function() {
		return new Vector(this);
	},
	toJSON: function() {
		return {
			angle: parseInt(this.angle(), 10),
			magnitude: parseInt(this.magnitude(), 10)
		};
	},
	equals: function(other) {
		return this.to.equals(other.to);
	},
	angleEquals: function(other) {
		return (Math.abs(this.angle() - other.angle()) < 1);
	}
});

module.exports = Vector;
