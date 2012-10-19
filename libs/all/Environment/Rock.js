var Environment = require('./Environment');

var Rock = Environment.extend({
	init: function() {
		// put initlize code here
	},

	collision: function(data) {
		// _super() can ONLY be called inside
		// inside of the extend function.
		// DON'T USE IT ANYWHERE ELSE
		this._super();
	}
});

module.exports = Rock;