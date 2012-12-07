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
	Environment.call(this);
	this.hatchlingColor = hColor;
}

Egg._extends(Environment);
Egg.prototype.extend({
	height: 3,
	width: 3,
	isCollidable: false,
	type: 2, // Type: 0: powerup, 1: hatchery, 2: egg, 3: tree, 4: Rock , 5: bush
	collision: function(gameObject) {
        var col = this.$super.collision.call(this, gameObject);
        if (col && gameObject.pickUpEgg) {
            gameObject.pickUpEgg(this);
        }
        return col;
	}
});

module.exports = Egg;
