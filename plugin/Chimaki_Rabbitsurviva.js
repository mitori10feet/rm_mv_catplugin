//=============================================================================
// Chimaki_Rabbitsurviva.js
// Version: 2.0
//=============================================================================
/*:
* @plugindesc 兔子生存功能
* @author Chimaki 
* 
* @param MenuSwitch
* @desc This is the switch of all system.
* @default 90
* 
* @param MenuImageVar
* @desc 用哪一個變數決定圖片變換
* @default 2
* 
* @param MenuImageName
* @desc 圖片輪播參數 [變數值, 圖片主檔名, 偵] 為一組, 用分號隔開
* @default [1,Broken,1];[2,Normal,30];[3,Uncomfortable,10]
* 
* @param needGold
* @desc 金幣視窗控制開關
* @default 3
* 
* @param menuContral
* @desc 指令控制
* @default 
*
* 
*/


'use strict';

var Imported = Imported || {};
Imported.Chimaki_Rabbitsurviva = Imported.Chimaki_Rabbitsurviva || {};
var rabbitsurviva =  Imported.Chimaki_Rabbitsurviva;

rabbitsurviva.alias = {};
rabbitsurviva.param = {};
rabbitsurviva.contst = {};


var surviva = rabbitsurviva.param;

var surviva = PluginManager.parameters('Chimaki_Rabbitsurviva');
var chimaki_menu_switch = Math.floor(surviva['MenuSwitch']|| 90);	
var chimaki_menu_img_data = surviva["MenuImageName"].split(";");
var chimaki_menu_img_var = Math.floor(surviva['MenuImageVar'] || 2);
var chimaki_need_gold = Math.floor(surviva['needGold'] || 3);	
var menu_button_offsetY = 80;
var rabbit_back_opacity = 165;

rabbitsurviva.contst.statu_width = 1222;
rabbitsurviva.contst.statu_height = 169;
rabbitsurviva.contst.statu_y = 131;
rabbitsurviva.contst.statu_x = 30;
rabbitsurviva.contst.type_x = 30;
rabbitsurviva.contst.type_y = 30;

rabbitsurviva.contst.status_infoX = 30;
rabbitsurviva.contst.status_infoY = 130;
rabbitsurviva.contst.status_name_infoX = rabbitsurviva.contst.status_infoX + 160;
rabbitsurviva.contst.status_name_offsetY = 50;

rabbitsurviva.contst.status_hp_infoX = rabbitsurviva.contst.status_name_infoX + 180; 
rabbitsurviva.contst.status_hp_offsetY = 80;
rabbitsurviva.contst.GaugeHeight = 20;
rabbitsurviva.contst.status_hpFontSize = 40;
rabbitsurviva.contst.param_infoX = rabbitsurviva.contst.status_hp_infoX + 250;

