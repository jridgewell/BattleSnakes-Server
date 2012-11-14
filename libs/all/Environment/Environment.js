var GameObject = require('../GameObject');
var Point = require('../Point');

function Environment(){}

Environment.prototype.extend(GameObject.prototype).extend({
	sprite: '', // path to sprite img to load

	toJSON: function() {
		return {
			id: this.id,
			type: this.type,
			position: this.position
		};
	}
});

module.exports = Environment;
