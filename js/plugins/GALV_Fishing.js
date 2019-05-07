//-----------------------------------------------------------------------------
//  Galv's Fishing Mini Game
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_Fishing.js
//-----------------------------------------------------------------------------
//  2017-06-24 - Version 1.6 - fixed Confirm button not skipping fish caught
//                           - info window
//  2017-04-01 - Version 1.5 - fixed touch/mouse requirements that I missed!
//  2017-03-09 - Version 1.4 - added touch/mouse to cast rod.
//  2016-12-25 - Version 1.3 - fixed bug when gaining an item with custom catch
//                             text. Fixed a bug where static 'fish' didn't 
//                             go down to their original level (eg. sink to the
//                             bottom if a chest)
//  2016-11-21 - Version 1.2 - fixed bug when fishing from a vehicle
//  2016-11-12 - Version 1.1 - bug with gaining fish item when caught fixed
//  2016-10-30 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_Fishing = true;

var Galv = Galv || {};          // Galv's main object
Galv.FISH = Galv.FISH || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.6) Fishing mini game that runs in it's own scene. For advanced users.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param --- GRAPHICS ---
 * @desc
 * @default
 *
 * @param Surface Y
 * @desc The y position of the surface graphic. (surface graphic is 170px high)
 * @default 185
 * 
 * @param Fisher Info
 * @desc The position of the fisher
 * x,y
 * @default 730,150
 * 
 * @param Fisher Rod XY Offset
 * @desc The offset position for rod based on fisher
 * x,y
 * @default -8,-25
 * 
 * @param Default Rod Graphic
 * @desc Image name located in /img/fishing/ for fishing rod over the fisher
 * @default rod
 * @require 1
 * @dir img/system/
 * @type file
 * 
 * @param Default Bait Graphic
 * @desc Image name located in /img/fishing/ for bait in the water
 * @default bait
 * @require 1
 * @dir img/system/
 * @type file
 * 
 * @param Equip Slot Graphic
 * @desc The slot image for where bait and rods icons are displayed
 * @default equipslot
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Rod Equip XY
 * @desc The position for the rod equip slot
 * x,y
 * @default 40,40
 *
 * @param Bait Equip XY
 * @desc The position for the rod equip slot
 * x,y
 * @default 100,40
 *
 * @param No Rod Text
 * @desc Text displayed where equipped rod icon is when no rod equipped
 * @default Rod
 *
 * @param No Bait Text
 * @desc Text displayed where equipped bait icon is when no bait equipped
 * @default Bait
 *
 * @param No RodBait Text Size
 * @desc The size of the above No Rod and No Bait text.
 * @default 14
 *
 * @param Cast Power Graphic
 * @desc Image name located in /img/fishing/ for cast power spritesheet graphic
 * @default castpower
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Cast Power Frames
 * @desc Number of frames in cast power graphic
 * @default 11
 *
 * @param Cast Pow XY
 * @desc The position for the cast power graphic
 * x,y
 * @default 410,200
 *
 * @param Splash Graphic
 * @desc Image name located in /img/fishing/ for the splash graphic
 * @default splash
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param -- SOUND/ANIM --
 * @desc 
 * @default
 *
 * @param Default Music
 * @desc Music played when in fishing scene
 * name,volume,pitch
 * @default Field1,80,100
 *
 * @param Rod Equip SE
 * @desc Sound effect when equipping a rod
 * name,volume,pitch
 * @default Equip1,80,100
 *
 * @param Bait Equip SE
 * @desc Sound effect when equipping bait
 * name,volume,pitch
 * @default Equip1,80,100
 *
 * @param Cast SE
 * @desc Sound effect when casting rod
 * name,volume,pitch
 * @default Wind4,80,120
 *
 * @param Reel SE
 * @desc Sound effect that repeats when reeling line in
 * name,volume,pitch
 * @default 
 *
 * @param Splash SE
 * @desc Sound effect when bait lands in water
 * name,volume,pitch
 * @default Water1,80,140
 *
 * @param Hooked Anim
 * @desc The animation Id played on a fish when hooked
 * @default 1
 *
 * @param Break Anim
 * @desc The animation Id played on a fish when the line breaks
 * @default 1
 *
 * @param Player Catch Anim
 * @desc The default animation Id played on player when a fish is caught
 * @default 0
 *
 * @param --- MENU ---
 * @desc 
 * @default
 *
 * @param Menu Pos
 * @desc Position of the menu.
 * x,y,width
 * @default 288,200,240
 *
 * @param Cast Text
 * @desc Menu text for casting the line
 * @default Cast Line
 *
 * @param Equip Rod Text
 * @desc Menu text for equipping different rods
 * @default Equip Rod
 *
 * @param Equip Bait Text
 * @desc Menu text for equipping different bait
 * @default Equip Bait
 *
 * @param Leave Text
 * @desc Menu text for leaving the fishing scene
 * @default Stop Fishing
 *
 * @param Catch Window
 * @desc Position and size of the catch info window.
 * x,y,width,height
 * @default 200,160,420,180
 *
 * @param Caught Text
 * @desc If no custom text, this text will be followed by the item name
 * @default You caught a
 *
 * @param Equip Window Width
 * @desc Width of the equip rod/bait window
 * @default 72
 *
 * @param Equip Window Cols
 * @desc Number of bait/rod item icons in a row
 * @default 1
 *
 * @param Length Text
 * @desc The name of what you want 'length' to be called
 * @default Length
 *
 * @param Weight Text
 * @desc The name of what you want 'weight' to be called
 * @default Weight
 *
 * @param -- RECORDS --
 * @desc 
 * @default
 *
 * @param Record Title
 * @desc The title at the top of the records scene
 * @default FISH STATS
 *
 * @param Record Types
 * @desc Text next to info of how many fish types caught
 * @default Fish Types
 *
 * @param Record Total
 * @desc Text next to how many fish have been caught total
 * @default Total Caught
 *
 * @param Record Fish
 * @desc Text next to the largest fish caught
 * @default Record Fish
 *
 * @param Record Fish Number
 * @desc Text next to the number of selected fish caught
 * @default Number Caught
 *
 * @param Record Fish Length
 * @desc Text next to the record length of selected fish caught
 * @default Record Length
 *
 * @param Record Fish Weight
 * @desc Text next to the record weight of selected fish caught
 * @default Record Weight
 *
 * @param Record Scene Padding
 * @desc Padding surround the record scene.
 * @default 0
 *
 * @param Record Fish Y
 * @desc The Y position of the fish displayed in record scene
 * @default 150
 *
 * @param Record Fish Scale
 * @desc The size of the fish sprite in record scene (1 is 100%)
 * @default 1
 *
 * @param --- FISH ---
 * @desc
 * @default
 *
 * @param Fish 1
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default Name,5,0,1,2|8,-1,23,1|2|3,30|2,true,140|310,23|52,,0,0
 *
 * @param Fish 2
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 3
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 4
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 5
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 6
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 7
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 8
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 9
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 10
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 11
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 12
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 13
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 14
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 15
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 16
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 17
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 18
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 19
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 20
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 21
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 22
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 23
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 24
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 25
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 26
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 27
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 28
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 29
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 30
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 31
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 32
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 33
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 34
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 35
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 36
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 37
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 38
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 39
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 40
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 41
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 42
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 43
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 44
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 45
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 46
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 47
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 48
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 49
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @param Fish 50
 * @desc img,speed,pull,move,lvl|lvl,x,item,bait|bait|bait,range|range,stats,length|length,weight|weight,ctxt,cevent,anim
 * @default
 *
 * @help
 *   Galv's Fishing Mini Game
 * ----------------------------------------------------------------------------
 * This plugin adds a fishing mini game where the player can catch fish. It's
 * not plug-and-play and requires a lot of setting up. Make sure to read all
 * the plugin settings as they contain a lot of options you can tweak.
 *
 * The demo has examples of the mini game setup and working, however it is up
 * to you as a developer to trial and error and decide on the best rod strength
 * as well as fish pull strength and detect/take to use to balance it for your
 * players.
 *
 * INFORMATION:
 *
 * 1. New folder
 * A new folder is required in your project: /img/fishing/
 * This is where graphics related to fishing are kept. Use the images in the
 * plugin demo or as templates to create your own.
 * 
 * 2. Fishing spots aka ponds
 * The mini game works by using an event that contains a bunch of script calls
 * that can randomly build a list of fish that will appear in the fishing spot.
 * Once the fish list script calls have run, then the script call to run the
 * fishing mini game is used.
 *
 * 3. Creating fish
 * In the plugin settings there are a lot of listings to use to create fish
 * with different attributes. Each fish has a number (eg. Fish 1) and this
 * number will be used when choosing which fish to add to a pond.
 * NOTE: These "Fish" can be used for any object under the water such as
 * chests, rocks, monsters. They are all classified as "Fish".
 *
 * The fish settings are separated by commas, and in case of settings with
 * multiple values those values are separated by a |.
 *
 * img,spd,pull,move,lvl,x,item,baits,range,stats,length,weight,ctxt,cevent,anim
 *
 * img    = the image used from /img/fishing/ folder. (Fish can be any size)
 * spd    = the swim speed of the fish.
 * pull   = the higher their pull, the more difficult it is to reel in and
 *          the quicker the line will break. Stronger rods will be able to
 *          pull in fish with a higher pull more easily.
 * move   = A number to determine how the fish moves.
 *          -1 unmovable - use for things like rocks to snag the line
 *                       - will constantly stress the line when reeling in
 *           0 inanimate - used for things like chests or quest items
 *                       - will constantly stress the line when reeling in
 *                       - will move to their starting Y position if pulled
 *                       - away from it (eg. sink if starts at bottom)
 *           1 passive   - normal fish movement
 *                       - will stress the line only when fish is pulling
 *           2 erratic   - fish changes direction more often
