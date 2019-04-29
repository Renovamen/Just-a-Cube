

//	This is a basic css renderer that uses a modified version of the three.js CSS3DRenderer.
//	Having the renderer is a seperate file allows us to abstract all the visual components
//	of the cube in a simple, straightforward way.


//	THREE.JS HACK

//	You can actually use a THREE.Object3D as a Scene like object 
//	and render it with the THREE.CSS3DRenderer. For projects with filesize restrictions,
//	this is useful as it allows you to exclude the THREE.Scene and all it's dependancies entirely.
//	The only caveat is that we need to temporarily define/re-define a dummy Scene object


var SceneType = THREE.Scene;
THREE.Scene = SceneType || function(){};


ERNO.renderers = ERNO.renderers || {};
ERNO.renderers.CSS3D = function( cubelets, cube ){
	

	// SCENE + RENDERER

	var renderer = new THREE.CSS3DRenderer(),
		scene = new THREE.Object3D();
	renderer.scene = scene;


	// Add the cube 3D object to the scene

	scene.add( cube.autoRotateObj3D );
	scene.add( cube.camera );




	//	FACE LABELS

	var faceLabel, axis = new THREE.Vector3();
	cube.faces.forEach( function( face, i ){

		faceLabel = cube[face.face].label = new THREE.CSS3DObject( document.createElement( 'div' ) );

		faceLabel.element.classList.add( 'faceLabel' );
		faceLabel.position.copy( face.axis ).multiplyScalar( cube.size );
		faceLabel.position.negate();

		faceLabel.element.innerHTML = face.face.toUpperCase();
		cube.object3D.add( faceLabel );

	})
	
	cube.right.label.rotation.y = Math.PI *  0.5;
	cube.left.label.rotation.y 	= Math.PI * -0.5;
	cube.back.label.rotation.y 	= Math.PI;
	cube.up.label.rotation.x 	= Math.PI * -0.5;
	cube.down.label.rotation.x 	= Math.PI *  0.5;


	function showItem( item ){
		item.style.display = 'block';
	}
	function hideItem( item ){
		item.style.display = 'none';
	}

	function getFaceLabelElements(){
		return Array.prototype.slice.call( renderer.domElement.querySelectorAll( '.faceLabel' ));
	}


	cube.showFaceLabels = function(){

		getFaceLabelElements().forEach( showItem );
		this.showingFaceLabels = true;

		return this;

	}


	cube.hideFaceLabels = function(){

		getFaceLabelElements().forEach( hideItem );
		this.showingFaceLabels = false;

		return this;
	}




	//	CSS CUBELETS
	//	Each ERNO.Cubelet is an abstract representation of a cubelet,
	//	it has some useful information like a list of faces, but it doesn't have any visual component.
	// 	Here we take the abstract cubelet and create something you can see.

	//	First we add some functionality to the ERNO.Cubelet specific to css,
	//	things like setOpacity, and showStickers directly affects css styles.

	ERNO.extend( ERNO.Cubelet.prototype, ERNO.renderers.CSS3DCubelet.methods ); 


	// 	Then we use the CSS3DCubelet function to create all the dom elements.

	cubelets.forEach( ERNO.renderers.CSS3DCubelet );

	


	// RENDER LOOP

	function render(){

		if( cube.domElement.parentNode ){

			var parentWidth = cube.domElement.parentNode.clientWidth,
				parentHeight = cube.domElement.parentNode.clientHeight;
			
			if( cube.domElement.parentNode &&
			  ( cube.domElement.clientWidth  !== parentWidth ||
				cube.domElement.clientHeight !== parentHeight )){
				
					cube.setSize( parentWidth, parentHeight );

			}

			renderer.render( scene, cube.camera );
		}

		requestAnimationFrame( render );

	}


	requestAnimationFrame( render );


	// We'll need to set the scene object back to it's original type
	if( SceneType ) THREE.Scene = SceneType;



	// All renderers must return an object containing a domElement and an setSize method,
	// in most instances this is the renderer object itself.

	return renderer;


}
	



