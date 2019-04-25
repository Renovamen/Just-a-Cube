
ERNO.Controls = (function(){

	//Enum of states
	var STATE = { NONE: -1, ROTATE: 0, INERTIA: 1 };


	// Returns the bounding area of the element
	function getBoundingClientRect( element ){

		var bounds = element !== document ? element.getBoundingClientRect() : {
			left: 0,
			top: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};

	 	return bounds;

	}

	return function ( object, camera, domElement ) {

		var state 		 = STATE.NONE,
			direction  	 = new THREE.Vector2,
			mouse	 	 = new THREE.Vector2(),
			mouseEnd	 = new THREE.Vector2(),
			lastPosition = new THREE.Vector2(),
			projector = new ERNO.Projector( object, domElement ),
			api = {
				enabled: true,
				domElement: domElement,
				rotationSpeed: 4.0,
				damping: 0.25
			};


		var getMouseProjectionOnBall = function( x, y, vector ){

			var view = getBoundingClientRect( api.domElement ),
				aspect = view.height / view.width

			var dpr = window.devicePixelRatio || 1
			x *= dpr
			y *= dpr

			return vector.set(
				( x - view.width - view.left ) * 0.001 , // view.width,// * ( devicePixelRatio || 1 ) ,
				( view.height + view.top - y ) * 0.001 // view.height// * aspect // ( devicePixelRatio || 1 )
			);

		};

		api.update = function(){

			var axis = new THREE.Vector3,
				length = 0.0,
				modelViewInverse = new THREE.Matrix4();

			return function updateClosure () {

				if( api.enabled === false || state === STATE.NONE ) return;


			 	//	define an axis to rotate on, this is basically at a tangent to the direction
				axis.set( direction.y, direction.x * -1, 0 ).normalize();


				//	The axis of rotation needs to be in mode view space, otherwise the rotation
				//	will happen in a really strange way. We therefore need to get the local rotation
				//	of the cube and the relative position of the camera and update our axis.

				modelViewInverse.getInverse( object.matrixWorld );
				modelViewInverse.multiply( camera.matrixWorld );
				axis.transformDirection( modelViewInverse );

				// If we're in a INERTIA state, then apply an inertia like effect
				direction.multiplyScalar( 1.0 - Math.max( 0.0, Math.min( 1.0, api.damping )));


				//	Determine how far we've moved. This to determine how much to rotate by
				length = direction.length();

				
				//	Then we can rotate the cube based on how far the drag occured
				object.object3D.rotateOnAxis( axis, -length * api.rotationSpeed );

				


				//	Reset our internal state
				if( state === STATE.ROTATE ) state = STATE.NONE;


				//	If the rotation is below a certain threshold specified as a factor of the damping effect,
				//	then for all purposes, any more rotation is not noticesable, so we can might aswell stop rotating.
				else if( state === STATE.INERTIA && length >= 0.0001 ){

					mouse.add( direction );
				
				} else {
					state = STATE.NONE
				}

			};

		}();

	
		/**
		 *	Define listeners for user initiated events
		 */

		function mousedown( event ) {


			if ( !api.enabled || event.which !== 1 ) return;


			if( projector.getIntersection( camera, event.pageX, event.pageY ) === null ){

			
				state = STATE.ROTATE;


				direction.multiplyScalar( 0 );
				getMouseProjectionOnBall( event.pageX, event.pageY, mouse );
				lastPosition.copy( mouse );


				api.domElement.removeEventListener( 'mousedown', mousedown );
				document.addEventListener( 'mousemove', mousemove );
				document.addEventListener( 'mouseup', mouseup );

			}

		}

		function mousemove( event ) {


			if ( api.enabled ){

				event.preventDefault();

				state = STATE.ROTATE;

				getMouseProjectionOnBall( event.pageX, event.pageY, mouse );

				//	Get the delta between mouse positions
				direction.subVectors( mouse, lastPosition );
				lastPosition.copy( mouse );
			}	


		}

		function mouseup( event ) {

			document.removeEventListener( 'mousemove', mousemove );
			document.removeEventListener( 'mouseup', mouseup );
			api.domElement.addEventListener( 'mousedown', mousedown );


			if ( api.enabled ){

				state = STATE.INERTIA;
			}

		}


		function touchstart( event ) {

			if ( api.enabled && projector.getIntersection( camera, event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) === null ){

				state = STATE.ROTATE;

				direction.multiplyScalar( 0 );
				getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, mouse );
				lastPosition.copy( mouse );

				api.domElement.removeEventListener( 'touchstart', touchstart );
				document.addEventListener( 'touchend', touchend );
				document.addEventListener( 'touchmove', touchmove );
			}
		}

		function touchmove( event ) {

			if ( api.enabled ){

				// event.preventDefault();

				state = STATE.ROTATE;

				getMouseProjectionOnBall( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY, mouse );

				//	Get the delta between mouse positions
				direction.subVectors( mouse, lastPosition );
				lastPosition.copy( mouse );
			}

		}

		function touchend( event ) {

			document.removeEventListener( 'touchend', touchend );
			document.removeEventListener( 'touchmove', touchmove );
			api.domElement.addEventListener( 'touchstart', touchstart );

			if ( api.enabled ){

				state = STATE.INERTIA;
			}
		}

		

		api.domElement.addEventListener( 'mousedown', mousedown );
		api.domElement.addEventListener( 'touchstart', touchstart );

		return api;
	};

}());