*                          will stress the line only when fish is pulling
 * lvl    = low|high - where the fish can swim. 10 = ground, 0 = water surface
 *          eg: 0|10
 * x      = 0 far left, 10 far right, -1 for random.
 *          the fish will start in this x position.
 * item   = the item id that will be gained if the fish is caught
 * baits  = id|id|id - a list of bait id's that the fish will eat.
 *          It will ignore any other bait that doesn't have one of those id's
 *          eg: 3|5|6|10
 * range  = detect|take - detect is the distance from bait a fish will notice
 *                        take is the distance from bait a fish will bite
 *          eg: 20|2
 * stats  = true or false if fish is to display in stats window
 * length = low|high - For fish stats - A random number between low & high
 *          eg: 40|80
 * weight = low|high - For fish stats - A random number between low & high
 *          eg: 10|23
 * ctxt   = text displayed instead of the item name when catching a fish and
 *          when displayed in the fish stat scene.
 * cevent = When this fish is caught, it will exit fishing and run common event
 * anim   = animation id played instead of default when caught
 *
 * 4. Fishing
 * In order to cast a rod and start fishing, the player must equip both a rod
 * and a bait. These are items with certain notetags (further down). Rods can
 * have a power value to make them faster or better at reeling fish in and bait
 * has a sink speed and baitId that is used to determine what fish will eat it.
 *
 * When reeling in, the player can hold down the 'ok' button or the right
 * arrow. Reeling a fish in that is pulling on the line causes the line stress
 * and the player must manage the stress of the line by trying not to reel
 * while the fish is pulling the opposite direction. Once a fish is pulled all
 * the way to the right and at the surface of the pond, it is caught and the
 * player obtains the specified item and the fish's stats are recorded.
 *
 * 5. Spritesheets
 * The fishing rod spritesheet uses a bunch of rows to show fishing.
 * 1. Standing idle
 * 2. Casting
 * 3. Reeling in (normal)
 * 4. Not reeling (normal)
 * 5. Reeling in (while fish pulling)
 * 6. Not reeling (while fish pulling)
 *
 * The fish spritesheets (remember 'fish' is a term for all objects here)
 * uses 4 frames in a single row to animate.
 *
 * The splash spritesheet works the same but uses 5 frames
 *
 * The casting spritesheet works the same but frames are specified in the
 * plugin settings and can be changed to look however you like.
 *
 * 6. Fish Stats
 * Fish are only added to the stats scene if they have their stats setting set
 * to true. The scene will display the name of the ITEM obtained from a fish
 * in the stat scene or if no item, the name of the GRAPHIC for the fish.
 *
 * Fish stats can be obtained and stored in game variables to use in dialogue
 * during your game. See below in script calls section for that.
 *
 * ----------------------------------------------------------------------------
 *    Note Tags for ITEMS
 * ----------------------------------------------------------------------------
 *
 *   <rod:x>       // specify an item as a rod with x being rod strength
 *   <rodImg:x>    // image to use from /img/fishing/ folder. Leave out to use
 *                 // the default rod graphic from plugin settings
 *
 *   <bait:x>      // specify an item as bait with a number id that is used to
 *                 // determine which fish will take the bait.
 *   <baitImg:x>   // image to use from /img/fishing/ folder. Leave out to use
 *                 // the default bait graphic from plugin settings
 *   <baitSink:x>  // How quickly the bait sinks. eg. 0.5 is slow, 3 is fast
 *                 // Defaults to 1 if left blank
 *
 * ----------------------------------------------------------------------------
 *    Note Tags for ACTORS
 * ----------------------------------------------------------------------------
 * If the 'Fisher Rod XY Offset' values do not work for every actor you have
 * (perhaps you have different size character graphics) then you can use these
 * two note tags to override the plugin settings for certain actors:
 *
 *   <rod_x:x>     // override the Fisher Rod XY Offset X value
 *   <rod_y:y>     // override the Fisher Rod XY Offset Y value
 *
 * ----------------------------------------------------------------------------
 *    SCRIPT for CONDITIONAL BRANCH
 * ----------------------------------------------------------------------------
 *
 *   Galv.FISH.hasData(id)   // checks if the player has caught fish with id
 *
 *
 * ----------------------------------------------------------------------------
 *    SCRIPT for CONTROL VARIABLES
 * ----------------------------------------------------------------------------
 *
 *   Galv.FISH.data(id,'data')  // returns data for fish with id. data can be:
 *                              // 'weight', 'length', 'amount'
 *
 *   Galv.FISH.totalCaught()    // returns total number of all fish caught
 *
 * ----------------------------------------------------------------------------
 *    EVENT SCRIPT CALLS
 * ----------------------------------------------------------------------------
 * Fish added to the pond will remain in the fish list for the fishing scene.
 * Catching fish will not remove them from the fishing scene permanently, they
 * will be returned when exiting and re-entering the scene again. You must
 * clear the pond in order to create a new fish list for the fishing scene.
 *
 *    Galv.FISH.addFish(x,x,x);   // Add specified fish id's to the pond. Any
 *                                // amount can be added separated by commas.
 *
 *    Galv.FISH.randFish(id,min,max); // Add random amount of a fish id to pond
 *
 *    Galv.FISH.clearPond();    // Clears all added fish from the pond.
 *
 *    Galv.FISH.run();   // starts fishing scene. Do a fadeout event command
 *                       // before this for fading transition.
 *
 *    Galv.FISH.viewStats();  // view the fish stat scene
 *
 *    $gamePlayer._rodEquipped = x;   // equip player with item id x for rod
 *                                    // (MUST BE A ROD ITEM  WITH ROD TAG!)
 *    $gamePlayer._baitEquipped = x;  // equip player with item id x for bait
 *                                    // (MUST BE A BAIT ITEM WITH BAIT TAG!)
 *
 *    Galv.FISH.changePond(setting,value);  // Can change pond settings (below)
 *          default settings:
 *          - 'bg'            'back1'       img in /img/fishing/ folder
 *          - 'surface'       'surface1'    img in /img/fishing/ folder
 *          - 'under'         'under1'      img in /img/fishing/ folder
 *          - 'underOverlay'  'under1_1'    img in /img/fishing/ folder
 *          - 'land'          'land1'       img in /img/fishing/ folder
 *          - 'splash'        'splash'      anim in /img/fishing/ folder
 *          - 'speed'         [0.3,0.3,1]   [bg,surface,underOverlay] scroll
 *          - 'music'         {name:'Field1',pan:0,pitch:100,volume:80};
 *
 * EXAMPLES:
 * Galv.FISH.changePond('bg','back2');   // change the background image
 * Galv.FISH.changePond('speed',[0,0,0.5]);  // change scroll speed for bgs
 * Galv.FISH.changePond('music',{name:'Field1',pan:0,pitch:100,volume:80});
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

var txt = '';
Galv.FISH.surfaceY = Number(PluginManager.parameters('GALV_Fishing')["Surface Y"]);

txt = PluginManager.parameters('GALV_Fishing')["Fisher Info"].split(",");
Galv.FISH.fisherInfo = {
	x: Number(txt[0]),
	y: Number(txt[1]),
	dir: txt[2] || 'left'
};

txt = PluginManager.parameters('GALV_Fishing')["Fisher Rod XY Offset"].split(",");
Galv.FISH.rodInfo = {
	x: Number(txt[0]),
	y: Number(txt[1]),
	dir: txt[2] || 'left'
};

txt = PluginManager.parameters('GALV_Fishing')["Menu Pos"].split(",");
Galv.FISH.menu = {
	x: Number(txt[0]),
	y: Number(txt[1]),
	width: Number(txt[2]),
};

txt = PluginManager.parameters('GALV_Fishing')["Catch Window"].split(",");
Galv.FISH.catchWindow = {
	x: Number(txt[0]),
	y: Number(txt[1]),
	width: Number(txt[2]),
	height: Number(txt[3])
};

txt = PluginManager.parameters('GALV_Fishing')["Rod Equip XY"].split(",");
Galv.FISH.rodXY = {
	x: Number(txt[0]),
	y: Number(txt[1])
};

txt = PluginManager.parameters('GALV_Fishing')["Bait Equip XY"].split(",");
Galv.FISH.baitXY = {
	x: Number(txt[0]),
	y: Number(txt[1])
};

txt = PluginManager.parameters('GALV_Fishing')["Cast Pow XY"].split(",");
Galv.FISH.castPowXY = {
	x: Number(txt[0]),
	y: Number(txt[1])
};

Galv.FISH.txtLength = PluginManager.parameters('GALV_Fishing')["Length Text"];
Galv.FISH.txtWeight = PluginManager.parameters('GALV_Fishing')["Weight Text"];



// SOUND OBJECTS
Galv.FISH.makeSE = function(arr) {
	return {name:arr[0],pan:0,pitch:Number(arr[2]),volume:Number(arr[1])};
};

txt = PluginManager.parameters('GALV_Fishing')["Default Music"].split(",");
Galv.FISH.defaultMusic = Galv.FISH.makeSE(txt);

txt = PluginManager.parameters('GALV_Fishing')["Rod Equip SE"].split(",");
Galv.FISH.rodEquipSE = Galv.FISH.makeSE(txt);

txt = PluginManager.parameters('GALV_Fishing')["Bait Equip SE"].split(",");
Galv.FISH.baitEquipSE = Galv.FISH.makeSE(txt);

txt = PluginManager.parameters('GALV_Fishing')["Cast SE"].split(",");
Galv.FISH.castSE = Galv.FISH.makeSE(txt);

txt = PluginManager.parameters('GALV_Fishing')["Reel SE"].split(",");
Galv.FISH.reelSE = Galv.FISH.makeSE(txt);

txt = PluginManager.parameters('GALV_Fishing')["Splash SE"].split(",");
Galv.FISH.splashSE = Galv.FISH.makeSE(txt);

Galv.FISH.hookedAnim = Number(PluginManager.parameters('GALV_Fishing')["Hooked Anim"]);
Galv.FISH.breakAnim = Number(PluginManager.parameters('GALV_Fishing')["Break Anim"]);
Galv.FISH.pCatchAnim = Number(PluginManager.parameters('GALV_Fishing')["Player Catch Anim"]);


// END SOUND OBJECTS



Galv.FISH.splashImg = PluginManager.parameters('GALV_Fishing')["Splash Graphic"];
Galv.FISH.splashFrames = 5;

Galv.FISH.baitImg = PluginManager.parameters('GALV_Fishing')["Default Bait Graphic"];
Galv.FISH.baitFrames = 4;

Galv.FISH.powImg = PluginManager.parameters('GALV_Fishing')["Cast Power Graphic"];
Galv.FISH.powFrames = PluginManager.parameters('GALV_Fishing')["Cast Power Frames"];

Galv.FISH.rodImg = PluginManager.parameters('GALV_Fishing')["Default Rod Graphic"];

Galv.FISH.fishFrames = 4;

Galv.FISH.equipSlot = PluginManager.parameters('GALV_Fishing')["Equip Slot Graphic"];
Galv.FISH.noRodTxt = PluginManager.parameters('GALV_Fishing')["No Rod Text"];
Galv.FISH.noBaitTxt = PluginManager.parameters('GALV_Fishing')["No Bait Text"];

Galv.FISH.noTxtSize = Number(PluginManager.parameters('GALV_Fishing')["No RodBait Text Size"]);


Galv.FISH.castText = PluginManager.parameters('GALV_Fishing')["Cast Text"];
Galv.FISH.equipRodText = PluginManager.parameters('GALV_Fishing')["Equip Rod Text"];
Galv.FISH.equipBaitText = PluginManager.parameters('GALV_Fishing')["Equip Bait Text"];
Galv.FISH.leaveText = PluginManager.parameters('GALV_Fishing')["Leave Text"];
Galv.FISH.caughtText = PluginManager.parameters('GALV_Fishing')["Caught Text"];


Galv.FISH.eWinWidth = Number(PluginManager.parameters('GALV_Fishing')["Equip Window Width"]);
Galv.FISH.eWinCols = Number(PluginManager.parameters('GALV_Fishing')["Equip Window Cols"]);
Galv.FISH.fadeSpeed = 30;

Galv.FISH.rTitle = PluginManager.parameters('GALV_Fishing')["Record Title"];
Galv.FISH.rTypes = PluginManager.parameters('GALV_Fishing')["Record Types"];
Galv.FISH.rTotal = PluginManager.parameters('GALV_Fishing')["Record Total"];
Galv.FISH.rFish = PluginManager.parameters('GALV_Fishing')["Record Fish"];
Galv.FISH.rFishNumber = PluginManager.parameters('GALV_Fishing')["Record Fish Number"];
Galv.FISH.rFishLength = PluginManager.parameters('GALV_Fishing')["Record Fish Length"];
Galv.FISH.rFishWeight = PluginManager.parameters('GALV_Fishing')["Record Fish Weight"];
Galv.FISH.rPadding = Number(PluginManager.parameters('GALV_Fishing')["Record Scene Padding"]);

Galv.FISH.rFishPosY = Number(PluginManager.parameters('GALV_Fishing')["Record Fish Y"]);
Galv.FISH.rFishScale = Number(PluginManager.parameters('GALV_Fishing')["Record Fish Scale"]);


// FISH OBJECTS
Galv.FISH.fishTotal = 0;
Galv.FISH.fish = {};
// fish id key and object built for each fish below.
// img,speed,pull,move,level,x,item,baits,range,stats,length,weight,ctxt,cevent,se


