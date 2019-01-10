//=============================================================================
// Bluebooth Plugins - Random Conversations
// BBS_RandomConversations.js
//=============================================================================

//=============================================================================
 /*:
 * @title Random Conversations Plugin
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Feb 19, 2016
 * @filename BBS_RandomConversations.js
 * If you enjoy/benefit from my work, please support me on Patreon!
 *
 * https://www.patreon.com/bluebooth
 *
 * @plugindesc v1.03a Add random dialogue for a specific topic to your game.
 * This allows you to pick a random (unlocked) rumor to share, pick a hint at random, given
 * general dialogue on a specific point, etc.  There's a lot of exciting things you can
 * do with this!  Original design was merged with elements of Iavra's Achievements
 * file parsing and then new enhancements / reworkings were added on top of that.
 * Special Thanks to Tsukihime for all the help.
 * Special Thanks to Anthony Xue for bug fixes and documentation help.
 * Special Thanks to Iavra, the file parse handling is modified from his own (awesome) Achievements plugin.
 *  You should pick it up, it's really well done.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *   - Free for use in non-commercial projects with credits
 *   - Contact me for commercial use
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Configuration File
 * @desc Name of an external configuration file to load at game start. Default: data/Rumors.json
 * @default data/Rumors.json
 * 
 * @param Case Insensitive
 * @desc Enable to use case insensitive string comparisons.  You will need to manually 
 * convert Rumors.json Categories and Topics values to lower case.
 * @default false
 * 
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 *  
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Add random dialogue for a specific topic to your game.  This allows you to pick a random (unlocked) rumor to share, 
 * pick a hint at random, given general dialogue on a specific point, etc.  There's a lot of exciting things you can
 * do with this!  Original design was merged with elements of Iavra's Achievements file parsing and then new 
 * enhancements / reworkings were added on top of that.
 * 
 * To add random dialogue to your game, create a txt file in your data directory called rumors.json.  This is 
 * a very flexible system that can be used from anything to random dialogue to selecting one random rumor from a series of many,
 * to doing the same for hints, and so on.  To support having multiple topics (each with an item that can be selected at random),
 * these dialogue items are split into both Topics (ie. "The Temple Puzzle") and "Categories" (ie. "Puzzles").  Each dialogue
 * entry consists of multiple properties:
 * 
 * id           A unique numeric id, that may not contain commas or whitespaces. 
 * topic        Topic name.
 * category		Category name.
 * dialogue	    Dialogue box contents associated with this topic.  To add \c[], \v[], \i... or other message shortcuts, you must use two slashes \\ in JSON.  See examples below.
 * available    Eval condition as string.  If true, this dialogue item is available.
 * restriction  Eval condition as string.  If false, this dialogue item is available.  Used to restrict random conversation items
 *				for specific NPCs (ie. "adventurer only", "widow only", etc.)
 *
 * This is a sample file, containing one of each achievement types:
 * 
 * [
 *    {
 *         "id":0, 
 *         "topic":"SantaCompana",
 * 		   "category":"Toledo",
 *         "dialogue":"They say the \\c[3]Santa Compana\\c[0] has been spotted near the \\c[3]Old Monastery\\c[0].  I hope it doesn't get any closer to town.", 
 *         "available":"$gameSwitches.value(297) === false",
 *         "restriction":"false"
 *    },
 *    {
 *         "id":1, 
 *         "topic":"SantaCompana",
 * 	 	   "category":"Toledo",
 *         "dialogue":"I haven't heard any news about \\c[3]Santa Compana\\c[0] sightings.  Maybe the reaper has moved on?", 
 *         "available":"$gameSwitches.value(297) === true",
 *         "restriction":"false"
 *    },
 *    {
 *         "id":2, 
 *         "topic":"Culebre",
 * 	 	   "category":"Toledo", 
 *         "dialogue":"I don't know how my family is going to stay fed with that damned \\c[3]Culebre\\c[0] at large.", 
 *         "available":"$gameSwitches.value(126) === false",
 *         "restriction":"$gameVariables.value(77) === 2"
 *    }
 * ]
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * Use the following plugin commands to manipulate custom controls.
 *
 * Plugin Commands:
 * 	 
 *	 RandomConversation getRandomMsg category topic faceset faceNum		# Get a random dialogue entry with corresponding category, and topic.  Optional faceset and faceNum may be specified.
 *
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.03a - Fixed short-list bug.
 * 1.03  - Category and Topic search now has added case insensitivity mode for more user-friendly usage.
 * 1.02a - Fixed some typos and bugs courtesy of Steffen (Anthony Xue).  Thanks man!  User friendly check added for # args.
 * 1.02  - Added in lastconv check to avoid repeating random dialogue when other entries can be played instead.
 * 1.01a - Common mispelling now detected to be more dev friendly.
 *		 - Finally found out and documented how to add \... codes as in native Messagebox.
 * 1.01  - Faceset and faceNum are now optional parameters.
 * 1.00a - Fixed references to bad element in help.
 * 1.00  - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.RandomConversations = 1;
BBS.RandomConversations = BBS.RandomConversations || {};

(function() {

	// Stores all rumors.
    var _rumors;
	var curCategory;
	var curTopic;
	var lastConv;
	
	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_RandomConversations');
	var pConfiguration	  = String(parameters['Configuration File'] || 'data/Rumors.json');
	var pLowerCaseChecks  = eval(String(parameters['Case Insensitive'] || 'false'));
	var pDebugging		  = eval(String(parameters['Debug Mode'] || 'false'));
	
	//=============================================================================
	// Rumor Class
	//=============================================================================	
	function Rumor() {
		this.initialize.apply(this, arguments);
	};
	
	Rumor.prototype.initialize = function(data) {
		this._id = Number(data.id);
		this._topic = String(data.topic);
		this._category = String(data.category);
		this._dialogue = String(data.dialogue);
		this._availableStr = String(data.available);
		this._restrictionStr = String(data.restriction);
	};
	
	Rumor.prototype._isUnlocked = function() {
		return eval(this._availableStr);
	};
	
	Rumor.prototype._isRestricted = function() {
		return eval(this._restrictionStr);
	};
	
	Rumor.prototype.isAvailable = function() {
		return (this._isUnlocked() && !this._isRestricted());
	};
	
	Rumor.prototype = Object.create(Rumor.prototype);
	Rumor.prototype.constructor = Rumor;
	
	/**
     * Creates rumors from the given data and loads their current state, afterwards.
     */
    var _create = function(data) {
        var temp = [];
        for(var i = 0, max = data.length; i < max; ++i) {
            entry = data[i];
            temp.push(new Rumor(entry));
        }
		
        _rumors = temp;
		curCategory = '';
		curTopic = '';
		lastConv = -1;
		
		if (pDebugging) {
			console.log(_rumors);
		}
    };
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================
    var BBS_RC_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
		// User friendly correction
		if (command === 'RandomConversation') {
			console.log("BBS_RandomConversations plugin command not called correctly.  Did you mean RandomConversations?");
		}
		
        if (command === 'RandomConversations') 
		{
            switch (args[0]) {
				case 'getRandomMsg':
					SceneManager._scene.getRandomDialogue(args);
					break;
			};
        }
		else {
			BBS_RC_Game_Interpreter_pluginCommand.call(this, command, args);
		}
    };
	
    //=============================================================================
    // Game_Temp
    //=============================================================================
	
	/* Tsukihime - Generates a random number from the given interval.
	 You can customize the algorithm used to generate a
	 random number if needed */
	Game_Temp.prototype._generateRandomValue = function(min, max) {
		if (min === max) {
		  return min;
		}
		else {
		  // Maybe you can customize this
		  return Math.floor(Math.random() * (max - min + 1)) + min
		}
	};
	
    //=============================================================================
    // Scene_Map
    //=============================================================================	
	Scene_Map.prototype._createShortlist = function(category, topic) {
		var temp = [];
		this.shortlist = [];
		lastConv = -1;
		
		for (var i = 0; i < _rumors.length; i++) 
		{
			if (_rumors[i]._category === category && _rumors[i]._topic === topic) 
			{
				if (_rumors[i].isAvailable()) {
					temp.push(_rumors[i]);
				}
			}
		}
		
		if (temp.length > 1) {
			// Remove last conversation entry, only if there are sufficient entries to remove it.
			for (var j = 0; j < temp.length; j++) {
				if (temp[j]._id != lastConv) {
					this.shortlist.push(temp[j]);
				}
			}
		}
		else {
			this.shortlist = temp;
		}
		
		// For debugging sake.
		if (this.shortlist.length <= 0) {
			console.log("ERROR: No random conversations options for Category: '" + category + "' ; Topic: '" + topic + "'");
		}

		curCategory = category;
		curTopic = topic;
	};
	
	Scene_Map.prototype.getRandomDialogue = function(args) {
		if (args.length < 2) {
			console.log("ERROR: Too few parameters passed into getRandomMsg(...).  Minimum args: 2.");
		}
		
		var category = String(args[1]);
		var topic = String(args[2]);
		
		// User sanity; remove need for matching capitalization.
		if (pLowerCaseChecks === true) {
			category = category.toLowerCase();
			topic = topic.toLowerCase();
		}
		
		this._createShortlist(category, topic);
		if (this.shortlist.length <= 0) return;
		
		var randomIndex = $gameTemp._generateRandomValue(0, (this.shortlist.length - 1));
		
		$gameMap._interpreter.setWaitMode('message');
		
		if (args.length > 3) {
			var faceFile = String(args[3]);
			
			var faceNum = 0;
			if (args.length > 4) {
				faceNum = Number(args[4]);
			}
			
			$gameMessage.setFaceImage(faceFile, faceNum);
		}
		
		$gameMessage.addText(this.shortlist[randomIndex]._dialogue);
		lastConv = this.shortlist[randomIndex]._id;
	};
	
    //=============================================================================
    // class Scene_Boot
    //=============================================================================
	var BBS_RC_Scene_Boot_create = Scene_Boot.prototype.create;
	Scene_Boot.prototype.create = function() {
        BBS_RC_Scene_Boot_create.call(this);
        this._loadFile(pConfiguration, _create);
    };
    
    Scene_Boot.prototype._loadFile = function(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.overrideMimeType('application/json');
        request.onload = function() { callback(JSON.parse(request.responseText)); }
        request.onerror = function() { throw new Error('There was an error loading the file ' + url); }
        request.send();
    };
	
	var BBS_RC_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return !!_rumors && BBS_RC_Scene_Boot_isReady.call(this);
    };
		
})(BBS.RandomConversations);
//=============================================================================
// End of File
//=============================================================================