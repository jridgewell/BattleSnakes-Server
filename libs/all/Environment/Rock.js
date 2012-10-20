var Environment = require('./Environment');

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

Rock.prototype.extend(Environment.prototype);

module.exports = Rock;