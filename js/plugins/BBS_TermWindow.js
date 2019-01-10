//=============================================================================
// Bluebooth Plugins - Term Window
// BBS_TermWindow.js
//=============================================================================

//=============================================================================
 /*:
 * @title Term Window
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Oct 12, 2016
 * @filename BBS_TermWindow.js
 * If you enjoy my work, consider supporting me on Patreon!
 *
 * https://www.patreon.com/bluebooth
 *
 * @plugindesc v1.03b Allows a popup help window to explain game terms while
 * and only while a message box (dialogue) is open.
 * Special thanks to Yanfly, this borrows structures from his YEP_MessageCore, and my
 * own BBS_RandomConversations.js.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Contact me for commercial use
 *
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Term File
 * @desc Name of an external term file (name + definition) to load at game start. Default: data/Terms.json
 * @default data/Terms.json
 *
 * @param Term Color Index
 * @desc Words wrapped in a specific color tag are identified as terms.  Which color do you want to wrap terms in?
 * Default: 4
 * @default 4
 *
 * @param === KEYS USED ===
 *
 * @param Help Key
 * @desc The button to check for to toggle help. Default: pageup
 * @default pageup
 *
 * @param Previous Term Key
 * @desc The button to cycle left (1-3-2-1) through active terms in the term window. Default: Left
 * @default left
 *
 * @param Next Term Key
 * @desc The button to cycle right (1-2-3-1) through active terms in the term window. Default: Right
 * @default right
 *
 * @param === HELP PROMPT WINDOW ===
 *
 * @param Help Prompt
 * @desc Text to display indicating what button to press to display term window. Default: PgUp - help
 * @default PgUp - help
 *
 * @param Help Prompt Width
 * @desc Maximum width for the Help Prompt. Default: 200
 * @default 200
 *
 * @param Help Prompt Buffer X
 * @desc This is the buffer for the x location of the Help Prompt.
 * @default -28
 *
 * @param Help Prompt Buffer Y
 * @desc This is the buffer for the y location of the Help Prompt.
 * @default 0
 *
 * @param Help Prompt Text Size
 * @desc Font size for the Help Prompt.
 * Default: 20
 * @default 20
 *
 * @param Help Prompt Text Color
 * @desc Help Prompt font color. Use CSS format, or leave blank
 * to use standard color.
 * @default
 *
 * @param === TERM WINDOW ===
 *
 * @param Term Window Windowskin
 * @desc The windowskin to apply to the Term Window. Default:
 * @default
 *
 * @param Term Window Width
 * @desc Maximum width for the Term window. Default: 200
 * @default 200
 *
 * @param Term Window Height
 * @desc Maximum height for the Term window. Default: 300
 * @default 300

 * @param === TERM WINDOW TITLE ===
 *
 * @param Title Font
 * @desc Font face for the title. Leave blank to use standard. See help.
 * @default
 *
 * @param Title Size
 * @desc Font size for the Title in the details window.
 * Default: 22
 * @default 22
 *
 * @param Title Color
 * @desc Title font color. Use CSS format, or leave blank
 * to use standard color.
 * @default
 *
 * @param Title Outline Color
 * @desc Title text outline color. Use CSS format or leave
 * blank to use standard.
 * @default
 *
 * @param Title Italic
 * @desc Title font in Italic.      YES: true      NO: false
 * Default: false
 * @default false
 *
 * @param === TERM WINDOW LINE ===
 *
 * @param Line Center Color
 * @desc Center color of the gradient line below the title.
 * Use CSS format.    Default: rgba(255,255,255,1)
 * @default rgba(255,255,255,1)
 *
 * @param Line Border Color
 * @desc Border color of the gradient line below the title.
 * Use CSS format.    Default: rgba(255,255,255,0)
 * @default rgba(255,255,255,0)
 *
 * @param === DETAILS TEXT ===
 *
 * @param Text Font
 * @desc Font face for the details text. Leave blank to use standard. See help.
 * @default
 *
 * @param Text Size
 * @desc Font size for the details text.
 * Default: 20
 * @default 20
 *
 * @param Text Outline Color
 * @desc Details text outline color. Use CSS format or leave blank to use standard.
 * @default
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
 *
 * Allows a popup help window to explain game terms while and only while a message
 * box (dialogue) is open.  A prompt specifying what button to press to toggle
 * help displays atop the messagebox.  Data is loaded from JSON.
 *
 * Any one term must have the opening tag + term + closing tag on the same line.
 *
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.03b- Added more friendly crash error message.
 * 1.03a- Fixed issue causing parameters not to register.
 * 1.03 - Added option to change color index for Terms (default 4), and option to change
 *         - keys for Term Window.
 * 1.02 - Multiple word terms now supported using _.
 * 1.01 - Plugin finished and tested.
 *
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.TermWindow = 1;
BBS.TermWindow = BBS.TermWindow || {};

(function() {

    var _terms;
    var _activeTerms = [];
 
    //=============================================================================
    // Parameter Variables
    //=============================================================================
    var parameters                     = PluginManager.parameters('BBS_TermWindow');
    var pTermFile                    = String(parameters['Term File'] || 'data/TermsDic.json');
    var pTermColorIndex                = Number(parameters['Term Color Index'] || 4);
 
    var pHelpKey                    = String(parameters['Help Key'] || 'pageup');
    var pPreviousTermKey            = String(parameters['Previous Term Key'] || 'left');
    var pNextTermKey                = String(parameters['Next Term Key'] || 'right');
 
    var pMsgHelpPromptText            = String(parameters['Help Prompt'] || '');
    var pMsgHelpPromptBufferX         = Number(parameters['Help Prompt Buffer X'] || -28);
    var pMsgHelpPromptBufferY         = Number(parameters['Help Prompt Buffer Y'] || 0);
    var pMsgHelpPromptBufferWidth    = Number(parameters['Help Prompt Width'] || 200);
    var pMsgHelpPromptTextColor        = String(parameters['Help Prompt Text Color'] || '').trim();
    var pMsgHelpPromptTextSz        = Number(parameters['Help Prompt Text Size'] || 20);
 
    var pCustomTermWindowskin        = String(parameters['Term Window Windowskin'] || '');
    var pTermWindowWidth            = Number(parameters['Term Window Width'] || 200);
    var pTermWindowHeight            = Number(parameters['Term Window Height'] || 300);
 
    var pTitleTxtFont                = String(parameters['Title Font'] || '').trim();
    var pTitleTxtSz                 = Number(parameters['Title Size'] || 22);
    var pTitleTxtColor                = String(parameters['Title Color'] || '').trim();
    var pTitleTxtOutlineColor        = String(parameters['Title Outline Color'] || '').trim();
    var pTitleTxtItalic             = eval(String(parameters['Title Italic'] || 'false'));
 
    var pGradientLineColorCenter     = String(parameters['Line Center Color'] || 'rgba(255,255,255,1)').trim();
    var pGradientLineColorBorder     = String(parameters['Line Border Color'] || 'rgba(255,255,255,0)').trim();

    var pDetailsTxtFont                = String(parameters['Text Font'] || '').trim();
    var pDetailsTxtFontSz            = Number(parameters['Text Size'] || 20);
    var pDetailsTxtOutlineColor        = String(parameters['Text Outline Color'] || '').trim();
 
    var pDebugging                    = eval(String(parameters['Debug Mode'] || 'false'));
 
    var BBS_helpPromptWnd = undefined;
    var BBS_termWnd = undefined;
 
    // Sanity check for valid color index.
    if (pTermColorIndex < 0 || pTermColorIndex > 28) {
        throw "BBS_TermWindow: Term color index " + pTermColorIndex + " is not a valid color!  Please use an index between 0 - 28 inclusive.";
    }
 
    //=============================================================================
    // Term Class
    //============================================================================= 
    function Term() {
        this.initialize.apply(this, arguments);
    };
 
    Term.prototype.initialize = function(data) {
        this._term = String(data.term);
        this._desc = String(data.description);
    };
 
    Term.prototype = Object.create(Term.prototype);
    Term.prototype.constructor = Term;
 
    /**
     * Creates rumors from the given data and loads their current state, afterwards.
     */
    var _create = function(data) {
        var temp = [];
        for(var i = 0, max = data.length; i < max; ++i) {
            entry = data[i];
            temp.push(new Term(entry));
        }
     
        _terms = temp;
     
        if (pDebugging) {
            console.log(_terms);
        }
    };
 
    var _getIndex = function(term) {
        if (pDebugging) {
            console.log(term);
            console.log(_terms);
        }
     
        for(var i = 0; i < _terms.length; i++) {
            if(_terms[i]._term === term) {
                return i;
            }
        }
     
        return -1;
    };
 
    //=============================================================================
    // Window_MsgHelpPrompt
    //=============================================================================
    function Window_MsgHelpPrompt() {
        this.initialize.apply(this, arguments);
    }

    Window_MsgHelpPrompt.prototype = Object.create(Window_Base.prototype);
    Window_MsgHelpPrompt.prototype.constructor = Window_MsgHelpPrompt;

    Window_MsgHelpPrompt.prototype.initialize = function(parentWindow) {
        this._parentWindow = parentWindow;
        Window_Base.prototype.initialize.call(this, 0, 0, 240, this.windowHeight());
        this._text = '';
        this._openness = 0;
        this._closeCounter = 0;
        this.deactivate();
     
        this.backOpacity = 0;
        this.opacity = 0;
        this.hide();
    };

    Window_MsgHelpPrompt.prototype.windowWidth = function() {
        this.resetFontSettings();
        var dw = this.textWidthEx(this._text);
        dw += this.padding * 2;
        var width = dw + eval(pMsgHelpPromptBufferWidth);
        return Math.ceil(width);
    };
 
    Window_MsgHelpPrompt.prototype.textWidthEx = function(text) {
        return this.drawTextEx(text, 0, this.contents.height);
    };

    Window_MsgHelpPrompt.prototype.calcNormalCharacter = function(textState) {
        return this.textWidth(textState.text[textState.index++]);
    };

    Window_MsgHelpPrompt.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_MsgHelpPrompt.prototype.standardFontFace = function() {
        return $gameSystem.getMessageFontName();
    };

    Window_MsgHelpPrompt.prototype.standardFontSize = function() {
        return $gameSystem.getMessageFontSize();
    };

    Window_MsgHelpPrompt.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this.active) return;
        if (this.isClosed()) return;
        if (this.isClosing()) return;
        if (this._parentWindow.isClosing()) {
            this._openness = this._parentWindow.openness;
        }
    };

    Window_MsgHelpPrompt.prototype.refresh = function(text, position) {
        this.show();
        this._text = text;
        this._position = position;
        this.width = this.windowWidth();
        this.createContents();
        this.contents.clear();
        this.resetFontSettings();
     
        this.changeTextColor(this.textColor(pMsgHelpPromptTextColor));
        var padding = eval(pMsgHelpPromptBufferWidth) / 2;
        this.contents.fontSize = pMsgHelpPromptTextSz;
     
        this.drawTextEx(this._text, padding, 0, this.contents.width);
        this._parentWindow.adjustWindowSettings();
        this._parentWindow.updatePlacement();
     
        this.adjustPositionX();
        this.adjustPositionY();
        this.open();
        this.activate();
        this._closeCounter = 4;
        return '';
    };

    Window_MsgHelpPrompt.prototype.adjustPositionX = function() {
        if (this._position === 1) {
         this.x = this._parentWindow.x;
         this.x += eval(pMsgHelpPromptBufferX);
        }
        else if (this._position === 2) {
         this.x = this._parentWindow.x;
         this.x += this._parentWindow.width * 3 / 10;
         this.x -= this.width / 2;
        }
        else if (this._position === 3) {
         this.x = this._parentWindow.x;
         this.x += this._parentWindow.width / 2;
         this.x -= this.width / 2;
        }
        else if (this._position === 4) {
         this.x = this._parentWindow.x;
         this.x += this._parentWindow.width * 7 / 10;
         this.x -= this.width / 2;
        }
        else {
         this.x = this._parentWindow.x + this._parentWindow.width;
         this.x -= this.width;
         this.x -= eval(pMsgHelpPromptBufferX);
        }
        this.x = this.x.clamp(0, Graphics.boxWidth - this.width);
    };

    Window_MsgHelpPrompt.prototype.adjustPositionY = function() {
        if ($gameMessage.positionType() === 0) {
         this.y = this._parentWindow.y + this._parentWindow.height;
         this.y -= eval(pMsgHelpPromptBufferY);
        }
        else {
         this.y = this._parentWindow.y;
         this.y -= this.height;
         this.y += eval(pMsgHelpPromptBufferY);
        }
        if (this.y < 0) {
         this.y = this._parentWindow.y + this._parentWindow.height;
         this.y -= eval(pMsgHelpPromptBufferY);
        }
     
    };
 
    Window_MsgHelpPrompt.prototype.showPrompt = function() {
        if (this === undefined) { return; }
     
        this.visible = !this.visible;
        if(this.active) {
            this.deactivate();
        }
        else {
            this.activate();
        }
    };

 
    //=============================================================================
    // Window_MsgTerm
    //=============================================================================
    function Window_MsgTerm() {
        this.initialize.apply(this, arguments);
    }

    Window_MsgTerm.prototype = Object.create(Window_Base.prototype);
    Window_MsgTerm.prototype.constructor = Window_MsgTerm;

    Window_MsgTerm.prototype.initialize = function() {
        var width = pTermWindowWidth;
        var height = Math.max(pTermWindowHeight, this.fittingHeight(1));

        var x = Graphics.boxWidth - width;
        var y = Graphics.boxHeight - height - 164;

        this._wordWrap = true;
     
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        if (pCustomTermWindowskin !== '') {
            this.windowskin = ImageManager.loadSystem(pCustomTermWindowskin);
        }
     
        this._title = '';
        this._text = '';
        this.index = 0;
     
        this._termIds = [];
     
        this.active = false;
        this.visible = false;
    };

    Window_MsgTerm.prototype.setDetails = function() { 
        if (this._termIds === undefined || this.index < 0) {
            this._title = '';
            this._text = '';
            this.refresh();
        }
        else {
         
            // Handle odd case where index does not reset.
            if(this.index >= this._termIds.length) {
                this.index = 0;
             
                // Odd bug where lengths and term values are not synced.
                if(this._termIds[0] === -1) {
                    this._title = '';
                    this._text = '';
                    this.refresh();
                }
            }
         
            var termIndex = this._termIds[this.index];
            // Handle odd case where termIds desync - resulting in a term Id with a bad ID.
            if (termIndex < 0) {
                termIndex = this._termIds[0];
            }
         
            if (_terms[termIndex] === undefined) {
                throw "Bad Term index: " + termIndex + "!  There's an error in the last or next message box's terms.";
            }

            this._title = _terms[termIndex]._term + " " + (this.index + 1) + "/" + this._termIds.length;
            this._text = '<WordWrap>' + _terms[termIndex]._desc;
            this.refresh();
        }
    };

    Window_MsgTerm.prototype.clear = function() {
        this.setDetails();
    };

    Window_MsgTerm.prototype.setActiveTerm = function(nextTerm, terms) {
        this._termIds = [];
        this._termIds = terms;
     
        for(var i = 0; i < this._termIds.length; i++) {
            this._termIds[i] = _getIndex(terms[i]);
        }
     
        if (pDebugging) {
            console.log(this._termIds);
            console.log(_activeTerms);
        }
     
        this.setDetails();
     
    };

    // Redefine the minimum number of functions to allow this non-command window to bind input handlers.
    Window_MsgTerm.prototype.setHandler = function(symbol, method) {
        this._handlers[symbol] = method;
    };

    Window_MsgTerm.prototype.isHandled = function(symbol) {
        return !!this._handlers[symbol];
    };

    Window_MsgTerm.prototype.callHandler = function(symbol) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    };
 
    Window_MsgTerm.prototype.update = function() {
        Window_Base.prototype.update.call(this);
     
        this.processCursorMove();
        this._stayCount++;
    };

    Window_MsgTerm.prototype.processCursorMove = function() {
        if (Input.isRepeated(pNextTermKey)) {
            if(Input.isTriggered(pNextTermKey) && this._termIds.length > 1) {
                this.flipSubEntry(1);
            }
        }
        if (Input.isRepeated(pPreviousTermKey)) {
            if(Input.isTriggered(pPreviousTermKey) && this._termIds.length > 1) {
                this.flipSubEntry(-1);
            }
        }
    };

    Window_MsgTerm.prototype.flipSubEntry = function(pageChange) {
        if (this.visible === false) { return; }
        if(this._termIds.length <= 1) {
            return;
        }
     
        this.index = this.index + pageChange;
        SoundManager.playCursor();
     
        // Cycle over to locked entry before reiterating through sub-entries.
        if (this.index >= this._termIds.length) {
            this.index = 0;
        }
        else if (this.index < 0) {
            this.index = this._termIds.length - 1;
        }

        this.setDetails();
        this.refresh();
    };

    Window_MsgTerm.prototype.refresh = function() {
        this.contents.clear();
        var contentsW = this.width - this.textPadding() - this.standardPadding() * 2;
        var contentsX = this.textPadding();
        var y = 2;
     
        //Title
        this.resetFontSettings();
        this.contents.fontSize = pTitleTxtSz;
        this.contents.fontItalic = pTitleTxtItalic;
        if(pTitleTxtFont !== '') {
            this.contents.fontFace = pTitleTxtFont; 
        }
        if(pTitleTxtColor !== '') {
            this.contents.textColor = pTitleTxtColor; 
        }
        if(pTitleTxtOutlineColor !== '') {
            this.contents.outlineColor = pTitleTxtOutlineColor;
        }
        this.drawText(this._title, contentsX, y, contentsW, 'center');
     
        //GradientLine
        y += this.lineHeight() + 10;
        this.drawGradientLine(y, contentsW);
        y += 10;
         
        //text
        this.resetFontSettings();
        if(pDetailsTxtFont !== '') {
            this.contents.fontFace = pDetailsTxtFont; 
        }
        if(pDetailsTxtOutlineColor !== '') {
            this.contents.outlineColor = pDetailsTxtOutlineColor;
        }
     
        this.contents.fontSize = pDetailsTxtFontSz;
        this.saveCurrentWindowSettings();
        this.drawTextEx(this._text, 0, y);
        this.restoreCurrentWindowSettings();
    };
 
    Window_MsgTerm.prototype.standardFontSize = function() {
        return pDetailsTxtFontSz;
    };

    Window_MsgTerm.prototype.drawGradientLine = function(y,w) {
        var ctx = this.contents.context;
        var lw = w * 2/3;
        var lx = (w - w * 2/3)/2;
     
        var lineargradient1 = ctx.createLinearGradient(lx,0,w/2,0);
        lineargradient1.addColorStop(0, pGradientLineColorBorder);
        lineargradient1.addColorStop(1, pGradientLineColorCenter);
        ctx.fillStyle = lineargradient1;
        ctx.fillRect(lx, y, lw/2, 2);
     
        var lineargradient2 = ctx.createLinearGradient(w/2,0,lx+lw,0);
        lineargradient2.addColorStop(0, pGradientLineColorCenter);
        lineargradient2.addColorStop(1, pGradientLineColorBorder);
        ctx.fillStyle = lineargradient2;
        ctx.fillRect(w/2, y, lw/2, 2);
    };
 
    Window_MsgTerm.prototype.toggleTermWindow = function(terms) {
        if (this === undefined) { return; }
     
        this.visible = !this.visible;
        if(this.active) {
            this.deactivate();
            this.index = 0;
        }
        else {
            this.activate();
        }
    };
 
    //=============================================================================
    // Window_Message
    //=============================================================================
    var BBS_TW_Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        BBS_TW_Window_Message_createSubWindows.call(this);
        this._helpPromptWindow = new Window_MsgHelpPrompt(this);
        this._termWindow = new Window_MsgTerm(this);
        BBS_helpPromptWnd = this._helpPromptWindow;
        BBS_termWnd = this._termWindow;
     
        var scene = SceneManager._scene;
        scene.addChild(this._helpPromptWindow);
        scene.addChild(this._termWindow);
        _hasTerms = false;
    };
 
    var BBS_TW_Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this._helpPromptWindow.deactivate();
        this._termWindow.deactivate();
        BBS_TW_Window_Message_startMessage.call(this);
    };

    var BBS_TW_Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this._helpPromptWindow.deactivate();
        this._termWindow.deactivate();
     
        this._helpPromptWindow.visible = false;
        this._termWindow.visible = false;
        this._termWindow._termIds = [];
        _hasTerms = false;
     
        BBS_TW_Window_Message_terminateMessage.call(this);
    };
 
    Window_Message.prototype.isXPressed = function() {
        return Input.isRepeated(pHelpKey);
    };
 
    var BBS_TW_Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.isXPressed()) {
            if (this._termWindow._termIds.length > 0) {
                this._termWindow.toggleTermWindow(_activeTerms);
            }
        }
        return BBS_TW_Window_Message_updateInput.call(this);
    };
 
    var BBS_TW_Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        BBS_TW_Window_Message_newPage.call(this, textState);
     
        if (pDebugging) {
            console.log(_activeTerms);
            console.log(_hasTerms);
        }
     
        if(_hasTerms) {
            BBS_termWnd.setActiveTerm(_activeTerms[0], _activeTerms);
            BBS_helpPromptWnd.refresh(pMsgHelpPromptText, 4);
            _activeTerms = [];
            _hasTerms = false;
        }
    };
 
    //=============================================================================
    // class Game_Message
    //============================================================================= 
    Game_Message.prototype.addText = function(text) {
        // Don't override YEP.
        if ($gameSystem.wordWrap()) text = '<WordWrap>' + text;
         
        var termPrefix = "c[" + pTermColorIndex + "]";
        console.log(termPrefix);
     
        var termPostfix = "c[0]";
        var textIter = text;
         
        var sIdx = 1;
        var fIdx = -1;
        while(sIdx >= 0) {
            sIdx = textIter.indexOf(termPrefix);
            if(sIdx >= 0) {
                sIdx = sIdx + termPrefix.length;
            }
            else {
                break;
            }
             
            fIdx = textIter.indexOf(termPostfix) - 1;
            if(fIdx < 0) {
                fIdx = text.length - 1;
            }
             
            if(pDebugging) {
                console.log(fIdx);
                console.log(termPostfix.length);
                console.log(textIter.length);
            }
         
            // We have a term if we got this far, so process it.
            var termStr = textIter.substr(sIdx, (fIdx - sIdx));
            var alreadyAdded = false;
            for (var i = 0; i < _activeTerms.length; i++)
            {
                if(_activeTerms[i] === termStr) {
                    alreadyAdded = true;
                    break;
                }
            }
         
            if(alreadyAdded === false) {
                _activeTerms.push(termStr);
                _hasTerms = true;
            }
         
            // Advance to avoid infinite loop over same term tag.
            textIter = textIter.substr(sIdx);
        }
     
        this.add(text);
    };
 
    //=============================================================================
    // class Scene_Boot
    //=============================================================================
    var BBS_TW_Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        BBS_TW_Scene_Boot_create.call(this);
        this._loadFile(pTermFile, _create);
    };
 
    Scene_Boot.prototype._loadFile = function(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.overrideMimeType('application/json');
        request.onload = function() { callback(JSON.parse(request.responseText)); }
        request.onerror = function() { throw new Error('There was an error loading the file ' + url); }
        request.send();
    };
 
    var BBS_TW_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return !!_terms && BBS_TW_Scene_Boot_isReady.call(this);
    };

})(BBS.TermWindow);
//=============================================================================
// End of File
//=============================================================================