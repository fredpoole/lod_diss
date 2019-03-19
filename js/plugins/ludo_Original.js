//=============================================================================
//LudoSavePathing.js
//=============================================================================

/*:
 * @plugindesc plugin that tracks movement of the player when entering a given map and outputs that information to a file.
 * @author Alessio De Santis
 *
 * @help Use <Track:true> on Map metadata to enable tracking.
 * @param Default SwitchId
 * @desc Number of the switch that will trigger the file output when turned on for the first time
 *
 * Default : 20
 * @default 20
 *
 * @param Max Saves
 * @desc Max number of Saves allowed per game
 * Default : 1
 * @default 1
 *
 * @param Save on Title Screen
 * @desc Set to true to automatically save on title screen, false otherwise (lowercase true)
 * Default : true
 * @default true
 */


 //-----------------------------------------------------------------------------

 // Scene_Map_Pathing_Check
//
//

$testing = [];
$defaultSwitchId = Number(PluginManager.parameters("LudoSavePathing")["Default SwitchId"]) || 20;
$msaves = Number(PluginManager.parameters("LudoSavePathing")["Max Saves"]) || 1;
$titlesave = (PluginManager.parameters("LudoSavePathing")["Save on Title Screen"] == "true");

Scene_Map.prototype.onMapLoaded = function() {
    if (this._transfer) {
        $gamePlayer.performTransfer();
    }
    this.createDisplayObjects();
};

Game_Player.prototype.increaseSteps = function() {
    Game_Character.prototype.increaseSteps.call(this);
    if (this.isNormal()) {
        $gameParty.increaseSteps();
        if($msaves > 0 && $dataMap.meta.Track){
        $testing.filter(function(test){ return test.id === $gameMap._mapId })[0].pathing.push([$gameSystem.playtimeText(), this._x, this._y]);
        }
    }
};

Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        this.setDirection(this._newDirection);
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
        }
        this.locate(this._newX, this._newY);
        if($dataMap.meta.Track && $msaves > 0){
            console.log("runs");
            var Ludoexample = $testing.filter(function(test){ return test.id === $gameMap._mapId });
            if(Ludoexample.length == 0){
            var b = {
                id : this._newMapId,
                pathing : [[$gameSystem.playtimeText(), this._newX,this._newY]],
            }
            $testing.push(b);
            }
            else Ludoexample[0].pathing.push([$gameSystem.playtimeText(), this._newX, this._newY]);
        }

        this.refresh();
        this.clearTransferInfo();
    }
};


Game_Switches.prototype.onChange = function() {
    $gameMap.requestRefresh();
    Game_Switches.saveFile(this._data[$defaultSwitchId]);
};

Game_Switches.saveFile = function(sw) {
    if($msaves > 0 && sw){
        console.log("Outputting file");
        json = "";
        $testing.forEach(function(element){
            json += "{\n";
            json += "\t" + '"Map_id" : "' + element.id + '",\n';
            json += "\t" + '"Pathing" : ' + '[\n';
            element.pathing.forEach(function(array){
                if(element.pathing.indexOf(array) == element.pathing.length-1){
                    json += "\t\t[" + '"' + array[0] + '"' + ", " + array[1] + ", " + array[2] + "]";
                }
                else json += "\t\t[" + '"' + array[0] + '"' + ", " + array[1] + ", " + array[2] + "],\n";
            });
            json += '\n\t]\n';
            json += "}";
            json += "\n";
        });

        StorageManager.saveToTestFile(json);

        $msaves--;
    }
}

StorageManager.saveToTestFile = function(json) {
    var fs = require('fs');
    var dirPath = this.localFileDirectoryPath();
    var ref = Number(PluginManager.parameters("LudoSavePathing")["Max Saves"]) - $msaves + 1;
    var filePath = this.localFileDirectoryPath() + "test" + ref + ".txt";
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, json);
};

Scene_GameEnd.prototype.commandToTitle = function() {
    if($titlesave) Game_Switches.saveFile(true);
    Scene_GameEnd.clearTrackInfo();
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
};

Scene_Gameover.prototype.gotoTitle = function() {
    if($titlesave) Game_Switches.saveFile(true);
    Scene_GameEnd.clearTrackInfo();
    SceneManager.goto(Scene_Title);
};

Scene_GameEnd.clearTrackInfo = function(){
    for(var i of $testing){
        i.pathing = [];
    }
}
