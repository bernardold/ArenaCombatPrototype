
/*
Bullet class

*/

function Bullet(){
	// Attributes
	this.velocityX = 0;
	this.velocityY = 1;
	this.cooldownTime = 120;
	this.cooldown;
	// spread
	this.spread = false;
	this.bulletsAmt = 1;
	this.minSpread = 0;
	this.maxSpread = 0;
	// Aesthetic
	this.sprite = new Array();
	game.load.image('bullet','assets/bullet.png');
}

Bullet.prototype.create = function(velocityX,velocityY){
	this.group = game.add.group();
	this.group.enableBody = true;
	this.group.physicsBodyType = Phaser.Physics.ARCADE;

	this.velocityX = velocityX;
	this.velocityY = velocityY;

	if (this.spread){
		// calculate the range of the spread
		this.maxSpread = ((this.bulletsAmt*150)/2);
		this.minSpread = -this.maxSpread;
	}
}

Bullet.prototype.fire = function(posX,posY){
	// Interrupt the execution if cooldown is not done
	if (this.cooldown < this.cooldownTime) return false;

	for (var i = 0; i < this.bulletsAmt; i++) {
		this.sprite[i] = this.group.create(posX, posY, 'bullet');
		this.sprite[i].body.velocity.y = this.velocityY;
		this.sprite[i].body.velocity.x = randomNumber(this.minSpread,this.maxSpread);
		this.sprite[i].events.onOutOfBounds.add(this.sprite[i].kill, this);
	}

	// Start cooldown count
	this.cooldown = 0;
}

Bullet.prototype.updateCooldown = function(){
	if (this.cooldown < this.cooldownTime) this.cooldown++;
}

Bullet.prototype.setCooldown = function(cd){
	this.cooldownTime = cd;
}

Bullet.prototype.setSpread = function(state, amt){
	this.spread = state;

	if (!state) this.bulletsAmt = 1;
	else this.bulletsAmt = amt;
}

Bullet.prototype.collisionGroup = function(){
	return this.group;
}