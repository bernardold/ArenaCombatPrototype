
/*
Enemy class


	difficulty 1  	Slow movement 200
					Fast attack 50
					No evasion

	difficulty 2  	Faster movement 
					Slower attack 80
					Some evasion

	difficulty 3  	Faster movement
					Slower attack 200
					Focus evasion
*/

function Enemy(){
	// Attributes
	this.hp = 12;
	this.maxHP = 12;
	this.difficulty = 1;
	// Basic movement controls
	this.velocityX = 200;
	this.velocityY = 100;
	this.velocityMultiplier = 1.0;
	this.moveUp = false;
	this.moveDown = false;
	// Shooting
	this.shootCooldown = 50;
	// Dash basic controls
	this.dashVelocity = 4000;
	this.dashCooldownTime = 200;
	this.dashCooldown;
	// Aesthetic
	this.sprite;
	game.load.image('enemy','assets/enemy.png');
	// Box to check collision with walls for the enemy movement
	// invisible 264x100 pixel sprite
	this.dummySprite;
	game.load.image('box','assets/overlapingbox.png');
	// Var for the third level defensive movement
	this.changeCooldownTime = 200;
	this.changeCooldown;
	this.hideout = 1;
	this.minX = 0;
	this.maxX = 0;
	this.safeX = 0;
}

Enemy.prototype.create = function(){
	var startx = 450;
	var starty = game.world.height-450;

	this.sprite = game.add.sprite(startx, starty, 'enemy');		// Placing player sprite
	// Setting Physics
	game.physics.arcade.enable(this.sprite);
	this.sprite.body.collideWorldBounds = true;					// World Limit

	// Positioning the movement collision box above the enemy
	this.dummySprite = game.add.sprite(startx-100, starty, 'box');
	game.physics.arcade.enable(this.dummySprite);

	// Initializing cooldowns
	this.dashCooldown = this.dashCooldownTime;
	this.changeCooldown = this.changeCooldownTime;

	enemyBullet.create(0,1200);
}

Enemy.prototype.update = function(){
	// Updating control variables
	// Updating cooldowns
	enemyBullet.updateCooldown();
	if (this.dashCooldown < this.dashCooldownTime) this.dashCooldown++;
 
	// Level picking
	if (this.hp >= 8) this.difficulty = 1;
	else if (this.hp >= 4) this.difficulty = 2;
	else if (this.hp >= 1) this.difficulty = 3;

	// General behavior. Happens independent of the difficulty 

	// Check collision between enemy and wall
	game.physics.arcade.collide(obstacleCollisionGroup, this.collisionGroup());

	// Update the position of the movement collision box
	this.dummySprite.body.x = this.sprite.body.x-100;
	this.dummySprite.body.y = this.sprite.body.y-100;

	// Make the movements on the Y axis and trying to make direction changes smoother
	// by slowly decreasing X velocity and increasing Y velocity (and vice-versa)
	if ((this.moveUp || this.moveDown) && this.velocityMultiplier > 0.3){
		this.velocityMultiplier -= 0.05;
	}
	else if (this.velocityMultiplier < 1.0){
		this.velocityMultiplier += 0.05;
	}

	// Check the walls and activate movement on the Y axis in case of predicting a collision
	this.checkYMovement(this.sprite.deltaX!=0 || this.sprite.deltaY!=0);
	if (this.moveUp) this.sprite.body.velocity.y = (-1) * this.velocityY * (this.velocityMultiplier * (-1) + 1);
	else if (this.moveDown) this.sprite.body.velocity.y = this.velocityY * (this.velocityMultiplier * (-1) + 1);
	else this.sprite.body.velocity.y = 0;
	// Restarting velocities every iteration
	this.sprite.body.velocity.x = 0;
 

	// Shooting
	if (this.getX() - player.getX() < 20 && this.getX() - player.getX() > -20){
		this.shoot();
	}

	// Specific behaviors. Defined by the difficulty

	if (this.difficulty == 1){
		this.velocityX = 120;
		this.shootCooldown = 50;
		enemyBullet.setCooldown(this.shootCooldown);

		// Just basic movements
		this.regularMovement();
		// No Dash
	}
	else if (this.difficulty == 2){
		this.velocityX = 180;
		this.shootCooldown = 80;
		enemyBullet.setCooldown(this.shootCooldown);

		// Basic movements
		this.regularMovement();
		// Dash
		game.physics.arcade.overlap(this.dummySprite, playerBullet.collisionGroup(), this.checkDash, null, this);
	}
	else if (this.difficulty == 3){
		this.velocityX = 240;
		this.shootCooldown = 200;
		enemyBullet.setCooldown(this.shootCooldown);

		// Defensive movement
		this.defensiveMovement();
		// Dash
		game.physics.arcade.overlap(this.dummySprite, playerBullet.collisionGroup(), this.checkDash, null, this);
	}
	else {
		// Should never reach this
	}
}

