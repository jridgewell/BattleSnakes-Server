var Debug = require('./Debug');
var d = new Debug();


function GridSection(row, column, width, height)
{
	this.gameObjects = [];
	this.hasHatchery = -1; // 0 for red 1 for blue -1 for no
	this.width = width || 500;
	this.height = height || 500;
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
	},

	get id() {
		return '' + this.row + 'x' + this.column;
	},

	valueOf: function() {
		return {
			hasHatchery: this.hasHatchery,
			width: this.width,
			height: this.height,
			row: this.row,
			column: this.column
		};
	}
});
module.exports = GridSection;
