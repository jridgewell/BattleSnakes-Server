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
	x: function() {
		return this.x;
	},
	y: function() {
		return this.y;
	},
	set: function(x /* Float */, y /* Float */) {
		this.x = (typeof x == 'number') ? x : 0;
		this.y = (typeof y == 'number') ? y : 0;
		return this;
	},
	get: function() {
		return {
			x: parseFloat(this.x().toFixed(4)),
			y: parseFloat(this.y().toFixed(4))
		};
	},
	clone: function() {
		return new Point(this.x, this.y);
	}
});

module.exports = Point;