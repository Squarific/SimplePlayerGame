function CastleWar (container) {
	this.container = container;
	this.setPlayerList();

	this.deltaTickTime = 40; //ms per tick
	this.lastUpdate = Date.now();
	
	// Make sure every 20s we update
	setInterval(this.loop.bind(this), 20000);
}

// Set a list
// list = {
//     me: {name: string, x: number, y: number}
//     playerId1: {name: string, x: number, y: number},
//     playerId2: {name: string, x: number, y: number},
// ...}

CastleWar.prototype.setPlayerList = function setPlayerList (list) {
	this.players = {};

	for (var playerId in list)
		this.players[playerId] = new Player(list[playerId]);

	if (!this.players["me"]) this.players["me"] = new Player();
};

CastleWar.prototype.loop = function loop () {
	this.update();
	this.draw();
	requestAnimationFrame(this.loop.bind(this));
};

CastleWar.prototype.update = function update () {
	var deltaTime = Date.now() - this.lastUpdate;

	while (deltaTime > this.deltaTickTime) {
		// Update all players
		for (var playerId in this.players) {
			this.players[playerId].update(this.deltaTickTime);
		}

		deltaTime -= this.deltaTickTime;
	}
};

CastleWar.prototype.draw = function draw () {
	
};

// Moves a player
// move = {playerId: id, x: Number, y: Number}
CastleWar.prototype.playerMove = function playerMove (move) {
	this.players[move.playerId].move(move);
};

// Moves the main player
// move = {x: Number, y: Number}
CastleWar.prototype.move = function (move) {
	this.players["me"].move(move);
};

// Lets the main player perform the action
// action = 'jump', 'moveleft', 'moveright', 'attack'
CastleWar.prototype.action = function (action) {
	this.players["me"].action(action);
};

/**
 * Event dispatcher
 * License mit
 * https://github.com/mrdoob/eventdispatcher.js
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {}

EventDispatcher.prototype = {

	constructor: EventDispatcher,

	apply: function ( object ) {
		object.addEventListener = EventDispatcher.prototype.addEventListener;
		object.hasEventListener = EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
	},

	addEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;
		if ( listeners[ type ] === undefined ) listeners[ type ] = [];
		if ( listeners[ type ].indexOf( listener ) === - 1 ) listeners[ type ].push( listener );
	},

	hasEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return false;
		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) return true;
		return false;
	},

	removeEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {
			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) listenerArray.splice( index, 1 );
		}

	},

	dispatchEvent: function ( event ) {
		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {
			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) array[ i ] = listenerArray[ i ];
			for ( var i = 0; i < length; i ++ ) array[ i ].call( this, event );
		}
	}

};

EventDispatcher.prototype.apply(CastleWar.prototype);