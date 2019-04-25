/*


	DIRECTIONS

	We have six Directions which we map in a spiral around a cube: front, up,
	right, down, left, and back. That's nice on its own but what's important 
	is the relationships between faces. For example, What's to the left of the
	Front face? Well that depends on what the Front face considers "up" to 
	be. The ERNO.Controls class handles these relationships and calculates clock-
	wise and anticlockwise relationships.


	                 ------------- 
	                |             |
	                |      0      |   opposite
	                |             |
	                |    getUp()  |
	                |             |
	   ------------- ------------- ------------- 
	  |             |             |             |
	  |      3      |             |      1      |
	  |             |             |             |
	  |  getLeft()  |    this     |  getRight() |
	  |             |             |             |
	   ------------- ------------- ------------- 
	                |             |
	                |      2      |
	                |             |
	                |  getDown()  |
	                |             |
	                 ------------- 


	The following equalities demonstrate how Directions operate:

	  FRONT.getOpposite().name === 'back'
	  FRONT.getUp().name === 'up'
	  FRONT.getUp( LEFT ).name === 'left'
	  FRONT.getRight().name === 'right'
	  FRONT.getRight( DOWN ).name === 'left'
	  FRONT.getClockwise().name === 'right'
	  FRONT.getClockwise( RIGHT ).name === 'down'

	  RIGHT.getOpposite().name === 'left'
	  RIGHT.getUp().name === 'up'
	  RIGHT.getUp( FRONT ).name === 'front'
	  RIGHT.getRight().name === 'back'
	  RIGHT.getRight( DOWN ).name === 'front'
	  RIGHT.getClockwise().name === 'back'
	  RIGHT.getClockwise( FRONT ).name === 'up'


	Keep in mind that a direction cannot use itself or its opposite as the
	normalized up vector when seeking a direction!

	  RIGHT.getUp( RIGHT ) === null
	  RIGHT.getUp( LEFT  ) === null


	--

	@author Mark Lundin - http://www.mark-lundin.com
	@author Stewart Smith


*/








ERNO.Direction = function( id, name, normal ){

	this.id        = id;
	this.name      = name.toLowerCase();
	this.normal    = normal;
	this.initial   = name.substr( 0, 1 ).toUpperCase();
	this.neighbors = [];
	this.opposite  = null;
}
ERNO.Direction.prototype.setRelationships = function( up, right, down, left, opposite ){

	this.neighbors = [ up, right, down, left ];
	this.opposite  = opposite;
};




ERNO.Direction.getNameById = function( id ){

	return [

		'front',
		'up',
		'right',
		'down',
		'left',
		'back'

	][ id ];
};
ERNO.Direction.getIdByName = function( name ){

	return {

		front: 0,
		up   : 1,
		right: 2,
		down : 3,
		left : 4,
		back : 5

	}[ name ];
};
ERNO.Direction.getDirectionById = function( id ){

	return [

		ERNO.Direction.FRONT,
		ERNO.Direction.UP,
		ERNO.Direction.RIGHT,
		ERNO.Direction.DOWN,
		ERNO.Direction.LEFT,
		ERNO.Direction.BACK

	][ id ];
};
ERNO.Direction.getDirectionByInitial = function( initial ){

	return {

		F: ERNO.Direction.FRONT,
		U: ERNO.Direction.UP,
		R: ERNO.Direction.RIGHT,
		D: ERNO.Direction.DOWN,
		L: ERNO.Direction.LEFT,
		B: ERNO.Direction.BACK

	}[ initial.toUpperCase() ];
}
ERNO.Direction.getDirectionByName = function( name ){

	return {

		front: ERNO.Direction.FRONT,
		up   : ERNO.Direction.UP,
		right: ERNO.Direction.RIGHT,
		down : ERNO.Direction.DOWN,
		left : ERNO.Direction.LEFT,
		back : ERNO.Direction.BACK

	}[ name.toLowerCase() ]
}
ERNO.Direction.getDirectionByNormal = function(){

	var vector  = new THREE.Vector3();

	return function ( normal ){

		//	Flatten out any floating point rounding errors ...
		vector.x = Math.round( normal.x );
		vector.y = Math.round( normal.y );
		vector.z = Math.round( normal.z );

		return  vector.equals( ERNO.Direction.FRONT.normal 	) ? ERNO.Direction.FRONT :
				vector.equals( ERNO.Direction.BACK.normal  	) ? ERNO.Direction.BACK  :
				vector.equals( ERNO.Direction.UP.normal 	) ? ERNO.Direction.UP    :
				vector.equals( ERNO.Direction.DOWN.normal 	) ? ERNO.Direction.DOWN  :
				vector.equals( ERNO.Direction.LEFT.normal 	) ? ERNO.Direction.LEFT  :
				vector.equals( ERNO.Direction.RIGHT.normal 	) ? ERNO.Direction.RIGHT :
				null;
	}

}()




