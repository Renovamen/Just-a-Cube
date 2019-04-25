/*


	FOLDS

	Folds are two adjacent Faces joined together, as if one
	long 6 x 3 strip has been folding down the center and
	three such shapes together wrap the six sides of the Cube.
	Currently this is important for text wrapping. And in the
	future? Who knows. Characters in a String are mapped thus:
	

               LEFT FACE
                                         RIGHT FACE
       -------- -------- -------- 
      |        |        |        |-------- -------- -------- 
      |    0   |    1   |    2   |        |        |        |
      |        |        |        |    3   |    4   |    5   |
       -------- -------- --------         |        |        |
      |        |        |        |-------- -------- -------- 
      |    6   |    7   |    8   |        |        |        |
      |        |        |        |    9   |   10   |   11   |
       -------- -------- --------         |        |        |
      |        |        |        |-------- -------- -------- 
      |   12   |   13   |   14   |        |        |        |
      |        |        |        |   15   |   16   |   17   |
       -------- -------- --------         |        |        |
                                  -------- -------- -------- 

                                 ^
                                 |

                             FOLD LINE


	Currently Folds are only intended to be created and
	heroized after the first Cube mapping. After the Cube
	twists things would get rather weird...


	--

	@author Mark Lundin - http://www.mark-lundin.com
	@author Stewart Smith


*/








ERNO.Fold = function( left, right ){

	this.map = [

		left.northWest[ 	left.face  ].text,
		left.north[ 		left.face  ].text,
		left.northEast[ 	left.face  ].text,
		right.northWest[ 	right.face ].text,
		right.north[ 		right.face ].text,
		right.northEast[ 	right.face ].text,

		left.west[ 			left.face  ].text,
		left.origin[ 		left.face  ].text,
		left.east[ 			left.face  ].text,
		right.west[ 		right.face ].text,
		right.origin[ 		right.face ].text,
		right.east[ 		right.face ].text,

		left.southWest[ 	left.face  ].text,
		left.south[      	left.face  ].text,
		left.southEast[  	left.face  ].text,
		right.southWest[ 	right.face ].text,
		right.south[      	right.face ].text,
		right.southEast[ 	right.face ].text
	];
}




ERNO.Fold.prototype.getText = function(){

	var text = '';

	this.map.forEach( function( element ){

		text += element.innerHTML;
	});
	return text;
};
ERNO.Fold.prototype.setText = function( text ){

	var i;

	text = text.justifyLeft( 18 );
	for( i = 0; i < 18; i ++ ){

		this.map[ i ].innerHTML = text.substr( i, 1 );
	}
};



