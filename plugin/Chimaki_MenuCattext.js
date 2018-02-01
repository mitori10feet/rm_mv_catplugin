//=============================================================================
// Chimaki_MenuCattext.js
// Version: 2.0
//=============================================================================
/*:
* @plugindesc 貓咪談話功能
* @author Chimaki 
* 
* @param MenuSwitch
* @desc This is the switch of all system.
* @default 100
*
* @param Save/Load Menu offset X
* @desc 微調記錄畫面座標X
* @default 36
*
* @param Save/Load Menu offset Y
* @desc 微調記錄畫面座標Y
* @default -10
* @help
*
* @param CWindowWidth
* @desc 螢幕解析度寬度
* @default 1280
* @param CWindowHeigh
* @desc 螢幕解析度高度
* @default 720
*
* @param CTextVarID
* @desc 記錄對話用的變數編號 ,預設98
* @default 98
* 
* @param SaveLoadPosX
* @desc system圖片位置調整
* @default 15
*
* @param SaveLoadPosX
* @desc system圖片位置調整
* @default 20
*
* @param SystemPosX
* @desc system圖片位置調整
* @default 15
*
* @param SystemPosY
* @desc system圖片位置調整
* @default 20
*
* @param BackPosX
* @desc system圖片位置調整
* @default -215
*
* @param BackPosY
* @desc system圖片位置調整
* @default -80
* 
* @param Black
* @desc 介面黑底透明度0~255 
* @default 160
*
* @param MiniMenuSwitch
* @desc 小Menu按鈕開關設定
* @default 99
* 
* @param MiniMenuX
* @desc 小Menu按鈕x微調整
* @default 0
*
* @param MiniMenuY
* @desc 小Menu按鈕y微調整
* @default 0
* 
* @param BackLogH
* @desc 文字記錄寬
* @default 720
*
* @param BackLogW
* @desc 文字記錄高
* @default 1180
*
* @param ChoicesY
* @desc 內建選擇功能Y座標微調整 
* @default 0
*
* @param Opction_opacity
* @desc 設定選項的背景透明 0~255 
* @default 0
* 
* @param ButtonCount 
* @desc Menu按鈕控制開關 
* @default 98
* 
* @param systemVar
* @desc for 系統專用變數id 
* @default 100
* 
* @param systemVar_load
* @desc for 系統專用變數id 
* @default 99
* 
* @param cursorDownArgs
* @desc 光標參數 : 光標長增加;光標寬增加;光標動畫時間;光標css顏色
* @default 10;10;20;#ffffff
* 
* ============================================================================
* @help
* 2.0
* 大幅改寫插件內容, 改用更省資源的es模式
* 插件指令
* Text Center  : 下一句文字置中
* 
* 
* 
*/
//=============================================================================

'use strict'; // es mode


var Imported = Imported || {};


var chimaki_plugin = chimaki_plugin || {};
// menu相關
chimaki_plugin.menucattext = {}; 
chimaki_plugin.menucattext.alias = {};
chimaki_plugin.args = {};
chimaki_plugin.config = {};

// 對話紀錄相關
chimaki_plugin.backLog = {};
chimaki_plugin.game_interpreter = [];

chimaki_plugin.menucattext._lastIndexOf = document.currentScript.src.lastIndexOf( '/' );
chimaki_plugin.menucattext._indexOf            = document.currentScript.src.indexOf( '.js' );
chimaki_plugin.menucattext._getJSName          = document.currentScript.src.substring( chimaki_plugin.menucattext._lastIndexOf + 1, chimaki_plugin.menucattext._indexOf );

