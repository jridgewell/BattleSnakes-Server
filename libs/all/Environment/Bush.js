var Environment = require('./Environment');

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

Bush.prototype.extend(Environment.prototype);

module.exports = Bush;