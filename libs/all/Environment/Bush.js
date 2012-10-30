var Environment = require('./Environment');
var Point = require('../Point');

function Bush() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name;
	this.isCollidable = true;
	this.position = new Point();
}

Bush.prototype.extend(Environment.prototype);

module.exports = Bush;