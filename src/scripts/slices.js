/*


	SLICES

	Slices are thin layers sliced out of the Cube
	composed of 9 Cubelets (3x3 grid).
	The position of these Cubelets can be mapped as follows:


       ----------- ----------- ----------- 
      |           |           |           |
      | northWest |   north   | northEast |
      |     0     |     1     |     2     |
      |           |           |           |
       ----------- ----------- ----------- 
      |           |           |           |
      |    west   |   origin  |    east   |
      |     3     |     4     |     5     |
      |           |           |           |
       ----------- ----------- ----------- 
      |           |           |           |
      | southWest |   south   | southEast |
      |     6     |     7     |     8     |
      |           |           |           |
       ----------- ----------- ----------- 



	The cubelets[] Array is mapped to names for convenience:

	  0  === this.northWest
	  1  === this.north
	  2  === this.northEast
	  3  === this.west
	  4  === this.origin
	  5  === this.east
	  6  === this.southWest
	  7  === this.south
	  8  === this.southEast	



	Portions of Slices can be Grouped:

	Rows and columns as strips (1x3)
	  this.up
	  this.equator
	  this.down
	  this.left
	  this.middle
	  this.right

	Other combinations
	  this.cross
	  this.edges
	  this.ex
	  this.corners
	  this.ring
	  this.dexter
	  this.sinister



	A Slice may be inspected from the browser's JavaScript console with: 

	  this.inspect() 

	This will reveal the Slice's Cubelets, their Indices, and colors. 
	A compact inspection mode is also available:

	  this.inspect( true )

	This is most useful for Slices that are also Faces. For Slices that are
	not Faces, or for special cases, it may be useful to send a side
	argument which is usually by default the Slice's origin's only visible
	side if it has one. 

	  this.inspect( false, 'up' )
	  this.inspect( true, 'up' )



	CUBE FACES vs CUBE SLICES

	All Cube faces are Slices, but not all Slices are Cube faces. 
	For example, a Cube has 6 faces: front, up, right, down, left, back. 
	But it also has slices that that cut through the center of the Cube 
	itself: equator, middle, and standing. When a Slice maps itself it 
	inspects the faces of the Cubelet in the origin position of the Slice -- 
	the center piece -- which can either have a single visible face or no 
	visible face. If it has a visible face then the Slice's face and the 
	face's direction is in the direction of that Cubelet's visible face. 
	This seems redundant from the Cube's perspective:

	  cube.front.face === 'front'

	However it becomes valuable from inside a Slice or Fold when a 
	relationship to the Cube's orientation is not immediately clear:

	  if( this.face === 'front' )...

	Therefore a Slice (s) is also a face if s.face !== undefined.




*/





ERNO.Slice = function( indices, cube ){


	this.axis = new THREE.Vector3();
	this.invertedAxis = new THREE.Vector3();
	this.matrix = new THREE.Matrix4();
	this.axis.rotation = 0;
	this.indices = indices;
	this.neighbour = null;
	this.ableToHideInternalFaces = true;
	this.cube = cube;

	var self = this;

	this.getCubelet = function( index ){
		return cube.cubelets[ indices[ index ]];
	}


	// var displayInternalFaces = function( value ){
	// 	cubelets
	// }




	//	Once we've performed a physical rotaion of a face or group, we need a way to remap the array of cubelets.
	//	This method does just that. Given a subset of cubelets, an axis to rotate on and
	//	an angle, it will shift the location of all cubelets that need changing.

	this.rotateGroupMappingOnAxis = (function(){

		// 	Here we pre-define a few properties.
		//	We'll reuse the, so it's best to define them up front
		//	to avoid allocating new memeory at runtime

		var absAxis = new THREE.Vector3(),
			max 	= new THREE.Vector3( 1.0, 1.0, 1.0 ),
			point 	= new THREE.Vector3(),
			origin 	= new THREE.Vector3(),
			rotation= new THREE.Matrix4(),
			faceArray;


		return function ( angle ){


			// We can only remap the cube if it's in whole rotation,
			// therefore we should round to the nearest full rotation

			angle = Math.round( angle / ( Math.PI * 0.25 ) ) * Math.PI * 0.25 



			absAxis.copy( max );
			absAxis.sub( this.axis );


			var cubletsCopy = cube.cubelets.slice();
			

			//	Get The rotation as a matrix
			rotation.makeRotationAxis( this.axis, angle * -1 );


			var i = indices.length,
					cubelet;



			while( i-- > 0 ){


				// For every cubelet ...
				cubelet = cube.cubelets[ indices[ i ]];


				//	Get it's position and save it for later ...
				point.set( cubelet.addressX, cubelet.addressY, cubelet.addressZ );
				origin.copy( point );
				

				//	Then rotate it about our axis.
				point.multiply( absAxis )
					 .applyMatrix4( rotation );


				//	Flatten out any floating point rounding errors ...
				point.x = Math.round( point.x );
				point.y = Math.round( point.y );
				point.z = Math.round( point.z );


				//	rotate, and perform a mask-like operation.
				point.add( origin.multiply( this.axis ));
				point.add( max );
				

				//	The cublet array is in a funny order, so invert some of the axes of from our new position
				point.y = 2 - point.y;
				point.z = 2 - point.z;



				//	Use the X,Y,Z to get a 3D index
				var address = point.z * 9 + point.y * 3 + point.x;
				cube.cubelets[cubelet.address] = cubletsCopy[address];


			}



			//  Good to let each Cubelet know where it exists
			for( i = 0; i < cube.cubelets.length; i ++ ){
				cube.cubelets[ i ].setAddress( i )
			}



			// 	Remapping the location of the cubelets is all well and good,
			//	but we also need to reorientate each cubelets face so cubelet.front
			//	is always pointing to the front.


			// Get the slices rotation
			rotation.makeRotationAxis( this.axis, angle );

			// For each cubelet..
			this.cubelets.forEach( function( cubelet ){ 

				faceArray = [];

				//	iterate over it's faces.
				cubelet.faces.forEach( function( face, index ){
						
					//	Get it's normal vector
					point.copy( ERNO.Direction.getDirectionByName( face.normal ).normal );
					
					//	Rotate it
					point.applyMatrix4( rotation );
					// console.log( face.normal, ERNO.Controls.getDirectionByNormal( point ).name );

					// and find the index of the new direction and add it to the new array
					faceArray[ ERNO.Direction.getDirectionByNormal( point ).id ] = face;
					face.normal = ERNO.Direction.getDirectionByNormal( point ).name

				});

				// Remap all the face shortcuts
				cubelet.faces  = faceArray.slice();
				cubelet.front  = cubelet.faces[ 0 ];
				cubelet.up     = cubelet.faces[ 1 ];
				cubelet.right  = cubelet.faces[ 2 ];
				cubelet.down   = cubelet.faces[ 3 ];
				cubelet.left   = cubelet.faces[ 4 ];
				cubelet.back   = cubelet.faces[ 5 ];


			})

		};

	}());


	this.map();



}


