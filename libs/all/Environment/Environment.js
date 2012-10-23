var GameObject = require('../GameObject');

function Environment(){}

Environment.prototype.extend(GameObject.prototype).extend({
	sprite : '' // path to sprite img to load
});

module.exports = Environment;