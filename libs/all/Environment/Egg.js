var Environment = require('./Environment');

/*
 * Color = 
 * {
 * 	  r: 0,
 *    g: 0,
 *    b: 0
 * }
 */


function Egg(hColor) 
{
	// Constructor code here
	// this.id = id;
	this.type = this.constructor.name;
	this.isCollidable = true;
	this.hatchlingColor = hColor;
	
	
}

Egg.prototype.extend(Environment.prototype);

module.exports = Egg;