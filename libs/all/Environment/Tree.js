var Environment = require('./Environment');
var Point = require('../Point');

function Tree() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name;
	this.isCollidable = true;
	this.position = new Point();
}

Tree.prototype.extend(Environment.prototype);

module.exports = Tree;