Galv.FISH.createFish = function(id,txt) {
	var a = txt.split(",");
	var lvl = a[4].split("|");
	var baits = a[7].split("|");
	for (var i = 0; i < baits.length; i++) {
		baits[i] = Number(baits[i]);
	}
	var range = a[8].split("|");
	var length = a[10].split("|");
	var weight = a[11].split("|");
	
	Galv.FISH.fish[id] = {
		graphic: a[0],                    // the image used from /Graphics/GFish/ folder.
		speed: Number(a[1]) * 0.1,              // the swim speed of the fish. 10? is default.
		pull: Number(a[2]),               //the higher their pull, the more difficult it is to reel in and quicker the line will break.
		move: Number(a[3]),               // -1 = unmovable, 0 = inanimate, 1 = passive, 2 = erratic
		level: [Number(lvl[0]),Number(lvl[1])],   // ARRAY [lowest,highest] fish swims. 0 = ground, 10 = water surface
		x: Number(a[5]),                  // the fish will start in this x position. -1 is random.
		item: Number(a[6]),               // the item id that will be gained if fish is caught
		baits: baits.slice(0),            // ARRAY list of bait types that the fish will eat.
		range: [Number(range[0]),Number(range[1])],              // ARRAY [detect,take] distance from bait a fish will detect and take it default is detect 20, take 2.
		stats: a[9].toLowerCase() == 'true' ? true : false,      // true or false if fish is to display in stats window
		length: [Number(length[0]),Number(length[1])],           // no gameplay effect. For fish stats only. rand between [min,max]
		weight: [Number(weight[0]),Number(weight[1])],           // no gameplay effect. For fish stats only. rand between [min,max]
		customText: a[12],                                       // text displayed instead of the item name when catching a fish and in the fish stat scene.
		cevent: Number(a[13]),                                   // When this fish is caught, it will exit and run common event
		anim: Number(a[14])                                      // animation Id played on player instead of default
	};
	if (Galv.FISH.fish[id].stats) Galv.FISH.fishTotal += 1;
};

// Build all fish in plugin settings
var i = 1;
while (i) {
	txt = PluginManager.parameters('GALV_Fishing')["Fish " + i];
	if (txt != undefined) {
		if (txt.length > 0) Galv.FISH.createFish(i,txt);
		i += 1;
	} else {
		i = 0;
	}
}


Galv.FISH.cacheAll = function() {
	// cache all fish, animations, bgs here (although most done on load
	ImageManager.loadFishGraphic(Galv.FISH.equipSlot);
	ImageManager.loadFishGraphic(Galv.FISH.powImg);
	ImageManager.loadFishGraphic(Galv.FISH.splashImg);
};

Galv.FISH.bait = null;

Galv.FISH.clearPond = function() {
	$gameSystem.fishing.hole.fish = [];
};

Galv.FISH.addFish = function() {
	for (var i = 0; i < arguments.length; i++) {
		$gameSystem.fishing.hole.fish.push(arguments[i]);
	}
};

Galv.FISH.randFish = function(id,min,max) {
	var amount = Math.floor((Math.random() * (max - min + 1)) + min);
	for (var i = 0; i < amount; i++) {
		$gameSystem.fishing.hole.fish.push(id);
	}
};

Galv.FISH.addRecords = function(fishId,length,weight) {
	if (Galv.FISH.fish[fishId].stats) {
		$gameSystem.fishing.caught[fishId] = $gameSystem.fishing.caught[fishId] || {id:fishId,amount:0,length:0,weight:0};
		$gameSystem.fishing.caught[fishId].amount += 1;
		$gameSystem.fishing.caught[fishId].length = Math.max(length,$gameSystem.fishing.caught[fishId].length);
		$gameSystem.fishing.caught[fishId].weight = Math.max(weight,$gameSystem.fishing.caught[fishId].weight);
		
		// set record fish data if bigger
		if (length > $gameSystem.fishing.recordFish.length) {
			$gameSystem.fishing.recordFish.id = fishId;
			$gameSystem.fishing.recordFish.length = length;
			$gameSystem.fishing.recordFish.weight = weight;
		}
	}
};

Galv.FISH.run = function() {
	Galv.FISH.savedBgm = AudioManager.saveBgm();
	Galv.FISH.savedBgs = AudioManager.saveBgs();
	Galv.FISH.checkEquips($gamePlayer);
	$gameScreen._brightness = 0;
	SceneManager.push(Scene_Fishing);
	return false;
};

Galv.FISH.viewStats = function() {
	SceneManager.push(Scene_FishRecords);
	return false;
};

Galv.FISH.checkEquips = function(fisher) {
	// if player has equipped rod or bait that has been removed from inventory - removed them from player equip
	var rodId = fisher._rodEquipped;
	if (rodId && $gameParty.numItems($dataItems[rodId]) <= 0) fisher._rodEquipped = null;
	var baitId = fisher._baitEquipped;
	if (baitId && $gameParty.numItems($dataItems[baitId]) <= 0) fisher._baitEquipped = null;
};


Galv.FISH.hasData = function(id) {
	if (id <= 0) id = $gameSystem.fishing.recordFish.id;
	return $gameSystem.fishing.caught[id];
};

Galv.FISH.data = function(id,data) {
	if (id <= 0) id = $gameSystem.fishing.recordFish.id;
	if (data == 'name') {
		return data.item ? $dataItems[Galv.FISH.fish[id].item].name : data.graphic;
	}
	return $gameSystem.fishing.caught[id] ? $gameSystem.fishing.caught[id][data] : 0;
};

Galv.FISH.changePond = function(setting,value) {
	$gameSystem.fishing.hole[setting] = value;
};

Galv.FISH.totalCaught = function() {
	var list = $gameSystem.fishing.caught;
	var amount = 0;
	for (var obj in list) {
		if (list[obj] && list[obj].amount) amount += list[obj].amount;
	};
	return amount;
};

Galv.FISH.fishName = function(fishId) {
	var data = Galv.FISH.fish[fishId];
	if (data.item) {
		var item = $dataItems[data.item];
		var txt = item.name;
	} else {
		var txt = data.graphic;
	}
	return txt;
};


//-----------------------------------------------------------------------------
// GRAPHICS FOLDER
//-----------------------------------------------------------------------------
ImageManager.loadFishGraphic = function(filename, hue) {
    return this.loadBitmap('img/fishing/', filename, hue, true);
};


//-----------------------------------------------------------------------------
// GAME SYSTEM
//-----------------------------------------------------------------------------

Galv.FISH.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.FISH.Game_System_initialize.call(this);
	this.fishing = {
		recordFish: {id:0,weight:0,length:0},
		caught: {},   // fish ID's caught, amount caught, record of biggest catch
					  // id: {amount:x,recordWidth:x,recordHeight:x}
		hole: {       // settings for current fishing hole (fish, music, background, etc.)
			bg: 'back1',
			surface: 'surface1',
			under: 'under1',
			underOverlay: 'under1_1',
			land: 'land1',
			splash: Galv.FISH.splashImg,
			speed: [0.3,0.3,1],
			surfaceY: Galv.FISH.surfaceY,
			baitY: Galv.FISH.surfaceY + 20,
			music: Galv.FISH.defaultMusic,
			fish: []  // list of fish in current hole
		},
		player: {
			x: Number(Galv.FISH.fisherInfo.x),
			y: Number(Galv.FISH.fisherInfo.y),
			poleX: 0,
			poleY: 0,
			dir: Galv.FISH.fisherInfo.dir.toLowerCase() == 'left' ? 4 : 6,
			pole: null,
			bait: null,
		}
	};
};


//-----------------------------------------------------------------------------
// GAME PLAYER
//-----------------------------------------------------------------------------

Galv.FISH.Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
	Galv.FISH.Game_Player_initMembers.call(this);
	this._rodEquipped = null;
	this._baitEquipped = null;
};


//-----------------------------------------------------------------------------
// SCENE BOOT
//-----------------------------------------------------------------------------

Galv.FISH.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
	Galv.FISH.Scene_Boot_loadSystemImages.call(this);
	Galv.FISH.cacheAll();
};

})();



//-----------------------------------------------------------------------------


//                                  SCENE


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// SCENE FISHING
//-----------------------------------------------------------------------------

function Scene_Fishing() {
    this.initialize.apply(this, arguments);
}

Scene_Fishing.prototype = Object.create(Scene_Base.prototype);
Scene_Fishing.prototype.constructor = Scene_Fishing;

Scene_Fishing.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	this.createVars();
	this.createSpriteset();
	this.createWindows();
	this.createCastPow();
	AudioManager.playBgm($gameSystem.fishing.hole.music);
};

Scene_Fishing.prototype.createVars = function() {
	Galv.FISH.commonEvent = false;
	Galv.FISH.fisher = JsonEx.makeDeepCopy($gamePlayer);
	Galv.FISH.fisher.setTransparent(false);
	Galv.FISH.fisher.rodRow = 0;
	Galv.FISH.fisher.fishPull = 0;
	this._phase = 'p0';
	this._phaseTimer = 0;
	this._fishing_pattern = 1;
	this._lineStrength = 0;
	this._rodPow = 0;
	Galv.FISH.pond = this.createPond();
	this.createFish();
	this._reelX = 0;
	this._reelY = 0;
};

Scene_Fishing.prototype.createPond = function() {
	var obj = {};
	switch($gameSystem.fishing.player.dir) {
		case 4: // left
			var x = 15;
			var y = $gameSystem.fishing.hole.baitY;

			obj.x = x;
			obj.y = y;
			obj.width = $gameSystem.fishing.player.x - x - 20;
			obj.height = Graphics.boxHeight - y - 40;
			obj._floor = y + obj.height;
			obj._endX = obj.x + obj.width;
			obj._surfaceY = obj.y + 50;
	}
	return obj;
};

Scene_Fishing.prototype.createFish = function() {
	Galv.FISH.fishList = [];
	var fishies = $gameSystem.fishing.hole.fish;
	for (var i = 0; i < fishies.length; i++) {
		Galv.FISH.fishList[i] = new Game_Fish(i,fishies[i]);
	}
};

Scene_Fishing.prototype.createSpriteset = function() {
	this._spriteset = new Spriteset_Fishing();
    this.addChild(this._spriteset);	
};

Scene_Fishing.prototype.createWindows = function() {
	this.createWindowLayer();
	
	// command window
	this._commandWindow = new Window_FishCommand();
	this._commandWindow.setHandler('cast',   this.commandCast.bind(this));
	this._commandWindow.setHandler('rod',   this.commandRod.bind(this));
	this._commandWindow.setHandler('bait',   this.commandBait.bind(this));
	this._commandWindow.setHandler('leave',   this.commandLeave.bind(this));

	// equip window
	var wy = Galv.FISH.menu.y;
	var ww = Galv.FISH.eWinWidth;
	var wx = Galv.FISH.menu.x + Galv.FISH.menu.width - ww;
	var wh = this._commandWindow.height;
	this._equipWindow = new Window_FishEquip(wx,wy,ww,wh);
	this._equipWindow._cmdWindow = this._commandWindow;
	this._equipWindow.setHandler('ok',     this.onEquipOk.bind(this));
	this._equipWindow.setHandler('cancel',    this.equipCancel.bind(this));
	
	// help window
	var wx = this._commandWindow.x;
	var wy = this._commandWindow.y + this._commandWindow.height;
	var ww = this._commandWindow.width + this._equipWindow.width;
	this._helpWindow = new Window_FishHelp(wx,wy,ww);
	this._equipWindow.setHelpWindow(this._helpWindow);
	
	// display window
	this._displayWindow = new Window_FishDisplay();
	this._displayWindow.hide();
	
	// caught window
	this._caughtWindow = new Window_FishCaught();
	this._caughtWindow.close();
	
	// create windows
	this.addChild(this._displayWindow); // added as child so as not to be overwritten
    this.addWindow(this._helpWindow);
	this.addWindow(this._equipWindow);	
	this.addWindow(this._commandWindow);
	this.addWindow(this._caughtWindow);
	
};

