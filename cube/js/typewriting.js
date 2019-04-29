(function($){

	/* ---------------------------------- *\
					打 字 機
	\* ---------------------------------- */

	var part1 = '@-webkit-keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } } @-moz-keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } } @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } } ';

	var target;
	var currentNumber;
	var inputString = "";
	var setting;
	var callback;

	var inHtmlTag;

	$.fn.typewriting = function( input_string, options, callback_func ) {

		this.text("A");
		var cursorHeight = this.height();
		this.text("");

		currentNumber = 0;
		inputString = input_string;
		setting = $.extend({
			typing_interval: 150,
			blink_interval: "0.7s",
			cursor_color: "black"
		}, options);
		callback = callback_func;

		var part2 = '.typingCursor::after { content: ""; width: 10px; height: ' + cursorHeight + 'px; margin-left: 5px; display: inline-block; vertical-align: bottom; background-color: ' + setting.cursor_color + '; -webkit-animation: blink ' + setting.blink_interval + ' infinite; -moz-animation: blink ' + setting.blink_interval + ' infinite; animation: blink ' + setting.blink_interval + ' infinite; }';

		$('head').append( '<style type="text/css">' + part1 + part2 + '</style>' );

		target = this.addClass("typingCursor");

		typingGo();

	};

	$.fn.rewrite = function( input_string, callback_func ) {

		currentNumber = 0;
		inputString = input_string;
		callback = callback_func;

		typingGo();

	}

	function typingGo() {

		if( currentNumber <= inputString.length ) {

			var thisText = getText();

			if( thisText.slice(-1) == "<" ) inHtmlTag = true;
			if( thisText.slice(-1) == ">" ) inHtmlTag = false;

			target.html( thisText );

			if( inHtmlTag )
				typingGo();
			else
				setTimeout( function(){
					typingGo();
				}, setting.typing_interval);

		} else {
			if( callback ) callback();
		}
	}

	function getText() {
		var returnString = inputString.slice( 0, currentNumber );
		currentNumber++;
		return returnString;
	}

}(jQuery));

