require('../misc');
var Point = require('./Point');

function GameObject(){}

GameObject.prototype.extend({
	id: 0,
	type: '',
	isCollidable: false,
	position: new Point(),
	isStationary: true,
	width: 50,
	height: 50,

	collision: function(gameObj) {
		console.log('test');
	}
});

module.exports = GameObject;