function typeInfo(sentence, if_del) {
  const terminal = document.getElementById('terminal');
  const typewriter = new Typewriter(terminal);

  if(if_del == true) {
    typewriter.typeString(sentence)
      .pauseFor(500)
      .deleteAll()
      .start();
  }
  else typewriter.typeString(sentence).start();
}

function cubeShuffle() {
  const shuffle_step = cubeGL.shuffle(20);
  typeInfo("Shuffle: " + shuffle_step, true);
}

function cubeReset() {
	updateCubeTwoPhase();
	const solve_step = cubeTwoPhase.solve();
	cubeGL.twistDuration = 0;
	cubeGL.twist(solve_step);
	setTimeout("cubeGL.twistDuration = 300", 1000);
}
