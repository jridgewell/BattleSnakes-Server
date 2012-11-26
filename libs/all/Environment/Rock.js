var Environment = require('./Environment');
var Point = require('../Point');

function Rock() {
	// Constructor code here
	// this.id = id;
	// Type: 0: powerup, 1: hatchery, 2: egg, 3: tree, 4:rock , 5: bush
	this.type = 4;
	this.isCollidable = true;
	this.position = new Point();
};

Rock._extends(Environment);

module.exports = Rock;
