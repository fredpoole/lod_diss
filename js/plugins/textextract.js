 //=============================================================================
 // Plugin: External Text
 // Author: Zalerinian
 // Version: 1.0.0
 // License: http://creativecommons.org/licenses/by/4.0/
 //=============================================================================

 /*:
  * @plugindesc Use external files to load all the text in your game! Convenient for multi-language support!
  * @author Zalerinian
  *
  * @param Text File
  * @desc The default text file to load into the game.
  * Default: text_en.json
  * @default text_en.json
  *
  * @param Face File
  * @desc The defaul file to load for predefined faces. This file should be in the text folder. Default: faces.json
  * @default faces.json
  *
  * @param Text Folder
  * @desc The folder to keep your text file(s). Make sure this folder exists! Default: data/text/
  * @default data/text/
  *
  * @param Autofit Text
  * @desc Automatically resize text to fit on the screen.
  * @default true
  *
  * @param Remember Color
  * @desc Remember the last text color used in a conversation, in case the line wrapping puts it on a new page.
  * @default true
  *
  * @param Enable Name Window
  * @desc Enable or disable the nameox from being created. Set this to false if you don't intend to use the namebox.
  * @default true
  *
  * @param Name Window Margin
  * @desc Code that returns the number of pixels there should be between the name window and side of the game screen.
  * @default return Graphics.width / 5 - this.width / 2
  *
  * @help
  * =============================================================================
  *    Dependencies
  * =============================================================================
  *
  * This plugin requires the MVCommons community core plugin, version 1.0.3 or
  * above.
  *
  * =============================================================================
  *    Introduction
  * =============================================================================
  *
  * The external text script will allow you to take all the text outside of the
  * game editor, and put it in a nicely-formatted JSON file. To learn more about
  * the JSON format, online resources are available to show how to use it. For
  * example, https://en.wikipedia.org/wiki/JSON#Samples
  *
  * This plugin is an MV edition of Enelvon's popular External Text script for
  * RPG Maker VX Ace.
  *
  * =============================================================================
  *    Using faces
  * =============================================================================
  *
  * The External text plugin allows you to define a face to use with each bit of
  * text. In text file, in the key you wish to set up, simply add a "face"
  * section, with a set of curly braces( {} ) as the value. Inside these curly
  * braces, you must define the type (actor, party, or predefined), the ID for
  * the selected types (Actor and Party must be numbers, predefined depends on
  * they key set in the faces file). The ID for Actor and Party starts at 1.
  * Additionally, you must also supply an index used to determine which face in
  * the faceset to use. Indexes range from 0-7.
  *
  * =============================================================================
  *    Controlling the window
  * =============================================================================
  *
  * In order to control the position and appearance of the text window, you need
  * to add a "window" section. In this section, you can define values for the
  * "background" and "position" fields. The values for these are the same as
  * those you would set in the editor.
  *
  * For example, "background" can be set to "dim" or "transparent" for the black
  * background, or no background respectively. Any other values will result in
  * the window looking like a regular window. The values are case-insensitive.
  *
  * =============================================================================
  *    Plugin Commands
  * =============================================================================
  *
  * External Text provides the user with a few plugin commands to use. All
  * commands must begin with ExternalText (case-insensitive), and may contain an
  * underscore (_) or hyphen (-) between the words, if you wish. They are
  * optional.
  *
  * External Text has 3 plugin commands, show, load text, and load face.
  *
  * "show" will display the text and apply all properties of the text key that
  * follows it. Text keys CAN have spaces in them.
  *
  * "load text" is used to change the text file of the game in an event. The
  * text file's name should come after "text", and may contain spaces. The
  * .json file extension is optional.
  *
  * "load face" is used to change the face file of the game in an event. The
  * face file's name should come after "face", and may contain spaces. The
  * .json file extension is optional.
  *
  * =============================================================================
  *    Additional Inputs
  * =============================================================================
  *
  * Because the full effects of the External Text script, to control faces,
  * position, and appearance, all come from a plugin command or call, the plugin
  * also includes controls for choice input, number input, and item selection.
  *
  * =============================================================================
  *    Setting up the choice window
  * =============================================================================
  *
  * To use a choice window with a text key, the first step is to add a "choice"
  * field to your text file. This will hold the settings for the choice window.
  * The choice window supports the same values for "background" and "position"
  * that the regular window has. In addition, the choice window requires at
  * least "choice" and "variable" properties, with optional "default" and
  * "cancel" properties to define which what the default selection is, and what
  * happens if the user cancels the selection.
  *
  * The "variable" property for the message refers to a variable that will
  * hold the index of the selected choice. Indexes start at 0, and range to
  * <number of choices> - 1. Keep in mind that the first option is choice 0,
  * indexes go up from there!
  *
  * Because the choice input is not set up directly in the editor, this variable
  * must be used in conditional branches so that you can perform different
  * actions based on the selected choice.
  *
  * The "choice" property should be an array of string values, holding the
  * text for each choice. By default, RPG Maker MV only supports 6 choices in a
  * choice selection. With External Text, however, there is no limit to the
  * number of choices.
  *
  * The "default" property is the index (starting at 0) that will be highlighted
  * by default.
  *
  * The "cancel" property is the index of the action to use when the selection is
  * cancelled by the player. A value of -1 will disallow the player from
  * cancelling the selection.
  *
  * If the "cancel" property is a valid value that allows the user to cancel the
  * selection (any value from 0 to the <number of choices> - 1), and the user
  * cancels the selection, this is the index that will be selected.
  *
  * =============================================================================
  *    Setting up the number input window
  * =============================================================================
  *
  * To set up a number input, the text key must have a "number" section with at
  * least a "variable" and "digits" properties. There is an optional "dvar"
  * property that may be used if the "digits" property is set to "variable"
  *
  * The "variable" property is the variable ID that will store the value of
  * the number inputted.
  *
  * The "digits" field can be either a number, representing the number of digits
  * that may be inputted, or the string "variable", indicating that the number
  * of digits to be used can be found in a variable, with the ID stored in the
  * "dvar" property.
  *
  * The "dvar" property is used when the "digits" property is set to "variable".
  * "dvar" should be a variable ID that will hold the number of digits that may
  * be inputted.
  *
  * =============================================================================
  *    Setting up the item selection window
  * =============================================================================
  *
  * Finally, the item input event command is also available. To use it, the text
  * key must have a "number" section. There is are tw0 available option
  * for the item selection command, "type", and "variable".
  *
  * The "variable" property is a variable ID that will hold the item ID, found
  * in the database, after an item is picked, or 0 if the user cancels the
  * selection.
  *
  * The "type" property is a string that may contain either "regular", "key",
  * "hidden a", or "hidden b". These are all item types that are available in the
  * engine by default. If you don't know what "hidden a" or "hidden b" are,
  * please check the engine help file, as these are new.
  *
  */



  /**
   * ==========================================================================
   *
   * Class.prototype.Function()
   *
   * @note
   *
   *
   *
   *
   *
   * ==========================================================================
   */

