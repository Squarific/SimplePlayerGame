function KeyboardController (castleWar) {
	this.castleWar = castleWar;

	// The actions that should be executed on keydown for that event.keyCode
	this.keyDownList = {
		37: ["moveleft"],
		38: ["jump"],
		39: ["moveright"],
		40: []
	};

	this.keyUpList = {
	    37:	["stopmoveleft"],
	    38:	["stopjump"],
	    39:	["stopmoveright"],
	    40:	[],
	};

	document.addEventListener("keydown", this.handleKeyDown.bind(this));
}

// Execute the keydown actions
KeyboardController.prototype.handleKeyDown = function handleKeyDown (event) {
	this.performActions(this.keyDownList[event.keyCode] || []);
};

// Executes the actions in the array
KeyboardController.prototype.performActions = function performActions (actions) {
	for (var k = 0; k < actions.length; k++) {
		this.actions[actions[k]].call(this);
	}
};

// Actions to perform
// this refers to KeyboardController when called from performActions
KeyboardController.prototype.actions = {};
KeyboardController.prototype.actions.moveleft = function moveleft () {
	this.castleWar.action("moveleft");
};

KeyboardController.prototype.actions.moveright = function moveright () {
	this.castleWar.action("moveright");
};

KeyboardController.prototype.actions.jump = function jump () {
	this.castleWar.action("jump");
};

KeyboardController.prototype.actions.stopmoveleft = function stopmoveleft () {
	this.castleWar.action("stopmoveleft");
};

KeyboardController.prototype.actions.stopmoveright = function stopmoveright () {
	this.castleWar.action("stopmoveright");
};