ERNO.renderers.CSS3DCubelet = (function(){


	return function( cubelet ){


		var domElement = document.createElement( 'div' );
		domElement.classList.add( 'cubelet' );
		domElement.classList.add( 'cubeletId-'+ cubelet.id );
		cubelet.css3DObject = new THREE.CSS3DObject( domElement );

		
		cubelet.css3DObject.name = 'css3DObject-' + cubelet.id;
		cubelet.add( cubelet.css3DObject );


		var faceSpacing = ( cubelet.size / 2 );

		var transformMap = [

			"rotateX(   0deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )",
			"rotateX(  90deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )",
			"rotateY(  90deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )",
			"rotateX( -90deg ) translateZ( "+faceSpacing+"px ) rotateZ(  90deg )",
			"rotateY( -90deg ) translateZ( "+faceSpacing+"px ) rotateZ( -90deg )",
			"rotateY( 180deg ) translateZ( "+faceSpacing+"px ) rotateZ( -90deg )",	

		]

		var axisMap = [
			'axisZ',
			'axisY',
			'axisX',
			'axisY',
			'axisX',
			'axisZ',
		]



		//	CUBELET FACES

		//  We're about to loop through our 6 faces
		//  and create visual dom elements for each
		//  Here's our overhead for that:

		cubelet.faces.forEach( function( face ) {


			//  FACE CONTAINER.
			//  This face of our Cubelet needs a DOM element for all the
			//  related DOM elements to be attached to.

			face.element = document.createElement( 'div' );
			face.element.classList.add( 'face' );
			face.element.classList.add( axisMap[ face.id ]);
			face.element.classList.add( 'face'+ ERNO.Direction.getNameById( face.id ).capitalize() );
			cubelet.css3DObject.element.appendChild( face.element );


			//  WIREFRAME.

			var wireframeElement = document.createElement( 'div' );
			wireframeElement.classList.add( 'wireframe' );
			face.element.appendChild( wireframeElement );



			//  CUBELET ID.
			//  For debugging we want the ability to display this Cubelet's ID number
			//  with an underline (to make numbers like 6 and 9 legible upside-down).

			var idElement = document.createElement( 'div' );
			idElement.classList.add( 'id' );
			face.element.appendChild( idElement );
			
			var underlineElement = document.createElement( 'span' );
			underlineElement.classList.add( 'underline' );
			underlineElement.innerText = cubelet.id;
			idElement.appendChild( underlineElement );



			// Each face has a different orientation represented by a CSS 3D transform.
			// Here we select and apply the correct one.

			var cssTransform = transformMap[ face.id ],
				style = face.element.style;

			style.OTransform = style.MozTransform = style.WebkitTransform = style.transform = cssTransform;



			//  INTROVERTED FACES.
			//  If this face has no color sticker then it must be interior to the Cube.
			//  That means in a normal state (no twisting happening) it is entirely hidden.

			if( face.isIntrovert ){

				face.element.classList.add( 'faceIntroverted' );
				face.element.appendChild( document.createElement( 'div' ));

			}


			//  EXTROVERTED FACES.
			//  But if this face does have a color then we need to
			//  create a sticker with that color
			//  and also allow text to be placed on it.

			else {


				face.element.classList.add( 'faceExtroverted' );



				//  STICKER.
				//  You know, the color part that makes the Cube
				//  the most frustrating toy ever.

				var stickerElement = document.createElement( 'div' );
				stickerElement.classList.add( 'sticker' );
				stickerElement.classList.add( face.color.name );		
				face.element.appendChild( stickerElement );



				//  If this happens to be our logo-bearing Cubelet
				//  we had better attach the logo to it!

				if( cubelet.isStickerCubelet ){

					stickerElement.classList.add( 'stickerLogo' )
				}



				//  TEXT.
				//  One character per face, mostly for our branding.

				var textElement = document.createElement( 'div' );
				textElement.classList.add( 'text' );
				textElement.innerText = face.id;
				face.text = textElement;
				face.element.appendChild( textElement );

			}

		})




		//  These will perform their actions, of course,
		//  but also setup their own boolean toggles.

		cubelet.show();
		cubelet.showIntroverts();
		cubelet.showPlastics();
		cubelet.showStickers();
		cubelet.hideIds();
		cubelet.hideTexts();
		cubelet.hideWireframes();

	}

}());


// 	The method object contains functionality specific to the CSS3D renderer that we add 
//	to the ERNO.Cubelet prototype

