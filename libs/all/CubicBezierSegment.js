require('./Point');
var CubicBezierCurve = require('./CubicBezierCurve');
/* CubicBezierSegment class
 *
 */
var CubicBezierSegment = function(from /*Point*/, control1 /*Point*/, control2 /*Point*/, to /*Point*/) {
	this.set(from, control1, control2, to);
};

CubicBezierSegment.prototype.extend({
	approximate: function(numSegments) {
		return CubicBezierCurve(this, [], numSegments);
	},
	get: function() {
		return {
			from: this.from,
			control1: this.control1,
			control2: this.control2,
			to: this.to
		};
	},
	set: function(from, control1, control2, to) {
		this.from = (from instanceof Point) ? from : new Point();
		this.control1 = (control1 instanceof Point) ? control1 : new Point();
		this.control2 = (control2 instanceof Point) ? control2 : new Point();
		this.to = (to instanceof Point) ? to : new Point();
	}
	clone: function() {
		var c = new CubicBezierSegment(this.from, this.control1, this.control2, this.to);
		return c;
	}
});

module.exports = CubicBezierSegment;