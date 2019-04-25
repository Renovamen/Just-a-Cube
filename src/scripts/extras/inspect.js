//  We'll inspect the Cube by specifically inspecting the Faces.
//  Bear in mind this is merely one way to think about the Cube
//  and does require some redundancy in terms of Cubelet indexes.
//  Here we'll default to 'compact' mode in order to give the
//  full Cube overview in the least amount of space. 

ERNO.Cube.prototype.inspect = function( compact, side ){

	compact = !compact;

	this.front.inspect( compact, side );
	this.up.inspect(    compact, side );
	this.right.inspect( compact, side );
	this.down.inspect(  compact, side );
	this.left.inspect(  compact, side );
	this.back.inspect(  compact, side );
}

//  Full inspection of the Cublet's faces
//  using the convenience accessors from above.

ERNO.Cubelet.prototype.inspect = function( face ){			

	if( face !== undefined ){

		
		//  Just a particular face's color -- called by Slice's inspector.
		
		return this[ face ].color || '!'
	}
	else {
		

		//  Full on ASCII-art inspection mode -- with console colors!

		var
		that    = this,
		id      = this.id,
		address = this.address,
		type    = this.type,
		color   = this.cube.color,				
		LEFT    = 0,
		CENTER  = 1,
		getColorName = function( face, justification, minimumLength ){

			var colorName = that[ face ].color.name.toUpperCase()
			
			if( justification !== undefined && minimumLength !== undefined ){

				if( justification === CENTER ) colorName = colorName.justifyCenter( minimumLength )
				else if( justification === LEFT ) colorName = colorName.justifyLeft( minimumLength )
			}
			return colorName
		}

		if( id < 10 ) id = '0' + id
		if( address < 10 ) address = '0' + address
		console.log(

			'\n    ID         '+ id +
			'\n    Type       '+ type.toUpperCase() +'\n'+

			'\n    Address    '+ address +
			'\n    Address X  '+ this.addressX.toSignedString() +
			'\n    Address Y  '+ this.addressY.toSignedString() +
			'\n    Address Z  '+ this.addressZ.toSignedString() +'\n'+

			'\n    Engaged X  '+ this.isEngagedX +
			'\n    Engaged Y  '+ this.isEngagedY +
			'\n    Engaged Z  '+ this.isEngagedZ +
			'\n    Tweening   '+ this.isTweening +'\n'+
			
			'\n%c 0  Front      '+ getColorName( 'front', LEFT, 7 ) +'%c'+
			'\n%c 1  Up         '+ getColorName( 'up',    LEFT, 7 ) +'%c'+
			'\n%c 2  Right      '+ getColorName( 'right', LEFT, 7 ) +'%c'+
			'\n%c 3  Down       '+ getColorName( 'down',  LEFT, 7 ) +'%c'+
			'\n%c 4  Left       '+ getColorName( 'left',  LEFT, 7 ) +'%c'+
			'\n%c 5  Back       '+ getColorName( 'back',  LEFT, 7 ) +'%c\n' +

			'\n              -----------  %cback%c'+
			'\n            /    %cup%c     /|  %c5%c'+
			'\n           /     %c1%c     / | %c'+ getColorName( 'back' ) +'%c'+
			'\n          /%c'+ getColorName( 'up', CENTER, 11 ) +'%c/  |'+
			'\n  %cleft%c    -----------   %cright%c'+
			'\n   %c4%c     |           |   %c2%c'+
			'\n%c'+ getColorName( 'left', CENTER, 8 ) +'%c |   %cfront%c   |  %c'+ getColorName( 'right' ) +'%c'+
			'\n         |     %c0%c     |  /'+
			'\n         |%c'+ getColorName( 'front', CENTER, 11 ) +'%c| /'+
			'\n         |           |/'+
			'\n          -----------'+
			'\n               %cdown%c'+
			'\n                %c3%c'+
			'\n           %c'+ getColorName( 'down', CENTER, 11 ) +'%c\n',

			this.front.color.styleB, '',
			this.up.color.styleB,    '',
			this.right.color.styleB, '',
			this.down.color.styleB,  '',
			this.left.color.styleB,  '',
			this.back.color.styleB,  '',

			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.back.color.styleF,  '',
			this.up.color.styleF,    '',
			this.left.color.styleF,  '',
			this.right.color.styleF, '',
			this.left.color.styleF,  '',
			this.right.color.styleF, '',
			this.left.color.styleF,  '',
			this.front.color.styleF, '',
			this.right.color.styleF, '',
			this.front.color.styleF, '',
			this.front.color.styleF, '',
			this.down.color.styleF,  '',
			this.down.color.styleF,  '',
			this.down.color.styleF,  ''
		)
	}
}

ERNO.Group.prototype.inspect = function( face ){

	this.cubelets.forEach( function( cubelet ){

		cubelet.inspect( face );
	});
	return this;
}

