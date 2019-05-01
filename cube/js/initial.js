/*


	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg
	lowercase = Anticlockwise to next 90 degree peg



	FACE & SLICE ROTATION COMMANDS

	F	Front
	S 	Standing (rotate according to Front Face's orientation)
	B 	Back
	
	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right
	
	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS
	
	X   Rotate entire cube according to Right Face's orientation
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation


*/




$(document).ready( function(){ 
	// -------------------- cubejs -------------------- 
	cubeTwoPhase = new Cube()
	Cube.initSolver();

	// -------------------- cuber -------------------- 
	var useLockedControls = true,
		controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;

	var ua = navigator.userAgent,
		isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

	window.cubeGL = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: controls,
		renderer: isIe ? ERNO.renderers.IeCSS3D : null
	});

	var container = document.getElementById( 'container' );
	container.appendChild( cubeGL.domElement );

	if( controls === ERNO.Locked ){
		var fixedOrientation = new THREE.Euler(  Math.PI * 0.1, Math.PI * -0.25, 0 );
		cubeGL.object3D.lookAt( cubeGL.camera.position );
		cubeGL.rotation.x += fixedOrientation.x;
		cubeGL.rotation.y += fixedOrientation.y;
		cubeGL.rotation.z += fixedOrientation.z;
	}

	cubeGL.addEventListener("onTwistComplete", () => {
		updateCubeTwoPhase()
	})

	// ------------- 同步 cuber 和 cubejs 的魔方状态
	function updateCubeTwoPhase()
	{
		var cubeStringColor = ""
		var cubeStringFaces = ""
		
		var read = [8, 7, 6, 5, 4, 3, 2, 1, 0]
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.up.cubelets[read[i]].up.color.initial
		}
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.right.cubelets[read[i]].right.color.initial
		}
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.front.cubelets[read[i]].front.color.initial
		}

		read = [2, 5, 8, 1, 4, 7, 0, 3, 6]
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.down.cubelets[read[i]].down.color.initial
		}

		read = [6, 3, 0, 7, 4, 1, 8, 5, 2]
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.left.cubelets[read[i]].left.color.initial
		}
		for (var i = 0; i <= 8; i++) {
			cubeStringColor += cubeGL.back.cubelets[read[i]].back.color.initial
		}

		var cubeOriginColors = [
			{pos: "U", color: cubeGL.up.cubelets[4].up.color.initial},
			{pos: "R", color: cubeGL.right.cubelets[4].right.color.initial},
			{pos: "F", color: cubeGL.front.cubelets[4].front.color.initial},
			{pos: "D", color: cubeGL.down.cubelets[4].down.color.initial},
			{pos: "L", color: cubeGL.left.cubelets[4].left.color.initial},
			{pos: "B", color: cubeGL.back.cubelets[4].back.color.initial}
		]

		for (var i = 0; i < cubeStringColor.length; i++) {
			for (var j = 0; j < cubeOriginColors.length; j++) {
				if(cubeStringColor[i] == cubeOriginColors[j].color) {
					cubeStringFaces += cubeOriginColors[j].pos
					break
				}
			}
		}
		cubeTwoPhase = Cube.fromString(cubeStringFaces)
	}

	// The deviceMotion function provide some subtle mouse based motion
	// The effect can be used with the Freeform and Locked controls.
	// This could also integrate device orientation on mobile

	// var motion = deviceMotion( cubeGL, container );

	// motion.decay = 0.1; 				// The drag effect
	// motion.range.x = Math.PI * 0.06;	// The range of rotation 
	// motion.range.y = Math.PI * 0.06;
	// motion.range.z = 0;
	// motion.paused = false;				// disables the effect

	cubeGL.twistDuration = 300
	cubeGL.twist('xY')
	//cubeGL.shuffle()
	//cubeGL.twist('d')
	//cubeGL.solve()	
})
