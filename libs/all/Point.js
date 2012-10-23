require('../misc');
/* Point class
 *
 * Based on code from:
 * https://github.com/WebKit/webkit/blob/master/Source/WebCore/platform/graphics/wince/PlatformPathWinCE.h#L32-55
 */
var Point = function(x, y) {
	this.set(x, y);
};

Point.prototype.extend({
	rotationMatrix: function(theta /*degrees*/) {
		var r = theta * Math.PI / 180;
		return [
			[Math.cos(r), -Math.sin(r)],
			[Math.sin(r), Math.cos(r)]
		];
	},
	rotate: function(theta /*degrees*/) {
		var m = this.rotationMatrix(theta);
		return new Point(
			(m[0][0] * this.x + m[0][1] * this.y),
			(m[1][0] * this.x + m[1][1] * this.y)
		);
	},
	set: function(x /* Float */, y /* Float */) {
		this.x = (typeof x == 'number') ? x : 0;
		this.y = (typeof y == 'number') ? y : 0;
		return this;
	},
	get: function() {
		return {
			x: this.x,
			y: this.y
		};
	},
	clone: function() {
		var p = new Point(this.x, this.y); 
		return p;
	}
});

module.exports = Point;