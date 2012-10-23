var Point = require('./Point');
var CubicBezierSegment = require('./CubicBezierSegment');

/* CubicBezierCurve class
 *
 * Based on code from:
 * https://github.com/WebKit/webkit/blob/master/Source/WebCore/platform/graphics/wince/PlatformPathWinCE.cpp#L77-118
 */
module.exports =  function(controlPts /* CubicBezierSegment */, previousPts /* Array[Points] */, segments /*= 100 */) {
	// Enforce types
	if (!(controlPts instanceof CubicBezierSegment)) {
		return previousPts;
	}
	if (typeof previousPts != 'object' && Object.prototype.toString.call(previousPts) != Object.prototype.toString.call([])) {
		previousPts = [];
	}
	segments = (typeof segments == 'number') ? Math.round(segments) : 100;
	// Setup need vars
	var step = 1.0 / segments,
		tA = 0.0,
		tB = 1.0;

    var c1x = controlPts.from.x,
    	c1y = controlPts.from.y,
    	c2x = controlPts.control1.x,
    	c2y = controlPts.control1.y,
    	c3x = controlPts.control2.x,
    	c3y = controlPts.control2.y,
    	c4x = controlPts.to.x,
    	c4y = controlPts.to.y;

	var pp = new Point(c1x, c2x);


	for (var i = 1; i < segments; ++i) {
		tA += step;
		tB -= step;
		var tAsq = (tA * tA);
		var tBsq = (tB * tB);

		a = tBsq * tB;
		b = 3.0 * tA * tBsq;
		c = 3.0 * tB * tAsq;
		d = tAsq * tA;

		pp.set(
			c1x * a + c2x * b + c3x * c + c4x * d,
			c1y * a + c2y * b + c3y * c + c4y * d
		);
		previousPts.push(pp.clone());
	}
	pp.set(c4x, c4y);
	previousPts.push(pp.clone());

	return previousPts;
};