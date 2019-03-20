//###############################################################################
// Name:        CloudManager
// Description: A simple cloud based game load and save system for RPG Maker MV
// Version:     0.9.3 (per user savegames)
// Author:      Frank A. Grenzel
// License:     CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)
//###############################################################################
//
// ### Longer description ###
// This file is part of the Cloud Manager, a simple cloud (server) based load and
// save system for RPG Maker MV. With the Cloud Manager you can store your save-
// games on and load it from your server. It doesn't matter where you play the
// game. You can start it on your Windows desktop, quit it and later continue it
// on a browser anywhere - without copy savegames manually.
// This file is a plugin for RPG Maker MV and part of the Cloud Manager.
// For simplification the Cloud Manager is using SQLite database for storage 
// instead of MySQL. SQLite needs no special database server setup and uses just
// a simple file (you can easily saved for backup).
//
// ### How to install ###
// To use the Cloud Manager on your game you need a server, with some requirements:
// * >=PHP 5.6 (maybe other versions would work but not tested)
// * SQLite3 database driver
// * PHP PDO support for SQLite (pdo_sqlite)
//
// The Cloud Manager comes with 3 files:
// * db_create.php    - a simple script to initialize the database
// * cloudmanager.php - the server script
// * CloudManager.js  - the RPG Maker plugin
//
// 1. Copy db_create.php and cloudmanager.php on your server.
// 2. Once run db_create.php. This should create the database (rmmv.sqlite) on
//    your server with 3 tables in it.
// 3. Copy CloudManager.js to your js/plugin folder and add the plugin on the
//    PluginManager. Then setup the plugin properties.
//    IMPORTANT: As long as the CloudManager plugin is active your games needs a
//               semi-permanent connection to your server to run!
//               Semi-permanent means on start, continue, new game, save game
//               and back to title screen.
//    HINT: If you have a server connection as needed but the Cloud Manager won't
//          work, check the permissions of your scripts and database file.
//
// ### How it works ###
// If the plugin is activated, your game don't write or read savegames from you
// local drive or the browser local storage anymore. Also there are no save/load
// slots anymore. Your game will have just one savegame on your server. No more,
// no less. But with access to the database you have access to all previous made
// savegames (stored on your server). 
//
// Title Screen
// On start the plugin checks if a savegame for this game is on the server.
// "Continue" is enabled, if a savegame was found and the game version is recent
// enough. If you select "Continue" the latest savegame will be loaded from the
// server and the game starts with it.
// If you select "New Game" and preventRestart is disabled a new game will start
// as you know. If preventRestart is enabled the plugin checks for a savegame on
// the server. If there is no savegame you can start a new game. If a savegame was
// found but your game version is obsolete you fall back to the title screen (well,
// you can't play the game until you have a newer game version). If a savagame was
// found and your game version is up-to-date the latest savegame will be loaded from
// the server and the game starts with it.
//
// InGame Command Menu
// If you select "Save" the plugin will send your current game data to the server,
// hopefully saves it on the database. There are no other options, just save and
// gone.
// If you select "End" and "To Title" and saveOnEnd is active your current game
// data will be saved on the server before the title menu is shown. If saveOnEnd
// is disabled you will see the title menu without saveing the last state on server.
//
// Server
// On the server side there is just one script to handle all plugin requests. It
// reads the game version of the last relevant savegame and compares it with your game
// version. It reads the last relevant savegame from the database and sends the json
// game data back to the game and it writes the transmitted json game data into the
// database (with game name and version, username and timestamp).

