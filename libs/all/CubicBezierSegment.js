var Point = require('./Point');
var CubicBezierCurve = require('./CubicBezierCurve');
/* CubicBezierSegment class
 *
 */
function CubicBezierSegment(from /*Point*/, control1 /*Point*/, control2 /*Point*/, to /*Point*/) {
	this.set(from, control1, control2, to);
}

CubicBezierSegment.prototype.extend({
	approximate: function(numSegments) {
		numSegments = (typeof numSegments == 'number') ? numSegments : 100;
		var approx = CubicBezierCurve(this, [], numSegments);
		return approx;
	},
	rotate: function(theta /*degrees*/) {
		var c = new CubicBezierSegment(
			this.from.rotate(theta),
			this.control1.rotate(theta),
			this.control2.rotate(theta),
			this.to.rotate(theta)
		);
		return c;
	},
	translate: function(offset /*Point*/) {
		var c = new CubicBezierSegment(
			this.from.translate(offset),
			this.control1.translate(offset),
			this.control2.translate(offset),
			this.to.translate(offset)
		);
		return c;
	},
	isZero: function(x) {
		var roots = this.roots();
		roots = roots.filter(function(t) {
			return (t >= 0 && t <= 1);
		});
		return (roots.length > 0);
	},
	roots: function() {
		var epsilon = 1e-6;
		var results = new Array();
		
		var p1 = this.from.y;
		var p2 = this.control1.y;
		var p3 = this.control2.y;
		var p4 = this.to.y;
		
		
		var c3 = (-p1+3*p2-3*p3+p4); //t^3
		var c2 = (3*p1-6*p2+3*p3) / c3;//t^2
		var c1 = (-3*p1+3*p2) / c3;//t^1
		var c0 = p1 / c3;//t^0
		
		var a	   = (3*c1 - c2*c2) / 3;
		var b	   = (2*c2*c2*c2 - 9*c1*c2 + 27*c0) / 27;
		var offset  = c2 / 3;
		var discrim = b*b/4 + a*a*a/27;
		var halfB   = b / 2;
		
		if ( Math.abs(discrim) <= epsilon ) disrim = 0;
		
		if ( discrim > 0 ) {
			var e = Math.sqrt(discrim);
			var tmp;
			var root;
		
			tmp = -halfB + e;
			if ( tmp >= 0 )
				root = Math.pow(tmp, 1/3);
			else
				root = -Math.pow(-tmp, 1/3);
		
			tmp = -halfB - e;
			if ( tmp >= 0 )
				root += Math.pow(tmp, 1/3);
			else
				root -= Math.pow(-tmp, 1/3);
		
			results.push( root - offset );
		} else if ( discrim < 0 ) {
			var distance = Math.sqrt(-a/3);
			var angle	= Math.atan2( Math.sqrt(-discrim), -halfB) / 3;
			var cos	  = Math.cos(angle);
			var sin	  = Math.sin(angle);
			var sqrt3	= Math.sqrt(3);
		
			results.push( 2*distance*cos - offset );
			results.push( -distance * (cos + sqrt3 * sin) - offset);
			results.push( -distance * (cos - sqrt3 * sin) - offset);
		} else {
			var tmp;
		
			if ( halfB >= 0 )
				tmp = -Math.pow(halfB, 1/3);
			else
				tmp = Math.pow(-halfB, 1/3);
		
			results.push( 2*tmp - offset );
			// really should return next root twice, but we return only one
			results.push( -tmp - offset );
		}
		return results;
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
	},
	clone: function() {
		var c = new CubicBezierSegment(this.from, this.control1, this.control2, this.to);
		return c;
	}
});

module.exports = CubicBezierSegment;