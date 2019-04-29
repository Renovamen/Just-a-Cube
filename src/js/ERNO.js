/**
@preserve
@license

CUBER
-----


Cuber is a programmable Rubiks cube of sorts.


Made with love by:
@author Mark Lundin - http://mark-lundin.com / @mark_lundin
@author Stewart Smith - stewd.io
@author Google Creative Lab



NOTATION

UPPERCASE = Clockwise to next 90 degree peg
lowercase = Anticlockwise to next 90 degree peg



FACE & SLICE ROTATION COMMANDS

F   Front
S   Standing (rotate according to Front Face's orientation)
B   Back

L   Left
M   Middle (rotate according to Left Face's orientation)
R   Right

U   Up
E   Equator (rotate according to Up Face's orientation)
D   Down



ENTIRE CUBE ROTATION COMMANDS

X   Rotate entire cube according to Right Face's orientation
Y   Rotate entire cube according to Up Face's orientation
Z   Rotate entire cube according to Front Face's orientation



NOTATION REFERENCES

http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation



The MIT License (MIT)

Copyright (c) 2014 Cuber Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/





var ERNO = {};

(function () {

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;

	if (!Function.prototype.bind) {

		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1), 
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
	
})();



// based on https://github.com/documentcloud/underscore/blob/bf657be243a075b5e72acc8a83e6f12a564d8f55/underscore.js#L767
ERNO.extend = function ( obj, source ) {

	// ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
	if ( Object.keys ) {

		var keys = Object.keys( source );

		for (var i = 0, il = keys.length; i < il; i++) {

			var prop = keys[i];
			Object.defineProperty( obj, prop, Object.getOwnPropertyDescriptor( source, prop ) );

		}

	} else {

		var safeHasOwnProperty = {}.hasOwnProperty;

		for ( var prop in source ) {

			if ( safeHasOwnProperty.call( source, prop ) ) {

				obj[prop] = source[prop];

			}

		}

	}

	return obj;

};
