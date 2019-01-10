var itemCodex = itemCodex || {};

// STUFF YOU NEED TO MODIFY
itemCodex.highlightColor = "\\c[17]"; // highlighted word color
itemCodex.menuName = "词典"; // the name in your menus
itemCodex.dictionary = {
	"醒了" : [
       "xǐng le", // short description / tooltip
       "xǐng le == To wake up", // long description
       0 // game switch ON to show, 0 if none
   ],
   "名字" : [
       "míng zì  ",
       "míng zì == name",
       0
   ],
   "不知道" : [
       "bù zhī dào ",
       "bù zhī dào == to not know",
       0
   ],
   "战斗" : [
       "zhàn dǒu",
       "zhàn dǒu == battle",
       0
	]
};


itemCodex.firstWord = 0; itemCodex.isOpen = false;


//-----------------------------------------------------------------------------
// Bitmap
//
Bitmap.prototype._drawTextOdd = Bitmap.prototype._drawTextBody;
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
	if(text === "\x99"){
		arguments[0] = "";
		$gameMessage._addingTitles = true;
	}
	if(text === "\x98"){
		arguments[0] = "";
		$gameMessage._addingTitles = false;
		$gameMessage._currentToolTip++;
	}
	if($gameMessage._addingTitles){
		var y = SceneManager._scene._windowLayer.children[0].y;
		var padding = SceneManager._scene._windowLayer.children[0]._padding;
		var tt = document.createElement("div");
		tt.className = "tooltip";
		tt.innerHTML = "&nbsp;";
		tt.style.display = "inline";
        tt.style.position = "absolute";
		tt.style.left = Math.round(tx + padding) + "px";
		tt.style.top = Math.round(ty + y - padding / 2) + "px";
		tt.style.width = Math.round(this.measureTextWidth(text)) + "px";
		var height = parseInt((this.fontSize+"").replace(/\D+/g,"")) + 5;
		tt.style.height = height + "px";
		tt.style.zIndex = "999";
		// tt.style.backgroundColor = "rgba(255,255,0,0.5)"; // to debug title position
		tt.style.cursor = "pointer";
		tt.setAttribute("title", $gameMessage._toolTips[$gameMessage._currentToolTip]);
		tt.setAttribute("value", $gameMessage._toolTipIds[$gameMessage._currentToolTip]);
		
        /*tt.addEventListener("mousedown", function(e){
			if(itemCodex.isOpen)
		          return;
			itemCodex.firstWord = parseInt(tt.getAttribute("value"));
			itemCodex.isOpen = true;
			var leftover = document.getElementsByClassName("tooltip");
			while(leftover.length > 0)
				leftover[0].parentNode.removeChild(leftover[0]);
			SceneManager.push(Scene_ItemCodex);
			e.preventDefault();
			return false;
		});*/
		document.body.appendChild(tt);
	}
	this._drawTextOdd.apply(this, arguments);
};