(function(){


	chimaki_plugin.menucattext._arsg = PluginManager.parameters( chimaki_plugin.menucattext._getJSName);
	
	// 解析度相關
	chimaki_plugin.args.screenWidth  = Number(chimaki_plugin.menucattext._arsg['CWindowWidth'] || 1280);
	chimaki_plugin.args.screenHeight =  Number(chimaki_plugin.menucattext._arsg['CWindowHeigh'] || 720);


	chimaki_plugin.args.saveText =	Number(chimaki_plugin.menucattext._arsg['CTextVarID'] || 98); // back log 紀錄
	chimaki_plugin.args.systemVar_load = Math.floor(chimaki_plugin.menucattext._arsg['systemVar_load']|| 99); // 判定是否為讀取檔案
	chimaki_plugin.args.systemVar = Math.floor(chimaki_plugin.menucattext._arsg['systemVar']|| 100); // game map 流程控制紀錄
	

	chimaki_plugin.args.menu_switch  = Math.floor(chimaki_plugin.menucattext._arsg['MenuSwitch']|| 100); //自製總開關

	// 座標系
	chimaki_plugin.args.menu_sprite_system_pos_x = Math.floor(chimaki_plugin.menucattext._arsg['SystemPosX']|| 15);
	chimaki_plugin.args.menu_sprite_system_pos_y = Math.floor(chimaki_plugin.menucattext._arsg['SystemPosY']|| 20);
	chimaki_plugin.args.menu_sprite_back_pos_x = Math.floor(chimaki_plugin.menucattext._arsg['BackPosX']|| -215);
	chimaki_plugin.args.menu_sprite_back_pos_y = Math.floor(chimaki_plugin.menucattext._arsg['BackPosY']|| -80);	
	chimaki_plugin.args.menu_sprite_save_pos_x = Math.floor(chimaki_plugin.menucattext._arsg['SaveLoadPosX']|| 15);	
	chimaki_plugin.args.menu_sprite_save_pos_y = Math.floor(chimaki_plugin.menucattext._arsg['SaveLoadPosY']|| 20);	
	chimaki_plugin.args.choices_y_offset = Math.floor(chimaki_plugin.menucattext._arsg['ChoicesY']|| 0);

	chimaki_plugin.config = {
		save_file_window_offset_x : -15,
		save_file_window_offset_y : 110,
		save_file_window_playtime_offset_y : -10,
		item_helpWindow_y : -120,
		miniMenuWidth : 150,
		miniMenuHeight : 50,
		backlog_window_width : 1220,
		backlog_window_height : 434,
		backlog_window_y : 142,


	}
	// 音量系
	chimaki_plugin.args.cursor = chimaki_plugin.menucattext._arsg["cursorDownArgs"].split(";")

	log(chimaki_plugin.args.cursor);

	// 視覺系
	chimaki_plugin.args.blackOpacity = Math.floor(chimaki_plugin.menucattext._arsg['Black']|| 160);		
	chimaki_plugin.args.buttonSwitch = chimaki_plugin.menucattext._arsg["ButtonCount"].split(";");

	chimaki_plugin.args.opction_opacity = Math.floor(chimaki_plugin.menucattext._arsg['Opction_opacity']|| 0);

	// interpreter 控制	
	chimaki_plugin.args.is_load = false;
	chimaki_plugin.args.is_call_menu = false;
	
	// pro to set
	chimaki_plugin.args.miniMenuSwitch = Number(chimaki_plugin.menucattext._arsg['MiniMenuSwitch']|| 99);	
	chimaki_plugin.args.miniMenuX = Math.floor(chimaki_plugin.menucattext._arsg['MiniMenuX']|| 0);	
	chimaki_plugin.args.miniMenuY= Math.floor(chimaki_plugin.menucattext._arsg['MiniMenuY']|| 0);
	chimaki_plugin.args.miniMenuWidth = 150;
	chimaki_plugin.args.miniMenuHeight = 50;
	chimaki_plugin.args.choicesMessageOffice = 50;

	//  pro for sprite button at touch input
	chimaki_plugin.args.miniRectangle = new Rectangle();

	// 額外控制
	let menu_button_offset_x = -25;
	let scene_file_last_select = 0;
	let scene_menu_last_select = 0;
	let is_call_menu = false;
	let isNeedToCenter = false;
	let isNeedToHCenter = false;
	let msg_window_offsetX = 30;
	let msg_window_offsetY = 30;
	let fullScreenW = 1280;
	let fullScreenH = 720;


	// 全頻文字
	let fullScreenMode = false;
	let startIndex = 0;
	let endIndex = 0;

//=============================================================================
// 插件指令
//=============================================================================	    
    chimaki_plugin.menucattext.alias._plugin_command = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        chimaki_plugin.menucattext.alias._plugin_command.call(this, command, args);
        if (command === 'Text') {
        	switch (args[0]){
        		case 'Center':
        			isNeedToCenter = true;
        			break;
        		case 'HCenter':
        			isNeedToHCenter = true;
        			break;        			
        		case 'FullScreen':
        			
        			startIndex = args[1];
        			endIndex = args[2] || args[1];
        			$gameMessage.addFullScreenText(startIndex, endIndex);
        			break;
        		case 'NomalScreen':
        			fullScreenMode = false;
        			break;
        	}        	
        }
        if (command === 'Say') {
   
        }

        // 暫時廢棄
        if (command === 'Choice') {        	
    		$gameMessage.addChoiceByData(args[0], args[1], args[2]);	
    		if (args[3]) $gameMessage.setChoiceBackground(Number(args[3]));
        }                
	}
	Game_Interpreter.prototype.command356 = function() {
	    var args = this._params[0].split(" ");
	    var command = args.shift();
	    if (command === "Say"){
	    	if (args[1]) $gameMessage.setPosByCommand(args[1]);
	    	$gameMessage.addTextByData(TextContentManager.getContentDataById(args[0])); 
	    	switch(this.nextEventCode()){

	    	}
	    	this.setWaitMode('message');
	    	return true;


	    }






	    this.pluginCommand(command, args);
	    return true;
	};
//=============================================================================
// 對話筐多語系
//=============================================================================	
	Game_Interpreter.prototype.checkTextByData = function (text){
		text = text.replace(/\\/g, '\x1b');
	    text = text.replace(/\x1bSay\[(\d+)\]/gi, function() {
	        return TextContentManager.getContentDataById(parseInt(arguments[1]));
	    }.bind(this));
	    
	    return text;
	}
	Game_Interpreter.prototype.setupChoices = function(params) {	   
	    var choices = params[0].clone();
	    for (let i = 0; i < choices.length; i++){
	    	log(choices[i]);
	    	choices[i] = this.checkTextByData(choices[i]);
	    } 
	    var cancelType = params[1];
	    var defaultType = params.length > 2 ? params[2] : 0;
	    var positionType = params.length > 3 ? params[3] : 2;
	    var background = params.length > 4 ? params[4] : 0;
	    if (cancelType >= choices.length) {
	        cancelType = -2;
	    }
	    $gameMessage.setChoices(choices, defaultType, cancelType);
	    $gameMessage.setChoiceBackground(background);
	    $gameMessage.setChoicePositionType(positionType);
	    $gameMessage.setChoiceCallback(function(n) {
	        this._branch[this._indent] = n;
	    }.bind(this));
	};	
//=============================================================================
// 全頻對話
//=============================================================================	

// code 備註 356 plugin command, 401 對話資料 , 101 show text,
// Show Text
	Game_Message.prototype.addChoiceByData = function (id, defaultType, cancelType){
			let text = TextContentManager.getContentDataById(id);
			let contents  = text.split(";");
			$gameMessage.setChoices(contents, defaultType || 0 , defaultType || 1);	
	}

	Game_Message.prototype.addTextByData = function (text){
		// if (!$gameMessage.isBusy()) {
			$gameMessage.add(text);
			
		// }
	}
	Game_Message.prototype.setPosByCommand = function ( args){
		let pos = 2;
		if (args == 'up') pos = 0;
		if (args == 'center') pos = 1;
		if (args == 'bottom') pos = 2;		
		this.setPositionType(pos);
	}

	Game_Message.prototype.addFullScreenText = function (st, end){
		let text = TextContentManager.getContentDataByRang(st, end)
		$gameMessage.add(text);
		$gameMap._interpreter.setWaitMode('message');
		fullScreenMode = true;
	}

//=============================================================================
// 對話置中 + 全頻
//=============================================================================
	chimaki_plugin.menucattext.alias._windowmsg_init = Window_Message.prototype.initialize;
	Window_Message._isFullFadeOut = false;
	Window_Message.prototype.initialize = function (){
		this._lastScreenMode = null;
		chimaki_plugin.menucattext.alias._windowmsg_init.call(this);
		this.createBackg();
		this.createBackground();
	}        

	chimaki_plugin.menucattext.alias._windowmsg_center = Window_Message.prototype.newPage;
	Window_Message.prototype.newPage = function(textState) {
		chimaki_plugin.menucattext.alias._windowmsg_center.call(this, textState);
	    if (this.isNeedCenter()) {
	    	textState.x = 0;
	    	textState.x = (this.x / 2 + this.width / 2) - (this.textWidth(this._textState.text) / 2) - this.standardPadding();
	    	isNeedToCenter = false;	
	    }
	    if (this.isNeedHCenter()) {
			this._textState.text = this.convertEscapeCharacters($gameMessage.allText(), true)	    	
	    	textState.y = (this.height / 2) - (this._textState.height / 2) -  this._textState.height / 2  ;
	    	isNeedToHCenter = false;   	
	    }	

	     
	};
	Window_Message.prototype.newLineX = function() {
	    return $gameMessage.faceName() === '' ? 0 : 168;
	    // return 0;
	};	
	Window_Message.prototype.createBackg = function (){
		this._back = new Sprite();
		let bitmap = new Bitmap(fullScreenW, fullScreenH );
		bitmap.paintOpacity = 200;
		bitmap.fillAll('black');
		this._back.y = 0;
		this._back.bitmap = bitmap;
		this._back.visible = false
		this._back.opacity = 0;
		this.addChildAt(this._back, 0);
	}
	Window_Message.prototype.createBackground = function (){
		this._backgroundImg = new Sprite(ImageManager.loadCattext('Full_screen'));		
		// this._backgroundImg.y -= 20;
		this._backgroundImg.opacity = 0;
		this.addChildToBack(this._backgroundImg);
	}
	Window_Message.prototype.isNeedHCenter = function (){
		return isNeedToHCenter;
	}
	Window_Message.prototype.isNeedCenter = function (){
		return isNeedToCenter;
	}
	Window_Message.prototype.isNeedFull = function (){
		return fullScreenMode;
	}
	Window_Message.prototype.isFullFadeOut = function (){
		return Window_Message._isFullFadeOut;
	}	
	Window_Message.prototype.checkToNotClose = function() {
	    if (this.isClosing() && this.isOpen() && !this.isNeedFull()) {
	        if (this.doesContinue()) {
	            this.open();
	        }
	    }
	};

	Window_Message.prototype.startMessage = function() {
		log('start')
		log($gameMessage.allText());
	    this._textState = {};
	    this._textState.index = 0;
	    this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
	    this.checkScreenMode();
	    this.newPage(this._textState);
	    this.updatePlacement();
	    this.updateBackground();
	    this.open();
	};
	Window_Message.prototype.newLineX = function() {
		if (fullScreenMode) {
			return msg_window_offsetX;
		}
	    return $gameMessage.faceName() === '' ? 0 : 168;
	};	
	Window_Message.prototype.createContents = function() {
	    this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
	    this.resetFontSettings();
	};
	Window_Message.prototype.update = function() {
		if (this.isNeedModeChange()){
        	this.checkScreenMode();
        	return;
	    }		
		this.checkToNotClose();	    
	    Window_Base.prototype.update.call(this);

		    while (!this.isOpening() && !this.isClosing()) {
		        if (this.updateWait()) {
		            return;
		        } else if (this.updateLoading()) {
		            return;
		        } else if (this.updateInput()) {
		            return;
		        } else if (this.updateMessage()) {
		        	
		            return;
		        } else if (this.canStart()) {
		            this.startMessage();
		        } else {
		            this.startInput();
		            return;
		        }
		    }

	};

	Window_Message.prototype.updateOpen = function() {
	    if (this._opening) {
	        this.openness += 32;
	        this._back.opacity += 5;
	        this._backgroundImg.opacity += 5;
	        if (this.isOpen()) {
	        	if (this.isNeedFull()) Window_Message._isFullFadeOut = true;	        	
	        	this._backgroundImg.opacity = 255;
	        	this._back.opacity = 255;
	            this._opening = false;
	        }
	    }
	};

	Window_Message.prototype.updateClose = function() {
	    if (this._closing) {
	    	if(Window_Message._isFullFadeOut){
		        this.openness -= 5;
		        this._back.opacity -= 5;
		        this._backgroundImg.opacity -= 5;	    			    		

	    		
	    	}
	    	else {	    		
	    		this.openness -= 32;
	    	}

	        if (this.isClosed()) {
	        	Window_Message._isFullFadeOut = false;
	        	this._back.opacity = 0;
	        	this._backgroundImg.opacity = 0;
	            this._closing = false;
	            
	        }
	    }
	};	
	Window_Message.prototype.isOpen = function() {
		if (!this.isNeedFull() ){
			return this._openness >= 255;	
		}
		else {
			return (this._openness >= 255 && this._back.opacity >= 255 && this._backgroundImg.opacity >= 255);
		}
	    
	};

	Window_Message.prototype.isClosed = function() {
			return this._openness <= 0;		
	};	
	Window_Message.prototype.checkScreenMode = function (){
		log('command mode')
		log(fullScreenMode);
	   	if (this._lastScreenMode === true){
	   		this._back.visible = true;
	   		this.opacity = 0;
	   		this._backgroundImg.visible = true;
	   		this.height = fullScreenH;
	   		this.width = fullScreenW;
	   		this.contents.resize(fullScreenW - this.standardPadding() * 2, fullScreenH - this.standardPadding() * 2);
	   	}
	   	else if (this._lastScreenMode === false){
	   		this._back.visible = false;
	   		this._backgroundImg.visible = false;
	   		this.height = this.windowHeight();
	   		this.contents.resize(this.contentsWidth(), this.contentsHeight());
	   	}
	   	this.resetFontSettings();
       	this._lastScreenMode = fullScreenMode;	   	
	}

	Window_Message.prototype.isNeedModeChange = function (){
		return (this._lastScreenMode != fullScreenMode);
	}  
	Window_Message.prototype.updatePlacement = function() {
	    this._positionType = $gameMessage.positionType();	    
	    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
	    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
	};
	Window_Message.prototype.setBackgroundType = function (type){
		if (this.isNeedFull()){
			this.opacity = 0;
			return;
		}		
		Window_Base.prototype.setBackgroundType.call(this, type);
	}
	Window_Message.prototype.updateInput = function() {
	    if (this.isAnySubWindowActive()) {
	        return true;
	    }
	    if (this.pause) {
	        if (this.isTriggered()) {
	            Input.update();
	            fullScreenMode = false; // for black img
	            this.pause = false;
	            if (!this._textState) {
	                this.terminateMessage();
	            }
	        }
	        return true;
	    }
	    return false;
	};

//=============================================================================
// 整合解析度
//=============================================================================	    
	SceneManager.initGraphics = function() {
	    var type = this.preferableRendererType();
	    Graphics.initialize(chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, type);
	    Graphics.boxWidth = chimaki_plugin.args.screenWidth;
	    Graphics.boxHeight = chimaki_plugin.args.screenHeight;
	    
	    var resizeWidth = Graphics.boxWidth - window.innerWidth;
	    var resizeHeight = Graphics.boxHeight - window.innerHeight;
	    window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
	    window.resizeBy(resizeWidth, resizeHeight);;
	    
	    Graphics.setLoadingImage('img/system/Loading.png');
	    if (Utils.isOptionValid('showfps')) {
	        Graphics.showFps();
	    }
	    if (type === 'webgl') {
	        this.checkWebGL();
	    }
	};    

//=============================================================================
// avg 模式 mini button 判斷
//=============================================================================		
	TouchInput._onLeftButtonDown = function (event){
	    var x = Graphics.pageToCanvasX(event.pageX);
	    var y = Graphics.pageToCanvasY(event.pageY);

	    this._touchSprite = new Sprite_Destination();
	    // this.addChild(this._touchSprite);
	    if (Graphics.isInsideCanvas(x, y)) {
	    	if ( !(this._isTouchMiniMenu(x, y))){
	    		this._mousePressed = true;
	    	}	        
	        this._pressedTime = 0;
	        this._onTrigger(x, y);
	    }	    
	}
	TouchInput._isTouchMiniMenu = function (x, y){
		return (x >= chimaki_plugin.args.miniRectangle.x && x <= chimaki_plugin.args.miniRectangle.x + chimaki_plugin.args.miniRectangle.width &&
	    		 y >= chimaki_plugin.args.miniRectangle.y && y <= chimaki_plugin.args.miniRectangle.y + chimaki_plugin.args.miniRectangle.height);
	}
//=============================================================================
// 自製Menu 基本擴充
//=============================================================================
	class Scene_CatMenuBase extends Scene_MenuBase {
		constructor (){
			super();
		}
		initialize (){
			Scene_MenuBase.prototype.initialize.call(this);
		}	
		create (){
			Scene_MenuBase.prototype.create.call(this);
			this.createBackgroundSprite();
			this.createMeuBox()
			this.createSystemButton();
			this.createBackButton();
			this.createTouchSprite();
		}				
		createBackgroundSprite (){
			this._blackSprite = new Sprite();
			this._blackSprite.bitmap = new Bitmap(chimaki_plugin.args.screenWidth,chimaki_plugin.args.screenHeight);		
			this._blackSprite.bitmap.fillRect ( 0 , 0 , chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, 'black' );		
			this._blackSprite.opacity = chimaki_plugin.args.blackOpacity;
			this.addChild(this._blackSprite);
		}		
		createMeuBox (){
			this._menuBoxSprite = new Sprite(ImageManager.loadCattext('Menu_Box'));
			this.addChild(this._menuBoxSprite);
		}	
		createSystemButton(){
			this._sprite_system = new Sprite(ImageManager.loadCattext('SYSTEM'));
			this._sprite_system.x = chimaki_plugin.args.menu_sprite_system_pos_x;
			this._sprite_system.y = chimaki_plugin.args.menu_sprite_system_pos_y;
			this.addChild(this._sprite_system);
		} 
		createBackButton(){	
			this._sprite_backbutton = new Sprite_Button();
			this._sprite_backbutton.temp =  ImageManager.loadCattext('BACK_02');
			this._sprite_backbutton.bitmap = ImageManager.loadCattext('BACK');
			this._sprite_backbutton.x = Graphics.boxWidth + chimaki_plugin.args.menu_sprite_back_pos_x;
			this._sprite_backbutton.y = Graphics.boxHeight + chimaki_plugin.args.menu_sprite_back_pos_y;

		    this._sprite_backbutton.setClickHandler(this.popScene.bind(this));
			this.addChild(this._sprite_backbutton);
		}		

	}
//=============================================================================
// Scene gakuen
//=============================================================================
	class Scene_CatGakuen extends Scene_CatMenuBase {
		constructor(){
			super();
		}		
		initialize (){
			Scene_CatMenuBase.prototype.initialize.call(this);
		}
		create (){
			Scene_CatMenuBase.prototype.create.call(this);
			this.createDisplayWindow();

			// this.createDisplaySprite();
		}					
		createSystemButton(){
			this._sprite_system = new Sprite(ImageManager.loadCattext('NEKO_GAKUEN'));
			this._sprite_system.x = chimaki_plugin.args.menu_sprite_system_pos_x;
			this._sprite_system.y = chimaki_plugin.args.menu_sprite_system_pos_y;
			this.addChild(this._sprite_system);
		} 	
		createDisplayWindow (){
			this.createCreditWindow();
		}	
		createCreditWindow (){
			this._creditsWindow = new Window_Credits(0, 113, Graphics.boxWidth, 490);
			this._creditsWindow.opacity = 0;
			this._creditsWindow.setHandler('cancel', this.popScene.bind(this));
			this.addChild(this._creditsWindow);			
		}
		popScene(){
			SoundManager.playCancel();
			// if (this._blackSprite) this._blackSprite.visible = false
			this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;

			SceneManager.pop();
		}
	}	
//=============================================================================
// Scene CatMenu
//=============================================================================
	class Scene_CatMenu extends Scene_CatMenuBase {
		constructor (){
			super();
		}
		initialize (){
			Scene_CatMenuBase.prototype.initialize.call(this);
		}	
		create (){
			Scene_CatMenuBase.prototype.create.call(this);
			this.createDisplayWindow();
			this.createDisplaySprite();
		}
		createDisplayWindow (){
			this.createCommandWindow();

		}
		createDisplaySprite (){
			this.createSpriteButton();
		}
		createSpriteButton (){
		
		}
		//=============================================================================
		// 視窗系列
		//=============================================================================
		createCommandWindow (){
			this._commandWindow = new Window_CatMenuCommand (0, 0);
		    this._commandWindow.setHandler('box',      this.commandBox.bind(this));
			this._commandWindow.setHandler('save',      this.commandSave.bind(this));
			this._commandWindow.setHandler('load',      this.commandLoad.bind(this));
		    this._commandWindow.setHandler('backlog',      this.commandBackLog.bind(this));
		    this._commandWindow.setHandler('gakuen',      this.commandGakuen.bind(this));
			this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
			this._commandWindow.setHandler('cancel',    this.popScene.bind(this))
			this.setMenuSpriteHanlder();



			this.addChild(this._commandWindow);
			// this._lastSelect = this._commandWindow.index();

		}
		setMenuSpriteHanlder (){
			let sprite = this._commandWindow.spriteList();


			for (let i = 0 ; i < this._commandWindow.maxCols() ; i ++){
				switch (sprite[i].key){
					case "box":
						// if ($gameSwitches.value(chimaki_plugin.args.buttonSwitch[0]));
						sprite[i].setClickHandler(this.commandBox.bind(this));
						break;
					case "save":
						sprite[i].setClickHandler(this.commandSave.bind(this));
						break;
					case "load":
						sprite[i].setClickHandler(this.commandLoad.bind(this));
						break;
					case "options":
						sprite[i].setClickHandler(this.commandOptions.bind(this));
						break;
					case "backlog":
						sprite[i].setClickHandler(this.commandBackLog.bind(this));
						break;
					case "gakuen":
						sprite[i].setClickHandler(this.commandGakuen.bind(this));
						break;						
					default:
						break;
				}
			}
		}
		//=============================================================================
		// hendler 系列
		//=============================================================================
		commandBox (){
			log('sssss');
			SoundManager.playOk();
			this._commandWindow.select(0);
			SceneManager.push(Scene_CatItem);
		}
		commandSave(){
			SoundManager.playOk();
			this.setMenuLastSelect((this._commandWindow.maxCols() == 6) ?  1 : 0);
			SceneManager.push(Scene_Save);
		}
		commandLoad(){
			SoundManager.playOk();
			this.setMenuLastSelect( (this._commandWindow.maxCols() == 6) ?  2 : 1);
			SceneManager.push(Scene_Load);
		}

		commandBackLog (){			
			SoundManager.playOk();
			this.setMenuLastSelect( (this._commandWindow.maxCols() == 6) ?  3 : 2);
			SceneManager.push(Scene_BackLog);			
		}
		commandGakuen (){
			SoundManager.playOk();
			this.setMenuLastSelect( (this._commandWindow.maxCols() == 6) ?  4 : 3);
			SceneManager.push(Scene_CatGakuen);						
		}				
		commandOptions(){
			SoundManager.playOk();
			this.setMenuLastSelect( (this._commandWindow.maxCols() == 6) ?  5 : 4);
			SceneManager.push(Scene_Options);
		}
		popScene(){
			SoundManager.playCancel();
			this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;						
			SceneManager.pop();

		}
		setMenuLastSelect ( index ){
			scene_menu_last_select	= index;
		}
	}
//=============================================================================
// 自製視窗 基本畫面
//=============================================================================
	class Window_CatMenuCommand extends Window_HorzCommand {
		constructor (x, y){
			super(x, y);
		}
		initialize (x, y){
			this.bitmap_button_save = [];
			this.bitmap_button_load = [];
			this.bitmap_button_options = [];
			this.bitmap_button_backlog = [];
			this.bitmap_button_box = [];
			this.bitmap_button_gakuen = [];
			this.initBitmap();	
			Window_HorzCommand.prototype.initialize.call(this, x, y);
			this.y  = (Graphics.boxHeight / 2 ) - (this.windowHeight() / 2 );
			this.width = this.windowWidth();
			this.height = this.windowHeight();
			this.opacity = 0;
			// this.windowskin = new Bitmap(0, 0);
			this.setDisPlayButton();		

			if (this.maxCols() == 6){
				this._sprite_box.bitmap = this.bitmap_button_box[1];
			}
			else {
				this._sprite_save.bitmap = this.bitmap_button_save[1];	
			}		
 
			if (scene_menu_last_select > 0)
				this.select(scene_menu_last_select)
			else 
				this.select(0)
		}
		setDisPlayButton (){
			this.createGakuenButton()
			this.createSaveButton();			
			this.createBackLogButton();
			this.createOptionsButtons();
			this.createLoadButton();
			if ((this.maxCols() >= 6 ))this.createItemBoxButton();			
			this.setButtPosition();			

		}
		refresh () {
		    this.clearCommandList();
		    this.makeCommandList();
		    this.createContents();
		    Window_Selectable.prototype.refresh.call(this);
		    this.setDisPlayButton();
		};
		refreshSprite (){
			let sprite = this.spriteList();
			let key = (this.maxCols() >= 6 ) ? "box" : "save";
			for (let i = 0; i < this.maxCols(); i++){
				if (i == this.index()){
					sprite[i].bitmap = eval("this.bitmap_button_" + sprite[i].key + "[1]");

				}
				else {
					sprite[i].bitmap = eval("this.bitmap_button_" + sprite[i].key + "[0]");	
				}
			}
		}
		setButtPosition (){
			log('setButtPosition');
			log(this.x);
			let temp_w = 80;
			let lenght = this.maxCols() + 1;
			let width = (this.windowWidth() / lenght);
			let sprite = this.spriteList();
			for (let i = 0; i < this.maxCols(); i++){
				sprite[i].x = (i + 1)* width - temp_w / 2;

			}
		}
		spriteList (){
			return $gameSwitches.value(chimaki_plugin.args.buttonSwitch[0]) ? 
			[this._sprite_box, this._sprite_save, this._sprite_load,this._sprite_backlog, this._sprite_gakuen, this._sprite_options] : 
			[this._sprite_save, this._sprite_load,this._sprite_backlog, this._sprite_gakuen, this._sprite_options] ;
		}
		maxCols (){
			return $gameSwitches.value(chimaki_plugin.args.buttonSwitch[0]) ? 6 : 5;
		}
		initBitmap (){
			for (let i = 0 ; i < 2 ; i ++){
				this.bitmap_button_save[i] = ImageManager.loadCattext('Save_0' + (i + 1) );
				this.bitmap_button_load[i] = ImageManager.loadCattext('Load_0' + (i + 1) );
				this.bitmap_button_options[i] = ImageManager.loadCattext('Auto_0' + (i + 1) );
				this.bitmap_button_box[i] = ImageManager.loadCattext('Box_0' + (i + 1) );
				this.bitmap_button_backlog[i] = ImageManager.loadCattext('Backlog_0' + (i + 1) );
				this.bitmap_button_gakuen[i] = ImageManager.loadCattext('Gakuen_0' + (i + 1) );
			}

		}
		createGakuenButton(){
			this._sprite_gakuen = new Sprite_Button();
			this._sprite_gakuen.key = "gakuen";
			this._sprite_gakuen.bitmap =  this.bitmap_button_gakuen[0];
			this.addChild(this._sprite_gakuen);
		}
		createSaveButton(){
			this._sprite_save = new Sprite_Button();
			this._sprite_save.key = "save";
			this._sprite_save.bitmap =  this.bitmap_button_save[0];
			this.addChild(this._sprite_save);
		}
		createLoadButton(){
			this._sprite_load = new Sprite_Button();
			this._sprite_load.key = "load";
			this._sprite_load.bitmap =  this.bitmap_button_load[0];
			this.addChild(this._sprite_load);
		}
		createOptionsButtons(){
			this._sprite_options = new Sprite_Button();
			this._sprite_options.key = "options";
			this._sprite_options.bitmap = this.bitmap_button_options[0];
			this.addChild(this._sprite_options);
		}
		createBackLogButton(){
			this._sprite_backlog = new Sprite_Button();
			this._sprite_backlog.key = "backlog";
			this._sprite_backlog.bitmap = this.bitmap_button_backlog[0]
			this.addChild(this._sprite_backlog);			
		}		
		createItemBoxButton(){
			this._sprite_box = new Sprite_Button();
			this._sprite_box.key = "box";
			this._sprite_box.bitmap =  this.bitmap_button_box[0]
			this.addChild(this._sprite_box);	
		}

		windowWidth (){
			return Graphics._boxWidth;
		}
		windowHeight (){
			return 30;
		}
		updateCursor (){

		}
		update (){
			Window_HorzCommand.prototype.update.call(this);
			if (this._commandWindow){
				this._commandWindow.setCategory(this.currentSymbol());
			}
			if (this._lastSelect != this.index()){
				this._lastSelect = this.index()
				this.refreshSprite();
			}

		}
		makeCommandList (){
			if ($gameSwitches.value(chimaki_plugin.args.buttonSwitch[0]))this.addBoxCommand();
			this.addSaveCommand();
			this.addLoadCommand();
			this.addBackLogCommands();
			this.addGakuenCommands();
			this.addOptionsCommand();				
			
		}
		setcommandWindow (commandWindow){
			this._commandWindow = commandWindow;
		}
		addBoxCommand () {
			this.addCommand('', 'box', true);
			
		};		    
		addLoadCommand () {
			this.addCommand('', 'load', true);
		};	    
		addOptionsCommand () {
	        this.addCommand('', 'options', true);
	        
		};
		addSaveCommand () {
	        this.addCommand('', 'save', true);
	        
		};
		addBackLogCommands () {
	        this.addCommand('', 'backlog', true);	        
		};    		
		addGakuenCommands () {
	        this.addCommand('', 'gakuen', true);	        
		};    				
		initCommandPosition () {
	    	this._lastCommandSymbol = null;
		};		
		// standardPadding () {
  //   		return 10;
  //   	}
    	itemWidth (){
    		return 90;
    	}
    	// itemHeight (){
    	// 	return 90;
    	// }    	
		spacing (){
			return 50;
		}
		// findExt (ext) {
		//     for (var i = 0; i < this._list.length; i++) {
		//         if (this._list[i].ext === ext) {
		//             return i;
		//         }
		//     }
  //   		return -1;
  //   	}

  		cursorLeft (wrap){

		    var index = this.index();
		    var maxItems = this.maxItems();
		    var maxCols = this.maxCols();
		    if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {

		        this.select((index - 1 + maxItems) % maxItems);
		    }  			
		    else {
		    	this.select(maxCols - 1);
		    }

  		}
		cursorRight (wrap) {
		    var index = this.index();
		    var maxItems = this.maxItems();
		    var maxCols = this.maxCols();
		    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
		        this.select((index + 1) % maxItems);
		    }
		    else {
		    	this.select(0);
		    }
		};  		
		// selectExt (ext) {
		// 	log('selectExt');
		// 	log(ext)
		//     var index = this.findExt(ext);
		//     if (index >= 0) {
		//         this.select(index);
		//     } else {
		//         this.select(0);
		//     }
		// };    	
		updateArrows() {
		};
				
	}





	Window_CatMenuCommand._lastCommandSymbol =null;
