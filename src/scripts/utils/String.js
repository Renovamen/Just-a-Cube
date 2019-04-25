ERNO.extend( String.prototype, {


	capitalize : function(){

		return this.charAt( 0 ).toUpperCase() + this.slice( 1 )//.toLowerCase();
	},
	invert: function(){

		var
		s = '',
		i;

		for( i = 0; i < this.length; i ++ ){

			if( this.charAt( i ) === this.charAt( i ).toUpperCase()) s += this.charAt( i ).toLowerCase();
			else s += this.charAt( i ).toUpperCase();
		}
		return s;
	},
	justifyCenter : function( n ){

		var
		thisLeftLength  = Math.round( this.length / 2 ),
		thisRightLength = this.length - thisLeftLength,
		containerLeftLength  = Math.round( n / 2 ),
		containerRightLength = n - containerLeftLength,
		padLeftLength  = containerLeftLength  - thisLeftLength,
		padRightLength = containerRightLength - thisRightLength,
		centered = this;

		if( padLeftLength > 0 ){

			while( padLeftLength -- ) centered = ' ' + centered;
		}
		else if( padLeftLength < 0 ){

			centered = centered.substr( padLeftLength * -1 );
		}
		if( padRightLength > 0 ){

			while( padRightLength -- ) centered += ' ';
		}
		else if( padRightLength < 0 ){

			centered = centered.substr( 0, centered.length + padRightLength );
		}
		return centered;
	},
	justifyLeft: function( n ){

		var justified = this;

		while( justified.length < n ) justified = justified + ' ';
		return justified;
	},
	justifyRight: function( n ){

		var justified = this;

		while( justified.length < n ) justified = ' ' + justified;
		return justified;
	},
	multiply : function( n ){

		var i, s = '';

		n = _.cascade( n, 2 );
		for( i = 0; i < n; i ++ ){
			s += this;
		}
		return s;
	},
	reverse : function(){

		var i, s = '';

		for( i = 0; i < this.length; i ++ ){
			s = this[ i ] + s;
		}
		return s;
	},
	size : function(){

		return this.length;
	},
	toEntities : function(){

		var i, entities = '';

		for( i = 0; i < this.length; i ++ ){
			entities += '&#' + this.charCodeAt( i ) + ';';
		}
		return entities;
	},
	toCamelCase : function(){
		
		var
		split  = this.split( /\W+|_+/ ),
		joined = split[ 0 ],
		i;

		for( i = 1; i < split.length; i ++ )
			joined += split[ i ].capitalize();

		return joined;
	},
	directionToDegrees : function(){

		var
		directions = [ 'N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N' ],
		i = directions.indexOf( this.toUpperCase() );

		return i >= 0 ? i.scale( 0, directions.length - 1, 0, 360 ) : Number.NaN;
	},
	toArray : function(){

		return [ this ];
	},
	toNumber : function(){

		return parseFloat( this );
	},
	toString : function(){

		return this;
	},
	toUnderscoreCase : function(){
		
		var underscored = this.replace( /[A-Z]+/g, function( $0 ){
			
			return '_' + $0;
		});

		if( underscored.charAt( 0 ) === '_' ) underscored = underscored.substr( 1 );
		return underscored.toLowerCase();
	},
	toUnicode : function(){

		var i, u, unicode = '';

		for( i = 0; i < this.length; i ++ ){
			u = this.charCodeAt( i ).toString( 16 ).toUpperCase();
			while( u.length < 4 ){
				u = '0' + u;
			}
			unicode += '\\u' + u;
		}
		return unicode;
	}
});