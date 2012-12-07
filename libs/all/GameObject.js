require('../misc');
var Point = require('./Point');

function GameObject() {
	this.id = 0;
	this.position = new Point();
}

GameObject.prototype.extend({
	type: -1,
	isCollidable: false,
	boundingBox: true,
	width: 24,
	height: 24,

	relocate: function(pointOrX, y) {
		var point = (pointOrX instanceof Point) ? pointOrX : new Point(pointOrX, y);
		this.position = point;
		return this;
	},
	collision: function(gameObject) {
		if (gameObject.id == this.id) {
			return false;
		}
		var topLeft = new Point(
				this.position.x - this.width/2,
				this.position.y + this.height/2
			),
			bottomRight = new Point(
				this.position.x + this.width/2,
				this.position.y - this.height/2
			);
		if (gameObject.boundingBox) {
            console.log('boundingbox')
            var left = topLeft.x,
                top = topLeft.y,
                right = bottomRight.x,
                bottom = bottomRight.y,
                gLeft = gameObject.position.x - gameObject.width/2,
                gTop = gameObject.position.y + gameObject.height/2
                gRight = gameObject.position.x + gameObject.width/2,
                gBottom = gameObject.position.y - gameObject.height/2;


            console.log('I hit GameObject:' + (left < gRight && top < gBottom && gLeft < right && gTop < bottom));
            console.log(left < gRight , top < gBottom , gLeft < right , gTop < bottom);

            console.log('I contain GameObject:' + (left < gLeft && right > gRight && top > gTop && bottom < gBottom));
            console.log(left < gLeft, right > gRight, top > gTop, bottom < gBottom);

            console.log('GameObject contains me:' + (left > gLeft && right < gRight && top < gTop && bottom > gBottom))
            console.log(left > gLeft, right < gRight, top < gTop, bottom > gBottom);

            console.log('Returning:' + ((left < gRight && top < gBottom && gLeft < right && gTop < bottom) ||
                   (left < gLeft && right > gRight && top > gTop && bottom < gBottom) ||
                   (left > gLeft && right < gRight && top < gTop && bottom > gBottom)))

            return ((left < gRight && top < gBottom && gLeft < right && gTop < bottom) ||
                   (left < gLeft && right > gRight && top > gTop && bottom < gBottom) ||
                   (left > gLeft && right < gRight && top < gTop && bottom > gBottom));
		} else {
			return gameObject.position.inside(topLeft, bottomRight);
		}
	}
});

module.exports = GameObject;
