require('../misc');
var Point = require('./Point');
/* Vector class
 *
 */
var Vector = function(to /*Point*/) {
	this.set(to);
};

Vector.prototype.extend({
	get: function() {
		return {
			to: this.to
		};
	},
	set: function(to /*Point*/) {
		this.to = (to instanceof Point) ? to : new Point(to);;
		return this;
	},
	rotate: function(theta /*degrees*/) {
		var v = new Vector(
			this.to.rotate(theta)
		);
		return v;
	},
	unRotate: function() {
		var v = this.rotate(-1 * this.angle());
		return v;
	},
	angleRadians: function() {
		var dx = this.dx(),
			dy = this.dy();
		if (dx === 0 && dy === 0) {
			return 0;
		}
		var angle = (Math.atan(dy / dx));
		if (dx < 0) {
			angle += Math.PI;
		} else if (dx >= 0 && dy < 0) {
			angle = 2 * Math.PI + angle;
		}
		return angle;
	},
	angle: function() { /*degrees*/
		return this.angleRadians() * 180 / Math.PI;
	},
	dx: function() {
		return this.to.x;
	},
	dy: function() {
		return this.to.y;
	},
	magnitude: function() {
		var dy = this.dy(),
			dx = this.dx();
		return Math.sqrt( (dy * dy) + (dx * dx) );
	},
	multiply: function(scalar) {
		var v = new Vector(
			this.to.multiply(scalar)
		);
		return v;
	},
	divide: function(scalar) {
		var v = new Vector(
			this.to.divide(scalar)
		);
		return v;
	},
	add: function(offset) {
		var v = new Vector(
			this.to.add(offset)
		);
		return v;
	},
	subtract: function(offset) {
		var v = new Vector(
			this.to.subtract(offset)
		);
		return v;
	},
	normalize: function() {
		var m = this.magnitude(),
		v = new Vector(
			this.to.x / m,
			this.to.y / m
		)
		return v;
	},
	clone: function() {
		var v = new Vector(
			this.to.clone()
		);
		return v;
	},
	toJSON: function() {
		return {
			angle: parseInt(this.angle(), 10),
			magnitude: parseInt(this.magnitude(), 10)
		};
	},
	equals: function(other) {
		return ((this.to.x === other.to.x) && (this.to.y === other.to.y));
	},
	angleEquals: function(other) {
		return (this.angle() === other.angle());
	}
});

module.exports = Vector;