//=============================================================================
// 記錄視窗 override + 擴充
//=============================================================================

	chimaki_plugin.menucattext.alias.scene_file_create = Scene_MenuBase.prototype.create
	Scene_File.prototype.create = function (){
		chimaki_plugin.menucattext.alias.scene_file_create.call(this);
		this._lastSaveSelect = 0;
		this.createSprite();
		this.createListWindow();
		this.createTouchSprite();
	}
	Scene_File.prototype.createSprite = function (){
			Scene_MenuBase.prototype.create.call(this);
			this.createBackgroundSprite();
			this.createMeuBox()
			this.createSystemButton();
			this.createBackButton();		
	}			
	Scene_File.prototype.createBackgroundSprite = function (){
		this._blackSprite = new Sprite();
		this._blackSprite.bitmap = new Bitmap(chimaki_plugin.args.screenWidth,chimaki_plugin.args.screenHeight);		
		this._blackSprite.bitmap.fillRect ( 0 , 0 , chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, 'black' );		
		this._blackSprite.opacity = chimaki_plugin.args.blackOpacity;
		this.addChild(this._blackSprite);
	}		
	Scene_File.prototype.createMeuBox = function (){
			this._menuBoxSprite = new Sprite(ImageManager.loadCattext('Menu_Box'));
			this.addChild(this._menuBoxSprite);
	}	
	Scene_File.prototype.createSystemButton = function (){

	}
	Scene_File.prototype.createBackButton = function (){
		this._sprite_backbutton = new Sprite_Button();
		this._sprite_backbutton.temp =  ImageManager.loadCattext('BACK_02');		
		this._sprite_backbutton.bitmap = ImageManager.loadCattext('BACK');
		this._sprite_backbutton.x = Graphics.boxWidth + chimaki_plugin.args.menu_sprite_back_pos_x;
		this._sprite_backbutton.y = Graphics.boxHeight + chimaki_plugin.args.menu_sprite_back_pos_y;

	    this._sprite_backbutton.setClickHandler(this.popSceneSp.bind(this));
		this.addChild(this._sprite_backbutton);
	}		
	Scene_File.prototype.popSceneSp = function (){
		SoundManager.playCancel();
		this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;		
		scene_file_last_select = this._listWindow.index();
		SceneManager.pop();
	}

	Scene_File.prototype.createListWindow = function (){
		let y = Graphics.height * 2 / 13;// / 5;
		var width = Graphics.width ;
		let height = Graphics.height * 2 / 3;
		this._listWindow = new Window_SavefileList(chimaki_plugin.config.save_file_window_offset_x , y,
													width, height);

	    this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
	    this._listWindow.setHandler('cancel', this.popScene.bind(this));

	    if (scene_file_last_select)
	    	this._listWindow.select(scene_file_last_select)
	    else  
	    	 this._listWindow.select(0); 
	    
	    this.addChild(this._listWindow);
	}
	Scene_File.prototype.popScene = function (){
		// SoundManager.playOk();
		this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;		
		scene_file_last_select = this._listWindow.index();
		SceneManager.pop();
	}
		
