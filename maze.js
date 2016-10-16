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
	var width = 750;
	var height = 750;

	var cellSize = 75;

	//PIXI JS ALIASES
	var Container = PIXI.Container;
	var	autoDetectRenderer = PIXI.autoDetectRenderer;
	var	loader = PIXI.loader;
	var	resources = PIXI.loader.resources;
	var	Sprite = PIXI.Sprite;
	var graphics = new PIXI.Graphics();

	//RENDERER & STAGE
	var renderer = PIXI.autoDetectRenderer(width, height);
	var	stage = new PIXI.Container();
	document.body.appendChild(renderer.view);

	var cells = [];

	//start
	setup();


	//SETUP
	function setup() {

		//init maze here
		var rowWidth = height / cellSize;
		var colWidth = height / cellSize;

		for (var x = 0; x < rowWidth; x++) {
			for (var y = 0; y < colWidth; y++) {
				var cell = new Cell(x,y);
				cells.push(cell);
			}
		}

		gameLoop();
	};


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
			console.log(cell);
			var drawPosX = cell.x + ( (cell.x % 10) * (cellSize+2) );
			var drawPosY = cell.y + ( (cell.y % 10) * cellSize );

			graphics.drawRect(drawPosX, drawPosY, cellSize, cellSize);

		}

		stage.addChild(graphics);
		renderer.render(stage);

	}
}
