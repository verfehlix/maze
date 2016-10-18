window.onload = init;

var colors = [0x1abc9c, 0x2ecc71, 0x3498db, 0x9b59b6, 0x34495e, 0x16a085, 0x27ae60, 0x2980b9, 0x8e44ad, 0x2c3e50, 0xf1c40f, 0xe67e22, 0xe74c3c, 0xecf0f1, 0x95a5a6, 0xf39c12, 0xd35400, 0xc0392b, 0xbdc3c7, 0x7f8c8d];

// Cell class to hold information about specific cells
class Cell {
	constructor(x,y,numberOfCellsPerRow,cellSize){
		//x & y coordinates
		this.x=x;
		this.y=y;
		this.size = cellSize;
		this.maxCoordinate = numberOfCellsPerRow - 1;

		//has this cell already been visited?
		this.visited = false;

		//add neighbour cell coordinates
		this.neighbours = {};

		if(this.y + 2 <= this.maxCoordinate){
			this.neighbours.bottom = {
				x: this.x,
				y: this.y + 2,
				name: "bottom"
			}
		};

		if(this.x + 2 <= this.maxCoordinate){
			this.neighbours.right = {
				x: this.x + 2,
				y: this.y,
				name: "right"
			}
		};

		if(this.y - 2 >= 0){
			this.neighbours.top = {
				x: this.x,
				y: this.y - 2,
				name: "top"
			}
		};

		if(this.x - 2 >= 0){
			this.neighbours.left = {
				x: this.x -2,
				y: this.y,
				name: "left"
			}
		};

		//array to hold information about the "closed" walls of this cells --> all not included walls are open
		this.closedWalls = ["top","right","bottom","left"]

		//color of the cell
		this.color = shuffle(colors)[0];

		//Sprite
		if(Math.random() > 0.5){
			this.sprite = new PIXI.Sprite(PIXI.loader.resources.wall1.texture);
		} else {
			this.sprite = new PIXI.Sprite(PIXI.loader.resources.wall2.texture);
		}
        // set position
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        // set size
        this.sprite.width = this.size;
        this.sprite.height = this.size;

	}
}

// Grid class to hold information about the grid that holds the cells
class Grid {
	constructor(numberOfCellsPerRow, cellSize){
		//populate cells arary with numberOfCellsPerRow * numberOfCellsPerRow cells
		this.cells = [];
		this.numberOfCellsPerRow = numberOfCellsPerRow;

		for (var x = 0; x < numberOfCellsPerRow; x++) {
			for (var y = 0; y < numberOfCellsPerRow; y++) {
				var cell = new Cell(x,y,numberOfCellsPerRow,cellSize);
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

	getRandomCornerCell(){
		var min = 0;
		var max = this.numberOfCellsPerRow - 1;
		var rand = Math.random();
		if(rand <= 0.25){
			return this.getCellAtXY(min,min);
		}
		if(rand > 0.25 && rand <= 0.5){
			return this.getCellAtXY(min,max);
		}
		if(rand > 0.5 && rand <= 0.75){
			return this.getCellAtXY(max,min);
		}
		if(rand > 0.75){
			return this.getCellAtXY(max,max);
		}
		return this.getCellAtXY(2,2);
	}
}

function shuffle(array) {
    var j, x, i;
	var shuffledArray = array.slice();
    for (i = shuffledArray.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = shuffledArray[i - 1];
        shuffledArray[i - 1] = shuffledArray[j];
        shuffledArray[j] = x;
    }
	return shuffledArray;
}


function init() {
	//SETTINGS

	//canvas size in pixels
	var canvasSize = 750;
	//padding from canvas border to start of grid (pixels)
	var paddingTotal = 2;
	//number of cells each row should contain (e.g. 50 --> 50x50 grid)
	//only uneven numbers!
	var numberOfCellsPerRow = 25;

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

	//LOAD ASSETS
	loader
		.add("wall1", "img/wall1.png")
		.add("wall2", "img/wall2.png")
		.load(setup);

	//make grid globally available
	var grid;

	//function to draw the cells
	function drawCells(){
		//clear all graphic objects on the stage
		graphics.clear();
		//set drawing style
		// graphics.lineStyle(1, 0x999999);

		//iterate all cells in the grid
		for (var i = 0; i < grid.cells.length; i++) {

			var cell = grid.cells[i];

			var x = cell.x;
			var y = cell.y;

			//calculate the position on the canvas where the cell should be drawn
			var drawPosX = paddingPerSide + x + ((x % numberOfCellsPerRow) * (cellSize-1));
			var drawPosY = paddingPerSide + y + ((y % numberOfCellsPerRow) * (cellSize-1));

			if(cell.visited){
				//draw the cell onto the canvas
				graphics.beginFill(0x999999);
				graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);
			} else {
				//graphics.beginFill(cell.color);
				//graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);
				cell.sprite.position.x = drawPosX;
				cell.sprite.position.y = drawPosY;
				stage.addChild(cell.sprite);
			}


		}
		stage.addChild(graphics);
	}

	function backtrack(cell, previousCell){

		cell.visited = true;

		if(previousCell){
			var xMid = (cell.x + previousCell.x) / 2;
			var yMid = (cell.y + previousCell.y) / 2;

			var midCell = grid.getCellAtXY(xMid, yMid);
			midCell.visited = true;
		}

		var remainingSides = shuffle(cell.closedWalls);

		while(remainingSides.length > 0){

			var side = remainingSides[0];

			var neighbourInfo = cell.neighbours[side];

			if(neighbourInfo){
				var neighbourCell = grid.getCellAtXY(neighbourInfo.x, neighbourInfo.y);
				if(!neighbourCell.visited){
					// drawCells();
					// renderer.render(stage);

					backtrack(neighbourCell, cell);
				}
			}
			remainingSides.splice(0,1);
		}

	}

	//SETUP
	function setup() {

		//initialize grid
		grid = new Grid(numberOfCellsPerRow,cellSize);

		// var cell = grid.getRandomCell();
		var cell = grid.getRandomCornerCell();

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
}