//  We want Slice to learn from ERNO.Group
// THREE.extend( ERNO.Slice.prototype, ERNO.Group.prototype );
ERNO.Slice.prototype = Object.create( ERNO.Group.prototype );

ERNO.extend( ERNO.Slice.prototype, {


	get origin(){ 	return this.cube.cubelets[ this.indices[ 4 ]]},
	get north(){ 	return this.cube.cubelets[ this.indices[ 1 ]]},
	get northEast(){return this.cube.cubelets[ this.indices[ 2 ]]},
	get east(){		return this.cube.cubelets[ this.indices[ 5 ]]},
	get southEast(){return this.cube.cubelets[ this.indices[ 8 ]]},
	get south(){	return this.cube.cubelets[ this.indices[ 7 ]]},
	get southWest(){return this.cube.cubelets[ this.indices[ 6 ]]},
	get west(){		return this.cube.cubelets[ this.indices[ 3 ]]},
	get northWest(){return this.cube.cubelets[ this.indices[ 0 ]]},


	get cubelets(){

		var array = [],
			l = this.indices.length;

		while( l-- > 0 ){
			array.push( this.getCubelet( l ))
		}

		return array;

	},


	map: function( indices, cubelets ){


		// this.cubelets = cubelets;
		// this.indices  = indices;



		//  Now that we know what the origin Cubelet is 
		//  we can determine if this is merely a Slice
		//  or if it is also a Face.
		//  If a face we'll know what direction it faces
		//  and what the color of the face *should* be. 

		for( var i = 0; i < 6; i ++ ){

			if( this.origin.faces[ i ].color && this.origin.faces[ i ].color !== ERNO.COLORLESS ){

				this.color = this.origin.faces[ i ].color;
				this.face = ERNO.Direction.getNameById( i )
				break
			}
		}


		// 	We also need to calculate what axis this slice rotates on.
		//	For example, the Right Slice (R) would rotate on the axis pointing to the right represented by the axis ( 1, 0, 0 )
		//	similarly the Equator Slice (E) would rotate on the axis pointing straight up ( 0, 1, 0 )
		
		if( this.axis === undefined || this.axis.lengthSq() === 0 ){

			var pointA = this.northEast.position.clone(),
				pointB = this.southWest.position.clone(),
				pointC = this.northWest.position.clone();

			this.axis = new THREE.Vector3().crossVectors( 

				pointB.sub( pointA ),
				pointC.sub( pointA )

			).normalize();

			this.axis.rotation = 0;

		}



		
		//  Addressing orthagonal strips of Cubelets is more easily done by
		//  cube notation for the X and Y axes.
	
		this.up = new ERNO.Group(

			this.northWest, this.north, this.northEast
		)
		this.equator = new ERNO.Group(

			this.west, this.origin, this.east
		)
		this.down = new ERNO.Group(

			this.southWest, this.south, this.southEast
		)
		this.left = new ERNO.Group(

			this.northWest,
			this.west,
			this.southWest
		)
		this.middle = new ERNO.Group(

			this.north,
			this.origin,
			this.south
		)
		this.right = new ERNO.Group(

			this.northEast,
			this.east,
			this.southEast
		)


		//  If our Slice has only one center piece 
		// (ie. a Cubelet with only ONE single Sticker)
		//  then it is a Face -- a special kind of Slice.

		var hasCenter = this.hasType( 'center' )
		if( hasCenter && hasCenter.cubelets.length === 1 ){

			this.center  = this.hasType( 'center' )//.cubelets[ 0 ]
			this.corners = new ERNO.Group( this.hasType( 'corner' ))
			this.cross   = new ERNO.Group( this.center, this.hasType( 'edge' ))				
			this.ex      = new ERNO.Group( this.center, this.hasType( 'corner' ))
		}


		//  Otherwise our Slice will have multiple center pieces
		// (again, that means Cubelets with only ONE single Sticker)
		//  and this is why a Slice's "origin" is NOT the same as
		//  its "center" or "centers!"

		else {

			this.centers = new ERNO.Group( this.hasType( 'center' ))
		}
		this.edges = new ERNO.Group( this.hasType( 'edge' ))			


		//  I'm still debating whether this should be Sticker-related
		//  or if it's merely a fun grouping. 
		//  Writing the solver should clarify this further...

		this.ring = new ERNO.Group(

			this.northWest, this.north, this.northEast,
			this.west, this.east,
			this.southWest, this.south, this.southEast
		)


		//  And finally for the hell of it let's try diagonals via
		//  Blazon notation:

		this.dexter = new ERNO.Group(//  From top-left to bottom-right.

			this.northWest,
			this.origin,
			this.southEast
		)
		this.sinister = new ERNO.Group(//  From top-right to bottom-left.

			this.northEast,
			this.origin,
			this.southWest
		)

		return this;

	},



	//	Using the rotation we can physically rotate all our cubelets.
	//	This can be used to partially of fully rotate a slice.

	set rotation( radians ){


		if( this.ableToHideInternalFaces && this.cube.isFlagged( 'showingIntroverts' ) !== 0 && this.cube.hideInvisibleFaces ){

			var partialRotation = radians % ( Math.PI * 0.5 ) !== 0;

			this.invertedAxis.copy( this.axis ).negate();

			if( partialRotation  ){
				if( this.neighbour ){

					this.showIntroverts( this.axis, true );
				 	this.neighbour.showIntroverts( this.invertedAxis, true );

				 }else{
				 	this.cube.showIntroverts( this.axis, true );
				 	this.cube.showIntroverts( this.invertedAxis, true );
				 }
			} 
			else{
				if( this.neighbour ){

					this.hideIntroverts( null, true );
				 	this.neighbour.hideIntroverts( null, true );

				 }else{
				 	this.cube.hideIntroverts( null, true );
				 }
			} 
		}


		//	Define a delta rotation matrix from the axis and angle
		this.matrix.makeRotationAxis( this.axis, radians );


		this.axis.rotation = radians;


		//	Iterate over the cubelets and update their relative matrices
		var l = this.indices.length,
			cubelet,
			m1 = new THREE.Matrix4();


		while( l-- ){
			
			cubelet = this.getCubelet( l );

			cubelet.matrix.multiplyMatrices( this.matrix, cubelet.matrixSlice );
			cubelet.position.setFromMatrixPosition( cubelet.matrix );
			cubelet.scale.setFromMatrixScale( cubelet.matrix );
			m1.extractRotation( cubelet.matrix );
			cubelet.quaternion.setFromRotationMatrix( m1 );


		}

	},


	get rotation(){
		return this.axis.rotation;
	},




	//  Given a Cubelet in this Slice,
	//  what is its compass location?

	getLocation: function( cubelet ){

		if( cubelet === this.origin    ) return 'origin';
		if( cubelet === this.north     ) return 'north';
		if( cubelet === this.northEast ) return 'northEast';
		if( cubelet === this.east      ) return 'east';
		if( cubelet === this.southEast ) return 'southEast';
		if( cubelet === this.south     ) return 'south';
		if( cubelet === this.southWest ) return 'southWest';
		if( cubelet === this.west      ) return 'west';
		if( cubelet === this.northWest ) return 'northWest';

		return false;
	},
	

	//  cube.slices.front.isSolved( 'front' )
	//  cube.slices.front.up.isSolved( 'up' )

	isSolved: function( face ){

		if( face ){

			var faceColors = {},
				cubelet, color,
				l = this.indices.length,
				numberOfColors = 0;

			if( face instanceof ERNO.Direction ) face = face.name;

			while( l-- > 0 ){

				cubelet = this.getCubelet( l );
				color = cubelet[ face ].color.name;

				if( faceColors[ color ] === undefined ){
					
					faceColors[ color ] = 1;
					numberOfColors ++;
				}
				else faceColors[ color ] ++;
			}

			return numberOfColors === 1 ? true : false;

		}
		else {
		
			console.warn( 'A face [String or ERNO.Controls] argument must be specified when using ERNO.Group.isSolved().' );
			return false;
		}
	},




})
