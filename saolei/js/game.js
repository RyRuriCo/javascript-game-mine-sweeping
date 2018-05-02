window.onload = function(){
	game_load._load_mine();
	game_load._draw();
	game_load._checkMine();
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
    e.preventDefault();
    };
	
}


var game_load ={
	_flag:[],
	//0:地图数组（灰色格子）
	//1:1雷
	//2:2雷
	//3:3雷
	//4:4雷
	//5:5雷
	//6:6雷
	//7:7雷
	//8:8雷
	//10:雷
	//11:已点亮的格子
	_row:16,//
	_column:16,
	_cube_height:40,//方块高
	_cube_width:40,//方块长
	_map:[],//地图数组
	_mine_x:null,
	_mine_y:null,
	_mine_amount:40,
	temp:[0],
	arr:[1,2,3,4],
	find:[],
	defined:[],
	//生成格子画布
	_draw:function(){
		for(var x = 0;x<this._column;x++){
			for(var y = 0;y<this._row;y++){
			var _div = ff._create("div");
			_div.setAttribute("class","cube");
			_div.setAttribute("style","top:"+(y*this._cube_height)+"px;left:"+(x*this._cube_width)+"px;");
			_div.setAttribute("onmousedown","game_load.Allclick(this)");
			_div.setAttribute("id",y*this._column+x);
	//		_div.innerHTML=(y*this._column+x)+"<br/>"+"["+x+","+y+"]";
			ff._get("game_panel").appendChild(_div);
			}
		}
	},

	_load_mine:function(){
		for(var x = 0;x<this._column;x++){
				this._map[x] = [];
				this._flag[x] = [];
			for(var y = 0;y<this._row;y++){
				this._map[x][y] = 0;	//设地图数组普通为0
				this._flag[x][y] = 0;
			}
		}
		

		for(var j = 0;j<this._mine_amount;j++){	
			//这是随机生成10个雷而不重复的方法
			this._mine_x = Math.floor(Math.random()*this._row);					//
			this._mine_y = Math.floor(Math.random()*this._column);				//
			this.temp[j] = this._mine_y*this._column+this._mine_x;
		//	alert(j);
		//	alert(this.temp[j]);
			if(j==0){
				this._map[this._mine_x][this._mine_y] = 10;//雷在地图数组上为1！
			}else{
				for(var k = 0;k<this.temp.length-1;k++){
					if(this.temp[j]==this.temp[k]){
					//	alert(this.temp[j]);
					//	this.temp.pop();
						while(1){
							this._mine_x = Math.floor(Math.random()*this._row);
							this._mine_y = Math.floor(Math.random()*this._column);
							this.temp[j] = this._mine_y*this._column+this._mine_x;
							if(this.temp[j]!=this.temp[k]){
								k=-1;
								break;
							}
						}
					}
				}
				this._map[this._mine_x][this._mine_y] = 10;
			}

		}	
			//	document.write(this.temp);
	},

	//寻找四周方块的坐标（v1.0方法）
	_findMine:function(x,y){
				this.find.length = 0;
				if(x==this._column-1){
						if(y==this._row-1){//[9,9]
							this.find[0] = y*this._column+(x-1);
							this.find[1] = (y-1)*this._column+(x-1);
							this.find[2] = (y-1)*this._column+x;
						}else if(y==0){//[9,0]
							this.find[0] = y*this._column+(x-1);
							this.find[1] = (y+1)*this._column+(x-1);
							this.find[2] = (y+1)*this._column+x;
						}else{//[9,1]-[9,8]
							this.find[0] = (y-1)*this._column+x;
							this.find[1] = (y+1)*this._column+x;
							this.find[2] = (y-1)*this._column+(x-1);
							this.find[3] = y*this._column+(x-1);
							this.find[4] = (y+1)*this._column+(x-1);							
						}
					}else if(x==0){
						if(y==0){//[0,0]
							this.find[0] = y*this._column+(x+1);
							this.find[1] = (y+1)*this._column+(x+1);
							this.find[2] = (y+1)*this._column+x;
						}else if(y==this._row-1){//[0,9]
							this.find[0] = y*this._column+(x+1);
							this.find[1] = (y-1)*this._column+(x+1);
							this.find[2] = (y-1)*this._column+x;
						}else{//[0,1]-[0,8]
							this.find[0] = (y+1)*this._column+x;
							this.find[1] = (y-1)*this._column+x;
							this.find[2] = (y-1)*this._column+(x+1);
							this.find[3] = y*this._column+(x+1);
							this.find[4] = (y+1)*this._column+(x+1);
						}
					}else if(y==0){//[1,0]-[8,0]
							this.find[0] = y*this._column+(x-1);
							this.find[1] = y*this._column+(x+1);
							this.find[2] = (y+1)*this._column+(x-1);
							this.find[3] = (y+1)*this._column+x;
							this.find[4] = (y+1)*this._column+(x+1);
					}else if(y==this._row-1){//[1,9]-[8,9]							
							this.find[0] = y*this._column+(x-1);
							this.find[1] = y*this._column+(x+1);
							this.find[2] = (y-1)*this._column+(x-1);
							this.find[3] = (y-1)*this._column+x;
							this.find[4] = (y-1)*this._column+(x+1);
					}else{//	全
							this.find[0] = (y-1)*this._column+(x-1);
							this.find[1] = (y-1)*this._column+x;
							this.find[2] = (y-1)*this._column+(x+1);
							this.find[3] = y*this._column+(x-1);
							this.find[4] = y*this._column+(x+1);
							this.find[5] = (y+1)*this._column+(x-1);
							this.find[6] = (y+1)*this._column+x;
							this.find[7] = (y+1)*this._column+(x+1);
					}
	},

	_checkMine:function(){	//检查四周是否有雷并隐藏性填充数字。
		
		var quantity = 0;
		for(var x = 0;x<this._column;x++){
		 	for(var y = 0;y<this._row;y++){
				if(this._map[x][y]==0){ //边界数字的判断
					game_load._findMine(x,y);
				}else{
				 		continue;
					}
							for(var k=0;k<this.find.length;k++){
					//			alert(this.find);
								var a = this.find[k]%this._column;
								var b = (this.find[k]-a)/this._column;
								if(this._map[a][b]==10){
									quantity = quantity+1;
								}
							}						
							
					this._map[x][y] = quantity;
					quantity=0;

		 	}
		}
	},

	_outSpace:function(x,y){//根据一个坐标链型扩展0雷
		/**链式扩张！
			通过两个for循环与多个临时数组而实现无限循环
				最后的i=-1使外部循环得到重生！
		*/
		var cube = [];
		var space = [];
		var temp = [];
		cube.push(y*this._column+x);
		this._map[x][y] = 11;					//最开始找到的8个方块
		
					//把找到的8个方块放进临时数组里（注意！不能将数组直接push进数组里！）
		 var temp = [y*this._column+x];
	//	alert(temp);
		for(var i=0;i<temp.length;i++){
			var a1 = temp[i]%this._column;
			var b1 = (temp[i]-a1)/this._column;
			game_load._findMine(a1,b1);
			
			for(var j=0;j<this.find.length;j++){
		//	alert(temp[i]);
		//		alert(this.find.length);
		//		alert(this.find[j]);
				var a = this.find[j]%this._column;
				var b = (this.find[j]-a)/this._column;
		//		alert(a+","+b);
				if(this._map[a][b]==0){
					this._map[a][b] = 11;				//把找到的白方块转化为粉色状态方块
					space.push(b*this._column+a);		//把找到的白色方块存入临时的白方块数组里
					cube.push(b*this._column+a);		//把找到的白色方块存入所有白方块数组里
			//		alert(b*this._column+a);

				}
				if(i==temp.length-1){
				//	alert(i);
				//	alert(space.length)
					temp.length=0;
					for(var k=0;k<space.length;k++){
						temp.push(space[k]);
					}
					i=-1;
					space.length = 0;
				}
			}
		//	game_load._findMine();
		}

		for(var i=0;i<cube.length;i++){
			var a = cube[i]%this._column;
			var b = (cube[i]-a)/this._column;
			game_load._lightAll(a,b);
		}

	//	alert(cube);
	},

	_lightAll:function(a,b){
				game_load._findMine(a,b);
				for(var i = 0;i<this.find.length;i++){
						var x = this.find[i]%this._column;
						var y = (this.find[i]-x)/this._column;
					if(this._map[x][y]==1){
						ff._get(y*this._column+x).setAttribute("class","one");
					}else if(this._map[x][y]==2){
						ff._get(y*this._column+x).setAttribute("class","two");
					}else if(this._map[x][y]==3){
						ff._get(y*this._column+x).setAttribute("class","three");
					}else if(this._map[x][y]==4){
						ff._get(y*this._column+x).setAttribute("class","four");
					}else if(this._map[x][y]==5){
						ff._get(y*this._column+x).setAttribute("class","five");
					}else if(this._map[x][y]==6){
						ff._get(y*this._column+x).setAttribute("class","six");
					}else if(this._map[x][y]==7){
						ff._get(y*this._column+x).setAttribute("class","seven");
					}else if(this._map[x][y]==8){
						ff._get(y*this._column+x).setAttribute("class","eight");
					}else if(this._map[x][y]==0){
						ff._get(y*this._column+x).setAttribute("class","nomine");
						this._map[x][y]==11;
					}else if(this._map[x][y]==11){
						ff._get(y*this._column+x).setAttribute("class","nomine");
					}
				}			
	},

	_Clickright:function(index){
		var x = index%this._column;
		var y = (index-x)/this._column;
		var kind = this._map[x][y];
			if(this._flag[x][y]==0){
					this._flag[x][y]=22;//代表旗子！
					ff._get(y*this._column+x).setAttribute("class","flag");
			}else if(this._flag[x][y]==22){

					this._flag[x][y]==0;
					ff._get(y*this._column+x).setAttribute("class","cube");
			}
	},

	Allclick:function(_this){
		var index = _this.id;
		document.onmousedown = function(e){  
	        var e = e || window.event;  
	        if(e.button == "2"){ 
	//        	alert("2")
	            game_load._Clickright(index);
	        }else if(e.button == "0"){
	//        	alert("0")
	        	game_load._Clickleft(index);
	        }
    	}  

	},

	_Clickleft:function(index){//左键单击事件

		var x = index%this._column;
		var y = (index-x)/this._column;
				if(this._map[x][y]==0){
					ff._get(y*this._column+x).setAttribute("class","nomine");
					game_load._outSpace(x,y);
				}else if(this._map[x][y]==1){
					ff._get(y*this._column+x).setAttribute("class","one");
				}else if(this._map[x][y]==2){
					ff._get(y*this._column+x).setAttribute("class","two");
				}else if(this._map[x][y]==3){
					ff._get(y*this._column+x).setAttribute("class","three");
				}else if(this._map[x][y]==4){
					ff._get(y*this._column+x).setAttribute("class","four");
				}else if(this._map[x][y]==5){
					ff._get(y*this._column+x).setAttribute("class","five");
				}else if(this._map[x][y]==6){
					ff._get(y*this._column+x).setAttribute("class","six");
				}else if(this._map[x][y]==7){
					ff._get(y*this._column+x).setAttribute("class","seven");
				}else if(this._map[x][y]==8){
					ff._get(y*this._column+x).setAttribute("class","eight");
				}else if(this._map[x][y]==10){
					ff._get(y*this._column+x).setAttribute("class","mine");
					alert("游戏结束！")
				}else if(this._map[x][y]==11){
					return;
				}else{
					return;
				}
		
	},
}



var ff = {
	_get:function(id){
	return document.getElementById(id);	
	},
	_create:function(element){
	return document.createElement(element);
	}

}