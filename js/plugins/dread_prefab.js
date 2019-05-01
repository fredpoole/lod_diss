/*:
 * @plugindesc Reusable events. Stop writing the same event over and over.
 * @author Dreadwing93
 *
 * @param prefab_map
 * @text Prefab Map ID
 * @desc The map id to retrieve prefab events from.
 * @type Number
 * @default 1
 *
 * @help
 * RPG Making typically involves a lot of copying and pasting events.
 * Then, when you want to make a change to one of those events,
 * you have to go through and edit each and every one of those copies.
 * It's an arduous task. There must be a better way.
 *
 * With this plugin, you can prepare reusable events, called "prefabs",
 * and use them on any map. This plugin is good if you will have a lot
 * of nearly identical events in your game. For example, treasure chests.
 * The prefab can also be sent a list of parameters, such as what item
 * is in the treasure chest.
 *
 * Prefabs are loaded from the prefab map. You should specify the id
 * of this map in the parameters to the right. Then if an event has
 * a prefab tag in its note, its data will be replaced by the prefab's
 * data. Prefabs can be referenced by id or name.
 *
 * Let's create a treasure chest prefab. First, create an event on the
 * prefab map and name it "chest". Add a picture and all of the logic
 * you would use in a treasure chest event. Except at the part where
 * you gain the item, use a script something like this:
 * 
 *   $gameParty.gainItem($dataItems[$prefab[1]], $prefab[2]);
 *
 * $prefab refers to the parameter list passed to the prefab.
 *
 * You can pass any parameters you want to the prefab and interpret
 * them however you want. For example, you could use a conditional
 * branch to check if the first parameter is zero, and if is then
 * give the player gold instead of an item.
 * 
 * To use the prefab in a map, just create an empty event and type
 * the prefab tag into the note field. For our treasure chest example,
 * it would look something like this:
 *
 *   <prefab chest 1 2>
 *
 * This will create a treasure chest that gives the player two of item one.
 * Remember, the parameters don't have to be numbers. They are strings, so
 * they could be words or anything else. The only limitation is they are
 * separated by spaces and can't contain a ">" symbol.
 *
 *
 */

(function() {
	window.$prefab = undefined;
	window.$prefabMap = {};
	window.$prefabEvents = {};
	var default_prefab_parameters = [];

	var parameters = PluginManager.parameters('dread_prefab');
	DataManager.loadDataFile('$prefabMap', 'Map%1.json'.format(Number(parameters['prefab_map']).padZero(3)));

	// access prefab parameters

	var override_executeCommand = Game_Interpreter.prototype.executeCommand;
	Game_Interpreter.prototype.executeCommand = function() {
		setPrefab(this._eventId);
		override_executeCommand.apply(this,arguments);
	};

	var override_command205 = Game_Interpreter.prototype.command205;
	Game_Interpreter.prototype.command205 = function() {
		this.character(this._params[0])._moveRouteSetter=this._eventId;
		return override_command205.apply(this,arguments);
	};
	var override_processMoveCommand = Game_Character.prototype.processMoveCommand;
	Game_Character.prototype.processMoveCommand = function(command) {
		if(!this._moveRouteForcing){ setPrefab(this._eventId ); }
		else if(this._moveRouteSetter){ setPrefab(this._moveRouteSetter); }
		override_processMoveCommand.apply(this,arguments);
	};

	function setPrefab(id){
		var event = $gameMap._events[id];
		window.$prefab=event&&event._prefab_parameters||default_prefab_parameters;
	}

	var override_event_init = Game_Event.prototype.initialize;
	Game_Event.prototype.initialize = function(mapId, eventId) {
		override_event_init.apply(this,arguments);
		var tag=/<prefab (.*?)>/i.exec(this.event().note);
		if (tag){
			this._prefab_parameters=tag[1].split(' ');
		}
	};

	// replace event with prefab data

	var override_loadMapData = DataManager.onLoad;
	DataManager.onLoad = function(object) {
		override_loadMapData.apply(this,arguments);
		var i;

		// We're loading a prefab map.
		if (object === $prefabMap){
			for (i=1;i<$prefabMap.events.length;++i){
				if(!$prefabMap.events[i]) continue;
				$prefabEvents[i]=$prefabMap.events[i];
				$prefabEvents[$prefabMap.events[i].name]=$prefabMap.events[i];
			}
		}
		if (object !== $dataMap) return;

		//We're loading a map.
		for (i=1; i<$dataMap.events.length; ++i){
			var event = $dataMap.events[i];
			if (!event) continue;
			if ($prefabMap.events){
				var tag=/<prefab (.*?)>/i.exec(event.note);
				if (tag){
					var id = tag[1].split(' ')[0];
					if ($prefabEvents[id]){
						var old = event;
						event = $dataMap.events[i] = Object.create($prefabEvents[id]);
						event.name=old.name;
						event.note+=' '+old.note;
						event.x=old.x;
						event.y=old.y;
					}else console.warn("No prefabs with id "+id);
				}
			}else console.warn("Prefab Map not loaded yet! This could cause problems...");
		}
	};

})();
