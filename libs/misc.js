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

Array.prototype.clone = function() {
	return Array.prototype.slice.call(this);
}

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for( prop in this ) {
        temp[prop] = this[prop];
    }
    return temp;
};

Object.defineProperty(Object.prototype, 'extend', {
	value: function(source) {
		for (var prop in source) {
			if (prop != 'constructor') {
				var s = source[prop];
				if (typeof s == 'function') {
					this[prop] = s.clone();
				} else if (typeof s != 'object') {
					this[prop] = s;
				} else {
					if ('clone' in s && typeof s.clone == 'function') {
						this[prop] = s.clone();
					} else {
						// There are references to the Parent's objects
						this[prop] = s;
					}
				}
			}
		}
		return this;
	},
	configurable: true,
	enumerable: false,
	writable: true
});