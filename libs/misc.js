Array.prototype.remove = function(e) {
	for (var i = 0; i < this.length; ++i)
		if (e == this[i]) return this.splice(i, 1);
};

Array.prototype.each = function(fn) {
	for (var i = 0; i < this.length; ++i) fn(this[i]);
};

Array.prototype.compact = function(fn) {
	for (var i = 0; i < this.length; ++i)
		if (this[i] == null) {
			this.splice(i, 1);
		}
	return this;
};

Object.defineProperty(Object.prototype, 'extend', {
	value: function(source, skipConstructor) {
		skipConstructor = (skipConstructor != undefined) ? skipConstructor: false;
		for (var prop in source) {
			if (!skipConstructor || prop != 'constructor') {
				var s = source[prop];
				if (typeof s != 'object') {
					this[prop] = s;
				} else if (Object.prototype.toString.call(s) == Object.prototype.toString.call([])){
					this[prop] = Array.prototype.slice.call(s);
				} else {
					this[prop] = {}.extend(s, true);
				}
			}
		}
		return this;
	},
	configurable: true,
	enumerable: false,
	writable: true
});