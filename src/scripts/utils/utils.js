var _ = {
	
	isNumeric: function( n ){
		return !isNaN( parseFloat( n )) && isFinite( n );
	},
	cascade: function(){

		var i, args = Array.prototype.slice.call( arguments );

		for( i = 0; i < args.length; i ++ )
			if( args[ i ] !== undefined ) return args[ i ];
		return false;
	},

  	hexToRgb: function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
	}


};