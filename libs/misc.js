var DONTENUMERATE = function(Obj, property, val) {
	Object.defineProperty(Obj, property, {
		value: val,
		configurable: true,
		enumerable: false,
		writable: true
	});
}

DONTENUMERATE(Array.prototype, 'remove', function(e) {
	var index = this.indexOf(e);
	if (index > -1) {
		this.splice(index, 1);
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
			var propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop),
				get = propertyDescriptor.get,
				set = propertyDescriptor.set,
				val = propertyDescriptor.value;
			if (get || set) {
				Object.defineProperty(this, prop, {
					get: get,
					set: set,
					enumerable : true,
					configurable : true
				});
			} else if (typeof val != 'object') {
				this[prop] = val;
			} else {
				if ('clone' in val && typeof val.clone == 'function') {
					this[prop] = val.clone();
				} else {
					// There are references to the Parent's objects
					this[prop] = val;
				}
			}
		}
	}
	return this;
});
