var GameObject = require('../GameObject');

var Environment = GameObject.extend({
	type: '', //String of what it is ex: 'Tree' 'Rock'
	sprite: '' // path to sprite img to load
});

module.exports = Environment;