ERNO.renderers.CSS3DCubelet.methods = (function(){


	function showItem( item ){
		item.style.display = 'block';
	}

	function hideItem( item ){	
		item.style.display = 'none';
	} 


	return {

		//  Visual switches.
		getFaceElements: function ( selector ){

			var selectorString = selector || '';
			return Array.prototype.slice.call( this.css3DObject.element.querySelectorAll( '.face' + selectorString ));		

		},

		show: function(){

			showItem( this.css3DObject.element );
			this.showing = true
		},
		hide: function(){

			hideItem( this.css3DObject.element );
			this.showing = false
		},
		showExtroverts: function(){

			this.getFaceElements( '.faceExtroverted' ).forEach( showItem );
			this.showingExtroverts = true;
		},
		hideExtroverts: function(){

			this.getFaceElements( '.faceExtroverted' ).forEach( hideItem );
			this.showingExtroverts = false;
		},
		showIntroverts: function(){

			var axis = new THREE.Vector3(),
				inv = new THREE.Matrix4(),
				only;

			return function( onlyAxis, soft ){

				only = '';

				if( onlyAxis ){
					inv.getInverse( this.matrix );
					axis.copy( onlyAxis ).transformDirection( inv );
					only = ( Math.abs( Math.round( axis.x )) === 1 ) ? '.axisX' : ( Math.round( Math.abs( axis.y )) === 1 ) ? '.axisY' : '.axisZ';
				}

				this.getFaceElements( '.faceIntroverted' + ( onlyAxis !== undefined ? only : "" )).forEach( showItem );
				if( !soft ) this.showingIntroverts = true;

			}
		}(),
		hideIntroverts: function(){

			var axis = new THREE.Vector3(),
				inv = new THREE.Matrix4(),
				only;

			return function( onlyAxis, soft ){

				only = '';

				if( onlyAxis ){
					inv.getInverse( this.matrix );
					axis.copy( onlyAxis ).transformDirection( inv );
					only = ( Math.abs( Math.round( axis.x )) === 1 ) ? '.axisX' : ( Math.round( Math.abs( axis.y )) === 1 ) ? '.axisY' : '.axisZ';
				}

				this.getFaceElements( '.faceIntroverted' + ( onlyAxis !== undefined ? only : "" )).forEach( hideItem );
				if( !soft ) this.showingIntroverts = false;

			}
		}(),

		showPlastics: function(){

			this.getFaceElements().forEach( function( item ){
				item.classList.remove( 'faceTransparent' );
			});
			this.showingPlastics = true;
		},
		hidePlastics: function(){

			this.getFaceElements( ).forEach( function( item ){
				item.classList.add( 'faceTransparent' );
			});
			this.showingPlastics = false;
		},
		hideStickers: function(){

			this.getFaceElements( ' .sticker' ).forEach( hideItem );
			this.showingStickers = false;
		},
		showStickers: function(){

			this.getFaceElements( ' .sticker' ).forEach( showItem );
			this.showingStickers = true;
		},
		showWireframes: function(){

			this.getFaceElements( ' .wireframe' ).forEach( showItem );
			this.showingWireframes = true;
		},
		hideWireframes: function(){

			this.getFaceElements( ' .wireframe' ).forEach( hideItem );
			this.showingWireframes = false;
		},
		showIds: function(){

			this.getFaceElements( ' .id' ).forEach( showItem );
			this.showingIds = true;
		},
		hideIds: function(){

			this.getFaceElements( ' .id' ).forEach( hideItem );
			this.showingIds = false;
		},
		showTexts: function(){

			this.getFaceElements( ' .text' ).forEach( showItem );
			this.showingTexts = true;
		},
		hideTexts: function(){

			this.getFaceElements( ' .text' ).forEach( hideItem );
			this.showingTexts = false;
		},
		getOpacity: function(){

			return this.opacity
		},
		setOpacity: function( opacityTarget, onComplete ){

			if( this.opacityTween ) this.opacityTween.stop()
			if( opacityTarget === undefined ) opacityTarget = 1
			if( opacityTarget !== this.opacity ){

				var 
				that = this,
				tweenDuration = ( opacityTarget - this.opacity ).absolute().scale( 0, 1, 0, 1000 * 0.2 )

				this.opacityTween = new TWEEN.Tween({ opacity: this.opacity })
				.to({

					opacity: opacityTarget
				
				}, tweenDuration )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onUpdate( function(){

					that.css3DObject.element.style.opacity =  this.opacity;
					that.opacity = this.opacity//opacityTarget
				})
				.onComplete( function(){

					if( onComplete instanceof Function ) onComplete()
				})
				.start()

			}
		},
		getStickersOpacity: function( value ){

			return parseFloat( this.getFaceElements( ' .sticker' )[0].style.opacity );
		},
		setStickersOpacity: function( value ){

			if( value === undefined ) value = 0.2;
			var valueStr = value;
			this.getFaceElements( ' .sticker' ).forEach( function( sticker ){
				sticker.style.opacity = valueStr.toString();
			});
		}
		
	}

}())
