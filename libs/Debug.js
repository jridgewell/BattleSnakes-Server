var Settings = require('./Settings');
function Debug()
{
	 Debug.prototype.Log =function(level, msg)
	{
		if(level <= Settings.DEBUGLEVEL)
		{
			console.log('DEBUG LEVEL '+level+': '+msg.toString());
		}
	};
}
module.exports = Debug;