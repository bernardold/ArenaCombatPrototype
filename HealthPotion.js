/*
Health Potion class

*/

function HealthPotion(amt, heal, cd){
	// Health Potion stuff
	this.amt = amt;
	this.heal = heal;
	this.cooldown = cd;
	this.cdCheck = 0;
}

HealthPotion.prototype.update = function(){
	if (player.alive() && this.amt > 0 && this.cdCheck == this.cooldown){
		// Regen HP
		if (game.input.keyboard.isDown(Phaser.Keyboard.W)){
			player.heal(this.heal);
			this.amt--;
			this.cdCheck = 0;
		}
	}

	if (this.cdCheck < this.cooldown) this.cdCheck++;
}