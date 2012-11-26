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
	angle: function() { /*degrees*/
		return ((Math.atan2(-1 * this.dy(), -1 * this.dx()) / Math.PI * 180) + 180);
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
	},
	clone: function() {
		var v = new Vector(
			this.to.clone()
		);
		return v;
	},
	toJSON: function() {
		return {
			to: this.to.toJSON()
		};
	}
});

module.exports = Vector;
