var Environment = require('./Environment');

function Tree() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
	this.height = 100;
}

Tree.prototype.extend(Environment.prototype);

module.exports = Tree;