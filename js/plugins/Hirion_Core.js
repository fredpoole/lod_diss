//=============================================================================
// Hirion - Core
// Version 1.4
// Created: 2017-08-15
// Updated: 2018-07-12
// by Nicke
//=============================================================================

//=============================================================================
// * Hirion - Core plugin.
//=============================================================================

//=============================================================================
 /*:
 * @author Nicke
 * @plugindesc Hirion - Core. (v1.4) 
 *
 * @param Main Settings
 * @default
 *
 * @param Debug Mode
 * @parent Main Settings
 * @type boolean
 * @on Debug
 * @off No debug
 * @desc Debug mode on? Will output messages to console for debugging.
 * @default false
 *
 * @help
 * ============================================================================
 * Hirion - Core.
 * How to use
 * ============================================================================
 *
 * Put this above all other Hirion plugins.
 * ============================================================================
 * -- Main Settings --
 * ============================================================================
 *
 * Debug Mode:
 * Use this to enable/disable debug mode.
 *
 * ============================================================================
 * -- Plugin Commands (ingame usage) --
 * ============================================================================
 * None.
 * 
 * ============================================================================
 * Version List:
 * ============================================================================
 * Version 1.0: 
 * Released first version of the plugin.

 * Version 1.1: 
 * Added parameter error checking.
 * Added Fade & Blink character effects.
 * Added new functions to support Swim & Fall System plugins.
 *
 * Version 1.2:
 * Changed Character Fade function.
 * Added functions to check if player is swimming or falling.
 * Added plugin command to check if the player have required swim item.
 * Fixed support for latest RPG Maker MV update version 1.5.1. Blink effect was
 * not working as intended.
 *
 * Version 1.3:
 * Added new functions to draw horz/vert line.
 * Added a new function to draw text with icons. Can draw multiple values in a
 * horizonal line or vertical.
 * Added struct option for plugin parameters.
 *
 * Version 1.4:
 * Cleaned up parameter function.
 * Added log functions for debugging.
 * Added percent function.
 *
 */
//=============================================================================


let HirionSystem;
HirionSystem = HirionSystem || {};
HirionSystem.Core = {
	name: "Hirion Core",
    version: 1.4,
};

"use strict";

// Function to parse parameters
let JSONSuperParse = function(string) {
    let temp;
    try {
        temp = obj = JsonEx.parse(typeof string === 'object' ? JsonEx.stringify(string) : string);
    } catch (e) {
        return string;
    }
    if (typeof temp === 'object') {
        Object.keys(temp).forEach(function (key) {
            temp[key] = JSONSuperParse(temp[key]);
            if (temp[key] === '') {
                temp[key] = null;
            }
        });
    }
    return temp;
};

