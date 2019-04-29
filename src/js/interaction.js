/*


	INTERACTION

	This module handles all the user interactions with the cube.
	It figures out what slice to rotate and in what direction

	--

	@author Mark Lundin - http://www.mark-lundin.com
	@author Stewart Smith


*/

ERNO.Interaction = (function(){

	return function( cube, camera, domElement, dragSpeed, multiDrag ){


		

		
		//	A utility class for calculating mouse intersection on a cubic surface
		var projector = new ERNO.Projector( cube, domElement );

		var intersected, points = [],
			intersection = new THREE.Vector3(),
			cubelet, possibleSlices,
			slice, mouseX, mouseY,

			pointOnPlane = new THREE.Vector3(),
			axisDefined = false,
			plane 	= new THREE.Plane(),
			direction = new THREE.Vector3(),
			cross = new THREE.Vector3(),
			current = new THREE.Vector2(),
			basis = new THREE.Vector3(),
			axis  = new THREE.Vector3(),
			angle = 0, time = 0;


		current.x = undefined;
		current.y = undefined;



		// API


		var api = {


			//	A boolean indicating when the user is interacting
			active: false,


			//	A boolean that turns on/off the api
			enabled: true,


			//	A boolean flag that, when enabled, allows the user to drag a slice on it's other axis
			multiDrag : multiDrag || false,


			//	A boolean flag that, when enabled, allows the user to drag a slice on it's other axis
			multiDragSnapArea: 100.0,


			//	This sets the default drag speed.
			dragSpeed : dragSpeed || 1.3

		}

		// Apply event skills to the api
		THREE.EventDispatcher.prototype.apply( api );




		api.getIntersectionAt = (function(){

			var intersection3D = new THREE.Vector3(),
				plane3D = new THREE.Plane();

			return function( x, y ){
				
				if( projector.getIntersection( camera, x, y, intersection3D, plane3D ) === null ) return null;
				
				return {
					cubelet: projector.getCubeletAtIntersection( intersection3D ),
					face: 	plane3D.normal.x ===  1 ? "RIGHT" :
							plane3D.normal.x === -1 ? "LEFT"  :
							plane3D.normal.y ===  1 ? "UP"   :
							plane3D.normal.y === -1 ? "DOWN"  :
							plane3D.normal.z ===  1 ? "FRONT" :
							"BACK"
				}


			}	

		}())


		var projectVector = function(){

			var viewProjectionMatrix = new THREE.Matrix4();

			return function( vector, camera ) {

				camera.matrixWorldInverse.getInverse( camera.matrixWorld );

				viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

				return vector.applyProjection( viewProjectionMatrix );

			}

		}

		//	This function provides a way to 'snap' a vector to it's closest axis.
		//	This is used to find a probable axis of rotation when a user performs a drag

		function snapVectorToBasis( vector ){


			var max = Math.max( Math.abs( vector.x ), Math.abs( vector.y ), Math.abs( vector.z ));

			vector.x = ( vector.x / max )|0;
			vector.y = vector.x === 1 ? 0 : ( vector.y / max )|0;
			vector.z = vector.x === 1 || vector.y === 1 ? 0 : ( vector.z / max )|0; 

			return vector;
		}


		api.update = function (){


			var x = current.x,
				y = current.y


			if( api.enabled && api.active && x !== undefined && y != undefined && ( mouseX !== x || mouseY !== y )) {


				//	As we already know what plane, or face, the interaction began on,
				//	we can then find the point on the plane where the interaction continues.

				projector.getIntersectionOnPlane( camera, x, y, plane, pointOnPlane );


				direction.subVectors( pointOnPlane, intersection );


		    	if( !axisDefined && direction.length() > 5 /*|| ( api.multiDrag && direction.length() < api.multiDragSnapArea ) */ ){


		    		//	If we've already been rotating a slice but we want to change direction, 
		    		//	for example if multiDrag is enabled, then we want to reset the original slice

		    		if( slice ) slice.rotation = 0;


					axisDefined = true;

					//	Once we have a plane, we can figure out what direction the user dragged
					//	and lock into an axis of rotation

					axis.crossVectors( plane.normal, direction );


					//	Of course, it's never a perfect gesture, so we should figure 
					//	out the intended direction by snapping to the nearest axis.

					snapVectorToBasis( axis );


					//	From the axis aligned vector, we can isolate the correct slice
					//	to rotate, by determining the index from the possible slices.
					slice = possibleSlices[ Math.abs( axis.z * 3 + axis.y * 2 + axis.x ) - 1 ];


					// Determine the cross vector, or the direction relative to the axis we're rotating
					cross.crossVectors( slice.axis, plane.normal ).normalize();


				} 

				if( axisDefined ){

					//	By now, we already know what axis to rotate on,
					//	we just need to figure out by how much.

					direction.subVectors( pointOnPlane, intersection );
					var dot = cross.dot( direction );

					angle = dot / cube.size * api.dragSpeed;

				}

				
				if( slice ) slice.rotation = angle;


			}

		}


		function onInteractStart( event ){


			if( api.enabled && event.button !== 2 ){


				mouseX = ( event.touches && event.touches[0] || event ).clientX
				mouseY = ( event.touches && event.touches[0] || event ).clientY
				// console.log( mouseX, mouseY );

				//	Here we find out if the mouse is hovering over the cube,
				//	If it is, then `intersection` is populated with the 3D local coordinates of where
				//	the intersection occured. `plane` is also configured to represent the face of the cube
				//	where the intersection occured. This is used later to determine the direction
				//	of the drag.

				//	( Note: although a plane is conceptually similar to a cube's face, the plane is a mathematical representation )


				if( intersected = projector.getIntersection( camera, mouseX, mouseY, intersection, plane ) ){


					//	If a interaction happens within the cube we should prevent the event bubbling.
					if( event.touches !== null ) event.preventDefault()
					// event.stopImmediatePropagation();


					if( cube.isTweening() === 0 ){


						time = ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() )


						api.active = true;


						//	Now we know the point of intersection, we can figure out what the associated cubelet is ...

						cubelet = projector.getCubeletAtIntersection( intersection );


						//	... and the possible slices that might be rotated. Remeber, we can only figure out the exact slice once a drag happens.
						possibleSlices 	= [ cube.slices[ cubelet.addressX + 1 ], cube.slices[ cubelet.addressY + 4 ], cube.slices[ cubelet.addressZ + 7 ]];


						//	Add a listener for interaction in the entire document. 
						domElement.addEventListener( 'mousemove', onInteractUpdate );
						domElement.addEventListener( 'touchmove', onInteractUpdate );
						

						//	Add a lister to detect the end of interaction, remember this could happen outside the domElement, but still within the document
						domElement.addEventListener( 'mouseup', onInteractEnd );
						domElement.addEventListener( 'touchcancel', onInteractEnd );
						domElement.addEventListener( 'touchend', onInteractEnd );


						//	Whilst interacting we can temporarily remove the listeners detecting the start of interaction
						domElement.removeEventListener( 'mousedown', onInteractStart );
						domElement.removeEventListener( 'touchstart', onInteractStart );

					}


				}

			}
			

		}


		function onInteractUpdate( event ){


			if( api.active ){

				current.x = ( event.touches && event.touches[0] || event ).clientX,
				current.y = ( event.touches && event.touches[0] || event ).clientY;
			}

			// Prevent the default system dragging behaviour. ( Things like IOS move the viewport )
			if( api.enabled ){
				
				event.preventDefault();
				event.stopImmediatePropagation();
			}
			

		}

		
		function onInteractEnd( event ){


			var x = ( event.touches && event.touches[0] || event ).clientX,
				y = ( event.touches && event.touches[0] || event ).clientY;


			api.active = false;
		

			//	When a user has finished interating, we need to finish off any rotation.
			//	We basically snap to the nearest face and issue a rotation command

			if( api.enabled && ( x !== mouseY || y !== mouseY ) && axisDefined ){


				if( event.touches !== null ) event.preventDefault();
				// event.stopImmediatePropagation();


				//	Now we can get the direction of rotation and the associated command.

				var command =  slice.name[0].toUpperCase();


				// 	We then find the nearest rotation to snap to and calculate how long the rotation should take
				//	based on the distance between our current rotation and the target rotation


				var targetAngle = Math.round( angle / Math.PI * 0.5 * 4.0 ) * Math.PI * 0.5;

				var velocityOfInteraction =  direction.length() / ( ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() ) - time );
				
				if( velocityOfInteraction > 0.3 ){
					
					targetAngle = Math.floor( angle / Math.PI * 0.5 * 4.0 ) * Math.PI * 0.5
					targetAngle += cross.dot( direction.normalize() ) > 0 ? Math.PI * 0.5: 0;	

				}



				// 	If this is a partial rotation that results in the same configuration of cubelets
				//	then it doesn't really count as a move, and we don't need to add it to the history		

				cube.twist( new ERNO.Twist( command, targetAngle.radiansToDegrees() ));


				// Delete the reference to our slice

				
			}


			time = 0;
			current.x = undefined;
			current.y = undefined;
			axisDefined = false;
			slice = null;

			domElement.removeEventListener( 'mousemove', onInteractUpdate );
			domElement.removeEventListener( 'touchmove', onInteractUpdate );


			domElement.removeEventListener( 'mouseup', onInteractEnd );
			domElement.removeEventListener( 'touchend', onInteractEnd );
			domElement.removeEventListener( 'touchcancel', onInteractEnd );


			domElement.addEventListener( 'mousedown', onInteractStart );
			domElement.addEventListener( 'touchstart', onInteractStart );

		}

		domElement.addEventListener( 'mousedown', onInteractStart );
		domElement.addEventListener( 'touchstart', onInteractStart );


		// CLICK DETECTION 

		var detectInteraction = function ( x, y ){
		
			var intersection = this.getIntersectionAt( x, y );
			if( intersection ){
				this.dispatchEvent( new CustomEvent("click", { detail: intersection  }));
				return true;
			}
			return false;
		}.bind( api )


		var ax, ay;
		domElement.addEventListener( 'mousedown', function( event ){

			ax = event.clientX;
			ay = event.clientY;

		});


		domElement.addEventListener( 'mouseup', function( event ){

			var bx = event.clientX,
				by = event.clientY;
				
			if( !axisDefined && Math.abs( Math.sqrt(((bx-ax)*(bx-ax))+((by-ay)*(by-ay)))) < 10 * ( window.devicePixelratio || 1 )){

				detectInteraction( ax, ay );
			}
		})


		
		
		domElement.addEventListener( 'touchstart', function( event ){

			// event.preventDefault();

			ax = event.touches[0].clientX,
			ay = event.touches[0].clientY;

		});


		domElement.addEventListener( 'touchend', function( event ){

			

			var bx = event.changedTouches[0].clientX,
				by = event.changedTouches[0].clientY;
				
			if( !axisDefined && Math.abs( Math.sqrt(((bx-ax)*(bx-ax))+((by-ay)*(by-ay)))) < 10 * ( window.devicePixelratio || 1 )){

				if( detectInteraction( ax, ay )){
					event.preventDefault();
				}
			}
		})


		return api;

	};
	
}());