var Point = require('./Point');
var CubicBezierSegments = require('./CubicBezierSegments');
/* CubicBezierSpline class
 * Handles an array of CubicBezierSegments
 */
function CubicBezierSpline(bezierSegments /*Array[CubicBezierSegments]*/) {
	this.bezierSegments = bezierSegments;
	if (!this.sin || !this.sin.values['0']) {
		this.computeSin();
	}
	this.shouldWiggle = true;
}

CubicBezierSpline.prototype.extend({
	sin: {
		length: 0,
		interval: 0,
		values: []
	},
	computeSin: function(num) {
		num = num || 20;
		var pi = Math.PI,
			t = 0,
			interval = pi / num,
			values = this.sin.values;
		this.sin.length = 2 * num;
		this.sin.interval = interval;
		for (var i = 0, l = 2 * num; i < l; ++i) {
			values[i] = Math.sin(t);
			t += interval;
		}
	},
	wiggle: function(shift) {
		if (this.shouldWiggle) {
			var line = new Vector(this.to.translate(this.from)),
				angle = line.angle();
			line = line.unRotate();
		}
	},
	approximate: function(segments /*= 100 */) {
		segments = (typeof segments == 'number') ? Math.round(segments) : 100;
		var points = [],
			l = this.bezierSegments.length;

		if (l) {
			points.push(
				this.bezierSegments[0].from.clone();
			);
			for (var i = 0; i < l; ++i) {
				points = this.bezierSegments[i].approximate(points, segments);
			}
		}

		return points;
	},
	rotate: function(theta /*degrees*/) {
		var spline = new CubicBezierSegment();
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
		var spline = new CubicBezierSegment();
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
		var spline = new CubicBezierSegment();
		for (var i = 0, l = this.bezierSegments.length; i < l; ++i) {
			var c = this.bezierSegments[i].clone();
			if (i > 0) {
				c.from = spline.bezierSegments[i - 1].to;
			}
			spline.bezierSegments[i] = c;
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
		segment = (segment instanceof CubicBezierSegment) segment : new CubicBezierSegment(segment);
		var l = this.bezierSegments.length;
		if (l) {
			segment.from = this.bezierSegments[l - 1].to;
		}
		this.bezierSegments[l] = segment;
	},
	pop: function() {
		return this.bezierSegments.pop();
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
