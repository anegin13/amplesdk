/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cFocusEvent	= function(sType) {
	fFocusEvent_init(this, sType, arguments[1]);
};
cFocusEvent.prototype	= new cUIEvent('#' + "FocusEvent");

// nsIDOMFocusEvent
cFocusEvent.prototype.relatedTarget	= null;

function fFocusEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, oRelatedTarget) {
	var oValue	= fUIEvent_getDictionary(bBubbles, bCancelable, oView, nDetail);
	//
	oValue.relatedTarget	= oRelatedTarget;

	return oValue;
};

function fFocusEvent_init(oEvent, sType, oValue) {
	fUIEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("relatedTarget" in oValue)
			oEvent.relatedTarget		= oValue.relatedTarget;
	}
};

//
cFocusEvent.prototype.initFocusEvent	= function(sType, bBubbles, bCancelable, oView, nDetail, oRelatedTarget) {
	fFocusEvent_init(this, sType, fFocusEvent_getDictionary(bBubbles, bCancelable, oView, nDetail, oRelatedTarget));
};