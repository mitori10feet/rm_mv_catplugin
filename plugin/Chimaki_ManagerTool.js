//=============================================================================
// Chimaki_ManagerTool.js
// Version: 0.0.1
//=============================================================================
/*:
* @plugindesc 系統綜合設定
* @author Chimaki 
* 
* @param CVSwitche
* @desc CV控制選項, 默認開啟, 開關on 則關閉功能
* @default 95
* 
* @param opctionString
* @desc opction 名稱調整
* @default Always Dash;Command Remember;BGM Volume;BGS Volume;ME Volume;SE Volume;CV Volume;Language;Quit Game;Title;Back to title
* 
* @param setlan
* @desc 繁體 / 簡體 / 日文 / 英文 0 = 關閉 , 1 = 開啟(分號隔開, 繁體必須是1)
* @default 1;0;0;0
*
* @param languageColor
* @desc 依照 繁體/ 簡體 / 日本 / 英文，設定 1則顯示紅色
* @default 0;0;0;0;
*
* @param logSwitch
* @desc 決定是否可以開啟log的開關
* @default 0
* ============================================================================
* 作者網站 Marker 製造機:www.chimakier.com
* 01 / 10 重複播放時暫停cv
* 12 / 22 新增octions 選項名稱
* 12 / 05 加入預設CV控制選項
* 12 / 01 :新增playCv, 在腳本輸入 playCv('檔案名稱',音量 ,pitch , 左右)即可, 也可以只輸入檔案名稱 跟音量 
* 3 / - : 新增多語系控制功能
* 1.全頻對話的Full_screen要淡入淡出，約10~20偵。 2.遊戲開始的時候，要默認跑步。
*/

//=============================================================================
// Pro to Debug
//=============================================================================
var Imported = Imported || {};
Imported.Chimaki_Tool = {};
var chimaki_parameters = PluginManager.parameters('Chimaki_ManagerTool');

var setlan = chimaki_parameters["setlan"].split(";") ;
var logSwitch = Math.floor(chimaki_parameters["logSwitch"]);
var whatthefuck = "Title";

AudioManager._cvVolume       = 100;
ConfigManager.language   = 0;
ConfigManager.title = "title";



function log (str){	
	// if (logSwitch){
		// console.log(str);	
	// }
	
}

StorageManager.writelog = function (str){
	
	var fs = require('fs');
	var path = require('path');
    var base = path.dirname(process.mainModule.filename);

    fs.appendFile(base + '/Rabbit.txt' , str + "\n", function(err){
     	if (err) {
          	console.error(err);
    	 }
	});
}
SceneManager.catchException = function(e) {
	StorageManager.writelog('Error , ' + e.name + ',file name ,' + e.message + ', line ,' + e.stack);
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};

SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    StorageManager.writelog('Error , ' + e.message + ',file name ,' + e.filename + ', line ,' + e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {
    	
    }
};




Object.defineProperty(ConfigManager, 'seVolume', {
    get: function() {
        return AudioManager.cvVolume;
    },
    set: function(value) {
        AudioManager.cvVolume = value;
    },
    configurable: true
});
var lang_arr = new Array();
for (var i = 0 ; i < setlan.length; i++){
	if (setlan[i] == 0) continue;
	var str;
	if (i == 0) str = '繁體中文';
	if (i == 1) str = '简体中文';
	if (i == 2) str = '日本語';
	if (i == 3) str = 'English';
	lang_arr.push(str);

}



languageConfig = lang_arr;

ConfigManager.makeData = function() {
    var config = {};

    config.language = this.language ;
    config.alwaysDash = this.alwaysDash; 
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    config.cvVolume = this.cvVolume;
    config.makeData = this._madeData;
    config.title = "Title";

    return config;
};

ConfigManager.applyData = function(config) {
	this._madeData = config.makeData;
	this.language = this.readVolume(config, 'language');
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    if (this._madeData == false){
    	this.alwaysDash = true;

    }

    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');

    this.cvVolume = this.readVolume(config, 'cvVolume');
    this.bitString = "Title";

    TextContentManager.setContentData(languageConfig[this.language]);

};
ConfigManager.readFlag = function(config, name) {
    return !!config[name];
};


