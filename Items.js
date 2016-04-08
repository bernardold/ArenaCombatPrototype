/*
Items class

*/

function Items(){
	// Health Potion stuff
	this.healthPotions = 5;
	this.heal = 25;
	this.healCooldown = 100;
	this.healCDcheck = 0;
}

Items.prototype.checkItems = function(){
	if (player.alive() && this.healthPotions > 0 && this.healCDcheck == this.healCooldown){
		// Regen HP
		if (game.input.keyboard.isDown(Phaser.Keyboard.W)){
			player.heal(this.heal);
			this.healthPotions--;
			this.healCDcheck = 0;
		}
	}

	if (this.healCDcheck < this.healCooldown) this.healCDcheck++;
}