//-----------------------------------------------------------------------------
// TouchInput
//
/*
TouchInput._onMouseDown = function(event) {
    if (event.button === 0) {
    	if(event.target.className === "tooltip" && !itemCodex.isOpen)
			return;
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
};
*/
//-----------------------------------------------------------------------------
// Game_Message
//
Game_Message.prototype.clearOdd = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
	this.clearOdd.call(this, arguments);
	this._toolTips = [];
	this._toolTipIds = [];
	this._currentToolTip = 0;
	this._addingTitles = false;
	var tt = document.getElementsByClassName("tooltip");
	while(tt.length > 0)
		tt[0].parentNode.removeChild(tt[0]);
};
Game_Message.prototype.add = function(text) {
	var tt = this._toolTips;
	var id = this._toolTipIds;
	var occurances = [];
	var unorderedWords = [];
	var origText = text;
	if(this._toolTipIds.length === 0){
		for(word in itemCodex.dictionary){
			var reg = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			var regx = new RegExp(reg,"gi");
			text = text.replace(regx, function(text){			
				var occur = origText.split(regx);
				var o = [];
				var a = [];
				for(var i = 0; i < occur.length; i += 2){
					var prevStr = occur[i-2] !== undefined ? 
						occur[i-2].length + occur[i-1].length : 0;
					o.push(occur[i].length + prevStr);
					a.push(word);
				}
				Array.prototype.push.apply(occurances, o);
				Array.prototype.push.apply(unorderedWords, a);
				return itemCodex.highlightColor + "\x99"+ text + "\x98"+"\\c[0]";
			});
		}
		var list = [];
		for (var i = 0; i < occurances.length; i++){ 
			list.push({'word': unorderedWords[i], 'pos': occurances[i]});
		}
		list.sort(function(a, b) {
			return a.pos > b.pos;
		});
		for(var i = 0; i < list.length; i++){
			var word = list[i].word;
			tt.push(itemCodex.dictionary[word][0]);
			id.push(Object.keys(itemCodex.dictionary).indexOf(word));
		}
	}
	this._texts.push(text);
};
//-----------------------------------------------------------------------------
// Scene_Item
//
/*
function Scene_ItemCodex() {
    this.initialize.apply(this, arguments);
}

Scene_ItemCodex.prototype = Object.create(Scene_Item.prototype);
Scene_ItemCodex.prototype.constructor = Scene_Item;

Scene_ItemCodex.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();
};
Scene_ItemCodex.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_CodexItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._itemWindow);
    this._itemWindow.activate();
    this._itemWindow.show();
    this._itemWindow.selectLast();
    this._itemWindow.refresh();
    
};
Scene_ItemCodex.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(5); // five lives high
    this.addWindow(this._helpWindow);
};
Scene_ItemCodex.prototype.popScene = function() {
	if(itemCodex.isOpen){
		itemCodex.isOpen = false;
		$gameMessage._currentToolTip = 0;
	}
    SceneManager.pop();
};
Scene_Menu.prototype.commandCodexItem = function() {
	itemCodex.isOpen = true;
    SceneManager.push(Scene_ItemCodex);
};
Scene_Title.prototype.commandCodexItem = function() {
	itemCodex.isOpen = true;
    SceneManager.push(Scene_ItemCodex);
};
Scene_Battle.prototype.commandCodexItem = function() {
	itemCodex.isOpen = true;
    SceneManager.push(Scene_ItemCodex);
};

//plugin <
Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    // plugin <
    this._commandWindow.setHandler('codex',     this.commandCodexItem.bind(this));
    // > plugin
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    // plugin <
    this._commandWindow.setHandler('codex',    this.commandCodexItem.bind(this));
    // > plugin
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};
Scene_Battle.prototype.createPartyCommandWindow = function() {
    this._partyCommandWindow = new Window_PartyCommand();
    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
    // plugin <
    this._partyCommandWindow.setHandler('codex',  this.commandCodexItem.bind(this));
    // > plugin
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
};
// > plugin

//-----------------------------------------------------------------------------
// Window_CodexItem

function Window_CodexItem() {
    this.initialize.apply(this, arguments);
}
Window_CodexItem.prototype = Object.create(Window_ItemList.prototype);
Window_CodexItem.prototype.constructor = Window_CodexItem;
Window_CodexItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};
Window_CodexItem.prototype.includes = function(item) {
    return true;
};
Window_CodexItem.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    this.makeItemList();
    Window_ItemList.prototype.show.call(this);
};
Window_CodexItem.prototype.hide = function() {
    this.hideHelpWindow();
    Window_ItemList.prototype.hide.call(this);
};
Window_CodexItem.prototype.makeItemList = function() {
	var data = [];
	for(word in itemCodex.dictionary){
		if(itemCodex.dictionary[word][2] === undefined    ||
		itemCodex.dictionary[word][2] === 0               ||
		itemCodex.dictionary[word][2] !== undefined       &&
		itemCodex.dictionary[word][2] !== 0               &&
		$gameSwitches.value(itemCodex.dictionary[word][2])){
			data.push(
				{
				  "id": Object.keys(itemCodex.dictionary).indexOf(word) + 1,
				  "consumable": false,
				  "description" : itemCodex.highlightColor +
				  				  word + ": " +
								  itemCodex.dictionary[word][0] +
								  "\n\\c[0]" + 
								  itemCodex.dictionary[word][1],
				  "name": word
				}
			);
		}
	}
    this._data = data;
};
Window_CodexItem.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        this.drawText(item.name, x, y, width);
    }
};
Window_CodexItem.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.drawItemName(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
Window_CodexItem.prototype.selectLast = function() {
    this.select(itemCodex.firstWord || 0);
};
//plugin <
Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    // plugin <
    TextManager.codex = itemCodex.menuName;
    if (this.needsCommand('codex')) {
        this.addCommand(TextManager.codex, 'codex', enabled);
    }
    // > plugin
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
    
};
Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    // plugin <
    TextManager.codex = itemCodex.menuName;
    this.addCommand(TextManager.codex, 'codex', true);
    // > plugin
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options,   'options');
};
Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    // plugin <
    TextManager.codex = itemCodex.menuName;
    this.addCommand(TextManager.codex, 'codex', true);
    // > plugin
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
};
// > plugin
*/
