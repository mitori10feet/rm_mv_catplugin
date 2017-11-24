//=============================================================================
// Chimaki_Rabbitsurviva.js
// Version: 0.0.1
//=============================================================================
/*:
* @plugindesc 兔子生存功能
* @author Chimaki 
* 
* @param MenuSwitch
* @desc This is the switch of all system.
* @default 90
*
* @param BookUISwitch 
* @desc 按X要不要啟用書本Menu開關
* @default 89
*
* @param Heart_01
* @desc 最右邊愛心 顯示開關;啟動開關;控制增減變數;最大值;最後紀錄現在值變數
* @default 80;79;80;100;79
*
* @param Heart_02
* @desc  中間的量表 顯示開關;啟動開關;控制增減變數;最大值;最後紀錄現在值變數
* @default 78;77;78;100;77
*
* @param Heart_03
* @desc 最左邊的量表 顯示開關;啟動開關;控制增減變數;最大值;最後紀錄現在值變數
* @default 76;75;76;100;75
*
* @param TimerHoru
* @desc 時針的位置變數,系統用,留一個變數編號給我用就對了,感謝
* @default 90
*
* @param TimerSceond
* @desc 指針的位置變數,系統用,留一個變數編號給我用就對了,感謝
* @default 89
*
* @param DayVar
* @desc 天數的變數,直接修改就可以改變日期
* @default 88
*
* @param offsetXY
* @desc 愛心座標微調整
* @default -10;5
* 
* @param offsetNumXY
* @desc 愛心數字座標微調整
* @default 0;7
*
*
* @param TimerVar
* @desc 時間變數,系統用,留一個變數編號給我用就對了,感謝
* @default 87
* 
* @param TimerVarTemp
* @desc 時間變數暫存,系統用,留一個變數編號給我用就對了,感謝
* @default 86
* 
* @param DaySwitch
* @desc 日期與日期底圖的顯示開關
* @default 88
* 
* @param ClockSwitch
* @desc 時鐘/指針開關
* @default 21
* 
* @param DayOffset
* @desc 日期微調座標 X ;微調座標 Y;
* @default -30;-40
*
* ============================================================================
* @help
* 12/28 修正圖片寬高錯位
* 0.0.1
* ＊＊＊＊＊使用教學＊＊＊＊＊
* 需要搭配Chimaki_ManagerTool一起使用, 讀圖路徑設定都在Chimaki_ManagerTool
* Surviva start 讓時鐘開始計時
* Surviva stop 讓時鐘暫停計時
* Surviva reset 讓時鐘數字歸 0
* Surviva addMin 1  = 加1分鐘, 減少則輸入負數
* Surviva addHour 1  = 加1小時
* 
* 注意事項:
* Heart_01 ~03 中的 '啟動開關' 目前還沒有用處, 但還是先請依照格式填寫參數
* 
*/
//=============================================================================
//=============================================================================
// Plugin Start
//=============================================================================
var Imported = Imported || {};
Imported.Chimaki_Rabbitsurviva = {};

function Game_SurTimer (){
    this.initialize.apply(this, arguments);
}

