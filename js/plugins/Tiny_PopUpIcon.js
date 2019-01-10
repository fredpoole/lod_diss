/*
 *=============================================================================
 * Tinys Pop Up Icon MV Version
 *  By TinyMine / Philipp Brede
 *  Tiny_PopUpIcon.js
 *  Version: 1.1
 *  Free for commercial and non commercial use.
 *=============================================================================
 */
/*:
 * @help
 *=============================================================================
 *  Bugs, Ideas, Requests?...
 *  ...contact TinyMine in rpgmakerweb.com
 *=============================================================================
 *                                   Plugin Commands
 *=============================================================================
 *  
 *     █ PopUp Icon characterId iconIndex text amount [waitForEnd]
 * 
 *          Help:
 *                  characterId  = eventID to occur on (0 for event where it was 
 *                                 called, -1 for player)
 *                  iconIndex    = icon number you want to show
 *                  text         = the name you wanna pass to be displayed as text
 *                  amount       = if you put 0 it will not be shown. But it will
 *                                 be displayed when going above 0.
 *                  waitForEnd   = either 0 or 1, where 1 is wait for end before 
 *                                 continuing with further event code [optional]
 *          Example:
 *              PopUp Icon 0 12 Potion 2 1
 *                  Icon 12 will be shown above the event where it was called with 
 *                  the text Potion and the amount x2. Furthermore event will wait 
 *                  until popup has finished.
 * 
 *=============================================================================
 * @plugindesc This lets you pop up icons like you can do with balloons and such.
 *
 * @author TinyMine / Philipp Brede
 * 
 * @param General Settings
 * @desc No Use; Following Paramates regard general settings.
 * @default 
 *
 * @param Auto PopUp
 * @desc Everytime the player receives an item it will be shown as a pop up. On or Off
 * @default On
 *
 * @param Time
 * @desc Defines the time the icon will be shown in frames. 0-999
 * @default 60
 *
 * @param IconSet Name
 * @desc The graphic name this plugin should use in your system folder.
 * @default IconSet
 *
 * @param Sound Settings
 * @desc Activate Sound when displaying icons? On or Off
 * @default On
 *
 * @param Sound
 * @desc The sound that plays whenever you pop up an icon. 
 * @default Jump1
 * 
 * @param Volume
 * @desc The volume of the sound that will play. 0-100
 * @default 100
 * 
 * @param Pitch
 * @desc The pitch of the sound that will play. 50-150
 * @default 100
 * 
 * @param Advanced Settings
 * @desc No Use; Following Paramates regard advanced settings.
 * @default 
 *
 * @param Icon Collums
 * @desc How many collums your IconSet has?
 * @default 16
 *
 * @param Icon Width
 * @desc Which width each icon has in your iconset in pixels.
 * @default 32
 *
 * @param Icon Height
 * @desc Which height each icon has in your iconset in pixels.
 * @default 32
 *
 * @param Icon Offset Y
 * @desc Define the offset y position of the icon that will popup;
 * @default -16
 *
 * @param Text Offset Y
 * @desc Define the offset y position of the text that will popup;
 * @default -8
 *
 * @param Text Size
 * @desc Define fontsize of the text that will popup;
 * @default 14
 *
 *=============================================================================
 */
