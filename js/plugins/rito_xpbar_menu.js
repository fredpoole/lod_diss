//=============================================================================
// Rito_XPBar_Menu.js
//=============================================================================
var Imported = Imported || {};
Imported.Rito_XPBar_Menu = true;
var Rito = Rito || {}; 

/*:
 * @plugindesc Version 1.02
 * Generation an Experience Jauge in menu for each actor.
 * @author Rito
 *
 * @help Please credit me. Usage for commercial/free game.
 *
 *
 * @param Color 1
 * @desc Change the color jauge in the left.
 * Default : #009700
 * @default #009700
 *
 * @param Color 2
 * @desc Change the color jauge in the right.
 * Default : #00FF00
 * @default #00FF00
 *
 * @param Width
 * @desc Choice the wight to Exp Jauge.
 * Default : 674 for resolution 1280*720.
 * @default 674
 *
 * @param X Position
 * @desc Change the position X of the Exp Jauge.
 * Default : 318 for resolution 1280*720.
 * @default 318
 *
 * @param Line Height
 * @desc Choice the line of Exp Jauge (similar of Y Pos)
 * Default : 3
 * @default 3
 *
 * @param Show Required Exp / Max Lvl
 * @desc Show the required Experience / max lvl text. (True / False)
 * Default : True
 * @default True
 *
 * @param Max Level Text
 * @desc Displays the following message if the character reaches maximum level - Default : Max lvl
 * @default Max lvl
 */
var parameters = PluginManager.parameters('Rito_XPBar_Menu');

Rito.Param = Rito.Param || {};

Rito.Param.lineHeight = Number(parameters['Line Height'] || 3);
Rito.Param.color1 = String(parameters['Color 1'] || "#009700");
Rito.Param.color2 = String(parameters['Color 2'] || "#00FF00");
Rito.Param.width = Number(parameters['Width'] || 674);
Rito.Param.x = Number(parameters['X Position'] || 318);
Rito.Param.afficheTxt = String(parameters['Show Required Exp'] || "True");
Rito.Param.TxtLvlMax = String(parameters['Max Level Text'] || "Max Lvl");

if (Rito.Param.lineHeight == 3){
	if (Yanfly.Param.WindowPadding == undefined) { Yanfly.Param.WindowPadding = 18 } //Default variable
	Window_SkillStatus.prototype.refresh = function() {
		this.contents.clear();
		if (this._actor) {
			var w = this.width - this.padding * 2;
			var h = this.height - this.padding * 2;
				if (!eval(true)) {
					var y = h / 2 - this.lineHeight() * 1.5;
				} else {
					var y = 0;
				}
				var xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
        var width = w - xpad - this.textPadding();
        this.drawActorFace(this._actor, 0, 0, Window_Base._faceWidth, h);
        this.drawActorSimpleStatus(this._actor, xpad, y, width);
    }
};
}

var _alias_DrawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;
Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        _alias_DrawActorSimpleStatus.call(this,actor,x,y,width);
        this.drawActorExp(actor, x, y + this.lineHeight() * Rito.Param.lineHeight);
};

Window_Base.prototype.drawExpBar = function(Txt, x, y, width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('00000000000000000000');
    var slashWidth = "";
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x) {
        this.changeTextColor(color1);
        this.changeTextColor(color2);
        this.drawText('/', x2, y, "", 'right');
        this.drawText(Txt, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
    }
};

Window_Base.prototype.drawActorExp = function(actor, x, y, width) {
	if (Rito.Param.afficheTxt == "True") { 
		showTxt = actor.nextRequiredExp();
		} else {
		showTxt = "";
	}
	
	width = Rito.Param.width;
	x = Rito.Param.x;
    var color1 = Rito.Param.color1;
    var color2 = Rito.Param.color2;

	var exp = actor.currentExp() - actor.expForLevel(actor._level);
	var Exp_suivant = actor.expForLevel(actor._level + 1) - actor.expForLevel(actor._level);

	var exp_rate = (exp / Exp_suivant);

	if (actor._level == actor.maxLevel()) {
		if (Rito.Param.afficheTxt == "True") { 
			showTxt = Rito.Param.TxtLvlMax
			} else {
			showTxt = "";
		}
	exp_rate = 1
	}
    this.drawGauge(x, y, width, exp_rate, color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.expA, x, y, 44);
    this.drawExpBar(showTxt, x, y, width, this.mpColor(actor), this.normalColor()); 
};