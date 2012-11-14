var DONTENUMERATE = function(Obj, property, val) {
	Object.defineProperty(Obj, property, {
		value: val,
		configurable: true,
		enumerable: false,
		writable: true
	});
}

DONTENUMERATE(Array.prototype, 'remove', function(e) {
	for (var i = 0; i < this.length; ++i)
		if (e == this[i]) return this.splice(i, 1);
});

DONTENUMERATE(Array.prototype, 'compact', function(fn) {
	for (var i = this.length - 1; i >= 0; --i)
		if (this[i] == null) {
			this.splice(i, 1);
		}
	return this;
});

DONTENUMERATE(Array.prototype, 'clone', function() {
	return Array.prototype.slice.call(this);
});

DONTENUMERATE(Object.prototype, 'extend', function(source) {
	$this = this;
	for (var prop in source) {
		if (prop != 'constructor') {
			var s = source[prop];
			if (typeof s != 'object') {
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
});
