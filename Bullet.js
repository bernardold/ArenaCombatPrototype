
/*
Bullet class

*/

function Bullet(){
	// Attributes
	this.velocityX = 0;
	this.velocityY = 1;
	this.cooldownTime = 120;
	this.cooldown;
	// Damages
	this.baseDamage = 10;
	this.fireDmg = 0;
	this.electricDmg = 0;
	this.acidDmg = 0;
	this.iceDmg = 0;
	this.aPiercingDmg = 0;
	this.damage;
	// spread
	this.spread = false;
	this.bulletsAmt = 1;
	this.minSpread = 0;
	this.maxSpread = 0;
	// type of bullet
	this.emitter = new Array();
	this.bulletType = "normal";		// "normal", "fire", "electric", "acid", "ice", or "aPiercing"
	// the sprite of the different type particles
	game.load.image('p_fire','assets/fire particle.png');
	game.load.image('p_electric','assets/electric particle.png');
	game.load.image('p_acid','assets/acid particle.png');
	game.load.image('p_ice','assets/ice particle.png');
	game.load.image('p_aPiercing','assets/aPiercing particle.png');
	// Aesthetic
	this.sprite = new Array();
	game.load.image('bullet','assets/bullet.png');
}

Bullet.prototype.create = function(velocityX,velocityY){
	this.group = game.add.group();
	this.group.enableBody = true;
	this.group.physicsBodyType = Phaser.Physics.ARCADE;

	this.baseDamage = 10;
	this.fireDmg = 2;
	this.electricDmg = 2;
	this.acidDmg = 2;
	this.iceDmg = 2;
	this.aPiercingDmg = 0;

	this.velocityX = velocityX;
	this.velocityY = velocityY;

	// spread stuff
	if (this.spread){
		// calculate the range of the spread
		this.maxSpread = ((this.bulletsAmt*150)/2);
		this.minSpread = -this.maxSpread;
	}

	if (this.bulletType != "normal"){
		// bullet type stuff
		for (var i = 0; i < this.bulletsAmt; i++) {
			this.emitter[i] = game.add.emitter(0, game.world.height);
			// Create the particle specific of the type
			this.emitter[i].makeParticles('p_'+this.bulletType);
			this.emitter[i].name ='p_'+this.bulletType;
			this.emitter[i].lifespan = 100;
			// Apply the velocity to the system
			this.emitter[i].minParticleSpeed = new Phaser.Point(-100,300);
			this.emitter[i].maxParticleSpeed = new Phaser.Point(100,400);
		}

		// Setting the damage according to the bullet type
		if (this.bulletType == "fire") this.damage = this.baseDamage + this.fireDmg;
		else if (this.bulletType == "electric") this.damage = this.baseDamage + this.electricDmg;
		else if (this.bulletType == "acid") this.damage = this.baseDamage + this.acidDmg;
		else if (this.bulletType == "ice") this.damage = this.baseDamage + this.iceDmg;
		else if (this.bulletType == "aPiercing") this.damage = this.baseDamage + this.aPiercingDmg;
		else {/* Should not get to here */}
	}
	else {
		this.damage = this.baseDamage;
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

		if (this.bulletType != "normal"){
			// Attach the emitter to the sprite
	    	this.sprite[i].addChild(this.emitter[i]);
	    	this.emitter[i].x = this.sprite[i].width/2;
	    	this.emitter[i].y = this.sprite[i].height/2;
	    }
	}

	// Start cooldown count
	this.cooldown = 0;
}

Bullet.prototype.update= function(){
	if (this.cooldown < this.cooldownTime) this.cooldown++;

	if (this.bulletType != "normal"){
		// Emmit particles

		for (var i = 0; i < this.emitter.length; i++) {
			this.emitter[i].emitParticle();
		}
	}
}

Bullet.prototype.setCooldown = function(cd){
	this.cooldownTime = cd;
}

Bullet.prototype.setSpread = function(amt){
	this.spread = (amt != 1);

	this.bulletsAmt = amt;
}

Bullet.prototype.setType = function(type){
	this.bulletType = type;
}

Bullet.prototype.setDamage = function(dmg){
	this.damage = dmg;
}

Bullet.prototype.getType = function(){
	return this.bulletType;
}

Bullet.prototype.getDamage = function(){
	return this.damage;
}

Bullet.prototype.collisionGroup = function(){
	return this.group;
}