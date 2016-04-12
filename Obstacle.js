/*
	Obstacle class

	Generates an obstacle
	If all parameters defined, a random obstacle of size between (minWidth x min Height) and (maxWidth x maxHeight) will be generated
	If only 2 parameters are specified, the generated all is going to have the specified size (minWidth X minHeight)
	others exceptions, will generate randomly and assume the values (3, 1, 9, 4) for the constructor

	an obstacle is a matrix of size width x height that keeps numbers from -1 to 4 related to its health points
	it is initialized with 4 (full health)
	-1 means that piece of the wall is "dead"
*/

function Obstacle(minWidth, minHeight, maxWidth, maxHeight){
	// If the two first parameters have a value and the last two are undefined
	// Create a defined size wall. Not Random
	if ((minWidth != undefined && minHeight != undefined) && (maxWidth == undefined && maxHeight == undefined)){
		this.randomSize = false;
	}
	else {
		this.randomSize = true;
	}

	this.minWidth = (minWidth != undefined ? minWidth : 3);
	this.minHeight = (minHeight != undefined ? minHeight : 2);
	
	// If randomSize == true these 2 attributes should not make any difference in execution
	this.maxWidth = (maxWidth != undefined ? maxWidth : 9);
	this.maxHeight = (maxHeight != undefined ? maxHeight : 4);

	this.width;
	this.height;

	this.obstacle = new Array();

}


Obstacle.prototype.create = function (x, y){
	if (this.randomSize){
		this.width = randomNumber(this.minWidth, this.maxWidth);
		this.height = randomNumber(this.minHeight, this.maxHeight);
	}
	else {
		this.width = this.minWidth;
		this.height = this.minHeight;
	}

	for (var i = 0; i < this.width; i++) {
		this.obstacle[i] = new Array();
		for (var j = 0; j < this.height; j++) {
			this.obstacle[i][j] = obstacleCollisionGroup.create((i*32+x), (j*32+y), 'wall');
			// Setting health
			this.obstacle[i][j].health = 4;
			this.obstacle[i][j].frame = this.obstacle[i][j].health;
			// Set immovable to stay after collision
			this.obstacle[i][j].body.immovable = true;
			this.obstacle[i][j].body.moves = false;

		}
	}

	// console.log(this.obstacle);
}

