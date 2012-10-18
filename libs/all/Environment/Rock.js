var GameObject = require('./Environment');

Rock.prototype = new Environment();
Rock.prototype.constructor = Rock;


function Rock()
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

module.exports = Rock;