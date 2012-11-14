var GameObject = require('./GameObject');
var Environment = require('./Environment/Environment');
var Point = require('./Point');
var Vector = require('./Vector');
var CubicBezierSegment = require('./CubicBezierSegment');
var Teams = require('./Teams');

function Snake(id) {
	this.id = id;
	this.type = this.constructor.name
	this.isCollidable = true;
	this.isStationary = false;

	this.name = 'Guest' + id;	// String
	this.team = Teams.Red;		// Teams obj
	this.color = 'FF0000';		// Hex ex: 00FF00
	this.velocity = new Vector(
		new Point(50, 0)
	);// float
	this.currentPowerups = null;	// Powerup Object
	this.numSegments = 1;		// int
	this.grid = null;
	this.segments = [
		new CubicBezierSegment()
	];							// array of segments

	this.height = 20;
	this.width = 20;


	this.position = new Point();
}

Snake.prototype.extend(GameObject.prototype).extend({
	collision: function(gameObject) {
		if (gameObject.isStationary) {
			return gameObject.collision(this);
		} else {
			var offset = gameObject.position;
			var velocity = gameObject.velocity;
			var angle = velocity.angle();
			var magnitude = velocity.magnitude();
			for (var i = 0; i < this.segments.length; ++i) {
				var s = this.segments[i].translate(offset);
				s = s.rotate(-1 * angle);
				return s.isZero(magnitude);
			}
		}
	},

	toJSON: function() {
		return {
			id: this.id,
			position: this.position.toJSON(),
			velocity: this.velocity.toJSON(),
			currentPowerup: null,
			segments: this.segments
		};
	},

	//passes in a string "Red" or "Blue"
	changeTeam: function(team) {
		if (Teams.hasOwnProperty(team)) {
			this.team = team;
		}
		return this;
	},

	//passes in a Powerup Object
	usePowerup: function(powerup) {
		return this;
	},

	smooth: function() {
		function getFirstControlPoints(rhs) {
			var n = rhs.length,
				x = [], // Solution vector.
				tmp = [], // Temporary workspace.
				b = 2;
			x[0] = rhs[0] / b;
			// Decomposition and forward substitution.
			for (var i = 1; i < n; i++) {
				tmp[i] = 1 / b;
				b = (i < n - 1 ? 4 : 2) - tmp[i];
				x[i] = (rhs[i] - x[i - 1]) / b;
			}
			// Back-substitution.
			for (var i = 1; i < n; i++) {
				x[n - i - 1] -= tmp[n - i] * x[n - i];
			}
			return x;
		}

		var segments = this.segments;
		var size = segments.length;

		// If there's only one segment,
		// it's already smooth-ed.
		if (size == 1) {
			return;
		}

		var knots = [];
		for (var i = 0; i < size; ++i) {
			knots.push(segments[i].from)
		}
		knots.push(segments[size - 1].to);

		var controlPoints = {
			x: [],
			y: []
		};
		for (var coord in controlPoints) {
			var rhs = [];
			for (var i = 1; i < size - 1; ++i) {
				rhs[i] = 4 * knots[i][coord] + 2 * knots[i + 1][coord];
			}
			rhs[0] = knots[0][coord] + 2*knots[1][coord];
			rhs[size - 1] = 3*knots[size - 1][coord];

			controlPoints[coord] = getFirstControlPoints(rhs);
		}

		for (var i = 0; i < size; ++i) {
			var segment = segments[i];
			if (i < size) {
				segment.control1 = new Point (controlPoints.x[i], controlPoints.y[i]);
				if (i < size - 1) {
					segment.control2 = new Point(
						2 * knots[i + 1].x - controlPoints.x[i + 1],
						2 * knots[i + 1].y - controlPoints.y[i + 1]
					);
				} else {
					segment.control2 = new Point(
						(knots[size].x - controlPoints.x[size - 1]) / 2,
						(knots[size].y - controlPoints.y[size - 1]) / 2
					);
				}
			}
		}
	}
});

module.exports = Snake;
