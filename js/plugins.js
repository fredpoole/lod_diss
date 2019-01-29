// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"Community_Basic","status":true,"description":"Basic plugin for manipulating important parameters.","parameters":{"cacheLimit":"20","screenWidth":"816","screenHeight":"624","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"ItemCodexAndToolTips","status":false,"description":"","parameters":{}},
{"name":"YEP_CoreEngine","status":true,"description":"v1.30 Needed for the majority of Yanfly Engine Scripts. Also\r\ncontains bug fixes found inherently in RPG Maker.","parameters":{"---Screen---":"","Screen Width":"816","Screen Height":"624","Scale Battlebacks":"true","Scale Title":"true","Scale Game Over":"true","Open Console":"false","Reposition Battlers":"true","GameFont Load Timer":"0","Update Real Scale":"false","Collection Clear":"true","---Gold---":"","Gold Max":"99999999","Gold Font Size":"20","Gold Icon":"313","Gold Overlap":"A lotta","---Items---":"","Default Max":"99","Quantity Text Size":"20","---Parameters---":"","Max Level":"99","Actor MaxHP":"9999","Actor MaxMP":"9999","Actor Parameter":"999","Enemy MaxHP":"999999","Enemy MaxMP":"9999","Enemy Parameter":"999","---Battle---":"","Animation Rate":"4","Flash Target":"false","Show Events Transition":"true","Show Events Snapshot":"true","---Map Optimization---":"","Refresh Update HP":"true","Refresh Update MP":"true","Refresh Update TP":"false","---Font---":"","Chinese Font":"SimHei, Heiti TC, sans-serif","Korean Font":"Dotum, AppleGothic, sans-serif","Default Font":"GameFont, Verdana, Arial, Courier New","Font Size":"28","Text Align":"left","---Windows---":"","Digit Grouping":"true","Line Height":"36","Icon Width":"32","Icon Height":"32","Face Width":"144","Face Height":"144","Window Padding":"18","Text Padding":"6","Window Opacity":"192","Gauge Outline":"true","Gauge Height":"18","Menu TP Bar":"true","---Window Colors---":"","Color: Normal":"0","Color: System":"16","Color: Crisis":"17","Color: Death":"18","Color: Gauge Back":"19","Color: HP Gauge 1":"20","Color: HP Gauge 2":"21","Color: MP Gauge 1":"22","Color: MP Gauge 2":"23","Color: MP Cost":"23","Color: Power Up":"24","Color: Power Down":"25","Color: TP Gauge 1":"28","Color: TP Gauge 2":"29","Color: TP Cost Color":"29"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_BattleEngineCore","status":true,"description":"v1.47 Have more control over the flow of the battle system\r\nwith this plugin and alter various aspects to your liking.","parameters":{"---General---":"","Action Speed":"agi","Default System":"dtb","---Escape---":"","Escape Ratio":"0.5 * $gameParty.agility() / $gameTroop.agility()","Fail Escape Boost":"0.10","---Animation---":"","Animation Base Delay":"0","Animation Next Delay":"0","Certain Hit Animation":"0","Physical Animation":"52","Magical Animation":"51","Enemy Attack Animation":"39","Reflect Animation":"42","Motion Waiting":"false","---Frontview---":"","Front Position X":"Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index","Front Position Y":"Graphics.boxHeight - 180","Front Actor Sprite":"false","Front Sprite Priority":"1","---Sideview---":"","Home Position X":"screenWidth - 16 - (maxSize + 2) * 32 + index * 32","Home Position Y":"screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32","Side Sprite Priority":"1","---Sprites---":"","Default X Anchor":"0.50","Default Y Anchor":"1.00","Step Distance":"48","Flinch Distance":"12","Show Shadows":"true","---Damage Popups---":"","Popup Duration":"128","Newest Popup Bottom":"true","Popup Overlap Rate":"0.9","Critical Popup":"255, 0, 0, 160","Critical Duration":"60","---Tick-Settings---":"","Timed States":"false","Timed Buffs":"false","Turn Time":"100","AI Self Turns":"true","---Window Settings---":"","Lower Windows":"true","Window Rows":"4","Command Window Rows":"4","Command Alignment":"center","Start Actor Command":"true","Current Max":"false","---Selection Help---":"","Mouse Over":"true","Select Help Window":"true","User Help Text":"User","Ally Help Text":"Ally","Allies Help Text":"Allies","Enemy Help Text":"Enemy","Enemies Help Text":"Enemies","All Help Text":"All %1","Random Help Text":"%2 Random %1","---Enemy Select---":"","Visual Enemy Select":"true","Show Enemy Name":"true","Show Select Box":"false","Enemy Font Size":"20","Enemy Auto Select":"this.furthestRight()","---Actor Select---":"","Visual Actor Select":"true","---Battle Log---":"","Show Emerge Text":"false","Show Pre-Emptive Text":"true","Show Surprise Text":"true","Optimize Speed":"true","Show Action Text":"false","Show State Text":"false","Show Buff Text":"false","Show Counter Text":"true","Show Reflect Text":"true","Show Substitute Text":"true","Show Fail Text":"false","Show Critical Text":"false","Show Miss Text":"false","Show Evasion Text":"false","Show HP Text":"false","Show MP Text":"false","Show TP Text":"false"}},
{"name":"YEP_X_VisualHpGauge","status":true,"description":"v1.07 (Requires YEP_BattleEngineCore.js) Reveal HP Gauges\r\nwhen a battler is selected or takes damage in battle.","parameters":{"---General---":"","Display Actor":"true","Defeat First":"false","Always Visible":"false","---Appearance---":"","Minimum Gauge Width":"144","Gauge Height":"18","Back Color":"19","HP Color 1":"20","HP Color 2":"21","Gauge Duration":"30","Gauge Position":"false","Y Buffer":"-16","Use Thick Gauges":"true","---Text Display---":"","Show HP":"false","Show Value":"false","Show Max":"false"}},
{"name":"YEP_ShopMenuCore","status":true,"description":"v1.05 Revamps the shop menu appearance and provides the\r\nframework for many new shop options.","parameters":{"---General---":"","Command Order":"Buy Sell Cancel","Shop List Width":"Graphics.boxWidth / 2 + Graphics.boxWidth / 10","Command Alignment":"center","---Status Window---":"","Default Mode":"actor","Stat Switching":"true","Cannot Equip":"Can't Equip","Stat Font Size":"20","Cannot Equip Font Size":"20","---Info Window---":"","Show Icon":"true","Icon Size":"128","Font Size":"20","Recovery Format":"%1 Heal","Add State":"+State","Add Buff":"+Buff","Remove State":"-State","Remove Buff":"-Buff","Maximum Icons":"4"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_ItemCore","status":true,"description":"v1.30 Changes the way Items are handled for your game\r\nand the Item Scene, too.","parameters":{"---General---":"","Max Items":"0","Max Weapons":"100","Max Armors":"100","Starting ID":"3000","Random Variance":"0","Negative Variance":"false","Name Format":"%1%2%3%4","Name Spacing":"true","Boost Format":"(+%1)","---Item Scene---":"","Updated Scene Item":"true","List Equipped Items":"true","Show Icon":"true","Icon Size":"128","Font Size":"20","Command Alignment":"center","Recovery Format":"%1 恢复","Add State":"+状态","Add Buff":"+增益","Remove State":"-状态","Remove Buff":"-增益","Maximum Icons":"4","Use Command":"使用 %1","Carry Format":"%1/%2","--Independent Items--":"","Midgame Note Parsing":"false"}},
{"name":"YEP_X_ItemCategories","status":true,"description":"v1.01 (Requires YEP_ItemCore.js) Assign items to various\r\ncategories under the item menu.","parameters":{"---General---":"","Category Order":"Category:物品, Category:战斗卡, Category:物品卡, Category:技巧卡","---Naming---":"","Hidden Item A":"Special Items","Hidden Item B":"Unique Items","Consumable":"Consumable","Nonconsumable":"Nonconsumable","Always Usable":"Usable","Battle Usable":"Battle","Field Usable":"Field","Never Usable":"Misc"}},
{"name":"YEP_X_ItemPictureImg","status":true,"description":"v1.01 (Requires YEP_ItemCore.js) Allows you to use images\r\nfor items inside of the item menu instead of large icons.","parameters":{"Max Image Width":"144","Max Image Height":"144"}},
{"name":"YEP_X_ItemDiscard","status":true,"description":"v1.02 (Requires YEP_ItemCore.js) Allow the player to discard\nitems from their inventory.","parameters":{"---General---":"","Discard Command":"扔掉 %1 %2/%3","Default Discard":"true","---Confirm---":"","Confirm Discard":"true","Confirm Message":"你确定你要扔掉 %1 %2?","Confirm Yes":"确定","Confirm No":"不要扔掉"}},
{"name":"DEX_WeightLimit","status":true,"description":"v1.00 Adds weight limit to party inventory","parameters":{"Actor Weight Limit":"200","Party Weight Limit":"0","Item Weight":"0","Gold Weight":"0","Text Before":"重量:","Text After":"","Text Unit":"斤","Overweight Text Color":"17","Disable Dash":"true","Normal Speed":"4","Overweight Speed":"2"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_InstantCast","status":true,"description":"v1.12 Allows skills/items to be instantly cast after being\r\nselected in the battle menu.","parameters":{"Instant Icon":"0"}},
{"name":"YEP_EventMiniLabel","status":true,"description":"v1.12 Creates miniature-sized labels over events to allow\r\nyou to insert whatever text you'd like in them.","parameters":{"Default Show":"true","Minimum Width":"136","Font Size":"20","X Buffer":"0","Y Buffer":"36","Battle Transition":"false"}},
{"name":"YEP_MessageCore","status":true,"description":"v1.19 Adds more features to the Message Window to customized\r\nthe way your messages appear and functions.","parameters":{"---General---":"","Default Rows":"4","Default Width":"Graphics.boxWidth","Face Indent":"Window_Base._faceWidth + 24","Fast Forward Key":"pagedown","Enable Fast Forward":"true","Word Wrapping":"false","Description Wrap":"false","Word Wrap Space":"false","Tight Wrap":"false","---Font---":"","Font Name":"GameFont","Font Name CH":"SimHei, Heiti TC, sans-serif","Font Name KR":"Dotum, AppleGothic, sans-serif","Font Size":"28","Font Size Change":"12","Font Changed Max":"96","Font Changed Min":"12","Font Outline":"4","Maintain Font":"false","---Name Box---":"","Name Box Buffer X":"-28","Name Box Buffer Y":"0","Name Box Padding":"this.standardPadding() * 4","Name Box Color":"0","Name Box Clear":"false","Name Box Added Text":"\\c[6]","Name Box Auto Close":"false"}},
{"name":"YEP_X_ExtMesPack1","status":true,"description":"v1.12 (Requires YEP_MessageCore.js) Letter Sounds, NameBox\nBackground Types, Choice Control, and more!","parameters":{"---Letter Sounds---":"","Enable Sound":"true","Sound Name":"Cursor1","Sound Volume":"50","Sound Pitch":"100","Pitch Variance":"10","Sound Pan":"0","Pan Variance":"10","Sound Interval":"2","Reset Sounds":"false","---Message Anchor---":"","Default X":"left","Default Y":"bottom","Auto Row Full Face":"true","---Message Choices---":"","Max Rows":"6","Choice 1 Show Switch":"0","Choice 2 Show Switch":"0","Choice 3 Show Switch":"0","Choice 4 Show Switch":"0","Choice 5 Show Switch":"0","Choice 6 Show Switch":"0","Choice 7 Show Switch":"0","Choice 8 Show Switch":"0","Choice 9 Show Switch":"0","Choice 10 Show Switch":"0","Choice 11 Show Switch":"0","Choice 12 Show Switch":"0","Choice 13 Show Switch":"0","Choice 14 Show Switch":"0","Choice 15 Show Switch":"0","Choice 16 Show Switch":"0","Choice 17 Show Switch":"0","Choice 18 Show Switch":"0","Choice 19 Show Switch":"0","Choice 20 Show Switch":"0","Choice 1 On Switch":"0","Choice 2 On Switch":"0","Choice 3 On Switch":"0","Choice 4 On Switch":"0","Choice 5 On Switch":"0","Choice 6 On Switch":"0","Choice 7 On Switch":"0","Choice 8 On Switch":"0","Choice 9 On Switch":"0","Choice 10 On Switch":"0","Choice 11 On Switch":"0","Choice 12 On Switch":"0","Choice 13 On Switch":"0","Choice 14 On Switch":"0","Choice 15 On Switch":"0","Choice 16 On Switch":"0","Choice 17 On Switch":"0","Choice 18 On Switch":"0","Choice 19 On Switch":"0","Choice 20 On Switch":"0"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_SkillCore","status":true,"description":"v1.13 Skills are now given more functions and the ability\r\nto require different types of costs.","parameters":{"---General---":"","Cost Padding":"4","Command Alignment":"center","Window Columns":"2","---HP Costs---":"","HP Format":"%1%2","HP Font Size":"20","HP Text Color":"18","HP Icon":"162","---MP Costs---":"","MP Format":"%1%2","MP Font Size":"20","MP Text Color":"23","MP Icon":"165","---TP Costs---":"","TP Format":"%1%2","TP Font Size":"20","TP Text Color":"29","TP Icon":"164"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_QuestJournal","status":true,"description":"v1.01 Insert a quest journal system into your game!","parameters":{"---Main Menu---":"","Quest Command":"任务","Show Command":"true","Enable Command":"true","Auto Place Command":"true","---Quest Menu---":"","Quest Category Window":"{\"---Categories---\":\"\",\"Category Order\":\"[\\\"available\\\",\\\"completed\\\",\\\"failed\\\",\\\"all\\\"]\",\"Available Text\":\"\\\\i[192]可以做 (%1)\",\"Completed Text\":\"\\\\i[191]完成 (%1)\",\"Failed Text\":\"\\\\i[194]失败了 (%1)\",\"All Text\":\"\\\\i[189]全部的任务 (%1)\",\"Cancel Text\":\"\\\\i[161]关了\",\"---Window Settings---\":\"\",\"X\":\"0\",\"Y\":\"0\",\"Width\":\"Graphics.boxWidth / 3\",\"Height\":\"this.fittingHeight(this.numVisibleRows())\",\"Rows\":\"4\",\"Columns\":\"1\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Text Alignment\":\"left\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\"}","Quest List Window":"{\"---Types---\":\"\",\"Show Types\":\"true\",\"Type Order\":\"[\\\"\\\\\\\\c[6]主要任务\\\",\\\"\\\\\\\\c[4]支线任务\\\",\\\"\\\\\\\\c[5]辅导任务\\\"]\",\"List Open Symbol\":\"-\",\"List Closed Symbol\":\"+\",\"Type Text Format\":\"%1%2 (%3)\",\"Quest Indent\":\"0\",\"Show Empty\":\"false\",\"Read Quest\":\"\\\\i[121]读任务\",\"Cancel\":\"\\\\i[16]取消\",\"---Window Settings---\":\"\",\"X\":\"0\",\"Y\":\"Graphics.boxHeight - height\",\"Width\":\"Graphics.boxWidth / 3\",\"Height\":\"Graphics.boxHeight - this.fittingHeight(4)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Type Alignment\":\"left\",\"Quest Alignment\":\"left\",\"Window Skin\":\"Window\"}","Quest Title Window":"{\"---Window Settings---\":\"\",\"No Quest Title\":\"\\\\c[4] 任务笔记本\",\"X\":\"Graphics.boxWidth - width\",\"Y\":\"0\",\"Width\":\"Graphics.boxWidth * 2 / 3\",\"Height\":\"this.fittingHeight(1)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Text Alignment\":\"center\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\"}","Quest Data Window":"{\"---Data Settings---\":\"\",\"No Data Text\":\"\\\"\\\\\\\\c[4]任务笔记本\\\\\\\\c[0].\\\\n\\\\n在这儿你可以看到你所有的任务。 \\\"\",\"Quest Data Format\":\"\\\"<WordWrap>\\\\\\\\{%1\\\\\\\\}\\\\n<br>\\\\\\\\c[4]等级(děngjí):\\\\\\\\c[0] %2\\\\n<br>\\\\\\\\c[4]从(cóng):\\\\\\\\c[0] %3\\\\n<br>\\\\\\\\c[4]位置(wèizhì):\\\\\\\\c[0] %4\\\\n<br>\\\\n<br>\\\\\\\\c[4]描述(miáoshù):\\\\\\\\c[0]\\\\n<br>%5\\\\n<br>\\\\n<br>\\\\\\\\c[4]目标(mùbiāo):\\\\\\\\c[0]\\\\n<br>%6\\\\n<br>\\\\n<br>\\\\\\\\c[4]报酬(bàochóu):\\\\\\\\c[0]\\\\n<br>%7\\\\n<br>\\\\n<br>%8\\\"\",\"Uncleared Objective\":\"\\\\i[160]%1\",\"Completed Objective\":\"\\\\i[165]%1\",\"Failed Objective\":\"\\\\i[162]%1\",\"Unclaimed Reward\":\"\\\\i[160]%1\",\"Claimed Reward\":\"\\\\i[163]%1\",\"Denied Reward\":\"\\\\i[161]%1\",\"Load Delay\":\"30\",\"---Window Settings---\":\"\",\"X\":\"Graphics.boxWidth - width\",\"Y\":\"Graphics.boxHeight - height\",\"Width\":\"Graphics.boxWidth * 2 / 3\",\"Height\":\"Graphics.boxHeight - this.fittingHeight(1)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\",\"Scroll Speed\":\"4\"}","Lunatic Mode":"{\"---Quest Menu---\":\"\",\"Before Create Windows\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\\n//\\\\n// background.bitmap = ImageManager.loadTitle1(\\\\\\\"Book\\\\\\\");\\\\n// this.fitScreen(background);\\\"\",\"After Create Windows\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\"\",\"Close Quest Menu\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\"\",\"---Quest Status---\":\"\",\"Quest Add\":\"\\\"// Variables:\\\\n//   questId - ID of the quest being added\\\\n//\\\\n// console.log('Quest ' + questId + ' successfully added!')\\\"\",\"Quest Remove\":\"\\\"// Variables:\\\\n//   questId - ID of the quest being removed\\\\n//\\\\n// console.log('Quest ' + questId + ' successfully removed!')\\\"\",\"Quest Complete\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to completed\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Completed!')\\\"\",\"Quest Fail\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to failed\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Failed!')\\\"\",\"Quest Available\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to available\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Available!')\\\"\",\"---Description---\":\"\",\"Change Description\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose description is changed\\\\n//   index - Description index being changed to\\\\n//\\\\n// console.log('Quest ' + questId + ' description index changed to ' + index)\\\"\",\"---Objectives---\":\"\",\"Show Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being shown\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to shown!')\\\"\",\"Hide Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being hidden\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to hidden!')\\\"\",\"Complete Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being completed\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to completed!')\\\"\",\"Fail Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective having failed\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to failed!')\\\"\",\"Normalize Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective normalized\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to normal!')\\\"\",\"---Rewards---\":\"\",\"Show Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward being shown\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' becomes shown!')\\\"\",\"Hide Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward being hidden\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' becomes hidden!')\\\"\",\"Claim Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward becoming claimed\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is now claimed!')\\\"\",\"Deny Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward becoming denied\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is now denied!')\\\"\",\"Normalize Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward normalized\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is normalized!')\\\"\",\"---Subtext---\":\"\",\"Change Subtext\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose subtext is changed\\\\n//   index - Subtext index being changed to\\\\n//\\\\n// console.log('Quest ' + questId + ' subtext index changed to ' + index)\\\"\"}","---Quest List---":"","Quest 1":"{\"Title\":\"\\\\i[87]战斗卡\",\"Type\":\"辅导任务\",\"Difficulty\":\"简单\",\"From\":\"李娜\",\"Location\":\"北京\",\"Description\":\"[\\\"\\\\\\\"你去找\\\\\\\\\\\\\\\\c[10]张伟\\\\\\\\\\\\\\\\c[0].\\\\\\\"\\\",\\\"\\\\\\\"你和\\\\\\\\\\\\\\\\c[10]蝙蝠\\\\\\\\\\\\\\\\c[0] 战斗.\\\\\\\\n\\\\\\\\n\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第一:\\\\\\\\\\\\\\\\c[0] 和\\\\\\\\\\\\\\\\c[10]张伟\\\\\\\\\\\\\\\\c[0]说话.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第二:\\\\\\\\\\\\\\\\c[0] 和\\\\\\\\\\\\\\\\c[10]蝙蝠\\\\\\\\\\\\\\\\c[0]战斗.\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[249]蝙蝠卡 x2\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"\"}","Quest 2":"{\"Title\":\"\\\\i[87]物品卡\",\"Type\":\"辅导任务\",\"Difficulty\":\"简单\",\"From\":\"李娜\",\"Location\":\"北京\",\"Description\":\"[\\\"\\\\\\\"去找\\\\\\\\\\\\\\\\c[10]宋海叶\\\\\\\\\\\\\\\\c.\\\\\\\"\\\",\\\"\\\\\\\"从那棵树取一个\\\\\\\\\\\\\\\\c[3]树卡\\\\\\\\\\\\\\\\c\\\\\\\"\\\",\\\"\\\\\\\"找五块儿\\\\\\\\\\\\\\\\c[4]布\\\\\\\\\\\\\\\\c还有五块儿\\\\\\\\\\\\\\\\c[4]砂石\\\\\\\\\\\\\\\\c\\\\\\\"\\\",\\\"\\\\\\\"给\\\\\\\\\\\\\\\\c[10]宋海叶\\\\\\\\\\\\\\\\c五块儿\\\\\\\\\\\\\\\\c[4]布\\\\\\\\\\\\\\\\c还有五块儿\\\\\\\\\\\\\\\\c[4]砂石\\\\\\\\\\\\\\\\c。\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第一：\\\\\\\\\\\\\\\\c[0] 和\\\\\\\\\\\\\\\\c[10]宋海叶\\\\\\\\\\\\\\\\c说话.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第二：\\\\\\\\\\\\\\\\c[0] 取一个\\\\\\\\\\\\\\\\c[3]树卡\\\\\\\\\\\\\\\\c然后给\\\\\\\\\\\\\\\\c[10]宋海叶\\\\\\\\\\\\\\\\c一块儿\\\\\\\\\\\\\\\\c[4]木头\\\\\\\\\\\\\\\\c.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第三：\\\\\\\\\\\\\\\\c[0] 找到五块儿\\\\\\\\\\\\\\\\c[4]布\\\\\\\\\\\\\\\\c和五块儿\\\\\\\\\\\\\\\\c[4]砂石\\\\\\\\\\\\\\\\c.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第四：\\\\\\\\\\\\\\\\c[0] 给\\\\\\\\\\\\\\\\c[10]宋海叶\\\\\\\\\\\\\\\\c\\\\\\\\\\\\\\\\c[4]砂石\\\\\\\\\\\\\\\\c和\\\\\\\\\\\\\\\\c[4]布\\\\\\\\\\\\\\\\c.\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[248]树卡 x2\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[248]砂石卡 x2\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 3":"{\"Title\":\"\\\\i[87]抓动物\",\"Type\":\"辅导任务\",\"Difficulty\":\"简单\",\"From\":\"王盾\",\"Location\":\"北京\",\"Description\":\"[\\\"\\\\\\\"帮助/c[10]王盾\\\\\\\\\\\\\\\\c抓三只猪。\\\\\\\"\\\",\\\"\\\\\\\"帮助/c[10]王盾\\\\\\\\\\\\\\\\c抓三只小鸡。\\\\\\\"\\\",\\\"\\\\\\\"帮助/c[10]王盾\\\\\\\\\\\\\\\\c抓三只兔子。\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第一：\\\\\\\\\\\\\\\\c[0] 抓三只猪.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第二：\\\\\\\\\\\\\\\\c[0] 抓三只小鸡.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第三：\\\\\\\\\\\\\\\\c[0] 抓三只兔子.\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[314]Gold x50\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 4":"{\"Title\":\"\\\\i[87]坟地\",\"Type\":\"辅导任务\",\"Difficulty\":\"中等\",\"From\":\"李娟\",\"Location\":\"北京\",\"Description\":\"[\\\"\\\\\\\"帮助\\\\\\\\\\\\\\\\c[10]李娟\\\\\\\\\\\\\\\\c放好墓碑。\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第一\\\\\\\\\\\\\\\\c[0] 把墓碑放好.\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[314]Gold x50\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 5":"{\"Title\":\"\\\\i[87]宝剑\",\"Type\":\"辅导任务\",\"Difficulty\":\"简单\",\"From\":\"冯月婷\",\"Location\":\"北京\",\"Description\":\"[\\\"\\\\\\\"去\\\\\\\\\\\\\\\\c[10]冯月婷\\\\\\\\\\\\\\\\c的家拿\\\\\\\\\\\\\\\\c[4]宝剑\\\\\\\\\\\\\\\\c\\\\\\\"\\\",\\\"\\\\\\\"把\\\\\\\\\\\\\\\\c[4]宝剑\\\\\\\\\\\\\\\\c给\\\\\\\\\\\\\\\\c[10]冯月婷\\\\\\\\\\\\\\\\c\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第一：\\\\\\\\\\\\\\\\c[0] 去\\\\\\\\\\\\\\\\c[10]冯月婷\\\\\\\\\\\\\\\\c的家.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第二：\\\\\\\\\\\\\\\\c[0] 找到\\\\\\\\\\\\\\\\c[4]宝剑\\\\\\\\\\\\\\\\c.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]第三：\\\\\\\\\\\\\\\\c[0] 把\\\\\\\\\\\\\\\\c[4]宝剑\\\\\\\\\\\\\\\\c\\\\\\\\\\\\\\\\c[10]给冯月婷\\\\\\\\\\\\\\\\c.\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[314] Gold x50\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 6":"","Quest 7":"","Quest 8":"","Quest 9":"","Quest 10":"","Quest 11":"","Quest 12":"{\"Title\":\"\\\\i[87]Untitled Quest\",\"Type\":\"Main Quests\",\"Difficulty\":\"Easy Peasy\",\"From\":\"NPC Name\",\"Location\":\"Location Name\",\"Description\":\"[\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]First\\\\\\\\\\\\\\\\c[0] objective to be cleared.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[176]Potion x5\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[178]Ether x3\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 13":"","Quest 14":"","Quest 15":"","Quest 16":"","Quest 17":"","Quest 18":"","Quest 19":"","Quest 20":"","Quest 21":"","Quest 22":"","Quest 23":"","Quest 24":"","Quest 25":"","Quest 26":"","Quest 27":"","Quest 28":"","Quest 29":"","Quest 30":"","Quest 31":"","Quest 32":"","Quest 33":"","Quest 34":"","Quest 35":"","Quest 36":"","Quest 37":"","Quest 38":"","Quest 39":"","Quest 40":"","Quest 41":"","Quest 42":"","Quest 43":"","Quest 44":"","Quest 45":"","Quest 46":"","Quest 47":"","Quest 48":"","Quest 49":"","Quest 50":"","Quest 51":"","Quest 52":"","Quest 53":"","Quest 54":"","Quest 55":"","Quest 56":"","Quest 57":"","Quest 58":"","Quest 59":"","Quest 60":"","Quest 61":"","Quest 62":"","Quest 63":"","Quest 64":"","Quest 65":"","Quest 66":"","Quest 67":"","Quest 68":"","Quest 69":"","Quest 70":"","Quest 71":"","Quest 72":"","Quest 73":"","Quest 74":"","Quest 75":"","Quest 76":"","Quest 77":"","Quest 78":"","Quest 79":"","Quest 80":"","Quest 81":"","Quest 82":"","Quest 83":"","Quest 84":"","Quest 85":"","Quest 86":"","Quest 87":"","Quest 88":"","Quest 89":"","Quest 90":"","Quest 91":"","Quest 92":"","Quest 93":"","Quest 94":"","Quest 95":"","Quest 96":"","Quest 97":"","Quest 98":"","Quest 99":"","Quest 100":""}},
{"name":"YEP_X_MapQuestWindow","status":true,"description":"v1.01 (Requires YEP_QuestJournal.js) Adds a window on the\r\nmap scene to display an active quest.","parameters":{"---Main---":"","Window Settings":"{\"---General---\":\"\",\"Word Wrap Objectives\":\"true\",\"Default Show\":\"true\",\"---Window Settings---\":\"\",\"X\":\"Graphics.boxWidth - width\",\"Y\":\"0\",\"Scale\":\"0.50\",\"Width\":\"Graphics.boxWidth / 3\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\"}","Set Active":"\\i[189]Set Active","Currently Active":"\\i[189]Currently Active","Clear Active":"\\i[186]Clear Active","---Options---":"","Options Command":"Active Quest Window","Options Enable":"true","---Automatic Updates---":"","Quest Add":"true","Quest Complete":"true","Quest Failed":"true","Change Objectives":"true","Event Update":"true"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"YEP_EventChasePlayer","status":true,"description":"v1.07 When a player is in the proximity of a certain event,\nthe event will start chasing or fleeing from the player.","parameters":{"Sight Lock":"300","See Player":"true","Alert Timer":"120","Alert Balloon":"1","Alert Sound":"Attack1","Alert Common Event":"0","Return After":"true","Return Wait":"180"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"OcRam_Passages","status":true,"description":"v2.05 This plugin uses region ID to determine a player\r\n'floor level'. Even autotiles can be drawn ABOVE players.","parameters":{"Underpass Region ID":"16","Overpass Region ID":"17","Cover Region ID":"18","Cover Autotile Region ID":"19","Block Region ID":"20","Overhead Region ID":"21","Block High-Low Region ID":"22"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"ItemBook","status":true,"description":"v1.01 Displays detailed statuses of items.","parameters":{"Unknown Data":"??????","Price Text":"Price","Equip Text":"Equip","Type Text":"Type"}},
{"name":"EnemyBook","status":true,"description":"Displays detailed statuses of enemies.","parameters":{"Unknown Data":"??????"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"SRD_SummonCore","status":true,"description":"Allows developers to create skills that summon Actors into the player's party using various parameters.","parameters":{"Battlelog Message":"你召唤了 %1 !","Max Summons":"1","Restrict Per Skill":"true","Restrict Per Position":"true","== Defaults ==":"","Default Actor ID":"1","Default Level":"1","Default Animation":"51","Default Exit Ani.":"51","Default Turns":"-1","Default X Pos":"master._homeX + 100","Default Y Pos":"master._homeY + 100"}},
{"name":"SRD_SummonBattlerImages","status":true,"description":"Allows summoned Actors to use static battler images as opposed to side-view Actor battler images.","parameters":{}},
{"name":"SRD_NameInputUpgrade","status":true,"description":"Improves upon the \"Name Input\" screen for your RPG Maker MV game.","parameters":{"Keyboard Mode?":"true","Display Message":"Input a name.","Display Message 2":"Press ENTER when ready.","Help Window Width":"400","Help Window Height":"this.fittingHeight(2)","== Display Options ==":"","Show Face":"true","Background Image":"","Scale Background?":"true","Name Opacity":"255","Keyboard Opacity":"255","Help Opacity":"255","Underline Color":"0","Text Color":"0","Name Display X":"0","Name Display Y":"100","Help Window X":"0","Help Window Y":"40","= Custom Characters =":"","LATIN 1 Row 1":"A,B,C,D,E,a,b,c,d,e","LATIN 1 Row 2":"F,G,H,I,J,f,g,h,i,j","LATIN 1 Row 3":"K,L,M,N,O,k,l,m,n,o","LATIN 1 Row 4":"P,Q,R,S,T,p,q,r,s,t","LATIN 1 Row 5":"U,V,W,X,Y,u,v,w,x,y","LATIN 1 Row 6":"Z,[,],^,_,z,{,},|,~","LATIN 1 Row 7":"0,1,2,3,4,!,#,$,%,&","LATIN 1 Row 8":"5,6,7,8,9,(,),*,+,-","LATIN 1 Row 9":"/,=,?,<,>,:,;, ,Page,OK","LATIN 2 Row 1":"Á,É,Í,Ó,Ú,á,é,í,ó,ú","LATIN 2 Row 2":"À,È,Ì,Ò,Ù,à,è,ì,ò,ù","LATIN 2 Row 3":"Â,Ê,Î,Ô,Û,â,ê,î,ô,û","LATIN 2 Row 4":"Ä,Ë,Ï,Ö,Ü,ä,ë,ï,ö,ü","LATIN 2 Row 5":"Ā,Ē,Ī,Ō,Ū,ā,ē,ī,ō,ū","LATIN 2 Row 6":"Ã,Å,Æ,Ç,Ð,ã,å,æ,ç,ð","LATIN 2 Row 7":"Ñ,Õ,Ø,Š,Ŵ,ñ,õ,ø,š,ŵ","LATIN 2 Row 8":"Ý,Ŷ,Ÿ,Ž,Þ,ý,ÿ,ŷ,ž,þ","LATIN 2 Row 9":"Ĳ,Œ,ĳ,œ,ß,«,»,,Page,OK"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"Tiny_PopUpIcon","status":true,"description":"This lets you pop up icons like you can do with balloons and such.","parameters":{"General Settings":"","Auto PopUp":"On","Time":"60","IconSet Name":"IconSet","Sound Settings":"On","Sound":"Jump1","Volume":"100","Pitch":"100","Advanced Settings":"","Icon Collums":"16","Icon Width":"32","Icon Height":"32","Icon Offset Y":"-16","Text Offset Y":"-8","Text Size":"14\r"}},
{"name":"ludosavepathing","status":true,"description":"plugin that tracks movement of the player when entering a given map and outputs that information to a file.","parameters":{"Default SwitchId":"20","Max Saves":"50","Save on Title Screen":"true"}},
{"name":"===========","status":false,"description":"=================================","parameters":{}},
{"name":"BBS_TermWindow","status":true,"description":"v1.03b Allows a popup help window to explain game terms while\r\nand only while a message box (dialogue) is open.\r\nSpecial thanks to Yanfly, this borrows structures from his YEP_MessageCore, and my\r\nown BBS_RandomConversations.js.\r\n\r\n============================================================================\r\nTerms of Use\r\n============================================================================\r\n - Free for use in non-commercial projects with credits\r\n - Contact me for commercial use\r\n\r\n============================================================================\r\nParameters\r\n============================================================================","parameters":{"Term File":"data/TermsDic.json","Term Color Index":"4","=== KEYS USED ===":"","Help Key":"pageup","Previous Term Key":"left","Next Term Key":"right","=== HELP PROMPT WINDOW ===":"","Help Prompt":"","Help Prompt Width":"200","Help Prompt Buffer X":"0","Help Prompt Buffer Y":"-29","Help Prompt Text Size":"10","Help Prompt Text Color":"","=== TERM WINDOW ===":"","Term Window Windowskin":"","Term Window Width":"200","Term Window Height":"200","=== TERM WINDOW TITLE ===":"","Title Font":"","Title Size":"22","Title Color":"","Title Outline Color":"","Title Italic":"false","=== TERM WINDOW LINE ===":"","Line Center Color":"rgba(255,255,255,1)","Line Border Color":"rgba(255,255,255,0)","=== DETAILS TEXT ===":"","Text Font":"","Text Size":"20","Text Outline Color":"","Debug Mode":"true"}}
];