//=============================================================================
// Scren Save
//=============================================================================	
	Scene_Save.prototype.createSystemButton = function (){
		this._sprite_save = new Sprite(ImageManager.loadCattext('SAVE'));
		this._sprite_save.x = chimaki_plugin.args.menu_sprite_system_pos_x;
		this._sprite_save.y = chimaki_plugin.args.menu_sprite_system_pos_y;
		this.addChild(this._sprite_save);			
	}
//=============================================================================
// Scren Load
//=============================================================================	
	Scene_Load.prototype.createSystemButton = function (){
		this._sprite_load = new Sprite(ImageManager.loadCattext('LOAD'));
		this._sprite_load.x = chimaki_plugin.args.menu_sprite_system_pos_x;
		this._sprite_load.y = chimaki_plugin.args.menu_sprite_system_pos_y;
		this.addChild(this._sprite_load);			
	}
	chimaki_plugin.menucattext.alias.scene_load_on_success = Scene_Load.prototype.onLoadSuccess;
	Scene_Load.prototype.onLoadSuccess = function (){
		this.setIsLoadGame();
		chimaki_plugin.menucattext.alias.scene_load_on_success.call(this);

	}
	Scene_Load.prototype.setIsLoadGame = function (){
		log('set is load game')
		$gameVariables.setValue(chimaki_plugin.args.systemVar_load, 1);
	}
