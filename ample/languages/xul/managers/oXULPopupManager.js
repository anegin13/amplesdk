/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULPopupManager	= (function () {

	// Local variables
	var oTooltipPane	= null;

	// Attaching manager to document
	ample.bind("mouseenter",	function(oEvent) {
		for (var oElement = oEvent.target, oTooltip; oElement.nodeType != ample.classes.Node.DOCUMENT_NODE; oElement = oElement.parentNode) {
			if (oElement.$isAccessible()) {
				if (oElement.hasAttribute("tooltiptext")) {
					oTooltip	= oTooltipPane;
					if (!oTooltip)	{
						//
						oTooltip	= this.documentElement.appendChild(this.createElementNS(oElement.namespaceURI, "xul:tooltip-pane"));
						oTooltipPane	= oTooltip;
					}
					oTooltip.setText(oElement.getAttribute("tooltiptext"));
					oTooltip.showPopup(null, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + 18 + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_TOOLTIP);
					ample.tooltipNode	= oTooltip;
				}
				else
				if (oElement.hasAttribute("tooltip")) {
					oTooltip	= this.getElementById(oElement.getAttribute("tooltip"));
					if (oTooltip) {
						oTooltip.showPopup(null, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + 18 + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_TOOLTIP);
						ample.tooltipNode	= oTooltip;
					}
				}
			}
		}
	}, true);

	ample.bind("mouseleave",	function(oEvent) {
		if (ample.tooltipNode)	{
			ample.tooltipNode.hidePopup();
			ample.tooltipNode	= null;
		}
	}, true);

	ample.bind("contextmenu", function(oEvent) {
		for (var oElement = oEvent.target, oPopup; oElement.nodeType != ample.classes.Node.DOCUMENT_NODE; oElement = oElement.parentNode) {
			if (oElement.$isAccessible()) {
				if (oElement.hasAttribute("context")) {
					if (oPopup = this.getElementById(oElement.getAttribute("context"))) {
						oPopup.showPopup(oElement, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_POPUP);
						this.popupNode	= oPopup;
					}
					oEvent.preventDefault();
					break;
				}
			}
		}
	}, true);

	ample.bind("click", function(oEvent) {
		for (var oElement = oEvent.target, oPopup; oElement.nodeType != ample.classes.Node.DOCUMENT_NODE; oElement = oElement.parentNode) {
			if (oElement.$isAccessible()) {
				if (oElement.hasAttribute("popup")) {
					if (oPopup = this.getElementById(oElement.getAttribute("popup"))) {
						oPopup.showPopup(oElement, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_POPUP);
						this.popupNode	= oPopup;
					}
					oEvent.preventDefault();
					break;
				}
			}
		}
	}, true);

	ample.bind("mousedown",	function(oEvent) {
		// Hide popup node
		if (this.popupNode && !(oEvent.target == this.popupNode ||(oEvent.target.compareDocumentPosition(this.popupNode) & ample.classes.Node.DOCUMENT_POSITION_CONTAINS))) {
			this.popupNode.hidePopup();
			this.popupNode	= null;

			// stop propagating this event
			oEvent.stopPropagation();
		}
		// hide tooltip node
		if (ample.tooltipNode) {
			ample.tooltipNode.hidePopup();
			ample.tooltipNode= null;
		}
	}, true);

	// Public Object
	return {

	};
})();