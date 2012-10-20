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
	value: function(source) {
		for (var prop in source) {
			if (prop != 'constructor') this[prop] = source[prop];
		}
		return this;
	},
	configurable: true,
	enumerable: false,
	writable: true
});