//=============================================================================
// 記錄擋 window
//=============================================================================	
	Window_SavefileList.prototype.initialize = function(x, y, width, height) {
	    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	    
	    this._mode = null;    
	    this.opacity = 0;
	    this._cursorAll = false;//
	    this._cursorFixed = false;//固定光標
	    this._room_bitmap = [];
	    this.opacity = 0;
	    this.initRoomBitMap();
	    this.activate();

	};
	Window_SavefileList.prototype.updateCursor = function() {
		var offsetX = 36;
	    if (this._cursorAll) {
	        var allRowsHeight = this.maxRows() * this.itemHeight();
	        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
	        this.setTopRow(0);
	    } else if (this.isCursorVisible()) {
	        var rect = this.itemRect(this.index());
	        this.setCursorRect(rect.x + offsetX, rect.y, rect.width - offsetX, rect.height);//實際光標位置
	    } else {
	        this.setCursorRect(0, 0, 0, 0);
	    }
	};	
	Window_Selectable.prototype.itemRect = function(index) {
	    var rect = new Rectangle();
	    var maxCols = this.maxCols();
	    rect.width = this.itemWidth();
	    rect.height = this.itemHeight();
	    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
	    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
	    return rect;
	};
	Window_NumberInput.prototype.itemWidth = function() {
    	return 265;
	};
	//override
	Window_SavefileList.prototype.itemHeight = function() {
	    var innerHeight = this.height - this.padding * 2;
	    return Math.floor(innerHeight / 3);
	};
	Window_SavefileList.prototype.drawItem = function(index) {
	    let id = index + 1;
	    let valid = DataManager.isThisGameFile(id);
	    let info = DataManager.loadSavefileInfo(id);
	    let rect = this.itemRectForText(index);

	    this.resetTextColor();
		this.addRoomItem(id,rect);

	    let x = rect.x + (Graphics.boxWidth * 11 / 12 / 4 - 220) * 2 / 3;
	    let y = rect.y + (Graphics.boxHeight * 2 / 3 / 2 - 130)  / 5;		
		this.drawFileId(id, x, y + rect.height - this.lineHeight() * 1.8, 185);		

	    if (info) {
	        this.changePaintOpacity(valid);	    	
			this.drawContents(info, rect, valid,id);
	        this.changePaintOpacity(true, rect.x - 10, rect.y);
	    }	    
	};
	Window_SavefileList.prototype.addRoomItem = function (id, rect){
		let bitmap
		let val = DataManager.isThisGameFile(id);
	    let lineHeight = this.lineHeight();
	    let x = rect.x + (Graphics.boxWidth * 11 / 12 / 4 - 220) * 2 / 3;
	    let y = rect.y + (Graphics.boxHeight * 2 / 3 / 2 - 130)  / 5;

		if (val){
			bitmap = this._room_bitmap[1];
		} else {
			bitmap = this._room_bitmap[0];
		}
		this.contents.blt(bitmap ,0 ,0, 265 ,145, x - 20, y - 20);
	}
	Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
	    var bottom = rect.y + rect.height;
	    var ofttsetX = 20;
	    var ofttsetY = -20;
	    if (rect.width >= 420) {
	        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
	        if (valid) {
	            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
	        }
	    }
	    var lineHeight = this.lineHeight();
	    var y2 = bottom - lineHeight;
	    if (y2 >= lineHeight) {
	        this.drawPlaytime(info ,rect.x + 20, y2 , rect.width);
	    }
	};	
	//override
	Window_SavefileList.prototype.drawFileId = function(id, x, y, width) {
	    this.drawText(id, x, y, width, 'left');
	}
	Window_SavefileList.prototype.initRoomBitMap = function (){
		for (let i = 1; i < 3; i ++){
			this._room_bitmap.push(ImageManager.loadCattext('Room_0' + i ));
		}	
	}
	//override
	Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
		var offset_y = chimaki_plugin.config.save_file_window_playtime_offset_y;
	    if (info.playtime) {
	    	this.resetTextColor();
	        this.drawText(info.playtime, x, y + offset_y, width, 'center');	       
	    }
	};
	//override
	Window_SavefileList.prototype.maxCols = function() {
	    return 4;
	};
	Window_SavefileList.prototype.maxRows = function() {
		return 3;
	};
	Window_SavefileList.prototype.maxItems = function() {
	    return 12;
	};

//=============================================================================
// Scene item
//=============================================================================
	class Scene_CatItem extends Scene_Item {
		constructor(){
			super();
		}
		initialize (){
			Scene_ItemBase.prototype.initialize.call(this);	
		}
		create (){

			Scene_ItemBase.prototype.create.call(this);
			
			this.createBackgroundSprite();
			this.createSystemBackImg();
			this.createMenuBox();
			this.createHelpWindow();
			this.createSystemButton();
			this.createBackButton();
			this.createItemWindow();
			this._itemWindow.setHelpWindow(this._helpWindow);
			this.createTouchSprite();
				
		}
		createBackgroundSprite (){
			this._blackSprite = new Sprite();
			this._blackSprite.bitmap = new Bitmap(chimaki_plugin.args.screenWidth,chimaki_plugin.args.screenHeight);		
			this._blackSprite.bitmap.fillRect ( 0 , 0 , chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, 'black' );		
			this._blackSprite.opacity = chimaki_plugin.args.blackOpacity;
			this._blackSprite.z = 1;
			this.addChildAt(this._blackSprite, 1);
		}		
		createSystemBackImg (){
		    this._backgroundSprite = new Sprite();
		    this._backgroundSprite.bitmap = ImageManager.loadCattext('Full_screen_02');	    	   
		   	this._backgroundSprite.x = -30;
		   	this._backgroundSprite.y = -142;
		}

		createMenuBox (){
			this._menuBoxSprite = new Sprite(ImageManager.loadCattext('Menu_Box'));
		}


		createSystemButton (){
			this._sprite_box = new Sprite(ImageManager.loadCattext('BOX'));
			this._sprite_box.x = chimaki_plugin.args.menu_sprite_system_pos_x;
			this._sprite_box.y = chimaki_plugin.args.menu_sprite_system_pos_y;
			this.addChild(this._sprite_box);			
		}		
		createBackButton(){

			this._sprite_backbutton = new Sprite_Button();
			this._sprite_backbutton.temp = ImageManager.loadCattext('BACK_02');
			this._sprite_backbutton.bitmap = ImageManager.loadCattext('BACK');
			this._sprite_backbutton.x = Graphics.boxWidth + chimaki_plugin.args.menu_sprite_back_pos_x;
			this._sprite_backbutton.y = Graphics.boxHeight + chimaki_plugin.args.menu_sprite_back_pos_y;

		    this._sprite_backbutton.setClickHandler(this.popScene.bind(this));
			this.addChild(this._sprite_backbutton);
		}
		popScene (){
			SoundManager.playCancel();
			this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;
			SceneManager.pop();
		}

		createItemWindow (){
		    this._itemWindow = new Window_CatItemList( 30, 142, Graphics.boxWidth - 59, Graphics.boxHeight - 286);
		    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		    // this._itemWindow.setTone(-255, -255, -255);
		    this._itemWindow.backOpacity = 0;
		    this._itemWindow.opacity = 255;

		    
		   	this._itemWindow.addChildToBack(this._backgroundSprite);
		   	
		   	this._itemWindow.activate();		   
		    this.addWindow(this._itemWindow);
		    
		}
		createHelpWindow (){
		    this._helpWindow = new Window_CatItemHelp();	    
		    this._helpWindow.y = Graphics.boxHeight  + chimaki_plugin.config.item_helpWindow_y;
		    this._helpWindow.opacity = 0;
		    this._helpWindow.addChildToBack(this._menuBoxSprite);
		   	this._menuBoxSprite.y  = -600;
			this._menuBoxSprite.x  = 0;
		    
		    this.addWindow(this._helpWindow);					
		}
		onItemCancel (){
			this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;
			SceneManager.pop();
		}

		useItem () {
		    this.playSeForItem();
		    this.user().useItem(this.item());
		    this.applyItem();
		    this.checkCommonEvent();
		    this.checkGameover();
	    
		};


	}
//=============================================================================
// cat window 
//=============================================================================
	class Window_CatItemList extends Window_ItemList{
		constructor (x, y, width, height){
			super(x, y, width, height);
		}
		initialize (x, y, width, height){
			Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		    this._category = 'item';
		    this._data = [];
		    this.refresh();
		}
		includes (item) {
			return true;    
		};		
		drawItemName (item, x, y, width) {
		    width = width || 312;
		    if (item) {
		        var iconBoxWidth = Window_Base._iconWidth + 4;
		        this.resetTextColor();
		        this.drawIcon(item.iconIndex, x + 2, y + 10);
		        this.drawText(item.name, 30 +x + iconBoxWidth, y, width - iconBoxWidth);
		    }
		}	
		lineHeight () {
	    	return this.width / 23;
		}
		standardFontSize (){
			return 32;
		}
		updateHelp (){
			this.setHelpWindowItem(this.item());			
		}
	}

	class Window_CatItemHelp extends Window_Help {
		constructor(numLines){
			super(numLines);
		}
		initialize(numLines){
		    var width = Graphics.boxWidth;
		    var height = this.fittingHeight(numLines || 2);
		    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
		    this._text = '';			
		}
		standardFontSize (){
			return 30;
		}
	}
//=============================================================================
// Scren options
//=============================================================================		

	Scene_Options.prototype.create = function() {
	    Scene_MenuBase.prototype.create.call(this);
	    
		this.createBackgroundSprite();
		this.createMeuBox()
		this.createOptionsWindow();
		this.createSystemButton();
		this.createBackButton();	    
		this.createTouchSprite();
	    
	};
	Scene_Options.prototype.createBackgroundSprite = function() {
		this._blackSprite = new Sprite();
		this._blackSprite.bitmap = new Bitmap(chimaki_plugin.args.screenWidth,chimaki_plugin.args.screenHeight);		
		this._blackSprite.bitmap.fillRect ( 0 , 0 , chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, 'black' );		
		this._blackSprite.opacity = chimaki_plugin.args.blackOpacity;
		this.addChild(this._blackSprite);
	}		
	Scene_Options.prototype.createMeuBox = function (){
		this._menuBoxSprite = new Sprite(ImageManager.loadCattext('Menu_Box'));
		this.addChild(this._menuBoxSprite);
	}	
	Scene_Options.prototype.createSystemButton = function (){
		this._sprite_system = new Sprite(ImageManager.loadCattext('SYSTEM'));
		this._sprite_system.x = chimaki_plugin.args.menu_sprite_system_pos_x;
		this._sprite_system.y = chimaki_plugin.args.menu_sprite_system_pos_y;
		this.addChild(this._sprite_system);
	}
	Scene_Options.prototype.createBackButton = function (){
		this._sprite_backbutton = new Sprite_Button();
		this._sprite_backbutton.temp = ImageManager.loadCattext('BACK_02');
		this._sprite_backbutton.bitmap = ImageManager.loadCattext('BACK');
		this._sprite_backbutton.x = Graphics.boxWidth + chimaki_plugin.args.menu_sprite_back_pos_x;
		this._sprite_backbutton.y = Graphics.boxHeight + chimaki_plugin.args.menu_sprite_back_pos_y;

	    this._sprite_backbutton.setClickHandler(this.popScene.bind(this));
		this.addChild(this._sprite_backbutton);
	}		
	Scene_Options.prototype.createOptionsWindow = function() {
	    this._optionsWindow = new Window_Options();
	    this._optionsWindow.opacity = chimaki_plugin.args.opction_opacity;
	    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
	    this.addChild(this._optionsWindow);
	};	
	Scene_Options.prototype.popScene = function (){
		SoundManager.playCancel();
		this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;
		SceneManager.pop();
	}


