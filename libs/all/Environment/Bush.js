var GameObject = require('./Environment');

Bush.prototype = new Environment();
Bush.prototype.constructor = Bush;


function Bush()
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

module.exports = Bush;