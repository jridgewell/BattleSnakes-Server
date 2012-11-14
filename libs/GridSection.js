var Debug = require('./Debug');
var d = new Debug();


function GridSection(row, column, width, height)
{
	this.gameObjects = [];
	this.hasHatchery = -1; // 0 for red 1 for blue -1 for no
	this.width = width || 512;
	this.height = height || 512;
	this.row = (row != undefined) ? row : 0;
	this.column = (column != undefined) ? column : 0;
}

GridSection.prototype.extend({
	addGameObject: function(gobj) {
		this.gameObjects.push(gobj);
	},

	removeGameObject: function(gobj) {
		var i = this.gameObjects.indexOf(gobj);
		if (i > -1) {
			return this.gameObjects.splice(i, 1);
		}
		return false;
	},

	getGameObjects: function() {
		return this.gameObjects;
	},

	getBounds: function() {
		return {
			height: this.height,
			width: this.width
		};
	}
});
module.exports = GridSection;
