/*============================================================================
 *    ## Plugin Info                                                          
 *----------------------------------------------------------------------------
 *    # Plugin Name                                                           
 *      DoubleX RMMV Item Triggers                                            
 *----------------------------------------------------------------------------
 *    # Terms Of Use                                                          
 *      You shall keep this plugin's Plugin Info part's contents intact       
 *      You shalln't claim that this plugin's written by anyone other than    
 *      DoubleX or his aliases                                                
 *      None of the above applies to DoubleX or his aliases                   
 *----------------------------------------------------------------------------
 *    # Prerequisites                                                         
 *      Abilities:                                                            
 *      1. Decent Javascript coding proficiency to fully utilize this plugin  
 *----------------------------------------------------------------------------
 *    # Links                                                                 
 *      This plugin:                                                          
 *      1. http://pastebin.com/Caw27X83                                       
 *----------------------------------------------------------------------------
 *    # Author                                                                
 *      DoubleX                                                               
 *----------------------------------------------------------------------------
 *    # Changelog                                                             
 *      v1.01a(GMT 1300 26-2-2016):                                           
 *      1. ITCX and ITAX take the skill/item using them as an argument as well
 *      v1.00b(GMT 1400 27-1-2016):                                           
 *      1. Fixed calling current action via battler function upon action end  
 *      v1.00a(GMT 1500 17-12-2015):                                          
 *      1. 1st version of this plugin finished                                
 *============================================================================*/
/*:
 * @plugindesc Sets some items to trigger some actions when conditions are met
 * @author DoubleX
 *
 * @help
 * You're supposed to edit the plugin js file directly to set notetag values
 *============================================================================
 *    ## Notetag Info                                                         
 *----------------------------------------------------------------------------
 *    # Skill/Item Notetags:                                                  
 *      1. <timing item trigger: ITCX, ITAX>                                  
 *         - Sets a skill/item to trigger ITAX when timing and ITCX are met   
 *         - timing can be pre, post or custom timings set by you             
 *         - preBattle means right before using the skill/item in battles     
 *         - postBattle means right after using the skill/item in battles     
 *         - preMap means right before using the skill/item outside battles   
 *         - postMap means right after using the skill/item outside battles   
 *         - timing must only consist of alphanumeric characters              
 *         - ITCX can be set in Item Trigger Condition Functions              
 *         - ITAX can be set in Item Trigger Action Functions                 
 *============================================================================
 *    ## Plugin Call Info                                                     
 *----------------------------------------------------------------------------
 *    # Configuration manipulations                                           
 *      1. DoubleX_RMMV.Item_Triggers.prop                                    
 *         - Returns the property prop under DoubleX_RMMV.Item_Triggers       
 *      2. DoubleX_RMMV.Item_Triggers.prop = function                         
 *         - Sets the property prop under DoubleX_RMMV.Item_Triggers as       
 *           function which will be bound to the battler upon use             
 *         - No DoubleX_RMMV.Item_Triggers.prop change will be saved          
 *    # Item manipulations                                                    
 *      All meta.itemTriggers changes can be saved if                         
 *      DoubleX RMMV Dynamic Data is used                                     
 *      1. meta.itemTriggers[timing]                                          
 *         - Returns the array of all ITCX-ITAX pairs of timing timing        
 *      2. meta.itemTriggers[timing] = [[ITCX, ITAX], [ITCX, ITAX], ...]      
 *         - Adds a new timing with some ITCX-ITAX pairs or overwrites all the
 *           existing ones with those pairs if timing is an existing timing   
 *      3. meta.itemTriggers[timing][i] = [ITCX, ITAX]                        
 *         - Set the ith ITCX-ITAX pair as the new ITCX-ITAX pair             
 *    # Battler manipulations                                                 
 *      1. GBB.execItemTriggers.call(battler, item, timing)                   
 *         - Executes all item triggers with timing timing of item of battler 
 *           battler                                                          
 *         - GBB is DoubleX_RMMV.Item_Triggers.Game_BattlerBase               
 *============================================================================
 */

"use strict";
var DoubleX_RMMV = DoubleX_RMMV || {};
DoubleX_RMMV["Item Triggers"] = "v1.01a";

/*============================================================================
 *    ## Script Configurations                                                
 *       You only need to edit this part as it's about what this script does  
 *----------------------------------------------------------------------------*/

DoubleX_RMMV.Item_Triggers = {

    /*------------------------------------------------------------------------
     *    Item Trigger Condition Functions                                    
     *    - Setups ITCX used by <timing item trigger: ITCX, ITAX>             
     *------------------------------------------------------------------------*/
    /* ITCX are used at:
       1. DoubleX_RMMV.Item_Triggers.Game_BattlerBase
          - if (IT[trigger[0]].call(this)) { IT[trigger[1]].call(this); } in
          - execItemTriggers
       ITCX are Javascript functions which will be bound to the battler upon use
       ITCX names can only use alphanumeric characters
       item is the skill/item using the ITCX
       The below ITCX are examples added to help you set your ITCX
       You can freely use, rewrite and/or delete these examples */

    // Sets the item trigger condition as always true
    ITC1: function(item) { return true; },

    // Sets the item trigger condition as needing switch with id x to be on
    ITC2: function(item) { return $gameSwitches.value(x); },

    // Adds new ITCX here
    

    /*------------------------------------------------------------------------
     *    Item Trigger Action Values                                          
     *    - Setups ITAX used by <timing item trigger: ITCX, ITAX>             
     *------------------------------------------------------------------------*/
    /* ITAX are used at:
       1. DoubleX_RMMV.Item_Triggers.Game_BattlerBase
          - if (IT[trigger[0]].call(this)) { IT[trigger[1]].call(this); } in
          - execItemTriggers
       ITAX are Javascript functions which will be bound to the battler upon use
       ITAX names can only use alphanumeric characters
       item is the skill/item using the ITAX
       The below ITAX are examples added to help you set your ITAX
       You can freely use, rewrite and/or delete these examples */

    // Sets the item trigger action as what Special Effect Escape does
    ITA1: function(item) { this.hide(); },

    // Sets the item trigger action as setting the battler's hp to full
    ITA2: function(item) { this._hp = this.mhp; },

    // Adds new ITAX here
    

}; // DoubleX_RMMV.Item_Triggers

