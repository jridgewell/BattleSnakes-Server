var GameObject = require('./GameObject');
var Teams = require('./Teams');

var Snake = GameObject.extend({
	init: function(id) {
		this.id = id;
	},
	name: null,  // String
	team: Teams.Red, // Teams obj
	color: 'FF0000',  // Hex ex: 00FF00
	velocity: 1, // float
	currentPowerups: null, // Powerup Object
	numSegments: 1, // int
	segments: [], // array of segments

	collision: function(data)
	{
		// collision override
	},

	//passes in a string 'Red' or 'Blue'
	changeTeam: function(team)
	{

	},

	//passes in a Powerup Object
	usePowerup: function(powerup)
	{

	},
});

module.exports = Snake;