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
});

module.exports = Hatchery;