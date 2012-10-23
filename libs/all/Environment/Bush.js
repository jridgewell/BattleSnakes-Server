var Environment = require('./Environment');

function Bush() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
}

Bush.prototype.extend(Environment.prototype);

module.exports = Bush;