Scene_Fishing.prototype.createCastPow = function() {
	this._castPow = new Sprite_CastPow();
	this._castPow.opacity = 0;
	this.addWindow(this._castPow);
};

Scene_Fishing.prototype.activateEquipWindow = function(type) {
	this._equipWindow.activate();
	this._equipWindow.select(0);
	this._commandWindow.deactivate();
	this._helpWindow.show();
};

Scene_Fishing.prototype.commandRod = function() {
	this.activateEquipWindow();
};

Scene_Fishing.prototype.commandBait = function() {
	this.activateEquipWindow();
};

Scene_Fishing.prototype.onEquipOk = function() {
    this._equipWindow.doEquip();
	this._equipWindow.activate();
	this._displayWindow.refresh();
	this._commandWindow.refresh();
	this.refreshGear();
};

Scene_Fishing.prototype.equipCancel = function() {
	this._equipWindow.deactivate();
	this._equipWindow.select(-1);
	this._commandWindow.activate();
	this._helpWindow.hide();
};

Scene_Fishing.prototype.commandLeave = function() {
	$gameScreen.startFadeOut(Galv.FISH.fadeSpeed);
	this.closeWindows();
	this.setPhase('pEnd');
};

Scene_Fishing.prototype.commandCast = function() {
	this.closeWindows(true);
	this.setPhase('p2');
	this._castPow.display(true);
};

Scene_Fishing.prototype.openWindows = function() {
	this._commandWindow.open();
	this._equipWindow.open();
	this._displayWindow.show();
	this._castPow.display(false);
};

Scene_Fishing.prototype.closeWindows = function(notDisplay) {
	this._commandWindow.deactivate();
	this._commandWindow.close();
	this._equipWindow.deactivate();
	this._equipWindow.close();
	this._helpWindow.hide();
	if (!notDisplay) this._displayWindow.hide();
};

Scene_Fishing.prototype.endScene = function() {
	SceneManager.goto(Scene_Map);
	$gameScreen.startFadeIn(Galv.FISH.fadeSpeed);
	AudioManager.replayBgm(Galv.FISH.savedBgm);
	AudioManager.replayBgs(Galv.FISH.savedBgs);
	if (Galv.FISH.commonEvent) $gameTemp.reserveCommonEvent(Galv.FISH.commonEvent);
};

Scene_Fishing.prototype.setPhase = function(phase) {
	this._phase = phase;
	this._phaseTimer = 0;
};

Scene_Fishing.prototype.refreshGear = function() {
	this._spriteset._fisher.refreshRod();
	this._spriteset._baitSprite.setBitmap();
};

// ----- UPDATING

Scene_Fishing.prototype.update = function() {
	Scene_Base.prototype.update.call(this);
	this.gameUpdate();
};

Scene_Fishing.prototype.gameUpdate = function() {
	$gameScreen.update();
	this[this._phase]();
	this._phaseTimer += 1;
};

Scene_Fishing.prototype.updateFishIdle = function() {
	for (var i = 0; i < Galv.FISH.fishList.length; i++) {
		Galv.FISH.fishList[i].updateIdle();
	}
};

Scene_Fishing.prototype.updateFishActive = function() {
	for (var i = 0; i < Galv.FISH.fishList.length; i++) {
		Galv.FISH.fishList[i].updateHunt();
	}
};

Scene_Fishing.prototype.updateFishHooked = function() {
	for (var i = 0; i < Galv.FISH.fishList.length; i++) {
		Galv.FISH.fishList[i].updateHooked();
	}
};

// phases
// ------------------------------
Scene_Fishing.prototype.pEnd = function() {
	if (this._phaseTimer == Galv.FISH.fadeSpeed) this.endScene();
};

Scene_Fishing.prototype.p0 = function() {
	//-- Fadein
	if (ImageManager.isReady()) {
		$gameScreen.startFadeIn(Galv.FISH.fadeSpeed);
		this.updateFishIdle();
		if (this._phaseTimer == Galv.FISH.fadeSpeed) {
			this.openWindows();
			this.setPhase('p1');
		}
	}
};

Scene_Fishing.prototype.p1 = function() {
	//-- In Menu
	this.updateFishIdle();
	Galv.FISH.fisher._pattern = 1;
	Galv.FISH.fisher.fishPull = 0;
};

Scene_Fishing.prototype.p2 = function() {
	//-- Ready to cast
	Galv.FISH.fisher._pattern = 0;
	Galv.FISH.fisher.rodPat = 0;
	Galv.FISH.fisher.rodRow = 1;

	if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
		this.castingSet();
		this._ticker = 0;
		this.setPhase('p3');		
	} else if (Input.isTriggered('cancel')) {
		this.cancelFishing();
	}
	this.updateFishIdle();
};

Scene_Fishing.prototype.p3 = function() {
	//-- Casting
	this._ticker += 1;
	Galv.FISH.fisher._pattern = 1;
	if (this._ticker == 10) AudioManager.playSe(Galv.FISH.castSE);
	if (this._ticker >= 24) {
		this.doSplash();
		this.setPhase('p4');
		this._castPow.display(false);
		Galv.FISH.fisher._pattern = 0;
	}
	this.updateFishIdle();
};

Scene_Fishing.prototype.p4 = function() {
	//-- Idle fishing (no fish on line)
	this.updateIdleFishing();
	this.updateFishActive();
	if (Input.isTriggered('cancel') || TouchInput.isCancelled()) this.cancelFishing();
};

Scene_Fishing.prototype.p5 = function() {
	//-- Reeling in (fish on line)
	if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
		this.lineBreak(Galv.FISH.fishList[Galv.FISH.bait._hooked]);
		return;
	};
	this.updateReeling();
	this.updateFishHooked();
	
};

Scene_Fishing.prototype.p6 = function() {
	//-- Caught fish info
	this.updateFishIdle();
	if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isCancelled() || TouchInput.isTriggered()) {
		if (this._caughtWindow.openness >= 255) {
			this._caughtWindow.close();
			this._finishCaught = true;
		}
	}
	if (this._finishCaught) {
		this._ticker += 1;
		if (this._ticker >= 20) {
			this._finishCaught = false;
			this.cancelFishing();
		}
	} else {
		this._ticker = 0;
	}
};

Scene_Fishing.prototype.updateIdleFishing = function() {
	if (Galv.FISH.bait) {	
		if (Input.isPressed('right') || Input.isPressed('ok') || TouchInput.isPressed()) {
			// reeling
			Galv.FISH.fisher.rodRow = 2;
			Galv.FISH.fisher._pattern = 1;
			Galv.FISH.fisher.reeling = true;
			// reel movement
			if (Galv.FISH.bait.x <= Galv.FISH.pond._endX) Galv.FISH.bait.x += 1.5;
		    if (Galv.FISH.bait.y >= Galv.FISH.pond._surfaceY) Galv.FISH.bait.y -= 1.5;
			// if line reeled all the way, cancel fishing
			if (Galv.FISH.bait.x >= Galv.FISH.pond._endX && Galv.FISH.bait.y <= Galv.FISH.pond._surfaceY) this.cancelFishing();
		} else {
			// sinking
			Galv.FISH.fisher.rodRow = 3;
			Galv.FISH.fisher._pattern = 0;
			Galv.FISH.fisher.reeling = false;
			// sink movement
			Galv.FISH.bait.y = Math.min(Galv.FISH.bait.y + Galv.FISH.bait.weight,Galv.FISH.pond._floor);
		}
	}
};

Scene_Fishing.prototype.updateReeling = function() {
	var f = Galv.FISH.fishList[Galv.FISH.bait._hooked];	
	this.reelingStruggle(f);
	
	var fishX = 0;
	var fishY = 0;

	if (f._moveType == 0) {
		fishX = this._reelX;
		fishY = this._reelY + 1;
	} else if (f._moveType > 0) {
		fishX = this._reelX + (f.dir * 2);
		fishY = this._reelY + (f.vDir * 2);
	}
	
	if (!Galv.FISH.bait) return;
	if (fishX > 0) {
		if (Galv.FISH.bait.x < Galv.FISH.pond._endX) Galv.FISH.bait.x += fishX;
	} else if (fishX < 0) {
		if (Galv.FISH.bait.x > Galv.FISH.pond.x) Galv.FISH.bait.x += fishX;
	}

	if (fishY > 0) {
		if (Galv.FISH.bait.y < Galv.FISH.pond._floor) Galv.FISH.bait.y += fishY;
	} else if (fishY < 0) {
		if (Galv.FISH.bait.y > Galv.FISH.pond._surfaceY) Galv.FISH.bait.y += fishY;
	}
	
	this.testLine(f);
};

Scene_Fishing.prototype.reelingStruggle = function(fish) {
	if (Input.isPressed('right') || Input.isPressed('ok') || TouchInput.isPressed()) {
		// reeling
		Galv.FISH.fisher.rodRow = fish.isPulling() ? 4 : 2;
		Galv.FISH.fisher._pattern = 1;
		Galv.FISH.fisher.reeling = true;
		// reel movement
		if (fish._pull < 0) {
			this._reelX = 0;
			this._reelY = 0;
		} else {
			var p = Math.max(this._rodPow - fish._pull,1);
			this._reelX = p;
			this._reelY = -p;
		}
		// catch fish
		if (Galv.FISH.bait.x >= Galv.FISH.pond._endX && Galv.FISH.bait.y <= Galv.FISH.pond._surfaceY && fish._moveType >= 0) this.caughtFish(fish);
	} else {
		// not reeling
		Galv.FISH.fisher.rodRow = fish.isPulling() ? 5 : 3;
		this._reelX = 0;
		this._reelY = 0;
		Galv.FISH.fisher._pattern = 0;
		Galv.FISH.fisher.reeling = false;
	}
};


// ----- FUNCTIONALITY

Scene_Fishing.prototype.caughtFish = function(fish) {
	fish.die();
	Galv.FISH.fisher._animationId = fish.fish().anim || Galv.FISH.pCatchAnim; // do fish anim or default if fish has none
	Galv.FISH.commonEvent = fish.fish().cevent ? fish.fish().cevent : 0;
	Galv.FISH.bait = null;
	this._caughtWindow.doCatch(fish._fishId); // refresh and show fish info window
	Galv.FISH.fisher.rodRow = 0;
	Galv.FISH.fisher._pattern = 1;
	this.setPhase('p6');
};

Scene_Fishing.prototype.testLine = function(fish) {
	if (Galv.FISH.fisher.reeling && fish.dir < 0 || Galv.FISH.fisher.reeling && fish._moveType <= 0) {
		this._lineStrength -= Math.max(fish._pull - this._rodPow,1);
	}
	if (this._lineStrength <= 0 || Input.isPressed('cancel') || TouchInput.isCancelled()) this.lineBreak(fish);
};

Scene_Fishing.prototype.lineBreak = function(fish) {
	if (fish) fish._animationId = Galv.FISH.breakAnim;
	this.loseBait();
	this.refreshGear();
	this._displayWindow.refresh();
	this._commandWindow.refresh();
	this.cancelFishing();
};