// ### Plugin Parameters ###
// * gameName: This should be unique for all your games, because it makes sure you get
//   the saved data of the right game from your server (so you can handle several
//   different games on your server).
// * gameVersion: The plugin verify the version of a game is up-to-date to handle the
//   last game saved on the server.
// * url: Right, this is where your php scripts are.
// * saveOnEnd: If active your game is saved on every games end on the server. Well,
//   of course you can save it at all times but with this option a player can't drop
//   the last events and try it again.
// * preventRestart: Usually you can start a new game at all times. This would overwrite
//   the could saved data and reset the whole game. With this option active you can't
//   start a new game if a saved game is on the server.
// * sessionManagement: If you want to use the session management set it to 1.
// * perUserGame: If set to 1 the game will besaved for every user seperate.
//   sessionManagement must set to 1 too.
// * logLevel: Well, just an option which messages are shown on the console.
//
// ### Session Management ### (BETA!)
// Okay, I have added some simple session management.
// With session management only one player (means game instance) can be the "active
// player". All other players are in "passive mode", can't save the game.
//
// How does it work?
//
// On the server there is a session table. Every time a player wants to continue a
// saved or start a new game the game ask the server if there is an active player
// already in the game. If so, the games runs in "passive mode". If no active player
// found, the game runs in "active mode". Doesn't matter which mode, every running
// game has an entry on the session table (so you can see, how many players are on the
// game this time).
// In "passive mode", all commands in command window are hidden but options and end
// game. So in "passive mode" you can't save the game (auto save on game end is disabled
// in passive mode too).
//
// To distinguish the game instances the server sends a GUID to the game on first connect.
// This GUID is unique for every session (expires if the whole game will be quit).
//
// Important: An active session will be changed to passive if the player comes back to
// the title screen. But if the game is closed without come back to the title screen, 
// the session is marked as active on the database furthermore and nobody can be active
// anymore.
//
// ### Terms of Use ###
// The Cloud Manager is distributed as is under the creative commons license CC BY 3.0
// (Attribution 3.0 Unported) for free.
// You are free to share, copy, redistribute or edit it for any purpose, even commercially
// under the following terms: You must give appropriate credit, provide a link to the
// license, and indicate if changes were made. You may do so in any reasonable manner,
// but not in any way that suggests the licensor endorses you or your use.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// ### Contact ###
// Feel free to contact me. You can find me as Purzelkater on http://forums.rpgmakerweb.com

/*:
 * @plugindesc Save and load games into/from the cloud
 * @author Purzelkater

 * @param gameName
 * @desc The name of the game (should be unique)
 * @default My Game
 
 * @param gameVersion
 * @desc The version of the game
 * @default 1.0
 
 * @param url
 * @desc URL to server (the php script bust be there)
 * @default http://www.my-server.com
 
 * @param saveOnEnd
 * @desc Save game on game quit?
 * @default 1
 
 * @param preventRestart
 * @desc Prevent new game if saved game is found
 * @default 1
 
 * @param sessionManagement
 * @desc Use session management? (0=all can save, 1=only active player can save)
 * @default 0 
 
 * @param perUserGame
 * @desc Save the game for every user separate? (0=no, 1=yes)
 * @default 0
 
 * @param loginActorId
 * @desc Actor Id, used for the login screen face picture
 * @default 1
 
 * @param logLevel
 * @desc 0=Disabled, 1=Errors, 2=Errors/Warnings, 3=All
 * @default 0
 
*/
function cloudManager() {
  // static object for ingame use
};