//=============================================================================
// game message 記錄對話
//=============================================================================		
	chimaki_plugin.menucattext.alias._game_msg_init = Game_Message.prototype.initialize;
	Game_Message.prototype.initialize = function() {
	    chimaki_plugin.menucattext.alias._game_msg_init.call(this);
	    this._totalmsg = [];
	    
	};
	chimaki_plugin.menucattext.alias._game_msg_add = Game_Message.prototype.add;
	Game_Message.prototype.add = function(text) {
	    chimaki_plugin.menucattext.alias._game_msg_add.call(this, text);
	    this.saveToLog(text);
	};
	Game_Message.prototype.saveToLog = function(text){
		this._totalmsg = this._totalmsg || [];		
		let len = this._totalmsg.lenght - 1;
		if (this._totalmsg[len] == text) return;
		if (this._totalmsg.lenght > 100) this._totalmsg.shift();

		this._totalmsg.push(text);
		$gameVariables.setValue(chimaki_plugin.args.saveText, this._totalmsg);
	}
	Game_Message.prototype.getTotalMsg = function (){
		this._totalmsg = $gameVariables.value(chimaki_plugin.args.saveText)
		return  this._totalmsg;
	}

//=============================================================================
// window back log 記錄對話
//=============================================================================		
	class Window_BackLog extends Window_Base {
		constructor (x, y, width, height){
			super(x, y, width, height)
		}
		initialize(x, y, width, height){
			Window_Base.prototype.initialize.call(this, x, y, width , height);
			this._list = $gameMessage.getTotalMsg() || [];
			this._alltext = '';
			this._alltextHeight = 0;
			this.opacity = 200;
			this._handlers = {};
			this._contectbasey = 30;

			this._scorll_offset =  -60;

		    this._backgroundSprite = new Sprite();
		    this._backgroundSprite.x -= this.x;
		    this._backgroundSprite.y -= chimaki_plugin.config.backlog_window_y;
		    this._backgroundSprite.bitmap = ImageManager.loadCattext('Full_screen_02');	    	   
		    this.addChildToBack(this._backgroundSprite);

		    this._up_down_hieght = 60;
		    this._button_reset_count = 0;

			this.createBackArrow();
			this.createSpriteUp();
			this.createSpriteDown();
			this.showBackLog();
			
			this._wait = 0;
		}
		buttonwait (num){
			this._button_reset_count = num;
		}
		updateButtonWait (){
			if (this._button_reset_count > 0){
				this._button_reset_count--;
			}
		}
		isWaitButton (){
			return this._button_reset_count > 0 ;
		}
		resetButton (){
			this._downArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_03');
			this._upArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_01');			
		}
		createSpriteUp (){
			this._arr_up = new Sprite_Button();
			this._arr_up.bitmap = new Bitmap(this.width, this._up_down_hieght);
			this._arr_up.setClickHandler(this.scrollPageUp.bind(this));
			this.addChild(this._arr_up);

		}
		createSpriteDown (){
			this._arr_down = new Sprite_Button();
			this._arr_down.bitmap = new Bitmap(this.width, this._up_down_hieght)
			this._arr_down.y =  this.height - this._up_down_hieght;
			this._arr_down.setClickHandler(this.scrollPageDown.bind(this));
			this.addChild(this._arr_down);
		}
		createBackArrow (){
			ImageManager.loadCattext('Menu_Arrow_02');
			ImageManager.loadCattext('Menu_Arrow_04');
			let opacity = 165;
			let scale = 0.7;
			this._upArrow = new Sprite_Button();
			this._upArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_01');
			this._upArrow.x = (this.x + this.width ) / 2 - 45;
			this._upArrow.y = 15;
			// this._upArrow.scale.y = scale;
			// this._upArrow.opacity = opacity;

			this._downArrow = new Sprite_Button();
			this._downArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_03');
			
			this._downArrow.x = this._upArrow.x;
			// this._downArrow.scale.y = scale;
			this._downArrow.y = this.height + this._scorll_offset;
			// this._downArrow.opacity = opacity;

			// this._upArrow.setClickHandler(this.callUpPage.bind(this));
			// this._downArrow.setClickHandler(this.callDownPage.bind(this));


			this._downArrow.visible = true;

			this.addChild(this._upArrow);
			this.addChild(this._downArrow);



		}		
		callUpPage (){
			this.scrollPageUp();

		}
		callDownPage (){
			this.scrollPageDown()
		}


		calcTextHeight (textState, all) {
		    var lastFontSize = this.contents.fontSize;
		    var textHeight = 0;
		    var lines = textState.text.slice(textState.index).split('\n');
		    var maxLines = all ? lines.length : 1;

		    for (var i = 0; i < maxLines; i++) {
		        var maxFontSize = this.contents.fontSize;
		        textHeight += maxFontSize + this.standardFontSize();
		    }
		    this.contents.fontSize = lastFontSize;
		    return textHeight;
		}
		itemRectForText (){

		    var rect = this.itemRect(index);
		    rect.x += this.textPadding();
		    rect.width -= this.textPadding() * 2;
		    return rect;			
		}
		standardFontSize (){
			return 28;
		}
		standardPadding (){
			return 30;
		}

		showBackLog (){
			for (let i in this._list){
				this._alltext += this._list[i] + "\n";
			}
			let textState = {index : 0};
			textState.text = this.convertEscapeCharacters(this._alltext);
			this._alltextHeight = this.calcTextHeight(textState, true) ;
			this.createContents();			
			this.drawTextEx(this._alltext, this.textPadding(), 1);
			this.setDefaultY()


		}
		setDefaultY (){
			if (this._alltextHeight > this.height){
				this.origin.y = this._alltextHeight - this.height;
			}			
			if (this.origin.y <= this._contectbasey ){
				this._downArrow.visible = false;
			}
		}
		createContents () {
		    this.contents = new Bitmap(this.contentsWidth(), this._alltextHeight);
		    this.resetFontSettings();
		}
		convertEscapeCharacters (text) {
			let content = Window_Base.prototype.convertEscapeCharacters.call(this, text);
		    content = content.replace(/[\{\}]/, ''); // backlog 不管大小字
		    return content;
		};	
		updatewait (){
			if (this._wait > 0){
				this._wait--;
			}
		}	
		watiting (){
			return this._wait > 0;
		}

		processHandling (){


	        if (this.isCancelEnabled() && (this.isCancelTriggered() || TouchInput.isCancelled())) {
	            this.processCancel();
	        } else if (this.isHandled('pagedown') || Input.isTriggered('pagedown')) {	        	
	            this.processPagedown();
	        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
	            this.processPageup();
			}

			else if (Input.isTriggered('down') || Input.isRepeated('down') ){				
				this.scrollPageDown();
			}
			else if (Input.isTriggered('up') || Input.isRepeated('up') ){	
				this.scrollPageUp();
			}



			if (TouchInput.isPressed()){

				if (this._downArrow.isButtonTouched()){


				}
				if (this._upArrow.isButtonTouched()){

				// 	this.scrollPageUp();
				// 	this._wait += 10;					
				}
			}

			if (this.origin.y == this._alltextHeight - this.height ){
				this._downArrow.visible = false;					
			}
			else if (!(this.origin.y <= this._contectbasey && this._alltextHeight <= this.height)){
				this._downArrow.visible = true;
			}
			if (this.origin.y <= 0 ){
				this._upArrow.visible = false;					
			}
			else {
				this._upArrow.visible = true;
			}			
		}
		scrollPageDown (){
			if (!this._downArrow.visible) return;
			this._downArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_04');

			if (this.origin.y < this._alltextHeight - this.height){
				SoundManager.playCursor();
				this.origin.y += this._contectbasey;			
			}
			else {
				this.origin.y = this._alltextHeight - this.height;
			}
			this.buttonwait(5);

		}
		scrollPageUp (){
			if (!this._upArrow.visible) return;
			
			if (this.origin.y - this._contectbasey >= 0){
				SoundManager.playCursor();					
				this._upArrow.bitmap = ImageManager.loadCattext('Menu_Arrow_02');
				this.origin.y -= this._contectbasey;
				// this.origin.y = 0;	
			}
			else {					
				// log('eee')
				this.origin.y = 0;	
			}			

			this.buttonwait(5);			
		}

		processPagedown (){
		    SoundManager.playCursor();
		    this.updateInputData();
		    this.deactivate();
		    this.callHandler('pagedown');			
		}
		setHandler (symbol, method){
			this._handlers[symbol] = method;
			
		}
		update (){
		    Window_Base.prototype.update.call(this);
		    this.updatewait();
		    this.updateButtonWait()
		    if (!this.watiting()){
		    	this.processHandling();	
		    }
		    if (!this.isWaitButton()){
		    	this.resetButton();
		    }
		    
		    this._stayCount++;			
		    
		}
		processCancel (){
		    SoundManager.playCancel();
		    this.updateInputData();
		    this.callCancelHandler();			
		}
		updateInputData (){
		    Input.update();
		    TouchInput.update();			
		}
		isCancelEnabled (){
			return this.isHandled('cancel');
		}
		isCancelTriggered (){
			return Input.isRepeated('cancel');
		}
		callCancelHandler (){
			this.callHandler('cancel');
		}
		callHandler (symbol){
		    if (this.isHandled(symbol)) {
		        this._handlers[symbol]();
		    }			
		}
		isHandled (symbol){
			return !!this._handlers[symbol];
		}
	}

