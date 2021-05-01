window.solver = new ERNO.Solver();

solver.logic = function(cube) {
	// 魔方状态
	var cubeState = {};
	// （l, f, r, b）每种颜色下一面的颜色
	var nextColor = {};
	var nextFace = {l:"f", f:"r", r:"b", b:"l"};
	var prevFace = {l:"b", b:"r", r:"f", f:"l"};

	// 复原步骤
	var stepName = {
		0: "First layer edges",
		1: "First layer corners",
		2: "Second layer",
		3: "Top cross",
		4: "Third layer corners (pos)",
		5: "Third layer corners (ori)",
		6: "Third layer edges"
	};

	var terminal = document.getElementById("terminal");
	var typewriter = new Typewriter(terminal);

	getCubeState()
	solveCube();


	// ------------------ 执行并打印复原步骤 ------------------
	function Execute(steps) {
		for (let i = 0; i < steps.length; i++) {
			step = steps[i];
			if(step != "") {
				cube.twist(step);
				if (i != steps.length - 1) {
					typewriter.typeString(stepName[i] + ": " + step)
						.pauseFor(500)
						.deleteAll()
						.start();
				}
				else typewriter.typeString(stepName[i] + ": " + step).start();
			}
			else {
				if (i != steps.length - 1) {
					typewriter.typeString(stepName[i] + " is already solved.")
						.pauseFor(500)
						.deleteAll()
						.start();
				}
				else typewriter.typeString(stepName[i] + " is already solved.").start();
			}
			console.log(step);
			console.log(stepName[i] + " is already completed.");
		}
	}

	// ------------------ 获得魔方当前状态 ------------------
	function getCubeState() {
		cubeState = {
			d: cubeGL.down.cubelets[4].down.color.name[0],
			u: cubeGL.up.cubelets[4].up.color.name[0],
			l: cubeGL.left.cubelets[4].left.color.name[0],
			r: cubeGL.right.cubelets[4].right.color.name[0],
			f: cubeGL.front.cubelets[4].front.color.name[0],
			b: cubeGL.back.cubelets[4].back.color.name[0],

			dl: cube.down.south.down.color.name[0] + cube.down.south.left.color.name[0],
			df: cube.down.west.down.color.name[0] + cube.down.west.front.color.name[0],
			dr: cube.down.north.down.color.name[0] + cube.down.north.right.color.name[0],
			db: cube.down.east.down.color.name[0] + cube.down.east.back.color.name[0],

			ul: cube.up.west.up.color.name[0] + cube.up.west.left.color.name[0],
			uf: cube.up.south.up.color.name[0] + cube.up.south.front.color.name[0],
			ur: cube.up.east.up.color.name[0] + cube.up.east.right.color.name[0],
			ub: cube.up.north.up.color.name[0] + cube.up.north.back.color.name[0],

			lf: cube.front.west.left.color.name[0] + cube.front.west.front.color.name[0],
			fr: cube.front.east.front.color.name[0] + cube.front.east.right.color.name[0],
			rb: cube.back.north.right.color.name[0] + cube.back.north.back.color.name[0],
			bl: cube.back.south.back.color.name[0] + cube.back.south.left.color.name[0],

			dlf: cube.down.southWest.down.color.name[0] + cube.down.southWest.left.color.name[0] + cube.down.southWest.front.color.name[0],
			dfr: cube.down.northWest.down.color.name[0] + cube.down.northWest.front.color.name[0] + cube.down.northWest.right.color.name[0],
			drb: cube.down.northEast.down.color.name[0] + cube.down.northEast.right.color.name[0] + cube.down.northEast.back.color.name[0],
			dbl: cube.down.southEast.down.color.name[0] + cube.down.southEast.back.color.name[0] + cube.down.southEast.left.color.name[0],

			ulf: cube.up.southWest.up.color.name[0] + cube.up.southWest.left.color.name[0] + cube.up.southWest.front.color.name[0],
			ufr: cube.up.southEast.up.color.name[0] + cube.up.southEast.front.color.name[0] + cube.up.southEast.right.color.name[0],
			ubl: cube.up.northWest.up.color.name[0] + cube.up.northWest.back.color.name[0] + cube.up.northWest.left.color.name[0],
			urb: cube.up.northEast.up.color.name[0] + cube.up.northEast.right.color.name[0] + cube.up.northEast.back.color.name[0],
		}

		var color_l = cubeState["l"], color_r = cubeState["r"],
			color_f = cubeState["f"], color_b = cubeState["b"];
		nextColor[color_l] = color_f;
		nextColor[color_f] = color_r;
		nextColor[color_r] = color_b;
		nextColor[color_b] = color_l;

		console.log(cubeState);
		console.log(nextColor);
	}


	// ------------------- 模拟魔方按解法转动后的状态变化 -------------------

	// Back 面顺时针旋转 90°
	function Twist_B() {
		// 棱块
		var tmp = cubeState.ub;
		cubeState.ub = cubeState.rb;
		cubeState.rb = cubeState.db;
		cubeState.db = cubeState.bl[1] + cubeState.bl[0];
		cubeState.bl = tmp[1] + tmp[0];

		// 角块
		tmp = cubeState.ubl;
		cubeState.ubl = cubeState.urb[1] + cubeState.urb[2] + cubeState.urb[0];
		cubeState.urb = cubeState.drb[1] + cubeState.drb[0] + cubeState.drb[2];
		cubeState.drb = cubeState.dbl[2] + cubeState.dbl[0] + cubeState.dbl[1];
		cubeState.dbl = tmp[2] + tmp[1] + tmp[0];
	}

	// Right 面顺时针旋转 90°
	function Twist_R() {
		// 棱块
		var tmp = cubeState.ur;
		cubeState.ur = cubeState.fr;
		cubeState.fr = cubeState.dr;
		cubeState.dr = cubeState.rb[1] + cubeState.rb[0];
		cubeState.rb = tmp[1] + tmp[0];

		// 角块
		tmp = cubeState.urb;
		cubeState.urb = cubeState.ufr[1] + cubeState.ufr[2] + cubeState.ufr[0];
		cubeState.ufr = cubeState.dfr[1] + cubeState.dfr[0] + cubeState.dfr[2];
		cubeState.dfr = cubeState.drb[2] + cubeState.drb[0] + cubeState.drb[1];
		cubeState.drb = tmp[2] + tmp[1] + tmp[0];
	};

	// Front 面顺时针旋转 90°
	function Twist_F() {
		// 棱块
		var tmp = cubeState.uf;
		cubeState.uf = cubeState.lf;
		cubeState.lf = cubeState.df;
		cubeState.df = cubeState.fr[1] + cubeState.fr[0];
		cubeState.fr = tmp[1] + tmp[0];

		// 角块
		tmp = cubeState.ufr;
		cubeState.ufr = cubeState.ulf[1] + cubeState.ulf[2] + cubeState.ulf[0];
		cubeState.ulf = cubeState.dlf[1] + cubeState.dlf[0] + cubeState.dlf[2];
		cubeState.dlf = cubeState.dfr[2] + cubeState.dfr[0] + cubeState.dfr[1];
		cubeState.dfr = tmp[2] + tmp[1] + tmp[0];
	}

	// Left 面顺时针旋转 90°
	function Twist_L() {
		// 棱块
		var tmp = cubeState.ul;
		cubeState.ul = cubeState.bl;
		cubeState.bl = cubeState.dl;
		cubeState.dl = cubeState.lf[1] + cubeState.lf[0];
		cubeState.lf = tmp[1] + tmp[0];

		// 角块
		tmp = cubeState.ulf;
		cubeState.ulf = cubeState.ubl[1] + cubeState.ubl[2] + cubeState.ubl[0];
		cubeState.ubl = cubeState.dbl[1] + cubeState.dbl[0] + cubeState.dbl[2];
		cubeState.dbl = cubeState.dlf[2] + cubeState.dlf[0] + cubeState.dlf[1];
		cubeState.dlf = tmp[2] + tmp[1] + tmp[0];
	}

	// Up 面顺时针旋转 90°
	function Twist_U() {
		// 棱块
		var tmp = cubeState.ul;
		cubeState.ul = cubeState.uf;
		cubeState.uf = cubeState.ur;
		cubeState.ur = cubeState.ub;
		cubeState.ub = tmp;

		// 角块
		tmp = cubeState.ulf;
		cubeState.ulf = cubeState.ufr;
		cubeState.ufr = cubeState.urb;
		cubeState.urb = cubeState.ubl;
		cubeState.ubl = tmp;
	}

	// Down 面顺时针旋转 90°
	function Twist_D() {
		// 棱块
		var tmp = cubeState.dl;
		cubeState.dl = cubeState.db;
		cubeState.db = cubeState.dr;
		cubeState.dr = cubeState.df;
		cubeState.df = tmp;

		// 角块
		tmp = cubeState.dlf;
		cubeState.dlf = cubeState.dbl;
		cubeState.dbl = cubeState.drb;
		cubeState.drb = cubeState.dfr;
		cubeState.dfr = tmp;
	}

	// 整体顺时针旋转 90°
	function Twist_Y() {
		// 顶层
		Twist_U();

		// 中层
		tmp = cubeState.lf;
		cubeState.lf = cubeState.fr;
		cubeState.fr = cubeState.rb;
		cubeState.rb = cubeState.bl;
		cubeState.bl = tmp;

		tmp = cubeState.f;
		cubeState.f = cubeState.r;
		cubeState.r = cubeState.b;
		cubeState.b = cubeState.l;
		cubeState.l = tmp;

		// 底层
		Twist_D(), Twist_D(), Twist_D();
	}

	// ------------------- 魔方组合动作 -------------------
	function changeState(order_list) {
		for (order of order_list) {
			switch(order) {
				case "D": 	//D: Down 面顺时针旋转 90°
					Twist_D();
					break;
				case "d": 	//d: Down 面逆时针旋转 90°
					Twist_D(); Twist_D(); Twist_D();
					break;
				case "U": 	//U: Up 面顺时针旋转 90°
					Twist_U();
					break;
				case "u": 	//u: Up 面逆时针旋转 90°
					Twist_U(); Twist_U(); Twist_U();
					break;
				case "L": 	//L: Left 面顺时针旋转 90°
					Twist_L();
					break;
				case "l": 	//l: Left 面逆时针旋转 90°
					Twist_L(); Twist_L(); Twist_L();
					break;
				case "F": 	//F: Front 面顺时针旋转 90°
					Twist_F();
					break;
				case "f": 	//f: Front 面逆时针旋转 90°
					Twist_F(); Twist_F(); Twist_F();
					break;
				case "R": 	//R: Right 面顺时针旋转 90°
					Twist_R();
					break;
				case "r": 	//r - Right 面逆时针旋转 90°
					Twist_R(); Twist_R(); Twist_R();
					break;
				case "B": 	//B - Back 面顺时针旋转 90°
					Twist_B();
					break;
				case "b": 	//b - Back 面逆时针旋转 90°
					Twist_B(); Twist_B(); Twist_B();
					break;
				case "Y": 	//Y - 整体顺时针旋转 90°
					Twist_Y();
					break;
				case "y": 	//Y - 整体逆时针旋转 90°
					Twist_Y(); Twist_Y(); Twist_Y();
					break;
			}
		}
	}


	// ---------------------------- 层先法还原 ----------------------------
	// --------------- 查找当前要调整的块所在位置 ---------------
	function getBlockPos(block) {
    const reg = new RegExp("[" + block + "]{" + block.length + "}");
    //console.log(reg)
		for (k in cubeState) {
			if (cubeState[k].match(reg)) return { k: k, v: cubeState[k] };
    }
	}

	// --------------- 调整单个底棱块  ---------------
	function FIRST_LAYER_EDGES_SINGLE(block_pos, block_color) {
		var exp = "", exp_log = "", s;
		for (let i = 0; i < 7; i++) {
			s = getBlockPos(block_color);
			//console.log(s)
			if (s.k.indexOf("d") != -1) {
				if (s.v[0] == block_color[0]) {
					if (s.k == block_pos) return exp_log; // 返回单个底棱块复原公式
					else exp = s.k[1].toUpperCase() + s.k[1].toUpperCase();
				}
				else exp = s.k[1].toUpperCase();
			}
			else if(s.k.indexOf("u") != -1) {
				if(s.k[1] == block_pos[1]) {
					if (s.v[0] == block_color[0]) exp = s.k[1].toUpperCase() + s.k[1].toUpperCase();
					else if (cubeState[block_pos[0] + nextFace[s.k[1]]] != cubeState[block_pos[0]] + cubeState[nextFace[s.k[1]]])
						exp = "u" + nextFace[s.k[1]] + s.k[1].toUpperCase();
					else exp = "u" + nextFace[s.k[1]] + s.k[1].toUpperCase() + nextFace[s.k[1]].toUpperCase();
				}
				else exp = "U";
			}
			else {
				if (s.v[0] == block_color[0]) {
					if (s.k[1] == block_pos[1]) exp = s.k[1];
					else if(cubeState[block_pos[0] + s.k[1]] != cubeState[block_pos[0]] + cubeState[s.k[1]]) exp = s.k[1].toUpperCase();
					else exp = s.k[1].toUpperCase() + "U" + s.k[1];
				}
				else {
					if (s.k[0] == block_pos[1]) exp = s.k[0].toUpperCase();
					else if (cubeState[block_pos[0] + s.k[0]] != cubeState[block_pos[0]] + cubeState[s.k[0]]) exp = s.k[0];
					else exp = s.k[0] + "U" + s.k[0].toUpperCase();
				}
			}
			exp_log += exp;
			changeState(exp);
		}
		console.log("First Layer Cross Single Error: ", exp_log);
		return "First Layer Cross Single Error: " + exp_log;
	}

	// --------------- 调整单个底角块  ---------------
	function FIRST_LAYER_CORNERS_SINGLE(block_pos, block_color) {
		var exp = "", exp_log = "", s;
		for (let i = 0; i < 10; i++) {
			s = getBlockPos(block_color);
			if (s.k.indexOf("d") != -1) {
				// 所找的角块在底面位置
				if (s.v[0] == cubeState["d"]) {
					if (s.k == block_pos) return exp_log;	// 返回单个底角块复原公式
					else exp = s.k[1] + "U" + s.k[1].toUpperCase();
				}
				else if (s.v[1] == cubeState["d"]) exp = s.k[1] + "u" + s.k[1].toUpperCase();
				else exp = s.k[2].toUpperCase() + "U" + s.k[2];
			}
			else {
				//所找的角块在顶面位置
				if (s.k == "u" + block_pos[1] + block_pos[2]) {
					if (s.v[0] == cubeState["d"]) exp = s.k[2].toUpperCase() + "u" + s.k[2];
					else if (s.v[1] == cubeState["d"]) exp = s.k[1] + "u" + s.k[1].toUpperCase();
					else exp = s.k[2].toUpperCase() + "U" + s.k[2];
				}
				else exp = "U";
			}
			exp_log += exp;
			changeState(exp);
		}
		console.log("First Layer Corners Single Error: ", exp_log);
		return "First Layer Corners Single Error: " + exp_log;
	};

	// --------------- 调整单个中棱块  ---------------
	function SECOND_LAYER_SINGLE(block_pos, block_color)
	{
		var exp = "", exp_log = "", s;
		for (let i = 0; i < 6; i++) {
			s = getBlockPos(block_color);
			if (s.k.indexOf("u") != -1) {
				if (nextColor[s.v[0]] == s.v[1]) {
					if (s.v[1] == cubeState[s.k[1]])
						exp = "u" + prevFace[s.k[1]] + "U" + prevFace[s.k[1]].toUpperCase()
							+ "U" + s.k[1].toUpperCase() + "u" + s.k[1];
					else exp = "U";
				}
				else {
					if (s.v[1] == cubeState[s.k[1]])
						exp = "U" + nextFace[s.k[1]].toUpperCase() + "u" + nextFace[s.k[1]]
							+ "u" + s.k[1] + "U" + s.k[1].toUpperCase();
					else exp = "U";
				}
			}
			else {
				if (s.v[0] == cubeState[s.k[0]] && s.v[1] == cubeState[s.k[1]]) return exp_log; // 返回复原公式
				else exp = "u" + s.k[0] + "U" + s.k[0].toUpperCase() + "U" + s.k[1].toUpperCase() + "u" + s.k[1];
			}
			exp_log += exp;
			changeState(exp);
		}
		console.log("Second Layer Single Error: ", exp_log);
		return "Second Layer Single Error: " + exp_log;
	}

	// --------------- 底棱归位 | COMPLETE THE FIRST LAYER EDGES ---------------
	function FIRST_LAYER_EDGES() {
		console.log("------------ 第一步：底棱归位 | COMPLETE THE FIRST LAYER EDGES ------------");
		let order = "";
		order += FIRST_LAYER_EDGES_SINGLE("dl", cubeState["d"] + cubeState["l"]);
		order += FIRST_LAYER_EDGES_SINGLE("df", cubeState["d"] + cubeState["f"]);
		order += FIRST_LAYER_EDGES_SINGLE("dr", cubeState["d"] + cubeState["r"]);
		order += FIRST_LAYER_EDGES_SINGLE("db", cubeState["d"] + cubeState["b"]);
		return compress(order);
		//Execute(order, "First layer edges");
	};

	// -------------- 底角归位 | COMPLETE THE FIRST LAYER CORNERS --------------
	function FIRST_LAYER_CORNERS() {
		console.log("------------ 第二步：底角归位  | COMPLETE THE FIRST LAYER CORNERS ------------");
		let order = "";
		order += FIRST_LAYER_CORNERS_SINGLE("dlf", cubeState["d"] + cubeState["l"] + cubeState["f"]);
		order += FIRST_LAYER_CORNERS_SINGLE("dfr", cubeState["d"] + cubeState["f"] + cubeState["r"]);
		order += FIRST_LAYER_CORNERS_SINGLE("drb", cubeState["d"] + cubeState["r"] + cubeState["b"]);
		order += FIRST_LAYER_CORNERS_SINGLE("dbl", cubeState["d"] + cubeState["b"] + cubeState["l"]);
		return compress(order);
		//Execute(order, "First layer corners");
	}

	// --------------- 中棱归位 | COMPLETE THE SECOND LAYER ---------------
	function SECOND_LAYER() {
		console.log("------------ 第三步：中棱归位  | COMPLETE THE SECOND LAYER ------------");
		let order = "";
		order += SECOND_LAYER_SINGLE("lf", cubeState["l"] + cubeState["f"]);
		order += SECOND_LAYER_SINGLE("fr", cubeState["f"] + cubeState["r"]);
		order += SECOND_LAYER_SINGLE("rb", cubeState["r"] + cubeState["b"]);
		order += SECOND_LAYER_SINGLE("bl", cubeState["b"] + cubeState["l"]);
		return compress(order);
	};

	// --------------- 顶部十字 | COMPLETE THE TOP CROSS ---------------
	function TOP_CROSS() {
		console.log("------------ 第四步：顶部十字 | COMPLETE THE TOP CROSS ------------");
		var exp = "", exp_log = "";
		var uc = cubeState["u"]; // 顶层颜色

		for(let i = 0; i < 4; i++) {
			if(cubeState.ul[0] == uc && cubeState.ur[0] == uc
				&& cubeState.uf[0] == uc && cubeState.ub[0] == uc)
				return compress(exp_log); // 返回复原公式
			else if(cubeState.ul[0] == uc && cubeState.ur[0] == uc) exp = "FRUruf";
			else if(cubeState.uf[0] == uc && cubeState.ub[0] == uc) exp = "RBUbur";
			else if(cubeState.uf[0] == uc && cubeState.ur[0] == uc) exp = "FRUruf";
			else if(cubeState.ur[0] == uc && cubeState.ub[0] == uc) exp = "RBUbur";
			else if(cubeState.ub[0] == uc && cubeState.ul[0] == uc) exp = "BLUlub";
			else if(cubeState.ul[0] == uc && cubeState.uf[0] == uc) exp = "LFUful";
			else exp = "FRUruf";
			exp_log += exp;
			changeState(exp);
		}
		console.log("Top Cross Error: ", exp_log);
		return "Top Cross Error: " + exp_log;
	};

	// ----- 顶角归位（位置） | COMPLETE THE THIRD LAYER CORNERS (POSITION) -----
	function THIRD_LAYER_CORNERS_POS() {
		console.log("------------ 第五步：顶角归位（位置） | COMPLETE THE THIRD LAYER CORNERS (POSITION) ------------");
		const step = "rLUluRULul", blocks = ["ulf", "ufr", "urb", "ubl"], uc = cubeState["u"];
    var exp_log = "";

		for (let i = 0; i < 4; i++) {
			var last = i;
			var times = 0; // 顶层有多少角块位置是对的
			for (let j = i + 1; j < i + 4; j++) {
				const next = j % 4;

				// 上一个块除去顶层颜色后的颜色
				lastc = cubeState[blocks[last]].replace(uc, "");
				// 这个块除去顶层颜色后的颜色
				nextc = cubeState[blocks[next]].replace(uc, "");

				if (nextColor[lastc[0]] == lastc[1]) {
					// 复原后的魔方中，这个块正好就应该在上一个块的后面
					if (nextc.indexOf(lastc[1]) != -1
						&& nextc.indexOf(nextColor[lastc[1]]) != -1) times += 1;
					else break;
				}
				else {
					if (nextc.indexOf(lastc[0]) != -1
						&& nextc.indexOf(nextColor[lastc[0]]) != -1) times += 1;
					else break;
				}

				last = next;
			}

			if (times == 1) {
				last = (last - 1 + 4) % 4;
				if (last == 0) exp_log = "u" + step, changeState(exp_log);
				else if (last == 1) exp_log = step, changeState(exp_log);
				else if (last == 2) exp_log = "U" + step, changeState(exp_log);
				else if (last == 3) exp_log = "UU" + step, changeState(exp_log);
				return compress(exp_log); // 返回复原公式
			}
			// times > 1 说明顶层角块位置本来就是对的，不需要调整
			else if (times > 1) return compress(exp_log);
		}

		exp_log = step + "U" + step;
		changeState(exp_log);
		return compress(exp_log); // 返回复原公式
	}

	// ----- 顶角归位（方向） | COMPLETE THE THIRD LAYER CORNERS (ORIENT) -----
	function THIRD_LAYER_CORNERS_ORI() {
		console.log("------------ 第六步：顶角归位（方向） | COMPLETE THE THIRD LAYER CORNERS (ORIENT) ------------");
		const step1 = "ruRuruuRuu", step2 = "FUfUFUUfUU";
		const blocks = ["ulf", "ufr", "urb", "ubl"], uc = cubeState["u"];
    var exp_log = "", s = "";

		for (block of blocks) s += cubeState[block].indexOf(uc);

		if (s.match(/2220|0222|2022|2202/)) {
			if (s == "0222") exp_log += "U";
			else if (s == "2022") exp_log += "UU";
			else if (s == "2202") exp_log += "u";
			exp_log += step1;
		}
		else if (s.match(/1110|0111|1011|1101/)) {
			if (s == "0111") exp_log += "U";
			else if (s == "1011") exp_log += "UU";
			else if (s == "1101") exp_log += "u";
			exp_log += step2;
		}
		else if (s.match(/2001|1200|0120|0012/)) {
			if (s == "1200") exp_log += "U";
			else if (s == "0120") exp_log += "UU";
			else if (s == "0012") exp_log += "u";
			exp_log += step1 + "U" + step2;
		}
		else if (s.match(/1002|2100|0210|0021/)) {
			if (s == "2100") exp_log += "U";
			else if (s == "0210") exp_log += "UU";
			else if (s == "0021") exp_log += "u";
			exp_log += step2 + "U" + step1;
		}
		else if (s.match(/2121|1212/)) {
			if (s == "1212") exp_log += "U";
			exp_log += step2 + "UU" + step2;
		}
		else if (s.match(/2112|2211|1221|1122/)) {
			if (s == "2211") exp_log += "U";
			else if (s == "1221") exp_log += "UU";
			else if (s == "1122") exp_log += "u";
			exp_log += step1 + "U" + step1;
		}
		else if (s.match(/0201|1020/)) {
			if (s == "1020") exp_log += "U";
			exp_log += step1 + "UU" + step2;
		}
		else if (s.match(/0102|2010/)) {
			if (s == "2010") exp_log += "U";
			exp_log += step2 + "UU" + step1;
		}

		changeState(exp_log);
		console.log(exp_log)
		return compress(exp_log); // 返回复原公式
	}

	// --------------- 顶棱归位 | COMPLETE THE THIRD LAYER EDGES ---------------
	function THIRD_LAYER_EDGES() {
		console.log("------------ 第七步：顶棱归位 | COMPLETE THE THIRD LAYER EDGES ------------")
		const step1 = "ruRuruuRuu", step2 = "FUfUFUUfUU";
    var exp_log = "";

		// 顶层整体方向
		while (cubeState.ulf[2] != cubeState.f) {
			changeState("U");
			exp_log += "U";
		}

		for (let i = 0; i < 3; i++) {
			let exp = "";
			const s = cubeState.uf[1] + cubeState.ur[1] + cubeState.ub[1] + cubeState.ul[1];
			const c = cubeState.f + cubeState.r + cubeState.b + cubeState.l;

			let times = 0, pos = -1;
			for (let j = 0; j < 4; j++) {
				if (s[j] == c[j]) times++, pos = j;
      }

			// console.log(s, c)
			// console.log(times, pos)

			// 顶层棱块位置已正确
			if (times > 1) return compress(exp_log) // 返回复原公式
			else if (times == 1) {
				if (pos == 1) exp += "Y";
				else if (pos == 2) exp += "YY";
				else if (pos == 3) exp += "y";

				if (s[(pos + 1) % 4] == nextColor[nextColor[s[pos]]])
					exp += step1 + step2;
				else exp += "y" + step2 + step1;
			}
			else exp += step1 + step2;

			exp_log += exp;
			changeState(exp);
		}

		console.log("Third Layer Edges Error: ", exp_log);
		return "Third Layer Edges Error: " + exp_log;
	}

	//  ------------------- 返回魔方复原步骤 -------------------
	function solveCube() {
		let steps = [];
		steps.push(FIRST_LAYER_EDGES());
		steps.push(FIRST_LAYER_CORNERS());
		steps.push(SECOND_LAYER());
		steps.push(TOP_CROSS());
		steps.push(THIRD_LAYER_CORNERS_POS());
		steps.push(THIRD_LAYER_CORNERS_ORI());
		steps.push(THIRD_LAYER_EDGES());
		Execute(steps);
	};

	// ------------------- 压缩指令数 -------------------
	// 如："uuu" = "U"（逆时针转 270° = 顺时针转 90°）
	function compress(order) {
		for(let i = 0; i < 10; i++) {
			order = order.replace(/uU|Uu|dD|Dd|lL|Ll|fF|Ff|rR|Rr|bB|Bb|yY|Yy|uuuu|dddd|llll|ffff|rrrr|bbbb|yyyy|UUUU|DDDD|LLLL|FFFF|RRRR|BBBB|YYYY/g, "");
			order = order.replace(/uuu/g, "U");
			order = order.replace(/ddd/g, "D");
			order = order.replace(/lll/g, "L");
			order = order.replace(/fff/g, "F");
			order = order.replace(/rrr/g, "R");
			order = order.replace(/bbb/g, "B");
			order = order.replace(/yyy/g, "Y");

			order = order.replace(/UUU/g, "u");
			order = order.replace(/DDD/g, "d");
			order = order.replace(/LLL/g, "l");
			order = order.replace(/FFF/g, "f");
			order = order.replace(/RRR/g, "r");
			order = order.replace(/BBB/g, "b");
			order = order.replace(/YYY/g, "y");
		}
		return order;
	}

  return false;
}
