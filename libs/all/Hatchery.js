var GameObject = require('./GameObject');
var Point = require('./Point');

function Hatchery(team)
{
	this.type = this.constructor.name;
	this.color = team;
	this.position = new Point();
	var playersEggs = new Array();
}

Hatchery.prototype.extend(GameObject.prototype).extend({
	width: 250,
	height: 250,
	sprite: '', // path to sprite img to load

	// Simple boundingbox algorithm
	// TODO: Seems backwards, why woud a rock hit a snake?
	// TODO: Souldn't we be calling collision on the snake? not the rock?
	collision: function(gameObject) {
		var topLeft = new Point(
				this.position.x - this.width/2,
				this.position.y + this.height/2
			),
			bottomRight = new Point(
				this.position.x + this.width/2,
				this.position.y - this.height/2
			);
		return gameObject.position.inside(topLeft, bottomRight);
	}
});

module.exports = Hatchery;