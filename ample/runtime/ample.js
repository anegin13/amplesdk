/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Query function
function pAmple(vArgument1, vArgument2, vArgument3) {
	if (typeof vArgument1 == "string") {
		if (vArgument1.substr(0,1) == "<") {
			// XML string
			var sNameSpaces	= (function() {
				var aNameSpaces	= [];
				for (var sKey in fAmple.namespaces)
					aNameSpaces.push(sKey + '="' + fAmple.namespaces[sKey] + '"');
				return ' ' + aNameSpaces.join(' ');
			})();
			var oDocument	= new cDOMParser().parseFromString(
													'<!' + "DOCTYPE" + ' ' + "div" + '[' + sAML_entities + ']>' +
													'<div' + sNameSpaces + '>' +
													vArgument1 +
													'</div>', "text/xml");
			if (!oDocument || ((window.document.namespaces && oDocument.parseError != 0) || !oDocument.documentElement || oDocument.getElementsByTagName("parsererror").length))
				throw new cAMLException(cAMLException.SYNTAX_ERR, fAmple.caller);
			else
				for (var nIndex = 0, aElements = oDocument.documentElement.childNodes; nIndex < aElements.length; nIndex++)
					if (aElements[nIndex].nodeType == cAMLNode.ELEMENT_NODE)
						this[this.length++]	= oAML_document.importNode(aElements[nIndex], true);
		}
		else {
			// CSS selector
			var aResult;
			try {
				aResult	= (vArgument2 || oAML_document).querySelectorAll(vArgument1, vArgument3 || fResolver);
			}
			catch (oException) {
				// Re-point caller property and re-throw error
				oException.caller	= fAmple.caller;
				throw oException;
			}
			for (var nIndex = 0; nIndex < aResult.length; nIndex++)
				this[this.length++]	= aResult[nIndex];
			this.selector	= vArgument1;
		}
	}
	else
	if (vArgument1 instanceof cAMLElement)
		this[this.length++]	= vArgument1;
};
pAmple.prototype.length		= 0;
pAmple.prototype.selector	= '';

//
function fAmple(vArgument1, vArgument2, vArgument3) {
	// Validate API call
	if (arguments.length > 0 && !(typeof vArgument1 == "string" || vArgument1 instanceof cString) && !(vArgument1 instanceof cAMLElement))
		throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fAmple.caller
//->Debug
				, ["1st", "query", "ample", 'String" or "AMLElement', "undefined"]
//<-Debug
		);

	// Invoke implementation
	return new pAmple(vArgument1, vArgument2, vArgument3);
};

// Magic
fAmple.prototype	= pAmple.prototype;

// Dangerous! No API validation
function fAmple_each(oQuery, fCallback, aArguments) {
	for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
		fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
};

// Extension Mechanism
fAmple.extend	= function(sName, fFunction) {
	// Validate API call
	fAML_validate(arguments, [
		["name",		cString],
		["function",	cFunction]
	]);
//->Debug
	if (pAmple.prototype.hasOwnProperty(sName))
		fAML_warn(nAML_REWRITING_LOADED_PLUGIN_WRN, [sName]);
//<-Debug
	pAmple.prototype[sName]	= fFunction;
};

// Ready event
fAmple.ready	= function(fHandler) {
	// Validate API call
	fAML_validate(arguments, [
		["handler",	cFunction]
	]);

	// Invoke implementation
	oAML_document.addEventListener("load", fHandler, false);
};

// Ajax
fAmple.ajax	= function(oBag) {
	// TODO
};

// Lookup namespaces
fAmple.namespaces	= {};
if (bTrident)
	for (var nIndex = 0, aAttributes = oUADocument.namespaces, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		fAmple.namespaces["xmlns" + ':' + oAttribute.name]	= oAttribute.urn;
else
	for (var nIndex = 0, aAttributes = oUADocument.documentElement.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		if (oAttribute.nodeName.match(/^xmlns($|:)/))
			fAmple.namespaces[oAttribute.nodeName]	= oAttribute.nodeValue;
if (!fAmple.namespaces["xmlns"])
	fAmple.namespaces["xmlns"]	= "http://www.w3.org/1999/xhtml";
//
function fResolver(sPrefix) {
	return fAmple.namespaces["xmlns" + (sPrefix ? ":" + sPrefix : '')] || null;
};

fAmple.document	= oAML_document;

//
fAmple.open	= function() {
	if (oAML_document.readyState == "loading") {
		var aElements	= oUADocument.getElementsByTagName("script"),
			oElement	= aElements[aElements.length - 1];
		oElement.parentNode.removeChild(oElement);
		oUADocument.write('<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + '>');
	}
//->Debug
	else
		fAML_warn(nAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

fAmple.close	= function() {
	if (oAML_document.readyState == "loading")
		oUADocument.write('</' + "script" + '>');
//->Debug
	else
		fAML_warn(nAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

fAmple.$instance	= function(oNode) {
    for (var oElement, sId; oNode; oNode = oNode.parentNode)
        if ((sId = oNode.id) && (oElement = (oAML_ids[sId] || oAML_all[sId])))
            return oElement;
    return null;
};
/*
fAmple.$class	= function(oNode) {
	var oElement	= fAmple.$instance(oNode);
	if (oElement) {
		var sNameSpaceURI	= oElement.namespaceURI,
			oNamespace	= oAML_namespaces[sNameSpaceURI];
		return oNamespace && oNamespace.elements[sNameSpaceURI] ? oNamespace.elements[sNameSpaceURI] : cAMLElement;
	}
	return null;
};
*/
fAmple.$resolveUri	= function(sUri, sBaseUri) {
	return fAML_resolveUri(sUri, sBaseUri);
};