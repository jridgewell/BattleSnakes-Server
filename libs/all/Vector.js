require('../misc');
var Point = require('./Point');
/* Vector class
 *
 */
var Vector = function(from /*Point*/, to /*Point*/) {
	this.set(from, to);
};

Vector.prototype.extend({
	get: function() {
		return {
			from: this.from,
			to: this.to
		};
	},
	set: function(from /*Point*/, to /*Point*/) {
		this.from = (from instanceof Point) ? from : new Point();
		this.to = (to instanceof Point) ? to : new Point();;
		return this;
	},
	rotate: function(theta /*degrees*/) {
		var v = new Vector(
			this.from.rotate(theta),
			this.to.rotate(theta)
		);
		return v;
	},
	unRotate: function() {
		var v = this.rotate(-1 * this.angle());
		return v;
	},
	angle: function() { /*degrees*/
		return (Math.atan2(this.dy(), this.dx()) / Math.PI * 180);
	},
	dx: function() {
		return (this.to.x - this.from.x);
	},
	dy: function() {
		return (this.to.y - this.from.y);
	},
	magnitude: function() {
		dy = this.dy();
		dx = this.dx();
		return Math.sqrt( (dy * dy) + (dx * dx) );
	},
	clone: function() {
		var v =  new Vector(this.from.clone(), this.to.clone());
		return v;
	}
});

module.exports = Vector;