(function() {
	// Extract parameters from plugin settings (RPG Maker plugin manager)
	var _parameters        = PluginManager.parameters('CloudManager');
	var _gameName          = _parameters['gameName']                   || "My Game";
	var _gameVersion       = parseFloat(_parameters['gameVersion']     || 1.0);
	var _url               = _parameters['url']                        || "http://www.my-server.com";
	var _saveOnEnd         = parseInt(_parameters['saveOnEnd']         || 1);
	var _preventRestart    = parseInt(_parameters['preventRestart']    || 1);
	var _sessionManagement = parseInt(_parameters['sessionManagement'] || 0);
	var _logLevel          = parseInt(_parameters['logLevel']          || 0);
	var _perUserGame       = parseInt(_parameters['perUserGame']       || 0);
	var _loginActorId      = parseInt(_parameters['loginActorId']      || 1);
	
	var _userName          = "CloudManager";     // used with perUserGame
	var _password          = "mySecretPassword"; // used with perUserGame
	var _gameMode          = 0;
	var _nextAction        = "none";
	var _newOrContinue     = "";
	// 0: undefined
	// 1: game started (on title screen)
	// 2: passive (can't save)
	// 3: active (can save)
	var _guid              = "";
	
	// Clear username and password for the first start of the game
	if (_perUserGame==1) {
		_sessionManagement = 1;
		_userName = "";
		_password = "";
	};

	/*****************************************************
	  Store default function definitions for future calls
	******************************************************/
	var commandNewGame = Scene_Title.prototype.commandNewGame;
	//--[not used]-- var commandContinue = Scene_Title.prototype.commandContinue;
	//--[not used]-- var commandSave = Scene_Menu.prototype.commandSave;
	var commandToTitle = Scene_GameEnd.prototype.commandToTitle;
	//--[not used]-- var isContinueEnabled = Window_TitleCommand.prototype.isContinueEnabled;	
	var makeCommandList = Window_MenuCommand.prototype.makeCommandList;

	/******************************
	  Disable command menu items
	*****************************/
	Window_MenuCommand.prototype.makeCommandList = function() {
	
		// Check session
		modeGame("isactive");
	
		if (_gameMode==3) {
			makeCommandList.call(this, arguments);
		} else {
			Debug(2,"Command menu in passive mode");
			this.addOptionsCommand();
			this.addGameEndCommand();
		};
	};	

	/***************************************
	  Overwrite "new game" on title screen
	***************************************/
	Scene_Title.prototype.commandNewGame = function() {
		Debug(3,"commandNewGame");
		// Savegame for every user?
		if (_perUserGame==1) {
			if (_userName=="" || _password=="") {
				Debug(2,'Empty username or password');
				// Username and password are empty. - You have to enter them!

				_nextAction = "username";
				_newOrContinue = "new";
				this._commandWindow.close();
			
				Debug(3,"Open login input");
			
				SceneManager.push(Scene_Login);
				SceneManager.prepareNextScene(_loginActorId, 16);
			} else {
				// Prevent game reset/restart?
				if (_preventRestart==1) {
					switch(parseInt(checkGame()["Version"])) {
						case -1:
							Debug(2,"No savegame found");
							
							// Open session
							modeGame("login");					
							
							commandNewGame.call(this, arguments);
							break;
						case 0:
							Debug(1,"Client to old");
							commandToTitle.call(this, arguments);
							break;
						case 1:
							Debug(3,"Valid savegame found");
							
							// Open session
							modeGame("login");					
							
							loadGame();
							break;
						default:
							Debug(1,"Unknown savegame check result");
					};				
				} else {
				
					// Open session
					modeGame("login");
				
					commandNewGame.call(this, arguments);
					
				};		
			};		
		} else {
			// Prevent game reset/restart?
			if (_preventRestart==1) {
				switch(parseInt(checkGame()["Version"])) {
					case -1:
						Debug(2,"No savegame found");
						
						// Open session
						modeGame("login");					
						
						commandNewGame.call(this, arguments);
						break;
					case 0:
						Debug(1,"Client to old");
						commandToTitle.call(this, arguments);
						break;
					case 1:
						Debug(3,"Valid savegame found");
						
						// Open session
						modeGame("login");					
						
						loadGame();
						break;
					default:
						Debug(1,"Unknown savegame check result");
				};				
			} else {
			
				// Open session
				modeGame("login");
			
				commandNewGame.call(this, arguments);
				
			};
		};
	};

	/********************************************
	  Overwrite "continue game" on title screen
	********************************************/
	Scene_Title.prototype.commandContinue = function() {
		Debug(3,"commandContinue");
		
		if (_perUserGame==1) {
			if (_userName=="" || _password=="") {
				Debug(2,'Empty username or password');
				// Username and password are empty. - You have to enter them!
				
				_nextAction = "username";
				_newOrContinue = "continue";
				this._commandWindow.close();
			
				Debug(3,"Open login input");
			
				SceneManager.push(Scene_Login);
				SceneManager.prepareNextScene(_loginActorId, 16);
				
			} else {

				switch(parseInt(checkGame()["Version"])) {
					case -1:
						Debug(2,"No savegame found");
						
						// Open session
						modeGame("login");
						
						commandNewGame.call(this, arguments);
						break;
					case 0:
						Debug(1,"Client to old");
						_userName = "";
						_password = "";
						commandToTitle.call(this, arguments);
						break;
					case 1:
						Debug(3,"Valid savegame found");
						
						// Open session
						modeGame("login");
						
						loadGame();
						break;
					default:
						Debug(1,"Unknown savegame check result");
						_userName = "";
						_password = "";						
				};

			};
		} else {
		
			// Open session
			modeGame("login");		
		
			loadGame();
			
		};
	};

	/*******************************************
	  Overwrite "save" on ingame option screen
	*******************************************/
	Scene_Menu.prototype.commandSave = function() {
		Debug(3,"commandSave");
		if (_gameMode==3) {
			saveGame();
		} else {
			Debug(2,"Game in passive mode");
		};
		// Close option window
		SceneManager.pop();		
	};

	/***********************************************
	  Overwrite "end game" on ingame option screen
	***********************************************/
	Scene_GameEnd.prototype.commandToTitle = function() {
		Debug(3,"commandToTitle");	
		// AutoSave on game end?
		if (_saveOnEnd==1) {
			if (_gameMode==3) {
				saveGame();
			} else {
				Debug(2,"Game in passive mode");
			};
		};
		
		// Close session
		modeGame("logout");
		
		// Call regular game end function
		commandToTitle.call(this, arguments);
	};

	/***********************************************************
	  Overwrite "isContinueEnabled" to check cloud saved games
	***********************************************************/	
	Window_TitleCommand.prototype.isContinueEnabled = function() {
		if (_perUserGame==1) {
			return true;
		} else {
			switch(parseInt(checkGame()["Version"])) {
				case -1:
					Debug(2,"No savegame found");
					return false;
					break;
				case 0:
					Debug(1,"Client to old");
					return false;
					break;
				case 1:
					Debug(3,"Valid savegame found");
					return true;
					break;
				default:
					Debug(1,"Unknown savegame check result");
					return false;		
			};
		};
	};
	
	/*********************
	  Session management
	*********************/
	function modeGame(state) {
		if (_sessionManagement==1) {
			// On perUserGame, guid will be build from username and password
			if (_perUserGame==1) {
				_guid = "@USERGAME@";
			}
			// Initialize HTTP Request
			var xhttp = new XMLHttpRequest();
			var data = "action=state&guid="+encodeURIComponent(_guid)+"&userName="+encodeURIComponent(_userName)+"&password="+encodeURIComponent(_password)+"&gameName="+encodeURIComponent(_gameName)+"&gameVersion="+encodeURIComponent(_gameVersion)+"&gameData="+encodeURIComponent(state);
			
			Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
			xhttp.open('POST', _url+"/cloudmanager.php", false);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
			xhttp.send(data);

			var result = xhttp.responseText;
			Debug(3,"Game mode "+result);
		
			var json = JSON.parse(result);
		
			_gameMode = parseInt(json["gameMode"]);
			_guid = json["guid"];
			
		} else {
			switch(state) {
				case "login":
					_gameMode = 3;
					break;
				case "logout":
					_gameMode = 1;
					break;
				case "isactive":
					_gameMode = 3;
					break;				
				default:
					_gameMode = 0;						
			};
		};
		
		// Clear username and password on logout
		if (state=="logout" && _perUserGame==1) {
			_userName = "";
			_password = "";
		};
		
	};
	
	/**********************************
	  Check save game stats on server
	**********************************/
	function checkGame() {
		if (_perUserGame==1) {
			_guid = "@USERGAME@";
		};
		// Initialize HTTP Request		
		var xhttp = new XMLHttpRequest();
		var data = "action=check&guid="+encodeURIComponent(_guid)+"&userName="+encodeURIComponent(_userName)+"&password="+encodeURIComponent(_password)+"&gameName="+encodeURIComponent(_gameName)+"&gameVersion="+encodeURIComponent(_gameVersion);
		
		// Get savegame data
		Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
		xhttp.open('POST', _url+"/cloudmanager.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		xhttp.send(data);

		var result = xhttp.responseText;
		Debug(3,"Check result "+result);
		
		return JSON.parse(result);
	};

	/***************************
	  Send game data to server
	***************************/
	function saveGame() {
		$gameSystem.onBeforeSave();

		// Generate savegame data
		var json = JsonEx.stringify(DataManager.makeSaveContents());
		if (json.length >= 200000) {
			Debug(2,'Save data too big');
		};	

		// Initialize HTTP Request
		var xhttp = new XMLHttpRequest();
		var data = "action=save&guid="+encodeURIComponent(_guid)+"&userName="+encodeURIComponent(_userName)+"&password="+encodeURIComponent(_password)+"&gameName="+encodeURIComponent(_gameName)+"&gameVersion="+encodeURIComponent(_gameVersion)+"&gameData="+encodeURIComponent(json);
		
		// Send savegame data
		Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
		xhttp.open('POST', _url+"/cloudmanager.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		
		var result = xhttp.responseText;
		
		Debug(3,result);				
	};

	/*****************************
	  Load game data from server
	*****************************/
	function loadGame() {
		// Initialize HTTP Request
		var xhttp = new XMLHttpRequest();
		var data = "action=load&guid="+encodeURIComponent(_guid)+"&userName="+encodeURIComponent(_userName)+"&password="+encodeURIComponent(_password)+"&gameName="+encodeURIComponent(_gameName)+"&gameVersion="+encodeURIComponent(_gameVersion);
		
		// Get savegame data
		Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
		xhttp.open('POST', _url+"/cloudmanager.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
			
		var result = xhttp.responseText;
		
		Debug(3,"Loaded "+result);
		
		// Extract data from savegame
		DataManager.createGameObjects();
		DataManager.extractSaveContents(JsonEx.parse(result));
		
		// Move player
		$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
		$gamePlayer.requestMapReload();
			
		// Initialize map
		SceneManager.goto(Scene_Map);	
		
		$gameSystem.onAfterLoad();
			
		return true;			
	};
	
	/*****************
	  Console output
	*****************/
	function Debug(level, text) {
		if (_logLevel>=level) {
			switch(level) {
				case 1:
					console.error("[CM] "+text);
					break;
				case 2:
					console.warn("[CM] "+text);
					break;
				case 3:
					console.log("[CM] "+text);
					break;
			};
		
		};
	};
	
	/*********************************
	  Implementation of has function
	*********************************/
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
		
		if (this.length === 0) return hash;
		
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		};
		return hash;
	};	

	/**********************************************************
	  Scene_Login - The scene class of the login input screen
	**********************************************************/
	function Scene_Login() {
		this.initialize.apply(this, arguments);
	};

	Scene_Login.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_Login.prototype.constructor = Scene_Login;

	Scene_Login.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_Login.prototype.prepare = function(actorId, maxLength) {
		this._actorId = actorId;
		this._maxLength = maxLength;
	};

	Scene_Login.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this._actor = $gameActors.actor(this._actorId);
		this.createEditWindow();
		this.createInputWindow();
	};

	Scene_Login.prototype.start = function() {
			Scene_MenuBase.prototype.start.call(this);
			this._editWindow.refresh();
	};

	Scene_Login.prototype.createEditWindow = function() {
		this._editWindow = new Window_LoginEdit(this._actor, this._maxLength);
		this.addWindow(this._editWindow);
	};

	Scene_Login.prototype.createInputWindow = function() {
		this._inputWindow = new Window_NameInput(this._editWindow);
		this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
		this.addWindow(this._inputWindow);
	};

	Scene_Login.prototype.onInputOk = function() {
		switch(_nextAction) {
			case "username": // Username was entered
				_nextAction = "password";

				_userName = this._editWindow.name();
				Debug(3, "Set username to "+_userName);
	
				this.popScene();
		
				Debug(3, "Open password window");
				SceneManager.push(Scene_Login);
				SceneManager.prepareNextScene(_loginActorId, 16);

				break;
			case "password": // Password was entered

				_nextAction = "login";
			
				_password = this._editWindow.name();
				_password = _password.hashCode();
				Debug(3, "Set password to "+_password);
	
				this.popScene();
				
				if (_userName=="" || _password=="") {
					Debug(3, "Back to title menu");
					SceneManager.push(Scene_Title);				
				} else {
					switch (_newOrContinue) {
						case "new":
							// Prevent game reset/restart?
							if (_preventRestart==1) {
								switch(parseInt(checkGame()["Version"])) {
									case -1:
										Debug(2,"No savegame found");
							
										// Open session
										modeGame("login");					
							
										DataManager.setupNewGame();
										this.fadeOutAll();
										SceneManager.goto(Scene_Map);
										break;
									case 0:
										Debug(1,"Client to old");
										SceneManager.push(Scene_Title);
										break;
									case 1:
										Debug(3,"Valid savegame found");
								
										// Open session
										modeGame("login");					
							
										loadGame();
										break;
									default:
										Debug(1,"Unknown savegame check result");
								};				
							} else {
				
								// Open session
								modeGame("login");
				
								DataManager.setupNewGame();
								this.fadeOutAll();
								SceneManager.goto(Scene_Map);
					
							};					
						
							break;
						case "continue":
						
							switch(parseInt(checkGame()["Version"])) {
								case -1:
									Debug(2,"No savegame found");
							
									// Open session
									modeGame("login");
							
									DataManager.setupNewGame();
									this.fadeOutAll();
									SceneManager.goto(Scene_Map);
									break;
								case 0:
									Debug(1,"Client to old");
									_userName = "";
									_password = "";
									commandToTitle.call(this, arguments);
									break;
								case 1:
									Debug(3,"Valid savegame found");
							
									// Open session
									modeGame("login");
							
									loadGame();
									break;
								default:
									Debug(1,"Unknown savegame check result");
									_userName = "";
									_password = "";						
							};
					
							break;
						default:
							Debug(3, "Back to title menu");
							SceneManager.push(Scene_Title);
					};
				};
					
				break;
			default:
				Debug(2, "There was something wrong with the login screen");
		};
	};

	/**************************************************************
	  Window_LoginEdit - The window for editing an login/password
	**************************************************************/
	function Window_LoginEdit() {
		this.initialize.apply(this, arguments);
	};

	Window_LoginEdit.prototype = Object.create(Window_Base.prototype);
	Window_LoginEdit.prototype.constructor = Window_LoginEdit;

	Window_LoginEdit.prototype.initialize = function(actor, maxLength) {
		var width = this.windowWidth();
		var height = this.windowHeight();
		var x = (Graphics.boxWidth - width) / 2;
		var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._actor = actor;
		switch(_nextAction) {
			case "username":
				this._name = _userName;
				break;
			case "password":
				this._name = "";
				break;
			default:
				this._name = ""
		};
		this._index = this._name.length;
		this._maxLength = maxLength;
		this._defaultName = this._name;
		this.deactivate();
		this.refresh();
		ImageManager.loadFace(actor.faceName());
	};

	Window_LoginEdit.prototype.windowWidth = function() {
		return 480;
	};

	Window_LoginEdit.prototype.windowHeight = function() {
		return this.fittingHeight(4);
	};

	Window_LoginEdit.prototype.name = function() {
		return this._name;
	};

	Window_LoginEdit.prototype.restoreDefault = function() {
		this._name = this._defaultName;
		this._index = this._name.length;
		this.refresh();
		return this._name.length > 0;
	};

	Window_LoginEdit.prototype.add = function(ch) {
		if (this._index < this._maxLength) {
			this._name += ch;
			this._index++;
			this.refresh();
			return true;
		} else {
			return false;
		}
	};

	Window_LoginEdit.prototype.back = function() {
		if (this._index > 0) {
			this._index--;
			this._name = this._name.slice(0, this._index);
			this.refresh();
			return true;
		} else {
			return false;
		};
	};

	Window_LoginEdit.prototype.faceWidth = function() {
		return 144;
	};

	Window_LoginEdit.prototype.charWidth = function() {
		var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
		return this.textWidth(text);
	};

	Window_LoginEdit.prototype.left = function() {
		var nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
		var nameWidth = (this._maxLength + 1) * this.charWidth();
		return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
	};

	Window_LoginEdit.prototype.itemRect = function(index) {
		return {
			x: this.left() + index * this.charWidth(),
			y: 54,
			width: this.charWidth(),
			height: this.lineHeight()
		};
	};

	Window_LoginEdit.prototype.underlineRect = function(index) {
		var rect = this.itemRect(index);
		rect.x++;
		rect.y += rect.height - 4;
		rect.width -= 2;
		rect.height = 2;
		return rect;
	};

	Window_LoginEdit.prototype.underlineColor = function() {
		return this.normalColor();
	};

	Window_LoginEdit.prototype.drawUnderline = function(index) {
		var rect = this.underlineRect(index);
		var color = this.underlineColor();
		this.contents.paintOpacity = 48;
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this.contents.paintOpacity = 255;
	};

	Window_LoginEdit.prototype.drawChar = function(index) {
		var rect = this.itemRect(index);
		this.resetTextColor();
		this.drawText(this._name[index] || '', rect.x, rect.y);
	};
	
	Window_LoginEdit.prototype.drawTitle = function() {
		var x = 175;
		var y = 0;
		var maxWidth = Graphics.width - x * 2;
		var text = "";
		switch(_nextAction) {
			case "username":
				text = "Username:";
				break;
			case "password":
				text = "Password:";
				break;
		};			
		this.outlineColor = 'black';
		this.outlineWidth = 2;
		this.fontSize = 48;
		this.drawText(text, x, y, maxWidth, 48, 'left');
	};	

	Window_LoginEdit.prototype.refresh = function() {
		this.contents.clear();
		this.drawActorFace(this._actor, 0, 0);
		this.drawTitle();
		for (var i = 0; i < this._maxLength; i++) {
			this.drawUnderline(i);
		};
		for (var j = 0; j < this._name.length; j++) {
			this.drawChar(j);
		};
		var rect = this.itemRect(this._index);
		this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
	};
	
	/********************************
	  Export plugin script commands
	********************************/	
	cloudManager.saveGame = function() {
		if (_gameMode==3) {
			return saveGame();
		} else {
			return false;
		};
	};
	
	cloudManager.loadGame = function() {
		return loadGame();
	};
	
	cloudManager.checkGame = function() {
		return parseInt(checkGame()["Version"]);
	};
	
	cloudManager.gameMode = function() {
		return _gameMode;
	};
	
	cloudManager.userName = function() {
		return _userName;
	};

	cloudManager.password = function() {
		return _password;
	};

	cloudManager.guid = function() {
		return _guid;
	};
	
})();
