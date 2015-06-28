// Settings should look like:
// [spriteSettings, spriteSettings, ...]

// SpriteSettings should look like:
// {name: string, topLeftX: int, topLeftY: int, width: int, height: int, msperframe: int, frames: int}

function Sprite (sheetUrl, settings) {
	this.settings = settings;

	var sheet = new Image();
	sheet.addEventListener("load", function () {
		this.image = sheet;
	}.bind(this));
	sheet.src = sheetUrl;
}

Sprite.prototype.settingFromName = function settingFromName (animation) {
	for (var k = 0; k < this.settings.length; k++)
		if (this.settings[k].name == animation)
			return this.settings[k];
	return false;
};

Sprite.prototype.emptyCanvas = function emptyCanvas (width, height) {
	var c = document.createElement("canvas");

	c.width = width;
	c.height = height;

	return c;
	
};

Sprite.prototype.blackCanvas = function blackCanvas (width, height) {
	var ctx = this.emptyCanvas().getContext("2d");

	// Make the background black
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.fillStyle = "black";
	ctx.fill();

	return ctx.canvas;
};

Sprite.prototype.getFrame = function getFrame (animation, time) {
	var settings = this.settingFromName(animation);
	if (!settings) throw "Animation '" + animation + "' was not in this sprite";

	if (!this.image) return this.blackCanvas(settings.width, settings.height);

	var frameNr = Math.floor(time / settings.msPerFrame) % settings.frames;
	var canvas = this.emptyCanvas(settings.width, settings.height);
	var ctx = canvas.getContext("2d");

	ctx.drawImage(this.image,
	              settings.topLeftX + frameNr * settings.width,
	              settings.topLeftY,
	              settings.width, settings.height,
	              0, 0,
	              settings.width, settings.height);

	return canvas;
};