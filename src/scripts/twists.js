/*



	TWISTS

	Why have twist validation code in multiple places when we can create a
	Twist class here for all?

	--

	@author Mark Lundin - http://www.mark-lundin.com
	@author Stewart Smith


*/








ERNO.Twist = function( command, degrees ){

	if( command ) this.set( command, degrees )

}


ERNO.Twist.prototype.set = function( command, degrees ){


	//  What group of Cubelets do we intend to twist?

	var group = {

		X: 'Cube on X',
		L: 'Left face',
		M: 'Middle slice',
		R: 'Right face',

		Y: 'Cube on Y',
		U: 'Up face',
		E: 'Equator slice',
		D: 'Down face',

		Z: 'Cube on Z',
		F: 'Front face',
		S: 'Standing slice',
		B: 'Back face'

	}[ command.toUpperCase() ];


	//  If we've received a valid twist group to operate on
	//  then we can proceed. Otherwise return false!

	if( group !== undefined ){


		//  If our degrees of rotation are negative
		//  then we need to invert the twist direction
		// (ie. change clockwise to anticlockwise)
		//  and take the absolute value of the degrees.
		//  Remember, it's ok to have degrees === undefined
		//  which will peg to the nearest degrees % 90 === 0.

		if( degrees != undefined && degrees < 0 ){

			command = command.invert();
			degrees = degrees.absolute();
		}


		//  Now let's note the absolute direction of the rotation
		//  as both a number and in English.

		var
		vector =  0,
		wise   = 'unwise';

		if( command === command.toUpperCase() ){

			vector =  1;
			wise   = 'clockwise';
		}
		else if( command === command.toLowerCase() ){

			vector = -1;
			wise   = 'anticlockwise';
		}



		//  Finally we're ready to package up all the relevant information
		//  about this particular twist.
		//  The constructor will return it of course.

		this.command 	= command; //  Twist command;
		this.group   	= group;   //  Description in English;
		this.degrees 	= degrees; //  Relative degrees (undefined is ok!);
		this.vector  	= vector;  //  Absolute degree polarity;
		this.wise    	= wise;    //  Absolute clock direction in English;
		this.isShuffle 	= false;
	

		//  Best to leave this as a function rather than a property.
		//  I mean... imagine call this constructor if it tried to call itself!
		//  Infinite loopage mess.

		this.getInverse = function(){

			return new ERNO.Twist( command.invert(), degrees );
		};
	}
	else return false;
}


ERNO.Twist.prototype.equals = function( twist ){

	return ( this.command === twist.command && this.degrees === twist.degrees );

}

ERNO.Twist.prototype.copy = function( twist ){

	this.command 	= twist.command; //  Twist command;
	this.group   	= twist.group;   //  Description in English;
	this.degrees 	= twist.degrees; //  Relative degrees (undefined is ok!);
	this.vector  	= twist.vector;  //  Absolute degree polarity;
	this.wise    	= twist.wise;    //  Absolute clock direction in English;
	this.isShuffle 	= twist.isShuffle;

	return this;

}


ERNO.Twist.validate = function(){

	var 
	elements = Array.prototype.slice.call( arguments ),
	element, i, lookAhead,
	pattern, matches, match, m, head, foot;

	for( i = 0; i < elements.length; i ++ ){

		element = elements[ i ];
		if( i + 1 < elements.length ) lookAhead = elements[ i + 1 ];
		else lookAhead = undefined;


		if( element instanceof ERNO.Twist ){


			//  Example usage: 
			//  cube.twist( new ERNO.Twist( 'U' ))
			//  cube.twist( new ERNO.Twist( 'U', -17 ))
			//  AWESOME. Nothing to do here.
		}
		else if( typeof element === 'string' ){

			if( element.length === 1 ){


				//  Example usage: 
				//  cube.twist( 'U' )
				//  cube.twist( 'U', 45 )

				if( typeof lookAhead === 'number' ){

					 elements[ i ] = new ERNO.Twist( element, lookAhead );
				}
				else elements[ i ] = new ERNO.Twist( element );

			}
			else if( element.length > 1 ){


				//  Example usage: 
				//  cube.twist( 'UdrLf' )
				//  cube.twist( 'Udr10Lf-30b' )
				
				pattern = /(-?\d+|[XLMRYUEDZFSB])/gi;
				matches = element.match( pattern );
				for( m = 0; m < matches.length; m ++ ){

					match = matches[ m ];
					if( _.isNumeric( match )) matches[ m ] = +match;
					else {

						head    = matches.slice( 0, m );
						foot    = matches.slice( m + 1 );
						match   = match.split( '' );
						matches = head.concat( match, foot );
					}
				}
				head = elements.slice( 0, i );
				foot = elements.slice( i + 1 );
				elements = head.concat( matches, foot );
				i --//  Send it through the loop again to avoid duplicating logic.
			}
		}
		else if( element instanceof ERNO.Direction ){


			//  Example usage: 
			//  cube.twist( ERNO.Direction.FRONT )

			elements[ i ] = element.initial;
			i --//  Send it through the loop again to avoid duplicating logic.;
		}
		else if( element instanceof Array ){


			//  Example usage: 
			//  cube.twist([ ? ])

			head = elements.slice( 0, i );
			foot = elements.slice( i + 1 );
			elements = head.concat( element, foot );
			i --//  Send it through the loop again to avoid duplicating logic.;
		}
		else {


			//  Whatever this element is, we don't recognize it.
			//  (Could be a Number that we're discarding on purpose.)

			elements.splice( i, 1 );
			i --//  Send it through the loop again to avoid duplicating logic.;
		}
	}
	return elements;
};