//  If we're looking at a particular face 
//  and we designate an adjacet side as up
//  then we can calculate what adjacent side would appear to be up
//  if we rotated clockwise or anticlockwise.

ERNO.Direction.prototype.getRotation = function( vector, from, steps ){

	if( from === undefined ) from = this.neighbors[ 0 ]
	if( from === this || from === this.opposite ) return null
	steps = steps === undefined ? 1 : steps.modulo( 4 )
	for( var i = 0; i < 5; i ++ ){

		if( this.neighbors[ i ] === from ) break
	}
	return this.neighbors[ i.add( steps * vector ).modulo( 4 )];
}
ERNO.Direction.prototype.getClockwise = function( from, steps ){

	return this.getRotation( +1, from, steps );
}
ERNO.Direction.prototype.getAnticlockwise = function( from, steps ){

	return this.getRotation( -1, from, steps );
}


//  Similar to above,
//  if we're looking at a particular face 
//  and we designate an adjacet side as up
//  we can state what sides appear to be to the up, right, down, and left
//  of this face.

ERNO.Direction.prototype.getDirection = function( direction, up ){

	return this.getRotation( 1, up, direction.id - 1 );
}
ERNO.Direction.prototype.getUp = function( up ){

	return this.getDirection( ERNO.Direction.UP, up );
}
ERNO.Direction.prototype.getRight = function( up ){

	return this.getDirection( ERNO.Direction.RIGHT, up );
}
ERNO.Direction.prototype.getDown = function( up ){

	return this.getDirection( ERNO.Direction.DOWN, up );
}
ERNO.Direction.prototype.getLeft = function( up ){

	return this.getDirection( ERNO.Direction.LEFT, up );
}



//  An convenience method that mimics the verbiage
//  of the getRotation() and getDirection() methods.

ERNO.Direction.prototype.getOpposite = function(){

	return this.opposite;
}




//  Create facing directions as global constants this way we can access from 
//  anywhere in any scope without big long variables names full of dots and 
//  stuff. Sure, ES5 doesn't really have constants but the all-caps alerts you
//	to the fact that them thar variables ought not to be messed with.


ERNO.Direction.FRONT = new ERNO.Direction( 0, 'front', new THREE.Vector3(  0,  0,  1 ));
ERNO.Direction.UP    = new ERNO.Direction( 1, 'up'   , new THREE.Vector3(  0,  1,  0 ));
ERNO.Direction.RIGHT = new ERNO.Direction( 2, 'right', new THREE.Vector3(  1,  0,  0 ));
ERNO.Direction.DOWN  = new ERNO.Direction( 3, 'down' , new THREE.Vector3(  0, -1,  0 ));
ERNO.Direction.LEFT  = new ERNO.Direction( 4, 'left' , new THREE.Vector3( -1,  0,  0 ));
ERNO.Direction.BACK  = new ERNO.Direction( 5, 'back' , new THREE.Vector3(  0,  0, -1 ));


//  Now that they all exist we can 
//  establish their relationships to one another.

ERNO.Direction.FRONT.setRelationships( ERNO.Direction.UP,    ERNO.Direction.RIGHT, ERNO.Direction.DOWN,  ERNO.Direction.LEFT,  ERNO.Direction.BACK  );
ERNO.Direction.UP.setRelationships(    ERNO.Direction.BACK,  ERNO.Direction.RIGHT, ERNO.Direction.FRONT, ERNO.Direction.LEFT,  ERNO.Direction.DOWN  );
ERNO.Direction.RIGHT.setRelationships( ERNO.Direction.UP,    ERNO.Direction.BACK,  ERNO.Direction.DOWN,  ERNO.Direction.FRONT, ERNO.Direction.LEFT  );
ERNO.Direction.DOWN.setRelationships(  ERNO.Direction.FRONT, ERNO.Direction.RIGHT, ERNO.Direction.BACK,  ERNO.Direction.LEFT,  ERNO.Direction.UP    );
ERNO.Direction.LEFT.setRelationships(  ERNO.Direction.UP,    ERNO.Direction.FRONT, ERNO.Direction.DOWN,  ERNO.Direction.BACK,  ERNO.Direction.RIGHT );
ERNO.Direction.BACK.setRelationships(  ERNO.Direction.UP,    ERNO.Direction.LEFT,  ERNO.Direction.DOWN,  ERNO.Direction.RIGHT, ERNO.Direction.FRONT );



