var Point = require('./Point');

/* CubicBezierCurve class
 *
 * Based on code from:
 * https://github.com/WebKit/webkit/blob/master/Source/WebCore/platform/graphics/wince/PlatformPathWinCE.cpp#L77-118
 */
module.exports =  function(controlPts /* Array[Points] */, pts /* Array[{x: x, y: y}] */, segments /*= 100 */) {
	// Enforce types
	if (typeof controlPts != 'object' || Object.prototype.toString.call(controlPts) != Object.prototype.toString.call([]) || controlPts.length != 4) {
		return pts;
	}
	if (typeof pts != 'object' && Object.prototype.toString.call(pts) != Object.prototype.toString.call([])) {
		pts = [];
	}
	segments = (typeof segments == 'number') ? Math.round(segments) : 100;
	// Setup need vars
	var step = 1.0 / segments,
		tA = 0.0,
		tB = 1.0;
	var pp = new Point(c1x, c2x);

    var c1x = controlPts[0].x(),
    	c1y = controlPts[0].y(),
    	c2x = controlPts[1].x(),
    	c2y = controlPts[1].y(),
    	c3x = controlPts[2].x(),
    	c3y = controlPts[2].y(),
    	c4x = controlPts[3].x(),
    	c4y = controlPts[3].y();

	for (var i = 1; i < segments; ++i) {
		tA += step;
		tB -= step;
		var tAsq = (tA * tA).toPrecision(4);
		var tBsq = (tB * tB).toPrecision(4);

		a = tBsq * tB;
		b = 3.0 * tA * tBsq;
		c = 3.0 * tB * tAsq;
		d = tAsq * tA;

		pp.set(
			c1x * a + c2x * b + c3x * c + c4x * d,
			c1y * a + c2y * b + c3y * c + c4y * d
		);
		pts.push(pp.get());
	}
	pp.set(c4x, c4y);
	pts.push(pp.get());

	return pts;
};