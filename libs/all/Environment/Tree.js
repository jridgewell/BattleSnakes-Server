var Environment = require('./Environment');

var Tree = Environment.extend({
	init: function() {
		// put initlize code here
	},

	collision: function(data) {
		// overrides Environment's collision
	}
});

module.exports = Tree;