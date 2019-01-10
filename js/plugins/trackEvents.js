/*:
 * @plugindesc Tracks each time you click on an event.
 * @author Frederick J Poole
 *
 *
 * @help This plugin does not provide plugin commands.
 */

// ----------------------------------------------------------------------------------------------------------------------------
// STV_MonsterCards Parameters
// ----------------------------------------------------------------------------------------------------------------------------
    var stv_MonsterCards_parameters = PluginManager.parameters('STV_MonsterCards');

//  --- Functions ---
    var stv_MonsterCards_completeSwitch = Number(stv_MonsterCards_parameters['Found All Cards Switch']);
    var stv_MonsterCards_maxDeckSize = Number(stv_MonsterCards_parameters['Max Deck Size']);

//  ----- Window -----
    var stv_MonsterCards_showWindow = String(stv_MonsterCards_parameters['Show Window'] || 'TRUE');
    var stv_MonsterCards_bgPicture = String(stv_MonsterCards_parameters['Background Picture'] || '');
    var stv_MonsterCards_unknownColor = Number(stv_MonsterCards_parameters['Unknown Color'] || 7);
    var stv_MonsterCards_backBarColor = Number(stv_MonsterCards_parameters['Back Bars Color'] || 15);
    
//  ----- Text -----    
    var stv_MonsterCards_unknownData = String(stv_MonsterCards_parameters['Unknown Data'] || '???');
    var stv_MonsterCards_allCardsText = String(stv_MonsterCards_parameters['All Cards Text'] || 'All Cards');
    var stv_MonsterCards_deckText = String(stv_MonsterCards_parameters['Deck Text'] || 'Deck');
    var stv_MonsterCards_exitText = String(stv_MonsterCards_parameters['Exit Text'] || 'Exit');
    var stv_MonsterCards_addText = String(stv_MonsterCards_parameters['Add Text'] || 'Add');
    var stv_MonsterCards_removeText = String(stv_MonsterCards_parameters['Remove Text'] || 'Remove');
    var stv_MonsterCards_seriesText = String(stv_MonsterCards_parameters['Series Headline'] || 'Series:');
    var stv_MonsterCards_rarityText = String(stv_MonsterCards_parameters['Rarity Headline'] || 'Rarity:');
    var stv_MonsterCards_foundAt = String(stv_MonsterCards_parameters['First Found Headline'] || 'First found at:');
    var stv_MonsterCards_cardPoints = String(stv_MonsterCards_parameters['Card Points Headline'] || 'Card Points:');
    
//  ----- Cards -----    
    var stv_MonsterCards_cardBack = String(stv_MonsterCards_parameters['Card Back Picture'] || 'monster_back');
    var stv_MonsterCards_series1Icon = Number(stv_MonsterCards_parameters['Series 1 Icon'] || 89);
    var stv_MonsterCards_series2Icon = Number(stv_MonsterCards_parameters['Series 2 Icon'] || 88);
    var stv_MonsterCards_series3Icon = Number(stv_MonsterCards_parameters['Series 3 Icon'] || 87);
    var stv_MonsterCards_seriesIcons =[0, stv_MonsterCards_series1Icon, stv_MonsterCards_series2Icon, stv_MonsterCards_series3Icon];
    
//  --- ShowCards ---  
    var stv_MonsterCards_newText = String(stv_MonsterCards_parameters['New Card Text'] || 'NEW');
    var stv_MonsterCards_newIcon = Number(stv_MonsterCards_parameters['New Card Icon'] || 163);
    var stv_MonsterCards_showCardCommand = String(stv_MonsterCards_parameters['Show Card Command'] || 'Nice!');
    
//  --- ShowCards Sound ---  
    var stv_MonsterCards_meName = String(stv_MonsterCards_parameters['ME Name']);
    var stv_MonsterCards_meVolume = Number(stv_MonsterCards_parameters['ME Volume'] || 100);
    var stv_MonsterCards_mePitch = Number(stv_MonsterCards_parameters['ME Pitch'] || 100);
    
//  ----- GLOBAL -----       
    var stv_MonsterCards_selectedPlayerCard;
    var stv_MonsterCards_transparentBarOpacity = 80;
    var stv_MonsterCards_transparentCardOpacity = 150;
    

// ----------------------------------------------------------------------------------------------------------------------------
// Scene MonsterCardsManager create
// ----------------------------------------------------------------------------------------------------------------------------  
    Scene_MonsterCardsManager = function() {
        this.initialize.apply(this, arguments);
    };

    Scene_MonsterCardsManager.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_MonsterCardsManager.prototype.constructor = Scene_MonsterCardsManager;

    Scene_MonsterCardsManager.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };                                                          
    
    Scene_MonsterCardsManager.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
        if (stv_MonsterCards_bgPicture){
            this._foregroundSprite = new Sprite();
            this._foregroundSprite.move(0, 0, Graphics.width, Graphics.height);
            this._foregroundSprite.bitmap = ImageManager.loadPicture(stv_MonsterCards_bgPicture);
            this.addChild(this._foregroundSprite);
        }
    };
    
    Scene_MonsterCardsManager.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        
        this.createWindowPositions();
        
        this.createCommandWindow();
        this.createCommandWindow2();
        this.createAllCardsWindow();
        this.createAllCardsInfoWindow();
        this.createPlayerCardsWindow();
        this.createPlayerCardsInfoWindow();
        this.createDeckCardsWindow();
        
        if(stv_MonsterCards_showWindow != "TRUE"){
            this._commandWindow.opacity = 0;
            this._commandWindow2.opacity = 0;
            this._allCardsWindow.opacity = 0;
            this._allCardsInfoWindow.opacity = 0;
            this._playerCardsWindow.opacity = 0;
            this._playerCardsInfoWindow.opacity = 0;
            this._deckCardsWindow.opacity = 0;
        }
    };
    
    
