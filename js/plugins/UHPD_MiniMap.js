/*=============================================================================
// UHPD_MiniMap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 UHPD Games
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2018/24/11
//       + Updated parameters
//       + fix .isBusy();
//       + downgrade ES6
// 1.0.0 2018/09/11 Create UHPD_MiniMap.js
// ----------------------------------------------------------------------------
// [Page games]: http://uhpdgames.itch.io/
// [Facebook]: https://www.facebook.com/Tactical-RPG-OutSchool-288240705135985/
// [GitHub] : https://github.com/uhpdgames/
// [Contact]: kenji.vn14@gmail.com || uhpdgames@gmail.com
 *=============================================================================*/

/*:
 * @plugindesc Displays the mini map
 * @author Ung Hoang Phi Dang | https://uhpdgames.itch.io
 * @version: 1.0.1
 *
 * @param Key toggle
 * @desc Press the `key` button to toggle minimap
 * @default pageup
 * @type text
 *
 * @param Player
 * @desc The picture display as player
 * @default PlayerDot
 * @type file
 * @dir img/pictures/
 *
 * @param SwitchPlayer
 * @desc The switch turns on/off dot player signal.
 * @default 10
 * @type switch
 *
 * @param SwitchMini
 * @desc The switch turns on/off mini map
 * @default 16
 * @type switch
 *
 * @param listIgnore
 * @desc the list Ignore Map with no minimap
 * @type text[]
 *
 * @help
 * ============================================================================
 * UHPD Games's Plugins
 * ============================================================================
 * TERMS: Free for commercial and non commercial use. Don't remove header
 * CREDITS: Ung Hoang Phi Dang or UHPD Games
 *
 * All Map's set by name data map and then pull it on folder picture
 * ex: map001.png saved in folder: img/pictures
 *
 * In game's called automatically, if you manually use the function
 * Call: this.miniMap(); via SwitchMini is ON
 *
 * Check out my website:
 * https://www.facebook.com/Tactical-RPG-OutSchool-288240705135985/
 * Demo: https://uhpdgames.itch.io/out-school
 *
 *=============================================================================*/
"use strict";
(function() {
    const parameters = PluginManager.parameters("UHPD_MiniMap");
    const dotPlayer = Number(parameters['SwitchPlayer'] || 10);
    const imgPlayer = String(parameters['Player'] || 'PlayerDot');
    const miniMapOff = Number(parameters['SwitchMini'] || 16);
    const keyBoard = String(parameters['Key toggle'] || 'pageup');
    const listIgnore = eval(parameters['listIgnore'] || []);
    const miniMap = function() {
        if (SceneManager._scene.constructor.name === "Scene_Map") {
            if (!$gameMessage.isBusy()) {
                const showMiniMap = $gameSwitches.value(miniMapOff) || false;
                const showPlayerDot = $gameSwitches.value(dotPlayer) || false;
                if (showPlayerDot) {
                    let Xplayer = $gamePlayer.x || 1;
                    let Yplayer = $gamePlayer.y || 1;
                    Xplayer *= 6;
                    Xplayer += 6;
                    Yplayer *= 6;
                    Yplayer += 6;
                    $gameScreen.showPicture(4, imgPlayer, 1, Xplayer, Yplayer, 100, 100, 255, 4);
                }
                if (Input.isTriggered(keyBoard)) {
                    if (!showMiniMap) {
                        const mapId = Number($gameMap.mapId());
                        let filename = 'map%1'.format(mapId.padZero(3));
                        if (listIgnore.indexOf(filename) < 0) {
                            $gameSwitches.setValue(dotPlayer, true);
                            $gameSwitches.setValue(miniMapOff, true);
                            $gameScreen.showPicture(2, filename, 0, 0, 0, 12.5, 12.5, 200, 0);
                        }
                    } else {
                        $gameScreen.erasePicture(2);
                        $gameScreen.erasePicture(4);
                        $gameSwitches.setValue(miniMapOff, false);
                        $gameSwitches.setValue(dotPlayer, false);
                    }
                }
            }
        }
    };
    Game_Interpreter.prototype.miniMap = function () {
        return miniMap();
    };
    const Alias_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Alias_pluginCommand.call(this, command, args);
        if (command === 'miniMap') {
            this.miniMap();
        }
    };
    //automatic run on game
    const Alias_Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        Alias_Spriteset_Map_update.call(this);
        miniMap();
    };
})();