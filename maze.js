window.onload = init;

class Cell {
	constructor(x,y){
		this.x=x;
		this.y=y;

		this.visited = false;
		this.closedWalls = ["top","right","bottom","left"]
	}
}

function init() {
	//SETTINGS
	var canvasSize = 750;
	var paddingTotal = 50;
	var paddingPerSide = paddingTotal / 2;
	var numberOfCellsPerRow = 50;

	var cellSize = (canvasSize - (paddingTotal)) / numberOfCellsPerRow;

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
		for (var x = 0; x < numberOfCellsPerRow; x++) {
			for (var y = 0; y < numberOfCellsPerRow; y++) {
				var cell = new Cell(x,y);
				cells.push(cell);
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
		graphics.beginFill(0x666666);
		graphics.lineStyle(1, 0x999999);

		for (var i = 0; i < cells.length; i++) {

			var cell = cells[i];

			var x = cell.x;
			var y = cell.y;


			var drawPosX = paddingPerSide + x + ((x % numberOfCellsPerRow) * (cellSize-1));
			var drawPosY = paddingPerSide + y + ((y % numberOfCellsPerRow) * (cellSize-1));

			graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);
		}
		stage.addChild(graphics);

		renderer.render(stage);

	}
}
