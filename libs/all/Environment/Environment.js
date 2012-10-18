var GameObject = require('../GameObject');

Environment.prototype = new GameObject();
Environment.prototype.constructor = Environment;


function Environment(){}
Environment.prototype = 
{
	type : "", //String of what it is ex: "Tree" "Rock"
	sprite : "" // path to sprite img to load
		
};

module.exports = EnvType;
module.exports = Environment;
