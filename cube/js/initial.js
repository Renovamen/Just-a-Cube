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


$(document).ready(function() {
	// -------------------- cubejs --------------------
	cubeTwoPhase = new Cube();
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

	const container = document.getElementById( 'container' );
	container.appendChild( cubeGL.domElement );

	if (controls === ERNO.Locked) {
		const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
		cubeGL.object3D.lookAt(cubeGL.camera.position);
		cubeGL.rotation.x += fixedOrientation.x;
		cubeGL.rotation.y += fixedOrientation.y;
		cubeGL.rotation.z += fixedOrientation.z;
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

	cubeGL.twistDuration = 300;
	cubeGL.twist('xY');
	//cubeGL.shuffle();
	//cubeGL.twist('d');
	//cubeGL.solve();
})