Scene_Fishing.prototype.loseBait = function() {
	$gameParty.loseItem($dataItems[Galv.FISH.fisher._baitEquipped], 1);
	Galv.FISH.checkEquips(Galv.FISH.fisher);
	Galv.FISH.checkEquips($gamePlayer);
};

Scene_Fishing.prototype.castingSet = function() {
	this._castPow._active = false;
	this._rodPow = $dataItems[Galv.FISH.fisher._rodEquipped].meta.rod;
	this._lineStrength = 90 + 10 * this._rodPow;
	
	var rate = Math.min(Math.max(this._castPow._rate,0),1);
	this._dist = Galv.FISH.pond.width - (rate * Galv.FISH.pond.width) + Galv.FISH.pond.x;
};

Scene_Fishing.prototype.cancelFishing = function() {
	if (Galv.FISH.commonEvent) {
		this.commandLeave();
	} else {
		this.setPhase('p1');
		this.openWindows();
		this._commandWindow.activate();
		this._castPow.display(false);
		Galv.FISH.fisher.rodRow = 0;
		Galv.FISH.bait = null;
	}
};

Scene_Fishing.prototype.createBait = function() {
	Galv.FISH.bait = {
		x: this._dist,
		y: Galv.FISH.pond._surfaceY,
		weight: Number($dataItems[Galv.FISH.fisher._baitEquipped].meta.baitSink) || 1,
		id: Number($dataItems[Galv.FISH.fisher._baitEquipped].meta.bait) || 1
	};
};

Scene_Fishing.prototype.doSplash = function() {
	AudioManager.playSe(Galv.FISH.splashSE);
	this._spriteset._splash.start(this._dist,$gameSystem.fishing.hole.baitY); // splash in water
	// set bait position
	this.createBait();
	this._spriteset._baitSprite.start(); // start bait with Galv.FISH.bait
};


//-----------------------------------------------------------------------------


//                               SPRITESET


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Spriteset_Fishing
//-----------------------------------------------------------------------------

function Spriteset_Fishing() {
    this.initialize.apply(this, arguments);
}

Spriteset_Fishing.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Fishing.prototype.constructor = Spriteset_Fishing;
Spriteset_Fishing.prototype.initialize = function() {Spriteset_Base.prototype.initialize.call(this)};

//-----------------------------------------------------------------------------
// CREATION

Spriteset_Fishing.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
	this.createSprites();
};

Spriteset_Fishing.prototype.createSprites = function() {
	// Sprites container
	this._sprites = new Tilemap();
	this._baseSprite.addChild(this._sprites);
	this.createBackground();
	this.createFisher();
	this.createSplash();
	this.createBait();
	this.createFish();
};

Spriteset_Fishing.prototype.createBackground = function() {
	// Background
	this._bgLayer = new TilingSprite();
	this._bgLayer.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.bg);
	this._bgLayer.move(0, 0, Graphics.boxWidth, Graphics.boxHeight);
	this._bgLayer.z = -100;
	this._sprites.addChild(this._bgLayer);
	
	// Underwater
	this._undLayer = new Sprite();
	this._undLayer.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.under);
	this._undLayer.z = -99;
	this._sprites.addChild(this._undLayer);
	
	// UNDERWATER OVERLAY
	this._undOLayer = new TilingSprite();
	this._undOLayer.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.underOverlay);
	this._undOLayer.move(0, 0, Graphics.boxWidth, Graphics.boxHeight);
	this._undOLayer.z = -90;
	this._sprites.addChild(this._undOLayer);
	
	// Surface
	this._surLayer = new TilingSprite();
	this._surLayer.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.surface);
	this._surLayer.move(0, $gameSystem.fishing.hole.surfaceY, Graphics.boxWidth, 170);
	this._surLayer.z = -89;
	this._sprites.addChild(this._surLayer);
	
	// Land
	this._lanLayer = new Sprite();
	this._lanLayer.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.land);
	this._lanLayer.z = -88;
	this._sprites.addChild(this._lanLayer);
};

Spriteset_Fishing.prototype.createFisher = function() {
	this._fisher = new Sprite_Fisher();
	this._sprites.addChild(this._fisher);
};

Spriteset_Fishing.prototype.createSplash = function() {
	this._splash = new Sprite_FishSplash();
	this._sprites.addChild(this._splash);
};

Spriteset_Fishing.prototype.createBait = function() {
	this._baitSprite = new Sprite_FishBait();
	this._sprites.addChild(this._baitSprite);
};

Spriteset_Fishing.prototype.createFish = function() {
	this._fishSprites = [];
	for (var i = 0; i < Galv.FISH.fishList.length; i++) {
		this._fishSprites[i] = new Sprite_Fish(i,Galv.FISH.fishList[i]);
		this._sprites.addChild(this._fishSprites[i]);
	}
};

Spriteset_Fishing.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
	this.updateMain();
};

Spriteset_Fishing.prototype.updateMain = function() {
	this._undOLayer.origin.x += $gameSystem.fishing.hole.speed[2]; //1;
	this._surLayer.origin.x += $gameSystem.fishing.hole.speed[1];  //0.3;
	this._bgLayer.origin.x -= $gameSystem.fishing.hole.speed[0];   //0.3;
};


//-----------------------------------------------------------------------------


//                            FISHER SPRITES


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Sprite_Fisher
//-----------------------------------------------------------------------------

function Sprite_Fisher() {
    this.initialize.apply(this, arguments);
}

Sprite_Fisher.prototype = Object.create(Sprite_Character.prototype);
Sprite_Fisher.prototype.constructor = Sprite_Fisher;

Sprite_Fisher.prototype.initialize = function() {
    Sprite_Character.prototype.initialize.call(this,Galv.FISH.fisher);
	// set sprite based off of game player and fishing setup
	this.x = $gameSystem.fishing.player.x;
	this.y = $gameSystem.fishing.player.y;
	Galv.FISH.fisher._direction = $gameSystem.fishing.player.dir;
	//Galv.FISH.fisher._pattern
	this.z = 0;
	this.createRodSprite();
};

Sprite_Fisher.prototype.playBalloon = function(id) {
	Galv.FISH.fisher._balloonId = id;
};

Sprite_Fisher.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updateAnimation();
    this.updateBalloon();
	
};

Sprite_Fisher.prototype.createRodSprite = function() {
	this._rodSprite = new Sprite_Rod();
	this.addChild(this._rodSprite);
};

Sprite_Fisher.prototype.refreshRod = function() {
	this._rodSprite.setBitmap();
};


//-----------------------------------------------------------------------------
// Sprite_Rod
//-----------------------------------------------------------------------------

function Sprite_Rod() {
    this.initialize.apply(this, arguments);
}

Sprite_Rod.prototype = Object.create(Sprite_Base.prototype);
Sprite_Rod.prototype.constructor = Sprite_Rod;

Sprite_Rod.prototype.initialize = function() {
	Sprite_Base.prototype.initialize.call(this);
	this._ticker = 0;
	this._tickSpeed = 8;
	Galv.FISH.fisher.rodRow = 0;
	Galv.FISH.fisher.rodPat = 0;
	this._maxPattern = 3;
	this.setBitmap();
};

Sprite_Rod.prototype.setBitmap = function() {
	if (Galv.FISH.fisher._rodEquipped) {
		var img = $dataItems[Galv.FISH.fisher._rodEquipped].meta.rodImg || Galv.FISH.rodImg;
	} else {
		var img = '';
	}
	this.bitmap = ImageManager.loadFishGraphic(img);

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	var xo = $dataActors[$gameParty.leader().actorId()].meta.rod_x;
	var yo = $dataActors[$gameParty.leader().actorId()].meta.rod_y;
	
	this.x = xo || Galv.FISH.rodInfo.x;
	this.y = yo || Galv.FISH.rodInfo.y;
	this.z = 1;
	this.updateFrame();
};

Sprite_Rod.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateFrame();
};

Sprite_Rod.prototype.row = function() {
	var pull = Galv.FISH.fisher.fishPull ? 2 : 0;
	return Galv.FISH.fisher.rodRow + pull;
};

Sprite_Rod.prototype.updateFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = Galv.FISH.fisher.rodPat * pw;
    var sy = this.row() * ph;
	this.setFrame(sx, sy, pw, ph);
	
	this._ticker += 1;
	if (this._ticker >= this._tickSpeed) {
		Galv.FISH.fisher.rodPat = Galv.FISH.fisher.rodPat == this._maxPattern ? 0 : Galv.FISH.fisher.rodPat + 1;
		this._ticker = 0;
	};
};
Sprite_Rod.prototype.patternWidth = function() {return this.bitmap.width / 4};
Sprite_Rod.prototype.patternHeight = function() {return this.bitmap.height / 6};


//-----------------------------------------------------------------------------
// Sprite_CastPow
//-----------------------------------------------------------------------------

function Sprite_CastPow() {
    this.initialize.apply(this, arguments);
}

Sprite_CastPow.prototype = Object.create(Sprite_Base.prototype);
Sprite_CastPow.prototype.constructor = Sprite_CastPow;

Sprite_CastPow.prototype.initialize = function() {
	Sprite_Base.prototype.initialize.call(this);
	this._show = false;
	this._rate = 0;
	this._active = false;
	this._pattern = 0;
	this._maxPattern = Galv.FISH.powFrames - 1;
	this.setBitmap();
};

Sprite_CastPow.prototype.display = function(status) {
	this._show = status;
	this._active = status;
	this._rate = 0;
};

Sprite_CastPow.prototype.setBitmap = function() {
	this.bitmap = ImageManager.loadFishGraphic(Galv.FISH.powImg);

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = Galv.FISH.castPowXY.x;
	this.y = Galv.FISH.castPowXY.y;
	this.z = 100;
	this.updateFrame();
};

Sprite_CastPow.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateFrame();
	this.updateVisiblity();
};

Sprite_CastPow.prototype.updateFrame = function() {
	if (!this._active) return;
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = this._pattern * pw;
    var sy = 0;
	this.setFrame(sx, sy, pw, ph);
	
	if (this._rateDir) {
		this._rate = this._rate + 0.03;
		if (this._rate >= 1.1) this._rateDir = false;
	} else {
		this._rate = Math.max(this._rate - 0.03,0);
		if (this._rate <= 0) this._rateDir = true;
	}
	this._pattern = Math.min(Math.floor(this._maxPattern * this._rate),this._maxPattern);
};

Sprite_CastPow.prototype.updateVisiblity = function() {
	this.opacity = this._show ? this.opacity += 30 : this.opacity -= 30;
};
Sprite_CastPow.prototype.patternWidth = function() {return this.bitmap.width / Galv.FISH.powFrames};
Sprite_CastPow.prototype.patternHeight = function() {return this.bitmap.height};



//-----------------------------------------------------------------------------
// Sprite_FishSplash
//-----------------------------------------------------------------------------

function Sprite_FishSplash() {
    this.initialize.apply(this, arguments);
}

Sprite_FishSplash.prototype = Object.create(Sprite_Base.prototype);
Sprite_FishSplash.prototype.constructor = Sprite_FishSplash;

Sprite_FishSplash.prototype.initialize = function() {
	Sprite_Base.prototype.initialize.call(this);
	this._active = false;
	this._ticker = 0;
	this._tickSpeed = 7;
	this._pattern = 0;
	this._maxPattern = Galv.FISH.splashFrames - 1;
	this.opacity = 0;
	this.z = 10;
	this.setBitmap();
};

Sprite_FishSplash.prototype.start = function(x,y) {
	this._pattern = 0;
	this._active = true;
	this.opacity = 255;
	this.x = x;
	this.y = y;
};

Sprite_FishSplash.prototype.end = function() {
	this._active = false;
	this.opacity = 0;
};

