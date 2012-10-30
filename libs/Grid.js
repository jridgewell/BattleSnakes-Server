var Debug = require('./Debug');
var d = new Debug();


function Grid(gid)
{
	this.id = gid;
	this.gameObjects = new Array();
	this.hasHatchery = -1; // 0 for red 1 for blue -1 for no
	
	function init()
	{

	};
	
	this.AddGameObject = function(gobj)
	{
		this.gameObjects.push(gobj);
	};
	
	this.GetGameObjects = function()
	{
		return this.gameObjects;
	};
	
	this.GetBounds = function()
	{
		var b = this.id.split("x");
		var h = (parseInt(b[0]) * 512) + 512;
		var w = (parseInt(b[1]) * 512) + 512;

		var bounds = 
		{
			height: h,
			width: w
		};
		
		return(bounds);
	};
	
	init();
}

module.exports = Grid;