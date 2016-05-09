
function Combat(){
	this.cursor;		// input listener
}

Combat.prototype.preload = function(){
	game.load.spritesheet('wall','assets/wall.png',32,32);

	healthPotion = new HealthPotion(HPamt, HPheal, HPcooldown);

	playerHP = new HealthBar(game.world.width - 450, 50, 400, 30);
	playerBullet = new Bullet();
	playerBullet.setSpread(playerBulletSpread);
	playerBullet.setType(playerBulletType);
	playerBullet.setDamage(playerBulletDamage);
	// The player MUST be defined after the bullet and its life bar
	player = new Player(playerHealthPoints, playerXvelocity, playerDashCD, playerShootingCD);
	
	enemyHP = new HealthBar(game.world.width - 450, 200, 64, 5);
	enemyHP.setBorder('none');
	enemyHP.setSingleColor('#ff0000');
	enemyBullet = new Bullet();
	enemyBullet.setDamage(enemyBulletDamage);
	// Enemies MUST be defined after their bullet and life bar
	enemy = new Enemy(enemyHealthPoints, enemyMinYPosition, enemyMaxYPosition, enemyDashCD);
}

Combat.prototype.create = function(){
	game.physics.startSystem(Phaser.Physics.ARCADE);					// Adding Arcade physics system
	game.stage.backgroundColor = '#87ceeb';

	player.create();
	enemy.create();

	cursor = game.input.keyboard.createCursorKeys();					// Setting the controls

	generateObstacle(obstaclesAmt);
}

Combat.prototype.update = function(){
	player.update();
	enemy.update();

	healthPotion.update();

	checkCollisions();

	if (playerHP != null) playerHP.update(player.getLife(), player.getMaxLife());
	if (enemyHP != null) enemyHP.update(enemy.getLife(), enemy.getMaxLife(), enemy.getX(), enemy.getY()-10);
}

function generateObstacle(amt){
	var x = 100;
	var y;

	// Creating the collision group for the obstacles
	obstacleCollisionGroup = game.add.group();
	obstacleCollisionGroup.enableBody = true;
	obstacleCollisionGroup.physicsBodyType = Phaser.Physics.ARCADE;

	for (var k = 0; k < amt; k++) {
		y = randomNumber(obstaclesMinY, obstaclesMaxY);

		obstacles[k] = new Obstacle(obstaclesMinWidth, obstaclesMinHeight, obstaclesMaxWidth, obstaclesMaxHeight);
		obstacles[k].create(x,y);

		x += game.world.width / amt;
	}

}


function checkCollisions(){
	// Try to detect the collision, but if any of the objects is null, just ignore

	// If the bullet is Armor Piercing type, check overlap instead of collision
	if (playerBullet.getType() == "aPiercing"){
		try {
			// Player hits wall with an armor piercing bullet
			game.physics.arcade.overlap(obstacleCollisionGroup, playerBullet.collisionGroup(), pierceWall);
		} catch (err) {
			console.log(err.message);
		}
	}
	// Otherwise, just normal behavior for bullets
	else{
		try {
			// Player hits wall
			game.physics.arcade.collide(obstacleCollisionGroup, playerBullet.collisionGroup(), hitWall);
		} catch (err) {
			console.log(err.message);
		}
	}


	try {
		// Enemy hits wall
		game.physics.arcade.collide(obstacleCollisionGroup, enemyBullet.collisionGroup(), hitWall);
	} catch (err) {
		console.log(err.message);
	}
	

	// Again, the same thing
	try {
		// Player hits enemy
		game.physics.arcade.collide(enemy.collisionGroup(), playerBullet.collisionGroup(), hitEnemy);
	} catch (err) {
		console.log(err.message);
	}

	// Again, the same thing
	try {
		// Enemy hits player
		game.physics.arcade.collide(player.collisionGroup(), enemyBullet.collisionGroup(), hitPlayer);
	} catch (err) {
		console.log(err.message);
	}
}

// Player hits enemy
function hitEnemy(x, bullet){
	//console.log("hit");
	bullet.kill();
	enemy.damage(playerBullet.getDamage());
}

// Enemy hits player
function hitPlayer(x, bullet){
	//console.log("hit");
	bullet.kill();
	player.damage(enemyBullet.getDamage());
}

// Player hits the 
function hitWall(wall, bullet){
	bullet.kill();

	wall.health--;
	if (wall.health < 0) wall.destroy();
	else wall.frame = wall.health;
}

// Either enemy or player hit the wall
function pierceWall(wall, bullet){

	wall.health = -1;
	wall.destroy();
}

function randomNumber (min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}