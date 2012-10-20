var Environment = require('./Environment');

function Tree() {
	// Constructor code here
	
	// this.[whatever] are public methods
	this.collision = function(data) {
		// Collision override 
	};
}

Tree.prototype.extend(Environment.prototype);

module.exports = Tree;