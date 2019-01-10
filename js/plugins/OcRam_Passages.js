//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Passages.js
//=============================================================================

var Imported = Imported || {};
Imported.OcRam_Passages = true;
var OcRam_Passages = OcRam_Passages || {};
OcRam_Passages.version = '2.05';

/*:
 * @plugindesc v2.05 This plugin uses region ID to determine a player
 * 'floor level'. Even autotiles can be drawn ABOVE players.
 * @author OcRam
 *
 * @param Underpass Region ID
 * @desc Region ID for reducing player 'floor level' lower
 * @default 16
 *
 * @param Overpass Region ID
 * @desc Region ID for raising player 'floor level' higher. Also draws B-E tiles
 * @default 17
 *
 * @param Cover Region ID
 * @desc Region ID for "cover" such as bridges and other B-E tiles
 * @default 18
 *
 * @param Cover Autotile Region ID
 * @desc Region ID for "Autotile cover" such as cliffs, roofs and other A-tiles
 * @default 19
 *
 * @param Block Region ID
 * @desc Region ID to block movement from ALL floor levels
 * @default 20
 *
 * @param Overhead Region ID
 * @desc Region ID to block movement AND show tiles ABOVE player (if low ground)
 * @default 21
 *
 * @param Block High-Low Region ID
 * @desc Use to block movement from high <> low (must be next to underpass)
 * @default 22
 *
 * @help
 * ----------------------------------------------------------------------------
 * Introduction
 * ============================================================================
 * This plugin uses region ID to determine a player 'floor level'. Even
 * autotiles can be drawn ABOVE players.
 *
 * Events are signed to desired 'floor level' via event comments <lower> or
 * <higher>. Or via "floor_level" plugin command. By default: event interaction
 * is allowed only within same floor level (use event comments to change this).
 *
 * Character passage is allowed based on floor level (collision tests).
 *
 * ----------------------------------------------------------------------------
 * Usage
 * ============================================================================
 * For example horizontal bridge paint following regions (with default ids)
 *
 * 16 = Underpassage point, 17 = Overpassage point, 18 = Bridge (cover tile)
 *
 *      [16] [16] [16]
 * [17] [18] [18] [18] [17]
 *      [16] [16] [16]
 *
 * Possible event comments: <higher>, <lower>, <trigger_always>
 *
 * ----------------------------------------------------------------------------
 * Plugin commands
 * ============================================================================
 * floor_level [eventId | -1 = player] [high | low | auto] (sets floor level)
 *
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 *
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 *
 * Non-commercial use:
 * Free to use with credits to 'OcRam' for using 'Passages' -plugin.
 *
 * Commercial use: Contact: mmp_81(at)hotmail.com
 * Licenses are per project. License must be obtained BEFORE you start
 * selling your game.
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-passages-plugin.88047/
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2018, Marko Paakkunainen
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2018/03/04 v2.00 - Initial release for v2.00 (v1.x history on web site)
 * 2018/03/21 v2.01 - Support for Yanfly GridFreeDoodads
 *                    Auto-assign will set higher floor level only on
 *                    (A3)"roof" and (A4)"walltop" tiles
 * 2018/04/02 v2.02 - Support for Yanfly EventMinilabel
 *                    Compatibility with OcRam_Local_Coop improved!
 * 2018/04/03 v2.03 - Bug fix where follower collisions gave invalid results
 * 2018/05/05 v2.04 - Support for battle test
 * 2018/05/05 v2.05 - Added new function to Scene_Base (isMap())
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 *     Game_Map.prototype.isMapPassable
 *     Game_Map.prototype.isPassable
 *     Game_Map.prototype.checkPassage
 *     Game_Player.prototype.startMapEvent
 *     Game_CharacterBase.prototype.isCollidedWithEvents
 *     Game_Event.prototype.isCollidedWithEvents
 *     Game_Vehicle.prototype.refreshBushDepth
 *     ImageManager.isReady
 */

