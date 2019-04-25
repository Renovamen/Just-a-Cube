ERNO.extend( Number.prototype, {


	absolute : function(){

		return Math.abs( this );
	},
	add : function(){
		
		var sum = this;

		Array.prototype.slice.call( arguments ).forEach( function( n ){

			sum += n;
		});
		return sum;
	},
	arcCosine : function(){

		return Math.acos( this );
	},
	arcSine : function(){

		return Math.asin( this );
	},
	arcTangent : function(){

		return Math.atan( this );
	},
	constrain : function( a, b ){

		var higher, lower, c = this;

		b = b || 0;
		higher = Math.max( a, b );
		lower  = Math.min( a, b );
		c = Math.min( c, higher );
		c = Math.max( c, lower  );
		return c;
	},
	cosine : function(){

		return Math.cos( this );
	},
	degreesToDirection : function(){

		var d = this % 360,

		directions = [ 'N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N' ];
		return directions[ this.scale( 0, 360, 0, directions.length - 1 ).round() ];
	},
	degreesToRadians : function(){

		return this * Math.PI / 180;
	},
	divide : function(){
		
		var sum = this;

		Array.prototype.slice.call( arguments ).forEach( function( n ){

			sum /= n;
		});
		return sum;
	},
	isBetween : function( a, b ){
		
		var 
		min = Math.min( a, b ),
		max = Math.max( a, b );
		
		return ( min <= this && this <= max );
	},
	lerp : function( a, b ){

		return a + (b - a ) * this;
	},
	log : function( base ){
		
		return Math.log( this ) / ( base === undefined ? 1 : Math.log( base ));
	},
	log10 : function(){

		// is this more pragmatic? ---> return ( '' + this.round() ).length;
		return Math.log( this ) / Math.LN10;
	},
	maximum : function( n ){

		return Math.max( this, n );
	},
	minimum : function( n ){

		return Math.min( this, n );
	},
	modulo : function( n ){

		return (( this % n ) + n ) % n;
	},
	multiply : function(){
		
		var sum = this;

		Array.prototype.slice.call( arguments ).forEach( function( n ){

			sum *= n;
		});
		return sum;
	},
	normalize : function( a, b ){

		if( a == b ) return 1.0;
		return ( this - a ) / ( b - a );
	},
	raiseTo : function( exponent ){

		return Math.pow( this, exponent );
	},
	radiansToDegrees : function(){

		return this * 180 / Math.PI;
	},
	rand : function( n ){

		var min, max;

		if( n !== undefined ){

			min = Math.min( this, n );
			max = Math.max( this, n );
			return min + Math.floor( Math.random() * ( max - min ));
		}
		return Math.floor( Math.random() * this );
	},
	random : function( n ){

		var min, max;

		if( n !== undefined ){

			min = Math.min( this, n );
			max = Math.max( this, n );
			return min + Math.random() * ( max - min );
		}
		return Math.random() * this;
	},
	remainder : function( n ){

		return this % n;
	},
	round : function( decimals ){

		var n  = this

		decimals = decimals || 0
		n *= Math.pow( 10, decimals )
		n  = Math.round( n )
		n /= Math.pow( 10, decimals )
		return n
	},
	roundDown : function(){

		return Math.floor( this )
	},
	roundUp : function(){

		return Math.ceil( this )
	},
	scale : function( a0, a1, b0, b1 ){

		var phase = this.normalize( a0, a1 )

		if( b0 == b1 ) return b1
		return b0 + phase * ( b1 - b0 )
	},
	sine : function(){

		return Math.sin( this )
	},
	subtract : function(){
		
		var sum = this

		Array.prototype.slice.call( arguments ).forEach( function( n ){

			sum -= n
		})
		return sum
	},
	tangent : function(){

		return Math.tan( this )
	},
	toArray : function(){

		return [ this.valueOf() ]
	},
	toNumber : function(){

		return this.valueOf()
	},
	toPaddedString : function( padding ){

		return ( '0000000000000' + String( this )).slice( -padding );
	},
	toSignedString : function(){

		var stringed = '' + this
		
		if( this >= 0 ) stringed = '+' + stringed
		return stringed
	},
	toString : function(){

		return ''+ this
	}
})