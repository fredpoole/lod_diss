//=============================================================================
// Hirion - Stamina
// Version 1.0
// Created: 2017-08-30
// Updated: 2018-07-13
// by Nicke
//=============================================================================

//=============================================================================
// * Hirion - Stamina system plugin.
//=============================================================================

//=============================================================================
 /*:
 * @author Nicke
 * @plugindesc Hirion - Stamina System. (v1.0) 
 *
 * @param Stamina Settings
 * @default
 *
 * @param Enable Switch
 * @parent Stamina Settings
 * @type switch
 * @desc Enable/disable switch for stamina system.
 * Default 1
 * @default 1
 * 
 * @param Stamina Debug
 * @parent Stamina Settings
 * @type boolean
 * @on YES
 * @off NO
 * @desc Used for debugging the plugin.
 * @default false
 *
 * @param Stamina Initial
 * @parent Stamina Settings
 * @type variable
 * @desc The initial stamina variable.
 * Default: 10
 * @default 10
 *
 * @param Stamina Max
 * @parent Stamina Settings
 * @type variable
 * @desc The maximum stamina variable.
 * Default: 11
 * @default 11
 *
 * @param Recover Amount
 * @parent Stamina Settings
 * @desc The amount of stamina you gain.
 * Default 20% of max stamina
 * @default Math.round(this._stamina_max * 0.20)
 *
 * @param Decrease Amount
 * @parent Stamina Settings
 * @type number
 * @max 99999
 * @min 0
 * @desc The amount of stamina you loose.
 * Default: 1
 * @default 1
 *
 * @param Decrease Amount Swimming
 * @parent Stamina Settings
 * @type number
 * @max 99999
 * @min 0
 * @desc The amount of stamina you loose when swimming.
 * Default: 2
 * @default 2
 *
 * @param Recover Rate
 * @parent Stamina Settings
 * @type number
 * @max 99999
 * @min 0
 * @desc The rate you recover stamina.
 * Default: 1
 * @default 1
 *
 * @param Recover Time
 * @parent Stamina Settings
 * @type number
 * @max 99999
 * @min 0
 * @desc How long you need to wait in seconds to gain stamina. (Default 3 seconds.)
 * Default: 3
 * @default 3
 *
 * @param Balloon
 * @parent Stamina Settings
 * @type number
 * @max 15
 * @min 0
 * @desc When stamina is depleted play a balloon animation on top of player character. Set to 0 to disable.
 * Default: 0
 * @default 0
 *
 * @param Hud
 * @default
 *
 * @param Hud Switch
 * @parent Hud
 * @type switch
 * @desc Enable/disable switch for the stamina hud.
 * Default 2
 * @default 2
 *
 * @param Hud Fade
 * @parent Hud
 * @type boolean
 * @on YES
 * @off NO
 * @desc Enable/disable fade trigger for the hud.
 * @default true
 *
 * @param Hud Font Name
 * @parent Hud
 * @desc Font name for the hud.
 * @default Tahoma, Geneva, sans-serif
 *
 * @param Hud Font Size
 * @parent Hud
 * @type number
 * @desc Font size for the hud.
 * Default: 14
 * @default 14
 *
 * @param Hud Gauge Enabled
 * @parent Hud
 * @type boolean
 * @on YES
 * @off NO
 * @desc Enable/disable the stamina gauge.
 * @default true
 *
 * @param Hud Gauge Type 
 * @parent Hud
 * @type select
 * @option Normal
 * @option Custom
 * @desc Select hud gauge type. Normal or with custom graphics.
 * @default Normal
 *
 * @param Hud Back Gauge
 * @parent Hud
 * @type file
 * @desc Stamina hud back gauge file. Only used when custom gauge type is selected.
 * @default
 * @require 1
 *
 * @param Hud Front Gauge
 * @parent Hud
 * @type file
 * @desc Stamina hud front gauge file. Only used when custom gauge type is selected.
 * @default
 * @require 1
 *
 * @param Hud Title
 * @parent Hud
 * @desc The stamina text used for the hud.
 * Optional: Set null to disable.
 * @default Stamina
 *
 * @param Hud Value
 * @parent Hud
 * @desc The stamina text used for the hud. 
 * Optional: Set null to disable.
 * @default Math.round((this._stamina / this._stamina_max * 100.0)) + "%"
 *
 * @help
 * ============================================================================
 * Hirion - Stamina System.
 * ============================================================================
 * Required plugin(s):
 * Hirion Core. 
 * This plugin will not work without the Core plugin. Please put this plugin
 * below the core.
 *
 * Works with:
 * Hirion Swim plugin. You will loose stamina when swimming.
 *
 * ============================================================================
 * How to use...
 * ============================================================================
 * When this system is enabled it will add a stamina attribute to the game.
 * Dashing on the map will make the player loose a small amount of stamina
 * and when it reaches 0 it will disable dashing. The player needs to wait
 * for stamina to be restored in order to dash again.
 *
 * You can enable/disable the system with a switch. Default switch id: 1.
 * A Hud can be enabled/disabled with a switch and are used to display the 
 * current/maximum stamina values. Default switch id 2.
 *
 * The hud consists of two parts, a gauge and text values. These can be 
 * changed in the settings of the plugin. For example you can change the 
 * gauge to use a custom image file.
 * You can of course also change font name and size for the text.
 *
 * A balloon animation can be displayed when stamina is below a certain amount 
 * of stamina.
 * 
 * Setup with ease how the stamina system will work. 
 * Changing recovery time, amount gained and max stamina value to name a few.
 * The initial stamina and max value are linked to variables and are used ingame.
 * Items can also be used to gain stamina or increase maximum stamina.
 *
 * ============================================================================
 * Version List:
 * ============================================================================
 *
 * Version 1.0: Released first version of the plugin.
 *
 */