ConfigManager.readVolume = function(config, name) {
    var value = config[name];
    if (name != 'language'){
	    if (value !== undefined) {
	        return Number(value).clamp(0, 100);
	    } else {
	        return 100;
	    }
	}
	else {
	    if (value !== undefined) {
	        return Number(value).clamp(0, 3);
	    } else {
	        return 0;
	    }		
	}
};
var cvswitch = Math.floor(chimaki_parameters['CVSwitche']|| 95);
var opctionStrings  = chimaki_parameters["opctionString"].split(";") ;
var languageColor = chimaki_parameters["languageColor"].split(";") ;
var dashString = opctionStrings[0];
var rememberString = opctionStrings[1];
var bgmString = opctionStrings[2];
var bgsString = opctionStrings[3];
var meString = opctionStrings[4];
var seString = opctionStrings[5];
var CVString = 	opctionStrings[6];
var languageString = 	opctionStrings[7];
var BTString = 	opctionStrings[8];		
var titleString = 	opctionStrings[9];			
var BtTString = 	opctionStrings[10];	
(function(){
	
	



//=============================================================================
// Debug工具
//=============================================================================	
//=============================================================================
// 取整調整
//=============================================================================	
	//override
	Game_Map.prototype.screenTileX = function() {		
	    return Math.round(Graphics.width / this.tileWidth());
	};

	Game_Map.prototype.screenTileY = function() {
	    return Math.round(Graphics.height / this.tileHeight());
	};
//=============================================================================
// 管理自制選單用
//=============================================================================		
	ImageManager.loadCattext = function(filename, hue) {
		var path = 'img/Cattext/';
 	   	return this.loadBitmap(path, filename, hue, true);
	};

	ImageManager.loadRabbitsurvival = function(filename, hue) {
		var path = 'img/Rabbitsurviva/';
 	   	return this.loadBitmap(path, filename, hue, true);
	};
	ImageManager.loadRabbitsurvivalCharacter = function(filename, hue) {
		var path = 'img/Rabbitsurviva/Character/';
 	   	return this.loadBitmap(path, filename, hue, true);
	};	

	ImageManager.loadHamsterspace = function(filename, hue) {
		var path = 'img/Hamsterspace/';
 	   	return this.loadBitmap(path, filename, hue, true);
	};
	ImageManager.loadCMenu = function(filename) {
    	return this.loadBitmap('img/cmenu/', filename, 0, true);
	};

	AudioManager.playSe = function(se) {
	    if (se.name) {
	        this._seBuffers = this._seBuffers.filter(function(audio) {
	            return audio.isPlaying();
	        });
	        var buffer = this.createBuffer('se', se.name);
	        this.updateSeParameters(buffer, se);
	        buffer.play(false);
	        this._seBuffers.push(buffer);
	    }
	};
	AudioManager.updateSeParameters = function(buffer, se) {
	    this._seVolume = ConfigManager.seVolume;
	    this.updateBufferParameters(buffer, this._seVolume, se);
	};



	AudioManager._cvBuffers = [];
	AudioManager._currentCv = null;
	AudioManager.playCv = function(cv) {
		// 重複播放判斷
		if (cv.name != this._currentCv){
			this.stopCv();	
		}
		// 實際play
	    if (cv.name) {
	    	this._currentCv = cv.name;
	        this._cvBuffers = this._cvBuffers.filter(function(audio) {
	            return audio.isPlaying();
	        });

	        var buffer = this.createBuffer('cv', cv.name);	        
	        this.updateCvParameters(buffer, cv );
	        buffer.play(false);
	        this._cvBuffers.push(buffer);	       
	    }			

	};

	AudioManager.stopCv = function() {
	    this._cvBuffers.forEach(function(buffer) {
	        buffer.stop();
	    });
	    this._cvBuffers = [];
	};	

	AudioManager.updateCvParameters = function(buffer, cv) {
	    this.updateBufferParameters(buffer, cv.volume , cv);
	};
//=============================================================================
// 音效存擋相關選項
//=============================================================================	
	// Window_Options.
	Window_Options.prototype.addGeneralOptions = function() {
		this.addCommand(languageString , 'language');		
	    // this.addCommand(dashString, 'alwaysDash');
	    // this.addCommand(rememberString, 'commandRemember');
	};
	Window_Options.prototype.addVolumeOptions = function() {
	    this.addCommand( bgmString, 'bgmVolume');
	    this.addCommand( bgsString, 'bgsVolume');
	    this.addCommand( meString, 'meVolume');
	    this.addCommand( seString, 'seVolume');
	    if (!$gameSwitches.value(cvswitch)){
	    	this.addCommand(CVString, 'cvVolume');	
	    }
	    this.addCommand(BTString, 'title');		    
	    
	};	

	Window_Options.prototype.statusText = function(index) {
	    var symbol = this.commandSymbol(index);	    
	    var value = this.getConfigValue(symbol);
	    if (this.isBackToTitle(symbol)){
	    	return titleString;
	    }
	    if (this.isVolumeSymbol(symbol)) {
	        return this.volumeStatusText(value);	    
	    } else if (this.isLanguageSymbol(symbol)){
	    	if (languageColor[value] == 1){
	    		this.changeTextColor('red');
	    	}
	    	return this.langSymbol(value);
	    } else {
	        return this.booleanStatusText(value);
	    }
	};
	Window_Options.prototype.isBackToTitle = function(symbol) {
	    return symbol.contains('title');
	};
	Window_Options.prototype.isLanguageSymbol = function(symbol) {
	    return symbol.contains('lang');
	};
	Window_Options.prototype.langSymbol = function (value){
		TextContentManager.setContentData(languageConfig[value]);
		return languageConfig[value];
	}	
	Window_Options.prototype.langOffset = function (){
		return 1;
	}
	Window_Options.prototype.processOk = function() {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    // 回到開頭
	    if (this.isBackToTitle(symbol)){
	    	SoundManager.playOk();
	    	return SceneManager.push(Scene_CatEnd);
	    }	    
	    if (this.isVolumeSymbol(symbol)) {
	        value += this.volumeOffset();
	        if (value > 100) {
	            value = 0;
	        }
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    }else if (this.isLanguageSymbol(symbol)){
	    	value += this.langOffset();
	    	if (value > languageConfig.length - 1){
	    		value = 0;

	    	}
	    	this.changeValue(symbol, value);

	    } else {
	        this.changeValue(symbol, !value);
	    }
	};

	Window_Options.prototype.changeValue = function(symbol, value) {
	    var lastValue = this.getConfigValue(symbol);

	    if (lastValue != value) {
	        this.setConfigValue(symbol, value);
	        this.redrawItem(this.findSymbol(symbol));
	        SoundManager.playCursor();
	    }
	};	


	Window_Options.prototype.cursorLeft = function(wrap) {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isBackToTitle(symbol)){
	    	return titleString;
	    }	    
	    if (this.isVolumeSymbol(symbol)) {
	        value -= this.volumeOffset();
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    } else if (this.isLanguageSymbol(symbol)){
	    	value--;
	    	value = value.clamp(0, lang_arr.length);
	    	this.changeValue(symbol, value);
	    } else {
	        this.changeValue(symbol, false);
	    }
	};	
	Window_Options.prototype.cursorRight = function(wrap) {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isBackToTitle(symbol)){
	    	return titleString;
	    }	    
	    if (this.isVolumeSymbol(symbol)) {
	        value += this.volumeOffset();
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    } else if (this.isLanguageSymbol(symbol)){
	    	value++;
	    	value = value.clamp(0, lang_arr.length);
	    	this.changeValue(symbol, value);	    		        
	    } else {
	        this.changeValue(symbol, true);
	    }
	};

	Window_Options.prototype.getConfigValue = function(symbol) {
		if (symbol == "alwaysDash" && !ConfigManager._madeData){			
			ConfigManager.alwaysDash = true;
			ConfigManager._madeData = true;
		}

	    return ConfigManager[symbol];
	};	
	Window_Options.prototype.setConfigValue = function(symbol, volume) {
		if (symbol == 'alwaysDash'){
			log('setConfigValue')
			log(volume);
		}
		
	    ConfigManager[symbol] = volume;
	};
	ConfigManager.readFlag = function(config, name) {
	    return !!config[name];
	};



}());

