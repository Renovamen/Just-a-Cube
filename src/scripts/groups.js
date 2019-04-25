/*


	GROUPS

 	ERNO.Groups are collections of an arbitrary number of Cubelets.
	They have no concept of Cubelet location or orientation
	and therefore are not capable of rotation around any axis.

	--

	@author Mark Lundin - http://www.mark-lundin.com
	@author Stewart Smith


*/








ERNO.Group = function(){

	this.cubelets = [];

	this.add( Array.prototype.slice.call( arguments ));
}


ERNO.extend( ERNO.Group.prototype, THREE.EventDispatcher.prototype );	

ERNO.extend( ERNO.Group.prototype, {


	add: function(){

		var 
		cubeletsToAdd = Array.prototype.slice.call( arguments ),
		that = this;

		cubeletsToAdd.forEach( function( cubelet ){

			if( cubelet instanceof ERNO.Group ) cubelet = cubelet.cubelets;
			if( cubelet instanceof Array ) that.add.apply( that, cubelet );
			else that.cubelets.push( cubelet );
		});
		return this;
	},
	remove: function( cubeletToRemove ){

		if( cubeletToRemove instanceof ERNO.Group ) cubeletToRemove = cubeletToRemove.cubelets;
		if( cubeletToRemove instanceof Array ){

			var that = this;
			cubeletToRemove.forEach( function( c ){

				that.remove( c );
			});
		}

		var i = this.cubelets.length
		while( i-- > 0 ){

			if( this.cubelets[ i ] === cubeletToRemove )
				this.cubelets.splice( i, 1 );
		}
		return this;
	},




	//  Boolean checker.
	//  Are any Cubelets in this group tweening?
	//  Engaged on the Z axis? Etc.

	isFlagged: function( property ){

		var count = 0;
		this.cubelets.forEach( function( cubelet ){

			count += cubelet[ property ] ? 1 : 0;
		});
		return count;
	},
	isTweening: function(){

		return this.isFlagged( 'isTweening' );
	},
	isEngagedX: function(){

		return this.isFlagged( 'isEngagedX' );
	},
	isEngagedY: function(){

		return this.isFlagged( 'isEngagedY' );
	},
	isEngagedZ: function(){

		return this.isFlagged( 'isEngagedZ' );
	},
	isEngaged: function(){

		return this.isEngagedX() + this.isEngagedY() + this.isEngagedZ();
	},




	//  Search functions.
	//  What Cubelets in this ERNO.Group have a particular color?
	//  How about all of these three colors?
	//  And index? address? Solver uses these a lot.

	hasProperty: function( property, value ){

		var
		results = new ERNO.Group();

		this.cubelets.forEach( function( cubelet ){

			if( cubelet[ property ] === value ) results.add( cubelet );
		});

		return results;
	},
	hasId: function( id ){

		return this.hasProperty( 'id', id );
	},
	hasAddress: function( address ){

		return this.hasProperty( 'address', address );
	},
	hasType: function( type ){

		return this.hasProperty( 'type', type );
	},
	hasColor: function( color ){

		var
		results = new ERNO.Group();

		this.cubelets.forEach( function( cubelet ){

			if( cubelet.hasColor( color )) results.add( cubelet );
		});
		return results;
	},
	hasColors: function(){//  this function implies AND rather than OR, XOR, etc.

		var
		results = new ERNO.Group(),
		colors  = Array.prototype.slice.call( arguments );

		this.cubelets.forEach( function( cubelet ){

			if( cubelet.hasColors.apply( cubelet, colors )) results.add( cubelet );
		});
		return results;
	},


	//  cube.slices.front.isSolved( 'front' )
	//  cube.slices.front.up.isSolved( 'up' )

	isSolved: function( face ){

		if( face ){

			var faceColors = {},
				numberOfColors = 0;

			if( face instanceof ERNO.Direction ) face = face.name;
			this.cubelets.forEach( function( cubelet ){

				var color = cubelet[ face ].color.name;
				if( faceColors[ color ] === undefined ){
					
					faceColors[ color ] = 1;
					numberOfColors ++;
				}
				else faceColors[ color ] ++;
			})
			return numberOfColors === 1 ? true : false;
		}
		else {
		
			console.warn( 'A face [String or ERNO.Controls] argument must be specified when using ERNO.Group.isSolved().' )
			return false
		}
	},




	//  Visual switches.
	//  Take this group and hide all the stickers,
	//  turn on wireframe mode, etc.

	show: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.show() })
		return this
	},
	hide: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hide() })
		return this
	},
	showPlastics: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showPlastics() })
		return this
	},
	hidePlastics: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hidePlastics() })
		return this
	},
	showExtroverts: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showExtroverts() })
		return this
	},
	hideExtroverts: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideExtroverts() })
		return this
	},
	showIntroverts: function( only, soft ){

		this.cubelets.forEach( function( cubelet ){ cubelet.showIntroverts( only, soft ) })
		return this
	},
	hideIntroverts: function( only, soft ){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideIntroverts( only, soft ) })
		return this
	},		
	showStickers: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showStickers() })
		return this
	},
	hideStickers: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideStickers() })
		return this
	},
	showWireframes: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showWireframes() })
		return this
	},
	hideWireframes: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideWireframes() })
		return this
	},
	showIds: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showIds() })
		return this
	},
	hideIds: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideIds() })
		return this
	},
	showTexts: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.showTexts() })
		return this
	},
	hideTexts: function(){

		this.cubelets.forEach( function( cubelet ){ cubelet.hideTexts() })
		return this
	},




	getOpacity: function(){

		var avg = 0

		this.cubelets.forEach( function( cubelet ){ avg += cubelet.getOpacity() })
		return avg / this.cubelets.length
	},
	setOpacity: function( opacity, onComplete ){

		this.cubelets.forEach( function( cubelet ){ cubelet.setOpacity( opacity, onComplete ) })
		return this
	},
	getRadius: function(){

		var avg = 0

		this.cubelets.forEach( function( cubelet ){ avg += cubelet.getRadius() })
		return avg / this.cubelets.length
	},
	setRadius: function( radius, onComplete ){

		this.cubelets.forEach( function( cubelet ){ cubelet.setRadius( radius, onComplete ) })
		return this
	}




})