(function($) {

	//=============================================================================
	// * New Array functions
	//=============================================================================
	Array.prototype.current = 0;

	Object.defineProperty(Array.prototype, "next", {
		// Function to go to next value in the array.
	    value: function() { return this[++this.current]; },
	    enumerable: false
	});

	Object.defineProperty(Array.prototype, "prev", {
		// Function to go to previous value in the array.
	    value: function() { return this[--this.current]; },
	    enumerable: false
	});

	//=============================================================================
	// * New String functions
	//=============================================================================
	Object.defineProperty(String.prototype, "capitalize", {
		// Function to to set a string to be capitalized.
	    value: function() { return this.charAt(0).toUpperCase() + this.slice(1); },
	    enumerable: false
	});

	//=============================================================================
	// * Setup Hirion System functions
	//=============================================================================
	HirionSystem.rndInt = function(p, n) {
		// Function to fetch a random number, can be positive or negative.
		result = Math.floor(Math.random() * (p + n)) - n;
		return result += (result >= 0);
	};

	HirionSystem.getPctA = function(value, value2, percent) {
		// Function to get percent value from 2 numbers.
		return Math.round(value / value2 * 100.0) > percent;
	};

	HirionSystem.getPctB = function(value, value2, percent) {
		// Function to get percent value from 2 numbers.
		return Math.round(value / value2 * 100.0) < percent;
	};

	HirionSystem.parameter = function(plugin_name, param1, param2, type) {
		// Function to fetch a plugin parameter. Throw error if invalid value.
		this._param = PluginManager.parameters(param1)[param2];
		try {
			switch (type) {
			case "String":
				if (typeof this._param !== 'string' || !this._param instanceof String || this._param.length === 0 ) throw new Error("Not a valid string value.");
				this._param = String(this._param);
				break;
			case "Number":
				if (!this._param || isNaN(this._param) || this._param < 0) throw new Error("Not a valid number value.");
				this._param = Number(this._param);
				break;
			case "Boolean":
				this._param = JSON.parse(this._param);
				if (typeof this._param !== 'boolean' || !this._param instanceof Boolean) throw new Error("Not a valid boolean value."); 
				break;
			}
		} catch (err) {
			console.group(plugin_name + " error:");
			console.error(param2 + " - " + err.message);
			console.groupEnd();
		}
		return this._param;
	};

	HirionSystem.log = function(plugin_name, enabled, value, type) {
		// Function to log to console if debug is enabled.
        if (enabled) {
        	console.group(plugin_name);
        	if (type === "") {
        		console.log(value);
        	}
        	if (type === "warn") {
				console.warn(value);
        	}
        	if (type === "err") {
        		console.error(value);
        	}
        	
        	console.groupEnd();
        }
	};

	//=============================================================================
	// * Plugin parameters
	//=============================================================================
	HirionSystem.Core.DebugMode = HirionSystem.parameter(HirionSystem.Core.name, "Debug Mode", "Hirion_Core", "Debug Mode", "Boolean");

	//=============================================================================
	// * Define aliases
	//=============================================================================
	let _Hirion_Core_Game_Player_CanMove = Game_Player.prototype.canMove;
	let _Hirion_Core_Game_Player_isDashing = Game_Player.prototype.isDashing;
	let _Hirion_Core_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  	let _Hirion_Core_Game_Player_initMembers = Game_Player.prototype.initMembers;
  	if (Imported.MOG_ChronoEngine) {
  		let _Hirion_Core_Game_Player_Moghunter_commandAttackUsable = Game_Player.prototype.commandAttackUsable;
  	}

	//=============================================================================
	// * Game Player
	//=============================================================================
  	Game_Player.prototype.initMembers = function() {
    	// Function to setup swim parameters.
    	_Hirion_Core_Game_Player_initMembers.call(this);
    	this._hirionTerrainTag = [];
    	this._hirionDisableMove = false;
    	this._hirionPlayerEffectSwim = false;
    	this._hirionPlayerEffectFall = false;
    	this._hirionPlayerOldGfx = "";
    	this._hirionPlayerOldSwimX = 0;
    	this._hirionPlayerOldSwimY = 0;
    	this._hirionPlayerOldFallX = 0;
    	this._hirionPlayerOldFallY = 0;
    	this._hirionPlayerReqItem = 0;
  	};

	// Functions for when Moghunter Chrono Engine is imported.
	if (Imported.MOG_ChronoEngine) {
		Game_Player.prototype.commandAttackUsable = function() {
			// Function to check if attack is usable for Moghunter Chrono ABS.
			if ($gamePlayer.terrainTag() == $gamePlayer._hirionTerrainTag[0]) return false;
			if ($gamePlayer.terrainTag() == $gamePlayer._hirionTerrainTag[1]) return false;
			return _Hirion_Core_Game_Player_Moghunter_commandAttackUsable.call(this);
		};

		Game_Player.prototype.moghunterABSTools = function(enabled) {
			// Function to enable/disable ABS tools for Moghunter Chrono.
			if ($gameSystem._chronoCom) {
				$gameSystem._chronoCom.attack = enabled;
				$gameSystem._chronoCom.shield = enabled;
				$gameSystem._chronoCom.item = enabled;
				$gameSystem._chronoCom.skill = enabled;
			}
		};
	}

	Game_Player.prototype.charFadeEffect = function(value) {
		// Function to fade in/out player character.
		let characterFade = setInterval(function(){
			$gamePlayer._opacity = ($gamePlayer._opacity + value).clamp(0, 255);
			if ($gamePlayer._opacity >= 255 || $gamePlayer._opacity <= 0) clearInterval(characterFade);
		}, 60);
	};

	Game_Player.prototype.charBlinkEffect = function(amount) {
		// Function to blink the player character.
		let characterBlink = setInterval(function(){
			amount--;
			$gamePlayer._opacity = Math.randomInt(192);
			if (amount <= 0) {
				$gamePlayer._opacity = 255;
				clearInterval(characterBlink);
			}
		}, 30);
	};

	Game_Player.prototype.isSwimming = function() {
		// Function to check if player is swimming.
    	return this._hirionPlayerEffectSwim;
	};

	Game_Player.prototype.isFalling = function() {
		// Function to check if player is falling.
    	return this._hirionPlayerEffectFall;
	};

	Game_Player.prototype.canMove = function() {
		// Function to disable player moving.
		return !this._hirionDisableMove;
		return _Hirion_Core_Game_Player_CanMove.call(this);
	};

	Game_Player.prototype.isDashing = function() {
		// Function to check if player dashing.
		if (this.isSwimming() || this.isFalling()) this._dashing = false;
		else return _Hirion_Core_Game_Player_isDashing.call(this);
	};

	Game_Player.prototype.isOnHirionTerrainType = function(tag) {
		// Function is to check if player is on specified terrain tag.
    	return this.terrainTag() == tag && !this.isInAirship();
	};

	Game_Player.prototype.hirionGroupTerrainTags = function(tag, getTag) {
		// Function to set group hirion terrain tags.
		if (tag != null) {if (!tag.contains(getTag)) {tag.push(getTag);}}
	};

	Game_Player.prototype.hirionTerrainEffectAnim = function(id) {
		// Function to play optional splash animation on player.
		if (id > 0) {
			if (HirionSystem.Core.DebugMode) {console.info("Splash animation id: '" + id +"'");}
			this.requestAnimation(id);
		}
	};

	Game_Player.prototype.hirionTerrainEffectItem = function(item) {
		// Function to check if player have required item (type armor).
		if (item == null) return false;
		if (item == 0) return true;
		return this._hirionPlayerReqItem = $gameParty.leader().isEquipped($dataArmors[item]);
	};

	Game_Player.prototype.hirionTerrainEffectDamage = function(dmg, dmgGameover, dmgForumla) {
		// Function for player damage.
		if (dmg) {
			dmgForumla = eval(dmgForumla);
			if (dmgForumla > 0) {
				if (dmgGameover) {
					$gameParty.leader().gainHp(-dmgForumla);
				} else {
					if ($gameParty.leader().hp <= 1) $gameParty.leader().hp = 1;
					else $gameParty.leader().gainHp(-dmgForumla);
				}
			}					
		}
	};

	Game_Player.prototype.hirionTerrainEffect = function(effect, terrTag, reqItem, splashId, gfx, dmg, dmgGameover, dmgFormula, charFade, 
														charFadeTime, charBlink, charBlinkTime) {
  		// Function for when the player is on a hirion terrain effect tag.
		switch (effect) {
			case "Swimming": 
				if (HirionSystem.Core.DebugMode) {console.info("Swim terrain tag id '" + terrTag + "' with item id '" + reqItem +"'");}
				if (Imported.MOG_ChronoEngine) $gamePlayer.moghunterABSTools(false);
				if (this.hirionTerrainEffectItem(reqItem)) {
					if (!this.isSwimming()) {
					this.hirionTerrainEffectAnim(splashId);
					this._hirionPlayerOldGfx = this.characterName();
					$gameParty.leader().setCharacterImage(gfx.split('/')[2], 0);
					this.refresh();
					this._hirionPlayerEffectSwim = true;
					}

				} else {
					this._hirionDisableMove = true;
					this.hirionTerrainEffectAnim(splashId);
					this.hirionTerrainEffectDamage(dmg, dmgGameover, dmgFormula);
					if (charFade) this.charFadeEffect(-charFadeTime);
					setTimeout(function(){
						$gamePlayer.locate($gamePlayer._hirionPlayerOldSwimX, $gamePlayer._hirionPlayerOldSwimY);
						if (charFade)  $gamePlayer.charFadeEffect(charFadeTime);
						if (charBlink) $gamePlayer.charBlinkEffect(charBlinkTime);
						if (Imported.MOG_ChronoEngine) $gamePlayer.moghunterABSTools(true);
					}, 1000);
					setTimeout(function(){
						$gamePlayer._hirionDisableMove = false;
					}, 2000);
				}
			break;
			case "Falling":
				if (HirionSystem.Core.DebugMode) {console.info("Fall terrain tag id '" + terrTag + "'");}
				if (Imported.MOG_ChronoEngine) this.moghunterABSTools(false);
				this._hirionPlayerEffectFall = true;
				this._hirionDisableMove = true;
				this.hirionTerrainEffectAnim(splashId);
				this.hirionTerrainEffectDamage(dmg, dmgGameover, dmgFormula);
				if (charFade) this.charFadeEffect(-charFadeTime);
				setTimeout(function(){
					$gamePlayer.locate($gamePlayer._hirionPlayerOldFallX, $gamePlayer._hirionPlayerOldFallY);
					if (charFade)  $gamePlayer.charFadeEffect(charFadeTime);
					if (charBlink) $gamePlayer.charBlinkEffect(charBlinkTime);
					if (Imported.MOG_ChronoEngine) $gamePlayer.moghunterABSTools(true);
				}, 1500);
				setTimeout(function(){
					$gamePlayer._hirionDisableMove = false;
					$gamePlayer._hirionPlayerEffectFall = false;

				}, 2500);
			break;
		}
  	};

	//=============================================================================
	// * Window Base
	//=============================================================================
	Window_Base.prototype.drawHirionLine = function(x, y, width, color, border, horz) {
		// Function to draw horizontal/vertical lines.
		let lineX = x, lineY = y + 48 / 2 - 1;
		border = border || 1;
		if (horz === undefined) horz = true;

		this.contents.paintOpacity = 48;
		if (horz) {
		    this.contents.fillRect(lineX, lineY, width, border, color);
		} else {
			lineX = x + 48 / 2 - 1;
			lineY = y;
		    this.contents.fillRect(lineX, lineY, border, width, color);
		}
		this.contents.paintOpacity = 255;
	};

	Window_Base.prototype.drawHirionIcon = function(icons, iconBorder, x, y, x_offset, y_offset, direction) {
		// Function to draw icons.
		direction = direction || 'horz';
		this._old_x = x, this._old_y = y;
		if (iconBorder.length > 0) {
			for (let i = 0; i < iconBorder[0]; i++) {
				if (direction === 'horz') {
					this.contents.paintOpacity = icons[i] === undefined ? 128 : 255;
					this.drawIcon(iconBorder[1], x + Window_Base._iconWidth * i, y + y_offset);
					x += x_offset;
				}
				if (direction === 'vert') {
					this.drawIcon(iconBorder[1], x, y + Window_Base._iconHeight * i + 12);
					y += y_offset;
				}
			}
			x = this._old_x, y = this._old_y;
		}
	    for (let i = 0; i < icons.length; i++) {
	    	if (direction === 'horz') {
	    		this.contents.paintOpacity = 255;
				this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + y_offset);
				x += x_offset;
		        
	    	}
	    	if (direction === 'vert') {
				this.drawIcon(icons[i], x, y + Window_Base._iconHeight * i + y_offset);
		        y += y_offset;
	    	}
	    }
	};

})();