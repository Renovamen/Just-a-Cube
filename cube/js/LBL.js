
window.solver = new ERNO.Solver();
solver.logic = function(cube)
{
	// ---------------------- 魔方状态 ----------------------
	var cubeState = {};
	var Next_Face = {l:'f',f:'r',r:'b',b:'l'};
	var Pre_Face = {l:'b',b:'r',r:'f',f:'l'};
	var Next_Color = {o:'b',b:'r',r:'g',g:'o'};

	// 复原步骤
	var Step_Name = {
		0: "First layer edges",
		1: "First layer corners"
	};

	var terminal = document.getElementById('terminal');
    var typewriter = new Typewriter(terminal);

	getCubeState()
	Solve_Cube();


	// ------------------ 执行并打印复原步骤 ------------------
	function Execute(solve_step)
	{
		for(var i = 0; i < solve_step.length; i++)
		{
			step = solve_step[i];
			if(step != '')
			{
				cube.twist(step);
				if(i != solve_step.length - 1)
				{
					typewriter.typeString(Step_Name[i] + ': ' + step)
						.pauseFor(500)
						.deleteAll()
						.start();
				}
				else typewriter.typeString(Step_Name[i] + ': ' + step).start();
			}
			else 
			{
				if(i != solve_step.length - 1)
				{
					typewriter.typeString(Step_Name[i] + ' is already solved.')
						.pauseFor(500)
						.deleteAll()
						.start();
				}
				else typewriter.typeString(Step_Name[i] + ' is already solved.').start();
			}
			console.log(step)
			console.log(Step_Name[i] + " is already completed.")
		}
	}

	// ------------------ 获得魔方当前状态 ------------------
	function getCubeState()
	{
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
		console.log(cubeState)
	}


	// ------------------- 模拟魔方按解法转动后的状态变化 ------------------- 
    
    // Back 面顺时针旋转 90°
	function Twist_B()
	{
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
	};

	// Right 面顺时针旋转 90°
	function Twist_R()
	{
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
	function Twist_F()
	{
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
	};

	// Left 面顺时针旋转 90°
	function Twist_L()
	{
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
	};

	// Up 面顺时针旋转 90°
	function Twist_U()
	{
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
	};

	// Down 面顺时针旋转 90°
	function Twist_D()
	{
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
	};

	// ------------------- 魔方组合动作 ------------------- 
    function changeState(order_list) 
    {
		for(order of order_list) 
		{
			switch(order)
			{
				case 'D': 	//D: Down 面顺时针旋转 90°
					Twist_D();
					break;
				case 'd': 	//d: Down 面逆时针旋转 90°
					Twist_D(); Twist_D(); Twist_D();
					break;
				case 'U': 	//U: Up 面顺时针旋转 90°
					Twist_U();
					break;
				case 'u': 	//u: Up 面逆时针旋转 90°
					Twist_U(); Twist_U(); Twist_U();
					break;
				case 'L': 	//L: Left 面顺时针旋转 90°
					Twist_L();
					break;
				case 'l': 	//l: Left 面逆时针旋转 90°
					Twist_L(); Twist_L(); Twist_L();
					break;
				case 'F': 	//F: Front 面顺时针旋转 90°
					Twist_F();
					break;
				case 'f': 	//f: Front 面逆时针旋转 90°
					Twist_F(); Twist_F(); Twist_F();
					break;
				case 'R': 	//R: Right 面顺时针旋转 90°
					Twist_R();
					break;
				case 'r': 	//r - Right 面逆时针旋转 90°
					Twist_R(); Twist_R(); Twist_R();
					break;
				case 'B': 	//B - Back 面顺时针旋转 90°
					Twist_B();
					break;
				case 'b': 	//b - Back 面逆时针旋转 90°
					Twist_B(); Twist_B(); Twist_B();
					break;
			}
		}
    };
    
   
    // ---------------------------- 层先法还原 ---------------------------- 
    // 查找当前要调整的棱块所在位置
	function Block_Position(block)
	{
        var reg = new RegExp('['+block+']{'+block.length+'}');
        //console.log(reg)
		for(k in cubeState)
			if(cubeState[k].match(reg)) return {k:k,v:cubeState[k]};
	};

	//  --------------- 调整单个底棱块  --------------- 
	function FIRST_LAYER_EDGES_SINGLE(block_pos, block_color)
	{
		var exp = '', exp_log = '', s;
		for(var i = 0; i < 7; i++)
		{
			s = Block_Position(block_color);
			//console.log(s)
			if(s.k.indexOf('d') != -1)
			{
				if(s.v[0] == block_color[0])
				{
					if(s.k == block_pos) return exp_log; // 返回单个底棱块复原公式
					else exp = s.k[1].toUpperCase() + s.k[1].toUpperCase();
				}
				else exp = s.k[1].toUpperCase();
			}
			else if(s.k.indexOf('u') != -1)
			{
				if(s.k[1] == block_pos[1])
				{
					if(s.v[0] == block_color[0]) exp = s.k[1].toUpperCase() + s.k[1].toUpperCase();
					else if(cubeState[block_pos[0] + Next_Face[s.k[1]]] != cubeState[block_pos[0]] + cubeState[Next_Face[s.k[1]]])
						exp = 'u' + Next_Face[s.k[1]] + s.k[1].toUpperCase();
					else exp = 'u' + Next_Face[s.k[1]] + s.k[1].toUpperCase() + Next_Face[s.k[1]].toUpperCase();
				}
				else exp = 'U';
			}
			else
			{
				if(s.v[0] == block_color[0])
				{
					if(s.k[1] == block_pos[1]) exp = s.k[1];
					else if(cubeState[block_pos[0] + s.k[1]] != cubeState[block_pos[0]] + cubeState[s.k[1]]) exp = s.k[1].toUpperCase();
					else exp = s.k[1].toUpperCase() + 'U' + s.k[1];
				}
				else
				{
					if(s.k[0] == block_pos[1]) exp = s.k[0].toUpperCase();
					else if(cubeState[block_pos[0] + s.k[0]] != cubeState[block_pos[0]] + cubeState[s.k[0]]) exp = s.k[0];
					else exp = s.k[0] + 'U' + s.k[0].toUpperCase();
				}
			}
			exp_log += exp;
			changeState(exp);
		}
		console.log('First Layer Cross Single Error: ', exp_log);
		return 'First Layer Cross Single Error: ' + exp_log;
	};

	//  --------------- 调整单个底角块  --------------- 
	function FIRST_LAYER_CORNERS_SINGLE(block_pos, block_color)
	{
		var exp = '', exp_log = '', s;
		for(var i = 0; i < 10; i++)
		{
			s = Block_Position(block_color);
			if(s.k.indexOf('d') != -1)
			{
				// 所找的角块在底面位置
				if(s.v[0] == cubeState['d'])
				{
					if(s.k == block_pos) return exp_log;	// 返回单个底角块复原公式
					else exp = s.k[1] + 'U' + s.k[1].toUpperCase();
				}
				else if(s.v[1] == cubeState['d']) exp = s.k[1] + 'u' + s.k[1].toUpperCase();
				else exp = s.k[2].toUpperCase() + 'U' + s.k[2];
			}
			else
			{
				//所找的角块在顶面位置
				if(s.k == 'u' + block_pos[1] + block_pos[2])
				{
					if(s.v[0] == cubeState['d']) exp = s.k[2].toUpperCase() + 'u' + s.k[2];
					else if(s.v[1] == cubeState['d']) exp = s.k[1] + 'u' + s.k[1].toUpperCase();
					else exp = s.k[2].toUpperCase() + 'U' + s.k[2];
				}
				else exp = 'U';
			}
			exp_log += exp;
			changeState(exp);
		}
		console.log('First Layer Corners Single Error: ', exp_log);
		return 'First Layer Corners Single Error: ' + exp_log;
	};

    // --------------- 底棱归位 | COMPLETE THE FIRST LAYER EDGES ---------------
	function FIRST_LAYER_EDGES()
	{
		console.log('------------ 第一步：底棱归位 | COMPLETE THE FIRST LAYER EDGES ------------');
		var order = '';
		order += FIRST_LAYER_EDGES_SINGLE('dl', cubeState['d'] + cubeState['l']);
		order += FIRST_LAYER_EDGES_SINGLE('df', cubeState['d'] + cubeState['f']);
		order += FIRST_LAYER_EDGES_SINGLE('dr', cubeState['d'] + cubeState['r']);
		order += FIRST_LAYER_EDGES_SINGLE('db', cubeState['d'] + cubeState['b']);
		return Compress(order)
		//Execute(order, "First layer edges");
	};

	// -------------- 底角归位 | COMPLETE THE FIRST LAYER CORNERS --------------
	function FIRST_LAYER_CORNERS()
	{
		console.log('------------ 第二步：底角归位  | COMPLETE THE FIRST LAYER CORNERS ------------');
		var order = '';
		order += FIRST_LAYER_CORNERS_SINGLE('dlf', cubeState['d'] + cubeState['l'] + cubeState['f']);
		order += FIRST_LAYER_CORNERS_SINGLE('dfr', cubeState['d'] + cubeState['f'] + cubeState['r']);
		order += FIRST_LAYER_CORNERS_SINGLE('drb', cubeState['d'] + cubeState['r'] + cubeState['b']);
		order += FIRST_LAYER_CORNERS_SINGLE('dbl', cubeState['d'] + cubeState['b'] + cubeState['l']);
		return Compress(order)
		//Execute(order, "First layer corners");
	}
	// --------------- 中棱归位 | COMPLETE THE SECOND LAYER ---------------

	// --------------- 顶部十字 | COMPLETE THE TOP CROSS --------------- 

	// ----- 顶角归位（位置） | COMPLETE THE THIRD LAYER CORNERS (POSITION) -----

	// ----- 顶角归位（方向） | COMPLETE THE THIRD LAYER CORNERS (ORIENT) -----

	// --------------- 顶棱归位 | COMPLETE THE THIRD LAYER EDGES --------------- 
	

	// 返回魔方复原步骤
    function Solve_Cube()
    {
		var solve_step = [];
		solve_step.push(FIRST_LAYER_EDGES());
		solve_step.push(FIRST_LAYER_CORNERS());
		Execute(solve_step);
	};

	// 压缩指令数，如：'uuu' = 'U'（逆时针转 270° = 顺时针转 90°）
    function Compress(order)
    {
		for(var i = 0; i < 10; i++)
		{
			order = order.replace(/uU|Uu|dD|Dd|lL|Ll|fF|Ff|rR|Rr|bB|Bb|uuuu|dddd|llll|ffff|rrrr|bbbb|UUUU|DDDD|LLLL|FFFF|RRRR|BBBB/g, '');
			order = order.replace(/uuu/g, 'U');
			order = order.replace(/ddd/g, 'D');
			order = order.replace(/lll/g, 'L');
			order = order.replace(/fff/g, 'F');
			order = order.replace(/rrr/g, 'R');
			order = order.replace(/bbb/g, 'B');
			
			order = order.replace(/UUU/g, 'u');
			order = order.replace(/DDD/g, 'd');
			order = order.replace(/LLL/g, 'l');
			order = order.replace(/FFF/g, 'f');
			order = order.replace(/RRR/g, 'r');
			order = order.replace(/BBB/g, 'b');
		}
		return order;
	};
    
    return false
}