rabbitsurviva.contst.status_param_infoX = rabbitsurviva.contst.param_infoX + 100;
rabbitsurviva.contst.param_lineheight_offset = 10;
(function(){




	class Window_RabbitSurviva extends Window_Base {
		constructor (x, y , w ,h){
			super(x, y , w ,h);
		}
		initialize (x , y, w, h){
			Window_Base.prototype.initialize.call(this, x, y, w, h);
			this.openness = 0;
			this._list = [];

			this.createAllSpriteButton();
			this.select(0);

		}
		update (){
			Window_Base.prototype.update.call(this)	;
			if (TouchInput.isTriggered()){
				this.updateMenuBeTouch();	
			}
			else if (Input.isTriggered('up') || Input.isTriggered('down')){
				this.clearTouched()
				this.updateSelect();
			}
			else if (Input.isTriggered('cancel')){
				SoundManager.playCancel()
				SceneManager.pop();
			}
			if (Input.isTriggered('ok')){
				this.processHandler(this.index());
			}			
			
		}

		processHandler ( index ){
			this._list[index]._clickHandler();
		}

		clearTouched (){
			this._list.forEach(function (sp ){
					sp.setBeSelect(false);	
			})						
		}
		updateMenuBeTouch (){
			this.clearTouched();
			this._list.forEach(function (sp ){
				if (sp._touching){
					sp.setBeSelect(true);	
				}
			})
			for (let i = 0; i < this._list.length; i++){
				let sp = this._list[i];
				if (sp.isBeSelect()){
					this.select(i);
				}
			}
		}
		select ( index ){
			this._index = index;
			this._list[index].setBeSelect(true);
		}
		createAllSpriteButton (){
			this._menu_filed = new Sprite();
			this.createSubSprite();
			this.addChild(this._menu_filed);	
		}
		createSubSprite (){
			let list = this.getMenuKeyName();
			for (let i = 0; i < list.length; i++){
				let name = list[i];
				let sp = new Sprite_ButtonMenu();
				let bitmap = ImageManager.loadRabbitsurvival("Icon_" + name);
				sp.bitmap = bitmap;
				sp.setColdFrame(0, 0, 286,60);
				sp.setHotFrame(0, 60, 286,60);
				sp.y = i * menu_button_offsetY;
				sp.key_name = name;

				sp.setClickHandler(eval ("this.on" + name + "click.bind(this)" )); // handler function

				this._list.push(sp);		
				this._menu_filed.addChild(sp);

			}
		}



		onItemOk () {
		    $gameParty.setLastItem(this.item());
		    this.determineItem();
		};		
		onBOXclick (){
			SceneManager.push(Scene_CatItem);
		}
		onSKILLclick (){	
			SceneManager.push(Scene_RabbitSkill);
		}
		onEQUIPclick (){
			SceneManager.push(Scene_RabbitEquip);
		}
		onSTATUSclick (){
			SceneManager.push(Scene_RabbitStatus);
		}	
		onSAVEclick (){
			SceneManager.push(Scene_Save);
		}
		onGAKUENclick (){
			SceneManager.push(Scene_CatGakuen);
		}	
		onSOUNDclick (){
			SceneManager.push(Scene_Options);
		}	
		onEXITclick (){
			SceneManager.push(Scene_RabbitGameEnd);
		}	
		onBACKclick (){
			SceneManager.pop();
		}									
		getMenuKeyName (){
		    var flags = $dataSystem.menuCommands;
		    let list = [];

			if (flags[0]){
				list.push('BOX');
			}
			if (flags[1]){
				list.push('SKILL');
			}
			if (flags[2]){
				list.push('EQUIP');
			}
			if (flags[3]){
				list.push('STATUS');
			}
			if (flags[5]){
				list.push('SAVE');
			}			
			list.push('GAKUEN');
			list.push('SOUND');
			list.push('EXIT');
			list.push('BACK');
			return list;

			
		}
		index (){
			return this._index;
		}
		updateSelect (){
	        var lastIndex = this.index();
	        if (Input.isRepeated('down') || Input.isTriggered('down')) {
	            this.buttonDown();
	        }
	        if (Input.isRepeated('up') || Input.isTriggered('up')) {
	            this.buttonUp();
	        }			

	        if (this.index() !== lastIndex) {
	            SoundManager.playCursor();
	        }	        
		}
		length (){
			return this._list.length;
		}
		buttonDown (){
			let len = this.length();
			if (this.index() + 1 >= len){
				this.select(0);
			}
			else {
				this.select(this.index() + 1);
			}

		}
		buttonUp (){
			let len = this.length();
			if (this.index() - 1 < 0){
				this.select(len -  1);
			}
			else {
				this.select(this.index() - 1);
			}
		}
	}

	Window_RabbitSurviva._last_select = 0;



	class Window_RabbitGameEnd extends Window_GameEnd{
		constructor (x, y ,w ,h){
			super(x, y ,w ,h);			
		}
		initialize (x, y ,w ,h){
			Window_GameEnd.prototype.initialize.call(this,x, y ,w ,h);
			this.backOpacity = 0;
			this.setSkinNoFrame();
		}			
		makeCommandList () {
		    this.addCommand(TextManager.toTitle, 'toTitle');
		};		
	}
	class Window_RabbitStatus extends Window_Status {
		constructor (){
			super();
		}
		initialize (){
			Window_Status.prototype.initialize.call(this);
			this.setSkinNoFrame();
			this.backOpacity = 0;
		}
	}
	class Scene_RabbitStatus extends Scene_Status {
		constructor (){
			super();
		}
		initialize (){
			Scene_Status.prototype.initialize.call(this);

		}			
		create (){
			Scene_MenuBase.prototype.create.call(this);
			this.createBackGround();
			this.createTypeSprite();	
			this.createBackButtonSprite();
			this.createStatuWindow();			
			this.createNextSprite();
		}

		createStatuWindow (){
		    this._statusWindow = new Window_CatMenuActorStatus();

		    this.addChild(this._statusWindow);
		    this.refreshActor();
		}
		start (){
			Scene_MenuBase.prototype.start.call(this);
			this.checkNextMember();
			this._statusWindow.refresh();
		}
		typeName (){
			return 'STATUS';
		}	
		update (){
			Scene_Status.prototype.update.call(this);
			if (Input.isTriggered('cancel')){
				SceneManager.pop();
			}
		}
   
	}	
	class Scene_RabbitEquip extends Scene_Equip {
		constructor (){
			super();
		}		
		initialize (){
			Scene_Equip.prototype.initialize.call(this);
		}		
		create (){
			Scene_MenuBase.prototype.create.call(this);
			this.createBackGround();
			this.createTypeSprite();	
			this.createBackButtonSprite();
			this.createActorEquipWindow();
			this.createParamWindow();
			this.createItemWindow()
			this.createNextSprite();			

		}
		start (){
			Scene_Equip.prototype.start.call(this);
			this.checkParamData();
			this.checkNextMember()
		}
		checkParamData (){
			this._paramWindow.setActor(this.actor());
			this._paramWindow.show()
			this._paramWindow.open();

		}
		createNextSprite  (){
			this._next_sp = new Sprite_ButtonMenu();
			let bitmap = ImageManager.loadRabbitsurvival('Menu_Next');
			this._next_sp.bitmap = bitmap;
			this._next_sp.x = Graphics._boxWidth - rabbitsurviva.contst.type_x - 200 ;
			this._next_sp.y = rabbitsurviva.contst.type_y ;
			this._next_sp.setColdFrame(0, 0, 200,60);
			this._next_sp.setHotFrame(0, 60, 200,60);
			this._next_sp.visible = false;
			this._next_sp.setClickHandler(this.turnToNextMember.bind(this));	

			this.addChild(this._next_sp);

		}

		// doing
		createItemWindow (){
			let y = rabbitsurviva.contst.statu_y + rabbitsurviva.contst.statu_height + 17;
			let x = rabbitsurviva.contst.statu_x;
			let w = 1223;
			let h = 266;
			this._itemWindow = new Window_RabbitEquipItem(x, y, w, h);
			this._itemWindow.setActor(this.actor());
			this._slotWindow.setItemWindow(this._itemWindow);
			this._itemWindow.setParamWindow(this._paramWindow);
			this._itemWindow.setHandler('ok', this.onEQItemOk.bind(this));
			this._itemWindow.setHandler('cancel', this.onEQItemCancel.bind(this));
			this.addChild(this._itemWindow);

		}
		onEQItemOk (){
		    SoundManager.playEquip();
		    this.actor().changeEquip(this._slotWindow.index() -1 , this._itemWindow.item());
		    this._slotWindow.activate();
		    this._slotWindow.refresh();
		    this._itemWindow.deselect();
		    this._itemWindow.refresh();

		}
		onEQItemCancel (){
			this._slotWindow.activate();
			this._itemWindow.deselect()
			this._itemWindow.deactivate();

		}

		createHelpWindow () {
		    this._helpWindow = new Window_Help();
		    this._helpWindow.windowskin = ImageManager.loadSystem('Window_Noframe');
		    this.addWindow(this._helpWindow);
		};		

		createActorEquipWindow (){
			this._slotWindow = new Window_CatEquipSlot(0, 0, 300, 100);
		    var actor = this.actor();
		    this._slotWindow.setActor(actor);
			this._slotWindow.activate();
    		this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));			
			this._slotWindow.setHandler('cancel' , this.onSlotCancel.bind(this));

			this.addChild(this._slotWindow);
		}
		onSlotOk () {
			this._itemWindow.tempActorData();
		    this._itemWindow.activate();
		    this._itemWindow.select(0);
		    this.refreshActor();
		    
		};		
		onSlotCancel (){
			SceneManager.pop();
		}
		createParamWindow (){
			this._paramWindow = new	Window_EquipParameter();
			this._paramWindow.x = this._slotWindow.x + this._slotWindow.width ;

			this.addChild(this._paramWindow);
		}
		slotName (index) {
		    var slots = this._actor.equipSlots();
		    return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
		};
		onActorChange () {
		    this.refreshActor();
		    // this._commandWindow.activate();
		};
		typeName (){
			return 'EQUIP';
		}		
		refreshActor () {
		    var actor = this.actor();

		    this._itemWindow.tempActorData(this._itemWindow.item());
		    this._slotWindow.setActor(actor);
		    this._itemWindow.setActor(actor);
		    	
		    
		};			
	}
	class Scene_RabbitGameEnd extends Scene_GameEnd{
		constructor (){
			super();
		}
		initialize (){
			Scene_GameEnd.prototype.initialize.call(this);
		}	

		createCommandWindow () {
		    this._commandWindow = new Window_RabbitGameEnd();
		    this._commandWindow.setHandler('toTitle',  this.commandToTitle.bind(this));
		    this.addWindow(this._commandWindow);
		};		
		create (){
			Scene_GameEnd.prototype.create.call(this);
			this.createBackGround();
			this.createTypeSprite();
			this.createBackButtonSprite();
		}
		update (){
			Scene_GameEnd.prototype.create.call(this);
			if (Input.isTriggered('cancel')){
				this.onTouchBack()	
			}	
		}
		createBackGround  (){
			this._backgroundFiled = new Sprite();

			this._black_sp = new Sprite(new Bitmap(Graphics._boxWidth, Graphics._boxHeight));
			this._black_sp.bitmap.fillAll('black');
			this._black_sp.opacity = rabbit_back_opacity;
			this._backgroundFiled.addChild(this._black_sp);


			this._back_back = new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_02'));
			this._backgroundFiled.addChild(this._back_back);

			// this._back_midden =  new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_02'));
			// this._backgroundFiled.addChild(this._back_midden);			

			this._back_up = new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_01'));
			this._backgroundFiled.addChild(this._back_up);

			this.addChildAt(this._backgroundFiled, 1);
		}		
		typeName (){
			return 'EXIT';
		}

	}
 	class Scene_RabbitSkill extends Scene_Skill{
		constructor (){
			super();
		}
		initialize (){
			Scene_Skill.prototype.initialize.call(this);
		}	

		create (){
		    Scene_ItemBase.prototype.create.call(this);
		    this.createBackGround();
		    this.createHelpWindow();
		    this.createStatusWindow();
		    this.createSkillListWindow();
		    
		    this.createNextSprite();
		    this.createTypeSprite();
		    this.createBackButtonSprite();
		    this.createActorWindow();
		    
		    this.refreshActor();

		}

		typeName (){
			return 'SKILL';
		}

		start (){		
			this.refreshActor();

			this._statusWindow.refresh();
			this._itemWindow.refresh();			
			Scene_Skill.prototype.start.call(this);
			this._statusWindow.activate()
	    	this._itemWindow.activate();
	    	this._itemWindow.selectLast();

	    	this.checkNextMember();

			
		}

		onActorChange () {
			this.refreshActor();
			this._helpWindow.clear();
			this._helpWindow.setItem(this.item())
		};
		nextActor () {
			
		    $gameParty.makeMenuActorNext();
		    this.updateActor();
		    this.onActorChange();
		};		
		update (){
			Scene_Skill.prototype.update.call(this);
			if (Input.isTriggered('cancel')){
				SceneManager.pop();
			}
		}
		onItemOk () {
			this.deactiveSkillUI();
		    this.actor().setLastMenuSkill(this.item());
		    this.determineItem();			
		};
		onItemCancel () {
		    this._itemWindow.deselect();
		    SceneManager.pop();
		};			
		/* 使用技能選角色 */
		onActorOk () {
		    if (this.canUse()) {
		        this.useItem();
		    } else {
		        SoundManager.playBuzzer();
		    }
		};

		onActorCancel () {
		    this.hideSubWindow(this._actorWindow);
		    this.activeSkillUI();
		};
		deactiveSkillUI (){

			this._itemWindow.hide();
			this._statusWindow.hide();
			this._actorWindow.show();
			this._back_back.visible = false;			
			this._next_sp.visible = false;
		}
		activeSkillUI() {
			this._itemWindow.show();
			this._statusWindow.show();
			this._back_back.visible = true;			
			this._next_sp.visible = true;
		}
		determineItem () {
		    var action = new Game_Action(this.user());
		    var item = this.item();
		    action.setItemObject(item);
		    if (action.isForFriend()) {
		        this.showSubWindow(this._actorWindow);
		        this._actorWindow.selectForItem(this.item());
		    } else {
		        this.useItem();
		        this.activateItemWindow();
		    }
		};

		/* 選擇技能狀態 */
		createActorWindow () {
		    this._actorWindow = new Window_CatMenuActor();
		    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
		    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));

		    this._actorWindow.hide();
		    this.addWindow(this._actorWindow);
		};		
		itemTargetActors () {

		    var action = new Game_Action(this.user());
		    action.setItemObject(this.item());
		    if (!action.isForFriend()) {
		        return [];
		    } else if (action.isForAll()) {
		        return $gameParty.members();
		    } else {
		        return [$gameParty.members()[this._actorWindow.index()]];
		    }
		};			
		useItem () {
		    this.playSeForItem();
		    this.user().useItem(this.item());
		    this.applyItem();
		    this.checkCommonEvent();
		    this.checkGameover();
		    this._actorWindow.refresh();
		    this._statusWindow.refresh();

		};	
		showSubWindow (window) {
		    window.show();
		    window.activate();
		};			
		/* 使用技能選角色 */


		createHelpWindow () {
		    this._helpWindow = new Window_Help();
		    this._helpWindow.windowskin = ImageManager.loadSystem('Window_Noframe');
		    this.addWindow(this._helpWindow);
		};		
		createSkillListWindow (){
			let y = rabbitsurviva.contst.statu_y + rabbitsurviva.contst.statu_height + 17;
			this._itemWindow = new Window_RabbitSkillList(rabbitsurviva.contst.statu_x, y, 1200, 266)
			this._itemWindow.setHelpWindow(this._helpWindow);
			this._helpWindow.height += 10; 
			this._helpWindow.y = Graphics._boxHeight - this._helpWindow.height;
		    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));			
			this.addChild(this._itemWindow);
		}
		createStatusWindow () {
		    var wx = rabbitsurviva.contst.statu_x;
		    var wy = rabbitsurviva.contst.statu_y;
		    var ww = rabbitsurviva.contst.statu_width;
		    var wh = rabbitsurviva.contst.statu_height;
		    this._statusWindow = new Window_CatMenuActorSkill(wx, wy, ww, wh);
			this._statusWindow.setActor($gameParty.members()[0]);
		    this.addWindow(this._statusWindow);
		};		 
		//doing
		refreshActor () {
		    var actor = this.actor();		    

		    this._statusWindow.setActor(actor);
		    this._itemWindow.setActor(actor);
		    
		    this._itemWindow.refresh();
		    this._statusWindow.refresh();
		};		
	}
	class Window_RabbitMenuActor extends Window_MenuActor{
		constructor (x , y, w, h){
			super(x , y, w, h);
		}
		initialize (x , y, w, h){
			Window_MenuActor.prototype.initialize.call(this, x , y, w, h);			
			this.x = 26;
			this.y = 310;
			this.width = 1230;
			this.height = 282;

			this.setSkinNoFrame()
		}
		refresh (){
			Window_MenuActor.prototype.refresh.call(this);
		}			
	}



	/* 技能視窗 - list*/
	class Window_RabbitSkillList extends Window_SkillList{
		constructor (x , y, w, h){
			super(x , y, w, h);
		}
		initialize (x , y, w, h){
			Window_SkillList.prototype.initialize.call(this, x , y, w, h);			
			this.setSkinNoFrame()
			this.opacity = 0;
		}		
		drawItem (index) {
		    var skill = this._data[index];
		    if (skill) {
		        var costWidth = this.costWidth();
		        var rect = this.itemRect(index);
		        rect.width -= this.textPadding();
		        this.changePaintOpacity(this.isEnabled(skill));
		        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
		        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
		        this.changePaintOpacity(1);
		    }
		}


		makeItemList () {
		    if (this._actor) {

		        this._data = this._actor.skills().filter(function(item) {
		            return item; /* 沒有分種類, 所以直接回傳 this.inclides(item); */
		        }, this);		       
		    } else {
		        this._data = [];
		    }
		};		
	}
	class Window_RabbitEquipItem extends Window_EquipItem {
		constructor (x, y, w, h){
			super(x, y, w, h);
		}
		initialize (x, y, w , h){
			Window_EquipItem.prototype.initialize.call(this, x, y , w ,h);
			this.opacity = 0;
			this.open();
		}

		cursorDown (wrap) {
			Window_EquipItem.prototype.cursorDown.call(this, wrap);
			this.tempActorData()  
		};

		cursorUp (wrap) {
			Window_EquipItem.prototype.cursorUp.call(this, wrap);
			this.tempActorData()   						
		};

		cursorRight (wrap) {
			Window_EquipItem.prototype.cursorRight.call(this, wrap);
			this.tempActorData()   						

		};

		tempActorData (item){
			item = item || this.item();
			var actor = JsonEx.makeDeepCopy(this._actor);
			actor.forceChangeEquip(this._slotId - 1, this.item());

			this._paramWindow.setActor(this._actor);
			this._paramWindow.setTempActor(actor, item);			
			this._paramWindow.refresh()
		}

		cursorLeft (wrap) {
			Window_EquipItem.prototype.cursorLeft.call(this, wrap);
			this.tempActorData()  
		};

		realSlotId (){
			return this._slotId - 1;
		}
		setSlotId (slotId) {

		    if (this._slotId !== slotId) {
		        this._slotId = slotId;
		        this.refresh();
		        this.resetScroll();
		    }
		};

		setParamWindow (windows){
			this._paramWindow = windows;
		}
		paramWindow (){
			return this._paramWindow;
		}
		updateParam ( item , actor) {
			let windows = this.paramWindow();
			if (windows){
				windows.setTempActor(actor, item);
			}
			

		};
		select (index){
			Window_EquipItem.prototype.select.call(this, index);
			this.updateParam(this.item() , this._actor);
		}

		drawItem (index) {
		    var item = this._data[index];

		    if (item) {
		    	this.updateHelp();
		        var numberWidth = this.numberWidth();
		        var rect = this.itemRect(index);
		        rect.width -= this.textPadding();
		        this.changePaintOpacity(this.isEnabled(item));
		        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
		        this.drawItemNumber(item, rect.x, rect.y, rect.width);
		        this.changePaintOpacity(1);
		    }
		};




		makeItemList () {
		    this._data = $gameParty.allItems().filter(function(item) {
		        return this.includes(item);
		    }, this);

		    if (this.includes(null)) {
		        this._data.push(null);
		    }
		};

		includes (item) {

		    if (item === null) {
		        return true;

		    }
		    if (this.realSlotId() < 0 || item.etypeId !== this._actor.equipSlots()[this.realSlotId() - 1]) {

		        return false;
		    }
		    return this._actor.canEquip(item);
		};
		realSlotId (){
			return this._slotId;
		}

	}

	class Scene_RabbitSurviva extends Scene_MenuBase {
		constructor (){
			super();
		}
		initialize (){
			Scene_MenuBase.prototype.initialize.call(this);
		}
		create () {
	    	Scene_MenuBase.prototype.create.call(this);

		    this.createBalckBack();
		    this.createSurvivaSprite()		    
		    this.createMenuWinodw();
		    this.createGoldWindow();
		}
		createGoldWindow (){
			this._goldWindow = new Window_Gold(0, 0);
			this._goldWindow.x = Graphics._boxWidth - this._goldWindow.width;
			this._goldWindow.y = Graphics._boxHeight - this._goldWindow.height;
			this._goldWindow.hide();

			this.addChild(this._goldWindow);
		}
		createBalckBack (){
			this._black_sp = new Sprite(new Bitmap(Graphics._boxWidth, Graphics._boxHeight));
			this._black_sp.bitmap.fillAll('black');
			this._black_sp.opacity = rabbit_back_opacity;
			this.addChild(this._black_sp);
		}

		createMenuWinodw (){
			this._menuWindow = new Window_RabbitSurviva(0, 0, Graphics._boxWidth, Graphics._boxHeight);
			this.addChild(this._menuWindow);
		}
		start (){
			Scene_MenuBase.prototype.start.call(this);
			if ($gameSwitches.value(chimaki_need_gold)){
				this._goldWindow.show();
			}

		}
		update () {			
			Scene_MenuBase.prototype.update.call(this);

			if (this.isWaitImg()){
				this.updateImageWait();
				return;
			}
			else {
				this.updateCharaImg();
				this.waitImg($chimaki_contral.img_frame());
			}

		};	
		waitImg  ( wait ){
			return this._img_wait_count = wait;
		}	
		isWaitImg  (){
			return this._img_wait_count > 0;
		}	
		updateImageWait  (){
			if (this._img_wait_count > 0){
				this._img_wait_count--;	
			}
			
		}					

		updateCharaImg  (){


			let images = $chimaki_contral.img_group();
			images.forEach(function (sp){
				sp.visible = false;
			})

			if (images[this._img_index]){
				images[this._img_index].visible = true;
				
			}

			if (this._img_index == 0 ){
				this._img_plus = true;
			}

			else if (this._img_index == this._img_max - 1){
				this._img_plus = false;
			}

			if (this._img_plus){
				this._img_index++;	
			}
			else {
				this._img_index--;
			};
		}		
		createSurvivaSprite (){
			$chimaki_contral.initMamber();
			$chimaki_contral.setVar( $gameVariables.value(chimaki_menu_img_var) );

			this._spriteHash = {};
			this._img_filed = new Sprite();
			this._spriteHash = $chimaki_contral.createSPhash()

		    for (let i in this._spriteHash){
		    	let data = this._spriteHash[i];

		    	let end = 0;
		    	let count = 1;
		    	let img_array = [];
		    	while (1){		    		
		    		let img_name = data.sp_name + '_' + count.padZero(2);
		    		let check = $chimaki_contral.checkImage(img_name);
		    		if (!check) break;

		    		let sp = new Sprite(ImageManager.loadRabbitsurvivalCharacter(img_name));
		    		sp.visible = false;
		 			this._img_filed.addChild(sp);
		 			$chimaki_contral.psuhImageName(i , sp, data.frame);
		 			
		 			count++;
		    	}
		    }	 


			this._img_wait_count = 0;
			this._img_index = 0;
			this._img_max = $chimaki_contral.img_group().length;
			this._img_plus = 1;
		    this.addChild(this._img_filed);			

		}
	}



	/*
	* 準備call 新的Menu
	*
	*/
	/* hide status */
	rabbitsurviva.alias._menu_start = Scene_Menu.prototype.start;
	Scene_Menu.prototype.start = function() {
		rabbitsurviva.alias._menu_start.call(this);
	    if (!$gameSwitches.value(chimaki_menu_switch)){
	    	this._statusWindow.hide();	
	    }	    
	};

	/* 要改用 layout嗎 ?*/
	rabbitsurviva.alias._menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		rabbitsurviva.alias._menu_create.call(this);
		
	};
	rabbitsurviva.alias._map_callMenu = Scene_Map.prototype.callMenu;
	Scene_Map.prototype.callMenu = function (){ 			
		if (!$gameSwitches.value(chimaki_menu_switch)){
			SoundManager.playOk();
			this.callRabbitSurviva();	
			return;
		}
		rabbitsurviva.alias._map_callMenu.call(this);

		
	}
	Scene_Map.prototype.callRabbitSurviva = function (){
		log('into callRabbitSurviva')
		SceneManager.push(Scene_RabbitSurviva);
	}




	
}());

	class Sprite_ButtonMenu extends Sprite_Button {
		constructor(){
			super();	
		}
		initialize (){
			Sprite_Button.prototype.initialize.call(this);
			this._be_select = false;
		}
		updateFrame () {
		    var frame;
		    if (this._touching || this._be_select) {
		        frame = this._hotFrame;
		    } else {
		        frame = this._coldFrame;
		    }
		    if (frame) {
		        this.setFrame(frame.x, frame.y, frame.width, frame.height);
		    }
		};
		setBeSelect ( touched ){
			this._be_select = touched;
		}	
		isBeSelect (){
			return this._be_select;
		}
	}

