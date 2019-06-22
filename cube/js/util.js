function Type(sentence, if_del)
{
    var terminal = document.getElementById('terminal');
    var typewriter = new Typewriter(terminal);

    if(if_del == true)
    {
        typewriter.typeString(sentence)
        .pauseFor(500)
        .deleteAll()
        .start();
    }
    else typewriter.typeString(sentence).start();
}

function Shuffle()
{
    var shuffle_step = cubeGL.shuffle(20);
    Type("Shuffle: " + shuffle_step, true)
}

function Reset()
{
	updateCubeTwoPhase()
	var solve_step = cubeTwoPhase.solve();
	cubeGL.twistDuration = 0;
	cubeGL.twist(solve_step);
	setTimeout("cubeGL.twistDuration = 300", 1000)
}