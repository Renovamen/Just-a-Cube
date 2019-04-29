/*


	PROJECTOR

	Converts mouse coordinates into 3D and detects mouse interaction

	--

	@author Mark Lundin - http://www.mark-lundin.com


*/









ERNO.Projector = (function(){
	


	//	The Cube Projector is a specialised class that detects mouse interaction.
	//	It's designed specifically for cubic geometry, in that it makes assumptions
	//  that cannot be applied to other 3D geometry. This makes the performance faster
	//  than other more generalised mouse picking techniques.


	return function( cube, domElement ){


		var api,
			screen,
			viewProjectionMatrix = new THREE.Matrix4(),
			inverseMatrix = new THREE.Matrix4(),
			mouse 	= new THREE.Vector3(),
			end 	= new THREE.Vector3( 1, 1, 1 ),
			normal 	= new THREE.Vector3(),
			ray 	= new THREE.Ray(), 
			box 	= new THREE.Box3(),
			sphere  = new THREE.Sphere(),
			projectionMatrixInverse = new THREE.Matrix4(),
			unitCubeBoundingRadius = mouse.distanceTo( end );



		//	Configure the bounding spehere and Axis Aligned Bounding Box dimensions.
		box.min.set( -cube.size*0.5, -cube.size*0.5, -cube.size*0.5 );
		box.max.set(  cube.size*0.5,  cube.size*0.5,  cube.size*0.5 );
		sphere.radius = unitCubeBoundingRadius * cube.size * 0.5;



		//	Utility function that unprojects 2D normalised screen coordinate to 3D.
		//	Taken from Three.js Projector class	

		function unprojectVector( vector, camera ) {

			projectionMatrixInverse.getInverse( camera.projectionMatrix );
			viewProjectionMatrix.multiplyMatrices( camera.matrixWorld, projectionMatrixInverse );
			return vector.applyProjection( viewProjectionMatrix );

		}


		// Returns the bounding area of the element
		function getBoundingClientRect( element ){
			
			var bounds = element !== document ? element.getBoundingClientRect() : {
				left: 0,
				top: 0,
				width: window.innerWidth,
				height: window.innerHeight
			};

			if( element !== document ){
				var d = element.ownerDocument.documentElement;
		 		bounds.left += window.pageXOffset - d.clientLeft;
		 		bounds.top  += window.pageYOffset - d.clientTop;
		 	}

		 	return bounds;

		}


		/*
		 *	Returns a THREE.Ray instance in cube space!
		 */
		function setRay( camera, mouseX, mouseY ){


			//	Get the bounding area
			screen = getBoundingClientRect( domElement );

			//	Convert screen coords indo normalized device coordinate space
			mouse.x = ( mouseX - screen.left ) / screen.width * 2 - 1;
			mouse.y = ( mouseY - screen.top  ) / screen.height * -2 + 1;
			mouse.z = -1.0;

			// set two vectors with opposing z values
			end.set( mouse.x, mouse.y, 1.0 );


			//	Unproject screen coordinates into 3D
			unprojectVector( mouse, camera );
			unprojectVector( end, camera );


			// find direction from vector to end
			end.sub( mouse ).normalize();


			//	Configure the ray caster
			ray.set( mouse, end );


			//	Apply the world inverse
			inverseMatrix.getInverse( cube.matrixWorld );  
			ray.applyMatrix4( inverseMatrix );


			return ray;


		}


		/*
		 *	Given an intersection point on the surface of the cube,
		 * 	this returns a vector indicating the normal of the face
		 */

		 function getFaceNormalForIntersection ( intersection, optionalTarget ){


			var target = optionalTarget || new THREE.Vector3();

			target.copy( intersection )
				.set( Math.round( target.x ), Math.round( target.y ), Math.round( target.z ))
			  	.multiplyScalar( 2 / cube.size )
			  	.set( target.x|0, target.y|0, target.z|0 );

			return normal;


		}


		/*
		 *	Given a three.js camera instance and a 2D mouse coordinates local to the domElement,
		 * 	this method tests for any intersection against the cube
		 *	and returns a cubelet if one is found, otherwise it returns null indicating no intersection.
		 */


		api = {

			getIntersection: function( camera, mouseX, mouseY, optionalIntersectionTarget, optionalPlaneTarget ){


				var intersection = optionalIntersectionTarget || new THREE.Vector3();


				//	If we haven't detected any mouse movement, then we've not made interacted!

				if( mouseX === null || mouseY === null ) return null;


				//	Shoot the camera ray into 3D

				setRay( camera, mouseX, mouseY );


				//	Check ray casting against the bounding sphere first as it's easier to compute, 
				//	if it passes, then check the Axis Aligned Bounding Box.
				
				if( ray.isIntersectionSphere( sphere ) &&
					ray.intersectBox( box, intersection ) !== null ){

					if( optionalPlaneTarget ){
						getFaceNormalForIntersection( intersection, normal );
						optionalPlaneTarget.setFromNormalAndCoplanarPoint( normal, intersection );		
					}			

					return intersection;

				}

				return null;

			},

			getIntersectionOnPlane: function( camera, mouseX, mouseY, plane, optionalTarget ){

				//	If we haven't detected any mouse movement, then we've not interacted!
				if( mouseX === null || mouseY === null ) return null;


				//	Shoot the camera ray into 3D
				setRay( camera, mouseX, mouseY );


				return ray.intersectPlane( plane, optionalTarget );
					
			},

			// Given 
			getCubeletAtIntersection : (function(){

				var tmp = new THREE.Vector3();

				return function( intersection ){

					//	Translate the world coordinates to a 3D index of the intersected cubelets location.

					tmp.copy( intersection ).add( box.max )
						.multiplyScalar( 3 / cube.size )
						.set( Math.min( tmp.x|0, 2 ), Math.min( 3 - tmp.y|0, 2 ), Math.min( 3 - tmp.z|0, 2 ));
					

					//	Translate the 3D position to an array index
					return cube.cubelets[ tmp.z * 9 + tmp.y * 3 + tmp.x ];


				};

			}())

		};

		return api;
	};


}());