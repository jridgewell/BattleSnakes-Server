var Point = require('./Point');
var CubicBezierSegment = require('./CubicBezierSegment');

/* CubicBezierCurve class
 *
 * Based on code from:
 * https://github.com/WebKit/webkit/blob/master/Source/WebCore/platform/graphics/wince/PlatformPathWinCE.cpp#L77-118
 */
module.exports =  function(controlPts /* CubicBezierSegment */, previousPts /* Array[Points] */, segments /*= 100 */) {
	// Enforce types
	if (typeof previousPts != 'object' && Object.prototype.toString.call(previousPts) != Object.prototype.toString.call([])) {
		previousPts = [];
	}
	segments = (typeof segments == 'number') ? Math.round(segments) : 100;

	var step = 1.0 / segments,
		t = 0.0;
	var pp = new Point();

	for (var i = 1; i <= segments; ++i) {
		t += step;
		pp.set(
			controlPts.x(t),
			controlPts.y(t)
		);
		previousPts.push(pp.clone());
	}

	return previousPts;
};