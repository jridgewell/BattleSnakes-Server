var Environment = require('./Environment');
var Point = require('../Point');

function Tree() {
	// Constructor code here
	// this.id = id;
	// Type: 0: powerup, 1: hatchery, 2: egg, 3: tree, 4:rock , 5: bush
	this.type = 3;
	this.isCollidable = true;
	this.position = new Point();
}

Tree._extends(Environment);

module.exports = Tree;