(function () {
    var _usedParams = {}
    //Initializing variables to parameter values
    var parameters = PluginManager.parameters('Tiny_PopUpIcon');
    _usedParams['auto_pop'] = String(parameters['Auto PopUp']);
    _usedParams['time'] = Number(parameters['Time'] || 30);
    _usedParams['icon_png'] = String(parameters['IconSet Name'] || 'IconSet');
    _usedParams['sound_on'] = String(parameters['Sound Settings']);
    _usedParams['sound'] = String(parameters['Sound'] || 'Jump1');
    _usedParams['volume'] = Number(parameters['Volume'] || 100);
    _usedParams['pitch'] = Number(parameters['Pitch'] || 100);
    _usedParams['collums'] = Number(parameters['Icon Collums'] || 16);
    _usedParams['icon_width'] = Number(parameters['Icon Width'] || 32);
    _usedParams['icon_height'] = Number(parameters['Icon Height'] || 32);
    _usedParams['icon_y'] = Number(parameters['Icon Offset Y'] || -16);
    _usedParams['text_y'] = Number(parameters['Text Offset Y'] || -8);
    _usedParams['text_size'] = Number(parameters['Text Size'] || 14);
    //-------------------------------------------------------------------------
    // OLD Game_Interpreter
    //  Modified:
    //      - pluginCommand
    //      - updateWaitMode
    var oldGI_pluginCommand_Tiny_PUI = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        oldGI_pluginCommand_Tiny_PUI.call(this, command, args);
        if (command === 'PopUp') {
            if (args[0] === 'Icon') {
                this._character = this.character(args[1]);
                if (this._character) {
                    var itemScheme = {};
                    itemScheme.iconIndex = args[2];
                    itemScheme.name = args[3];
                    this._character.requestPopUp(itemScheme, args[4]);
                    if (args[3] === '1') {
                        this.setWaitMode('popicon');
                    }
                }
                return true;
            }
        }
    };
    var oldGI_updateWaitMode_Tiny_PUI = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        var waiting = false;
        if (this._waitMode === 'popicon') {
            waiting = this._character.isPopUpPlaying();
        }
        if (waiting) {
            return waiting;
        }
        else {
            return oldGI_updateWaitMode_Tiny_PUI.call(this);
        }
    };
    //-------------------------------------------------------------------------
    // OLD Game_Party
    //  Modified:
    //      - gainItem
    var oldGP_gainItem_Tiny_PUI = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
        if (_usedParams['auto_pop'] === 'On') {
            var container = this.itemContainer(item);
            if (container) {
                $gamePlayer.requestPopUp(item, amount);
            }
        }
        oldGP_gainItem_Tiny_PUI.call(this, item, amount, includeEquip);
    };
    //-------------------------------------------------------------------------
    // OLD Game_CharacterBase
    //  Modified:
    //      - initMembers
    //  Added:
    //      - startPopUp
    //      - isPopUpPlaying
    //      - endPopUp
    //      - requestPopUp
    var oldGCB_initMembers_Tiny_PUI = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function () {
        oldGCB_initMembers_Tiny_PUI.call(this);
        this._requestedPopUps = []
        this._popUpPlaying = false;
    };
    Game_CharacterBase.prototype.startPopUp = function () {
        this._requestedPopUps.pop();
        this._popUpPlaying = true;
    };
    Game_CharacterBase.prototype.isPopUpPlaying = function () {
        return this._requestedPopUps.length > 0 || this._popUpPlaying;
    };
    Game_CharacterBase.prototype.endPopUp = function () {
        this._popUpPlaying = false;
    };
    Game_CharacterBase.prototype.requestPopUp = function (item, amount) {
        var popUp = {};
        popUp.item = item;
        popUp.amount = amount;
        this._requestedPopUps.push(popUp);
    };
    Game_CharacterBase.prototype.popUpIndex = function () {
        if (this._requestedPopUps.length > 0) {
            return this.popUpItem().iconIndex;
        }
        return 0;
    };
    Game_CharacterBase.prototype.popUpItem = function () {
        if (this._requestedPopUps.length > 0) {
            var last = this._requestedPopUps.length - 1;
            return this._requestedPopUps[last].item;
        }
        return null;
    };
    Game_CharacterBase.prototype.popUpAmount = function () {
        if (this._requestedPopUps.length > 0) {
            var last = this._requestedPopUps.length - 1;
            return this._requestedPopUps[last].amount;
        }
        return 0;
    };
    //-------------------------------------------------------------------------
    // OLD Sprite_Character
    //  Modified:
    //      - updateAnimation
    //  Added:
    //      - setupPopUp
    //      - startPopUp
    //      - updatePopUp
    //      - endPopUp
    //      - isPopUpPlaying
    var oldSC_updateAnimation_Tiny_PUI = Sprite_Character.prototype.updateAnimation;
    Sprite_Character.prototype.updateAnimation = function () {
        oldSC_updateAnimation_Tiny_PUI.call(this);
        if (!this.isPopUpPlaying()) {
            this._character.endPopUp();
        }
    };
    Sprite_Character.prototype.setupPopUp = function () {
        if (this._character.popUpIndex() > 0 && !this.isPopUpPlaying()) {
            this.startPopUp();
            this._character.startPopUp();
        }
    };
    Sprite_Character.prototype.startPopUp = function () {
        if (!this._popUpSprite) {
            this._popUpSprite = new Sprite_PopUpIcon();
            this._popUpWindow = new Sprite_PopUpText();
        }
        this._popUpSprite.setup(this._character.popUpItem(), this._character.popUpAmount());
        this._popUpWindow.setup(this._character.popUpItem(), this._character.popUpAmount());
        this.parent.addChild(this._popUpSprite);
        this.parent.addChild(this._popUpWindow);
        if (_usedParams['sound_on'] === 'On') {
            var sePlay = {};
            sePlay.name = _usedParams['sound'];
            sePlay.pitch = _usedParams['pitch'];
            sePlay.volume = _usedParams['volume'];
            sePlay.pan = 0;
            AudioManager.playSe(sePlay);
        }
    };
    Sprite_Character.prototype.updatePopUp = function () {
        this.setupPopUp();
        if (this._popUpSprite) {
            this._popUpSprite.x = this.x;
            this._popUpSprite.y = this.y - this.height + _usedParams['icon_y'];
            this._popUpWindow.x = this.x;
            this._popUpWindow.y = this.y - this.height + _usedParams['text_y'];
            if (!this._popUpSprite.isPlaying()) {
                this.endPopUp();
            }
        }
    };
    Sprite_Character.prototype.endPopUp = function () {
        if (this._popUpSprite) {
            this.parent.removeChild(this._popUpSprite);
            this.parent.removeChild(this._popUpWindow);
            this._popUpSprite = null;
            this._popUpWindow = null;
        }
    };
    Sprite_Character.prototype.isPopUpPlaying = function () {
        return !!this._popUpSprite;
    };
    var oldSC_update_Tiny_PUI = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        oldSC_update_Tiny_PUI.call(this);
        this.updatePopUp();
    };
    //-------------------------------------------------------------------------
    // NEW Sprite_PopUpText
    //
    // The sprite for displaying popping up text.
    function Sprite_PopUpText() {
        this.initialize.apply(this, arguments);
    }
    //
    Sprite_PopUpText.prototype = Object.create(Sprite.prototype);
    Sprite_PopUpText.prototype.constructor = Sprite_PopUpText;
    //
    Sprite_PopUpText.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };
    Sprite_PopUpText.prototype.initMembers = function () {
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.z = 7;
    };
    Sprite_PopUpText.prototype.loadBitmap = function () {
        this.bitmap = new Bitmap(200, 200);
        this.bitmap.fontSize = _usedParams['text_size'];
        this.setFrame(0, 0, 200, 200);
    };
    Sprite_PopUpText.prototype.setup = function (popUpItem, amount) {
        this._duration = this.waitTime();
        this.scale.set(0, 0);
		var amountText = "";
		if (amount > 0) amountText = " x" + amount;
        this.bitmap.drawText(popUpItem.name + amountText, 0, 0, 200, 200, 'center');
    };
    Sprite_PopUpText.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updateMovement();
            }
        }
    };
    Sprite_PopUpText.prototype.waitTime = function () {
        return _usedParams['time'];
    };
    Sprite_PopUpText.prototype.updateMovement = function () {
        var g = 1.0 / (this.waitTime() / 2) + this.scale.x;
        var n = Math.min(g, 1.0);
        this.scale.set(n, n);
    };
    //-------------------------------------------------------------------------
    // NEW Sprite_PopUpIcon
    //
    // The sprite for displaying popping up icons.
    function Sprite_PopUpIcon() {
        this.initialize.apply(this, arguments);
    }
    //
    Sprite_PopUpIcon.prototype = Object.create(Sprite_Base.prototype);
    Sprite_PopUpIcon.prototype.constructor = Sprite_PopUpIcon;
    //
    Sprite_PopUpIcon.prototype.initialize = function () {
        Sprite_Base.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };
    Sprite_PopUpIcon.prototype.initMembers = function () {
        this._popUpIndex = 0;
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    };
    Sprite_PopUpIcon.prototype.loadBitmap = function () {
        this.bitmap = ImageManager.loadSystem(_usedParams['icon_png']);
        this.setFrame(0, 0, 0, 0);
    };
    Sprite_PopUpIcon.prototype.setup = function (popUpItem, amount) {
        this._popUpIndex = popUpItem.iconIndex;
        this._duration = this.waitTime();
        this.scale.set(0, 0);
        this.updateFrame();
    };
    Sprite_PopUpIcon.prototype.update = function () {
        Sprite_Base.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updateMovement();
            }
        }
    };
    Sprite_PopUpIcon.prototype.updateMovement = function () {
        var g = 1.0 / (this.waitTime() / 2) + this.scale.x;
        var n = Math.min(g, 1.0);
        this.scale.set(n, n);
    };
    Sprite_PopUpIcon.prototype.updateFrame = function () {
        var pw = _usedParams['icon_width'];
        var ph = _usedParams['icon_height'];
        var sx = this._popUpIndex % _usedParams['collums'] * pw;
        var sy = Math.floor(this._popUpIndex / _usedParams['collums']) * ph;
        this.setFrame(sx, sy, pw, ph);
    };
    Sprite_PopUpIcon.prototype.waitTime = function () {
        return _usedParams['time'];
    };
    Sprite_PopUpIcon.prototype.isPlaying = function () {
        return this._duration > 0;
    };
})();
