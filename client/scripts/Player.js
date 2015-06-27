function Player (propertys) {
	propertys = propertys || {};
	this.name = propertys.name || "Unnamed";

	this.loadImage();

	// The coordinates are the center of the player
	// The direction of the x axis is from left to right
	// The direction of the y axis is from bottom to top
	// This is different from the drawing axis
	this.x = propertys.x || 0;
	this.y = (typeof propertys.y == "number") ? propertys.y : this.image.height / 2;
	this.speed = (typeof propertys.speed == "number") ? propertys.speed : .5; // pixels per ms

	this.forceX    = (typeof propertys.forceX == "number")    ? propertys.forceX    : 0;
	this.forceY    = (typeof propertys.forceY == "number")    ? propertys.forceY    : 0;    // Pixels per ms, pointing upwards
	
	this.jumpForce = (typeof propertys.jumpForce == "number") ? propertys.jumpForce : 1.5;    // Pixels per ms, how hard do we jump?
	this.gravity   = (typeof propertys.gravity == "number")   ? propertys.gravity   : .005;    // Pixels per ms per ms
	this.jumping = false;

	this.targetX = this.x;
	this.targetY = this.y;

	// The maximum distance between the real coords and the
	// ones we are interpolating. In both the x and y direction
	// If the distance is smaller in both, then the real ones
	// get set to the target ones
	this.maxTargetDistance = 2;

	this.health = (typeof propertys.health == "number") ? propertys.health : 100;
}

// Load the image for the appearance. As long as
// it is not loaded use a preload drawing
Player.prototype.loadImage = function loadImage () {
	// The appearance of the player before the image is loaded
	this.image = document.createElement("canvas");
	this.image.width = 100;
	this.image.height = 200;

	// Draw a black rectangle as preloaded player
	var ctx = this.image.getContext("2d");
	ctx.beginPath();
	ctx.rect(0, 0, this.image.width, this.image.height);
	ctx.fillStyle = "black";
	ctx.fill();

	// Load the real image
	var tmpImage = new Image();
	tmpImage.addEventListener("load", function () {
		console.log("Image " + tmpImage.src + " loaded!");
		this.image = tmpImage;
	}.bind(this));
	tmpImage.src = "images/player.png";
};

// Physics tick
Player.prototype.update = function update (deltaTime) {
	var xDis = (this.targetX - this.x);
	var yDis = (this.targetY - this.y);

	// Is the bottom of the player on the ground?
	if ((this.targetY - this.image.height / 2) <= 0 && this.jumping)
		this.forceY = this.jumpForce;

	var direction = 0;
	if (this.movingLeft) direction--;
	if (this.movingRight) direction++;

	this.targetX += this.forceX * deltaTime + this.speed * direction * deltaTime;
	this.targetY += this.forceY * deltaTime;
	this.forceY -= this.gravity * deltaTime;

	if ((this.targetY - this.image.height / 2) <= 0)
		this.forceY = 0;

	if (xDis <= this.maxTargetDistance && yDis <= this.maxTargetDistance) {
		this.x = this.targetX;
		this.y = this.targetY;
	} else {
		this.x += xDis / 2;
		this.y += yDis / 2;
	}
};

// Move the player
// move = {x: Number, y: Number}
Player.prototype.move = function move (move) {
	this.targetX = move.x;
	this.targetY = move.y;
};

Player.prototype.render = function render (ctx, topLeftX, topLeftY, zoom) {
	// The drawing axis go from left to rigth and top to bottom
	// The physics axis of the player go from bottom to top
	ctx.drawImage(this.image, (this.x - topLeftX) * zoom - this.image.width * zoom / 2, (-this.y - topLeftY) * zoom - this.image.height * zoom / 2, this.image.width * zoom, this.image.height * zoom);
};

// Perform the given action
// action = 'jump', 'moveleft', 'moveright', 'attack'
Player.prototype.action = function action (action) {
	this.actions[action].call(this);
};

Player.prototype.actions = {};

Player.prototype.actions.jump = function jump () {
	this.jumping = true;
};

Player.prototype.actions.stopjump = function stopjump () {
	this.jumping = false;
};

Player.prototype.actions.attack = function attack () {
	
};

Player.prototype.actions.moveleft = function moveleft () {
	this.movingLeft = true;
};

Player.prototype.actions.stopmoveleft = function stopmoveleft () {
	this.movingLeft = false;
};

Player.prototype.actions.moveright = function moveright () {
	this.movingRight = true;
};

Player.prototype.actions.stopmoveright = function stopmoveright () {
	this.movingRight = false;
};