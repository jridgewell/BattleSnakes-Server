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
	set: function(x /* Float or {x: x, y: y} */, y /* Float */) {
		if (x instanceof Object) {
			this.set(x.x, x.y);
		} else {
			this.x = (typeof x == 'number') ? x : 0;
			this.y = (typeof y == 'number') ? y : 0;
		}
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
	},
	toJSON: function() {
		return {
			x: parseInt(this.x, 10),
			y: parseInt(this.y, 10)
		};
	},
	multiply: function(scalar) {
		var p = this.clone();
		if (scalar instanceof Object) {
			p.set(
				p.x * scalar.x,
				p.y * scalar.y
			);
		} else {
			p.set(
				p.x * scalar,
				p.y * scalar
			);
		}
		return p;
	},
	divide: function(scalar) {
		if (scalar instanceof Object) {
			scalar.x = 1 / scalar.x;
			scalar.y = 1 / scalar.y;
		}
		return this.multiply(scalar);
	},
	add: function(offset) {
		var p = this.clone();
		if (offset instanceof Object) {
			p.set(
				p.x + offset.x,
				p.y + offset.y
			);
		} else {
			p.set(
				p.x + offset,
				p.y + offset
			);
		}
		return p;
	},
	subtract: function(offset) {
		if (offset instanceof Object) {
			offset.x = -1 * offset.x;
			offset.y = -1 * offset.y;
		}
		return this.add(offset);
	}
});

module.exports = Point;
