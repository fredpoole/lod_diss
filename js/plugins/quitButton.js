// Quit Button for Title Menu
// by orlando (rpgmakerweb.com forums)
// Date: 11/22/2015
//=============================================================================
/*:
* @plugindesc Adds a quit button to the title menu. This makes it more obvious how to leave the game.
* @author orlando (rpgmakerweb.com forums)
*/
(function() {
if (Utils.isNwjs()) {
if (!Utils.isMobileDevice()) {
// Add quit button to the menu button listing:
if (typeof(Window_TitleCommand.prototype._quitbuttonreplace_old_makeCommandList) == "undefined") {
Window_TitleCommand.prototype._quitbuttonreplace_old_makeCommandList =
Window_TitleCommand.prototype.makeCommandList;
}
Window_TitleCommand.prototype.makeCommandList = function() {
this._quitbuttonreplace_old_makeCommandList();
this.addCommand("Quit Game", 'quit');
}
// Add quit handler to scene code constructing the menu:
Scene_Title.prototype.commandQuit = function() {
this._commandWindow.close();
var gui = require('nw.gui');
var win = gui.Window.get();
win.close();
};

if (typeof(Scene_Title.prototype._quitbuttonreplace_old_createCommandWindow) == "undefined") {

Scene_Title.prototype._quitbuttonreplace_old_createCommandWindow =
Scene_Title.prototype.createCommandWindow;
}
Scene_Title.prototype.createCommandWindow = function() {
this._quitbuttonreplace_old_createCommandWindow();
this._commandWindow.setHandler('quit', this.commandQuit.bind(this));
}
}
}
})();