//=============================================================================

"use strict";

(function($) {

  //=============================================================================
  // * Main
  //=============================================================================
  // Check if Hirion System Core is installed properly.
  try { 
    if (typeof HirionSystem === 'undefined') {
      throw new Error("Please install the latest version of Hirion Core to use this plugin.");
    }
  } catch (err) {
    return console.warn("Hirion Stamina: " + err.message);
  }

  // Define Hirion Stamina system properies.
  HirionSystem.Stamina = {
    name: "Hirion Stamina System",
    version: 1.0,
  };

  //=============================================================================
  // * Plugin parameters
  //=============================================================================
  // Stamina parameters
  HirionSystem.Stamina.Switch = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Enable Switch", "Number");
  HirionSystem.Stamina.Debug = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Stamina Debug", "Boolean");
  HirionSystem.Stamina.Init = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Stamina Initial", "Number");
  HirionSystem.Stamina.Max = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Stamina Max", "Number");
  HirionSystem.Stamina.RecAmount = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Recover Amount", "String");
  HirionSystem.Stamina.DecAmount = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Decrease Amount", "Number");
  HirionSystem.Stamina.SwimAmount = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Decrease Amount Swimming", "Number");
  HirionSystem.Stamina.Rate = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Recover Rate", "Number");
  HirionSystem.Stamina.Time = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Recover Time", "Number");
  HirionSystem.Stamina.Balloon = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Balloon", "Number");

  // Hud parameters
  HirionSystem.Stamina.HudSwitch = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Switch", "Number");
  HirionSystem.Stamina.HudFade = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Fade", "Boolean");
  HirionSystem.Stamina.FontName = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Font Name", "String");
  HirionSystem.Stamina.FontSize = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Font Size", "Number");
  HirionSystem.Stamina.GaugeEnabled = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Gauge Enabled", "Boolean");
  HirionSystem.Stamina.GaugeType = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Gauge Type", "String");
  HirionSystem.Stamina.GaugeBack = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Back Gauge", "String");
  HirionSystem.Stamina.GaugeFront = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Front Gauge", "String");
  HirionSystem.Stamina.HudTitle = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Title", "String");
  HirionSystem.Stamina.HudValue = HirionSystem.parameter(HirionSystem.Stamina.name, "Hirion_Stamina", "Hud Value", "String");

  //=============================================================================
  // * Define aliases.
  //=============================================================================
  let _Hirion_Stamina_Game_Player_initMembers = Game_Player.prototype.initMembers;
  let _Hirion_Stamina_Game_Player_isDashing = Game_Player.prototype.isDashing;
  let _Hirion_Stamina_Game_Player_updDashing = Game_Player.prototype.updateDashing;
  let _Hirion_Stamina_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  let _Hirion_Stamina_Game_Map_Refresh = Game_Map.prototype.refresh;
  let _Hirion_Stamina_Game_Party_consumeItem = Game_Party.prototype.consumeItem;
  let _Hirion_Stamina_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  let _Hirion_Stamina_Scene_Map_terminate = Scene_Map.prototype.terminate;

  //=============================================================================
  // * Game_Player
  //=============================================================================
  Game_Player.prototype.initMembers = function() {
      // Function setup stamina parameters.
      // Define stamina properties and link stamina values to the variables ingame.
      _Hirion_Stamina_Game_Player_initMembers.call(this);
      $gameVariables.setValue(HirionSystem.Stamina.Init, 200);
      $gameVariables.setValue(HirionSystem.Stamina.Max, 200);
      this._stamina_switch = HirionSystem.Stamina.Switch;
      this._stamina = $gameVariables.value(HirionSystem.Stamina.Init);
      this._stamina_max = $gameVariables.value(HirionSystem.Stamina.Max);
      this._stamina_rec_amount = eval(HirionSystem.Stamina.RecAmount);
      this._stamina_dec_amount = HirionSystem.Stamina.DecAmount;
      this._stamina_swim_amount = HirionSystem.Stamina.SwimAmount;
      this._stamina_rate = HirionSystem.Stamina.Rate;
      this._stamina_time = HirionSystem.Stamina.Time * 60;
      this._stamina_balloon = false;
      this._stamina_tmp_rate = 0;
  };

  Game_Player.prototype.isStaminaEnabled = function() {
    // Function to check if stamina switch is enabled.
    return this._stamina_switch === 0;
    return $gameSwitches.value(this._stamina_switch);
  };

  Game_Player.prototype.updateDashing = function() {
    // Function to update dashing.
    if (this.isStaminaEnabled()) {
      if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        if (this._stamina <= 0) {
          this._dashing = false;
        }
      } else {
        _Hirion_Stamina_Game_Player_updDashing.call(this);
      }
    } 
  };  

  Game_Player.prototype.staminaChange = function(value) {
    // Function to gain/lose stamina. Can't be less then 0 or more then max stamina max value.
    $gameVariables.setValue(HirionSystem.Stamina.Init, (this._stamina + value).clamp(0, this._stamina_max));
  };

  Game_Player.prototype.staminaMax = function(value) {
    // Function to gain/lose max stamina.
    $gameVariables.setValue(HirionSystem.Stamina.Max, (this._stamina_max + value).clamp(this._stamina_max, 99999));
  };

  Game_Player.prototype.staminaRecover = function() {
    // Function to recover stamina based on stamina time.
    if (this._stamina < this._stamina_max) {
      this._stamina_tmp_rate += this._stamina_rate;
      if (this._stamina_tmp_rate >= this._stamina_time) {
        // Reset stamina balloon on player.
        if (HirionSystem.getPctA(this._stamina, this._stamina_max, 10)) {
          this._stamina_balloon = false;
        }
        this.staminaChange(this._stamina_rec_amount);
        this._stamina_tmp_rate = 0;
      }
    }
  };

  Game_Player.prototype.moveByInput = function() {
      // Function when player move. Check if dashing and decrease stamina and if not recover instead.
      _Hirion_Stamina_Game_Player_moveByInput.call(this);
      //console.log(this._dashing);
      if (this.isStaminaEnabled() && this.canMove()) {
        // Decrease stamina if player is dashing.
        if (this.isMoving() && this._dashing && this.isMovementSucceeded()) {
          HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, this._stamina + "/" + this._stamina_max + " stamina lost.");
          this.staminaChange(-this._stamina_dec_amount);
          this._stamina_tmp_rate = 0;
        }
        // Recover stamina if player have stopped moving and been idle long time enough to recover.
        if (this.isStopping())  {
          HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, this._stamina + "/" + this._stamina_max + " stamina recovered.");
          this.staminaRecover();
        }
        // Decrease stamina if swimming. This decreases more stamina. (If Hirion Swim system installed)
        if (HirionSystem.Swim) {
          if (this.isMoving() && this._hirionPlayerEffectSwim) {
            HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, this._stamina + " stamina lost. (swimming)");
            this.staminaChange(-this._stamina_swim_amount);
          }
        }
        // Display stamina balloon on player.
        if (HirionSystem.Stamina.Balloon > 0) {
            if (!this._stamina_balloon) {
              if (HirionSystem.getPctB(this._stamina, this._stamina_max, 10)) {
                HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Stamina balloon id: " + HirionSystem.Stamina.Balloon);
                $gamePlayer.requestBalloon(HirionSystem.Stamina.Balloon);
                this._stamina_balloon = true;
              }
            }
        }
      }
  };

  //=============================================================================
  // * Game_Party
  //=============================================================================
  Game_Party.prototype.consumeItem = function(item) {
    // Function to consume a item.
    if (DataManager.isItem(item) && item.consumable && item.meta['Stamina']) {
      HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Recover " + Number(item.meta['Stamina']) + " stamina from item id: " + item.id);
      $gamePlayer.staminaChange(Number(item.meta['Stamina']));
    }
    if (DataManager.isItem(item) && item.consumable && item.meta['Max Stamina']) {
      HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Recover " + Number(item.meta['Max Stamina']) + " max stamina from item id: " + item.id);
      $gamePlayer.staminaMax(Number(item.meta['Max Stamina']));
    }
    _Hirion_Stamina_Game_Party_consumeItem.call(this, item);
  };

  //=============================================================================
  // * Game_Map
  //=============================================================================
  Game_Map.prototype.refresh = function() {
    // Function to refresh the map.
    HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Request refresh");
    // Keep track on stamina variables.
    $gamePlayer._stamina = $gameVariables.value(HirionSystem.Stamina.Init);
    $gamePlayer._stamina_max = $gameVariables.value(HirionSystem.Stamina.Max);
    _Hirion_Stamina_Game_Map_Refresh.call(this);
  };

  //=============================================================================
  // * Window_Stamina
  //=============================================================================

  function Window_Stamina() {
    this.initialize.apply(this, arguments);
  }

  Window_Stamina.prototype = Object.create(Window_Base.prototype);
  Window_Stamina.prototype.constructor = Window_Stamina;

  Window_Stamina.prototype.initialize = function() {
    // Function to initialize Stamina window.
    let wx = 10;
    let ww = (Graphics.boxWidth + this.standardPadding() * 4) / 7;
    let wh = this.fittingHeight(1);
    let wy = 0;
    Window_Base.prototype.initialize.call(this, wx, wy, ww, wh);
    this.opacity = 0;
    this._stamina = $gamePlayer._stamina;
    this._stamina_max = $gamePlayer._stamina_max;
    this._stamina_rate = HirionSystem.Stamina.Rate;
    this._stamina_time = HirionSystem.Stamina.Time * 60;
    this._staminaFadeEnabled = HirionSystem.Stamina.HudFade;
    this._staminaFade = true;
    this._staminaFadeDelay = 120;
    this.drawStamina();
    HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Stamina HUD enabled!");
  };

  Window_Stamina.prototype.drawStamina = function() {
    // Function to draw stamina text and bar for hud window.
    this.contents.clear();
    if (HirionSystem.Stamina.GaugeEnabled) this.drawStaminaBar();
    this.drawStaminaText();
  };

  Window_Stamina.prototype.drawStaminaBar = function() {
    // Function to draw stamina gauge bar based on selected type.
    // Type normal: Bitmap gauge type.
    if (HirionSystem.Stamina.GaugeType === "Normal") { 
      this.drawGauge(4, -12, 154, this._stamina / $gamePlayer._stamina_max, '#08772b', '#aee2bf');
    }
    // Type custom: Custom graphics.
    if (HirionSystem.Stamina.GaugeType === "Custom") { 
      this._gfx = HirionSystem.Stamina.GaugeBack;
      this._gfx2 = HirionSystem.Stamina.GaugeFront;
      this._staminabar_back = this.createGauge(this._gfx, 20, 21, 160, 20);
      this._staminabar_front = this.createGauge(this._gfx2, 20, 20, 160, 20);
      this._meter_rate = this._staminabar_front.width * this._stamina / $gamePlayer._stamina_max;
      this._staminabar_front.setFrame(0,0, this._meter_rate, this._staminabar_front.height);
    }
  };

  Window_Stamina.prototype.createGauge = function(gfx, x, y, width, height) {
    // Function to create stamina gauge.
    let sprite = new Sprite(ImageManager.loadBitmap('img/' + gfx.split('/')[1] + '/', gfx.split('/')[2], 0, true));
    sprite.x = x;
    sprite.y = y;
    sprite.width = width;
    sprite.height = height;
    this.addChild(sprite);
    return sprite; 
  }

  Window_Stamina.prototype.drawStaminaText = function() {
    // Function to draw stamina text if set.
    this._backBitmap = new Bitmap(this.width, this.height);
    this._backSprite = new Sprite();
    this._backSprite.x = 0;
    this._backSprite.y = 0;
    this._backSprite.bitmap = this._backBitmap;
    this._backSprite.bitmap.outlineWidth = 2;
    this._backSprite.bitmap.fontName = HirionSystem.Stamina.FontName;
    this._backSprite.bitmap.fontSize = HirionSystem.Stamina.FontSize;
    if (HirionSystem.Stamina.HudTitle !== "null") this._backSprite.bitmap.drawText(HirionSystem.Stamina.HudTitle, 26, -6, this.width, this.height, 'left');
    if (HirionSystem.Stamina.HudValue !== "null") this._backSprite.bitmap.drawText(eval(HirionSystem.Stamina.HudValue), -20, -6, this.width, this.height, 'right');
    this.addChild(this._backSprite);
  };

  Window_Stamina.prototype.update = function() {
    // Function to update Stamina window.
    // Update should only occur if current stamina is lower then max stamina.
    Window_Base.prototype.update.call(this);
    if ($gamePlayer._stamina < $gamePlayer._stamina_max) {
      this.updateStamina(this._stamina_time);
    }
    if (this._staminaFadeEnabled) {
      this._staminaFadeDelay -= 1;
      this.updateStaminaFadeTrigger(this._staminaFadeDelay);
    }
  };

  Window_Stamina.prototype.updateStamina = function(amount) {
    // Function to update stamina window.
    let sta = this;
    let updStamina = setInterval(function() {
      amount -= 2;
      if (amount <= 0 && sta._stamina !== $gamePlayer._stamina) {
        sta._stamina = sta._stamina <= $gamePlayer._stamina ? sta._stamina += sta._stamina_rate : sta._stamina -= sta._stamina_rate;
        sta.refreshStaminaBar();
        sta.refreshStaminaText();
        clearInterval(updStamina);
      }
    }, this.__stamina_time / 2);
  };

  Window_Stamina.prototype.updateStaminaFadeTrigger = function(amount) {
    // Function to fade out hud.
    let sta = this;
    let updStaminaAnimOut = setTimeout(function() {
      if (amount <= 0 && sta._staminaFade) {
        if (sta._stamina === $gamePlayer._stamina_max) {
          HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Fade out.");
          sta._staminabar_back.opacity -= 20;
          sta._staminabar_front.opacity -= 20;
          sta._backSprite.opacity -= 20; 
          if (sta._staminabar_front.opacity <= 0) {
            sta._staminaFade = false;
            sta._staminaFadeDelay = 180; // 3 seconds.
          }
        }
      } else {
        if (sta._stamina < $gamePlayer._stamina_max) {
          HirionSystem.log(HirionSystem.Stamina.name, HirionSystem.Stamina.Debug, "Fade in.");
          sta._staminabar_back.opacity += 20;
          sta._staminabar_front.opacity += 20;
          sta._backSprite.opacity += 20; 
          if (sta._staminabar_front.opacity >= 255) {
            sta._staminaFade = true;
            sta._staminaFadeDelay = 180; // 3 seconds.
          }
        }
      }
      clearTimeout(updStaminaAnimOut);
    }, 100);
  };

  Window_Stamina.prototype.refreshStaminaBar = function() {
    // Function to refresh stamina bar.
    this._meter_rate = this._staminabar_front.bitmap.width * this._stamina / $gamePlayer._stamina_max;
    this._staminabar_front.setFrame(0,0, this._meter_rate, this._staminabar_front.bitmap.height);
  };

  Window_Stamina.prototype.refreshStaminaText = function() {
    // Function to refresh stamina text values.
    this._backSprite.bitmap.clear();
    if (HirionSystem.Stamina.HudTitle !== "null") this._backSprite.bitmap.drawText(HirionSystem.Stamina.HudTitle, 26, -6, this.width, this.height, 'left');
    if (HirionSystem.Stamina.HudValue !== "null") this._backSprite.bitmap.drawText(eval(HirionSystem.Stamina.HudValue), -20, -6, this.width, this.height, 'right');
  };

  //=============================================================================
  // * Scene_Map
  //=============================================================================
  Scene_Map.prototype.createAllWindows = function() {
    // Function to create all windows for scene map. New window is created called Window Stamina.
    _Hirion_Stamina_Scene_Map_createAllWindows.call(this);
    if (!$gameSwitches.value(HirionSystem.Stamina.HudSwitch)) {
      this._staminaWindow = new Window_Stamina();
      this.addChild(this._staminaWindow);
    }
  };


})();