Window_Base.prototype.setSkinNoFrame = function (){
	this.windowskin = ImageManager.loadSystem('Window_Noframe');
}
Scene_Base.prototype.turnToNextMember = function (){
	this.nextActor();
}
Scene_Base.prototype.createNextSprite = function (){
	this._next_sp = new Sprite_ButtonMenu();
	let bitmap = ImageManager.loadRabbitsurvival('Menu_Next');
	this._next_sp.bitmap = bitmap;
	this._next_sp.x = Graphics._boxWidth - rabbitsurviva.contst.type_x - 200 ;
	this._next_sp.y = rabbitsurviva.contst.type_y ;
	this._next_sp.setColdFrame(0, 0, 200,60);
	this._next_sp.setHotFrame(0, 60, 200,60);
	this._next_sp.visible = false;
	this._next_sp.setClickHandler(this.turnToNextMember.bind(this));	
	this.addChild(this._next_sp);

}

Scene_Base.prototype.createBackButtonSprite = function (){
	this._back_sp_button = new Sprite_ButtonMenu();
	let bitmap = ImageManager.loadRabbitsurvival('Icon_BACK');

	this._back_sp_button.x = Graphics._boxWidth - rabbitsurviva.contst.type_x - 200 ;
	this._back_sp_button.y = Graphics._boxHeight - rabbitsurviva.contst.type_y - 60;
	this._back_sp_button.bitmap = bitmap;
	this._back_sp_button.setColdFrame(0, 0, 286,60);
	this._back_sp_button.setHotFrame(0, 60, 286,60);	

	this._back_sp_button.setClickHandler(this.onTouchBack.bind(this))

	this.addChild(this._back_sp_button);
}
Scene_Base.prototype.onTouchBack = function (){
	SoundManager.playCancel();
	SceneManager.pop();
}
Scene_Base.prototype.createTypeSprite = function (){
	this._type_sprite = new Sprite_ButtonMenu();
	let bitmap = ImageManager.loadRabbitsurvival('Icon_' + this.typeName());
	this._type_sprite.x = rabbitsurviva.contst.type_x;
	this._type_sprite.y = rabbitsurviva.contst.type_y;
	this._type_sprite.bitmap = bitmap;
	this._type_sprite.setColdFrame(0, 0, 286,60);
	this._type_sprite.setHotFrame(0, 60, 286,60);
	this.addChild(this._type_sprite);
}
Scene_Base.prototype.checkNextMember = function (){

	if ($gameParty._actors.length >= 2){
		this._next_sp.visible = true;
	}	
	else {
		this._next_sp.visible = false;
	}
}


