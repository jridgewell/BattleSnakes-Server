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

	collision: function(gameObject) {
		if (gameObject.id == this.id) {
			return false;
		}
		var topLeft = new Point(
				this.position.x - this.width/2,
				this.position.y + this.height/2
			),
			bottomRight = new Point(
				this.position.x + this.width/2,
				this.position.y - this.height/2
			);
		if (gameObject.isStationary) {
			return gameObject.position.x + gameObject.width >= this.position.x
				&& gameObject.position.y + gameObject.height >= this.position.y
				&& gameObject.position.x <= this.position.x + this.width
				&& gameObject.position.y <= this.position.y + this.height;
		} else {
			return gameObject.position.inside(topLeft, bottomRight);
		}
	}
});

module.exports = GameObject;
