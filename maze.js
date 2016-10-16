window.onload = init;

class Cell {
	constructor(x,y,number){
		this.x=x;
		this.y=y;
		this.number = number;

		this.visited = false;
		this.closedWalls = ["top","right","bottom","left"]
	}
}

function init() {
	//SETTINGS
	var canvasSize = 750;
	var padding = 250;

	var numberOfCellsPerRow = 50;

	var cellSize = (canvasSize - (padding + numberOfCellsPerRow)) / numberOfCellsPerRow;

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

	var cells = [];

	//start
	setup();

	//SETUP
	function setup() {

		//init maze here
		var count = 0;
		for (var x = 0; x < numberOfCellsPerRow; x++) {
			for (var y = 0; y < numberOfCellsPerRow; y++) {
				var cell = new Cell(x,y,count);
				cells.push(cell);
				count++;
			}
		}

		gameLoop();
	}

	//GAME LOOP
    var last = performance.now()
	var stop = false;

	function gameLoop() {

	    // request another frame
	    requestAnimationFrame(gameLoop);

		let now = performance.now();
        let elapsed = now - last;
        last = now;

		graphics.clear();
		graphics.beginFill(0xAAAAAA);

		for (var i = 0; i < cells.length; i++) {

			var cell = cells[i];
			var drawPosX = padding/2 + cell.x + ((cell.x % numberOfCellsPerRow) * (cellSize));
			var drawPosY = padding/2 + cell.y + ((cell.y % numberOfCellsPerRow) * (cellSize));

			graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);
		}
		stage.addChild(graphics);

		renderer.render(stage);

	}
}
