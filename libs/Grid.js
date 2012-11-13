var Debug = require('./Debug');
require('./Misc');
var GridSection = require('./GridSection');
var d = new Debug();


function Grid(width, height) {
	this.grid = [];
	this.rows = 0;
	this.columns = 0;
}

Grid.prototype.extend({
	init: function() {
		for (var i = 0; i < 3; ++i) {
			for (var j = 0; j < 3; ++j) {
				var g = new GridSection(i, j);
				this.grid.push(g);
			}
		}
		this.rows = 3;
		this.columns = 3;
	},
	increase: function() {
		var row = this.rows - 1,
			column = 0;
		// Append a grid at new "column"
		for (var i = this.rows; i > 0; --i, --row) {
			var index = i * this.rows;
			var g = new GridSection(row, this.columns);
			this.grid.splice(index, 0, g);
		}
		// Append new grid "row"
		for (var j = 0; j <= this.columns; ++j, ++column) {
			var g = new GridSection(this.rows, column);
			this.grid.push(g);
		}
		++this.rows;
		++this.columns;
	},
	decrease: function() {
		var column = this.columns - 1;
		
		// Get first row except last column
		var grid = this.grid.slice(0, column);
		
		// Grab each successive row (except last) without it's last column
		for (var row = 1; row < this.rows - 1; ++row) {
			var index = row * this.columns;
			grid = grid.concat(this.grid.slice(index, index + column));
		}
		this.grid = grid;
		--this.rows;
		--this.columns;
	},
	getGrid: function(gridOrRow, column) {
		if (gridOrRow instanceof GridSection) {
			return gridOrRow;
		}
		var index = gridOrRow * this.rows + column;
		return this.grid[index];
	},
	
	addGameObjectToGrid: function(gobj, gridOrRow, column) {
		var grid = this.getGrid(gridOrRow, column);
		return grid.addGameObject(gobj);
	},
	
	removeGameObjectFromGrid: function(gobj, gridOrRow, column) {
		var grid = this.getGrid(gridOrRow, column);
		return grid.removeGameObject(gobj);
	},
	
	getGameObjectsInGrid: function(gridOrRow, column) {
		var grid = this.getGrid(gridOrRow, column);
		return grid.getGameObjects();
	},
	
	getBoundsOfGrid: function(gridOrRow, column) {
		var grid = this.getGrid(gridOrRow, column),
			bounds = grid.getBounds(),
			row = grid.row - 1,
			column = grid.column - 1,
			x = 0,
			y = 0;
		while (row > 0) {
			y += this.getGrid(row, grid.column).height;
			--row;
		}
		while (column > 0) {
			x += this.getGrid(grid.row, column).width;
			--column;
		}
		bounds.x = x;
		bounds.y = y;
		return bounds;
	}
});
module.exports = Grid;