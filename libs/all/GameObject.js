function GameObject(){}

GameObject.prototype = 
{
	id : 0,
	type : "",
	isCollidable : false,
	position : {x:0,y:0},
	
	Collision : function(gameObj)
	{
		console.log("test");
	}
};

module.exports = GameObject;