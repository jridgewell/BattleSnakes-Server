var GameObject = require('./Environment');

Tree.prototype = new Environment();
Tree.prototype.constructor = Tree;


function Tree()
{
	
    __construct = function() 
    {
    	
    	// put initlize code here
    }();
	
	this.Collision = function(data)
	{
		// Collision override 
	};
	

}

module.exports = Tree;