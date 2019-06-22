function TwoPhase()
{
	updateCubeTwoPhase()
	if(cubeGL.isSolved() == true) Type("The cube is already solved.", false)
	else
	{
		var solve_step = cubeTwoPhase.solve();
		//console.log(solve_step)
        cubeGL.twist(solve_step)
        Type("Two-phase: " + solve_step, false)
	}
}

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