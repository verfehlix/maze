window.onload = init;

// Cell class to hold information about specific cells
class Cell {
	constructor(x,y){
		//x & y coordinates
		this.x=x;
		this.y=y;

		//has this cell already been visited?
		this.visited = false;

		//array to hold information about the "closed" walls of this cells --> all non included walls are open
		this.closedWalls = ["top","right","bottom","left"]
	}
}

// Grid class to hold information about the grid that holds the cells
class Grid {
	constructor(numberOfCellsPerRow){
		//populate cells arary with numberOfCellsPerRow * numberOfCellsPerRow cells
		this.cells = [];

		for (var x = 0; x < numberOfCellsPerRow; x++) {
			for (var y = 0; y < numberOfCellsPerRow; y++) {
				var cell = new Cell(x,y);
				this.cells.push(cell);
			}
		}
	}

	//returns cell object for a given coordinate (if it exists in this grid)
	getCellAtXY(x,y){
		for (var i = 0; i < this.cells.length; i++) {
			var cell = this.cells[i];

			if(cell.x === x && cell.y === y){
				return cell;
			}
		}
	}
}

function init() {
	//SETTINGS

	//canvas size in pixels
	var canvasSize = 750;
	//padding from canvas border to start of grid (pixels)
	var paddingTotal = 50;
	//number of cells each row should contain (e.g. 50 --> 50x50 grid)
	var numberOfCellsPerRow = 50;

	//calculate pixel size for each cell
	var cellSize = (canvasSize - (paddingTotal)) / numberOfCellsPerRow;
	//calculate padding of each side for drawing cells
	var paddingPerSide = paddingTotal / 2;

	//PIXI JS ALIASES
	var Container = PIXI.Container;
	var	autoDetectRenderer = PIXI.autoDetectRenderer;
	var	loader = PIXI.loader;
	var	resources = PIXI.loader.resources;
	var	Sprite = PIXI.Sprite;
	var graphics = new PIXI.Graphics();

	//RENDERER & STAGE
	var renderer = PIXI.autoDetectRenderer(canvasSize, canvasSize);
	var	stage = new PIXI.Container();
	document.body.appendChild(renderer.view);

	//TIMING & RENDERING
	var last = performance.now()
	var stop = false;

	//make grid globally available
	var grid;

	//function to draw the cells
	function drawCells(){
		//clear all graphic objects on the stage
		graphics.clear();
		//set drawing style
		graphics.beginFill(0x666666);
		graphics.lineStyle(1, 0x999999);

		//iterate all cells in the grid
		for (var i = 0; i < grid.cells.length; i++) {

			var cell = grid.cells[i];

			var x = cell.x;
			var y = cell.y;

			//calculate the position on the canvas where the cell should be drawn
			var drawPosX = paddingPerSide + x + ((x % numberOfCellsPerRow) * (cellSize-1));
			var drawPosY = paddingPerSide + y + ((y % numberOfCellsPerRow) * (cellSize-1));

			//draw the cell onto the canvas
			graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);
		}
		stage.addChild(graphics);
	}

	//SETUP
	function setup() {

		//initialize grid
		grid = new Grid(numberOfCellsPerRow);

		//start the game loop
		gameLoop();
	}

	//GAME LOOP
	function gameLoop() {

	    // request another frame
	    requestAnimationFrame(gameLoop);

		//re-calculate timing variables for rendering
		let now = performance.now();
        let elapsed = now - last;
        last = now;

		//draw the cells onto the stage
		drawCells();

		//render the stage
		renderer.render(stage);
	}

	//start
	setup();
}
