var GameObject = require('../GameObject');
var Point = require('../Point');

function Environment(){}

Environment.prototype.extend(GameObject.prototype).extend({
	width: 50,
	height: 50,
	sprite: '', // path to sprite img to load

	collision: function(gameObject) {
		var topLeft = new Point(
				this.position.x - this.width/2,
				this.position.y + this.height/2
			),
			bottomRight = new Point(
				this.position.x + this.width/2,
				this.position.y - this.height/2
			);
		if (gameObject.isStationary) {
			return gameObject.position.x + gameObject.width > this.position.x
				&& gameObject.position.y + gameObject.height > this.position.y
				&& gameObject.position.x < this.position.x + this.width
				&& gameObject.position.y < this.position.y + this.height;
		} else {
			return gameObject.position.inside(topLeft, bottomRight);
		}
	}
});

module.exports = Environment;