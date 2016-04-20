
/*
Player class

*/

function Player(hp, velocityX, dashCD, shootCD){
	// Attributes
	this.hp = hp;
	this.maxHP = hp;
	// Basic movement controls
	this.velocityX = velocityX;
	this.velocityY = 0;
	this.shootCooldown = shootCD;
	this.lastY = 1;
	// Dash basic controls
	this.dashVelocity = 3500;
	this.dashCooldownTime = dashCD;
	this.dashCooldown
	this.lastPressedRight = 0;
	this.lastPressedLeft = 0;
	// Fixing dash variables
	this.tapDuration = 0;			// how long the first tap should be to be considered a tap instead of a long movement
	this.firstRelease = false;		// flag that guarantee a release before the double-tap, avoiding dash right after a long movement
	this.secondRelease = false;		// flag that guarantee the gap between the taps
	this.firstTap = false;			// identifies when a possible first tap happens
	// Aesthetic
	this.sprite;
	game.load.image('player','assets/blcube.png');
}


Player.prototype.create = function(){
	this.sprite = game.add.sprite(50, playerYposition, 'player');		// Placing player sprite
	this.lastY = game.world.height-100;
	// Setting Physics
	game.physics.arcade.enable(this.sprite);
	this.sprite.body.collideWorldBounds = true;								// World limit

	playerBullet.create(0,playerBulletVelocity);
	playerBullet.setCooldown(this.shootCooldown);

	this.dashCooldown = this.dashCooldownTime;
}

Player.prototype.update = function(){

	// Updating control variables
	// Updating cooldowns
	playerBullet.updateCooldown();
	if (this.dashCooldown < this.dashCooldownTime) this.dashCooldown++;
	// Updating timers
	if (this.lastPressedLeft > 0) this.lastPressedLeft--;
	if (this.lastPressedRight > 0) this.lastPressedRight--;
	// Dash flags
	if (this.tapDuration > 0) this.tapDuration--;
	else {
		this.firstRelease = false;
		this.firstTap = false;
	}

	// Basic movement
	this.sprite.body.velocity.x = 0;
	// Guarantee that the enemy doesn't push the enemy
	this.sprite.body.velocity.y = 0;
	this.sprite.body.position.y = this.lastY;
	// Left movement
	if (cursor.left.isDown){
		// Dash Left condition
		// test cooldown, test two consequent pushes, test if the pushes were quick enough
		if (this.secondRelease && this.dashCooldown >= this.dashCooldownTime && this.lastPressedLeft > 0){
			this.sprite.body.velocity.x -= this.dashVelocity;
			this.dashCooldown = 0;
		} 
		// Otherwise, just a regular movement to the left
		else {
			this.sprite.body.velocity.x -= this.velocityX;
		}

		// If the left button is pressed for within 10 iterations -> Flag the first tap
		if (!this.firstTap && this.firstRelease) this.firstTap = true;

		// Set the interval between the double tap
		this.lastPressedLeft = 7;
		this.secondRelease = false;
	}
	// Right movement
	else if (cursor.right.isDown){
		// Dash Right condition
		// test cooldown, test two consequent pushes, test is the pushes were wuick enough
		if (this.secondRelease && this.dashCooldown >= this.dashCooldownTime && this.lastPressedRight > 0){
			this.sprite.body.velocity.x += this.dashVelocity;
			this.dashCooldown = 0;

		} 
		// Otherwise, just a regular movement to the right
		else {
			this.sprite.body.velocity.x += this.velocityX;
		}

		// If the left button is pressed for within 10 iterations -> Flag the first tap
		if (!this.firstTap && this.firstRelease) this.firstTap = true;

		// Set the interval between the double tap
		this.lastPressedRight = 7;
		this.secondRelease = false;
	}
	// No input action
	else {
		// Right after the release of the first tap, flag the release of the first tap and prepare for the second 
		if (this.firstTap){
			this.secondRelease = true;			// Recognize a release of directions keys for the understanding of double taps

		}
		// It should go inside this else only if firstTap==false
		else {
			this.firstRelease = true;			// Guarantee that the first tap is happening right after this release
			this.tapDuration = 10;				// After 10 iterations the first is then gonna be considered a long movement
												// 			and is not going to be considered for the double tap
		}

	}
	// Shooting
	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		this.shoot();
	}

	// Save the Y position to prevent the player to be moved
	this.lastY = this.sprite.body.position.y;
}

Player.prototype.shoot = function(){
	// Try to shoot, but interrupt if cooldown is not complete
	playerBullet.fire(this.getX()+(this.sprite.width/2 - 5), this.getY()-this.sprite.height);
}

Player.prototype.damage = function (dam){
	this.hp -= dam;
	if (this.hp <= 0) this.kill();
}

Player.prototype.heal = function (regen){
	this.hp += regen;
	if (this.hp > 100) this.hp = 100;
}

Player.prototype.kill = function(){
	this.sprite.kill();
}

Player.prototype.alive = function(){
	return this.sprite.alive;
}

Player.prototype.getLife = function (){
	return this.hp;
}

Player.prototype.getMaxLife = function (){
	return this.maxHP;
}

Player.prototype.getX = function (){
	return this.sprite.x;
}

Player.prototype.getY = function (){
	return this.sprite.y;
}

Player.prototype.collisionGroup = function (){
	return this.sprite;
}