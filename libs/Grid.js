var Debug = require('./Debug');
var d = new Debug();


function Grid(gid)
{
	this.id = gid;
	this.gameObjects = new Array();
	this.hasHatchery = -1; // 0 for red 1 for blue -1 for no
	this.width = 512;
	this.height = 512;
}

Grid.prototype.extend({
	addGameObject: function(gobj) {
		this.gameObjects.push(gobj);
	},
	
	getGameObjects: function() {
		return this.gameObjects;
	},
	
	getBounds: function() {
		var b = this.id.split("x");
		var h = (parseInt(b[0]) + 1) * this.height;
		var w = (parseInt(b[1]) + 1) * this.width;

		var bounds = 
		{
			height: h,
			width: w
		};
		
		return bounds;
	}
});
module.exports = Grid;