function playCv(name , vol, pitch , pan ){
	var cv = {};
	cv.volume = ConfigManager.cvVolume;

	cv.name = name;
	if (vol){
		cv.volume = vol;
	}
	cv.pan = pan ;
	cv.pitch = pitch || 100 ;
	AudioManager.playCv(cv);	
}

//=============================================================================
// 語系 / 文字資料管理
//=============================================================================	
function TextContentManager () {
	throw new Error('This is a static class');
}
TextContentManager._allData = {'zh' : {} , 'ja' : {}, 'en' : {} ,'cn' :{}};
TextContentManager._nowlanguage = 'zh'; // 預設中文
// game data locale 
TextContentManager.setContentData = function ( text ){
	switch (text){
		case "繁體中文":
			this._nowlanguage = 'zh';
			break;
		case "日本語":
			this._nowlanguage = 'ja';
			break;
		case "简体中文":
			this._nowlanguage = 'cn';
			break;
		case "English":
			this._nowlanguage = 'en';
			break;
	}

	// this._allData
}
TextContentManager.getContentDataByRang = function ( st, ed ){
	var text = '';
	var data = this._allData[this._nowlanguage];
	for (var i in data){
		if (i >= st && i <= ed){			
			text += data[i] + '\n';
		}
	}
	
	return text;
}
TextContentManager.getContentDataById = function ( id ){
	log('get data by id');
	return this._allData[this._nowlanguage][id];
}
TextContentManager.setlanguage = function (language){
	this._nowlanguage = language + '';
}
TextContentManager.setAllData = function (data){
	for (var i =0;i < data.length ; i ++){
		this._allData['zh'][data[i]['編號']] = data[i]['繁體中文'] ;
		this._allData['ja'][data[i]['編號']] = data[i]['日本語'] ;
		this._allData['en'][data[i]['編號']] = data[i]['English'] ;
	 	this._allData['cn'][data[i]['編號']] = data[i]['簡體中文'] ;
	}
}
function initDataContent  (){
	var  dataPath  = 'data/TextContent.csv';
	d3.csv(dataPath , function(data){
		TextContentManager.setAllData(data);

	});		
	
}




Scene_Boot.prototype.isGameFontLoaded = function() {
    if (Graphics.isFontLoaded('GameFont')) {
        return true;
    } else {
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 40000) {
            throw new Error('Failed to load GameFont');
        }
    }
};

Game_Player.prototype.isDashButtonPressed = function() {
	var shift = Input.isPressed('shift');
    try {
        json = StorageManager.load(-1);
    } catch (e) {
        console.error(e);
    }
    if (!json){
	    if (ConfigManager.alwaysDash) {
	        return shift;
	    } else {
	        return !shift;
	    }    	
    };
    
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

initDataContent();
