require('../misc');
var GameObject = Class.extend({
	init: function() {

	},
	id: 0,
	type: '',
	isCollidable: false,
	position: {x: 0, y: 0},
	collision: function(gameObj) {
		console.log('test');
	}
});

module.exports = GameObject;