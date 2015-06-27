var Dice=function() {
	//the format of dice parameter can be a number of dice to roll or XdY 
	this.roll = function(dice) {
		var match, dice_to_roll=1, dice_sides=this.sides, results=[];
		var instance=this;

		if( typeof dice === typeof 'string' ) {
			match=dice.match(/([\d]+)d([\d]+)/);
			if( match ) {
				dice_to_roll=match[1];
				this.sides=match[2];
			} else {
				dice_to_roll=parseInt(dice);
			}
		} else if( typeof dice === typeof 0 ) {
			dice_to_roll=dice;
		}

		if( isNaN(dice_to_roll) )
			throw new Error("invalid parameter");

		while( dice_to_roll > 0 ) {
			results.push( Math.floor( (Math.random()*100)%this.sides )+1 );
			dice_to_roll--;
		}

		// private functions to calculate the sum, min, and max
		function calculateSum() {
			instance.sum=0;
			debug(instance.results);
			for( result in instance.results ) {
				debug(instance.results[result]);
				instance.sum+=instance.results[result];
			}
		}

		function calculateMin() {
			var min=0;

			for( result in instance.results ) {
				if( instance.results[result] < instance.results[min] ) min=result;
			}
			instance.min=instance.results[min];
		}

		function calculateMax() {
			var max=0;
			for( result in instance.results ) {
				if( instance.results[result] > instance.results[max] ) max=result;
			}
			instance.max=instance.results[max];
		}

		this.results=results;
		calculateSum();
		calculateMin();
		calculateMax();

		this.dropLowest = function() {
			//find the lowest result and remove it
			var lowest=0;
			for( result in this.results ) {
				if( this.results[result] < this.results[lowest] ) lowest=result;
			}
			this.results.splice(lowest, 1);
			calculateSum();
			calculateMin();
			calculateMax();
			return this;
		};

		this.explode = function() {
			//every die in the result set that equals the maximum possible value, gets rerolled
			var newDie=this.sides;
			for( result in this.results ) {
				if( this.results[result] == this.sides ) {
					//reroll and increment
					while( newDie == this.sides ) {
						newDie=Math.floor( (Math.random()*100)%this.sides )+1;
						this.results[result]+=newDie;				
					}
					newDie=this.sides;
				}
			}
			calculateSum();
			calculateMin();
			calculateMax();
			return this;
		};

		this.sort = function() {
			this.results.sort(function(a,b) { return a-b; });
			return this;
		};

		return this;
	};
};

function D(sides) {
	if( typeof sides == typeof undefined )
		sides=6;
	this.sides=sides;	
}
Dice.call(D.prototype);

module.exports=D;