ERNO.Slice.prototype.inspect = function( compact, side ){

	var
	getColorName = function( cubelet ){

		return cubelet[ side ].color.name.toUpperCase().justifyCenter( 9 );
	},
	sideLabel = '';

	if( side === undefined ){

			if( this.face !== undefined ) side = this.face;
		else side = 'front';
	}
	if( side instanceof ERNO.Direction ) side = side.name;
	if( side !== this.face ) sideLabel = side + 's';
	if( compact ){

		console.log(

			'\n' + this.name.capitalize().justifyLeft( 10 ) +
			'%c '+ this.northWest.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.north.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.northEast.id.toPaddedString( 2 ) +' %c '+
			'\n' + sideLabel +'\n'+

			'          %c '+ this.west.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.origin.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.east.id.toPaddedString( 2 ) +' %c '+
			'\n\n'+
			'          %c '+ this.southWest.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.south.id.toPaddedString( 2 ) +' %c '+
			'%c '+ this.southEast.id.toPaddedString( 2 ) +' %c '+
			'\n',

			this.northWest[ side ].color.styleB, '',
			this.north[     side ].color.styleB, '',
			this.northEast[ side ].color.styleB, '',
			
			this.west[      side ].color.styleB, '',
			this.origin[    side ].color.styleB, '',
			this.east[      side ].color.styleB, '',
			
			this.southWest[ side ].color.styleB, '',
			this.south[     side ].color.styleB, '',
			this.southEast[ side ].color.styleB, ''
		);
	}
	else {

		console.log(

				'\n          %c           %c %c           %c %c           %c '+
				'\n'+ this.name.capitalize().justifyLeft( 10 ) +
				'%c northWest %c '+
				'%c   north   %c '+
				'%c northEast %c '+
				'\n' + sideLabel.justifyLeft( 10 ) +
				'%c '+ this.northWest.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.north.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.northEast.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'\n' +
				'          %c ' + getColorName( this.northWest ) +' %c '+
				'%c '+ getColorName( this.north ) +' %c '+
				'%c '+ getColorName( this.northEast ) +' %c '+
				'\n          %c           %c %c           %c %c           %c '+


				'\n\n          %c           %c %c           %c %c           %c '+
				'\n          %c    west   %c '+
				'%c   origin  %c '+
				'%c    east   %c '+
				'\n' +
				'          %c ' + this.west.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.origin.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.east.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'\n' +
				'          %c ' + getColorName( this.west ) +' %c '+
				'%c '+ getColorName( this.origin ) +' %c '+
				'%c '+ getColorName( this.east ) +' %c '+
				'\n          %c           %c %c           %c %c           %c '+


				'\n\n          %c           %c %c           %c %c           %c '+
				'\n          %c southWest %c '+
				'%c   south   %c '+
				'%c southEast %c '+
				'\n' +
				'          %c ' + this.southWest.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.south.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'%c '+ this.southEast.id.toPaddedString( 2 ).justifyCenter( 9 ) +' %c '+
				'\n' +
				'          %c ' + getColorName( this.southWest ) +' %c '+
				'%c '+ getColorName( this.south ) +' %c '+
				'%c '+ getColorName( this.southEast ) +' %c '+
				'\n          %c           %c %c           %c %c           %c\n',


				this.northWest[ side ].color.styleB, '',
				this.north[     side ].color.styleB, '',
				this.northEast[ side ].color.styleB, '',
				this.northWest[ side ].color.styleB, '',
				this.north[     side ].color.styleB, '',
				this.northEast[ side ].color.styleB, '',
				this.northWest[ side ].color.styleB, '',
				this.north[     side ].color.styleB, '',
				this.northEast[ side ].color.styleB, '',
				this.northWest[ side ].color.styleB, '',
				this.north[     side ].color.styleB, '',
				this.northEast[ side ].color.styleB, '',
				this.northWest[ side ].color.styleB, '',
				this.north[     side ].color.styleB, '',
				this.northEast[ side ].color.styleB, '',

				this.west[      side ].color.styleB, '',
				this.origin[    side ].color.styleB, '',
				this.east[      side ].color.styleB, '',
				this.west[      side ].color.styleB, '',
				this.origin[    side ].color.styleB, '',
				this.east[      side ].color.styleB, '',
				this.west[      side ].color.styleB, '',
				this.origin[    side ].color.styleB, '',
				this.east[      side ].color.styleB, '',
				this.west[      side ].color.styleB, '',
				this.origin[    side ].color.styleB, '',
				this.east[      side ].color.styleB, '',
				this.west[      side ].color.styleB, '',
				this.origin[    side ].color.styleB, '',
				this.east[      side ].color.styleB, '',

				this.southWest[ side ].color.styleB, '',
				this.south[     side ].color.styleB, '',
				this.southEast[ side ].color.styleB, '',
				this.southWest[ side ].color.styleB, '',
				this.south[     side ].color.styleB, '',
				this.southEast[ side ].color.styleB, '',
				this.southWest[ side ].color.styleB, '',
				this.south[     side ].color.styleB, '',
				this.southEast[ side ].color.styleB, '',
				this.southWest[ side ].color.styleB, '',
				this.south[     side ].color.styleB, '',
				this.southEast[ side ].color.styleB, '',
				this.southWest[ side ].color.styleB, '',
				this.south[     side ].color.styleB, '',
				this.southEast[ side ].color.styleB, ''
		);
	}
}