var Point = require('./Point');
var CubicBezierSegment = require('./CubicBezierSegment');
/* CubicBezierSpline class
 * Handles an array of CubicBezierSegments
 */
function CubicBezierSpline(bezierSegments /*Array[CubicBezierSegments]*/) {
	this.bezierSegments = [];
	if (bezierSegments) {
		for (var i = 0, l = bezierSegments.length; i < l; ++i) {
			this.push(bezierSegments[i]);
		}
	}
	this.shouldWiggle = true;
	this.storedTime = undefined;
	this.time = 0;
}

CubicBezierSpline.prototype.extend({
	wiggle: function(vector) {
		if (this.shouldWiggle) {
			var now = Date.now() / 1000,
				delta = this.storedTime ? now - this.storedTime : 0;
			this.time += delta;
			this.storedTime = now;
			var height = 5,
				angle = vector.angle(),
				spline = this.rotate(angle * -1),
				l = spline.bezierSegments.length;
			if (l) {
					for (var i = 0; i < l; ++i) {
					//http://paperjs.org/tutorials/animation/creating-animations/
					var seg = spline.bezierSegments[i],
						sinus = Math.sin(this.time * 3.2 + i);
					seg.to.y = sinus * height;
				}
				this.bezierSegments = spline.rotate(angle).bezierSegments;
				this.smooth();
			}
		}
	},
	approximate: function(segments /*= 100 */) {
		segments = (typeof segments == 'number') ? Math.round(segments) : 100;
		var points = [],
			l = this.bezierSegments.length;

		if (l) {
			points.push(
				this.bezierSegments[0].from.clone()
			);
			for (var i = 0; i < l; ++i) {
				points = this.bezierSegments[i].approximate(points, segments);
			}
		}

		return points;
	},
	rotate: function(theta /*degrees*/) {
		var spline = new CubicBezierSpline();
		for (var i = 0, l = this.bezierSegments.length; i < l; ++i) {
			var c = this.bezierSegments[i].rotate(theta);
			if (i > 0) {
				c.from = spline.bezierSegments[i - 1].to;
			}
			spline.bezierSegments[i] = c;
		}
		return spline;
	},
	translate: function(offset /*Point*/) {
		var spline = new CubicBezierSpline();
		for (var i = 0, l = this.bezierSegments.length; i < l; ++i) {
			var c = this.bezierSegments[i].translate(offset);
			if (i > 0) {
				c.from = spline.bezierSegments[i - 1].to;
			}
			spline.bezierSegments[i] = c;
		}
		return spline;
	},
	x: function(t) {
		return this.coordinate('x', t);
	},
	y: function(t) {
		return this.coordinate('y', t);
	},
	xPrime: function(t) {
		return this.coordinatePrime('x', t);
	},
	yPrime: function(t) {
		return this.coordinatePrime('y', t);
	},
	coordinate: function(xOrY /*string, 'x' or 'y'*/, t) {
		var index = Math.floor(t),
			segment = this.bezierSegments[index];
		return segment ? segment.coordinate(xOrY, t) : undefined;
	},
	coordinatePrime: function(xOrY /*string, 'x' or 'y'*/, t) {
		var index = Math.floor(t),
			segment = this.bezierSegments[index];
		return segment ? segment.coordinatePrime(xOrY, t) : undefined;
	},
	clone: function() {
		var spline = new CubicBezierSpline();
		for (var i = 0, l = this.bezierSegments.length; i < l; ++i) {
			var c = this.bezierSegments[i].clone();
			spline.push(c);
		}
		return spline;
	},
	toJSON: function() {
		var spline = [];
		for (var i = 0, l = this.bezierSegments.length; i < l; ++i) {
			spline[i] = this.bezierSegments[i].toJSON();
		}
		return spline;
	},
	push: function(segment) {
		segment = (segment instanceof CubicBezierSegment) ? segment : new CubicBezierSegment(segment);
		var l = this.bezierSegments.length;
		if (l) {
			segment.from = this.bezierSegments[l - 1].to;
		}
		this.bezierSegments[l] = segment;
	},
	pop: function() {
		return this.bezierSegments.pop();
	},
	last: function() {
		return this.bezierSegments[this.bezierSegments.length - 1];
	},
	splice: function(index, howMany) {
		if (howMany) {
			return this.bezierSegments.splice(index, howMany);
		} else {
			return this.bezierSegments.splice(index);
		}
	},
	smooth: function() { /*Destructive Function!*/
		function getFirstControlPoints(rhs) {
			var n = rhs.length,
				x = [], // Solution vector.
				tmp = [], // Temporary workspace.
				b = 2;
			x[0] = rhs[0] / b;
			// Decomposition and forward substitution.
			for (var i = 1; i < n; i++) {
				tmp[i] = 1 / b;
				b = (i < n - 1 ? 4 : 2) - tmp[i];
				x[i] = (rhs[i] - x[i - 1]) / b;
			}
			// Back-substitution.
			for (var i = 1; i < n; i++) {
				x[n - i - 1] -= tmp[n - i] * x[n - i];
			}
			return x;
		}

		var segments = this.bezierSegments,
			size = segments.length;

		// If there's only one segment,
		// it's already smooth-ed.
		if (size == 1) {
			return;
		}

		var knots = [];
		for (var i = 0; i < size; ++i) {
			knots.push(segments[i].from)
		}
		knots.push(segments[size - 1].to);

		var controlPoints = {
			x: [],
			y: []
		};
		for (var coord in controlPoints) {
			var rhs = [];
			for (var i = 1; i < size - 1; ++i) {
				rhs[i] = 4 * knots[i][coord] + 2 * knots[i + 1][coord];
			}
			rhs[0] = knots[0][coord] + 2*knots[1][coord];
			rhs[size - 1] = 3*knots[size - 1][coord];

			controlPoints[coord] = getFirstControlPoints(rhs);
		}

		for (var i = 0; i < size; ++i) {
			var segment = segments[i];
			if (i < size) {
				segment.control1 = new Point (controlPoints.x[i], controlPoints.y[i]);
				if (i < size - 1) {
					segment.control2 = new Point(
						2 * knots[i + 1].x - controlPoints.x[i + 1],
						2 * knots[i + 1].y - controlPoints.y[i + 1]
					);
				} else {
					segment.control2 = new Point(
						(knots[size].x - controlPoints.x[size - 1]) / 2,
						(knots[size].y - controlPoints.y[size - 1]) / 2
					);
				}
			}
		}
	}
});

module.exports = CubicBezierSpline;
