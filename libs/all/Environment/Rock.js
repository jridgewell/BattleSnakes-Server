var Environment = require('./Environment');

function Rock() {
	// Constructor code here
	
	// this.[whatever] are public methods
	this.collision = function(data) {
		// Collision override 
	};
}

Rock.prototype.extend(Environment.prototype);

module.exports = Rock;