// ----------------------------------------------------------------------------------------------------------------------------
// Create Window Positions
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createWindowPositions = function() {
        
        var maxWidth = Graphics.boxWidth,
            maxHeight = Graphics.boxHeight;
        
        var cX = 0,
            cY = 0,
            cW = maxWidth,
            cH = 72;
        this._commandWindow = new Window_MonsterCardsManager_Command(cX, cY, cW, cH);
        
        var c2X = 0,
            c2Y = cH,
            c2W = cW,
            c2H = cH;
        this._commandWindow2 = new Window_MonsterCardsManager_Command2(c2X, c2Y, c2W, c2H);
        
        var acX = 0,
            acY = cH,
            acW = (maxWidth/3),
            acH = maxHeight - cH;
        this._allCardsWindow = new Window_MonsterCardsManager_AllCards(acX, acY, acW, acH);
        
        var aciX = acW,
            aciY = acY,
            aciW = acW*2,
            aciH = acH;
        this._allCardsInfoWindow = new Window_MonsterCardsManager_AllCardsInfo(aciX, aciY, aciW, aciH);
        
        var pcX = 0,
            pcY = cH + c2H,
            pcW = acW,
            pcH = maxHeight - pcY;
        this._playerCardsWindow = new Window_MonsterCardsManager_PlayerCards(pcX, pcY, pcW, pcH);
        
        var pciX = pcW,
            pciY = pcY,
            pciW = pcW,
            pciH = pcH;
        this._playerCardsInfoWindow = new Window_MonsterCardsManager_PlayerCardsInfo(pciX, pciY, pciW, pciH);
        
        var dcX = pcW+pciW,
            dcY = pcY,
            dcW = pcW,
            dcH = pcH;
        this._deckCardsWindow = new Window_MonsterCardsManager_DeckCards(dcX, dcY, dcW, dcH);
        
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Refresh Windows
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.refreshWindows = function() {
            this._playerCardsWindow.refresh();
            this._playerCardsInfoWindow.refresh();
            this._deckCardsWindow.refresh();
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Setup Command Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createCommandWindow = function() {
        this._commandWindow.setHandler('allcards', this.allCardsSelect.bind(this));
        this._commandWindow.setHandler('deck', this.deckSelect.bind(this));
        this._commandWindow.setHandler('exit', this.popScene.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Setup Command Window 2
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createCommandWindow2 = function() {
        this._commandWindow2.setHandler('addcards', this.addCardsSelect.bind(this));
        this._commandWindow2.setHandler('removecards', this.removeCardsSelect.bind(this));
        this._commandWindow2.setHandler('cancel', this.deckCancel.bind(this));
        this.addWindow(this._commandWindow2);
        this._commandWindow2.hide();
        this._commandWindow2.deactivate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Setup All Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createAllCardsWindow = function() {
        this._allCardsWindow.setHandler('cancel', this.allCardsCancel.bind(this));
        this._allCardsWindow.setAllCardsInfoWindow(this._allCardsInfoWindow);
        this.addWindow(this._allCardsWindow);
        this._allCardsWindow.hide();
        this._allCardsWindow.deactivate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Setup All Cards Info Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createAllCardsInfoWindow = function() {
        this.addWindow(this._allCardsInfoWindow);
        this._allCardsInfoWindow.hide();
    }; 

// ----------------------------------------------------------------------------------------------------------------------------
// Setup Player Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createPlayerCardsWindow = function() {
        this._playerCardsWindow.setHandler('ok', this.playerCardsSelect.bind(this));
        this._playerCardsWindow.setHandler('cancel', this.playerCardsCancel.bind(this));
        this._playerCardsWindow.setPlayerCardsInfoWindow(this._playerCardsInfoWindow);
        this.addWindow(this._playerCardsWindow);
        this._playerCardsWindow.hide();
        this._playerCardsWindow.deactivate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Setup Player Cards Info Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createPlayerCardsInfoWindow = function() {
        this.addWindow(this._playerCardsInfoWindow);
        this._playerCardsInfoWindow.hide();
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Setup Deck Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.createDeckCardsWindow = function() {
        this._deckCardsWindow.setHandler('ok', this.deckCardsSelect.bind(this));
        this._deckCardsWindow.setHandler('cancel', this.deckCardsCancel.bind(this));
        this._deckCardsWindow.setPlayerCardsInfoWindow(this._playerCardsInfoWindow);
        this.addWindow(this._deckCardsWindow);
        this._deckCardsWindow.hide();
        this._deckCardsWindow.deactivate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On All Cards Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.allCardsSelect = function() {
        this._allCardsWindow.show();
        this._allCardsInfoWindow.show();
        this._allCardsWindow.activate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On All Cards Cancel
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.allCardsCancel = function() {
        this._allCardsWindow.deactivate();
        this._allCardsWindow.hide();
        this._allCardsInfoWindow.hide();
        this._commandWindow.activate();
    }; 
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Deck Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.deckSelect = function() {
        this._commandWindow2.show();
        this._commandWindow2.activate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Deck Cancel
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.deckCancel = function() {
        this._commandWindow2.hide();
        this._commandWindow.activate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Add Cards Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.addCardsSelect = function() {
        this._playerCardsWindow.show();
        this._playerCardsWindow.activate();
        this._playerCardsInfoWindow.show();
        this._deckCardsWindow.show();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Remove Cards Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.removeCardsSelect = function() {
        this._playerCardsWindow.show();
        this._playerCardsInfoWindow.show();
        this._deckCardsWindow.show();
        this._deckCardsWindow.activate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Player Cards Cancel
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.playerCardsCancel = function() {
        this._playerCardsWindow.hide();
        this._playerCardsWindow.deactivate();
        this._playerCardsInfoWindow.hide();
        this._deckCardsWindow.hide();
        this._deckCardsWindow.deactivate();
        this._commandWindow2.show();
        this._commandWindow2.activate();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Deck Cards Cancel
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.deckCardsCancel = function() {
        this.playerCardsCancel();
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Player Cards Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.playerCardsSelect = function() {
        if (stv_MonsterCards_selectedPlayerCard) {
                for (var i = 0; i < $monsterCards.playerCards.length; i++) {
                    if ($monsterCards.playerCards[i]._id == stv_MonsterCards_selectedPlayerCard._id) {
                        $monsterCards.playerCards.splice(i, 1);
                        break;
                    }
                }
                $monsterCards.playerDeck.push(stv_MonsterCards_selectedPlayerCard);
                this.refreshWindows();
        }
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// On Deck Cards Select
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsManager.prototype.deckCardsSelect = function() {
        if (stv_MonsterCards_selectedPlayerCard) {
                for (var i = 0; i < $monsterCards.playerDeck.length; i++) {
                    if ($monsterCards.playerDeck[i]._id == stv_MonsterCards_selectedPlayerCard._id) {
                        $monsterCards.playerDeck.splice(i, 1);
                        break;
                    }
                }
                $monsterCards.playerCards.push(stv_MonsterCards_selectedPlayerCard);
                this.refreshWindows();
        }
    };


// ----------------------------------------------------------------------------------------------------------------------------
// Fill Command Window
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsManager_Command() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_Command.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MonsterCardsManager_Command.prototype.constructor = Window_MonsterCardsManager_Command;

    Window_MonsterCardsManager_Command.prototype.initialize = function(x, y, width, height) {
        Window_HorzCommand.prototype.initialize.call(this, x, y, width, height);
    };

    Window_MonsterCardsManager_Command.prototype.maxCols = function() {
        return 3;
    };
    
    Window_MonsterCardsManager_Command.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    
    Window_MonsterCardsManager_Command.prototype.makeCommandList = function() {
        this.addCommand(stv_MonsterCards_allCardsText, 'allcards');
        this.addCommand(stv_MonsterCards_deckText, 'deck');
        this.addCommand(stv_MonsterCards_exitText, 'exit');
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Fill Command Window 2
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsManager_Command2() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_Command2.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MonsterCardsManager_Command2.prototype.constructor = Window_MonsterCardsManager_Command2;

    Window_MonsterCardsManager_Command2.prototype.initialize = function(x, y, width, height) {
        Window_HorzCommand.prototype.initialize.call(this, x, y, width, height);
    };

    Window_MonsterCardsManager_Command2.prototype.maxCols = function() {
        return 2;
    };
    
    Window_MonsterCardsManager_Command2.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    
    Window_MonsterCardsManager_Command2.prototype.makeCommandList = function() {
        this.addCommand(stv_MonsterCards_addText, 'addcards');
        this.addCommand(stv_MonsterCards_removeText, 'removecards');
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Fill All Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsManager_AllCards() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_AllCards.prototype = Object.create(Window_Selectable.prototype);
    Window_MonsterCardsManager_AllCards.prototype.constructor = Window_MonsterCardsManager_AllCards;

    Window_MonsterCardsManager_AllCards.lastTopRow = 0;
    Window_MonsterCardsManager_AllCards.lastIndex  = 0;

    Window_MonsterCardsManager_AllCards.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        
        this.refresh();
        this.setTopRow(Window_MonsterCardsManager_AllCards.lastTopRow);
        this.select(Window_MonsterCardsManager_AllCards.lastIndex);
    };
    
    Window_MonsterCardsManager_AllCards.prototype.maxCols = function() {
        return 1;
    };

    Window_MonsterCardsManager_AllCards.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };
    
    Window_MonsterCardsManager_AllCards.prototype.setAllCardsInfoWindow = function(window1) {
        this._allCardsInfoWindow = window1;
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_AllCards.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_AllCards.prototype.updateStatus = function() {
        
        var card = this._list[this.index()];
        if (this._allCardsInfoWindow) {
            this._allCardsInfoWindow.setCard(card);
        }
    };
    
    Window_MonsterCardsManager_AllCards.prototype.refresh = function() {
        this._list = [];
        for (var i = 1; i < $monsterCards.allCards.length; i++) {
            var card = $monsterCards.allCards[i];
                this._list.push(card);
        }
        this.contents.clear();
        this.drawAllItems();
    };

    Window_MonsterCardsManager_AllCards.prototype.drawItem = function(index) {
        var card = this._list[index],
            rect = this.itemRect(index);
            idText = card._printId + " - ";

        if (card._revealed){
            this.changeTextColor(this.textColor(card._color));
            this.drawText(card.name, rect.x + this.textWidth(idText), rect.y, rect.width - this.textWidth(idText));
        } else {
            this.changeTextColor(this.textColor(stv_MonsterCards_unknownColor));
            this.drawText(stv_MonsterCards_unknownData, rect.x + this.textWidth(idText), rect.y, rect.width);
        }
        this.drawText(idText, rect.x, rect.y, rect.width);
        this.changeTextColor(this.normalColor());
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Fill All Cards Info Window
// ----------------------------------------------------------------------------------------------------------------------------    
    function Window_MonsterCardsManager_AllCardsInfo() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_AllCardsInfo.prototype = Object.create(Window_Base.prototype);
    Window_MonsterCardsManager_AllCardsInfo.prototype.constructor = Window_MonsterCardsManager_AllCardsInfo;

    Window_MonsterCardsManager_AllCardsInfo.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.setCard = function(card) {
        this._card = card;
        this.refresh();
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.update = function() {
        Window_Base.prototype.update.call(this);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.drawCard = function() {
        var card = this._card;
        var center = ((this.contents.width)/2);
        this._cardSprite = new Sprite();
        this._cardSprite.move(center-42, 18, Graphics.width, Graphics.height); 
        if (card._revealed) {
            this._cardSprite.bitmap = ImageManager.loadCard(card.picName);
        } else {
            this._cardSprite.opacity = stv_MonsterCards_transparentCardOpacity;
            this._cardSprite.bitmap = ImageManager.loadCard(stv_MonsterCards_cardBack);
        }
        this.addChildToBack(this._cardSprite);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.drawRects = function() {
        this.contents.paintOpacity = stv_MonsterCards_transparentBarOpacity;
        for (var i = 1; i <= 4; i++) {
            this.contents.fillRect(0, this.lineHeight()*(5+(i*2)), this.contents.width, this.lineHeight(), this.textColor(stv_MonsterCards_backBarColor));
        }
        this.contents.paintOpacity = 255;   
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.drawHeadlines = function() {
        this.drawText(stv_MonsterCards_seriesText, 18, this.lineHeight()*7);
        this.drawText(stv_MonsterCards_rarityText, 18, this.lineHeight()*9);
        this.drawText(stv_MonsterCards_cardPoints, 18, this.lineHeight()*11);
        this.drawText(stv_MonsterCards_foundAt, 18, this.lineHeight()*13);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.drawHidden = function() {
        this.changeTextColor(this.textColor(stv_MonsterCards_unknownColor));
        for (var i = 1; i <= 4; i++) {
            this.drawText(stv_MonsterCards_unknownData, this.contents.width - this.textWidth(stv_MonsterCards_unknownData) - 18, this.lineHeight()*(5+(i*2)));
        }
        this.changeTextColor(this.normalColor());
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.drawRevealed = function() {
        var card = this._card;
        var center = ((this.contents.width)/2);
        var points = $monsterCards.createCardPoints(card);
        
        this.drawText(card.atk, center - this.textWidth(card.atk)/2, 138);
        this.drawText(card.hp, center - 32 - this.textWidth(card.hp)/2, 176);
        this.drawText(card.def, center + 32 - this.textWidth(card.def)/2, 176);
                
        this.changeTextColor(this.textColor(card._color));
        this.centerText(card.name, 120, center, 6);
        this.drawText(card._rarity, this.contents.width - this.textWidth(card._rarity) - 18, this.lineHeight()*9);
        this.changeTextColor(this.normalColor());
        
        this.drawIcon(stv_MonsterCards_seriesIcons[card.series], this.contents.width - 50, (this.lineHeight()*7) + 2);
        this.drawText(card.series, this.contents.width - this.textWidth(card.series) - 50 - 8, this.lineHeight()*7);
        this.drawText(points, this.contents.width - this.textWidth(points) - 18, this.lineHeight()*11);
        this.drawText(card._foundAt, this.contents.width - this.textWidth(card._foundAt) - 18, this.lineHeight()*13);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.createInfo = function() {
        var card = this._card; 
        this.removeChild(this._cardSprite);
        
        if (card){
            this.drawRects();
            this.drawHeadlines();
            this.drawCard();
            
            if (card._revealed) {
                this.drawRevealed();
            } else {
                this.drawHidden();
            }
        }
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.centerText = function(text, maxLength, x, y) {
        var newx = 0;
        if (this.textWidth(text) > maxLength) newx = ((this.textWidth(text) - maxLength)/2);
        this.drawText(text, x - (this.textWidth(text)/2) + newx, y, maxLength);
    };
    
    Window_MonsterCardsManager_AllCardsInfo.prototype.refresh = function() {
        this.contents.clear();
        this.createInfo();
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Fill Player Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsManager_PlayerCards() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_PlayerCards.prototype = Object.create(Window_Selectable.prototype);
    Window_MonsterCardsManager_PlayerCards.prototype.constructor = Window_MonsterCardsManager_PlayerCards;

    Window_MonsterCardsManager_PlayerCards.lastTopRow = 0;
    Window_MonsterCardsManager_PlayerCards.lastIndex  = 0;

    Window_MonsterCardsManager_PlayerCards.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        
        this.refresh();
        this.setTopRow(Window_MonsterCardsManager_PlayerCards.lastTopRow);
        this.select(Window_MonsterCardsManager_PlayerCards.lastIndex);
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.maxCols = function() {
        return 1;
    };

    Window_MonsterCardsManager_PlayerCards.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.setPlayerCardsInfoWindow = function(window1) {
        this._playerCardsInfoWindow = window1;
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.updateStatus = function() {
        var card = this._list[this.index()];
        if (this._playerCardsInfoWindow && this.active) {
            this._playerCardsInfoWindow.setCard(card);
        }
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.refresh = function() {
        this._list = [];
        for (var i = 0; i < $monsterCards.playerCards.length; i++) {
            var card = $monsterCards.playerCards[i];
            this._list.push(card); 
        }
        
        this._list = removeDouble(this._list);
        this._list.sort(sortId);
        
        this.createContents();
        this.drawAllItems();
    };

    Window_MonsterCardsManager_PlayerCards.prototype.drawItem = function(index) {
        var card = this._list[index],
            rect = this.itemRectForText(index);
            maxWidth = this.textWidth("99x ");
            count = 0;
        
        for(var i = 0; i < $monsterCards.playerCards.length; ++i){
            if($monsterCards.playerCards[i]._id == card._id) count++;
        }
        
        var countText = count + "x ";
        this.changeTextColor(this.textColor(stv_MonsterCards_unknownColor));
        this.drawText(countText, rect.x + maxWidth - this.textWidth(countText), rect.y, rect.width);
        this.changeTextColor(this.normalColor());
        this.changeTextColor(this.textColor(card._color));
        this.drawText(card.name, rect.x + maxWidth, rect.y, rect.width);
        this.changeTextColor(this.normalColor());
    };
    
    Window_MonsterCardsManager_PlayerCards.prototype.processOk = function() {
        var card = this._list[this.index()];
        if (card && $monsterCards.playerDeck.length < stv_MonsterCards_maxDeckSize) {
            stv_MonsterCards_selectedPlayerCard = card;
            Window_Selectable.prototype.processOk.call(this);
            if (!this._list[this.index()]) {
                this.select(this.index() - 1);
            }
        } else {
            stv_MonsterCards_selectedPlayerCard = false;
            this.playBuzzerSound();
        }
        this.activate();
    };


// ----------------------------------------------------------------------------------------------------------------------------
// Fill Player Cards Info Window
// ----------------------------------------------------------------------------------------------------------------------------    
    function Window_MonsterCardsManager_PlayerCardsInfo() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_PlayerCardsInfo.prototype = Object.create(Window_Base.prototype);
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.constructor = Window_MonsterCardsManager_PlayerCardsInfo;

    Window_MonsterCardsManager_PlayerCardsInfo.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.setCard = function(card) {
        this._card = card;
        this.refresh();
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.update = function() {
        Window_Base.prototype.update.call(this);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.drawCard = function() {
        var card = this._card;
        var center = ((this.contents.width)/2);
        this._cardSprite = new Sprite();
        this._cardSprite.move(center-42, 18, Graphics.width, Graphics.height); 
        if (card._revealed) {
            this._cardSprite.bitmap = ImageManager.loadCard(card.picName);
        } else {
            this._cardSprite.opacity = stv_MonsterCards_transparentCardOpacity;
            this._cardSprite.bitmap = ImageManager.loadCard(stv_MonsterCards_cardBack);
        }
        this.addChildToBack(this._cardSprite);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.drawRevealed = function() {
        var card = this._card;
        var center = ((this.contents.width)/2);
        
        this.drawText(card.atk, center - this.textWidth(card.atk)/2, 138);
        this.drawText(card.hp, center - 32 - this.textWidth(card.hp)/2, 176);
        this.drawText(card.def, center + 32 - this.textWidth(card.def)/2, 176);
                
        this.changeTextColor(this.textColor(card._color));
        this.centerText(card.name, 120, center, 6);
        this.changeTextColor(this.normalColor());
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.drawRects = function() {
        this.contents.paintOpacity = stv_MonsterCards_transparentBarOpacity;
        for (var i = 1; i <= 2; i++) {
            this.contents.fillRect(0, this.lineHeight()*(5+(i*2)), this.contents.width, this.lineHeight(), this.textColor(stv_MonsterCards_backBarColor));
        }
        this.contents.paintOpacity = 255;   
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.drawHeadlines = function() {
        this.drawText(stv_MonsterCards_seriesText, 18, this.lineHeight()*7);
        this.drawText(stv_MonsterCards_cardPoints, (this.contents.width/2) - (this.textWidth(stv_MonsterCards_cardPoints)/2), this.lineHeight()*9);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.drawValues = function() {
        var card = this._card;
        var points = $monsterCards.createCardPoints(card);
        
        this.drawIcon(stv_MonsterCards_seriesIcons[card.series], this.contents.width - 50, (this.lineHeight()*7) + 2);
        this.drawText(card.series, this.contents.width - this.textWidth(card.series) - 50 - 8, this.lineHeight()*7);
        this.drawText(points, (this.contents.width/2) - (this.textWidth(points)/2), this.lineHeight()*10);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.createInfo = function() {
        var card = this._card; 
        this.removeChild(this._cardSprite);
        
        if (card){
            this.drawCard();
            this.drawRevealed();
            this.drawRects();
            this.drawHeadlines();
            this.drawValues();
        }
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.centerText = function(text, maxLength, x, y) {
        var newx = 0;
        if (this.textWidth(text) > maxLength) newx = ((this.textWidth(text) - maxLength)/2);
        this.drawText(text, x - (this.textWidth(text)/2) + newx, y, maxLength);
    };
    
    Window_MonsterCardsManager_PlayerCardsInfo.prototype.refresh = function() {
        this.contents.clear();
        this.createInfo();
    };


// ----------------------------------------------------------------------------------------------------------------------------
// Fill Deck Cards Window
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsManager_DeckCards() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsManager_DeckCards.prototype = Object.create(Window_Selectable.prototype);
    Window_MonsterCardsManager_DeckCards.prototype.constructor = Window_MonsterCardsManager_DeckCards;

    Window_MonsterCardsManager_DeckCards.lastTopRow = 0;
    Window_MonsterCardsManager_DeckCards.lastIndex  = 0;

    Window_MonsterCardsManager_DeckCards.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        
        this.refresh();
        this.setTopRow(Window_MonsterCardsManager_DeckCards.lastTopRow);
        this.select(Window_MonsterCardsManager_DeckCards.lastIndex);
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.maxCols = function() {
        return 1;
    };

    Window_MonsterCardsManager_DeckCards.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.setPlayerCardsInfoWindow = function(window1) {
        this._playerCardsInfoWindow = window1;
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.updateStatus = function() {
        var card = this._list[this.index()];
        if (this._playerCardsInfoWindow && this.active) {
            this._playerCardsInfoWindow.setCard(card);
        }
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.refresh = function() {
        this._list = [];
        for (var i = 0; i < $monsterCards.playerDeck.length; i++) {
            var card = $monsterCards.playerDeck[i];
            this._list.push(card);
        }
        
        this._list = removeDouble(this._list);
        this._list.sort(sortId);
        
        this.createContents();
        this.drawAllItems();
    };

    Window_MonsterCardsManager_DeckCards.prototype.drawItem = function(index) {
        var card = this._list[index],
            rect = this.itemRectForText(index);
            maxWidth = this.textWidth("99x ");
            count = 0;
        
        for(var i = 0; i < $monsterCards.playerDeck.length; ++i){
            if($monsterCards.playerDeck[i]._id == card._id) count++;
        }
        
        var countText = count + "x ";
        this.changeTextColor(this.textColor(stv_MonsterCards_unknownColor));
        this.drawText(countText, rect.x + maxWidth - this.textWidth(countText), rect.y, rect.width);
        this.changeTextColor(this.normalColor());
        this.changeTextColor(this.textColor(card._color));
        this.drawText(card.name, rect.x + maxWidth, rect.y, rect.width);
        this.changeTextColor(this.normalColor());
    };
    
    Window_MonsterCardsManager_DeckCards.prototype.processOk = function() {
        var card = this._list[this.index()];
        if (card) {
            stv_MonsterCards_selectedPlayerCard = card;
            Window_Selectable.prototype.processOk.call(this);
            if (!this._list[this.index()]) {
                this.select(this.index() - 1);
            }
        } else {
            stv_MonsterCards_selectedPlayerCard = false;
            this.playBuzzerSound();
        }
        this.activate();
    };


// ----------------------------------------------------------------------------------------------------------------------------
// Load MonsterCards Pic Function
// ----------------------------------------------------------------------------------------------------------------------------
    ImageManager.loadCard = function(filename, hue) {
        return this.loadBitmap('img/cards/', filename, hue, true);
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Alias methods
// ----------------------------------------------------------------------------------------------------------------------------
    STV_MonsterCards_PluginCommand = Game_Interpreter.prototype.pluginCommand;
    STV_MonsterCards_Create = DataManager.createGameObjects;
    STV_MonsterCards_Save = DataManager.makeSaveContents;
    STV_MonsterCards_Load = DataManager.extractSaveContents;
    STV_MonsterCards_UseItem = Scene_ItemBase.prototype.useItem;

// ----------------------------------------------------------------------------------------------------------------------------
// DataManager
// ----------------------------------------------------------------------------------------------------------------------------
    var $monsterCards = null,
        $dataCards = null;

    DataManager._databaseFiles.push(
        {name: "$dataCards", src: "MonsterCards.json"}
    );

    DataManager.makeSaveContents = function() {
        contents = STV_MonsterCards_Save.call(this);
        contents.monstercards = $monsterCards;
        return contents;
    };

    DataManager.extractSaveContents = function(contents) {
        STV_MonsterCards_Load.call(this, contents);
		$monsterCards = contents.monstercards;
    };
    
    DataManager.createGameObjects = function() {
        STV_MonsterCards_Create.call(this);
		$monsterCards = new Monster_Cards();
    };
    
  
// ----------------------------------------------------------------------------------------------------------------------------
// MonsterCards Functions
// ----------------------------------------------------------------------------------------------------------------------------

    function Monster_Cards() {
        this.initialize.apply(this, arguments);
    }
    
    Monster_Cards.prototype.initialize = function() {
        this.setup();
    };
    
    // Setup Monster Cards
    Monster_Cards.prototype.setup = function() {
        this.createAllCards();
        this.createPlayerCards();
        this.createPlayerDeck();
    };
    
    // Create All Cards
    Monster_Cards.prototype.createAllCards = function() {
        this.allCards = [0];
        for (var i = 1; i <= $dataCards.length; i++) {
            var j = i-1;
            this.allCards[i] = {};
            this.allCards[i].name = $dataCards[j].name;
            this.allCards[i].picName = $dataCards[j].picName;
            this.allCards[i].hp = $dataCards[j].hp;
            this.allCards[i].def = $dataCards[j].def;
            this.allCards[i].atk = $dataCards[j].atk;
            this.allCards[i].series = $dataCards[j].series;
            this.allCards[i]._id = $dataCards[j].id;
            this.allCards[i]._printId = printDigits($dataCards[j].id, 3);
            this.allCards[i]._revealed = false;
            this.allCards[i]._foundAt = "hAx0r";
            
            var cardRarityString = eval("String(stv_MonsterCards_parameters['Rarity " + $dataCards[j].rarity + "'])");
            var cardRarity = cardRarityString.split(",");
            this.allCards[i]._rarity = cardRarity[0];
            this.allCards[i]._color = Number(cardRarity[1]);
        }
    };

    // Create Player Cards
    Monster_Cards.prototype.createPlayerCards = function() {
        this.playerCards = [];
    };
    
    // Create Player Deck
    Monster_Cards.prototype.createPlayerDeck = function() {
        this.playerDeck = [];
    };
    
    // Is Deck Full
    Monster_Cards.prototype.isDeckFull = function() {
        if (this.playerDeck.length == stv_MonsterCards_maxDeckSize) return true;
    };

    // Complete Player Cards
    Monster_Cards.prototype.completePlayerCards = function(count) {
        for (var i = 1; i < this.allCards.length; i++) {
            this.addCard(i, count);
        }
    };
    
    // Return Random Deck Card
    Monster_Cards.prototype.randomDeckCard = function() {
        if (this.isDeckFull) {
            var random = Math.floor((Math.random() * this.playerDeck.length) + 1);
            var cardId = this.playerDeck[random]._id;
            return cardId;
        }
    };
    
    // Is Revealed
    Monster_Cards.prototype.isRevealed = function(cardNumber) {
        if (this.allCards[cardNumber]._revealed) {
            return true;
        } else {return false;}
    };

    // Reveal Card
    Monster_Cards.prototype.revealCard = function(cardNumber) {
        this.allCards[cardNumber]._revealed = true;
        this.allCards[cardNumber]._foundAt = $dataMapInfos[$gameMap._mapId].name;
        this.allCardsRevealed();
    };
    
    // All Cards Revealed
    Monster_Cards.prototype.allCardsRevealed = function() {
        var completed = 0;
        for (var i = 1; i < this.allCards.length; i++) {
            if (this.isRevealed(i)) {
                completed += 1;
            } else {
                completed = 0;
                break;
            }
        }
        if (completed == this.allCards.length - 1) {
            $gameSwitches.setValue(stv_MonsterCards_completeSwitch, true);
        }
    };

    // Add Card
    Monster_Cards.prototype.addCard = function(cardNumber, count) {
        if (this.allCards[cardNumber]) {
            for (var i = 1; i <= count; i++) {
            this.playerCards.push(this.allCards[cardNumber]);
            if (!this.isRevealed(cardNumber)) this.revealCard(cardNumber);
            }
        }
    };
    
    // Remove Card
    Monster_Cards.prototype.removeCard = function(cardNumber) {
        for (var i = 0; i < this.playerCards.length; i++) {
            if (this.playerCards[i]._id == cardNumber) {
                this.playerCards.splice(i, 1);
                break;
            }
        }
    };
    
    // Is at Player
    Monster_Cards.prototype.isAtPlayer = function(cardNumber) {
        for (var i = 0; i < this.playerCards.length; i++) {
            if (this.playerCards[i]._id == cardNumber) {
                return true;
            }
        }
    };
    
    // Is in Deck
    Monster_Cards.prototype.isInDeck = function(cardNumber) {
        for (var i = 0; i < this.playerDeck.length; i++) {
            if (this.playerDeck[i]._id == cardNumber) {
                return true;
            }
        }
    };
    
    // Has Card
    Monster_Cards.prototype.hasCard = function(cardNumber) {
        if (this.isAtPlayer(cardNumber) || this.isInDeck(cardNumber)) return true;
    };
    
    // Create Card Points
    Monster_Cards.prototype.createCardPoints = function(card) {
        var points = Math.round(((card.atk*3) + (card.hp*2) + (card.def))*10);
        return points;
    };
    
    // Create Series List
    Monster_Cards.prototype.getSeriesList = function(series) {
        this._seriesList = [];
        if (series === 0) {
            this._seriesList = this.allCards;
        } else {
            for (var i = 1; i < this.allCards.length; i++) {
                if (this.allCards[i].series == series) {
                    this._seriesList.push(this.allCards[i]);
                }
            }
        }
        return this._seriesList;
    };
    
    // Give BoosterPack
    Monster_Cards.prototype.giveBoosterPack = function(pack, count) {
        var list = this.getSeriesList(pack),
            min = 0,
            max = list.length - 1,
            showArray = [],
            card;

        for (var i = 0; i < count; i++) {
            card = Math.floor(Math.random() * ((max-min)+1) + min);
            showArray[i] = list[card]._id;
        }
        this.showCards(showArray);

    };
    
    // Show given Cards in a cool way
    Monster_Cards.prototype.showCards = function(array) {
        this.showCardsList = array;
        SceneManager.push(Scene_MonsterCardsShowCards);
    };

    // Return Cards Name
    Monster_Cards.prototype.returnName = function(cardNumber) {
        if (this.allCards[cardNumber]) return this.allCards[cardNumber].name;
    };

    // Return Cards ATK
    Monster_Cards.prototype.returnATK = function(cardNumber) {
        if (this.allCards[cardNumber]) return this.allCards[cardNumber].atk;
    };
    
    // Return Cards HP
    Monster_Cards.prototype.returnHP = function(cardNumber) {
        if (this.allCards[cardNumber]) return this.allCards[cardNumber].hp;
    };
    
    // Return Cards DEF
    Monster_Cards.prototype.returnDEF = function(cardNumber) {
        if (this.allCards[cardNumber]) return this.allCards[cardNumber].def;
    };
    
    // Return Cards SERIES
    Monster_Cards.prototype.returnSeries = function(cardNumber) {
        if (this.allCards[cardNumber]) return this.allCards[cardNumber].series;
    };

    // Return Cards POINTS
    Monster_Cards.prototype.returnPoints = function(cardNumber) {
        if (this.allCards[cardNumber]) {
            var card = this.allCards[cardNumber];
            var points = this.createCardPoints(card);
            return points;
        }
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Create BoostePack Items
// ---------------------------------------------------------------------------------------------------------------------------- 
    Scene_ItemBase.prototype.useItem = function() {
        STV_MonsterCards_UseItem.call(this);
        var note = this.item().note,
            data, pack, count;
        if (note.match(/<(?:MONSTERCARDSBOOSTER):[ ](.*)>/i)) {
            data = String(RegExp.$1).split(",");
            pack = Number(data[0]);
            count = Number(data[1]);
            $monsterCards.giveBoosterPack(pack,count);
        }
    };    
    
// ----------------------------------------------------------------------------------------------------------------------------
// Plugin Commands
// ---------------------------------------------------------------------------------------------------------------------------- 
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        STV_MonsterCards_PluginCommand.call(this, command, args);
        
        if (command === 'MonsterCards') {
            switch (args[0]) {
                case 'complete':
                    $monsterCards.completePlayerCards(Number(args[1]));
                break;
                case 'clear':
                    $monsterCards.createPlayerCards();
                break;
                case 'give':
                    var showArray = String(args[1]).split(",");
                    $monsterCards.showCards(showArray);
                break;
                case 'remove':
                    $monsterCards.removeCard(Number(args[1]));
                break;
                case 'giveBooster':
                    $monsterCards.giveBoosterPack(Number(args[1]), Number(args[2]));
                break;
                case 'manager':
                    SceneManager.push(Scene_MonsterCardsManager);
                break;
            }
        }
    };


// ----------------------------------------------------------------------------------------------------------------------------
// Scene MonsterCardsBoosterPack create
// ----------------------------------------------------------------------------------------------------------------------------  
    Scene_MonsterCardsShowCards = function() {
        this.initialize.apply(this, arguments);
    };

    Scene_MonsterCardsShowCards.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_MonsterCardsShowCards.prototype.constructor = Scene_MonsterCardsShowCards;

    Scene_MonsterCardsShowCards.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };                                                          
    
    Scene_MonsterCardsShowCards.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        
        if (stv_MonsterCards_meName !== "") {
            var soundObject = {"name":stv_MonsterCards_meName,"pan":0,"pitch":stv_MonsterCards_mePitch,"volume":stv_MonsterCards_meVolume};
            AudioManager.playMe(soundObject);
        }
        
        this.createWindowPositions();
        this.createWindows();
        
        this._showWindow.opacity = 255;
        this._commandWindow.opacity = 255;
    };
    
    
// ----------------------------------------------------------------------------------------------------------------------------
// Create Window Positions
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsShowCards.prototype.createWindowPositions = function() {
        var maxWidth = Graphics.boxWidth,
            maxHeight = Graphics.boxHeight;
        
        var sW = 200,
            sH = 360,
            sX = (maxWidth/2) - (sW/2),
            sY = (maxHeight/2) - (sH/2) - 40;
        this._showWindow = new Window_MonsterCardsBoosterPack_Show(sX, sY, sW, sH);
        
        var cW = 200,
            cH = 80,
            cX = (maxWidth/2) - cW/2,
            cY = sY+sH;
        this._commandWindow = new Window_MonsterCardsBoosterPack_Command(cX, cY, cW, cH);
    };
    
// ----------------------------------------------------------------------------------------------------------------------------
// Setup Windows
// ----------------------------------------------------------------------------------------------------------------------------
    Scene_MonsterCardsShowCards.prototype.createWindows = function() {
        this.addWindow(this._showWindow);
        this.addWindow(this._commandWindow);
        this._commandWindow.setHandler('ok', this.onOk.bind(this));
        this._commandWindow.setHandler('cancel', this.onOk.bind(this));
    };
    
    Scene_MonsterCardsShowCards.prototype.onOk = function() {
        $monsterCards.addCard($monsterCards.showCardsList[0], 1);
        this._showWindow.removeChild(this._showWindow._cardSprite[$monsterCards.showCardsList.length-1]);
        if ($monsterCards.showCardsList[1]) {
            $monsterCards.showCardsList.shift();
            this._commandWindow.activate();
        } else {
            $monsterCards.showCardsList = [];
            if (stv_MonsterCards_meName !== "") AudioManager.fadeOutMe(1);
            this.popScene();
        }
    }; 

// ----------------------------------------------------------------------------------------------------------------------------
// Fill Show Window
// ----------------------------------------------------------------------------------------------------------------------------    
    function Window_MonsterCardsBoosterPack_Show() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsBoosterPack_Show.prototype = Object.create(Window_Base.prototype);
    Window_MonsterCardsBoosterPack_Show.prototype.constructor = Window_MonsterCardsBoosterPack_Show;

    Window_MonsterCardsBoosterPack_Show.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.refresh();
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.drawCardInfo = function() {
        var card = $monsterCards.allCards[$monsterCards.showCardsList[0]];
        
        this.contents.paintOpacity = stv_MonsterCards_transparentBarOpacity;
        if (!card._revealed) this.contents.fillRect(0, 0, this.contents.width, this.lineHeight(), this.textColor(14));
        this.contents.fillRect(0, this.contents.height - this.lineHeight(), this.contents.width, this.lineHeight(), this.textColor(stv_MonsterCards_backBarColor));
        this.contents.paintOpacity = 255;
        
        if (!card._revealed) {
            this.drawIcon(stv_MonsterCards_newIcon, 0, 2);
            this.drawText(stv_MonsterCards_newText, (this.width/2)-(this.textWidth(stv_MonsterCards_newText)/2)-18, 0);
            this.drawIcon(stv_MonsterCards_newIcon, this.contents.width - 32, 2);
        }
        
        this.changeTextColor(this.textColor(card._color));
        this.drawText(card._rarity, (this.width/2)-(this.textWidth(card._rarity)/2)-18, this.contents.height - this.lineHeight());
        this.changeTextColor(this.normalColor());
    };    
    
    Window_MonsterCardsBoosterPack_Show.prototype.drawCard = function() {
        var xAdd = 4,
            yAdd = 4,
            xPos = (this.width/2) - 60,
            yPos = (this.height/2) - 108;
            
        if (!this._cardSprite) this._cardSprite = [];
        
        for (var i = 0; i < $monsterCards.showCardsList.length; i++) {
            var card = $monsterCards.allCards[$monsterCards.showCardsList[i]];
            if (!this._cardSprite[i]) this._cardSprite[i] = new Sprite();
            this._cardSprite[i].move(xPos + (xAdd*i), yPos - (yAdd*i), Graphics.width, Graphics.height);
            if (i > 0) {
                this._cardSprite[i].opacity = (200 - (40*i));
                this._cardSprite[i].bitmap = ImageManager.loadCard(stv_MonsterCards_cardBack);
            } else {
                this._cardSprite[i].opacity = 255;
                this._cardSprite[i].bitmap = ImageManager.loadCard(card.picName);
            }
            this.addChildToBack(this._cardSprite[i]);
        }
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.drawCardStats = function() {
        var card = $monsterCards.allCards[$monsterCards.showCardsList[0]];
        this.drawText(card.atk, (this.contents.width/2) - (this.textWidth(card.atk)/2), 192);
        this.drawText(card.hp, 50 - (this.textWidth(card.hp)/2), 230);
        this.drawText(card.def, 114 - (this.textWidth(card.def)/2), 230);
                
        this.changeTextColor(this.textColor(card._color));
        this.centerText(card.name, 120, (this.contents.width/2), 60);
        this.changeTextColor(this.normalColor());
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.createInfo = function() {
        this.drawCardInfo();
        this.drawCard();
        this.drawCardStats();
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.refresh = function() {
        this.contents.clear();
        this.createInfo();
    };
    
    Window_MonsterCardsBoosterPack_Show.prototype.centerText = function(text, maxLength, x, y) {
        var newx = 0;
        if (this.textWidth(text) > maxLength) newx = ((this.textWidth(text) - maxLength)/2);
        this.drawText(text, x - (this.textWidth(text)/2) + newx, y, maxLength);
    };

// ----------------------------------------------------------------------------------------------------------------------------
// Fill Command Window
// ----------------------------------------------------------------------------------------------------------------------------
    function Window_MonsterCardsBoosterPack_Command() {
        this.initialize.apply(this, arguments);
    }

    Window_MonsterCardsBoosterPack_Command.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MonsterCardsBoosterPack_Command.prototype.constructor = Window_MonsterCardsBoosterPack_Command;

    Window_MonsterCardsBoosterPack_Command.prototype.initialize = function(x, y, width, height) {
        Window_HorzCommand.prototype.initialize.call(this, x, y, width, height);
    };

    Window_MonsterCardsBoosterPack_Command.prototype.maxCols = function() {
        return 1;
    };
    
    Window_MonsterCardsBoosterPack_Command.prototype.windowWidth = function() {
        return 200;
    };
    
    Window_MonsterCardsBoosterPack_Command.prototype.windowHeight = function() {
        return 80;
    };
    
    Window_MonsterCardsBoosterPack_Command.prototype.makeCommandList = function() {
        this.addCommand(stv_MonsterCards_showCardCommand, 'ok');
    };

 
// ----------------------------------------------------------------------------------------------------------------------------
// Basic Functions
// ----------------------------------------------------------------------------------------------------------------------------

// Print Digit "000"
    function printDigits(nr, n, str) {
        return Array(n-String(nr).length+1).join(str||'0')+nr;
    }
    
// Remove Double Elements in Lists
    function removeDouble(list) {
        var tmp = [];
        for(var i = 0; i < list.length; i++){
            if(tmp.indexOf(list[i]) == -1){
                tmp.push(list[i]);
            }
        }
        return tmp;
    }
    
// Sort Cards by Id    
    function sortId(a, b) {
        return a._id - b._id;
    }

(function() {

//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

function Window_MenuCommand() {
    this.initialize.apply(this, arguments);
}

Window_MenuCommand.prototype = Object.create(Window_Command.prototype);
Window_MenuCommand.prototype.constructor = Window_MenuCommand;

Window_MenuCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.selectLast();
};

Window_MenuCommand._lastCommandSymbol = null;

Window_MenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_MenuCommand.prototype.windowWidth = function() {
    return 240;
};

Window_MenuCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
    if (this.needsCommand('cards')) {
        this.addCommand(TextManager.cards, 'cards', enabled);
    }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand('formation')) {
        var enabled = this.isFormationEnabled();
        this.addCommand(TextManager.formation, 'formation', enabled);
    }
};

Window_MenuCommand.prototype.addOriginalCommands = function() {
};

Window_MenuCommand.prototype.addOptionsCommand = function() {
    if (this.needsCommand('options')) {
        var enabled = this.isOptionsEnabled();
        this.addCommand(TextManager.options, 'options', enabled);
    }
};

Window_MenuCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand('save')) {
        var enabled = this.isSaveEnabled();
        this.addCommand(TextManager.save, 'save', enabled);
    }
};

Window_MenuCommand.prototype.addGameEndCommand = function() {
    var enabled = this.isGameEndEnabled();
    this.addCommand(TextManager.gameEnd, 'gameEnd', enabled);
};

Window_MenuCommand.prototype.needsCommand = function(name) {
    var flags = $dataSystem.menuCommands;
    if (flags) {
        switch (name) {
        case 'item':
            return flags[0];
        case 'skill':
            return flags[1];
        case 'equip':
            return flags[2];
        case 'status':
            return flags[3];
        case 'formation':
            return flags[4];
        case 'save':
            return flags[5];
        case 'cards':
        	return SceneManager.push(Scene_MonsterCardsManager);
        }
    }
    return true;
};

Window_MenuCommand.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
};

Window_MenuCommand.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
};

Window_MenuCommand.prototype.isOptionsEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};

Window_MenuCommand.prototype.isGameEndEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.processOk = function() {
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_MenuCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
};


})();