/*============================================================================
 *    ## Plugin Implementations                                               
 *       You need not edit this part as it's about how this plugin works      
 *----------------------------------------------------------------------------
 *    # Plugin Support Info:                                                  
 *      1. Prerequisites                                                      
 *         - Some Javascript coding proficiency to fully comprehend this      
 *           plugin                                                           
 *      2. Function documentation                                             
 *         - The 1st part describes why this function's rewritten/extended for
 *           rewritten/extended functions or what the function does for new   
 *           functions                                                        
 *         - The 2nd part describes what the arguments of the function are    
 *         - The 3rd part informs which version rewritten, extended or created
 *           this function                                                    
 *         - The 4th part informs whether the function's rewritten or new     
 *         - The 5th part informs whether the function's a real or potential  
 *           hotspot                                                          
 *         - The 6th part describes how this function works for new functions 
 *           only, and describes the parts added, removed or rewritten for    
 *           rewritten or extended functions only                             
 *         Example:                                                           
 * /*----------------------------------------------------------------------
 *  *    Why rewrite/extended/What this function does                      
 *  *----------------------------------------------------------------------*/ 
/* // arguments: What these arguments are                                     
 * functionName = function(arguments) { // Version X+; Hotspot                
 *     // Added/Removed/Rewritten to do something/How this function works     
 *     functionContents                                                       
 *     //                                                                     
 * } // functionName                                                          
 *----------------------------------------------------------------------------*/

(function(IT) {

    IT.DataManager = {};
    var DM = IT.DataManager;

    DM.isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        // Rewritten
        return DM.isDatabaseLoaded.apply(this, arguments) && DM.loadAllNotes();
        //
    }; // DataManager.isDatabaseLoaded

    DM.loadAllNotes = function() {
        [$dataSkills, $dataItems].forEach(function(type) {
            type.forEach(function(data) {
                if (data) { DM.loadItemNotes(data); }
            });
        });
        return true;
    }; // DM.loadAllNotes

    // data: The data to have its notetags read
    DM.loadItemNotes = function(data) {
        var regExp = /< *(\w+) +item +trigger *: *(\w+) *, *(\w+) *>/i;
        var timing, triggers;
        data.meta.itemTriggers = {};
        triggers = data.meta.itemTriggers;
        data.note.split(/[\r\n]+/).forEach(function(line) {
            if (!line.match(regExp)) { return; }
            timing = RegExp.$1;
            triggers[timing] = triggers[timing] || [];
            triggers[timing].push([RegExp.$2, RegExp.$3]);
        });
    }; // DM.loadItemNotes

    IT.BattleManager = {};
    var BM = IT.BattleManager;

    BM.startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        // Added
        var item = this._subject.currentAction().item();
        GBB.execItemTriggers.call(this._subject, item, "preBattle");
        //
        BM.startAction.apply(this, arguments);
    }; // BattleManager.startAction

    BM.endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        BM.endAction.apply(this, arguments);
        // Added
        var item = this._action ? this._action.item() : null;
        if (!item) { return; }
        GBB.execItemTriggers.call(this._subject, item, "postBattle");
        //
    }; // BattleManager.endAction

    IT.Game_BattlerBase = {};
    var GBB = IT.Game_BattlerBase;

    /*------------------------------------------------------------------------
     *    Triggers each item action when each respective condition's met      
     *------------------------------------------------------------------------*/
    // timing: The timing of the item triggering its actions
    GBB.execItemTriggers = function(item, timing) {
        var triggers = item.meta.itemTriggers[timing];
        if (!triggers) { return; }
        // Calls each ITCX to see if its ITAX should be called as well
        triggers.forEach(function(trigger) {
            if (!IT[trigger[0]].call(this, item)) { return; }
            IT[trigger[1]].call(this, item);
        }, this);
        //
    }; // GBB.execItemTriggers

    IT.Scene_ItemBase = {};
    var SIB = IT.Scene_ItemBase;

    SIB.useItem = Scene_ItemBase.prototype.useItem;
    Scene_ItemBase.prototype.useItem = function() {
        GBB.execItemTriggers.call(this.user(), this.item(), "preMap"); // Added
        SIB.useItem.apply(this, arguments);
        GBB.execItemTriggers.call(this.user(), this.item(), "postMap"); // Added
    }; // Scene_ItemBase.prototype.useItem

})(DoubleX_RMMV.Item_Triggers);

/*============================================================================*/