Scene_Base.prototype.createBackGround = function (){
	this._backgroundFiled = new Sprite();

	this._black_sp = new Sprite(new Bitmap(Graphics._boxWidth, Graphics._boxHeight));
	this._black_sp.bitmap.fillAll('black');
	this._black_sp.opacity = rabbit_back_opacity;
	this._backgroundFiled.addChild(this._black_sp);


	this._back_back = new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_03'));
	this._backgroundFiled.addChild(this._back_back);

	// this._back_midden =  new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_02'));
	// this._backgroundFiled.addChild(this._back_midden);			

	this._back_up = new Sprite(ImageManager.loadRabbitsurvival('Menu_Screen_01'));
	this._backgroundFiled.addChild(this._back_up);

	this.addChildAt(this._backgroundFiled, 1);
}
Scene_Base.prototype.typeName = function (){ return 'SKILL'}



function Game_ChimakiContral() {
    this.initialize.apply(this, arguments);
}

Game_ChimakiContral.prototype.initialize = function() {
	this.initMamber();
	
};

Game_ChimakiContral.prototype.setVar = function( val) {
	this._img_var = val;
};

Game_ChimakiContral.prototype.initMamber = function (){
	this._updateImg = {};	
	this._img_var = 0;
	this._countData = {};
}

Game_ChimakiContral.prototype.createSPhash = function (){
	this._spriteHash = {};
	for (let i in chimaki_menu_img_data){

		let str = chimaki_menu_img_data[i].replace('[','');
		str = str.replace(']','');
		let array = str.split(',');

		let number = array[0];
		let sp_name = array[1]
		let frame = array[2] || 5;
		this._spriteHash[number] = { number : number , sp_name : sp_name , frame : frame};
	}	
	return this._spriteHash;
}


Game_ChimakiContral.prototype.psuhImageName = function( var_index , sp, frame) {

	this._updateImg[var_index] = this._updateImg[var_index] || [];
	this._updateImg[var_index].push(sp);
	this._countData[var_index] = this._countData[var_index] || [];
	this._countData[var_index].push(frame);

};


Game_ChimakiContral.prototype.checkImage = function ( name ){
		var fs = require('fs');
		var path = require('path');
	    var base = path.dirname(process.mainModule.filename);		
	    var url = base + '/img/Rabbitsurviva/Character/' + name +'.png';
		try{
			fs.statSync(url);
		}catch(e){
			return false;
		}

		return true;
}

Game_ChimakiContral.prototype.img_group = function() {
	// this._img_var = this._img_var || 1;
	if (this._updateImg[this._img_var]){
		return this._updateImg[this._img_var];	
	}	
	return [];
}

Game_ChimakiContral.prototype.img_frame = function() {
	if (this._countData[this._img_var]){
		return Number(this._countData[this._img_var][0]);	
	}	
}

Game_ChimakiContral.prototype.openSurvivaMenu = function() {
	return $gameSwitches.value(chimaki_menu_switch);    
};
var $chimaki_contral = new Game_ChimakiContral();