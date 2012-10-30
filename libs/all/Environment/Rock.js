var Environment = require('./Environment');
var Point = require('../Point');

function Rock() {
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name;
	this.isCollidable = true;
	this.position = new Point();
};

Rock.prototype.extend(Environment.prototype);

module.exports = Rock;