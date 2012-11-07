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
		var r = theta * Math.PI / 180,
			cos = Math.cos(r),
			sin = Math.sin(r);
		return [
			[cos, -sin],
			[sin, cos]
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
	translate: function(offset /*Point*/) {
		var p = new Point(
			this.x - offset.x,
			this.y - offset.y
		);
		return p;
	},
	inside: function(topLeft, bottomRight) {
		if (this.x >= topLeft.x && this.x <= bottomRight.x) {
			if (this.y <= topLeft.y && this.y >= bottomRight.y) {
				return true;
			}
		}
		return false;
	},
	clone: function() {
		var p = new Point(this.x, this.y); 
		return p;
	}
});

module.exports = Point;