(function (OcRam_Passages) {

    "use strict";

    // ------------------------------------------------------------------------------
    // Plugin variables and parameters
    // ==============================================================================

    var _params = PluginManager.parameters('OcRam_Passages');

    var _underpassId = Number(_params['Underpass Region ID'] || 16);
    var _overpassId = Number(_params['Overpass Region ID'] || 17);
    var _coverId = Number(_params['Cover Region ID'] || 18);
    var _autoCoverId = Number(_params['Cover Autotile Region ID'] || 19);
    var _blockId = Number(_params['Block Region ID'] || 20);
    var _overheadId = Number(_params['Overhead Region ID'] || 21);
    var _blockHighLowId = Number(_params['Block High-Low Region ID'] || 22);

    var _tileSprites = []; // Tile sprites (static)
    var _charSprites = []; // Character sprites (moveable)
    var _wasMenuCalled = false; // Has menu been called?
    var _isAirshipLanded = true; // AirShip Sprite landed?

    var _twh = [48, 48]; // Default tile width, height
    var _flags = null; // Game_Map flags needs to be loaded only once...

    var _spriteLayers = []; // Keep layers here

    // ------------------------------------------------------------------------------
    // Plugin commands
    // ==============================================================================
    var OC_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        switch (command) {
            case "floor_level":
                if (SceneManager._scene._spriteset !== undefined) {
                    var obj_id = Number(args[0]); var this_obj = getGameObject(obj_id);
                    if (this_obj !== undefined && this_obj != null) {
                        if (String(args[1]).toLowerCase() == "low") this_obj._higherLevel = false;
                        if (String(args[1]).toLowerCase() == "high") this_obj._higherLevel = true;
                        if (String(args[1]).toLowerCase() == "auto") this_obj._higherLevel = autoAssignFloorLevel(this_obj);
                        updateEvent(this_obj);
                    }
                } break;
            default:
                OC_Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };

    // Fix for Yanfly EventMiniLabel
    if (Imported.YEP_EventMiniLabel) {
        var OC_Window_EventMiniLabel_gatherDisplayData = Window_EventMiniLabel.prototype.gatherDisplayData;
        Window_EventMiniLabel.prototype.gatherDisplayData = function () {
            if (this._character.isEvent_OC()) OC_Window_EventMiniLabel_gatherDisplayData.call(this);
        };
    }

    // ------------------------------------------------------------------------------
    // RMMV core - Aliases (OC_Class_Mame_methodName)
    // ==============================================================================

    // Auto-assign floor level to new party members
    var OC_Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        OC_Game_Party_addActor.call(this, actorId);
        if (SceneManager._scene.isMap()) {
            var new_index = $gamePlayer._followers.visibleFollowers().length - 1;
            if (new_index < 4 && new_index > -1) {
                $gamePlayer._followers._data[new_index]._higherLevel = autoAssignFloorLevel($gamePlayer._followers._data[new_index]);
            }
        }
    };

    // Create sprites and add them to proper parents
    var OC_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        OC_Spriteset_Map_createLowerLayer.call(this); this.createCoverLayers_OC();
        if (!_wasMenuCalled) {
            this._baseSprite.removeChild(this._shadowSprite); this.createShadow_OC();
            this._baseSprite.removeChild(this._destination); this.createDestination_OC();
        }
    };

    // Refresh tiles on scene changes
    var OC_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        OC_Scene_Map_start.call(this); initSprites();
    };

    // Move sprites when scrolling map
    var OC_Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function (distance) {
        var last_pos = this._displayY; OC_Game_Map_scrollDown.call(this, distance);
        var cur_pos = last_pos - this._displayY; moveSprites(0, cur_pos * 48);
    };
    var OC_Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function (distance) {
        var last_pos = this._displayY; OC_Game_Map_scrollUp.call(this, distance);
        var cur_pos = last_pos - this._displayY; moveSprites(0, cur_pos * 48);
    };
    var OC_Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function (distance) {
        var last_pos = this._displayX; OC_Game_Map_scrollLeft.call(this, distance);
        var cur_pos = last_pos - this._displayX; moveSprites(cur_pos * 48, 0);
    };
    var OC_Game_Map_scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function (distance) {
        var last_pos = this._displayX; OC_Game_Map_scrollRight.call(this, distance);
        var cur_pos = last_pos - this._displayX; moveSprites(cur_pos * 48, 0);
    };

    // This is the day, events can underpass AND overpass despite of player floor level....
    var OC_Game_CharacterBase_refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
    Game_CharacterBase.prototype.refreshBushDepth = function () {
        OC_Game_CharacterBase_refreshBushDepth.call(this); var region_id = this.regionId();
        if (region_id == _overpassId) { this._higherLevel = true; }
        else if (region_id == _underpassId) {
            this._higherLevel = this._priorityType == 2;
            if (SceneManager._scene._spriteset !== undefined) updateEvent(this);
        }
    };

    // Check if menu was called >> Do not auto assign events on sprite reload
    var OC_Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function () {
        OC_Scene_Map_callMenu.call(this); _wasMenuCalled = true;
    };
    
    // Update character graphics on event turns
    var OC_Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function (d) {
        OC_Game_CharacterBase_setDirection.call(this, d);
        if (SceneManager._scene._spriteset !== undefined) animationUpdate(this);
    };

    // Update character graphics on Moving
    var OC_Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
    Game_CharacterBase.prototype.updateMove = function () {
        OC_Game_CharacterBase_updateMove.call(this); animationUpdate(this);
    };

    // Update character graphics on Jumping
    var OC_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
    Game_CharacterBase.prototype.updateJump = function () {
        OC_Game_CharacterBase_updateJump.call(this); updateEvent(this);
    };

    // Update character graphics on Stepping
    var OC_Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
    Game_CharacterBase.prototype.updatePattern = function () {
        OC_Game_CharacterBase_updatePattern.call(this); animationUpdate(this);
    };

    // Check if sprite needs to be drawed
    var OC_Sprite_Character_updateVisibility = Sprite_Character.prototype.updateVisibility;
    Sprite_Character.prototype.updateVisibility = function () {
        OC_Sprite_Character_updateVisibility.call(this);
        if (this._character.isTransparent_OC()) this.visible = false;
    };

    // Update sprite graphics on updateAirshipAltitude
    var OC_Game_Vehicle_updateAirshipAltitude = Game_Vehicle.prototype.updateAirshipAltitude;
    Game_Vehicle.prototype.updateAirshipAltitude = function () {
        if (!this.isLowest() && !this.isHighest()) animationUpdate(this);
        
        OC_Game_Vehicle_updateAirshipAltitude.call(this);

        if (!this._driving && this.isLowest()) {
            if (!_isAirshipLanded) {
                var sprite_index = 0; var is_hl = $gamePlayer._higherLevel;
                for (var i = 0; i < $gamePlayer._followers.visibleFollowers().length; i++) {
                    sprite_index = $gamePlayer._followers.visibleFollowers()[i]._spriteIndex_OC;
                    if (sprite_index !== undefined) _charSprites[sprite_index].visible = is_hl;
                } sprite_index = $gamePlayer._spriteIndex_OC;
                if (sprite_index !== undefined) _charSprites[sprite_index].visible = is_hl;
                sprite_index = $gamePlayer.vehicle()._spriteIndex_OC;
                if (sprite_index !== undefined) {
                    _charSprites[sprite_index].visible = is_hl;
                    $gamePlayer.vehicle().setTransparent_OC(is_hl);
                } _isAirshipLanded = true;
            }
        }

    };

    var OC_Game_Vehicle_isLandOk = Game_Vehicle.prototype.isLandOk;
    Game_Vehicle.prototype.isLandOk = function (x, y, d) {
        var tmp_ret = OC_Game_Vehicle_isLandOk.call(this, x, y, d);
        if (tmp_ret) {
            if ($gameMap.regionId(x, y) == _coverId) return false;
            if (this._type == "airship") {
                if (!$gameMap.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f, true)) return false;
            }
            return true;
        }
    };

    // "Smart" drop >> check which autotile is drawn to landing point
    var OC_Game_Vehicle_getOff = Game_Vehicle.prototype.getOff;
    Game_Vehicle.prototype.getOff = function () {

        _isAirshipLanded = false;

        var is_hl = autoAssignFloorLevel($gamePlayer) ||
            ($gameMap.regionId($gamePlayer._x, $gamePlayer._y) == _overpassId);
        var sprite_index = 0; var cur_follower = null;

        for (var i = 0; i < $gamePlayer._followers.visibleFollowers().length; i++) {

            cur_follower = $gamePlayer._followers.visibleFollowers()[i];
            cur_follower._higherLevel = is_hl;

            sprite_index = cur_follower._spriteIndex_OC;
            if (_charSprites[sprite_index] != undefined) {
                _charSprites[sprite_index].x = cur_follower.screenX() - 24;
                _charSprites[sprite_index].y = cur_follower.screenY() - 48;
            }

            updateEvent(cur_follower);

        }

        $gamePlayer._higherLevel = is_hl;

        sprite_index = $gamePlayer._spriteIndex_OC;
        _charSprites[sprite_index].x = $gamePlayer.screenX() - 24;
        _charSprites[sprite_index].y = $gamePlayer.screenY() - 48;

        updateEvent($gamePlayer);

        OC_Game_Vehicle_getOff.call(this);

    };

    var OC_Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
    Game_Player.prototype.getOnVehicle = function () {

        var d = this.direction(); var x1 = this.x; var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, d);
        var y2 = $gameMap.roundYWithDirection(y1, d);

        var vehicle_type = ''; var ret = false;
        if ($gameMap.airship().pos(x1, y1)) {
            vehicle_type = 'airship';
        } else if ($gameMap.ship().pos(x2, y2)) {
            vehicle_type = 'ship';
        } else if ($gameMap.boat().pos(x2, y2)) {
            vehicle_type = 'boat';
        } else {
            return false;
        }

        if ((this._higherLevel || vehicle_type != 'airship')) {
            ret = OC_Game_Player_getOnVehicle.call(this);
        } else {
            var tiles = $gameMap.allTiles(this.x, this.y); var tile_id = 0;
            for (var i = 0; i < tiles.length; i++) {
                if (Tilemap.isAutotile(tiles[i])) tile_id = tiles[i];
            } var auto_hl = !(Tilemap.isTileA2(tile_id) || Tilemap.isTileA1(tile_id));
            if (!auto_hl) ret = OC_Game_Player_getOnVehicle.call(this);
        } return ret;
        
    };

    var OC_Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
    Game_Vehicle.prototype.getOn = function () {

        OC_Game_Vehicle_getOn.call(this);

        var sprite_index = 0;
        for (var i = 0; i < $gamePlayer._followers.visibleFollowers().length; i++) {
            sprite_index = $gamePlayer._followers.visibleFollowers()[i]._spriteIndex_OC;
            if (_charSprites[sprite_index] != undefined) _charSprites[sprite_index].visible = false;
        } sprite_index = $gamePlayer._spriteIndex_OC; _charSprites[sprite_index].visible = false;

    };
    
    var OC_Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function (x, y) {
        if ($gamePlayer._followers.isSomeoneCollided_OC(x, y, this._higherLevel)) return true;
        var tmp = OC_Game_Event_isCollidedWithPlayerCharacters.call(this, x, y);
        return tmp && ($gamePlayer._higherLevel == this._higherLevel);
    };

    // ------------------------------------------------------------------------------
    // RMMV core - New methods (methodName_OC)
    // ==============================================================================

    // Simple test is Character a player, follower, event or vehicle
    Game_CharacterBase.prototype.isPlayer_OC = function () { return false; };
    Game_CharacterBase.prototype.isFollower_OC = function () { return false; };
    Game_CharacterBase.prototype.isVehicle_OC = function () { return false; };
    Game_CharacterBase.prototype.isEvent_OC = function () { return false; };
    Game_Player.prototype.isPlayer_OC = function () { return true; };
    Game_Follower.prototype.isFollower_OC = function () { return true; };
    Game_Vehicle.prototype.isVehicle_OC = function () { return true; };
    Game_Event.prototype.isEvent_OC = function () { return true; };
    Scene_Base.prototype.isMap = function () { return false; }

    // When on higher ground hide characters and draw them only to "upper layer"
    Game_CharacterBase.prototype.isTransparent_OC = function () {
        return this._transparent_OC;
    };

    Game_CharacterBase.prototype.setTransparent_OC = function (transparent) {
        this._transparent_OC = transparent;
    };

    // Create layers for cover graphics
    Spriteset_Map.prototype.createCoverLayers_OC = function () {

        // 0 = "Autotile covers" Ground (autotiles)
        // 1 = "Covers" Ground objects (B-E)
        // 2 = Below chars
        // 3 = Character level
        // 4 = "Highest Region ID" level (B-E)
        // 5 = Above chars

        if (_wasMenuCalled) {
            this._coverLayers_OC = _spriteLayers; // Keep old layers
        } else {
            // Reset layer graphics
            _spriteLayers = [new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite(), new Sprite()];
            this._coverLayers_OC = _spriteLayers;
            for (var i = 0; i < this._coverLayers_OC.length; i++) {
                this._coverLayers_OC[i].move(0, 0, Graphics.width, Graphics.height);
                this._coverLayers_OC[i].z = 8; // draw under weathersprite
            }
        }

        //var index = this._tilemap.children.indexOf(this._weather);
        // Add layers to tilemap (under weather)
        for (var i = 0; i < this._coverLayers_OC.length; i++) {
            this._tilemap.addChild(this._coverLayers_OC[i]);
            //this._tilemap.addChildAt(this.this._coverLayers_OC[i], index);
        }

    };

    // These methods will force system to draw tiles on bitmap (cover tiles)
    Tilemap.prototype.drawTileToBitmap_OC = function (bitmap, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this.drawAutotile_OC(bitmap, tileId, dx, dy);
            } else {
                this.drawNormalTile_OC(bitmap, tileId, dx, dy);
            }
        }
    };

    Tilemap.prototype.drawAutotile_OC = function (bitmap, tileId, x1, y1) {

        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var bx = 0;
        var by = 0;
        var setNumber = 0;
        var isTable = false;

        if (Tilemap.isTileA1(tileId)) {
            var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
            setNumber = 0;
            if (kind === 0) {
                bx = waterSurfaceIndex * 2;
                by = 0;
            } else if (kind === 1) {
                bx = waterSurfaceIndex * 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    bx += waterSurfaceIndex * 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    by += this.animationFrame % 3;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        var table = autotileTable[shape];
        var source = this.bitmaps[setNumber];

        if (table && source) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 4; i++) {
                var qsx = table[i][0];
                var qsy = table[i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1;
                var dx1 = x1 + (i % 2) * w1;
                var dy1 = y1 + Math.floor(i / 2) * h1;
                if (isTable && (qsy === 1 || qsy === 5)) {
                    var qsx2 = qsx;
                    var qsy2 = 3;
                    if (qsy === 1) {
                        qsx2 = [0, 3, 2, 1][qsx];
                    }
                    var sx2 = (bx * 2 + qsx2) * w1;
                    var sy2 = (by * 2 + qsy2) * h1;
                    bitmap.blt(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                    dy1 += h1 / 2;
                    bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                } else {
                    bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
                }
            }
        }
    };

    Tilemap.prototype.drawNormalTile_OC = function (bitmap, tileId, x1, y1) {
        var setNumber = 0;
        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }
        var w = this._tileWidth;
        var h = this._tileHeight;
        var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        var sy = (Math.floor(tileId % 256 / 8) % 16) * h;
        var source = this.bitmaps[setNumber];
        if (source) {
            bitmap.blt(source, sx, sy, w, h, x1, y1, w, h);
        }
    };

    Tilemap.prototype.drawTableEdge_OC = function (bitmap, tileId, x1, y1) {
        if (Tilemap.isTileA2(tileId)) {
            var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            var kind = Tilemap.getAutotileKind(tileId);
            var shape = Tilemap.getAutotileShape(tileId);
            var tx = kind % 8;
            var ty = Math.floor(kind / 8);
            var setNumber = 1;
            var bx = tx * 2;
            var by = (ty - 2) * 3;
            var table = autotileTable[shape];
            if (table) {
                var source = this.bitmaps[setNumber];
                var w1 = this._tileWidth / 2;
                var h1 = this._tileHeight / 2;
                for (var i = 0; i < 2; i++) {
                    var qsx = table[2 + i][0];
                    var qsy = table[2 + i][1];
                    var sx1 = (bx * 2 + qsx) * w1;
                    var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                    var dx1 = x1 + (i % 2) * w1;
                    var dy1 = y1 + Math.floor(i / 2) * h1;
                    bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                }
            }
        }
    };

    Tilemap.prototype.paintTilesOnBitmap_OC = function (bm_lo, bm_hi, x, y, at) {

        var tableEdgeVirtualId = 10000;

        var x1 = (x * this._tileWidth); var y1 = (y * this._tileHeight);
        var lx = x1 / this._tileWidth; var ly = y1 / this._tileHeight;
        var tileId0 = this._readMapData(x, y, 0); // Autotile (ground)
        var tileId1 = this._readMapData(x, y, 1); // Autotile (bush)
        var tileId2 = this._readMapData(x, y, 2); // B-E tile (x/o)
        var tileId3 = this._readMapData(x, y, 3); // B-E tile (*)
        var upperTileId1 = this._readMapData(x, y - 1, 1);
        var tilesHigh = []; var tilesLow = [];

        if (at) {

            if (this._isHigherTile(tileId0)) { tilesHigh.push(tileId0); }
            else { tilesLow.push(tileId0); }

            if (this._isHigherTile(tileId1)) { tilesHigh.push(tileId1); }
            else { tilesLow.push(tileId1); }

        } else {
            if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
                if (!Tilemap.isShadowingTile(tileId0)) { tilesLow.push(tableEdgeVirtualId + upperTileId1); }
            }

            if (this._isHigherTile(tileId2)) { tilesHigh.push(tileId2); }
            else { tilesLow.push(tileId2); }

            if (this._isHigherTile(tileId3)) { tilesHigh.push(tileId3); }
            else { tilesLow.push(tileId3); }

        }

        x1 = 0; y1 = 0;

        bm_lo.clearRect(x1, y1, this._tileWidth, this._tileHeight);
        bm_hi.clearRect(x1, y1, this._tileWidth, this._tileHeight);

        for (var i = 0; i < tilesLow.length; i++) {
            var lowerTileId = tilesLow[i];
            if (lowerTileId < 0) {
            } else if (lowerTileId >= tableEdgeVirtualId) {
                this.drawTableEdge_OC(bm_lo, upperTileId1, x1, y1);
            } else {
                this.drawTileToBitmap_OC(bm_lo, lowerTileId, x1, y1);
            }
        }

        for (i = 0; i < tilesHigh.length; i++) {
            this.drawTileToBitmap_OC(bm_hi, tilesHigh[i], x1, y1);
        }

    };

    ImageManager.loadCharacter_OC = function (filename) {
        return this.loadBitmap('img/characters/', filename, 0, true);
    };

    Tilemap.prototype.paintCharacters_OC = function (ev) {

        var tmp_bm = ImageManager.loadCharacter_OC(ev._characterName);

        var ch = (tmp_bm.height / 8); var cw = tmp_bm.width / 12; // 4 x 2 charsheets
        var fc = ('' + ev._characterName);
        if (fc.indexOf("$") > -1) { // Only 1 char sheet here
            ch = Math.floor(tmp_bm.height / 4);
            cw = Math.floor(tmp_bm.width / 3);
        }

        var x = ev._characterIndex * (cw * 3); var y = 0;
        if (ev._characterIndex > 3) {
            x = (ev._characterIndex - 4) * (cw * 3);
            y = Math.floor(ch * 4);
        } x += ev.pattern() * cw; // Get stepping point

        switch (ev._direction) {
            case 4: y += ch; break;
            case 6: y += ch * 2; break;
            case 8: y += ch * 3; break;
        }

        var bitmap = new Bitmap(cw, ch);
        bitmap.blt(tmp_bm, x, y, cw, ch, 0, 0, cw, ch);

        return bitmap;

    };

    // Create shadow sprite to top layer
    Spriteset_Map.prototype.createShadow_OC = function () {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._coverLayers_OC[5].addChild(this._shadowSprite);
    };

    // Create destination sprite to top layer
    Spriteset_Map.prototype.createDestination_OC = function () {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._coverLayers_OC[5].addChild(this._destinationSprite);
    };

    // Local_Coop compatibility
    Game_Followers.prototype.isSomeoneCollided_OC = function (x, y, hl) {
        return this.visibleFollowers().some(function (follower) {
            return follower.pos(x, y) && (follower._higherLevel == hl);
        }, this);
    };

    // ------------------------------------------------------------------------------
    // RMMV core - Overrides
    // ==============================================================================

    ImageManager.isReady = function () {
        return this._imageCache.isReady();
    }; // Fix for Yanfly GridFreeDoodads

    Game_CharacterBase.prototype.isMapPassable = function (x, y, d) {

        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        var d2 = this.reverseDir(d); var block_passage = false;

        var next_region_id = $gameMap.regionId(x2, y2); var this_region_id = $gameMap.regionId(x, y);
        var t_hl = this._higherLevel; var is_this_cover = (this_region_id == _coverId || this_region_id == _autoCoverId);

        if (next_region_id == _blockId) {
            block_passage = true;
        } else {
            if (t_hl) { // This char is in higher ground
                if (is_this_cover) {
                    if (next_region_id == _underpassId) block_passage = true;
                } if (this_region_id == _blockHighLowId && next_region_id == _underpassId) block_passage = true;
            } else { // This char is in lower ground
                if (is_this_cover && (next_region_id == _overpassId || next_region_id == 0)) block_passage = true;
                if (next_region_id == _overheadId) block_passage = true;
            }
        }

        if (block_passage) {
            return false;
        } else {
            block_passage = true;
            if (!t_hl) {
                if ((this_region_id == _underpassId || is_this_cover) && (next_region_id == _underpassId ||
                    next_region_id == _coverId || next_region_id == _autoCoverId)) block_passage = false;
            }
            return (block_passage) ? ($gameMap.isPassable(x, y, d, this._higherLevel) && $gameMap.isPassable(x2, y2, d2, this._higherLevel)) : true;
        }

    };

    Game_Map.prototype.isPassable = function (x, y, d, hl) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f, hl);
    };

    Game_Map.prototype.checkPassage = function (x, y, bit, hl) {

        var tiles = this.allTiles(x, y); var block_passage = false;
        var this_region_id = $gameMap.regionId(x, y); var this_isCover = false;

        if (!hl) {
            // Event which called this method, is on lower floor level
            this_isCover = (this_region_id == _coverId || this_region_id == _autoCoverId) ? true : false;
            if (this_region_id == _overheadId) block_passage = true;
            if (this_region_id == _blockHighLowId) block_passage = true;
        }

        if (this_region_id == _blockId) block_passage = true;

        // Passages allowed depending on player 'floor' level
        for (var i = 0; i < tiles.length; i++) {
            var flag = _flags[tiles[i]];
            if (((flag & 0x10) !== 0) || (this_isCover && !block_passage)) // [*] No effect on passage
                continue;
            if ((flag & bit) === 0 && !block_passage) // [o] Passable
                return true;
            if ((flag & bit) === bit || block_passage) // [x] Impassable
                return false;
        } return true;

    };

    Game_CharacterBase.prototype.isCollidedWithEvents = function (x, y) {
        var events = $gameMap.eventsXyNt(x, y); var is_hl = this._higherLevel;
        return events.some(function (event) {
            return (event.isNormalPriority() && (event._higherLevel == is_hl));
        });
    };

    Game_Event.prototype.isCollidedWithEvents = function (x, y) {
        var events = $gameMap.eventsXyNt(x, y); var is_hl = this._higherLevel;
        return events.some(function (event) {
            return (event.isNormalPriority() && (event._higherLevel == is_hl));
        });
    };

    // Change event interaction by floor level
    Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
        // Start events ONLY if they are on same 'floor'
        var ev_cmts = []; var trigger_always = false; var this_hl = (this !== undefined) ? this._higherLevel : false;
        if (!$gameMap.isEventRunning()) {
            $gameMap.eventsXy(x, y).forEach(function (event) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    ev_cmts = getEventComments(event); trigger_always = false;
                    for (var i = 0; i < ev_cmts.length; i++) {
                        if (ev_cmts[i] == "<trigger_always>") { trigger_always = true; }
                    } if (event._higherLevel == this_hl || trigger_always) {
                        event.start(); animationUpdate(event);
                    }
                }
            });
        }
    };

    // Do not "refreshBushDepth" if vehicle (prevents undesired under-/over passages)
    Game_Vehicle.prototype.refreshBushDepth = function () { /* do nothing */ };

    // ------------------------------------------------------------------------------
    // Utility functions
    // ==============================================================================

    function autoAssignFloorLevel(ev) {
        var tiles = $gameMap.allTiles(ev._x, ev._y); var tile_id = 0;
        for (var i = 0; i < tiles.length; i++) {
            if (Tilemap.isAutotile(tiles[i])) tile_id = tiles[i];
        } return (Tilemap.isRoofTile(tile_id) || Tilemap.isWallTopTile(tile_id));
    }

    function getGameObject(eid) {
        if (eid < -1 && eid > -100) {
            return $gamePlayer._followers._data[-(eid + 1)];
        } else {
            switch (eid) {
                case -102: return $gameMap.airship();
                case -101: return $gameMap.ship();
                case -100: return $gameMap.boat();
                case -1: return $gamePlayer;
                default: return getEventById(eid);
            }
        }
    }

    function getEventById(eid) {
        var fnd = false; var oc_eid = eid; var tmp_event = null;
        while (!fnd && oc_eid > 0) {
            tmp_event = $gameMap.events()[oc_eid];
            if (tmp_event !== null && tmp_event !== undefined) {
                if (tmp_event._eventId == eid) fnd = true;
            } oc_eid--;
        } return tmp_event;
    }

    function animationUpdate(ev) {

        if (ev._eventId == undefined) {
            if (ev.isPlayer_OC()) ev._eventId = -1;
            if (ev.isFollower_OC()) ev._eventId = -(ev._memberIndex + 1);
            if (ev.isVehicle_OC()) {
                if (ev._type == "boat") ev._eventId = -100;
                if (ev._type == "ship") ev._eventId = -101;
                if (ev._type == "airship") { ev._eventId = -102; ev._higherLevel = true; }
            }
        }

        if (ev._higherLevel && ev._eventId !== undefined && ev._characterName) updateEvent(ev);

    }

    function moveSprites(px, py) {
        if (_tileSprites !== null) {
            for (var i = 0; i < _tileSprites.length; i++) {
                _tileSprites[i].x += px; _tileSprites[i].y += py;
            }
        } if (_charSprites !== null) {
            for (var i = 0; i < _charSprites.length; i++) {
                _charSprites[i].x += px; _charSprites[i].y += py;
            }
        }
    }

    function initSprites() {

        // Initialize bitmap arrays on autotile covers...
        _flags = $gameMap.tilesetFlags();
        _twh = [$gameMap.tileWidth(), $gameMap.tileHeight()];

        if (!_wasMenuCalled) {

            _charSprites = []; _tileSprites = [];
            
            var is_auto_or_overhead = false; var region_id = 0; 
            for (var x = 0; x < $gameMap.width(); x++) {
                for (var y = 0; y < $gameMap.height(); y++) {
                    region_id = $gameMap.regionId(x, y); is_auto_or_overhead = (region_id == _autoCoverId || region_id == _overheadId);
                    if (is_auto_or_overhead) {
                        drawLowerLayers(x, y); // Autotiles covers WHOLE tile
                    } if (region_id == _coverId || is_auto_or_overhead || region_id == _overpassId) {
                        drawBELayers(x, y); // Characters and B-E tiles may have transparent backgrounds
                    }
                }
            }

            for (var i = 0; i < _tileSprites.length; i++) { _tileSprites[i].visible = true; }

            var ev_cmts = []; var ev = null;

            // Draw events
            for (var x = 0; x < $gameMap.width(); x++) {
                for (var y = 0; y < $gameMap.height(); y++) {
                    var evts = $gameMap.eventsXy(x, y);
                    for (var i = 0; i < evts.length; i++) {
                        ev = evts[i];
                        if (!_wasMenuCalled) {
                            ev._higherLevel = autoAssignFloorLevel(ev);
                            ev_cmts = getEventComments(ev);
                            for (var j = 0; j < ev_cmts.length; j++) {
                                if (ev_cmts[j] == "<higher>") {
                                    ev._higherLevel = true; j = ev_cmts.length;
                                } else if (ev_cmts[j] == "<lower>") {
                                    ev._higherLevel = false; j = ev_cmts.length;
                                }
                            }
                        } addCharBitmap(ev, false); updateEvent(ev);
                    }
                }
            }

            var aship_obj = $gameMap.airship(); aship_obj._higherLevel = true;
            if (aship_obj._mapId == $gameMap.mapId()) {
                addCharBitmap(aship_obj, true); updateEvent(aship_obj);
            } drawActors();

        }

        _wasMenuCalled = false;

    }

    function drawLowerLayers(px, py) {
        var tmp_x = px - $gameMap._displayX; var tmp_y = py - $gameMap._displayY;
        addTileBitmap(drawTiles(px, py), tmp_x * 48, tmp_y * 48, 0, px, py);
    }

    function drawActors() {

        if (!_wasMenuCalled) $gamePlayer._higherLevel = autoAssignFloorLevel($gamePlayer);
        var ev = $gamePlayer; addCharBitmap(ev, false);

        for (var i = 0; i < $gamePlayer._followers.visibleFollowers().length; i++) {
            ev = $gamePlayer._followers.visibleFollowers()[i];
            if (!_wasMenuCalled) ev._higherLevel = autoAssignFloorLevel(ev);
            addCharBitmap(ev, false);
        }
       
    }

    // Add _tileSprites to desired _coverLayers_OC
    function addTileBitmap(p_bitmap, x, y, z, tx, ty) {
        var was_found = false;
        for (var i = 0; i < _tileSprites.length; i++) {
            if (_tileSprites[i].x == x && _tileSprites[i].y == y && _tileSprites[i].z == z) { was_found = true; break; }
        } if (was_found == false) { // Add new sprite
            var sprite = new Sprite(); sprite.bitmap = p_bitmap; sprite.x = x; sprite.y = y; sprite.z = z;
            _tileSprites.push(sprite); SceneManager._scene._spriteset._coverLayers_OC[z].addChild(sprite);
        } else {
            _tileSprites[i].visible = true; // Show existing sprite
        }
    }

    // Add drawed char bitmap to _charSprites array
    function addCharBitmap(ev, above_chars) {
        
        if (ev._eventId !== undefined && !(ev._characterName == "")) {

            var was_found = false;

            for (var i = 0; i < _charSprites.length; i++) {
                if (_charSprites[i]._eventId == ev._eventId) {
                    was_found = true; updateEvent(ev); break;
                }
            }

            if (was_found == false) { // Add new sprite
                var sprite = new Sprite(); sprite.bitmap = drawCharacter(ev);
                sprite.x = ev.screenX() - 24; sprite.y = ev.screenY() - 48;
                sprite._eventId = ev._eventId; sprite.visible = false;
                ev._spriteIndex_OC = _charSprites.length; _charSprites.push(sprite);
                if (ev._priorityType == 2 || above_chars) {
                    SceneManager._scene._spriteset._coverLayers_OC[5].addChild(sprite); updateEvent(ev);
                } else {
                    SceneManager._scene._spriteset._coverLayers_OC[(ev._priorityType + 1)].addChild(sprite); updateEvent(ev);
                }
            }

        }

    }

    // Move and update event animations
    function updateEvent(ev) {

        var i = ev._spriteIndex_OC;

        if (_charSprites[i] !== undefined && i !== undefined) {

            _charSprites[i].visible = ev._higherLevel && !ev._transparent; ev.setTransparent_OC(ev._higherLevel);

            if (_charSprites[i].visible) {

                var cx = ev.screenX() - 24;
                var cy = ev.screenY() - 48;
                var b1 = drawCharacter(ev);
                var bmw = b1.width; var bmh = b1.height;

                if (bmw > 48) {
                    bmw = (bmw % 48 == 0) ? bmw * 0.5 - 24 : bmw * 0.5 - (bmw % 48);
                } else { bmw = 0; }

                bmh = (bmh == 48) ? 0 : bmh - 48;

                _charSprites[i].x = cx - bmw;
                _charSprites[i].y = cy - bmh;
                _charSprites[i].bitmap = b1;
                
            }

        } else { // Event not created yet?
            addCharBitmap(ev, false);
        }

    }

    function drawCharacter(ev) { // Draw characters - Returns: Bitmap
        var ctm = SceneManager._scene._spriteset._tilemap;
        var bitmap = ctm.paintCharacters_OC(ev);
        return bitmap;
    }

    function drawTiles(x, y) { // Draw autotiles - Returns: Bitmap
        var low_bm = new Bitmap(_twh[0], _twh[1]);
        var high_bm = new Bitmap(_twh[0], _twh[1]);
        var bitmap = new Bitmap(_twh[0], _twh[1]);
        var ctm = SceneManager._scene._spriteset._tilemap;
        ctm.paintTilesOnBitmap_OC(low_bm, high_bm, x, y, true);
        bitmap.blt(low_bm, 0, 0, low_bm.width, low_bm.height, 0, 0, low_bm.width, low_bm.height);
        bitmap.blt(high_bm, 0, 0, high_bm.width, high_bm.height, 0, 0, high_bm.width, high_bm.height);
        return bitmap;
    }

    function drawBELayers(px, py) { // Draw B-E tiles - Returns: Bitmap

        var tmp_x = px - $gameMap._displayX; var tmp_y = py - $gameMap._displayY;

        var low_bm = new Bitmap(_twh[0], _twh[1]); var high_bm = new Bitmap(_twh[0], _twh[1]);
        var ctm = SceneManager._scene._spriteset._tilemap;
        ctm.paintTilesOnBitmap_OC(low_bm, high_bm, px, py, false);

        addTileBitmap(low_bm, tmp_x * 48, tmp_y * 48, 1, px, py); // Add below chars
        addTileBitmap(high_bm, tmp_x * 48, tmp_y * 48, 4, px, py); // Add above chars

    }

    function getEventComments(ev) { // Returns all comments in array
        if (ev === null || ev === undefined) {
            return [];
        } else {
            if (ev._erased != true && ev._pageIndex > -1) {
                var cmts = []; var ev_list = ev.list();
                for (var i = 0; i < ev_list.length; i++) {
                    if (ev_list[i].code == 108) { // we have a comment
                        for (var j = 0; j < ev_list[i].parameters.length; j++) {
                            if (ev_list[i].parameters[j] != null) cmts.push(ev_list[i].parameters[j]);
                        }
                    }
                } return cmts;
            } else {
                return [];
            }
        }
    }

    // Tested copying bitmap from PIXI container...
    function pixiToBitmap(pixi_cont, w, h) {
        var bm = new Bitmap(w, h); var ctx = bm._context;
        var rt = PIXI.RenderTexture.create(w, h);
        Graphics._renderer.render(pixi_cont, rt);
        var cnvs = Graphics._renderer.extract.canvas(rt);
        ctx.drawImage(cnvs, 0, 0);
        rt.destroy({ destroyBase: true });
        bm._setDirty(); return bm;
    }

})(OcRam_Passages);