(function(){

	

	var Chimaki_parameters = PluginManager.parameters('Chimaki_Rabbitsurviva');
	var Chimaki_Rabbitsurviva = Imported.Chimaki_Rabbitsurviva;
	var chimaki = Chimaki_Rabbitsurviva;

	var Img = {};
	Img.Clock = { width: 260, height: 260};
	Img.Calendar = { width: 260, height: 260};
	Img.PointerH = { width: 260, height: 260};
	Img.PointerS = { width: 260,height: 260}
	Img.Heart = { width: 136, height: 126};
	Img.Book = {width: 1280 , height: 720}
	Img.Day = {width: 38 , height: 52 , num: 13}
	Img.Num = {blt : 38} ;


 	chimaki.layout1 = 1;
 	chimaki.layout2 = 2;
 	chimaki.layout3 = 3;
	chimaki.timerVarH = Math.floor(Chimaki_parameters['TimerHoru'] || 90); 
	chimaki.timerVarS = Math.floor(Chimaki_parameters['TimerSceond'] || 89); 
	chimaki.dayVar = Math.floor(Chimaki_parameters['DayVar'] || 88); 
	chimaki.all_switch = Math.floor(Chimaki_parameters['MenuSwitch'] || 90); 
	
	chimaki.daySwitch = Math.floor(Chimaki_parameters['DaySwitch'] || 88);
	chimaki.clockSwitch = Math.floor(Chimaki_parameters['ClockSwitch'] || 87); 

	chimaki.book_ui = Math.floor(Chimaki_parameters['BookUISwitch']|| 89);	

	var timerVar = chimaki.timerVar = Math.floor(Chimaki_parameters['TimerVar'] || 87);
	var timerVarTemp = chimaki.timerVarTemp = Math.floor(Chimaki_parameters['TimerVarTemp'] || 86);
	var h1 = chimaki.heart_01 = Chimaki_parameters["Heart_01"].split(";") ;
	var h2 = chimaki.heart_02 = Chimaki_parameters["Heart_02"].split(";") ;
	var h3 = chimaki.heart_03 = Chimaki_parameters["Heart_03"].split(";") ;
	var heartOffset = Chimaki_parameters["offsetXY"].split(";") ;
	var offsetNumXY = Chimaki_parameters["offsetNumXY"].split(";") ;

	for (var i in heartOffset){
		heartOffset[i] =  Number(heartOffset[i]) ;
	}
	for (var i in offsetNumXY){
		offsetNumXY = Number(offsetNumXY[i]);
	}

	chimaki.dayoffset = Chimaki_parameters['DayOffset'].split(";");

	var fristFlag = false;

	var day_offsetX = 70;
	var day_offsetY = 100;

	var temp_switch = false;

//=============================================================================
// Timer for surviva
//=============================================================================


	Game_SurTimer.prototype.initialize = function(startTime) {
	    this._frames = 0;
	    this._working = false;
	};

	Game_SurTimer.prototype.update = function() { // 開始計算時間
	    if (this.isWorking()) {
	        this._frames++;

	    }
	    if (this._frames >= 43200){
	    	this._frames = 0 ;
	    	var num = $gameVariables.value(chimaki.dayVar) + 1;
	    	$gameVariables.setValue(chimaki.dayVar,num);
	    }

	};

	Game_SurTimer.prototype.reset = function() { // 開始計算時間
		this._frames = 0;
	};

	Game_SurTimer.prototype.start = function(count) {		
	    this._frames = count || 0;
	    this._working = true;
	};

	Game_SurTimer.prototype.setTimer = function(count){
		this._frames = count;
		this._working = true;
	}

	Game_SurTimer.prototype.stop = function() {
	    this._working = false;
	    return this._frames;
	};

	Game_SurTimer.prototype.isWorking = function() {
	    return this._working;
	};

	Game_SurTimer.prototype.seconds = function() {
	    return Math.floor(this._frames / 60);
	};
	Game_SurTimer.prototype.addMin = function(num){
		num *= 60;
		this._frames += num;
		return this._frames;
	}
	Game_SurTimer.prototype.addHour = function(num){
		num *= 3600;
		this._frames += num;
		return this._frames;
	}	


//=============================================================================
// plugin command
//=============================================================================	

	var $gameSurTime = new Game_SurTimer();	

	var chimaki_rabbitsurviva_plugincommand = Game_Interpreter.prototype.pluginCommand;        
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
    	chimaki_rabbitsurviva_plugincommand.call(this, command, args);
    	if (command === 'Surviva') {
    		switch (args[0]){
    			case 'start':
    				$gameSurTime.start($gameVariables.value(timerVarTemp));
    				break;    				
    			case 'stop':
    				$gameVariables.setValue(timerVarTemp ,$gameSurTime.stop()); 
    				break;    				
    			case 'reset':
    				$gameSurTime.reset();
    				$gameVariables.setValue(timerVarTemp ,0); 
    				break;    			
    			case 'addMin':
    				$gameVariables.setValue(timerVarTemp ,$gameSurTime.addMin(args[1])); 
					break;    			
    			case 'addHour':
    				$gameVariables.setValue(timerVarTemp ,$gameSurTime.addHour(args[1])); 
					break;    			

    		}
    	}
    }
    
//=============================================================================
// base timer
//=============================================================================	

	Scene_Base.prototype.update = function() {
		$gameSurTime.update();
	    this.updateFade();
	    this.updateChildren();
	    AudioManager.checkErrors();
	};
//=============================================================================
// Scene_map調整
//=============================================================================	
	var SceneUI = Scene_Map.prototype;
	var chimaki_ui_init = SceneUI.initialize;
	Scene_Map.prototype.initialize = function(){
		chimaki_ui_init.call(this);
		this._lastH1Num = $gameVariables.value(h1[2]);
		this._lastAllSwitch = $gameSwitches.value(chimaki.all_switch);

	}


	Scene_Map.prototype.allSubSprite = function (){
		if ($gameSwitches.value(chimaki.all_switch)){
			this._spriteset.allSubSp().forEach(function (sp ){
				log('GGGGGG')
				if (sp && !sp.visible){
					sp.visible = true;
				}
			});
			this._spriteset.allArrSp().forEach(function (sps ){
				for (var i = 0; i < sps.length;i++){
					var sp = sps[i];
					if (sp && !sp.visible){
						sp.visible = true;
					}					
				}
			});
		}

		else {

			this._spriteset.allSubSp().forEach(function (sp ){
				log('YYYYYYY')
				if (sp && sp.visible){
					sp.visible = false;
				}
			});
			this._spriteset.allArrSp().forEach(function (sps ){
				for (var i = 0; i < sps.length;i++){
					var sp = sps[i];
					if (sp && sp.visible){
						sp.visible = false;
					}					
				}
			});
		}
	}	


	var chimaki_ui_start = Scene_Map.prototype.start;	
	Scene_Map.prototype.start = function(){		
		// this.checkallsp();

		chimaki_ui_start.call(this);	
		this._spriteset.refreshHeartNum();		
		this.allSubSprite();
	// SpriteSurViva.allSubSp = function (){
	// 	return [this._heart_01, this._heart_02, this._heart_03, this._pointerH, this._pointerS, this._calendar]
	// }

	// SpriteSurViva.allArrSp = function (){
	// 	return  [this._days , this._hearts];
	// }

		

	}
	Scene_Map.prototype.checkAll = function (){
			this._spriteset.refreshH1();
			this._spriteset.refreshH2();
			this._spriteset.refreshH3();

			this._spriteset._lastDay = $gameVariables.value(chimaki.dayVar) || 0;
			this._spriteset.refreshCalendar();
			this._spriteset.refreshDay();
			this._spriteset.refreshTimer();
			this._spriteset.refreshHeartNum();	
	}
	var chimaki_ui_stop = Scene_Map.prototype.stop;
	Scene_Map.prototype.stop = function(){
		chimaki_ui_stop.call(this);
		$gameVariables.setValue(chimaki.timerVarH , this._spriteset._pointerH.rotation);
		$gameVariables.setValue(chimaki.timerVarS , this._spriteset._pointerS.rotation);
	}	
	
	var chimaki_ui_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function(){		
		this._spriteset.refreshDay();				
		chimaki_ui_update.call(this);
		if (!fristFlag){
			// this._spriteset.refreshHeartNum();
			this.checkAll();
			fristFlag = true;

		}		
		if (this._lastH1Num != $gameVariables.value(h1[2])){
			this._lastH1Num = $gameVariables.value(h1[2]);
			this._spriteset.refreshHeartNum();
		}

		if (this._lastAllSwitch != $gameSwitches.value(chimaki.all_switch)){
			this._lastAllSwitch = $gameSwitches.value(chimaki.all_switch)
			this.allSubSprite();
		}

	}
//=============================================================================
// call menu 還用不到
//=============================================================================	
	// var chimaki_scene_callUI = SceneUI.callMenu;
	// SceneUI.callMenu = function(){
	// 	if ($gameSwitches.value(chimaki.book_ui)){
	// 		SceneManager.push(Scene_MenuSurviva);
	// 	};
	// 	chimaki_scene_callUI.call(this);
	// }


//=============================================================================
// 為了改變圖層 改用sprite set
//=============================================================================	


	var SpriteSurViva = Spriteset_Map.prototype;
	var chimaki_init = Spriteset_Base.prototype.initialize;
	Spriteset_Map.prototype.initialize = function() {
		this._subHeart = [];
		this.initSurviva();
	    this.initHearts();
	    chimaki_init.call(this);
		this.createSurvivaUi();
		
	}
//=============================================================================
// 初始化區塊
//=============================================================================	
	Spriteset_Map.prototype.initSurviva = function(){
		this._lastTimerSecond = -1;
		var num = $gameVariables.value(chimaki.dayVar)
		this.setDayNum(num);
		this._daySwitch = null;
		this._LastHeartSwitch_01 = null;
		this._LastHeartSwitch_02 = null;
		this._LastHeartSwitch_03 = null;
	}
//=============================================================================
// 初始化愛心參數
//=============================================================================		
	Spriteset_Map.prototype.initHearts = function(){
		// h1
		this._h1Value = {};
		this._h1Value.last = $gameVariables.value(h1[4]);
		$gameVariables.setValue(h1[2], this._h1Value.last);		
		// h2
		this._h2Value = {};
		this._h2Value.last = $gameVariables.value(h2[4]);
		$gameVariables.setValue(h2[2], this._h2Value.last);				
		// h3
		this._h3Value = {};
		this._h3Value.last = $gameVariables.value(h3[4]);
		$gameVariables.setValue(h3[2], this._h3Value.last);				
		
	}	

//=============================================================================
// 初始化日期參數
//=============================================================================		
	Spriteset_Map.prototype.setDayNum = function(num){
		var num = num || this._lastDay ;
		this._days = [0, 1, 2];
		this._days[0] = Math.floor(num / 100) || 0;
		this._days[1] = Math.floor((num /10 ) % 10) || 0;
		this._days[2] = num % 10 || 0;
	}	
//=============================================================================
// 建立圖片區塊
//=============================================================================			
	Spriteset_Map.prototype.createSurvivaUi = function(){

		this.createCalendar();
		this.createDay();
		this.createClock();
		this.createClockPointerH()
		this.createClockPointerS()
		this.createHeart();
		this.createHeartVar1();
		this.createHeartVar2();
		this.createHeartVar3();
		this.createAllHeartNum();
		
	}
	Spriteset_Map.prototype.createAllHeartNum = function (){
		this.createHeartNum1();	
	}
	

	Spriteset_Map.prototype.subHerartNum = function(){
		return [this._heart_02,this._heart_03];
	}
//=============================================================================
// 建立圖片日期
//=============================================================================		
	Spriteset_Map.prototype.createDay = function(){
		this._day = [0,1,2];
		for (var i = 0; i < this._day.length; i++){
			this._day[i] = new Sprite();
			this._day[i].bitmap = ImageManager.loadRabbitsurvival("Digital");
			this._day[i].x = day_offsetX + i * Img.Day.width + Math.floor(chimaki.dayoffset[0]);
			this._day[i].y = day_offsetY + Math.floor(chimaki.dayoffset[1]);
			this._day[i].setFrame(0 + this._days[i] * Img.Day.width , 0, Img.Day.width ,Img.Day.height);
			this.addChildAt(this._day[i],chimaki.layout2);			
			if ($gameSwitches.value(chimaki.daySwitch)){
				this._day[i].visible = false;
			}
		}
	}
//=============================================================================
// 建立愛心底圖
//=============================================================================			
	SpriteSurViva.createHeart = function(){
		this._hearts = [0, 1, 2];

		for (var i = 0; i < this._hearts.length; i++){
			var H;
			this._hearts[i] = new Sprite();
			this._hearts[i].bitmap = ImageManager.loadRabbitsurvival("Heart_01");
			this._hearts[i].x = (Graphics._boxWidth - Img.Heart.width * (i + 1)) ;
			this._hearts[i].x += heartOffset[0];
			this._hearts[i].y += heartOffset[1];


			if (i == 0){
				H = h1;
			}
			else if (i == 1){
				H = h2;
			}
			else if (i == 2){
				H = h3;
			}


			// if ($gameSwitches.value(H[i])){
			this.addChildAt(this._hearts[i], 1);	
			// }
			
		}

	}		
//=============================================================================
// 建立愛心
//=============================================================================			

	SpriteSurViva.createHeartVar2 = function(){
		this._heart_02 = new Sprite();
		this._heart_02.bitmap = ImageManager.loadRabbitsurvival("Content_02");
		this._heart_02.x = this._hearts[1].x + heartOffset[0];
		if ($gameSwitches.value(h2[0])){
			this.addChildAt(this._heart_02,chimaki.layout3);		
			if ($gameVariables.value(h2[2]) < 0) $gameVariables.setValue(h2[2] , 0); 
			if ($gameVariables.value(h2[2]) > 100) $gameVariables.setValue(h2[2] , 100);
			this.refreshH2();
		}

	}
	SpriteSurViva.createHeartVar3 = function(){
		this._heart_03 = new Sprite();
		this._heart_03.bitmap = ImageManager.loadRabbitsurvival("Content_03");
		this._heart_03.x = this._hearts[2].x + heartOffset[0];
		if ($gameSwitches.value(h3[0])){
			this.addChildAt(this._heart_03,chimaki.layout3);
			if ($gameVariables.value(h3[2]) < 0) $gameVariables.setValue(h3[2] , 0); 
			if ($gameVariables.value(h3[2]) > 100) $gameVariables.setValue(h3[2] , 100);
			this.refreshH3();			
		}

	}			
//=============================================================================
// 建立日期底圖
//=============================================================================			
	SpriteSurViva.createCalendar = function(){
		this._calendar = new Sprite();
		this._calendar.bitmap = ImageManager.loadRabbitsurvival("Calendar");		
		this._calendar.x = 0 + Math.floor(chimaki.dayoffset[0]);
		this._calendar.y = 0 + Math.floor(chimaki.dayoffset[1]);
		this.addChildAt(this._calendar, chimaki.layout1);

	}
//=============================================================================
// 時鐘底圖
//=============================================================================				

	SpriteSurViva.createClock = function(){
		this._clock = new Sprite();
		this._clock.bitmap = ImageManager.loadRabbitsurvival("Clock");
		this._clock.x = this._calendar.x;
		this._clock.y = this._calendar.y + Img.Clock.height;
		if ($gameSwitches.value(chimaki.clockSwitch)){
			this.addChildAt(this._clock,chimaki.layout1);	
		}
		
	}
//=============================================================================
// 時針
//=============================================================================					
	SpriteSurViva.createClockPointerH = function(){
		this._pointerH = new Sprite();
		this._pointerH.bitmap = ImageManager.loadRabbitsurvival("Pointer_02");
		this._pointerH.x = Img.PointerH.width /2 ;
		this._pointerH.y = this._clock.y + Img.PointerH.height / 2 ;		
		this._pointerH.anchor.x = 0.5;
		this._pointerH.anchor.y = 0.5;
		this._pointerH.rotation = $gameVariables.value(chimaki.timerVarH) || 0;
		if ($gameSwitches.value(chimaki.clockSwitch)){
			this.addChildAt(this._pointerH,chimaki.layout2);
		}
	}	
//=============================================================================
// 分針
//=============================================================================						
	SpriteSurViva.createClockPointerS = function(){
		var offsetY = 114;
		var offsetX = 0;
		this._pointerS = new Sprite();
		this._pointerS.bitmap = ImageManager.loadRabbitsurvival("Pointer_01");
		this._pointerS.x = Img.PointerS.width / 2 ;
		this._pointerS.y = this._clock.y + Img.PointerS.height / 2 ;
		this._pointerS.anchor.x = 0.5;
		this._pointerS.anchor.y = 0.5;
		this._pointerS.rotation = $gameVariables.value(chimaki.timerVarS) || 0;		
		if ($gameSwitches.value(chimaki.clockSwitch)){
			this.addChildAt(this._pointerS,chimaki.layout2);
		}
		this.refreshTimer();

	}
//=============================================================================
// 刷新區塊
//=============================================================================					
//=============================================================================
// 刷新時針指針
//=============================================================================
	var chimaki_sprite_update = SpriteSurViva.update;
	SpriteSurViva.update = function(){
		chimaki_sprite_update.call(this);
		this.updateSurviva();


	}
	SpriteSurViva.updateSurviva = function(){
		this.updateTimer();
		this.updateHearts();
		this.updateSurDay();

	}
		// this._daySwitch = false;
		// this._HeartSwitch_01 = false;	
	SpriteSurViva.updateSurDay = function(){
		if (this._calendar ){
			if (this._daySwitch != $gameSwitches.value(chimaki.daySwitch)) {
				if ($gameSwitches.value(chimaki.daySwitch)){
					this._calendar.visible = true;
					for (var i = 0; i < this._day.length; i++){
						 this._day[i].visible = true;
					}
				}
				else if (!$gameSwitches.value(chimaki.daySwitch)){
					this._calendar.visible = false;	
					for (var i = 0; i < this._day.length; i++){
						 this._day[i].visible = false;
					}				
				}
				this._daySwitch = $gameSwitches.value(chimaki.daySwitch);
			}
		}
	}	

	SpriteSurViva.updateTimer = function(){
		//先處理timer 再調整show 圖
		if (this._lastTimerSecond != $gameSurTime.seconds()){
			this.refreshTimer();
		}
	}
		// this._LastHeartSwitch_01 = false;
		// this._LastHeartSwitch_02 = false;
		// this._LastHeartSwitch_03 = false;

	SpriteSurViva.updateHearts = function(){
		// 圖片顯示部份



		if (this._heart_01 && this._LastHeartSwitch_01 != $gameSwitches.value(h1[0])){
			if ($gameSwitches.value(h1[0])){
				this._heart_01.visible = true;
				this._hearts[0].visible = true;
				
			}
			else if (!$gameSwitches.value(h1[0])){
				this._heart_01.visible = false;
				this._hearts[0].visible = false;				
				this._heart_01_num.visible = false;
			}
			this._LastHeartSwitch_01 = $gameSwitches.value(h1[0]);
		}


		if (this._heart_02 && this._LastHeartSwitch_02 != $gameSwitches.value(h2[0])){
			if ($gameSwitches.value(h2[0])){
				this._heart_02.visible = true;
				this._hearts[1].visible = true;
				
			}
			else if (!$gameSwitches.value(h2[0])){
				this._heart_02.visible = false;
				this._hearts[1].visible = false;				
			}
			this._LastHeartSwitch_02 = $gameSwitches.value(h2[0]);
		}

		if (this._heart_03 && this._LastHeartSwitch_03 != $gameSwitches.value(h3[0])){
			if ($gameSwitches.value(h3[0])){
				this._heart_03.visible = true;
				this._hearts[2].visible = true;
				
			}
			else if (!$gameSwitches.value(h3[0])){
				this._heart_03.visible = false;
				this._hearts[2].visible = false;				
			}
			this._LastHeartSwitch_03 = $gameSwitches.value(h3[0]);
		}


		// 數字改變顯示部分
		if(this._h1Value.last != $gameVariables.value(h1[2])){
			
			if ($gameVariables.value(h1[2]) < 0) $gameVariables.setValue(h1[2] , 0); 
			if ($gameVariables.value(h1[2]) > 100) $gameVariables.setValue(h1[2] , 100);
			this.refreshH1();	

			this._h1Value.last = $gameVariables.value(h1[2]);
			$gameVariables.setValue(h1[4],this._h1Value.last); //刷新外層紀錄
		}
		if(this._h2Value.last != $gameVariables.value(h2[2])){
			if ($gameVariables.value(h2[2]) < 0) $gameVariables.setValue(h2[2] , 0); 
			if ($gameVariables.value(h2[2]) > 100) $gameVariables.setValue(h2[2] , 100); 
			this.refreshH2();	
			this._h2Value.last = $gameVariables.value(h2[2]);
			$gameVariables.setValue(h2[4],this._h2Value.last); //刷新外層紀錄
		}		
		if(this._h3Value.last != $gameVariables.value(h3[2])){
			if ($gameVariables.value(h3[2]) < 0) $gameVariables.setValue(h3[2] , 0); 
			if ($gameVariables.value(h3[2]) > 100) $gameVariables.setValue(h3[2] , 100); 
		 	this.refreshH3();	
		 	this._h3Value.last = $gameVariables.value(h3[2]);
		 	$gameVariables.setValue(h3[4],this._h3Value.last); //刷新外層紀錄
		}				
	}
//=============================================================================
// 我的一顆心相關刷新
//=============================================================================	
	SpriteSurViva.refreshTimer = function(){
		if (this._pointerS && this._pointerH){
			this._pointerS.rotation = ($gameSurTime.seconds() % 60) * 0.105;
			this._pointerH.rotation = $gameSurTime.seconds() * 0.105 / 12 ;
			this._lastTimerSecond = $gameSurTime.seconds()
		}
	}
	SpriteSurViva.refreshCalendar = function(){
		this._calendar.x = 0 + Math.floor(chimaki.dayoffset[0]);
		this._calendar.y = 0 + Math.floor(chimaki.dayoffset[1]);
	}

	SpriteSurViva.refreshDay = function(){
		if (this._lastDay != $gameVariables.value(chimaki.dayVar)){
			this.setDayNum($gameVariables.value(chimaki.dayVar));
			for (var i = 0; i < this._day.length; i++){
				this._day[i].x = day_offsetX + i * Img.Day.width + Math.floor(chimaki.dayoffset[0]);
				this._day[i].y = day_offsetY + Math.floor(chimaki.dayoffset[1]); 
				this._day[i].setFrame(0 + this._days[i] * Img.Day.width , 0, Img.Day.width ,Img.Day.height);
			}			
			this._lastDay = $gameVariables.value(chimaki.dayVar);
		}
	}


	SpriteSurViva.refreshH2 = function(){				
		var tmp = (h2[3] - $gameVariables.value(h2[2])) || 0;
		var offset = tmp / h2[3];
		offset *= Img.Heart.height;
		this.refreshHeart(this._heart_02, offset);
	}	

	SpriteSurViva.refreshH3 = function(){		
		var tmp = (h3[3] - $gameVariables.value(h3[2])) || 0;
		var offset = tmp / h3[3];
		offset *= Img.Heart.height;
		this.refreshHeart(this._heart_03, offset);
	}	

	SpriteSurViva.refreshHeart = function(sprite , offset , x, y, width, height){
		var w = width || Img.Heart.width;
		var h = height || Img.Heart.height;
		var x = sprite.x;
		var y = sprite.y;

		sprite.y = offset ;
		sprite.y += heartOffset[1];
		sprite.setFrame( 0, offset, w, h);
	}



	SpriteSurViva.refreshH1 = function(){
		if ($gameSwitches.value(h1[0])){
			this._heart_01.visible = true;
		}
		else {
			this._heart_01.visible = false;	
		}

		var tmp = (h1[3] - $gameVariables.value(h1[2]));
		var offset = tmp / h1[3];
		offset *= Img.Heart.height; 
		$gameVariables.value(h1[2])
		
		this.refreshHeart(this._heart_01, offset);
		
	}	
	SpriteSurViva.createHeartVar1 = function(){
		this._heart_01 = new Sprite(ImageManager.loadRabbitsurvival("Content_01"));
		this._heart_01.x = this._hearts[0].x ;
		this._heart_01.y = this._hearts[0].y + heartOffset[1];
		this.addChildAt(this._heart_01,chimaki.layout3);

		if ($gameVariables.value(h1[2]) < 0) $gameVariables.setValue(h1[2] , 0); 
		if ($gameVariables.value(h1[2]) > 100) $gameVariables.setValue(h1[2] , 100);
		this._heart_01.visible = false;
		this.refreshH1();
	}	


	SpriteSurViva.createHeartNum1 = function (){
		var list = [0, 1, 2];
		this._heart_01_num = new Sprite();
		this._heart_01_num.x = this._hearts[0].x;
		this._heart_01_num.y = this._hearts[0].y + heartOffset[1];

		for (var i = 0; i < list.length; i ++){
			var sp = new Sprite(ImageManager.loadRabbitsurvival("Digital"));
			sp.x += Img.Heart.width / 2 - Img.Day.width /2
			sp.y = this._hearts[0].y;
			sp.setFrame(0, 0, Img.Day.width ,Img.Day.height);
			sp.visible = false;
			this._heart_01_num.addChild(sp);
		}		
		
		this.addChildAt(this._heart_01_num, chimaki.layout2 + 3);
	}
	SpriteSurViva.allSubSp = function (){
		return [this._heart_01, this._heart_02, this._heart_03, this._pointerH, this._pointerS, this._calendar, this._heart_01_num]
	}

	SpriteSurViva.allArrSp = function (){
		return  [this._days , this._hearts, this._day, this._heart_01_num];
	}

	SpriteSurViva.refreshHeartNum = function (){
		this.closeNum()
		var num = ($gameVariables.value(h1[2]) + "").split("");
		var len = num.length;
		var m = len + 2;
		var offetX = 4;
		var offsetY = -4;
		
		for (var i = 0; i < len; i++){

			if (len == 1){
				var s = this._heart_01_num.children[i];
				s.x = Math.floor(  Img.Heart.width / m +  i *  Img.Day.width / 2  + offetX) ;				
				s.y = Img.Heart.height / 2 - Img.Day.height / 2 - heartOffset[1] / 2 + offsetY;
				s.visible = true;
				this.setHeartNumFrame(s, num[i]);				
			}

			if (len == 2){
				var s = this._heart_01_num.children[i];
				s.x = Math.floor(  Img.Heart.width / m +  i *  Img.Day.width / 2  + offetX);
				s.y = Img.Heart.height / 2 - Img.Day.height / 2 - heartOffset[1] / 2 + offsetY;
				s.visible = true;
				this.setHeartNumFrame(s, num[i]);
			}
			if (len == 3){
				var s = this._heart_01_num.children[i];
				s.x = Math.floor(  Img.Heart.width / m +  i *  Img.Day.width / 2  + offetX);				
				s.y = Img.Heart.height / 2 - Img.Day.height / 2 - heartOffset[1] / 2 + offsetY;
				s.visible = true;
				this.setHeartNumFrame(s, num[i]);				
			}
		}
	}
	SpriteSurViva.closeNum = function (sp){
		this._heart_01_num.children.forEach(function (sp){
			sp.visible = false;
		});
	}


	SpriteSurViva.setHeartNumFrame = function (sprite, num ){
		var number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

		for (index in number){
			if (num == number[index]){
				sprite.setFrame( index * Img.Day.width  , 0 , Img.Day.width , Img.Day.height)
			}
		}									
	}

	SpriteSurViva.updateAllSurUI = function(){

	}

//=============================================================================
// Scene_Menu
//=============================================================================	
	function Scene_MenuSurviva(){
		this.initialize.apply(this, arguments);
	}
	Scene_MenuSurviva.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_MenuSurviva.prototype.constructor = Scene_MenuSurviva;	


	var MenuSurviva = Scene_MenuSurviva.prototype;
	MenuSurviva.initialize = function(){
		Scene_MenuBase.prototype.initialize.call(this);
	}
	MenuSurviva.create = function() {
	    Scene_MenuBase.prototype.create.call(this);
	    this.createBookBackground();

	};	
	MenuSurviva.createBookBackground = function(){
		this._book = new Sprite();
		this._book.bitmap = ImageManager.loadRabbitsurvival('Menu_01');
		this._book.x = Graphics._boxWidth;
		this.addChild(this._book);
		// this._book.x = 
	}
	MenuSurviva.updateBook = function(){
		if (this._book.x > 0){
			this._book.x -= 250;
			if (this._book.x < 0){
				this._book.x = 0;
			}
		}		
	}
	MenuSurviva.update = function(){
		this.updateBook();
	}
	DataManager.makeSaveContents = function() {
	    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
	    var contents = {};
	    contents.system       = $gameSystem;
	    contents.screen       = $gameScreen;
	    contents.timer        = $gameTimer;
	    contents.switches     = $gameSwitches;
	    contents.variables    = $gameVariables;
	    contents.selfSwitches = $gameSelfSwitches;
	    contents.actors       = $gameActors;
	    contents.party        = $gameParty;
	    contents.map          = $gameMap;
	    contents.player       = $gamePlayer;
	    contents.surTimer     = $gameSurTime;
	    return contents;
	};

	DataManager.extractSaveContents = function(contents) {
	    $gameSystem        = contents.system;
	    $gameScreen        = contents.screen;
	    $gameTimer         = contents.timer;
	    $gameSwitches      = contents.switches;
	    $gameVariables     = contents.variables;
	    $gameSelfSwitches  = contents.selfSwitches;
	    $gameActors        = contents.actors;
	    $gameParty         = contents.party;
	    $gameMap           = contents.map;
	    $gamePlayer        = contents.player;
	    $gameSurTime       = contents.surTimer; // 必要,紀錄 timer 狀態
	};
}());
