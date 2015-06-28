function CastleWarScreen (container, castleWar) {
	this.castleWar = castleWar;
	this.container = container;

	// Clear the container
	while (this.container.firstChild) this.container.removeChild(this.container.firstChild);

	// Setup a canvas for the background
	this.backgroundCanvas = this.container.appendChild(document.createElement("canvas"));
	this.backgroundCanvas.className = "castlewar-background castlewar-fill";

	// Create a tiled canvas for the background
	this.backgroundTiledCanvas = new TiledCanvas(this.backgroundCanvas, {chunkSize: 256});
	this.backgroundContext = this.backgroundTiledCanvas.context;

	// The background generate function
	this.backgroundTiledCanvas.requestUserChunk = this.backgroundChunk.bind(this);
	this.backgroundTiledCanvas.redraw();

	// Context of all layers
	this.layers = {};
	this.createLayers(["foreground"]);

	// Start with 0, 0 as center
	this.topLeftX = -this.container.offsetWidth / 2;
	this.topLeftY = -this.container.offsetHeight + 1/10 * this.container.offsetHeight;

	// How zoomed in we are, 2 = everything is draw double as big
	this.zoom = 1;

	// Resize the canvases when the size changes and now
	window.addEventListener("resize", this.resizeCanvas.bind(this));
	this.resizeCanvas();

	// Start the drawloop
	requestAnimationFrame(this.draw.bind(this));
}

CastleWarScreen.prototype.resizeCanvas = function resizeCanvas () {
	this.backgroundCanvas.width = this.backgroundCanvas.parentNode.offsetWidth;
	this.backgroundCanvas.height = this.backgroundCanvas.parentNode.offsetHeight;

	for (var lName in this.layers) {
		this.layers[lName].canvas.width = this.layers[lName].canvas.parentNode.offsetWidth;
		this.layers[lName].canvas.height = this.layers[lName].canvas.parentNode.offsetHeight;
	}

	this.resized = true;
};

CastleWarScreen.prototype.backgroundChunk = function backgroundChunk (chunkX, chunkY, callback) {
	// Normalize the draw coords into physics coords
	// The draw coords has a y axis pointing downwards, the physics
	//  coords flip it so that the y axis points upwards
	var chunkSize = this.backgroundTiledCanvas.settings.chunkSize;

	var ctx = document.createElement("canvas").getContext("2d");
	ctx.canvas.width = chunkSize;
	ctx.canvas.height = chunkSize;

	// Draw white background
	ctx.beginPath();
	ctx.rect(0, 0, chunkSize, chunkSize);
	ctx.fillStyle = "white";
	ctx.fill();

	// Draw black line at y=0, and slightly wiggle upwards
	ctx.beginPath();
	ctx.moveTo(0, -chunkY * chunkSize);

	var parts = 5;
	for (var k = 0; k < parts - 1; k++) {
		ctx.lineTo((k + 1) * chunkSize / parts, -chunkY * chunkSize - Math.random() * 5);
	}

	// The last one should be at y=0 for smooth transition
	ctx.lineTo(chunkSize, -chunkY * chunkSize);
	
	ctx.strokeStyle = "black";
	ctx.lineWidth = 5;
	ctx.stroke();

	setTimeout(function () {
		callback(ctx.canvas);
	}, 0);

};

// Create layers using an array of names
// Example: ['background', 'players', 'arrows']
CastleWarScreen.prototype.createLayers = function createLayers (layers) {
	for (var k = 0; k < layers.length; k++) {
		// Create a canvas, add it to the container and put the context in the layer object
		this.layers[layers[k]] = this.container.appendChild(document.createElement("canvas")).getContext("2d");
		this.layers[layers[k]].canvas.className = "castlewar-fill";
	}
};

// The draw loop
CastleWarScreen.prototype.draw = function draw () {
	for (var lName in this.layers)
		this.layers[lName].clearRect(0, 0, this.layers[lName].canvas.width, this.layers[lName].canvas.height);

	// Only redraw the background if we moved or if
	// we have resied the canvas
	if (this.resized || this.backgroundTiledCanvas.leftTopX !== this.topLeftX || this.backgroundTiledCanvas.leftTopY !== this.topLeftY) {
		this.backgroundTiledCanvas.goto(this.topLeftX, this.topLeftY);
		this.resized = false;
	}

	this.renderObjectsHashMap(this.castleWar.players, "foreground");
	requestAnimationFrame(this.draw.bind(this));
};

// Give the objects the command to draw, objects is an array of objects
// The objects will have their .render() method called with
// as parameters: (context, topLeftX, topLeftY, zoom)
CastleWarScreen.prototype.renderObjects = function renderObjects (objects, layerName) {
	for (var k = 0; k < objects.length; k++) {
		objects[k].render(this.layers[layerName], this.topLeftX, this.topLeftY, this.zoom);
	}
};

// Give the objects the command to draw, objects is a hashmap of objects
// The objects will have their .render() method called with
// as parameters: (context, topLeftX, topLeftY, zoom)
CastleWarScreen.prototype.renderObjectsHashMap = function renderObjectsHashMap (objects, layerName) {
	for (var objKey in objects) {
		objects[objKey].render(this.layers[layerName], this.topLeftX, this.topLeftY, this.zoom);
	}
};