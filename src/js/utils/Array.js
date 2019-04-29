ERNO.extend( Array.prototype, {
		
	
	distanceTo : function( target ){

		var i, sum = 0;

		if( arguments.length > 0 ) 
			target = Array.prototype.slice.call( arguments );
		if( this.length === target.length ){

			for( i = 0; i < this.length; i ++ )
				sum += Math.pow( target[i] - this[i], 2 );
			return Math.pow( sum, 0.5 );
		}
		else return null;
	},
	first : function(){
		
		return this[ 0 ];
	},
	last : function(){
		
		return this[ this.length - 1 ];
	},
	maximum : function(){

		return Math.max.apply( null, this );
	},
	middle : function(){
	
		return this[ Math.round(( this.length - 1 ) / 2 ) ];
	},
	minimum : function(){

		return Math.min.apply( null, this );
	},
	rand : function(){

		return this[ Math.floor( Math.random() * this.length )];
	},
	random : function(){//  Convenience here. Exactly the same as .rand().

		return this[ Math.floor( Math.random() * this.length )];
	},
	//  Ran into trouble here with Three.js. Will investigate....
	/*remove: function( from, to ){

		var rest = this.slice(( to || from ) + 1 || this.length )
		
		this.length = from < 0 ? this.length + from : from
		return this.push.apply( this, rest )
	},*/
	shuffle : function(){

		var 
		copy = this,
		i = this.length, 
		j,
		tempi,
		tempj;

		if( i == 0 ) return false;
		while( -- i ){

			j = Math.floor( Math.random() * ( i + 1 ));
			tempi = copy[ i ];
			tempj = copy[ j ];
			copy[ i ] = tempj;
			copy[ j ] = tempi;
		}
		return copy;
	},
	toArray : function(){

		return this;
	},
	toHtml : function(){

		var i, html = '<ul>';

		for( i = 0; i < this.length; i ++ ){

			if( this[ i ] instanceof Array )
				html += this[ i ].toHtml();
			else
				html += '<li>' + this[ i ] + '</li>';
		}
		html += '</ul>';
		return html;
	},
	toText : function( depth ){

		var i, indent, text;

		depth = _.cascade( depth, 0 );
		indent = '\n' + '\t'.multiply( depth );
		text = '';
		for( i = 0; i < this.length; i ++ ){

			if( this[ i ] instanceof Array )
				text += indent + this[ i ].toText( depth + 1 );
			else
				text += indent + this[ i ];
		}
		return text;
	}


});