var Imported = Imported || {};

var Zale = Zale || {};
Zale.ExtText = Zale.ExtText || {};

(function(){
  if(Imported["MVCommons"] && PluginManager.version("MVCommons", ">=", "1.0.3")) {
    var author = [{
      email: "support@razelon.com",
      name: "Zalerinian",
      website: "http://www.razelon.com"
      }];
    var v = PluginManager.register("ExternalText", "1.0.0", PluginManager.getBasicPlugin("ExternalText").description, author, "2015-10-23", ["MVCommons"], true);
    if(v === undefined) {
      throw new Error("Unable to load ExternalText due to mising dependencies!");
    } else if (v === false){
      PluginManager.printPlugin("ExternalText")
      throw new Error("Unable to load ExternalText due to registration failure! Is there another version running?");
    }
  } else {
    SceneManager.stop();
    throw new Error("External Text requires some functionality of the MVCommons plugin!");
  }
})();

(function($){
  "use strict";

  // ==========================================================================
  //
  // Parameter Setup
  //  Sets up the parameters of the plugin and stores them in the ExtText
  //  section of the Zale object.
  //
  // ==========================================================================
  var params = PluginManager.parameters("ExtText");
  Zale.ExtText.TEXTFILE    = params["Text File"];
  Zale.ExtText.TEXTFOLDER  = params["Text Folder"];
  Zale.ExtText.FACEFILE    = params["Face File"];
  Zale.ExtText.AUTOFIT     = MVC.Boolean(params["Autofit Text"]);
  Zale.ExtText.REMCOLOR    = MVC.Boolean(params["Remember Color"])
  Zale.ExtText.NAMEENABLED = MVC.Boolean(params["Enabled Name Window"]);
  Zale.ExtText.NAMEMARGIN  = Function(params["Name Window Margin"]);
  Zale.ExtText.lastColor   = "#ffffff";


  // ==========================================================================
  //
  // String.prototype.endsWith Polyfill
  //  This block of code ensures that if the browser using this script doesn't
  //  support the .endsWith function, that it will be made compatible by
  //  adding out own implementation of the function.
  //
  // ==========================================================================
  if (!String.prototype.endsWith) {
   String.prototype.endsWith = function(searchString, position) {
       var subjectString = this.toString();
       if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
         position = subjectString.length;
       }
       position -= searchString.length;
       var lastIndex = subjectString.indexOf(searchString, position);
       return lastIndex !== -1 && lastIndex === position;
   };
  }

  /**
   * ==========================================================================
   *
   * Game_System.prototype.initialize()
   *
   * @note
   *  Sets the default text and face files, and then loads them using
   *  their respective methods.
   *
   * ==========================================================================
   */
  Zale.ExtText.GSYS_init_TEng2kfuj = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Zale.ExtText.GSYS_init_TEng2kfuj.call(this);
    this._textFile = Zale.ExtText.TEXTFILE;
    this._faceFile = Zale.ExtText.FACEFILE;
  }

  /**
    * ==========================================================================
    *
    * Game_System.prototype.textFile
    *
    * @note
    *  Defines the getters and setters for the textFile property of Game_System.
    *  This does not change the file loaded, and only the file to load when
    *  loading a save. This is called internally by TextManager.loadTextFile.
    *
    * ==========================================================================
    */
  Object.defineProperty(Game_System.prototype, "textFile", {
    get: function() {
      return this._textFile;
    },

    set: function(value) {
      this._textFile = value;
    },
    configurable: true
  });

  /**
   * ==========================================================================
   * Game_System.prototype.faceFile
   *
   * @note
   *  Defines the getters and setters for the faceFile property of Game_System.
   *  This doesn't change the faces loaded, only the file to load when loading
   *  a save. The faces file outlines the predefined faces that may be used
   *  with text keys, and can easily be switched to a different file for
   *  dynamic character costumes. This is called internally by
   *  TextManager.loadFaceFile.
   *
   * ==========================================================================
   */
  Object.defineProperty(Game_System.prototype, "faceFile", {
    get: function() {
      return this._faceFile;
    },

    set: function(value) {
      this._faceFile = value;
    },
    configurable: true
  });


  // ==========================================================================
  //    DataManager
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * DataManager.loadGameWithoutRescue()
   *
   * @note
   *  Loads the sotred text and face files on load so that the data is ready
   *  to go once a game is loaded!
   *
   * ==========================================================================
   */
  Zale.ExtText.DM_lgwr_RTVIOwnoSNC4b9 = DataManager.loadGameWithoutRescue;
  DataManager.loadGameWithoutRescue = function(id) {
    var r = Zale.ExtText.DM_lgwr_RTVIOwnoSNC4b9.call(this, id);
    if(!r) {
      return r;
    }
    console.trace("Loading the game!");
    if(typeof $gameSystem.textFile !== 'string') {
      $gameSystem.textFile = Zale.ExtText.TEXTFILE;
    }
    if(typeof $gameSystem.faceFile !== 'string') {
      $gameSystem.faceFile = Zale.ExtText.FACEFILE;
    }
    TextManager.loadTextFile($gameSystem.textFile);
    TextManager.loadFaceFile($gameSystem.faceFile);
    return true;
  }

  /**
   * ==========================================================================
   *
   * DataManager.createGameObjects()
   *
   * @note
   *  Aliases the createGameObjects function to also load in the default
   *  text and face files into $gameSystem.
   *
   * ==========================================================================
   */
  Zale.ExtText.DM_cgo_vpioivnOIEUV5 = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    Zale.ExtText.DM_cgo_vpioivnOIEUV5.call(this);
    TextManager.loadTextFile($gameSystem.textFile);
    TextManager.loadFaceFile($gameSystem.faceFile);
  }


  // ==========================================================================
  //    Window Command
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * Window_Command.prototype.commandName(number index)
   *
   * @param index The index of the command who's name is requested.
   *
   * @note
   *  Aliases commandName to force the command name to do through the
   *  convertEscapeCharacters function, to convert any text codes we ma have.
   *
   * ==========================================================================
   */
  Zale.ExtText.WCommand_cn_cnoSIcnr = Window_Command.prototype.commandName;
  Window_Command.prototype.commandName = function(index) {
    return this.convertEscapeCharacters(Zale.ExtText.WCommand_cn_cnoSIcnr.call(this, index));
  }

  // ==========================================================================
  //    Window Message
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * Window_Base.prototype.convertEscapeCharacters(string text)
   *
   * @note
   *  This aliased function is responsible for replacing the \t[key] text codes
   *  with the text from the given key.
   *
   * ==========================================================================
   */
  Zale.ExtText.WBase_cec_VNOCxoiwrv1 = Window_Base.prototype.convertEscapeCharacters
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bt\[(.+?)\]/g, function(){
      return TextManager.text(arguments[1]);
    });
    return Zale.ExtText.WBase_cec_VNOCxoiwrv1.call(this, text);
  }

  /**
   * ==========================================================================
   *
   * Window_Message.prototype.createSubWindows()
   *
   * @note
   *  Aliases the createSubWindows method to additionally call the
   *  createNameWindow function if the name window is enabled.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_csw_OIcnblwkCn2rrc = Window_Message.prototype.createSubWindows;
  Window_Message.prototype.createSubWindows = function() {
    Zale.ExtText.WMessage_csw_OIcnblwkCn2rrc.call(this);
    if(Zale.ExtText.NAMEENABLED){
      this.createNameWindow();
    }
  }

  /**
   * ==========================================================================
   *
   * Window_Message.prototype.updatePlacement()
   *
   * @note
   *  Aliases the updatePlacement function to also call the name subwindow's
   *  "proprietary" updatePlacement function, but only if the name window is
   *  enabled.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_uplace_YGWfgcognvop42nc = Window_Message.prototype.updatePlacement;
  Window_Message.prototype.updatePlacement = function() {
    Zale.ExtText.WMessage_uplace_YGWfgcognvop42nc.call(this);
    if(Zale.ExtText.NAMEENABLED) {
      this._nameWindow.updatePlacement(this);
    }
  }

  /**
   * ==========================================================================
   *
   * Window_Message.prototype.terminateMessage()
   *
   * @note
   *  Aliases the terminateMessage function to also close the name subwindow,
   *  if the name window is enabled.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_term_ZNGIOiwofnoizr222cn = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    Zale.ExtText.WMessage_term_ZNGIOiwofnoizr222cn.call(this);
    if(Zale.ExtText.NAMEENABLED){
      this._nameWindow.close();
    }
  }

  /**
   * ==========================================================================
   *
   * Window_Message.prototype.startMessage()
   *
   * @note
   *  Aliases the startMessage function to check if Autofit Text should be
   *  enabled. If Autofit is enabled, the text in the textState object is
   *  set to the text returned by the TextManager.resizeText function.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_startm_NIOVnoind = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {
    Zale.ExtText.WMessage_startm_NIOVnoind.call(this);
    if(Zale.ExtText.AUTOFIT) {
      var lines = TextManager.resizeText(this._textState.text, this.contentsWidth() - this._textState.left)
      this._textState.text = lines.join("\n");
    }
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.changeTextColor(string color)
   *
   * @note
   *  Aliases the changeTextColor function in Window_Message. In addition to
   *  its regular duties, if the Remember Color option was set to true in the
   *  plugin's configuration, this will set the value Zale.ExtText.lastcolor
   *  in order to retain the last color used in text pages.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_ctc_IONciowvn8hnanovi = Window_Message.prototype.changeTextColor;
  Window_Message.prototype.changeTextColor = function(color) {
    if(Zale.ExtText.REMCOLOR) {
      Zale.ExtText.lastColor = this.contents.textColor;
    }
    Zale.ExtText.WMessage_ctc_IONciowvn8hnanovi.call(this, color);
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.resetFontSettings()
   *
   * @note
   *  Aliases the resetFontSettings function. After resetting all the font
   *  settings to their defaults, the alias will check if the last text color
   *  was remembered. If it was, the window's text color will be set to the
   *  last color that was stored in the settings.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_rfs_NOIsionwiocn240 = Window_Message.prototype.resetFontSettings;
  Window_Message.prototype.resetFontSettings = function() {
    Zale.ExtText.WMessage_rfs_NOIsionwiocn240.call(this);
    if(Zale.ExtText.REMCOLOR) {
      this.contents.textColor = Zale.ExtText.lastColor;
    }
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.processEscapeCharacter(string code,
   *    object textState)
   *
   * @note
   *  Aliases the processEscapeCharacter function. This alias allows you to
   *  set the name in the namebox in the text. This will only have an affect
   *  if the namebox is enabled.
   *
   * ==========================================================================
   */
  Zale.ExtText.WMessage_pec_NOCionoi2rgnioo = Window_Message.prototype.processEscapeCharacter;
  Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    if(Zale.ExtText.NAMEENABLED && code.toLowerCase() === 'n') {
      var substr = textState.text.substring(textState.index);
      if(/<([.\s\S]*?)>/m.test(substr)) {
        var match = /<([.\s\S]*?)>/m.exec(substr);
        textState.index += match[0].length;
        this.setName(this.convertEscapeCharacters(match[1]));
      }
    }
    Zale.ExtText.WMessage_pec_NOCionoi2rgnioo.call(this, code, textState);
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.newPage(object textState)
   *
   * @note
   *  If the return value of Game_Message.prototype.characterName (defined
   *  below) is not null, and the name window exists, then we set the name
   *  for the name window here.
   *
   * ==========================================================================
   */

  Zale.ExtText.WMessage_npage_NCOWOFNdoon = Window_Message.prototype.newPage;
  Window_Message.prototype.newPage = function(textState) {
    Zale.ExtText.WMessage_npage_NCOWOFNdoon.call(this, textState);
    if(this._nameWindow && $gameMessage.characterName()) {
      this.setName($gameMessage.characterName());
    }
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.createNamewindow()
   *
   * @note
   *  Creates the name window and sets its initial position based on the
   *  message window's. The window is added as a separate child from the
   *  window layer, because the name window overlaps the message window, and
   *  this can cause issues with windowskins that have rounded corners, as the
   *  transparent pixels on the corners would overwrite the windows drawn
   *  before.
   *  This is an issue directly with Pixi.js, and thus no easy solution is
   *  available.
   *
   * ==========================================================================
   */
  Window_Message.prototype.createNameWindow = function() {
    this._nameWindow = new Window_Help(1);
    this._nameWindow.openness = 0;
    this._nameWindow.updatePlacement = function(parent) {
      this.x = Zale.ExtText.NAMEMARGIN.bind(this)();
      if(parent.y > 0) {
        this.y = parent.y - this.height / 1.5;
      } else {
        this.y = parent.height - this.height / 1.5;
      }
    }
    SceneManager._scene.addChild(this._nameWindow);
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.closeName()
   *
   * @note
   *  If the name window exists, it is closed using Window_Base's close
   *  function. This provides us with the little closing animation.
   *
   * ==========================================================================
   */
  Window_Message.prototype.closeName = function() {
    if(this._nameWindow){
      this._nameWindow.close();
    }
  }

  /**
   * ==========================================================================
   * Window_Message.prototype.setName(string name)
   *
   * @note
   *  If the messae window exists, this function sets its text to the given
   *  string, and resizes and repositions the window to accomodate the text.
   *
   * ==========================================================================
   */
  Window_Message.prototype.setName = function(name) {
    if(this._nameWindow){
      this._nameWindow.width = this._nameWindow.textWidth(name) + 8 + this.padding * 2;
      this._nameWindow.setText(name);
      this._nameWindow.updatePlacement(this);
      this._nameWindow.open();
    }
  }




  // ==========================================================================
  //    Game Message
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * Game_Message.prototype.clear()
   *
   * @note
   *  Aliases Game_Message's clear method. This sets the _characterName
   *  property to null, signalling that there should be no name window
   *  present with the current message.
   *
   * ==========================================================================
   */
  Zale.ExtText.GMessage_clr_Zoqbop429dncqnf = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function() {
    Zale.ExtText.GMessage_clr_Zoqbop429dncqnf.call(this);
    this._characterName = null;
  }

  /**
   * ==========================================================================
   *
   * Game_Message.prototype.setCharacterName(string name)
   *
   * @note
   *  Sets the _characterName property to the given string, which will be
   *  displayed in the name window, if it is enabled.
   *
   * ==========================================================================
   */
  Game_Message.prototype.setCharacterName = function(name) {
    this._characterName = name;
  }

  /**
   * ==========================================================================
   *
   * Game_Message.prototype.characterName()
   *
   * @note
   *  Returns the current calue of the _characterName property.
   *
   * @return A string containing the current name for the name window.
   *
   * ==========================================================================
   */
  Game_Message.prototype.characterName = function() {
    return this._characterName;
  }


  // ==========================================================================
  //    Game Interpeter
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * Game_Inptereter.prototype.pluginCommand()
   *
   * @note
   *  Allows the game developer to show text by using a plugin command
   *  starting with ExternalText, with the first argument being the text key
   *  to display.
   *
   * ==========================================================================
   */
  Zale.ExtText.GI_pcom_OISqs1cdkjz = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if(command.match(/External[_-]*Text/i)) {
      if(args.length > 0){
        if(args[0].toLowerCase() == "show") {
          TextManager.displayMessage(args.slice(1).join(" "));
          this.setWaitMode('message');
        } else if(args[0].toLowerCase() == "load") {
          if(args[1] == "text") {
            TextManager.loadTextFile(args.slice(2).join(" "));
          } else if(args[1] == "face") {
            TextManager.loadFaceFile(args.slice(2).join(" "));
          }
        }
      }
    }
  }

  /**
   * ==========================================================================
   *
   * Game_Interpreter.prototype.showText()
   *
   * @note
   *  A method to add to the Game_Interpretter class so as to give people who
   *  prefer the old way of interacting with plugins a way to use the
   *  External Text script.
   *
   *
   * ==========================================================================
   */
  Game_Interpreter.prototype.showText = function(key) {
    TextManager.displayMessage(key);
    this.setWaitMode('message');
  }


  // ==========================================================================
  //    TextManager
  // ==========================================================================

  /**
   * ==========================================================================
   *
   * TextManager.convertTextCode(string text)
   *
   * @params text The text to check for a text code to convert.
   *
   * @note
   *  This will check teh given text for the text code, \t[key]. If the code
   *  is found, the code is replaced with the text for that particular key.
   *
   * @return The text, with any text codes replaced.
   *
   * ==========================================================================
   */
  $.convertTextCode = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bt\[(.+?)\]/g, function(){
      return TextManager.text(arguments[1]);
    });
    return text;
  }

  /**
   * ==========================================================================
   *
   * TextManager.getter(string method, mixed param)
   *
   * @param method A string indicating which function to call.
   * @param param A value specific to each method to get the desired result.
   *
   * @note
   *  This OVERWRITES the default TextManager.getter to force the text in the
   *  messages section of the Systems tab in the database to be checked for
   *  text codes.
   *
   * @return An object that is used in Object.defineProperty.
   *
   * ==========================================================================
   */
  $.getter = function(method, param) {
    return {
      get: function() {
        return this.__hepWindow.convertTextCode(this[method](param));
      },
      configurable: true
    };
  };


  /**
   * ==========================================================================
   *
   * TextManager.resizeText(string text, int maxWidth, ?bitmap measure)
   *
   * @param text The text to resize
   * @param maxWidth The max width that the text should fit in
   * @param measure A bitmap with which to meaure text size. Optional.
   *
   * @note
   *  Takes the given text and resizes it by splitting it by word, or letter
   *  if absolutely needed, to fit within the given width. The result is
   *  returned as an array.
   *
   * @return An array of strings.
   *
   * ==========================================================================
   */
  $.resizeText = function(text, maxWidth, measure) {
    if(!maxWidth) {
      throw new Error("No max width given!");
    }
    if(!(measure instanceof Bitmap)) {
      measure = new Bitmap(1, 1);
    }
    var words = text.split(" ");
    var lines = [];
    var line = "";
    var length = 0;
    for(var i = 0; i < words.length; i++) {
      var word = words[i];
      if(measure.measureTextWidth(word) > maxWidth) {
        for(var j = 0; j < word.length; j++) {
          if(length + measure.measureTextWidth(word[j] + "-") > maxWidth) {
            lines.push(line + "-");
            line = word[j];
            length = measure.measureTextWidth(line);
          } else {
            length += measure.measureTextWidth(word[j]);
            line += word[j];
          }
        }
      } else if(length + measure.measureTextWidth(word + " ") > maxWidth) {
        lines.push(line.trim());
        line = word + " ";
        length = measure.measureTextWidth(line);
      } else {
        length += measure.measureTextWidth(word + " ");
        line += word + " ";
      }
    }
    lines.push(line);
    return lines;
  }

  /**
   * ==========================================================================
   *
   * TextManager.loadTextFile(string file, ?function onLoad, ?function onError)
   *
   * @param file The text file to load.
   * @param onLoad An optional function to be called after loading.
   * @param onError An option function to be called on an error loading.
   *
   * @note
   *  Loads the given filename from the predefined text folder and sets it as
   *  the text.
   *
   * ==========================================================================
   */
  $.loadTextFile = function(file, onLoad, onError) {
    if(!file.endsWith(".json")) {
      file += ".json";
    }
    if($gameSystem) {
      $gameSystem.textFile = file;
    }
    try {
      this._text = JSON.parse(DataManager.ajaxLoadFile(Zale.ExtText.TEXTFOLDER + file));
      if(typeof onLoad === 'function') {
        onLoad.call(this);
      }
    } catch(e) {
      console.error(e);
      if(typeof onError === 'function') {
        onError.call(this);
      }
    }
  }

  /**
   * ==========================================================================
   *
   * TextManager.loadFaceFile(string file, ?function onLoad, ?function onError)
   *
   * @param file The file to load for predefined faces, inside the text
   *  folder.
   * @param onLoad An optional function to be called on loading.
   * @param onError An optional function to call if there was an error
   *  loading.
   *
   * @note
   *  Loads the specified file and sets it as the predefined faces file.
   *
   * ==========================================================================
   */
  $.loadFaceFile = function(file, onLoad, onError) {
    if(!file.endsWith(".json")) {
      file += ".json";
    }
    if($gameSystem) {
      $gameSystem.faceFile = file;
    }
    try {
      this._faces = JSON.parse(DataManager.ajaxLoadFile(Zale.ExtText.TEXTFOLDER + file));
      if(typeof onLoad === 'function') {
        onLoad.call(this);
      }
    } catch(e) {
      console.error(e);
      if(typeof onError === 'function') {
        onError.call(this);
      }
    }
  }

  /**
   * ==========================================================================
   *
   * TextManager.text(string key)
   *
   * @param key The key name to get the text for.
   *
   * @note
   *  Gets the text for the given key. If no key is found, an error message
   *  is returned and printed to the console. If no file is loaded, an error
   *  message is printed to the console, and undefined is returned.
   *
   * @return String on success, undefined on failure.
   *
   * ==========================================================================
   */
  $.text = function(key) {
    if(!this._text) {
      console.error("Attempt to get text before any text file is loaded!");
      return undefined;
    }
    if(this._text[key]) {
      return this._text[key].text;
    } else {
      return "No text found for '" + key + "'!";
    }
  }

  /**
   * ==========================================================================
   *
   * TextManager.textObject(string key)
   *
   * @param key The key to load the text object of.
   *
   * @note
   *  Loads the whle text object for the given key. Errors if there is no text
   *  file loaded.
   *
   * @return JS Object on success, undefine don failure.
   *
   * ==========================================================================
   */
  $.textObject = function(key) {
    if(!this._text) {
      console.error("Attempt to get text before any text file is loaded!");
      return undefined;
    }
    if(this._text[key]) {
      return this._text[key];
    } else {
      return {text: "No text found for '" + key + "'!"}
    }
  }

  /**
   * ==========================================================================
   *
   * TextManager.displayMessage(string key)
   *
   * @param key A string representing the key to load
   *
   * @note
   *  Dispays the tet from the given key, and also checks for and sets up the
   *  faces, item selection, number input, and choice selection. Each
   *  branch in the setup calls it's own methods to get the data that will be
   *  set, and then another to actually set the data. This allows other
   *  plugins to have plenty of opportunities to interact and change how
   *  External Text works.
   *
   * ==========================================================================
   */
  $.displayMessage = function(key) {
    var data = this.textObject(key);
    if(data) {
      if(data.face) {
        this.setFace(this._processFace(data.face));
      }
      if(data.window) {
        if(data.window.background) {
          this.setWindowBackground(this._processWindowBackground(data.window.background));
        }
        if(data.window.position) {
          this.setWindowPosition(this._processWindowPosition(data.window.position));
        }
      }

      if(data.choice) {
        if(data.choice.background) {
          this.setChoiceBackground(this._processWindowBackground(data.choice.background));
        }
        if(data.choice.position) {
          this.setChoicePosition(this._processWindowPosition(data.choice.position));
        }
        var def = data.choice.default;
        var can = data.choice.cancel;
        this.setChoiceList(data.choice.variable, data.choice.choices, def ? def : 0, can ? can : -1);
      }

      if(data.number) {
        var digits = 0;
        if(typeof data.number.digits === "string" && data.number.digits.toLowerCase() === "variable"){
          digits = $gameVariables.value(data.number.dvar);
        } else {
          digits = data.number.digits;
        }
        this.setNumberInput(data.number.variable, digits);
      }

      if(data.item) {
        this.setItemInput(data.item.variable, this._processItemInput(data));
      }

      if(data.name) {
        $gameMessage.setCharacterName(data.name);
      } else {
        $gameMessage.setCharacterName(null);
      }

      $gameMessage.add(data.text);
    } else {
      $gameMessage.add("No text data found for " + key);
      console.error("No text data found for " + key);
    }
  }

  /**
   * ==========================================================================
   *
   * TextManager._processFace(object data)
   *
   * @param data A JS object containing face data
   *
   * @note
   *  Checks the values of the object to determine what face to display.
   *
   * @return An array containing the face file and index to display.
   *
   * ==========================================================================
   */
  $._processFace = function(data) {
    var face = ['', 0];
    switch(data.type.toLowerCase()) {
      case "actor":
        face = this._getActorFace(data);
        break;
      case "party":
        face = this._getPartyFace(data);
        break;
      case "predefined":
        face = this._getPredefinedFace(data);
        break;
      default:
        break;
    }
    return face;
  }

  /**
   * ==========================================================================
   *
   * TextManager._processItemInput(object data)
   *
   * @param data A JS object containing item input data
   *
   * @note
   *  Checks the values of the object to determine what items to display.
   *  1 is regular items, 2 is key items, 3 is hidden a items, and 4 is
   *  hidden b items.
   *
   * @return A number indicating the type of item to display.
   *
   * ==========================================================================
   */
  $._processItemInput = function(data) {
    var type = 1;
    switch(data.item.type.toLowerCase()) {
      case "regular":
        type = 1;
        break;
      case "key":
        type = 2;
        break;
      case "hidden a":
        type = 3;
        break;
      case "hidden b":
        type = 4;
        break;
    }
    return type;
  }

  /**
   * ==========================================================================
   *
   * TextManager._processWindowBackground(object data)
   *
   * @param data A JS object that contains window background data
   *
   * @note
   *  Checks the value of the object to determind what the background should
   *  be set as.
   *
   * @return An integer representing background type.
   *
   * ==========================================================================
   */
  $._processWindowBackground = function(data) {
    var type = 0;
    switch(data.toLowerCase()) {
      case "transparent":
        type = 2;
        break;
      case "dim":
        type = 1;
        break;
      default:
        type = 0;
        break;
    }
    return type;
  }

  /**
   * ==========================================================================
   *
   * TextManager._processWindowPosition(string data)
   *
   * @param data A string representing the position for the window.
   *
   * @note
   *  Based on the given string, the windows position will be placed on the
   *  top, middle, or bottom (default) of the screen.
   *
   * @return An integer used to set the window position.
   *
   * ==========================================================================
   */
  $._processWindowPosition = function(data) {
    var position = 2;
    switch(data.toLowerCase()) {
      case "top":
        position = 0;
        break;
      case "middle":
        position = 1;
        break;
      default:
        break;
    }
    return position;
  }

  /**
   * ==========================================================================
   *
   * TextManager._getActorFace(object data)
   *
   * @param data A JS object that contains data for the face to display.
   *
   * @note
   *  This funciton will return the image filename and index for the face to
   *  for the current message. If the actor with the given ID doesn't exist,
   *  then the retun values will both be undefined.
   *
   * @return An array of the face filename and index..
   *
   * ==========================================================================
   */
  $._getActorFace = function(data) {
    var face, index;
    if($gameActors.actor(data.id)) {
      face = $gameActors.actor(data.id).faceName();
      if(data.index){
        index = data.index;
      } else {
        index = $gameActors.actor(data.id).faceIndex();
      }
    }
    return [face, index];
  }

  /**
   * ==========================================================================
   *
   * TextManager._getPartyFace(object data)
   *
   * @param data A JS object that contains data for getting a face from a
   *  party memeber.
   *
   * @note
   *  Returns the image filename based on a current party member. If an index
   *  is not specified, the index of the face setup in the editor is used.
   *
   * @return An array of the image filename and index.
   *
   * ==========================================================================
   */
  $._getPartyFace = function(data) {
    var face, index;
    if(data.id) {
      var member = $gameParty.members[id - 1];
      face = member.faceName();
      if(data.index) {
        index = member.faceIndex();
      } else {
        index = data.index;
      }
    }
    return [face, index];
  }

  /**
   * ==========================================================================
   *
   * TextManager._getPredefinedFace(object data)
   *
   * @param data A JS object containing data for face in the faces file.
   *
   * @note
   *  Checks the given data to see what face should be picked from the faces
   *  file.
   *
   * @return An array of the image filename and index.
   *
   * ==========================================================================
   */
  $._getPredefinedFace = function(data) {
    var face, index;
    if(data.id) {
      if(this._faces[data.id]) {
        face  = this._faces[data.id].file;
        index = this._faces[data.id].index;
      }
    }
    return [face, index];
  }

  /**
   * ==========================================================================
   *
   * TextManager._getNormalFace(object data)
   *
   * @param data A JS object that contains data about a face for the message.
   *
   * @note
   *  Returns an array with the filename and index as defined in the data.
   *
   * @return An array of the image filename and index.
   *
   *
   * ==========================================================================
   */
  $._getNormalFace = function(data) {
    var face, index;
    if(data.id) {
      face  = data.id;
      index = data.index || 0;
    }
    return [face, index];
  }

  /**
   * ==========================================================================
   *
   * TextManager._getChoiceCallback()
   *
   * @note
   *  This function returns an anonymous function that is called when a choice
   *  has been made in the choice selection. The function takes one argument,
   *  the index of the choice selected (starting at 0);
   *
   * @return Returns a function that wil be called on choice selection.
   *
   * ==========================================================================
   */
  $._getChoiceCallback = function(v) {
    return function(branch) {
        $gameVariables.setValue(v, branch);
      }
  }

  /**
   * ==========================================================================
   *
   * TextManager.setWindowBackground(number type)
   *
   * @param type A number to represent the background type
   *
   * @note
   *  0 is normal, 1 is dim, any other number is transparent.
   *
   * ==========================================================================
   */
  $.setWindowBackground = function(type) {
    $gameMessage.setBackground(type);
  }

  /**
   * ==========================================================================
   *
   * TextManager.setChoiceBackground(number type)
   *
   * @param type A number to represen the background type
   *
   * @note
   *  0 is normal, 1 is dim, any otehr number is transparent.
   *
   * ==========================================================================
   */
  $.setChoiceBackground = function(type) {
    $gameMessage.setChoiceBackground(type);
  }

  /**
   * ==========================================================================
   *
   * TextManager.setWindowPosition(number pos)
   *
   * @param pos A number representing the position for the message window.
   *
   * @note
   *  0 is top, 1 is middle, 2 is bottom. Floats are also acceptable to
   *  further change the position of the window.
   *
   * ==========================================================================
   */
  $.setWindowPosition = function(pos) {
    $gameMessage.setPositionType(pos);
  }

  /**
   * ==========================================================================
   *
   * TextManager.setChoicePosition(number pos)
   *
   * @param pos An integer indicating the position of the choice window.
   *
   * @note
   *  Sets the position of the choice window.
   *  0 is left, 1 is middle, 2 is right.
   *
   * ==========================================================================
   */
  $.setChoicePosition = function(pos) {
    $gameMessage.setChoicePositionType(pos);
  }

  /**
   * ==========================================================================
   *
   * TextManager.Function()
   *
   * @param pos A number representing the position for the choice window.
   *
   * @note
   *  0 is left, 1 is middle, 2 is right. Floats are also acceptable to
   *  further change the position of the choice window.
   *
   * ==========================================================================
   */
  $.setChoiceList = function(v, list, def, can) {
    $gameMessage.setChoices(list, def, can);
    $gameMessage.setChoiceCallback(this._getChoiceCallback(v));
  }

  /**
   * ==========================================================================
   *
   * TextManager.setFace(array face)
   *
   * @param face An array containing a face filename and index
   *
   * @note
   *  Sets the face for the message window to display with the current text.
   *  The filename is expected to be the first element in the array, with the
   *  face index being the second.
   *
   * ==========================================================================
   */
  $.setFace = function(face) {
    $gameMessage.setFaceImage(face[0], face[1]);
  }

  /**
   * ==========================================================================
   *
   * TextManager.setNumberInput(number v, number digits)
   *
   * @param v The variable number to store the result in
   * @params digits The number of digits to allow the input to be.
   *
   * @note
   *  Sets the values eneded for number input in $gameMessage. The
   *  Game_Message class handles what types of input to display with the text
   *  itself, depending on what values are set (Number input, Item selection,
   *  or the choice window).
   *
   * ==========================================================================
   */
  $.setNumberInput = function(v, digits) {
    $gameMessage.setNumberInput(v, digits);
  }

  /**
   * ==========================================================================
   *
   * TextManager.setItemInput(number v, number type)
   *
   * @param v The variable ID to store the selected item's ID in.
   * @param type A number to determine what type of item may be selected.
   *
   * @note
   *  MV has 4 item types to choose from, Regular, Key, Hidden A, and
   *  Hidden B. The Hidden A and B item tyes are not displayed in the item
   *  menu with the default system. They only show up when using an item
   *  selection. Additionally, the two groups are separate, allowing you to
   *  keep items separated into the two hidden groups as needed.
   *  Regular items are type 1.
   *  Key items are type 2.
   *  Hidden A items are type 3.
   *  Hdden B items are type 4.
   *
   * ==========================================================================
   */
  $.setItemInput = function(v, type) {
    $gameMessage.setItemChoice(v, type);
  }

})(TextManager);