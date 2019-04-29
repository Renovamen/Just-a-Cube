
window.solver = new ERNO.Solver();
solver.logic = function(cube)
{
    // ---------------------- 魔方目前的状态 ----------------------
	var cubeState = {
		d:   'w',   u:   'y',   l:   'o',   f:   'b',   r:   'r',   b:   'g',
		dl:  'wo',  df:  'wb',  dr:  'wr',  db:  'wg',
		ul:  'yo',  uf:  'yb',  ur:  'yr',  ub:  'yg',
		lf:  'ob',  fr:  'br',  rb:  'rg',  bl:  'go',
		dlf: 'wob', dfr: 'wbr', drb: 'wrg', dbl: 'wgo',
		ulf: 'yob', ufr: 'ybr', urb: 'yrg', ubl: 'ygo'
	};

	var Next_Face = {l:'f',f:'r',r:'b',b:'l'};
	var Pre_Face = {l:'b',b:'r',r:'f',f:'l'};
    var Next_Color = {o:'b',b:'r',r:'g',g:'o'};

    var order_list = ''
    for(order of cube.twistQueue.history)
    {
        if(order.command == 'X' || order.command == 'Y' || order.command == 'Z'
        || order.command == 'x' || order.command == 'y' || order.command == 'z')continue;
		
		order_list += order.command
	}
	console.log(order_list)
    changeState(order_list)

	var solve_step = Solve_Cube();
	console.log(solve_step)
	
	if(solve_step != '')
	{
		cube.twist(solve_step);
		$('.terminal').typewriting("底部十字：" + solve_step,{
			"cursor_color": "#ffffff",
		})
	}
	else 
	{
		$('.terminal').typewriting("底部十字已完成",{
			"cursor_color": "#ffffff",
		})
	}
	console.log('The first layer cross is already completed.')

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
					Twist_D(), Twist_D(), Twist_D();
					break;
				case 'U': 	//U: Up 面顺时针旋转 90°
					Twist_U();
					break;
				case 'u': 	//u: Up 面逆时针旋转 90°
					Twist_U(), Twist_U(), Twist_U();
					break;
				case 'L': 	//L: Left 面顺时针旋转 90°
					Twist_L();
					break;
				case 'l': 	//l: Left 面逆时针旋转 90°
					Twist_L(), Twist_L(), Twist_L();
					break;
				case 'F': 	//F: Front 面顺时针旋转 90°
					Twist_F();
					break;
				case 'f': 	//f: Front 面逆时针旋转 90°
					Twist_F(), Twist_F(), Twist_F();
					break;
				case 'R': 	//R: Right 面顺时针旋转 90°
					Twist_R();
					break;
				case 'r': 	//r - Right 面逆时针旋转 90°
					Twist_R(), Twist_R(), Twist_R();
					break;
				case 'B': 	//B - Back 面顺时针旋转 90°
					Twist_B();
					break;
				case 'b': 	//b - Back 面逆时针旋转 90°
					Twist_B(), Twist_B(), Twist_B();
					break;
			}
		}
    };
    
   
    // ---------------------------- 层先法还原 ---------------------------- 

    // 查找当前要调整的棱块所在位置
    function Edge_Pos(block_color)
    {
        for(var pos of Pos_List)
        {
            // 两个块拥有的元素是否相同（数组元素是否相同）
            
            var color = Block_Color(pos)
            //console.log(color)
            if(color.sort().toString() == block_color.sort().toString())
                return {pos: pos, color: color};
        }
    }

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
					if(s.k == block_pos)return exp_log;		//最终返回指令
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

    // --------------- 底棱归位 | COMPLETE THE FIRST LAYER EDGES ---------------
	function FIRST_LAYER_EDGES()
	{
		console.log('------------ 第一步：底棱归位 | COMPLETE THE FIRST LAYER EDGES ------------');
		var order = '';
		order += FIRST_LAYER_EDGES_SINGLE('dl', 'wo');
		order += FIRST_LAYER_EDGES_SINGLE('df', 'wb');
		order += FIRST_LAYER_EDGES_SINGLE('dr', 'wr');
		order += FIRST_LAYER_EDGES_SINGLE('db', 'wg');
		return order;
	};

	// -------------- 底角归位 | COMPLETE THE FIRST LAYER CORNERS --------------

	// --------------- 中棱归位 | COMPLETE THE SECOND LAYER ---------------

	// --------------- 顶部十字 | COMPLETE THE TOP CROSS --------------- 

	// ----- 顶角归位（位置） | COMPLETE THE THIRD LAYER CORNERS (POSITION) -----

	// ----- 顶角归位（方向） | COMPLETE THE THIRD LAYER CORNERS (ORIENT) -----

	// --------------- 顶棱归位 | COMPLETE THE THIRD LAYER EDGES --------------- 
	

	// 返回魔方复原步骤
    function Solve_Cube()
    {
		var solve_order = '';
		solve_order += FIRST_LAYER_EDGES();
		return Compress(solve_order);
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