Sprite_FishSplash.prototype.setBitmap = function() {
	this.bitmap = ImageManager.loadFishGraphic($gameSystem.fishing.hole.splash);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.updateFrame();
};

Sprite_FishSplash.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	if (this._active) this.updateFrame();
};

Sprite_FishSplash.prototype.updateFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = this._pattern * pw;
    var sy = 0;
	this.setFrame(sx, sy, pw, ph);

	this._ticker += 1;
	if (this._ticker >= this._tickSpeed) {
		if (this._pattern == this._maxPattern + 1) {
			this.end();
		} else {
			this._pattern += 1;
			this._ticker = 0;
		}
	};
};

Sprite_FishSplash.prototype.patternWidth = function() {return this.bitmap.width / Galv.FISH.splashFrames};
Sprite_FishSplash.prototype.patternHeight = function() {return this.bitmap.height};


//-----------------------------------------------------------------------------
// Sprite_FishBait
//-----------------------------------------------------------------------------

function Sprite_FishBait() {
    this.initialize.apply(this, arguments);
}

Sprite_FishBait.prototype = Object.create(Sprite_Base.prototype);
Sprite_FishBait.prototype.constructor = Sprite_FishBait;

Sprite_FishBait.prototype.initialize = function() {
	Sprite_Base.prototype.initialize.call(this);
	this._ticker = 0;
	this._tickSpeed = 7;
	this._pattern = 0;
	this._maxPattern = Galv.FISH.baitFrames - 1;
	this.opacity = 0;
	this.z = 5;
	this.setBitmap();
};

Sprite_FishBait.prototype.start = function() {
	this._pattern = 0;
	this.x = Galv.FISH.bait.x;
	this.y = Galv.FISH.bait.y;
};

Sprite_FishBait.prototype.setBitmap = function() {
	if (Galv.FISH.fisher._baitEquipped) {
		var img = $dataItems[Galv.FISH.fisher._baitEquipped].meta.baitImg || Galv.FISH.baitImg;
	} else {
		var img = ''
	}
	this.bitmap = ImageManager.loadFishGraphic(img);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.updateFrame();
};

Sprite_FishBait.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	if (Galv.FISH.bait) {
		this.updateFrame();
		this.updateMotion();
	} else {
		this.x = 0;
		this.y = 0;
		this.opacity = 0;
	}
};

Sprite_FishBait.prototype.updateFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = this._pattern * pw;
    var sy = 0;
	this.setFrame(sx, sy, pw, ph);

	this._ticker += 1;
	if (this._ticker >= this._tickSpeed) {
		this._pattern = this._pattern == this._maxPattern ? 0 : this._pattern + 1;
		this._ticker = 0;
	};
};

Sprite_FishBait.prototype.updateMotion = function() {
	this.opacity += 40;
	this.y = Galv.FISH.bait.y;
	this.x = Galv.FISH.bait.x;
};

Sprite_FishBait.prototype.patternWidth = function() {return this.bitmap.width / Galv.FISH.baitFrames};
Sprite_FishBait.prototype.patternHeight = function() {return this.bitmap.height};


//-----------------------------------------------------------------------------
// SpriteFishEquipIcon
//-----------------------------------------------------------------------------

function Sprite_FishEquipIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_FishEquipIcon.prototype = Object.create(Sprite.prototype);
Sprite_FishEquipIcon.prototype.constructor = Sprite_FishEquipIcon;

Sprite_FishEquipIcon.prototype.initialize = function(type) {
    Sprite.prototype.initialize.call(this);
	this._iconIndex = 0;
	this._doneIndex = 0;
	this._type = type;
	//this.changeBitmap();
	this.anchor.y = 0.5;
	this.anchor.x = 0.5;
};

Sprite_FishEquipIcon.prototype.changeBitmap = function() {
	if (this._type == 'rod') {
		var obj = Galv.FISH.rodXY;
		this._iconIndex = Galv.FISH.fisher._rodEquipped ? $dataItems[Galv.FISH.fisher._rodEquipped].iconIndex : 0;
	} else {
		var obj = Galv.FISH.baitXY;
		this._iconIndex = Galv.FISH.fisher._baitEquipped ? $dataItems[Galv.FISH.fisher._baitEquipped].iconIndex : 0;
	}

	var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
	var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
	
	if (this._iconIndex) {
		if (this._doneIndex !== this._iconIndex) {
			// only do it if change has happened.
			this.bitmap = new Bitmap(pw,ph);
			var bitmap = ImageManager.loadSystem('IconSet');
			this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
			this.x = obj.x;
			this.y = obj.y;
			this.scale.x = 2;
			this.scale.y = 2;
			this._doneIndex = this._iconIndex;
		}
	} else {
		this.bitmap = new Bitmap(pw,ph);
	}
};

Sprite_FishEquipIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
	this.updateScale();
};

Sprite_FishEquipIcon.prototype.update = function() {
	if (this.scale.x > 1) {
		this.scale.x -= 0.1;
		this.scale.y -= 0.1;
	}
};


//-----------------------------------------------------------------------------
// Sprite_Fish
//-----------------------------------------------------------------------------

function Sprite_Fish() {
    this.initialize.apply(this, arguments);
}

Sprite_Fish.prototype = Object.create(Sprite_Base.prototype);
Sprite_Fish.prototype.constructor = Sprite_Fish;

Sprite_Fish.prototype.initialize = function(index,fish) {
	Sprite_Base.prototype.initialize.call(this);
	this._index = index;
	this._fish = fish; // game_fish
	this._fishId = fish._fishId;
	this._ticker = 0;
	this._tickSpeed = 7;
	this._pattern = 0;
	this._maxPattern = Galv.FISH.fishFrames - 1;
	this.setBitmap();
	this.update();
};

Sprite_Fish.prototype.fish = function() {
	return Galv.FISH.fish[this._fishId];
};

Sprite_Fish.prototype.setBitmap = function() {
	var img = this.fish().graphic;
	this.bitmap = ImageManager.loadFishGraphic(img);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.z = -96 - (this._index * 0.01);
	this.updateFrame();
};

Sprite_Fish.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateFrame();
	this.updatePosition();
	this.updateAnimation();
	this.updateLife();
};

Sprite_Fish.prototype.updateFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = this._pattern * pw;
    var sy = 0;
	this.setFrame(sx, sy, pw, ph);

	this._ticker += 1;
	if (this._ticker >= this._tickSpeed) {
		this._pattern = this._pattern == this._maxPattern ? 0 : this._pattern + 1;
		this._ticker = 0;
	};
};

Sprite_Fish.prototype.updatePosition = function() {
	this.x = this._fish.x;
	this.y = this._fish.y;
	if (this._fish.dir > 0) {
		this.scale.x = -1;
		this.scale.y = 1;
	} else if (this._fish.dir < 0) {
		this.scale.x = 1;
		this.scale.y = 1;
	}
};

Sprite_Fish.prototype.updateLife = function() {
	this.opacity = this._fish._living ? 255 : 0;
};

Sprite_Fish.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
        this._fish.endAnimation();
    }
};

Sprite_Fish.prototype.setupAnimation = function() {
    if (this._fish._animationId > 0) {
        var animation = $dataAnimations[this._fish._animationId];
        this.startAnimation(animation, false, 0);
        this._fish.startAnimation();
    }
};

Sprite_Fish.prototype.patternWidth = function() {return this.bitmap.width / Galv.FISH.fishFrames};
Sprite_Fish.prototype.patternHeight = function() {return this.bitmap.height};


//-----------------------------------------------------------------------------


//                                 WINDOWS


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Window_FishCommand
//-----------------------------------------------------------------------------

function Window_FishCommand() {
    this.initialize.apply(this, arguments);
}

Window_FishCommand.prototype = Object.create(Window_Command.prototype);
Window_FishCommand.prototype.constructor = Window_FishCommand;

Window_FishCommand.prototype.initialize = function() {
	var x = Galv.FISH.menu.x;
	var y = Galv.FISH.menu.y;
    Window_Command.prototype.initialize.call(this, x, y);
	this.openness = 0;
};

Window_FishCommand.prototype.windowWidth = function() {
    return Galv.FISH.menu.width;
};

Window_FishCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_FishCommand.prototype.makeCommandList = function() {
	var enabled = true;
    this.addCommand(Galv.FISH.castText, 'cast', this.canCast());
	this.addCommand(Galv.FISH.equipRodText, 'rod', enabled);
	this.addCommand(Galv.FISH.equipBaitText, 'bait', enabled);
	this.addCommand(Galv.FISH.leaveText, 'leave', enabled);
};

Window_FishCommand.prototype.canCast = function() {
	return Galv.FISH.fisher._rodEquipped && Galv.FISH.fisher._baitEquipped;
};

Window_FishCommand.prototype.processOk = function() {
    Window_FishCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};


//-----------------------------------------------------------------------------
// Window_FishEquip
//-----------------------------------------------------------------------------

function Window_FishEquip() {
    this.initialize.apply(this, arguments);
}

Window_FishEquip.prototype = Object.create(Window_ItemList.prototype);
Window_FishEquip.prototype.constructor = Window_FishEquip;

Window_FishEquip.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
	this.openness = 0;
    this._actor = Galv.FISH.fisher;
	this._type = 'rod';
	this._cmdIndex = -1;
	this._origX = x;
	this._targX = x + width;
};

Window_FishEquip.prototype.refreshType = function() {
	switch (this._cmdIndex) {
		case 1:
			var type = 'rod';
			break;
		case 2:
			var type = 'bait';
			break;
		default:
			var type = '';
	}
	this._type = type;
	this.refresh();
};

Window_FishEquip.prototype.doEquip = function() {
	var item = this.item();
	if (this._type === 'rod') {
		this._actor._rodEquipped = item ? item.id : null;
		AudioManager.playSe(Galv.FISH.rodEquipSE);
		Galv.FISH.fisher._rodEquipped = this._actor._rodEquipped;
		$gamePlayer._rodEquipped = this._actor._rodEquipped;
	} else {
		this._actor._baitEquipped = item ? item.id : null;
		AudioManager.playSe(Galv.FISH.baitEquipSE);
		Galv.FISH.fisher._baitEquipped = this._actor._baitEquipped;
		$gamePlayer._baitEquipped = this._actor._baitEquipped;
	}
};

Window_FishEquip.prototype.refresh = function() {
	if (!this._type) {
		this.contents.clear();
		return;
	}
    Window_ItemList.prototype.refresh.call(this);
};


Window_FishEquip.prototype.maxCols = function() {return Galv.FISH.eWinCols};
Window_FishEquip.prototype.spacing = function() {return 8};

Window_FishEquip.prototype.drawItemNumber = function(item, x, y, width) {
	var amount = this._type == 'bait' ? $gameParty.numItems(item) : null;
    if (amount) {
		this.contents.fontSize = 12;
		var w = 16;
        this.drawText(amount, x + Window_Base._iconWidth - 12, y + 10, w, 'center');
    }
};

Window_FishEquip.prototype.update = function() {
	Window_ItemList.prototype.update.call(this);
	if (this._cmdIndex != this._cmdWindow.index()) {
		this._cmdIndex = this._cmdWindow.index();
		this.refreshType();
	}
	if (this.active) {
		this.x = Math.min(this.x + 16,this._targX);
	} else {
		this.x = Math.max(this.x - 16,this._origX);
	}
	
};

Window_FishEquip.prototype.drawItemName = function(item, x, y, width) {
	width = width || 312;
	if (item) {
		var iconBoxWidth = this.lineHeight();
		var padding = (iconBoxWidth - Window_Base._iconWidth) / 2;
		this.drawIcon(item.iconIndex, x + padding, y + padding);
	};
};

