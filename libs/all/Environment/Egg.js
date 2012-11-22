var Environment = require('./Environment');
var Point = require('../Point');

/*
 * Color = {
 *	r: 0,
 *	g: 0,
 *	b: 0
 * }
 */


function Egg(hColor) {
	// Constructor code here
	// this.id = id;
	// Type: 0: powerup, 1: hatchery, 2: egg, 3: tree, 4:rock , 5: bush
	this.type = 2;
	this.isCollidable = true;
	this.hatchlingColor = hColor;
}

Egg.prototype.extend(Environment.prototype).extend({
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
			var col = gameObject.position.inside(topLeft, bottomRight);
			if (col) {
				gameObject.pickUpEgg(this)
			}
			return col;
		}
	}
});

module.exports = Egg;
