function Player (propertys) {
	this.name = propertys.name || "Unnamed";

	this.x = propertys.x || 0;
	this.y = propertys.y || 0;
	this.speed = propertys.speed || 0;

	this.forceY    = (typeof propertys.forceY == "number")    ? propertys.forceY    : 0;    // Pixels per ms, pointing upwards
	this.jumpForce = (typeof propertys.jumpForce == "number") ? propertys.jumpForce : 2;    // Pixels per ms, how hard do we jump?
	this.gravity   = (typeof propertys.gravity == "number")   ? propertys.gravity   : .02;    // Pixels per ms per ms
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

// Physics tick
Player.prototype.update = function update (deltaTime) {
	var xDis = (this.targetX - this.x);
	var yDis = (this.targetX - this.x);

	if (this.targetY == 0 && this.jumping)
		this.forceY = this.jumpForce;

	this.targetX += this.speed * this.forceX * deltaTime;
	this.targetY += this.forceY * deltaTime;
	this.forceY -= this.gravity * deltaTime;

	if (this.targetY <= 0)
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
	this.forceX -= this.speed;
};

Player.prototype.actions.stopmoveleft = function stopmoveleft () {
	this.forceX += this.speed;
};

Player.prototype.actions.moveright = function moveright () {
	this.forceX += this.speed;
};

Player.prototype.actions.stopmoveright = function stopmoveright () {
	this.forceX -= this.speed;
};