/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_timer	= function(){};
cAMLElement_timer.prototype	= new cAMLElement_prototype("timer");

// Private Properties
cAMLElement_timer.prototype._interval	= null;
cAMLElement_timer.prototype._timeout	= null;

// Public Methods
cAMLElement_timer.prototype.start	= function() {
    var oElement	= this,
    	nValue;
	// Set interval
	nValue	= fParseInt(this.attributes["interval"]);
	if (!fIsNaN(nValue))
		this._interval	= fSetInterval(function() {
			cAMLElement_timer_onInterval(oElement);
		}, nValue);
	// Set timeout
	nValue	= fParseInt(this.attributes["timeout"]);
	if (!fIsNaN(nValue))
		this._timeout	= fSetTimeout(function() {
			cAMLElement_timer_onTimeOut(oElement);
		}, nValue);
};

cAMLElement_timer.prototype.stop		= function() {
	if (this._interval)
		this._interval	= fClearInterval(this._interval);
	if (this._timeout)
		this._timeout	= fClearTimeout(this._timeout);
};

// Static Methods
cAMLElement_timer_onInterval	= function(oElement) {
	var oEvent	= oElement.ownerDocument.createEvent("Events");
	oEvent.initEvent("interval", false, false);
	oElement.dispatchEvent(oEvent);
};

cAMLElement_timer_onTimeOut	= function(oElement) {
	var oEvent	= oElement.ownerDocument.createEvent("Events");
	oEvent.initEvent("timeout", false, false);
	oElement.dispatchEvent(oEvent);
};

// Class Event Handlers
cAMLElement_timer.handlers	= {};
cAMLElement_timer.handlers["DOMAttrModified"]	= function(oEvent) {
	if (oEvent.target == this) {
		switch (oEvent.attrName) {

		}
	}
};
cAMLElement_timer.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	if (this.attributes["autostart"] == "true")
		this.start();
};
cAMLElement_timer.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.stop();
};

// Register Element
fAmple_extend(cAMLElement_timer);