//=============================================================================
// Scene backlog
//=============================================================================
	class Scene_BackLog extends Scene_MenuBase {
		constructor (){
			super();
		}
		initialize (){
			Scene_MenuBase.prototype.initialize.call(this);
		}
		create (){
			Scene_MenuBase.prototype.create.call(this);	
			this.createBlackSprite();
			this.createBackgroundSprite();
			
			this.createMenuBox();

			this.createSystemButton()
			this.createBackButton();
			this.createLogWindow();

			// this.createBackArrow();
			this.createTouchSprite();

		}


		createMenuBox (){
			this._menuBoxSprite = new Sprite(ImageManager.loadCattext('Menu_Box'));
			this.addChild(this._menuBoxSprite);
		}		
		createSystemButton(){
			this._sprite_system = new Sprite(ImageManager.loadCattext('BACKLOG'));
			this._sprite_system.x = chimaki_plugin.args.menu_sprite_system_pos_x;
			this._sprite_system.y = chimaki_plugin.args.menu_sprite_system_pos_y;
			this.addChild(this._sprite_system);
		} 
		createBlackSprite (){
			this._blackSprite = new Sprite();
			this._blackSprite.bitmap = new Bitmap(chimaki_plugin.args.screenWidth,chimaki_plugin.args.screenHeight);		
			this._blackSprite.bitmap.fillRect ( 0 , 0 , chimaki_plugin.args.screenWidth, chimaki_plugin.args.screenHeight, 'black' );		
			this._blackSprite.opacity = chimaki_plugin.args.blackOpacity;
			this.addChild(this._blackSprite);
		}					

		createBackgroundSprite(){
			this._backgroundSprite = new Sprite(ImageManager.loadCattext('Full_screen'));
			// this.addChild(this._backgroundSprite);

		}
		createBackButton(){
			this._sprite_backbutton = new Sprite_Button();
			this._sprite_backbutton.temp = ImageManager.loadCattext('BACK_02');
			this._sprite_backbutton.bitmap = ImageManager.loadCattext('BACK');
			this._sprite_backbutton.x = Graphics.boxWidth + chimaki_plugin.args.menu_sprite_back_pos_x;
			this._sprite_backbutton.y = Graphics.boxHeight + chimaki_plugin.args.menu_sprite_back_pos_y;

		    this._sprite_backbutton.setClickHandler(this.popScene.bind(this));
			this.addChild(this._sprite_backbutton);
		}
		createLogWindow (){
			this._logWindow = new Window_BackLog( 31, chimaki_plugin.config.backlog_window_y, chimaki_plugin.config.backlog_window_width, chimaki_plugin.config.backlog_window_height);
			this._logWindow.setHandler('cancel', this.popScene.bind(this));
			this.addChild(this._logWindow);
		}

		popScene (){
			SoundManager.playCancel();
			this._sprite_backbutton.bitmap = this._sprite_backbutton.temp;
			SceneManager.pop();
		}
	}
//=============================================================================
// 改變選項框
//=============================================================================	
	Window_ChoiceList.prototype.windowY = function (){
		return (Graphics.height / 2) - (this.windowHeight /2);
	}
	Window_ChoiceList.prototype.windowWidth = function (){
		return Graphics.boxWidth + chimaki_plugin.args.choicesMessageOffice * 2;	
	}
	Window_ChoiceList.prototype.updatePlacement = function() {		
	    var positionType = $gameMessage.choicePositionType();
	    var messageY = this._messageWindow.y;
	    this.width = this.windowWidth();
	    this.height = this.windowHeight();
	    positionType = 1;
	    switch (positionType) {
	    case 0:
	        this.x = 0;
	        break;
	    case 1:
	        this.x = (this.windowWidth() - this.width) / 2  - chimaki_plugin.args.choicesMessageOffice;
	        break;
	    case 2:
	        this.x = (this.windowWidth() - this.width) /2 - chimaki_plugin.args.choicesMessageOffice;
	        break;
	    }
	    if (messageY >= Graphics.boxHeight / 2) {
	        this.y = (Graphics.boxHeight / 2 - this.height /2) + chimaki_plugin.args.choices_y_offset;
	    } else {
	        this.y = (Graphics.boxHeight / 2 - this.height /2) + chimaki_plugin.args.choices_y_offset;
	    }
	};

	Window_ChoiceList.prototype.maxChoiceWidth = function() {
	    var maxWidth = (this.windowWidth());
	    var choices = $gameMessage.choices();
	    for (var i = 0; i < choices.length; i++) {
	        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
	        if (maxWidth < choiceWidth) {
	            maxWidth = choiceWidth;	        
	        }
	    }
	    return maxWidth;
	};
	Window_ChoiceList.prototype.processNormalCharacter = function(textState) {
	    var c = textState.text[textState.index++];
	    var w = this.textWidth(c);
	    this.contents.drawText(c,  textState.x  , textState.y, w * 2, textState.height);
	    textState.x += w;
	};		
	Window_ChoiceList.prototype.textWidthEx = function(text) {
	    return this.drawTextEx(text , 0, this.contents.height);
	};
	Window_ChoiceList.prototype.drawItem = function(index) {

	    var rect = this.itemRectForText(index);
	    var w  = this.contents.measureTextWidth(this.commandName(index));
	    this.drawTextEx(this.commandName(index), Graphics._boxWidth / 2 - w / 2  + chimaki_plugin.args.choicesMessageOffice - this.standardPadding() , rect.y , this.windowWidth() , 'left');
	};

//=============================================================================
// 記錄流程的debug window
//=============================================================================	
	Window_MapName.prototype.refresh = function() {
	    this.contents.clear();
	    if ($gameMap &&$gameMap.displayName()) {
	        var width = this.contentsWidth();
	        this.drawBackground(0, 0, width, this.lineHeight());
	        this.drawText($gameMap.displayName(), 0, 0, width, 'center');
	    }
	};
//=============================================================================
// 記錄檔案調整, 防相沖
//=============================================================================	
	chimaki_plugin.menucattext.alias._datmanager_make_save = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function (){
	    let p = $gameScreen._pictures;
	    for (i in p){
	    	if (i >= 2 && i <= 10) $gameScreen.erasePicture(i);
	    }	 				
		let contents = chimaki_plugin.menucattext.alias._datmanager_make_save.call(this);
		return contents;
	}


//=============================================================================
// Scene map 改寫, call menu , 對話紀錄
//=============================================================================	

	chimaki_plugin.menucattext.alias._scene_map_call_menu = Scene_Map.prototype.callMenu;
	Scene_Map.prototype.callMenu = function (){ 	
		SoundManager.playOk();
		if (!this.allMenuSwitch()){
			chimaki_plugin.menucattext.alias._scene_map_call_menu.call(this);
		}	
		else {
			is_call_menu = true;
			this.setCatCallMenu();
		}
	}
	chimaki_plugin.menucattext.alias._scene_map_init = Scene_Map.prototype.initialize;
	Scene_Map.prototype.initialize = function (){
		chimaki_plugin.menucattext.alias._scene_map_init.call(this);
		this._lastMini_menu = false;
		this._fullScreenMode = null;


		if (this.isLoadGameToMap()){
			this.setBackToInterpreTerCommand();
			this.setIsCallMenu();
		}
		else if (is_call_menu){
			this.setGameInterpreter();
			this.setIsCallMenu();
		}
	}
	chimaki_plugin.menucattext.alias._scene_map_createdisplay = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function (){
		
		chimaki_plugin.menucattext.alias._scene_map_createdisplay.call(this);		
		this.createBackgroundImg();
		this.createMiniMenuSprite();
		this.createTouchSprite();
	}


	
	chimaki_plugin.menucattext.alias._scene_map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function (){	
		this.updateFullScreenMode();
		chimaki_plugin.menucattext.alias._scene_map_update.call(this);
		this.updateMiniMenu();
		this.updateTouchSprite();

	}
	Scene_Map.prototype.updateFullScreenMode = function (){
		if (this._fullScreenMode != fullScreenMode){
			this._fullScreenMode = fullScreenMode
			// if (this._fullScreenMode)
				// this._backWindow.open();
			// else
				// this._backWindow.close();
		}
	}

	chimaki_plugin.menucattext.alias._scene_map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function(){
		chimaki_plugin.menucattext.alias._scene_map_start.call(this);
		$gameVariables.setValue(chimaki_plugin.args.systemVar_load, 0);

	}
	Scene_Map.prototype.setBackToInterpreTerCommand = function (){
		let index = $gameMap._interpreter._index - 1;
		if (index < 0) index = 0;
		if (this.isInterpreterNeedBack($gameMap._interpreter, index)){
			log('into do interpreter back')
			for (let i = 0; i < 5; i++){
				if ($gameMap._interpreter._list[index - i].code == 101){
					$gameMap._interpreter._index = index - i ;
					break;
				}
			}			
		}

		// child
		if ($gameMap._interpreter._childInterpreter != null){
			let childIndex = $gameMap._interpreter._childInterpreter._index - 1;
			if (childIndex) childIndex = 0;

			if (this.isInterpreterNeedBack($gameMap._interpreter._childInterpreter, childIndex)){
				log('into do interpreter child back')
				for (var i = 0; i < 5; i++){
					if ($gameMap._interpreter._childInterpreter._list[childIndex - i].code == 101){
						$gameMap._interpreter._childInterpreter._index = childIndex - i  ;			
						break;
					}
				}				
			}
			else {
				$gameMap._interpreter._childInterpreter._index -= 2;
			}
		}
	}
	Scene_Map.prototype.createBackgroundImg = function (){		
		let bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
		bitmap.fillAll('black');

		this._backWindow = new Window_Base();
		this._backWindow.width = Graphics.boxWidth;
		this._backWindow.height = Graphics.boxHeight;		
		this._backWindow.windowskin = bitmap;
		this._backWindow.opacity = 150;
		this._backWindow.hide();
		this._backWindow.close();
		this._backWindow.show();
		// this.addChildAt(this._backWindow, 2);

	}
	Scene_Map.prototype.isInterpreterNeedBack = function (interpreter, index){
		return (interpreter != null && interpreter._list != null && interpreter._list[index].code == 102);
	}
	Scene_Map.prototype.setGameInterpreter = function (){
		log('進入儲存')
		$gameMap._interpreter = $gameVariables.value(chimaki_plugin.args.systemVar);
	}
	Scene_Map.prototype.setCatCallMenu = function (){
		this._miniSpbutton.bitmap = this._miniSpbutton.temp;
		this.setGameInterpreter();
	    SceneManager.push(Scene_CatMenu);
	    Window_MenuCommand.initCommandPosition();
	    $gameTemp.clearDestination();
	    this._mapNameWindow.hide();
	    this._waitCount = 2;
	}
	Scene_Map.prototype.isLoadGameToMap = function (){
		return $gameVariables.value(chimaki_plugin.args.systemVar_load);
	}
	Scene_Map.prototype.setGameInterpreter = function (){
		$gameVariables.setValue(chimaki_plugin.args.systemVar, $gameMap._interpreter);
		log('save game interpreter');
		log($gameVariables.value(chimaki_plugin.args.systemVar));	
	}
	Scene_Map.prototype.updateMiniMenu = function (){
		if (this._lastMini_menu != this.miniMenuSwitch()){
			this._lastMini_menu = this.miniMenuSwitch();
			if (this.miniMenuSwitch() &&  this.allMenuSwitch())
				this._miniSpbutton.visible = true;
			else 
				this._miniSpbutton.visible = false;
		}		
	}
	Scene_Map.prototype.miniMenuSwitch = function (){
		return $gameSwitches.value(chimaki_plugin.args.miniMenuSwitch);
	}
	Scene_Map.prototype.allMenuSwitch = function (){
		return $gameSwitches.value(chimaki_plugin.args.menu_switch);
	}	
	Scene_Map.prototype.createMiniMenuSprite = function (){
		this._miniSpbutton = new Sprite_Button();
		this._miniSpbutton.temp = ImageManager.loadCattext('MENU_02');
		this._miniSpbutton.bitmap = ImageManager.loadCattext('MENU_01');
		this._miniSpbutton.x = Graphics.boxWidth - chimaki_plugin.config.miniMenuWidth;
		this._miniSpbutton.y = Graphics.boxHeight - chimaki_plugin.config.miniMenuHeight;
		
		this._miniSpbutton.setClickHandler(this.callMenu.bind(this));
		this._miniSpbutton.visible = false;

		this.setMiniMenuRectangle();
		this.addChild(this._miniSpbutton);
	}

	//	for touch mini menu
	Scene_Map.prototype.setMiniMenuRectangle = function (){
		chimaki_plugin.args.miniRectangle.x = this._miniSpbutton.x;
		chimaki_plugin.args.miniRectangle.y = this._miniSpbutton.y;
		chimaki_plugin.args.miniRectangle.width = chimaki_plugin.config.miniMenuWidth;
		chimaki_plugin.args.miniRectangle.height = chimaki_plugin.config.miniMenuHeight;
	}
	Scene_Map.prototype.setIsCallMenu = function (){		
		is_call_menu = false
	}

	// 多餘的
	Scene_Map.prototype.isBusy = function() {
	    return ((this._messageWindow && this._messageWindow.isClosing()) ||
	            this._waitCount > 0 || this._encounterEffectDuration > 0 ||
	            Scene_Base.prototype.isBusy.call(this));
	};	

	Spriteset_Map.prototype.createDestination = function() {
	    this._destinationSprite = new Sprite_Destination();
	    this._destinationSprite.z = 9;
	    // this._tilemap.addChild(this._destinationSprite);
	};	

