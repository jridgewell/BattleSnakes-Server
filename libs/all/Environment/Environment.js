var GameObject = require('../GameObject');

function Environment(){}

Environment.prototype.extend(GameObject.prototype).extend({
	type : '', //String of what it is ex: "Tree" "Rock"
	sprite : '' // path to sprite img to load
});

module.exports = Environment;