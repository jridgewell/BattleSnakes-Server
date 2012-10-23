var Environment = require('./Environment');

function Rock() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
}

Rock.prototype.extend(Environment.prototype);

module.exports = Rock;