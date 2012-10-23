require('../misc');
var Point = require('./Point');

function GameObject(){}

GameObject.prototype.extend({
	id: 0,
	type: '',
	isCollidable: false,
	position: new Point(),
	stationary: true,

	collision: function(gameObj) {
		console.log('test');
	}
});

module.exports = GameObject;