Window_FishEquip.prototype.includes = function(item) {
	if (this._type == 'bait') return item && item.meta.bait;
	if (this._type == 'rod') return item && item.meta.rod;
	return false;
};

Window_FishEquip.prototype.isEnabled = function(item) {
    return item;
};

Window_FishEquip.prototype.selectLast = function() {
};

Window_FishEquip.prototype.playOkSound = function() {
};


//-----------------------------------------------------------------------------
// Window_FishHelp
//-----------------------------------------------------------------------------

function Window_FishHelp() {
    this.initialize.apply(this, arguments);
}

Window_FishHelp.prototype = Object.create(Window_Help.prototype);
Window_FishHelp.prototype.constructor = Window_FishHelp;

Window_FishHelp.prototype.initialize = function(x,y,width) {
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = '';
	this.opacity = 0;
};

Window_FishHelp.prototype.standardPadding = function() {
	return 5;
};

Window_FishHelp.prototype.setItem = function(item) {
    this.setText(item ? item.name : '');
};

Window_FishHelp.prototype.refresh = function() {
    this.contents.clear();
    this.drawText(this._text, 0, 0, this.contents.width,'center');
};


//-----------------------------------------------------------------------------
// Window_FishDisplay
//-----------------------------------------------------------------------------

function Window_FishDisplay() {
    this.initialize.apply(this, arguments);
}

Window_FishDisplay.prototype = Object.create(Window_Help.prototype);
Window_FishDisplay.prototype.constructor = Window_FishDisplay;

Window_FishDisplay.prototype.initialize = function() {
    var width = Graphics.boxWidth;
	var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
	this.opacity = 0;
	this._equipped = [Galv.FISH.fisher._rodEquipped,Galv.FISH.fisher._baitEquipped];
	this.createIcons();
	this.refresh();
};

Window_FishDisplay.prototype.standardPadding = function() {
	return 0;
};

Window_FishDisplay.prototype.createIcons = function() {
	this._rodIcon = new Sprite_FishEquipIcon('rod');
	this._baitIcon = new Sprite_FishEquipIcon('bait');
	this.addChild(this._rodIcon);
	this.addChild(this._baitIcon);
};

Window_FishDisplay.prototype.refreshIcons = function() {
	this._rodIcon.changeBitmap();
	this._baitIcon.changeBitmap();
};


Window_FishDisplay.prototype.refresh = function() {
	this.contents.clear();
	this.drawEquipSlot('rod');
	this.drawEquipSlot('bait');
	this.refreshIcons();
};

Window_FishDisplay.prototype.drawEquipSlot = function(type) {
	if (type == 'rod') {
		var obj = Galv.FISH.rodXY;
		var txt = Galv.FISH.fisher._rodEquipped ? null : Galv.FISH.noRodTxt;
	} else { // bait
		var obj = Galv.FISH.baitXY;
		var txt = Galv.FISH.fisher._baitEquipped ? null : Galv.FISH.noBaitTxt;
	}
	var bitmap = ImageManager.loadFishGraphic(Galv.FISH.equipSlot);
    var pw = bitmap.width;
    var ph = bitmap.height;
	var px = obj.x - pw / 2;
	var py = obj.y - ph / 2;
    this.contents.blt(bitmap, 0, 0, pw, ph, px, py);
	if (txt) {
		this.contents.fontSize = Galv.FISH.noTxtSize;
		var tw = 100;
		var tx = obj.x - tw / 2;
		var ty = obj.y - this.lineHeight() / 2;
		this.drawText(txt,tx,ty,tw,'center');
	};
};


//-----------------------------------------------------------------------------
// Window_FishCaught
//-----------------------------------------------------------------------------

function Window_FishCaught() {
    this.initialize.apply(this, arguments);
}

Window_FishCaught.prototype = Object.create(Window_Base.prototype);
Window_FishCaught.prototype.constructor = Window_FishCaught;

Window_FishCaught.prototype.initialize = function() {
	var win = Galv.FISH.catchWindow;
    Window_Base.prototype.initialize.call(this, win.x, win.y, win.width, win.height);
	this.openness = 0;
};

Window_FishCaught.prototype.drawHorzLine = function(y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.normalColor());
    this.contents.paintOpacity = 255;
};

Window_FishCaught.prototype.doCatch = function(fishId) {
    this.contents.clear();
	var data = Galv.FISH.fish[fishId];
	
	var item = $dataItems[data.item];
	if (item) $gameParty.gainItem(item,1);
	
	if (data.customText) {
		var txt = data.customText;
	} else if (item) {
		var txt = Galv.FISH.caughtText + " " + item.name;
	} else {
		var txt = Galv.FISH.caughtText + data.graphic;
	}
	// Draw catch text
	this.drawText(txt, 0, 0, this.contents.width,'center');
	this.drawHorzLine(28);
	
	this.changeTextColor(this.systemColor());
	this.drawText(Galv.FISH.txtLength, 0, this.lineHeight() + 20, this.contents.width);  // Length
	this.drawText(Galv.FISH.txtWeight, 0, this.lineHeight() * 2 + 20, this.contents.width);  // Weight
    this.resetTextColor();
	
	// Calc Length/weight
	var rate = Math.random();
	var length = this.randScale(data.length[0],data.length[1],rate);
	length = +length.toFixed(2);
	var weight = this.randScale(data.weight[0],data.weight[1],rate);
	weight = +weight.toFixed(2);

	// Record stuff
	Galv.FISH.addRecords(fishId,length,weight);

	// Draw length/weight
	this.drawText(length, 0, this.lineHeight() + 20, this.contents.width / 2, 'right');  // Length
	this.drawText(weight, 0, this.lineHeight() * 2 + 20, this.contents.width / 2, 'right');  // Weight
	
	// Draw fish graphic
	var fx = this.contents.width - this.contents.width / 4;
	this.drawFish(data,fx,90);
	
	this.open();
};

Window_FishCaught.prototype.randScale = function(min,max,rate) {
	return (rate * (max - min + 1)) + min;
};

Window_FishCaught.prototype.drawFish = function(fish, x, y) {
    var bitmap = ImageManager.loadFishGraphic(fish.graphic);
    var pw = bitmap.width / Galv.FISH.fishFrames;
    var ph = bitmap.height;
    var sx = 0;
    var sy = 0;
	var x = x - pw / 2;
	var y = y - ph / 2;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};


//-----------------------------------------------------------------------------


//                                 OBJECTS


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Fish_Object
//-----------------------------------------------------------------------------

function Game_Fish() {
    this.initialize.apply(this, arguments);
};

Game_Fish.prototype.initialize = function(id,fishId) {
	this._id = id;
	this._fishId = fishId;
	this.initVars();
};

Game_Fish.prototype.fish = function() {
	return Galv.FISH.fish[this._fishId];
};

Game_Fish.prototype.getXStart = function() {
	if (this.fish().x < 0) {
		// random
		var xPos = Math.random();
	} else {
		// set value
		var xPos = this.fish().x * 0.1;
	}
	return Galv.FISH.pond.width - (xPos * Galv.FISH.pond.width) + Galv.FISH.pond.x;
};

Game_Fish.prototype.getYStart = function() {
	var min = this.fish().level[0];
	var max = this.fish().level[1];
	var rate = (Math.floor(Math.random() * (max - min + 1)) + min) * 0.1;
	return (rate * Galv.FISH.pond.height) + Galv.FISH.pond.y;
};

Game_Fish.prototype.setRandDir = function() {
	if (this.fish().move > 0) {
		this.dir = Math.floor(Math.random() * 3) - 1;  // -1 = left, 0 = none, 1 = right
		this.vDir = Math.floor(Math.random() * 3) - 1;  // -1 = up, 0 = none, 1 = down
	} else {
		this.dir = 0;
		this.vDir = 0;
	}
};

Game_Fish.prototype.initVars = function() {
	var fish = this.fish();
	this._moveTimer = 0;
	this.randStats();
	this._living = true;
	this.x = this.getXStart();
	this.y = this.getYStart();
	this._startY = Number(this.y);
	this.setRandDir();
	this._detectRange = fish.range[0];
	this._takeRange = fish.range[1];
	this._moveType = fish.move;
	this._speed = fish.speed;
	this._baits = fish.baits;
	this._pull = fish.pull;
};

Game_Fish.prototype.randStats = function() {
	this._sizeRatio = Math.random();
	
	// Length
	var min = this.fish().length[0];
	var max = this.fish().length[1];
	this._length = Math.floor(this._sizeRatio * (max - min + 1)) + min;
	
	// Length
	var min = this.fish().weight[0];
	var max = this.fish().weight[1];
	this._weight = Math.floor(this._sizeRatio * (max - min + 1)) + min;
};

Game_Fish.prototype.isMoving = function() {
	return this._moveTimer > 0;
};

Game_Fish.prototype.isPulling = function() {
	return this._moveTimer > 0 && (this.dir < 0 || this.vDir > 0);
};

Game_Fish.prototype.isHooked = function() {
	return Galv.FISH.bait && Galv.FISH.bait._hooked == this._id;
};

Game_Fish.prototype.outOfPos = function() {
	if (this._moveType == 0 && this.y != this._startY) return true;
	if (this.y < Galv.FISH.pond._surfaceY + 10 || this.y > Galv.FISH.pond._floor + 10) return true;
	return false;
};

Game_Fish.prototype.moveToLevel = function() {
	var yCheck = this._moveType == 0 ? this._startY : Galv.FISH.pond._surfaceY;  // move back to original Y position if move type is 0 (for sinking chest for example)

	this.dir = 0;
    this.vDir = 0;
    if (this.y <= yCheck + 10) {
		this.y += 1;
	} else if (this.y >= Galv.FISH.pond._floor + 10) {
		this.y -= 1;
	}
};

Game_Fish.prototype.doMove = function() {
	// horz
	if (this.dir > 0) {
		if (this.x < Galv.FISH.pond._endX) this.x += this.dir;
	} else if (this.dir < 0) {
		if (this.x > Galv.FISH.pond.x) this.x += this.dir;
	}
	// vert
	if (this.vDir > 0) {
		if (this.y < Galv.FISH.pond._floor) this.y += this.vDir;
	} else if (this.vDir < 0) {
		if (this.y > Galv.FISH.pond._surfaceY) this.y += this.vDir;
	}
};

Game_Fish.prototype.determineAction = function() {
	switch(this._moveType) {
	case 0:
		// Idle
		this._moveTimer = 10;
		break;
	case 1:
	  // Passive
	  this.dir = (Math.floor(Math.random() * 3 - 1)) * this._speed;
	  this.vDir = (Math.floor(Math.random() * 3 - 1) * 0.5) * this._speed;
	  this._moveTimer = 100 + Math.random() * 100;
	  break;
	case 2:
	  // Erratic
	  this.dir = (Math.floor(Math.random() * 3 - 1)) * this._speed;
	  this.vDir = (Math.floor(Math.random() * 3 - 1) * 0.8) * this._speed;
	  this._moveTimer = Math.random() * 100;
	  break;
	}
};

Game_Fish.prototype.dist = function(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
};

Game_Fish.prototype.isNear = function(range) {
	if (!Galv.FISH.bait) return false;
	if (this._baits.contains(Galv.FISH.bait.id)) {
		return this.dist(Galv.FISH.bait.x,Galv.FISH.bait.y,this.x,this.y) <= range;
	} else {
		return false;
	}
};

Game_Fish.prototype.startAnimation = function() {
	Game_CharacterBase.prototype.startAnimation.call(this);
};

Game_Fish.prototype.endAnimation = function() {
	Game_CharacterBase.prototype.endAnimation.call(this);
};

