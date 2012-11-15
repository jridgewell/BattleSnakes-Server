var Debug = require('./Debug');
require('./misc');
var GridSection = require('./GridSection');
var Point = require('./all/Point');
var d = new Debug();


function Grid(width, height) {
	this.grid = [];
	this.rows = 0;
	this.columns = 0;
}

Grid.prototype.extend({
	init: function() {
		for (var i = 0; i < 3; ++i) {
			this.increase();
		}
	},
	increase: function() {
		var ret = [],
			lastRow = [];
		for (var i = 0, r = this.rows; i < r; ++i) {
			var g = new GridSection(i, this.columns);
			this.grid[i].push(g);
			ret.push(g);
		}
		for (var i = 0, c = this.columns; i <= c; ++i) {
			var g = new GridSection(this.rows, i);
			lastRow.push(g);
			ret.push(g);
		}
		this.grid.push(lastRow);

		++this.rows;
		++this.columns;
		return ret;
	},
	decrease: function() {
		var ret = [],
			lastRow = this.grid[this.rows - 1];
		for (var i = 0, r = this.rows - 1; i < r; ++i) {
			ret.push(this.grid[i].pop());
		}
		for (var i = 0, c = this.columns; i < c; ++i) {
			ret.push(lastRow.shift());
		}
		this.grid.pop();

		--this.rows;
		--this.columns;
		return ret;
	},
	getGrid: function(gridOrRow, column) {
		if (gridOrRow instanceof GridSection) {
			return gridOrRow;
		} else if (gridOrRow instanceof Object) {
			return this.getGrid(gridOrRow.row, gridOrRow.column);
		}
		return this.grid[gridOrRow][column];
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
		while (row >= 0) {
			y += this.getGrid(row, grid.column).height;
			--row;
		}
		while (column >= 0) {
			x += this.getGrid(grid.row, column).width;
			--column;
		}
		bounds.x = x;
		bounds.y = y;
		return bounds;
	},

	positionInsideGrid: function(position, gridOrRow, column) {
		var grid = this.getGrid(gridOrRow, column),
			bounds = this.getBoundsOfGrid(grid),
			topLeft = new Point(
				bounds.x,
				bounds.y + bounds.height
			),
			bottomRight = new Point(
				bounds.x + bounds.width,
				bounds.y
			);
		return position.inside(topLeft, bottomRight);
	}
});
module.exports = Grid;
