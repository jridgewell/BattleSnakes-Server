var Environment = require('./Environment');

var Bush = Environment.extend({
	init: function() {
		// put initlize code here
	},

	collision: function(data) {
		// overrides GameObject's collision
	}
});

module.exports = Bush;