//=============================================================================
// 全畫面光標
//=============================================================================	
	Sprite_Destination.prototype.createBitmap = function() {
		// if ($gameMap && $gameMap.tileWidth() ){


	    var tileWidth = $gameMap ? $gameMap.tileWidth() : 0;
	    var tileHeight = $gameMap ? $gameMap.tileHeight() : 0;
	    this.bitmap = new Bitmap(tileWidth, tileHeight);
	    this.bitmap.fillAll('white');
	    this.anchor.x = 0.5;
	    this.anchor.y = 0.5;
	    this.blendMode = Graphics.BLEND_ADD;
	    // }
	};
	function Sprite_TouchCursor() {
	    this.initialize.apply(this, arguments);
	}

	Sprite_TouchCursor.prototype = Object.create(Sprite_Destination.prototype);
	Sprite_TouchCursor.prototype.constructor = Sprite_TouchCursor;

	Sprite_TouchCursor.prototype.initialize = function() {
	    Sprite_Destination.prototype.initialize.call(this);
	};
	Sprite_TouchCursor.prototype.createBitmap = function() {
	    var tileWidth = 48
	    var tileHeight = 48
	    this.bitmap = new Bitmap(tileWidth + Number(chimaki_plugin.args.cursor[0]) + 10, tileHeight + Number(chimaki_plugin.args.cursor[1]) + 10);
	    this.bitmap.drawCircle(this.bitmap.width / 2 , this.bitmap.height / 2 , this.bitmap.width / 2, chimaki_plugin.args.cursor[3]);	
	    this.anchor.x = 0.5;
	    this.anchor.y = 0.5;
	    this._wait = 0;
	    // this.blendMode = Graphics.BLEND_ADD;
	    this._maxCount;
	};
	Sprite_TouchCursor.prototype.updateWait = function (){
		if (this._wait > 0){
			this._wait--;
		}
	}
	Sprite_TouchCursor.prototype.isWaiting = function (){
		return this._wait > 0;
	}	
	Sprite_TouchCursor.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updateWait();
		if (this.isWaiting()){
			if (!this.visible) this.visible = true;
			this.updateAnimation();	
		}
		else {
			if (this.visible) this.visible = false;
		}
	};
	Sprite_TouchCursor.prototype.updateAnimation = function() {
	    this._frameCount++;
	    this._frameCount %= 20;
	    this.opacity = (20 - this._frameCount) * 6;
	    this.scale.x = 0.7 + this._frameCount / 20;
	    this.scale.y = this.scale.x;
	};	
	Sprite_TouchCursor.prototype.setAiTime = function( count ){
		this._wait = count;
		this._frameCount = 0;
	}

	chimaki_plugin.menucattext.alias._scene_muenbase_update = Scene_MenuBase.prototype.update;
	Scene_MenuBase.prototype.update = function (){
		this.updateTouchSprite();
		chimaki_plugin.menucattext.alias._scene_muenbase_update.call(this);
	
	}
	chimaki_plugin.menucattext.alias._menubase_create = Scene_MenuBase.prototype.create;
	Scene_MenuBase.prototype.create = function() {
		chimaki_plugin.menucattext.alias._menubase_create.call(this);
		this.createTouchSprite();

	};	
	Scene_MenuBase.prototype.updateTouchSprite = function (){
		if (this.isMapTouchOk()){
		    if (TouchInput.isPressed() || this._touchCount > 0) {
	                var x = TouchInput.x;
	                var y = TouchInput.y;
	                this._touchSprite.x = x;
	                this._touchSprite.y = y;
	                this._touchSprite.setAiTime(Number(chimaki_plugin.args.cursor[2]));
		    }
		}		
	}
	chimaki_plugin.menucattext.alias._scene_muenbase_create = Scene_MenuBase.prototype.create;
	Scene_MenuBase.prototype.createTouchSprite = function (){
		this._touchSprite = new Sprite_TouchCursor();
		this._touchSprite.z = 12;
		this.addChild(this._touchSprite);
	}
	Scene_MenuBase.prototype.isMapTouchOk = function (){
		return this._active;
	}

	Scene_Base.prototype.createTouchSprite = function() {
		this._touchSprite = new Sprite_TouchCursor();
		this._touchSprite.z = 12;
		this.addChild(this._touchSprite);		
	};
	Scene_Base.prototype.updateTouchSprite = function (){
		// if (this.isMapTouchOk()){
		    if (TouchInput.isPressed() || this._touchCount > 0 ) {

	                var x = TouchInput.x;
	                var y = TouchInput.y;
	                this._touchSprite.x = x;
	                this._touchSprite.y = y;
	                this._touchSprite.setAiTime(Number(chimaki_plugin.args.cursor[2]));
		    }
		// }		
	}
	chimaki_plugin.menucattext.alias._scene_title_create = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
		chimaki_plugin.menucattext.alias._scene_title_create.call(this);
	    Scene_Base.prototype.create.call(this);
	    this.createTouchSprite();

	};		
	Scene_Title.prototype.update = function() {
		this.updateTouchSprite();
	    if (!this.isBusy()) {
	        this._commandWindow.open();
	    }
	    Scene_Base.prototype.update.call(this);

	};	
	Scene_Title.prototype.isMapTouchOk = function (){
		return this._active;
	}	

	chimaki_plugin.menucattext.alias._scene_title_new = Scene_Title.prototype.commandNewGame;
	Scene_Title.prototype.commandNewGame = function() {
		chimaki_plugin.menucattext.alias._scene_title_new.call(this);

	};


	Scene_Title.prototype.commandContinue = function() {
	    this._commandWindow.close();
	    SceneManager.push(Scene_Load);
	};

	Scene_Title.prototype.commandOptions = function() {
	    this._commandWindow.close();
	    SceneManager.push(Scene_Options);
	};

	class Scene_CatEnd extends Scene_Options {
		constructor (){
			super();
		}
		initialize (){
			Scene_Options.prototype.initialize.call(this);
		}
		create () {
	    	Scene_MenuBase.prototype.create.call(this);
	    
			this.createBackgroundSprite();
			this.createMeuBox()

			this.createSystemButton();
			this.createBackButton();	    
			this.createBackTitleWindow();			
			this.createTouchSprite();
	    
		};
		createBackTitleWindow (){
		    this._commandWindow = new Window_CatEnd();
		    this._commandWindow.setHandler('toTitle',  this.commandToTitle.bind(this));
		    this.addChild(this._commandWindow);			
		}

		commandToTitle (){
		    this.fadeOutAll();
		    SceneManager.goto(Scene_Title);			
		}
		onCancel (){
			SoundManager.playCancel();			
			SceneManager.pop();
		}
		update (){
			Scene_Options.prototype.update.call(this);			
			if (TouchInput.isCancelled() || Input.isTriggered('escape') || Input.isTriggered('cancel')){
				this.onCancel();
			}
		}

	}

	class Window_CatEnd extends Window_GameEnd{
		constructor (){
			super();
		}
		initialize (){
			Window_GameEnd.prototype.initialize.call(this);
			this.windowskin = ImageManager.loadSystem('Window_Noframe');
			this.opacity = 0;
		}
		updatePlacement () {
		    this.x = -25 ;
    		this.y = (Graphics.boxHeight - this.height) / 2;
		};
		windowWidth () {
		    return Graphics.boxWidth + 50;
		};		
		makeCommandList () {
		    this.addCommand('Back to title', 'toTitle');
		};		
		drawItem (index) {
		    var rect = this.itemRectForText(index);
		    var align = this.itemTextAlign();
		    this.resetTextColor();
		    this.changePaintOpacity(this.isCommandEnabled(index));
		    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
		};

	}

	window.Scene_CatGakuen = Scene_CatGakuen;
	window.Scene_CatItem = Scene_CatItem;
	window.Scene_CatEnd = Scene_CatEnd;

}());




















