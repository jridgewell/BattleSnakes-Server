var Point = require('./Point');

module.exports = function(segments /*array[CubicBezierSegments]*/) {
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

	var size = segments.length;

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
};