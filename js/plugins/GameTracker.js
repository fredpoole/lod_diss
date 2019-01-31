//-----------------------------------------------------------------------------
// GameTracker.js
//-----------------------------------------------------------------------------

/*:
 * @plugindesc Tracks player behaviour such as pathing information, menu access, NPC interactions, etc.
 * @author Craig Blackburn
 *
 * @param Enable Tracking
 * @default: true
 * @desc Enter "true" to enable tracking, or "false" to disable tracking.
 * 
 */   
"use strict";


var GameTracker = {

    enabled: false,

    pathing: {},


    saveToFile: function() {
        for (var mapId in this.pathing) {
            console.log(mapId);
        }
    }


};

GameTracker.enabled = PluginManager.parameters("GameTracker")["Enable Tracking"].toLowerCase() == "true";


/**
 * Player Movement
 */
var _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
Game_Player.prototype.increaseSteps = function() {
    console.log("increaseSteps", this);
    _Game_Player_increaseSteps.call(this);

    // Make sure the character is moving on their own and tracking is turned on
    if (!this.isMoveRouteForcing() && GameTracker.enabled) {
        // do stuff
    }
};

/**
 * Menu Access
 */
var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    console.log("callMenu", this);
    _Scene_Map_callMenu.call(this);
};

var _Scene_Menu_commandItem = Scene_Menu.prototype.commandItem;
Scene_Menu.prototype.commandItem = function() {
    console.log("commandItem", this);
    _Scene_Menu_commandItem.call(this);
};

var _Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
Scene_Skill.prototype.createSkillTypeWindow = function() {
    console.log("createSkillTypeWindow", this);
    _Scene_Skill_createSkillTypeWindow.call(this);
};

var _Scene_Status_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function() {
    console.log("Status", this);
    _Scene_Status_create.call(this);
};


/**
 * Inventory Usage
 */
var _Scene_ItemBase_useItem = Scene_ItemBase.prototype.useItem;
Scene_ItemBase.prototype.useItem = function() {
    console.log("useItem", this);
    _Scene_ItemBase_useItem.call(this);
};

var _Scene_ItemBase_showSubWindow = Scene_ItemBase.prototype.showSubWindow;
Scene_ItemBase.prototype.showSubWindow = function(window) {
    console.log("Pathing", this);
    _Scene_ItemBase_showSubWindow.call(this, window);
};

var _Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
Scene_Equip.prototype.onItemOk = function() {
    console.log("Pathing", this);
    _Scene_Equip_onItemOk.call(this);
};

/**
 * Map Events
 */
var _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    _Game_Player_startMapEvent.call(this, x, y, triggers, normal);

    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                console.log("Pathing", this);
            }
        });
    }

};

var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    console.log("Pathing", this);
    _Scene_Map_onMapLoaded.call(this);
};

/**
 * Battle Events
 */
var _BattleManager_setup = BattleManager.setup;
BattleManager.setup = function(troopId, canEscape, canLose) {
    console.log("BM setup", this);
    _BattleManager_setup.apply(this, troopId, canEscape, canLose);
};

var _BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    console.log("BM endBattle", this);
    _BattleManager_endBattle.apply(this, result);
};

/**
 * Dialog Choices and NPC interaction
 */
var _Game_Message_allText = Game_Message.prototype.allText;
Game_Message.prototype.allText = function() {
    console.log("GameMessage_allText", this);
    return _Game_Message_allText.call(this);
};

var _Game_Message_onChoice = Game_Message.prototype.onChoice;
Game_Message.prototype.onChoice = function(n) {
    console.log("GameMessage_onChoice", this);
    _Game_Message_onChoice.call(this, n);
};

/**
 * Map Transfers
 */
var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    console.log("performTransfer", this);
    _Game_Player_performTransfer.call(this);
};

var _Game_Switches_onChange = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function() {
    console.log("Switches_onChange", this);
    _Game_Switches_onChange.call(this);
};

/**
 * Scene Events
 */
var _Scene_GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
Scene_GameEnd.prototype.commandToTitle = function() {
    console.log("GameEnd_commandToTitle", this);
    if ($titlesave) {
        Game_Switches.saveFile(true);
    }
    GameTracker.pathing = {};
    _Scene_GameEnd_commandToTitle.call(this);
};

var _Scene_Gameover_gotoTitle = Scene_Gameover.prototype.gotoTitle;
Scene_Gameover.prototype.gotoTitle = function() {  
    console.log("GameOver_gotoTitle", this); 
    _Scene_Gameover_gotoTitle.call(this)
};

/**
 * Misc Events
 */
var _StorageManager_save = StorageManager.save;
StorageManager.save = function(savefileId, json) {
    console.log("Pathing", this);
    _StorageManager_save.apply(this, [savefileId, json])
    // var fs = require('fs');
    // var path = require('path');

    // var dirPath = this.localFileDirectoryPath();
    // var filePath = path.join(dirPath, fname);
    
    // console.log(`dirPath = ${dirPath}`);
    // console.log(`Saving test file to '${filePath}'`);
    // console.log(json);

    // if (!fs.existsSync(dirPath)) {
    //     fs.mkdirSync(dirPath);
    // }

    // fs.writeFileSync(filePath, json);
}

