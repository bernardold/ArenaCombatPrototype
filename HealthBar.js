/*
Health Bar class

*/

function HealthBar(x, y, width, height){
	// Attributes
	this.x = x;
	this.y = y;
	this.movable = false;
	this.width = width;
	this.height = height;
	// Aesthetic attributes
	this.borderSize = 2;
	this.borderColor = '#a0a0a0';
	this.backgroundColor = '#404040';
	this.singleColor = false;
	this.primColor = '#00ff00';
	this.secColor = '#ffff00';
	this.tertColor = '#ff0000';
	// bars
	this.border;
	this.background;
	this.health;
}

HealthBar.prototype.update = function(currLife, maxLife, x, y){
	// Calculating bar size according to life
	var barWidth = (this.width - (this.borderSize*2)) * currLife / maxLife;
	// Calculating bar position
	if (x != undefined) this.x = x;
	if (y != undefined) this.y = y;

	// Defining and coloring Border
	if (this.borderSize != 0) this.border = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
	if (this.borderSize != 0) game.debug.geom(this.border,this.borderColor);

	// Defining and coloring background
	this.background = new Phaser.Rectangle(this.x+this.borderSize, this.y+this.borderSize, this.width-(this.borderSize*2), this.height-(this.borderSize*2));
	game.debug.geom(this.background,this.backgroundColor);

	// Defining and coloring Health Bar
	this.health = new Phaser.Rectangle(this.x+this.borderSize, this.y+this.borderSize, barWidth, this.height-(this.borderSize*2));
	if (!this.singleColor){
		if (currLife >= 50) game.debug.geom(this.health,this.primColor);
		else if (currLife >= 20) game.debug.geom(this.health,this.secColor);
		else if (currLife > 0) game.debug.geom(this.health,this.tertColor);
	}
	else {
		game.debug.geom(this.health,this.primColor);
	}

}

HealthBar.prototype.setBorder = function (thickness){
	this.borderSize = (thickness == 'none' ? 0 : thickness);
}

HealthBar.prototype.setPrimaryColor = function (color){
	this.primColor = color;
}

HealthBar.prototype.setSecondaryColor = function (color){
	this.secColor = color;
}

HealthBar.prototype.setTertiaryColor = function (color){
	this.tertColor = color;
}

HealthBar.prototype.setSingleColor = function (color){
	this.primColor = color;
	this.singleColor = true;
}

HealthBar.prototype.getWidth = function(){
	return this.width;
}

HealthBar.prototype.getHeight = function(){
	return this.height;
}

HealthBar.prototype.centerX = function(){
	return (this.width / 2 + this.x);
}

HealthBar.prototype.centerY = function(){
	return (this.height / 2 + this.y);
}