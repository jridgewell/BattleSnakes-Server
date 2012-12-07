var Environment = require('./Environment');
var Point = require('../Point');

function Hatchery(team) {
	Environment.call(this);
	this.color = team;
	var playersEggs = [];
}

Hatchery._extends(Environment);
Hatchery.prototype.extend({
	isCollidable: true,
	type: 1, // Type: 0: powerup, 1: hatchery, 2: egg, 3: tree, 4: Rock , 5: bush
	width: 48,
	height: 48,

	collision: function(gameObject) {
        var col = this.$super.collision.call(this, gameObject);
        if (col && gameObject.team == this.color && gameObject.hasEggs && gameObject.hasEggs()) {
            gameObject.dropOffEggs(this);
        }
        return col;
	}

});

module.exports = Hatchery;