// UPDATES

Game_Fish.prototype.updateIdle = function() {
	if (!this._living) return;
	
	if (this.isMoving()) {
		if (this.outOfPos()) {
			this.moveToLevel();
		} else {
			this.doMove();
		}
	} else {
		this.determineAction();
	}
    this._moveTimer -= 1;
};

Game_Fish.prototype.updateHunt = function() {
	if (!this._living) return;
	if (this.isNear(this._detectRange)) {
		this.updateNearBait();
		this.updateNibble();
	} else {
		this.updateIdle();
	}
};

Game_Fish.prototype.updateNearBait = function() {
	// horz
	if (this.x < Galv.FISH.bait.x) {
		this.x += this._speed;
		if (this.x < Galv.FISH.bait.x - 5) this.dir = 1;
	} else if (this.x > Galv.FISH.bait.x) {
		this.x -= this._speed;
		if (this.x > Galv.FISH.x + 5) this.dir = -1;
	}
	
	if (this.y < Galv.FISH.bait.y) {
		if (this.y < Galv.FISH.pond._floor) this.y += this._speed;
		this.vDir = 1;
	} else if (this.y > Galv.FISH.bait.y) {
		if (this.y > Galv.FISH.pond._surfaceY) this.y -= this._speed;
		this.vDir = -1;
	}
};

Game_Fish.prototype.updateNibble = function() {
	if (this.isNear(this._takeRange)) {
		Galv.FISH.bait._hooked = this._id;
		this._animationId = Galv.FISH.hookedAnim;
		SceneManager._scene.setPhase('p5');
		if (this._moveType > 0) this.dir = -1;
	}
};

Game_Fish.prototype.updateHooked = function() {
	if (!this._living || this._moveType < 0) return;
	if (this.isHooked()) {
		// do struggle
		this.x = Galv.FISH.bait.x;
		this.y = Galv.FISH.bait.y;
		if (!this.isMoving() && this._moveType > 0) this.determineStruggle();
		this._moveTimer -= 1;
	} else {
		this.updateIdle();
	}
};

Game_Fish.prototype.determineStruggle = function() {
	if (this.moveType <= 0) {
		this.dir = 0;
		this.vDir = 0;
	} else {
		this.dir = (Math.floor(Math.random() * 3 - 1)) * this._speed;
		this.vDir = (Math.floor(Math.random() * 3 - 1)) * this._speed;
		this._moveTimer = 10 + Math.random() * 70; 
	}
};

Game_Fish.prototype.die = function() {
	this.x = 0;
	this.y = 0;
	this._living = false;
};


//-----------------------------------------------------------------------------
// Game_MenuFish
//-----------------------------------------------------------------------------

function Game_MenuFish() {
    this.initialize.apply(this, arguments);
};

Game_MenuFish.prototype = Object.create(Game_Fish.prototype);
Game_MenuFish.prototype.constructor = Game_MenuFish;

Game_MenuFish.prototype.initialize = function(fishId,x,y) {
	this._mx = x;
	this._my = y;
	Game_Fish.prototype.initialize.call(this,0,fishId);
};

Game_MenuFish.prototype.initVars = function() {
	this._living = true;
	this.x = this._mx;
	this.y = this._my;
};

//-----------------------------------------------------------------------------


//                             RECORD MENU SCENE


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// SCENE FISHRECORDS
//-----------------------------------------------------------------------------

function Scene_FishRecords() {
    this.initialize.apply(this, arguments);
}

Scene_FishRecords.prototype = Object.create(Scene_ItemBase.prototype);
Scene_FishRecords.prototype.constructor = Scene_FishRecords;

Scene_FishRecords.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_FishRecords.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
	this.createTitleWindow();
	this.createTotalWindow();
	this.createRecordWindow();
	this.createTypeWindow();
	this.createFishStatusWindow();
	this.createFishItemWindow();
};

Scene_FishRecords.prototype.createTitleWindow = function() {
	this._titleWindow = new Window_FishInfo('title');
	this.addWindow(this._titleWindow);
};

Scene_FishRecords.prototype.createTotalWindow = function() {
	this._totalWindow = new Window_FishInfo('total');
	this.addWindow(this._totalWindow);
};

Scene_FishRecords.prototype.createRecordWindow = function() {
	this._recordWindow = new Window_FishInfo('record');
	this.addWindow(this._recordWindow);
};

Scene_FishRecords.prototype.createTypeWindow = function() {
	var wy = this._titleWindow.y + this._titleWindow.height;
	this._typeWindow = new Window_FishInfo('type',wy);
	this.addWindow(this._typeWindow);
};

Scene_FishRecords.prototype.createFishStatusWindow = function() {
	var wy = this._titleWindow.y + this._titleWindow.height;
	var wh = Graphics.boxHeight - this._totalWindow.height - Galv.FISH.rPadding * 2 - this._titleWindow.height;
	this._fishStatusWindow = new Window_FishStatus(wy,wh);
	this.addWindow(this._fishStatusWindow);
};

Scene_FishRecords.prototype.createFishItemWindow = function() {
	var wy = this._titleWindow.y + this._titleWindow.height + this._typeWindow.height;
	var wh = Graphics.boxHeight - this._totalWindow.height - Galv.FISH.rPadding * 2 - this._titleWindow.height - this._recordWindow.height;
	this._fishItemWindow = new Window_FishRecordList(wy,wh);
	this._fishItemWindow.setHandler('cancel', this.popScene.bind(this));
	this._fishItemWindow.setHelpWindow(this._fishStatusWindow);
	this.addWindow(this._fishItemWindow);
	this._fishItemWindow.activate();
};


//-----------------------------------------------------------------------------


//                                 WINDOWS


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Window_FishInfo
//-----------------------------------------------------------------------------

function Window_FishInfo() {
    this.initialize.apply(this, arguments);
}

Window_FishInfo.prototype = Object.create(Window_Base.prototype);
Window_FishInfo.prototype.constructor = Window_FishInfo;

Window_FishInfo.prototype.setup = function(type,y) {
	var pad = Galv.FISH.rPadding;
	// defaults
	this._type = type;
	this.wx = pad;
	this.wy = pad;
	this.wh = this.fittingHeight(1);
	this.ww = (Graphics.boxWidth - pad * 2) / 2;

	switch(type) {
		case 'title':
			this.ww = this.ww * 2;
			break;
		case 'total':
			this.wy = Graphics.boxHeight - this.wh - pad;
			break;
		case 'record':
			this.wy = Graphics.boxHeight - this.wh - pad;
			this.wx = this.wx + this.ww;
			break;
		case 'type':
			this.wy = y;
			break;
	}
};

Window_FishInfo.prototype.initialize = function(type,y) {	
	this.setup(type,y);
    Window_Base.prototype.initialize.call(this, this.wx, this.wy, this.ww, this.wh);
	this.refresh();
};

Window_FishInfo.prototype.refresh = function() {
    this.contents.clear();
	this[this._type]();
};

Window_FishInfo.prototype.title = function() {
	this.drawText(Galv.FISH.rTitle, 0, 0, this.contents.width,'center');
};

Window_FishInfo.prototype.total = function() {
	this.resetTextColor();
	this.drawText(Galv.FISH.totalCaught(), 0, 0, this.contents.width,'right');
	this.changeTextColor(this.systemColor());
	this.drawText(Galv.FISH.rTotal, 0, 0, this.contents.width);
};

Window_FishInfo.prototype.record = function() {
	this.resetTextColor();
	var fishId = $gameSystem.fishing.recordFish.id;
	if (fishId) this.drawText(Galv.FISH.fishName(fishId), 0, 0, this.contents.width,'right');
	this.changeTextColor(this.systemColor());
	this.drawText(Galv.FISH.rFish, 0, 0, this.contents.width);
};

Window_FishInfo.prototype.type = function() {
	this.resetTextColor();
	var tn = Object.keys($gameSystem.fishing.caught).map(function (key) { return $gameSystem.fishing.caught[key]; }).length;
	var t = tn + "/" + Galv.FISH.fishTotal;
	this.drawText(t, 0, 0, this.contents.width,'right');
	this.changeTextColor(this.systemColor());
	this.drawText(Galv.FISH.rTypes, 0, 0, this.contents.width);
};

//-----------------------------------------------------------------------------
// Window_FishRecordList
//-----------------------------------------------------------------------------

function Window_FishRecordList() {
    this.initialize.apply(this, arguments);
}

Window_FishRecordList.prototype = Object.create(Window_ItemList.prototype);
Window_FishRecordList.prototype.constructor = Window_FishRecordList;

Window_FishRecordList.prototype.initialize = function(y,h) {
	var pad = Galv.FISH.rPadding;
	var width = (Graphics.boxWidth - pad * 2) / 2;
	Window_Selectable.prototype.initialize.call(this, pad, y, width, h);
	this._data = [];
	this.refresh();
	this.select(0);
};

Window_FishRecordList.prototype.maxCols = function() {
	return 1;
};

Window_FishRecordList.prototype.isCurrentItemEnabled = function() {
    return true
};

Window_FishRecordList.prototype.includes = function(item) {
	return true;
};

Window_FishRecordList.prototype.makeItemList = function() {
	this._data = Object.keys($gameSystem.fishing.caught).map(function (key) { return $gameSystem.fishing.caught[key]; });
};

Window_FishRecordList.prototype.drawItem = function(index) {
    var fishId = this._data[index].id;
	var name = Galv.FISH.fishName(fishId);
    if (name) {
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.drawText(name, rect.x + 10, rect.y, rect.width);
    }
};

Window_FishRecordList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_FishRecordList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};


//-----------------------------------------------------------------------------
// Window_FishStatus
//-----------------------------------------------------------------------------

function Window_FishStatus() {
    this.initialize.apply(this, arguments);
}

Window_FishStatus.prototype = Object.create(Window_Base.prototype);
Window_FishStatus.prototype.constructor = Window_FishStatus;

Window_FishStatus.prototype.initialize = function(y,h) {
	var pad = Galv.FISH.rPadding;
	var width = (Graphics.boxWidth - pad * 2) / 2;
	Window_Base.prototype.initialize.call(this, pad + width, y, width, h);
};

Window_FishStatus.prototype.setItem = function(item) {
	this.contents.clear();
	if (item) {
		// Fish Name
		this.drawText(Galv.FISH.fishName(item.id),0,0,this.contents.width,'center');
		
		// Fish Details
		var line = this.lineHeight();
		var y = this.contents.height - line;
		this.changeTextColor(this.systemColor());
		this.drawText(Galv.FISH.rFishNumber,0,y - line * 2,this.contents.width); // Amount
		this.drawText(Galv.FISH.rFishLength,0,y - line,this.contents.width);  // Length
		this.drawText(Galv.FISH.rFishWeight,0,y,this.contents.width);  // Weight
		
		this.resetTextColor();
		this.drawText(item.amount,0,y - line * 2,this.contents.width,'right'); // Amount
		this.drawText(item.length,0,y - line,this.contents.width,'right');  // Length
		this.drawText(item.weight,0,y,this.contents.width,'right');  // Weight
		
		// Fish Sprite
		if (this._sprite) {
			this.removeChild(this._sprite);
			this._sprite = null;
		};
		var fx = this.contents.width / 2 + this.standardPadding();
		var fy = Galv.FISH.rFishPosY;
		var fish = new Game_MenuFish(item.id,fx,fy);
		this._sprite = new Sprite_Fish(0,fish);
		this._sprite.scale.x = Galv.FISH.rFishScale;
		this._sprite.scale.y = Galv.FISH.rFishScale;
		this.addChild(this._sprite);
	}
};