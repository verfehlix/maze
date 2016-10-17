window.onload = init;

// Cell class to hold information about specific cells
class Cell {
	constructor(x,y,numberOfCellsPerRow){
		//x & y coordinates
		this.x=x;
		this.y=y;
		this.maxCoordinate = numberOfCellsPerRow - 1;

		//has this cell already been visited?
		this.visited = false;

		//add neighbour cell coordinates
		this.neighbours = {};

		if(this.y + 1 <= this.maxCoordinate){
			this.neighbours.bottom = {
				x: this.x,
				y: this.y + 1,
				name: "bottom"
			}
		};

		if(this.x + 1 <= this.maxCoordinate){
			this.neighbours.right = {
				x: this.x + 1,
				y: this.y,
				name: "right"
			}
		};

		if(this.y - 1 >= 0){
			this.neighbours.top = {
				x: this.x,
				y: this.y - 1,
				name: "top"
			}
		};

		if(this.x - 1 >= 0){
			this.neighbours.left = {
				x: this.x -1,
				y: this.y,
				name: "left"
			}
		};

		//array to hold information about the "closed" walls of this cells --> all not included walls are open
		this.closedWalls = ["top","right","bottom","left"]
	}
}

// Grid class to hold information about the grid that holds the cells
class Grid {
	constructor(numberOfCellsPerRow){
		//populate cells arary with numberOfCellsPerRow * numberOfCellsPerRow cells
		this.cells = [];
		this.numberOfCellsPerRow = numberOfCellsPerRow;

		for (var x = 0; x < numberOfCellsPerRow; x++) {
			for (var y = 0; y < numberOfCellsPerRow; y++) {
				var cell = new Cell(x,y,numberOfCellsPerRow);
				this.cells.push(cell);
			}
		}
	}

	printVisitedCells(){
		for (var i = 0; i < this.cells.length; i++) {
			if(this.cells[i].visited){
				console.log(this.cells[i]);
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

	//get random cell in grid
	getRandomCell(){
		//get random x & y coordinates within grid
		var x = Math.floor(Math.random() * (this.numberOfCellsPerRow-1)) + 1;
		var y = Math.floor(Math.random() * (this.numberOfCellsPerRow-1)) + 1;

		//return cell at this coordinate
		return this.getCellAtXY(x,y);
	}
}

function init() {
	//SETTINGS

	//canvas size in pixels
	var canvasSize = 750;
	//padding from canvas border to start of grid (pixels)
	var paddingTotal = 50;
	//number of cells each row should contain (e.g. 50 --> 50x50 grid)
	var numberOfCellsPerRow = 20;

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
		graphics.lineStyle(1, 0x999999);

		//iterate all cells in the grid
		for (var i = 0; i < grid.cells.length; i++) {

			var cell = grid.cells[i];

			if(cell.visited){
				graphics.beginFill(0x00ff99);
			} else {
				graphics.beginFill(0x666666);
			}

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

	function backtrack(cell) {
		setTimeout(function () {
			console.log("----------Backtrack----------")
			cell.visited = true;

			var wallToCarve = cell.closedWalls[Math.floor(Math.random()*cell.closedWalls.length)];

			console.log(cell);
			console.log("Carving into: |" + wallToCarve + "| Wall.");

			var neighbourInfo = cell.neighbours[wallToCarve];
			if(neighbourInfo){
				var neighbour = grid.getCellAtXY(neighbourInfo.x, neighbourInfo.y);
				console.log("Neighbour exists!")
				console.log(neighbour);

				if(!neighbour.visited){
					console.log("Neighbour is not visited! Next Neighbour?");

					var nextNeighbourInfo = neighbour.neighbours[wallToCarve];
					if(nextNeighbourInfo){
						var nextNeighbour = grid.getCellAtXY(nextNeighbourInfo.x, nextNeighbourInfo.y);
						console.log("Next Neighbour exists also!")

						if(!nextNeighbour.visited){
							console.log("Next Neighbour is also not visited! Carving!");

							neighbour.visited = true;

							//draw the cells onto the stage
							drawCells();

							//render the stage
							renderer.render(stage);

							backtrack(nextNeighbour);

						} else {
							backtrack(nextNeighbour);
						}
					}
				} else {
					backtrack(cell);
				}
			} else {
				backtrack(cell);
			}
		}, 0);
	}

	//SETUP
	function setup() {

		//initialize grid
		grid = new Grid(numberOfCellsPerRow);

		var cell = grid.getRandomCell();

		backtrack(cell);

		//draw the cells onto the stage
		drawCells();

		//render the stage
		renderer.render(stage);

		//start the game loop
		//gameLoop();
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
