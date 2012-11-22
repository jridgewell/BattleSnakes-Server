var Environment = require('./Environment');
var Point = require('../Point');

function Hatchery(team)
{
	this.type = this.constructor.name;
	this.color = team;
	this.position = new Point();
	var playersEggs = new Array();
}

Hatchery.prototype.extend(Environment.prototype).extend({
	width: 256,
	height: 256,

	collision: function(gameObject) {
		if (gameObject.id == this.id) {
			return;
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
			if (col && gameObject.hasEggs()) {
				gameObject.dropOffEggs(this);
			}
			return col;
		}
	}

});

module.exports = Hatchery;
