var Environment = require('./Environment');

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

Tree.prototype.extend(Environment.prototype);

module.exports = Tree;