function Network (server, castleWar) {
	this.castleWar = castleWar;
	this.socket = io(server);
	this.bindSocketHandlers();
	this.bindCastleWarHandlers();
}

/*
	Socket communicatione
*/

Network.prototype.bindSocketHandlers = function bindSocketHandlers () {
	this.socket.on("playerlist", this.setPlayerList.bind(this));
	this.socket.on("playerMove", this.playerMove.bind(this));
};

Network.prototype.setPlayerList = function setPlayerList (list) {
	this.castleWar.setPlayerList(list);
};

Network.prototype.playerMove = function playerMove (playerMove) {
	this.castleWar.playerMove(playerMove);
};

/*
	CastleWar Handlers
*/

Network.prototype.bindCastleWarHandlers = function bindCastleWarHandlers () {
	this.castleWar.addEventListener("playermove", function (move) {
		this.socket.emit("playermove", move);
	});	
};