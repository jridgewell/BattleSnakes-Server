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
		dy = this.dy();
		dx = this.dx();
		return Math.sqrt( (dy * dy) + (dx * dx) );
	},
	clone: function() {
		var v =  new Vector(this.to.clone());
		return v;
	}
});

module.exports = Vector;