Enemy.prototype.regularMovement = function(){
	// Normal movement
	if (this.getX() < player.getX()-3){
		this.sprite.body.velocity.x += this.velocityX * this.velocityMultiplier;
	}
	else if (this.getX() > player.getX()+3){
		this.sprite.body.velocity.x -= this.velocityX * this.velocityMultiplier;
	}
	else {
		// enemy still
	}
}

Enemy.prototype.defensiveMovement = function(){

	if (this.changeCooldown >= this.changeCooldownTime){
		this.hideout = randomNumber(1, obstaclesAmt);

		// Calculate minX value
		for (var i = obstacles[this.hideout-1].obstacle.length-1; i >= 0; i--) {
			for (var j = obstacles[this.hideout-1].obstacle[i].length-1; j >= 0 ; j--) {

				// this reads the obstacle matrix backwards, column x row ([j][i] instead of [i][j])
				// to make sure the last read value is the one in the very left side of the obstacle
				if (obstacles[this.hideout-1].obstacle[i][j].alive){
					this.minX = obstacles[this.hideout-1].obstacle[i][j].body.x;
					this.minX = Math.round(this.minX);
				}
			}
		}

		// Calculate maxX value
		for (var i = 0; i < obstacles[this.hideout-1].obstacle.length; i++) {
			for (var j = 0; j < obstacles[this.hideout-1].obstacle[i].length ; j++) {

				// this reads the obstacle matrix column x row ([j][i] instead of [i][j])
				// to make sure to get the the X of the wall most in the right
				if (obstacles[this.hideout-1].obstacle[i][j].alive){
					this.maxX = obstacles[this.hideout-1].obstacle[i][j].body.x + 32;
					this.maxX = Math.round(this.maxX);
				}
			}
		}
		// If some of the obstacles is completely destroyed and yet is randomized, minX and maxX values are not supposed to change

		// Randomize and X position behind the wall
		this.safeX = randomNumber(this.minX, (this.maxX - player.sprite.width));

		console.log(this.minX+" <-> "+this.maxX);
		this.changeCooldown = 0;
	}
	else {
		// if maxX - minX < 64, the obstacle is not good enough to hide behind, pick another one

		if (this.maxX - this.minX < 64){
			this.changeCooldown = this.changeCooldownTime;
		}

		// Move behind the wall
		if (this.getX() < this.safeX-3){
			this.sprite.body.velocity.x += this.velocityX * this.velocityMultiplier;
		}
		else if (this.getX() > this.safeX+3){
			this.sprite.body.velocity.x -= this.velocityX * this.velocityMultiplier;
		}
		else {
			// enemy still
		}


		this.changeCooldown++;
	}
}

Enemy.prototype.checkYMovement = function(moving){
	// Interrupt the functions if the enemy is not even moving
	if (!moving) return false;

	// check overlap to move up
	if (game.physics.arcade.collide(this.dummySprite, obstacleCollisionGroup, null, this.processWallCollision)){
		// if it gets to here, it means that the enemy is close to the wall, so you want to avoid the collision between them
		this.moveUp = true;
	}
	else {
		this.moveUp = false;

		// check overlap to move down
		if (game.physics.arcade.collide(this.dummySprite, obstacleCollisionGroup)){
			this.moveDown = false;
		}
		else {
			this.moveDown = true;
		}
	}

	if (this.sprite.body.y >= game.world.height-300) this.moveDown = false;
	
	return true;
}

Enemy.prototype.processWallCollision = function(sprite, wall){
	var dist = sprite.body.height-70;

	return (wall.body.y - sprite.body.y < dist && wall.body.y - sprite.body.y > -dist);
}

Enemy.prototype.checkDash = function(obj1, obj2){
	if (this.dashCooldown == this.dashCooldownTime){

		var side = randomNumber(0,1);
		if (side==0)this.sprite.body.velocity.x -= this.dashVelocity;	// Dash to the left
		if (side==1)this.sprite.body.velocity.x += this.dashVelocity;	// Dash to the right

		this.dashCooldown = 0
	}
}

Enemy.prototype.shoot = function(){
	// Try to shoot, but interrupt if cooldown is not complete
	if (this.sprite.alive) enemyBullet.fire(this.getX()+(this.sprite.width/2 - 5), this.getY()+this.sprite.height);
}

Enemy.prototype.damage = function (dam){
	this.hp -= dam;
	if (this.hp <= 0) this.kill();
}

Enemy.prototype.kill = function(){
	this.sprite.kill();
	enemyHP = null;
}

Enemy.prototype.getLife = function (){
	return this.hp;
}

Enemy.prototype.getMaxLife = function (){
	return this.maxHP;
}

Enemy.prototype.getX = function (){
	return this.sprite.x;
}

Enemy.prototype.getY = function (){
	return this.sprite.y;
}

Enemy.prototype.collisionGroup = function (){
	return this.sprite;
}
