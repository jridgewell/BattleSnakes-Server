var Environment = require('./Environment');

function Rock() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
	
	// this.[whatever] are public methods
	this.collision = function(data) {
		// Collision override 
	};
}

Rock.prototype.extend(Environment.prototype);

module.exports = Rock;