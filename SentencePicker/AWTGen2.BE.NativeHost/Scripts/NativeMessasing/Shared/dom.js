WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.GetSafeContentDocument = function (frame) {
		var out_doc = null;
		try {
			out_doc = frame.contentDocument;
		} catch (e) {
			out_doc = null;
		}
		return out_doc;
	};
	gcontext.GetDocumentListRecursive = function (doc, out_docList) {
		if (doc == null) return;
		var i = 0;
		out_docList.push(doc);
		var frames = doc.getElementsByTagName("iframe");
		for (i = 0; i < frames.length; ++i)
			gcontext.GetDocumentListRecursive(gcontext.GetSafeContentDocument(frames.item(i)), out_docList);
		frames = doc.getElementsByTagName("frame");
		for (i = 0; i < frames.length; ++i)
			gcontext.GetDocumentListRecursive(gcontext.GetSafeContentDocument(frames.item(i)), out_docList);
	};
	gcontext.GetDocumentList = function (rootDoc) {
		if (!gcontext.IsMainFrame(window)) {
			return [rootDoc];
		}
		var docList = [];
		gcontext.GetDocumentListRecursive(rootDoc, docList);
		return docList;
	};
	gcontext.GetFrameListRecursive = function (doc, out_frameList) {
		if (doc == null) return;
		var i = 0;
		var frames = doc.getElementsByTagName("iframe");
		for (i = 0; i < frames.length; ++i) {
			var frame = frames.item(i);
			out_frameList.push(frame);
			gcontext.GetFrameListRecursive(gcontext.GetSafeContentDocument(frame), out_frameList);
		}
		frames = doc.getElementsByTagName("frame");
		for (i = 0; i < frames.length; ++i) {
			var frame = frames.item(i);
			out_frameList.push(frame);
			gcontext.GetFrameListRecursive(gcontext.GetSafeContentDocument(frame), out_frameList);
		}
	};
	gcontext.GetFrameList = function (rootDoc) {
		var frameList = [];
		gcontext.GetFrameListRecursive(rootDoc, frameList);
		return frameList;
	};
});

WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.MAX_ATTR_LEN = 64;
	gcontext.UIE_CF_CLICK_MASK = 0x00000003;
	gcontext.UIE_CF_SINGLE = 0x00000000;
	gcontext.UIE_CF_DOUBLE = 0x00000001;
	gcontext.UIE_CF_HOVER = 0x00000002;
	gcontext.UIE_CF_BUTTON_MASK = 0x0000000c;
	gcontext.UIE_CF_LEFT = 0x00000000;
	gcontext.UIE_CF_RIGHT = 0x00000004;
	gcontext.UIE_CF_MIDDLE = 0x00000008;
	gcontext.UIE_CF_SCREEN_COORDS = 0x00000010;
	gcontext.UIE_CF_DOWN = 0x00001000;
	gcontext.UIE_CF_UP = 0x00002000;
	gcontext.UIE_CF_MOD_CTRL = 0x00004000;
	gcontext.UIE_CF_MOD_ALT = 0x00008000;
	gcontext.UIE_CF_MOD_SHIFT = 0x00010000;
	gcontext.HTML_LEFT_BUTTON = 0;
	gcontext.HTML_MIDDLE_BUTTON = 1;
	gcontext.HTML_RIGHT_BUTTON = 2;
	gcontext.HTML_CLICK_SINGLE = 0;
	gcontext.HTML_CLICK_DOUBLE = 1;
	gcontext.HTML_CLICK_DOWN = 3;
	gcontext.HTML_CLICK_UP = 4;
	gcontext.HTML_CLICK_HOVERONLY = 2;
	gcontext.CLICK_OFFSET_X = 2;
	gcontext.CLICK_OFFSET_Y = 2;
	gcontext.UI_EVENT = 0;
	gcontext.g_getCustomAttrMap = {
		url: function (elem) {
			if (elem.ownerDocument) return elem.ownerDocument.URL;
			return "";
		},
		htmlwindowname: function (elem) {
			if (window.name) {
				return window.name;
			} else {
				return "";
			}
		},
		title: function (elem) {
			if (elem.ownerDocument) return elem.ownerDocument.title;
			return "";
		},
		cookie: function (elem) {
			if (elem.ownerDocument) return elem.ownerDocument.cookie;
			return "";
		},
		readystate: function (elem) {
			if (!elem.ownerDocument || elem.ownerDocument.readyState !== "complete") {
				return "0";
			}
			if (gcontext.IsSapFioriElement(elem)) {
				return gcontext.GetSapReadyState(elem);
			}
			return "1";
		},
		innertext: function (elem) {
			return gcontext.DeleteForbiddenCharacters(elem.textContent);
		},
		innertextshort: function (elem) {
			return gcontext.GetAttributeShortValue(elem, "innertext");
		},
		outertext: function (elem) {
			return gcontext.DeleteForbiddenCharacters(elem.textContent);
		},
		outertextshort: function (elem) {
			return gcontext.GetAttributeShortValue(elem, "outertext");
		},
		innerhtml: function (elem) {
			return elem.innerHTML;
		},
		innerhtmlshort: function (elem) {
			return gcontext.GetAttributeShortValue(elem, "innerhtml");
		},
		outerhtml: function (elem) {
			return elem.outerHTML;
		},
		outerhtmlshort: function (elem) {
			return gcontext.GetAttributeShortValue(elem, "outerhtml");
		},
		tag: function (elem) {
			return elem.tagName;
		},
		parentid: function (elem) {
			return gcontext.GetParentAttributeValue(elem, "id");
		},
		parentname: function (elem) {
			return gcontext.GetParentAttributeValue(elem, "name");
		},
		parentclass: function (elem) {
			return gcontext.GetParentAttributeValue(elem, "class");
		},
		tablerow: function (elem) {
			var r = gcontext.GetTableRowAndCol(elem, {
				getRow: true,
			}).row;
			return r < 0 ? "" : r;
		},
		tablecol: function (elem) {
			var c = gcontext.GetTableRowAndCol(elem, {
				getCol: true,
			}).col;
			return c < 0 ? "" : c;
		},
		rowname: function (elem) {
			return gcontext.GetTableRowName(elem);
		},
		colname: function (elem) {
			return gcontext.GetTableColName(elem);
		},
		columncount: function (elem) {
			return gcontext.GetTableColCount(elem);
		},
		rowcount: function (elem) {
			return gcontext.GetTableRowCount(elem);
		},
		checked: function (elem) {
			return gcontext.GetCheckedAttribute(elem);
		},
		role: function (elem) {
			return "element";
		},
		aastate: function (elem) {
			if (elem.disabled === true) return "disabled";
			return "enabled";
		},
		aaname: function (elem) {
			return gcontext.getAccName(elem);
		},
		aanameshort: function (elem) {
			return gcontext.GetAttributeShortValue(elem, "aaname");
		},
		"css-selector": function (elem) {
			return gcontext.getCssSelector(elem);
		},
		selecteditem: function (elem) {
			return gcontext.GetSelectedItemTxt(elem);
		},
		selecteditems: function (elem) {
			return gcontext.GetSelectedItemsTxt(elem);
		},
		isleaf: function (elem) {
			return gcontext.isLeafElement(elem) ? "1" : "0";
		},
		"ui5-id": function (elem) {
			return gcontext.GetSapId(elem);
		},
		"ui5-class": function (elem) {
			return gcontext.GetSapClass(elem);
		},
		"ui5-role": function (elem) {
			return gcontext.GetSapRole(elem);
		},
		"ui5-type": function (elem) {
			return gcontext.GetSapType(elem);
		},
		"ui5-label": function (elem) {
			return gcontext.GetSapLabel(elem);
		},
		"ui5-tooltip": function (elem) {
			return gcontext.GetSapTooltip(elem);
		},
		"ui5-tablerow": function (elem) {
			return gcontext.GetSapTableRowIndex(elem);
		},
		"ui5-tablecol": function (elem) {
			return gcontext.GetSapTableColIndex(elem);
		},
		"aria-role": function (elem) {
			return elem.getAttribute("role");
		},
	};
	gcontext.GetSelectedItemTxt = function (e) {
		var items = gcontext.GetSelectedItems(e, 0);
		if (items && items.length > 0) {
			return items[0];
		}
		return "";
	};
	gcontext.GetSelectedItemsTxt = function (e) {
		var items = gcontext.GetSelectedItems(e, 0);
		var txt = "";
		for (var i = 0; i < items.length; ++i) {
			if (txt) {
				txt = txt + ", ";
			}
			txt = txt + '"';
			txt = txt + items[i];
			txt = txt + '"';
		}
		txt = "{ " + txt;
		txt = txt + " }";
		return txt;
	};
	gcontext.IsBrowserSettingsUrl = function (url) {
		return (
			url &&
			(
				url.indexOf("chrome://") === 0 ||
				url.indexOf("edge://") === 0 ||
				url.indexOf("firefox://") === 0 ||
				url.indexOf("about://") === 0
			)
		);
	};
	gcontext.GetAttributeValue = function (element, attrName) {
		var out_attrValue = "";
		var getCustomAttrFunc = gcontext.g_getCustomAttrMap[attrName.toLowerCase()];
		var rawAttrVal;
		//var sapAttrPrefix = gcontext.g_sapFioriDefines.propertyBasedAttrPrefix;
		if (getCustomAttrFunc != null) rawAttrVal = getCustomAttrFunc(element);
		//else if (attrName.slice(0, sapAttrPrefix.length) === sapAttrPrefix)
		//    rawAttrVal = gcontext.GetSapPropertyBasedAttribute(element, attrName);
		else rawAttrVal = element.getAttribute(attrName);
		if (typeof rawAttrVal === "boolean") out_attrValue = rawAttrVal ? "1" : "0";
		else if (rawAttrVal != null && rawAttrVal.toString != null) out_attrValue = rawAttrVal.toString();
		return out_attrValue;
	};
	gcontext.GetParentAttributeValue = function (element, attrName) {
		var out_attrValue = "";
		gcontext.ForEachAncestor(element, function (crtAncestor) {
			out_attrValue = gcontext.GetAttributeValue(crtAncestor, attrName);
			if (out_attrValue.length !== 0) {
				return false;
			}
			return true;
		});
		return out_attrValue;
	};
	gcontext.GetParentByTag = function (element, tagName) {
		var out_parentElem = null;
		gcontext.ForEachAncestor(element, function (crtAncestor) {
			if (crtAncestor.tagName.toLowerCase() === tagName) {
				out_parentElem = crtAncestor;
				return false;
			}
			return true;
		});
		return out_parentElem;
	};
	gcontext.GetFirstChildText = function (parentElem, tag, index) {
		var children = parentElem.getElementsByTagName(tag);
		if (children == null) {
			return "";
		}
		if (index > children.length - 1) {
			return "";
		}
		var text = children.item(index).textContent;
		return gcontext.DeleteForbiddenCharacters(text);
	};
	gcontext.GetTableRowCount = function (e) {
		var tagName = e.tagName.toLowerCase();
		if (tagName !== "table") {
			return "";
		}
		var rows = e.getElementsByTagName("tr");
		if (rows !== null) {
			return rows.length.toString();
		}
		return "";
	};
	gcontext.GetTableColCount = function (e) {
		var tagName = e.tagName.toLowerCase();
		if (tagName !== "table") {
			return "";
		}
		var rows = e.getElementsByTagName("tr");
		if (rows !== null && rows.length > 0) {
			var tds = rows.item(0).getElementsByTagName("td");
			if (tds !== null && tds.length > 0) {
				return tds.length.toString();
			}
			var ths = rows.item(0).getElementsByTagName("th");
			if (ths !== null && ths.length > 0) {
				return ths.length.toString();
			}
		}
		return "";
	};
	gcontext.GetTableRowName = function (elem) {
		var parentRow = gcontext.GetParentByTag(elem, "tr");
		if (!parentRow) {
			return "";
		}
		var text = gcontext.GetFirstChildText(parentRow, "th", 0);
		if (text === "") {
			text = gcontext.GetFirstChildText(parentRow, "td", 0);
		}
		return text;
	};
	gcontext.GetTableColName = function (elem) {
		var table = gcontext.GetParentByTag(elem, "table");
		if (!table) {
			return "";
		}
		var colIndex = gcontext.GetTableRowAndCol(elem, {
			getCol: true,
		}).col;
		if (colIndex < 1) {
			return "";
		}
		var text = gcontext.GetFirstChildText(table, "th", colIndex - 1);
		if (text === "") {
			text = gcontext.GetFirstChildText(table, "td", colIndex - 1);
		}
		return text;
	};
	gcontext.GetTableRowAndCol = function (cellElem, inputFlags) {
		var out_rowAndCol = {
			row: -1,
			col: -1,
		};
		var tagName = cellElem.tagName.toLowerCase();
		if (tagName !== "td" && tagName !== "th") {
			var parentCell = gcontext.GetParentByTag(cellElem, "td");
			if (parentCell === null) {
				parentCell = gcontext.GetParentByTag(cellElem, "th");
				if (parentCell === null) {
					return out_rowAndCol;
				}
			}
			cellElem = parentCell;
		}
		var rowParent = gcontext.GetParentByTag(cellElem, "tr");
		if (rowParent == null) return out_rowAndCol;
		if (inputFlags.getCol === true) out_rowAndCol.col = gcontext.ComputeIndexInParent(cellElem, rowParent);
		if (inputFlags.getRow === true) {
			var tableParent = gcontext.GetParentByTag(rowParent, "table");
			if (tableParent == null) return out_rowAndCol;
			out_rowAndCol.row = gcontext.ComputeIndexInParent(rowParent, tableParent);
		}
		return out_rowAndCol;
	};
	gcontext.ComputeIndexInParent = function (element, parent) {
		var out_index = -1;
		var i;
		var refCustomId = gcontext.GenerateCustomIdForElement(element);
		var children = parent.getElementsByTagName(element.tagName);
		if (children == null) return out_index;
		for (i = 0; i < children.length; ++i) {
			if (gcontext.GetCustomIdForElement(children.item(i)) === refCustomId) {
				out_index = i + 1;
				break;
			}
		}
		return out_index;
	};
	gcontext.ElementHasAttributeValues = function (element, attrMap, fuzzyScoreStats) {
		if (element == null) {
			return false;
		}
		if (gcontext.IsObjectEmpty(attrMap)) {
			if (typeof fuzzyScoreStats !== "undefined") {
				fuzzyScoreStats.accept(1.0);
			}
			return true;
		}
		var out_match = true;
		for (var attrName in attrMap) {
			if (attrName !== "css-selector") {
				var crtValue = gcontext.GetAttributeValue(element, attrName);
				var matchRes =
					gcontext.HasAttributeValue(attrMap[attrName]) && attrMap[attrName].Matches(crtValue, fuzzyScoreStats);
				if (matchRes === false) {
					out_match = false;
					break;
				}
			}
		}
		return out_match;
	};
	gcontext.FindElementUsingAttributes = function (htmlCollection, index, attrMap) {
		var out_element = null;
		var i;
		if (htmlCollection == null) return out_element;
		var crtIndex = 0;
		for (i = 0; i < htmlCollection.length; ++i) {
			var crtElem = htmlCollection[i];
			if (gcontext.ElementHasAttributeValues(crtElem, attrMap) === true) {
				++crtIndex;
				if (crtIndex === index) {
					out_element = crtElem;
					break;
				}
			}
		}
		return out_element;
	};
	gcontext.DoubleSummaryStatistics = function () {
		this.max = 0.0;
		this.min = Number.MAX_VALUE;
		this.average = 0;
		this.sum = 0;
		this.count = 0;
		this.accept = function (value) {
			gcontext.TraceMessage("DoubleSummaryStatistics: accept " + value);
			++this.count;
			if (value > this.max) this.max = value;
			if (value < this.min) this.min = value;
			this.sum += value;
			this.average = this.sum / this.count;
		};
	};
	gcontext.FindElementCollectionUsingAttributes = function (htmlCollection, params) {
		var out_results = new gcontext.ResultsCollection(params.maxElems);
		if (htmlCollection == null) {
			return out_results;
		}
		var i;
		var crtIndex = 0;
		for (i = 0; i < htmlCollection.length; ++i) {
			var crtElem = htmlCollection[i];
			var fuzzyScoreStats = new gcontext.DoubleSummaryStatistics();
			if (gcontext.ElementHasAttributeValues(crtElem, params.attrMap, fuzzyScoreStats) === true) {
				var matchingScore = fuzzyScoreStats.average;
				gcontext.TraceMessage("FindElementCollectionUsingAttributes: matchingScore =" + matchingScore);
				if (!params.useTagFuzzyLevel || matchingScore >= params.tagFuzzyLevel) {
					out_results.Accept(new gcontext.HtmlSearchResult(crtElem, matchingScore));
				}
				if (out_results.IsFull()) {
					gcontext.TraceMessage("FindElementCollectionUsingAttributes: breaking the loop");
					break;
				}
			}
		}
		return out_results;
	};
	gcontext.FindTabCollectionUsingAttributes = function (params, OnFinishedCallback) {
		var out_results = new gcontext.ResultsCollection(params.maxElems);
		var OnAllTabsProcessed = function () {
			gcontext.TraceMessage("GetMatchingTabs: filteredTabs.length=" + out_results.GetResults().length);
			OnFinishedCallback(out_results);
		};
		var queryOptions = {};
		chrome.tabs.query(queryOptions, function (tabList) {
			var tabCount = tabList ? tabList.length : 0;
			if (tabCount == 0) {
				OnAllTabsProcessed();
			} else {
				gcontext.TraceMessage("onGetHtmlElemById: tab count = " + tabList.length);
				var ProcessTab = function (tab) {
					gcontext.TraceMessage("onGetHtmlElemById:ProcessTab tab.url = " + tab.url);
					var fuzzyScoreStats = new gcontext.DoubleSummaryStatistics();
					var MatchesSyncAttributes = function (tab) {
						if (
							(!gcontext.HasAttributeValue(params.attrMap["title"]) ||
								params.attrMap["title"].Matches(tab.title, fuzzyScoreStats)) &&
							(!gcontext.HasAttributeValue(params.attrMap["url"]) ||
								params.attrMap["url"].Matches(tab.url, fuzzyScoreStats))
						) {
							return true;
						}
						return false;
					};
					if (MatchesSyncAttributes(tab)) {
						if (!gcontext.HasAttributeValue(params.attrMap["htmlwindowname"])) {
							var matchingScore = fuzzyScoreStats.average;
							if (!params.useTagFuzzyLevel || matchingScore >= params.tagFuzzyLevel) {
								out_results.Accept(new gcontext.TabSearchResult(tab, matchingScore));
							}
							OnTabProcessed();
						} else if (gcontext.IsBrowserSettingsUrl(tab.url)) {
							gcontext.TraceMessage("onGetHtmlElemById: skipping tab.id: " + tab.id + ", tab.url: " + tab.url);
							OnTabProcessed();
						} else {
							chrome.tabs.executeScript(
								tab.id,
								{
									code: "window.name",
								},
								function (result) {
									var windowName = "" + result;
									if (params.attrMap["htmlwindowname"].Matches(windowName, fuzzyScoreStats)) {
										var matchingScore = fuzzyScoreStats.average;
										if (!params.useTagFuzzyLevel || matchingScore >= params.tagFuzzyLevel) {
											out_results.Accept(new gcontext.TabSearchResult(tab, matchingScore));
										}
									}
									OnTabProcessed();
								}
							);
						}
					} else {
						OnTabProcessed();
					}
				};
				var OnTabProcessed = function () {
					--tabCount;
					if (tabCount <= 0) {
						OnAllTabsProcessed();
					}
				};
				for (var i = 0; i < tabList.length; ++i) {
					ProcessTab(tabList[i]);
				}
			}
		});
	};
	gcontext.GetIndexForAttributeList = function (htmlCollection, targetCustomId, attrMap) {
		gcontext.TraceMessage("GetIndexForAttributeList: enter targetCustomId=" + targetCustomId);
		var out_index = 0;
		var i = 0;
		var found = false;
		var unique = true;
		for (i = 0; i < htmlCollection.length; ++i) {
			var crtElem = htmlCollection[i];
			var crtCustomId = gcontext.GetCustomIdForElement(crtElem);
			if (found === false && crtCustomId === targetCustomId) {
				gcontext.TraceMessage("GetIndexForAttributeList: element reached");
				found = true;
				++out_index;
				if (out_index > 1) {
					unique = false;
					break;
				}
			} else if (gcontext.ElementHasAttributeValues(crtElem, attrMap)) {
				gcontext.TraceMessage("GetIndexForAttributeList: attributes match");
				if (found) {
					unique = false;
					break;
				} else ++out_index;
			}
		}
		if (found === false) {
			out_index = -1;
		} else if (unique === true && out_index === 1) {
			out_index = 0;
		}
		gcontext.TraceMessage("GetIndexForAttributeList: return index=" + out_index);
		return out_index;
	};
	gcontext.GetTruncatedAttributeValue = function (targetElement, attrName) {
		var resValue = null;
		var attrVal = gcontext.GetAttributeValue(targetElement, attrName);
		if (attrVal.length !== 0) {
			resValue =
				attrName === "css-selector" ? attrVal : gcontext.TruncateStringUsingWildcard(attrVal, gcontext.MAX_ATTR_LEN);
		}
		return resValue;
	};
	gcontext.GetAttributeShortValue = function (element, attrName) {
		const maxAttrValueLength = 512;
		var attrValue = gcontext.GetAttributeValue(element, attrName);
		if (attrValue.length > maxAttrValueLength) {
			return gcontext.TruncateStringUsingWildcard(attrValue, maxAttrValueLength);
		}
		return attrValue;
	};
	gcontext.GetAttrNameShort = function (attrName) {
		function Result(shortAttrName, isDifferent) {
			return {
				shortAttrName: shortAttrName,
				isDifferent: isDifferent,
			};
		}
		if (attrName === "innertext") {
			return Result("innertextshort", true);
		} else if (attrName === "outertext") {
			return Result("outertextshort", true);
		} else if (attrName === "innerhtml") {
			return Result("innerhtmlshort", true);
		} else if (attrName === "outerhtml") {
			return Result("outerhtmlshort", true);
		} else if (attrName === "aaname") {
			return Result("aanameshort", true);
		}
		return Result(attrName, false);
	};
	gcontext.GetSelectorAttributeListResult = function (tagName, attrMap, index, retCode) {
		var out_result = {
			tagName: tagName,
			attrMap: gcontext.ActiveValueStringMap(attrMap),
			index: index,
			retCode: retCode,
		};
		return out_result;
	};
	gcontext.isLeafElement = function (e) {
		if (!e) {
			return false;
		}
		return e.children.length === 0;
	};
	gcontext.shouldAddAAName = function (e) {
		var t = e.tagName.toLowerCase();
		var acceptedTags = ["a", "label", "img", "input", "button", "textarea", "area", "select", "table", "th"];
		if (acceptedTags.indexOf(t) !== -1) {
			return true;
		}
		if ((t === "div" || t === "span") && e.textContent.length <= 32) {
			return true;
		}
		var acceptedParentTags = ["a", "label", "button", "select", "th"];
		while (true) {
			var p = e.parentElement;
			if (p === null) {
				break;
			}
			t = p.tagName.toLowerCase();
			if (acceptedParentTags.indexOf(t) !== -1) {
				return true;
			}
			e = p;
		}
		return false;
	};
	gcontext.GetSelectorAttributeList = function (rootDocument, targetCustomId, parentId, targetTagName, computeIndex) {
		gcontext.TraceMessage(
			"GetSelectorAttributeList: enter targetCustomId=[" +
				targetCustomId +
				"] parentId=[" +
				parentId +
				"] targetTagName=[" +
				targetTagName +
				"]"
		);
		if (targetCustomId == null) {
			gcontext.TraceMessage("GetSelectorAttributeList: invalid input, return error");
			return gcontext.GetSelectorAttributeListResult("", {}, -1, N_FALSE);
		}
		var targetElement = gcontext.GetElementFromCustomId(targetCustomId);
		if (targetElement == null) {
			gcontext.TraceMessage("GetSelectorAttributeList: targetCustomId=" + targetCustomId + " not found in the cache");
			return gcontext.GetSelectorAttributeListResult("", {}, -1, N_FALSE);
		}
		var isSapFioriElement = gcontext.IsSapFioriElement(targetElement);
		if (isSapFioriElement) {
			return gcontext.GetSapFioriSelectorAttributeList(
				rootDocument,
				targetElement,
				targetCustomId,
				parentId,
				targetTagName,
				computeIndex
			);
		}
		var getAllDocuments = gcontext.xbrowser.isModeSingleFrame();
		var htmlCollection = gcontext.GetHtmlCollectionForParentId(rootDocument, getAllDocuments, parentId, targetTagName);
		if (htmlCollection == null) {
			gcontext.TraceMessage("OnGetHtmlIdInfo: GetHtmlCollectionForParentId('" + parentId + "') failed");
			return gcontext.GetSelectorAttributeListResult("", {}, -1, N_FALSE);
		}
		var attrLists = ["tag", "type", "aria-role", "id", "name", "parentid", "parentname"];
		if (gcontext.shouldAddAAName(targetElement)) {
			attrLists.push("aaname");
		}
		if (gcontext.isLeafElement(targetElement)) {
			attrLists.push("isleaf");
		}
		attrLists.push("css-selector");
		attrLists.push("tabindex");
		attrLists.push("tableRow");
		attrLists.push("tableCol");
		attrLists.push("href");
		if (gcontext.ElementIsFrame(targetElement)) {
			attrLists.splice(3, 0, "src");
		} else {
			attrLists.push("src");
		}
		var bestIndex = 1000000;
		if (computeIndex == 0) bestIndex = 0;
		var attrMap = {};
		attrLists = gcontext.GetUniqueElementsFromArray(attrLists);
		for (var phaseIdx = 0; phaseIdx < attrLists.length; ++phaseIdx) {
			var crntAttrName = attrLists[phaseIdx];
			var crntAttrValue = gcontext.GetTruncatedAttributeValue(targetElement, crntAttrName);
			if (crntAttrValue) {
				if (crntAttrName === "css-selector" && computeIndex > 0) {
					if (bestIndex <= 1) {
						continue;
					}
					var cssSelector = crntAttrValue;
					var getAllDocuments = gcontext.xbrowser.isModeSingleFrame();
					htmlCollection = gcontext.GetHtmlCollectionForParentId(
						rootDocument,
						getAllDocuments,
						parentId,
						targetTagName,
						cssSelector
					);
					if (htmlCollection === null) {
						gcontext.TraceMessage("OnGetHtmlIdInfo: GetHtmlCollectionForParentId('" + parentId + "') failed");
						return gcontext.GetSelectorAttributeListResult("", {}, -1, N_FALSE);
					}
				}
				attrMap[crntAttrName] = new gcontext.AttributeValue(crntAttrValue);
				if (computeIndex > 0) {
					var crntIndex = gcontext.GetIndexForAttributeList(htmlCollection, targetCustomId, attrMap);
					if (crntIndex === -1) {
						gcontext.TraceMessage("GetSelectorAttributeList: index == -1, return error");
						return gcontext.GetSelectorAttributeListResult("", {}, -1, N_FALSE);
					}
					if (crntIndex < bestIndex) {
						bestIndex = crntIndex;
					} else {
						delete attrMap[crntAttrName];
					}
					if (bestIndex === 0) {
						gcontext.TraceMessage("GetSelectorAttributeList: index == 0, return success");
						if (Object.keys(attrMap).length === 1 && gcontext.ElementIsFrame(targetElement)) {
							var extraAttrList = ["id", "name", "src"];
							for (var i = 0; i < extraAttrList.length; i += 1) {
								var attrName = extraAttrList[i];
								var attrValue = gcontext.GetTruncatedAttributeValue(targetElement, attrName);
								if (attrValue) {
									gcontext.TraceMessage(
										'OnGetHtmlIdInfo: Frame selector has only one attribute. Added extra "' +
											attrName +
											'"="' +
											attrValue +
											'" to make it more precise'
									);
									attrMap[attrName] = new gcontext.AttributeValue(attrValue);
									break;
								}
							}
							if (Object.keys(attrMap).length === 1) {
								gcontext.TraceMessage(
									'OnGetHtmlIdInfo: Warning, frame selector has only "tag" attribute and extra attributes could not be added'
								);
							}
						}
						return gcontext.GetSelectorAttributeListResult(targetElement.tagName, attrMap, 0, N_TRUE);
					}
				}
			}
		}
		return gcontext.GetSelectorAttributeListResult(targetElement.tagName, attrMap, bestIndex, N_TRUE);
	};
	gcontext.GetAttrValueListForElement = function (element) {
		var result = {};
		if (element !== null) {
			var attrNames = gcontext.GetAttributeListForElement(element);
			var staticAttrNames = [
				"innertext",
				"outertext",
				"innerhtml",
				"outerhtml",
				"tag",
				"parentid",
				"class",
				"parentname",
				"parentclass",
				"aaname",
				"aastate",
				"role",
				"cookie",
				"readystate",
				"url",
				"checked",
				"isleaf",
				"css-selector",
				"selecteditem",
				"selecteditems",
			];
			var allAttrNames = staticAttrNames.concat(attrNames);
			for (var n = 0; n < allAttrNames.length; ++n) {
				var attrName = allAttrNames[n];
				if (attrName !== gcontext.CUSTOM_ID_ATTR_NAME) {
					var attrNameShort = gcontext.GetAttrNameShort(attrName).shortAttrName;
					var crntVal = gcontext.GetAttributeValue(element, attrNameShort);
					if (crntVal !== null && crntVal.length !== 0) {
						result[attrName] = crntVal;
					}
				}
			}
		} else {
			result["title"] = document.title;
			result["url"] = document.URL;
			result["cookies"] = document.cookie;
			result["readystate"] = document.readyState === "complete" ? "1" : "0";
			result["text"] = document.body ? gcontext.DeleteForbiddenCharacters(document.body.textContent) : "";
		}
		return result;
	};
	gcontext.GetSelectorAttributeNames = function (element) {
		if (element == null) {
			return [];
		}
		var allAttrNames = [
			"action",
			"alt",
			"aaname",
			"href",
			"id",
			"innertext",
			"name",
			"parentid",
			"parentname",
			"parentclass",
			"src",
			"tabindex",
			"tableCol",
			"tableRow",
			"colName",
			"rowName",
			"tag",
			"title",
			"type",
			"class",
			"css-selector",
			"isleaf",
			"aria-label",
			"aria-role",
		];
		if (gcontext.IsSapFioriElement(element)) {
			var sapFioriAttrNames = gcontext.GetSapFioriAttributeNames(element);
			allAttrNames = allAttrNames.concat(sapFioriAttrNames);
		}
		return allAttrNames;
	};
	gcontext.GetAllSelectorAttributesForElement = function (element, attrExclusionMap) {
		var result = {};
		if (element !== null) {
			var allAttrNames = gcontext.GetSelectorAttributeNames(element);
			for (var n = 0; n < allAttrNames.length; ++n) {
				var attrName = allAttrNames[n];
				var shortAttrRes = gcontext.GetAttrNameShort(attrName);
				var excludedAttrValue = attrExclusionMap != null ? attrExclusionMap[attrName] : null;
				if (excludedAttrValue == null) {
					var crntVal = gcontext.GetAttributeValue(element, shortAttrRes.shortAttrName);
					if (crntVal !== null && crntVal.length !== 0) {
						result[shortAttrRes.shortAttrName] = crntVal;
					}
				} else if (shortAttrRes.isDifferent) {
					result[shortAttrRes.shortAttrName] = excludedAttrValue;
				}
			}
		}
		return result;
	};
	gcontext.GetAttributeListForElement = function (element) {
		var out_attrList = [];
		if (element == null || element.attributes == null) return out_attrList;
		var tagName = element.tagName.toLowerCase();
		if (
			tagName === "th" ||
			tagName === "td" ||
			gcontext.GetParentByTag(element, "td") !== null ||
			gcontext.GetParentByTag(element, "th") !== null
		) {
			out_attrList.push("tableRow");
			out_attrList.push("tableCol");
			out_attrList.push("rowName");
			out_attrList.push("colName");
		}
		if (tagName === "table") {
			out_attrList.push("rowCount");
			out_attrList.push("columnCount");
		}
		for (var i = 0; i < element.attributes.length; ++i) {
			var crtAttrName = element.attributes.item(i).nodeName;
			if (
				crtAttrName != null &&
				crtAttrName.length > 0 &&
				crtAttrName.toLowerCase() !== "checked" &&
				crtAttrName !== gcontext.CUSTOM_ID_ATTR_NAME &&
				crtAttrName !== gcontext.g_sapFioriDefines.SAP_FIORI_CUSTOM_ID_ATTR_NAME
			) {
				out_attrList.push(crtAttrName);
			}
		}
		if (gcontext.IsSapFioriElement(element)) {
			var sapFioriAttrNames = gcontext.GetSapFioriAttributeNames(element);
			out_attrList = out_attrList.concat(sapFioriAttrNames);
		}
		out_attrList.push("aria-role");
		return out_attrList;
	};
	gcontext.GetHtmlCollectionForParentElement = function (parentElem, tagName, cssSelector) {
		if (!tagName) {
			tagName = "*";
		}
		tagName = tagName.toLowerCase();
		var out_collection = [];
		var i;
		var isCssSelectorValid = cssSelector !== undefined && cssSelector !== null;
		if (isCssSelectorValid) {
			try {
				var elements = parentElem.querySelectorAll(cssSelector);
				for (i = 0; i < elements.length; ++i) {
					if (tagName === "*" || tagName === elements.item(i).tagName.toLowerCase()) {
						out_collection.push(elements.item(i));
					}
				}
			} catch (e) {
				gcontext.TraceMessage("GetHtmlCollectionForParentElement exception: " + e);
				isCssSelectorValid = false;
				out_collection = [];
			}
		}
		if (!isCssSelectorValid) {
			var elements = parentElem.getElementsByTagName(tagName);
			gcontext.TraceMessage(
				"GetHtmlCollectionForParentElement: getElementsByTagName(tag='" +
					tagName +
					"') returned " +
					elements.length +
					" elements"
			);
			for (i = 0; i < elements.length; ++i) {
				out_collection.push(elements.item(i));
			}
		}
		return out_collection;
	};
	gcontext.GetHtmlCollectionForParentId = function (rootDocument, getAllDocuments, parentId, tagName, cssSelector) {
		gcontext.TraceMessage("GetHtmlCollectionForParentId: enter parentId=" + parentId + " tagName=" + tagName);
		var i;
		var out_collection = [];
		if (parentId != null && parentId.length > 0) {
			var parentElem = gcontext.GetElementFromCustomId(parentId);
			if (parentElem == null) {
				gcontext.TraceMessage("GetHtmlCollectionForParentId: parentId=" + parentId + " not found in the cache");
				return null;
			}
			out_collection = gcontext.GetHtmlCollectionForParentElement(parentElem, tagName, cssSelector);
		} else {
			var docs = [rootDocument];
			if (getAllDocuments && gcontext.IsMainFrame(window)) {
				docs = gcontext.GetDocumentList(rootDocument);
			}
			for (i = 0; i < docs.length; ++i)
				out_collection = out_collection.concat(
					gcontext.GetHtmlCollectionForParentElement(docs[i], tagName, cssSelector)
				);
			if (out_collection.length === 0) out_collection = null;
		}
		gcontext.TraceMessage("GetHtmlCollectionForParentId: return");
		return out_collection;
	};
	gcontext.GetDirectChildrenCollectionForParentElement = function (parentElem, tagName) {
		var i;
		var out_collection = [];
		for (i = 0; i < parentElem.children.length; ++i) {
			var crtElem = parentElem.children.item(i);
			if (tagName == null || tagName.length === 0 || crtElem.tagName.toLowerCase() === tagName)
				out_collection.push(crtElem);
		}
		return out_collection;
	};
	gcontext.GetDirectChildrenCollectionForParentId = function (rootDocument, getAllDocuments, parentId, tagName) {
		gcontext.TraceMessage("GetDirectChildrenCollectionForParentId: enter tagName=[" + tagName + "]");
		var i;
		var out_collection = [];
		if (parentId != null && parentId.length > 0) {
			var parentElem = gcontext.GetElementFromCustomId(parentId);
			if (parentElem == null) {
				gcontext.TraceMessage(
					"GetDirectChildrenCollectionForParentId: parentId=" + parentId + " not found in the cache"
				);
				return null;
			}
			gcontext.TraceMessage(
				"GetDirectChildrenCollectionForParentId: calling GetDirectChildrenCollectionForParentElement on parentId"
			);
			out_collection = gcontext.GetDirectChildrenCollectionForParentElement(parentElem, tagName);
		} else {
			gcontext.TraceMessage(
				"GetDirectChildrenCollectionForParentId: calling GetDirectChildrenCollectionForParentElement on each doc"
			);
			var docs = [rootDocument];
			if (getAllDocuments) {
				docs = gcontext.GetDocumentList(rootDocument);
			}
			for (i = 0; i < docs.length; ++i) {
				var docElem = docs[i].documentElement;
				if (docElem.tagName.toLowerCase() === tagName) out_collection.push(docElem);
				out_collection = out_collection.concat(gcontext.GetDirectChildrenCollectionForParentElement(docElem, tagName));
			}
			if (out_collection.length === 0) out_collection = null;
		}
		gcontext.TraceMessage("GetDirectChildrenCollectionForParentId: return");
		return out_collection;
	};
	gcontext.GetFrameParent = function (rootDoc, frameElement) {
		let element = frameElement;
		while ((element = element.parentElement)) {
			const tagName = element.tagName.toLowerCase();
			if (tagName === "iframe" || tagName === "frame") {
				return element;
			}
		}
		return null;
	};
	gcontext.GetElementClientBoundingCssRectangle = function (rootDoc, element) {
		var htmlRc = element.getBoundingClientRect();
		var out_rc = gcontext.UiRect(htmlRc.left, htmlRc.top, htmlRc.width, htmlRc.height);
		if (!gcontext.IsMainFrame(window)) {
			var parent = gcontext.GetFrameParent(rootDoc, element);
			while (parent) {
				htmlRc = parent.getBoundingClientRect();
				gcontext.TraceMessage("GetElementClientCssRectangle: offsetting with (" + htmlRc.left, htmlRc.top + ")");
				out_rc = out_rc.Offset(htmlRc.left, htmlRc.top);
				parent = gcontext.GetFrameParent(rootDoc, parent);
			}
		}
		return out_rc;
	};
	gcontext.GetElementClientInnerCssRectangle = function (element) {
		var htmlRc = element.getBoundingClientRect();
		return gcontext.UiRect(
			htmlRc.left + element.clientLeft,
			htmlRc.top + element.clientTop,
			element.clientWidth,
			element.clientHeight
		);
	};
	gcontext.GetTextFromSelection = function (selectElement) {
		var out_text = "";
		if (selectElement.size <= 1 && selectElement.multiple === false) {
			if (selectElement.selectedIndex === -1) return out_text;
			out_text = selectElement.item(selectElement.selectedIndex).text;
		}
		return out_text;
	};
	gcontext.GetFullTextFromSelect = function (selectElement) {
		var out_text = "";
		var i;
		var options = selectElement.getElementsByTagName("option");
		for (i = 0; i < options.length; ++i) {
			var option = options.item(i);
			if (option.text && option.text.length > 0) out_text += option.text + "\n";
		}
		return out_text;
	};
	gcontext.GetTextContentFromElement = function (element) {
		var out_text = "";
		var tag = element.tagName.toLowerCase();
		if (tag === "select") out_text = gcontext.GetTextFromSelection(element);
		else out_text = gcontext.TrimWhiteSpaces(element.textContent);
		return out_text;
	};
	gcontext.GetIntCssProperty = function (style, propName, unitSuffix, defaultValue) {
		var out_intValue = defaultValue;
		var propValue = style.getPropertyValue(propName);
		if (propValue != null && propValue.length > 0) {
			if (
				propValue.length > unitSuffix.length &&
				propValue.slice(propValue.length - unitSuffix.length) === unitSuffix
			) {
				var numericPart = propValue.slice(0, propValue.length - unitSuffix.length);
				out_intValue = parseInt(numericPart);
			}
		}
		return out_intValue;
	};
	gcontext.GetElementMarginFromParent = function (htmlWindow, element) {
		var out_marginSize = 0;
		if (element == null || element.parentNode == null) return out_marginSize;
		var elementRect = element.getBoundingClientRect();
		for (
			var ancestor = element.parentNode;
			ancestor != null && ancestor.nodeType === ancestor.ELEMENT_NODE;
			ancestor = ancestor.parentNode
		) {
			var ancestorRect = ancestor.getBoundingClientRect();
			if (ancestorRect.width > elementRect.width && ancestorRect.height > elementRect.height) break;
			if (ancestorRect.width === elementRect.width && ancestorRect.height === elementRect.height) {
				var style = htmlWindow.getComputedStyle(ancestor);
				var borderSize =
					gcontext.GetIntCssProperty(style, "margin-left", "px", 0) +
					gcontext.GetIntCssProperty(style, "margin-right", "px", 0);
				if (borderSize > out_marginSize) out_marginSize = borderSize;
			}
		}
		return out_marginSize;
	};
	gcontext.TextRectInfo = function (text, rect, lineWidth, endsWithWhitespace) {
		return {
			text: text,
			rect: rect,
			lineWidth: lineWidth,
			endsWithWhitespace: endsWithWhitespace,
		};
	};
	gcontext.CreateTextExtractorObject = function (htmlWindow, rootDocument, element, separators) {
		var out_textRectInfos = [];
		var LINE_OVERFLOW_TOLERANCE = 1;
		var m_spanElem = null;
		var m_elemRect = null;
		var m_elemCustomId = "",
			m_parentElemCustomId = "";
		var m_srcStyle = null;
		var m_borderLeft = 0,
			m_borderTop = 0,
			m_borderRight = 0;
		var m_initialOffsetForSpacing = {
			x: 0,
			y: 0,
		};
		var m_crtOffsetForSpacing = {
			x: 0,
			y: 0,
		};
		var m_maxLineRight = 0;
		var m_lineWidth = 0,
			m_lineHeight = 0;
		var m_totalTextHeight = 0;

		function GetNonWhitespaceWordExtentsUsingSpan(word) {
			m_spanElem.textContent = word;
			var rc = m_spanElem.getBoundingClientRect();
			return {
				width: rc.width,
				height: rc.height,
			};
		}
		var DUMMY_BORDER_CHAR = "x";
		var m_dummyBorderCharWidth = 0;

		function GetDummyBorderCharWidth() {
			if (m_dummyBorderCharWidth !== 0) return m_dummyBorderCharWidth;
			m_dummyBorderCharWidth = GetNonWhitespaceWordExtentsUsingSpan(DUMMY_BORDER_CHAR).width;
			return m_dummyBorderCharWidth;
		}

		function GetWordExtentsUsingSpan(word) {
			if (word.length === 0)
				return {
					width: 0,
					height: 0,
				};
			var extraHeading = "";
			var extraTrailing = "";
			var extraHeadingWidth = 0;
			var extraTrailingWidth = 0;
			if (gcontext.IsWhiteSpaceCharacter(word.charAt(0))) {
				extraHeading = DUMMY_BORDER_CHAR;
				extraHeadingWidth = GetDummyBorderCharWidth();
			}
			if (gcontext.IsWhiteSpaceCharacter(word.charAt(word.length - 1))) {
				extraTrailing = DUMMY_BORDER_CHAR;
				extraTrailingWidth = GetDummyBorderCharWidth();
			}
			var wordExt = GetNonWhitespaceWordExtentsUsingSpan(extraHeading + word + extraTrailing);
			return {
				width: wordExt.width - extraHeadingWidth - extraTrailingWidth,
				height: wordExt.height,
			};
		}
		return {
			BeginAccumulateTextRectInfo: function () {
				if (element == null) return false;
				var doc = element.ownerDocument;
				m_srcStyle = htmlWindow.getComputedStyle(element);
				m_spanElem = doc.createElement("span");
				var cssProps = [
					"font-family",
					"font-size",
					"font-size-adjust",
					"font-stretch",
					"font-style",
					"font-variant",
					"font-weight",
					"text-align",
					"text-align-last",
					"text-decoration",
					"text-indent",
					"text-justify",
					"text-overflow",
					"text-shadow",
					"text-transform",
					"text-autospace",
					"text-kashida-space",
					"text-underline-position",
					"direction",
					"zoom",
				];
				for (i = 0; i < cssProps.length; ++i) {
					var propName = cssProps[i];
					var propValue = m_srcStyle.getPropertyValue(propName);
					if (propValue != null && propValue.length > 0) {
						var propPriority = m_srcStyle.getPropertyPriority(propName);
						m_spanElem.style.setProperty(propName, propValue, propPriority);
					}
				}
				m_spanElem.style.setProperty("resize", "both", "");
				m_spanElem.style.setProperty("display", "inline-block", "");
				doc.body.appendChild(m_spanElem);
				m_borderLeft = gcontext.GetIntCssProperty(m_srcStyle, "padding-left", "px", 0);
				m_borderTop = gcontext.GetIntCssProperty(m_srcStyle, "padding-top", "px", 0);
				m_borderRight = gcontext.GetIntCssProperty(m_srcStyle, "padding-right", "px", 0);
				m_elemRect = gcontext.GetElementClientBoundingCssRectangle(rootDocument, element);
				m_elemCustomId = gcontext.GenerateCustomIdForElement(element);
				m_parentElemCustomId = gcontext.GenerateCustomIdForElement(element.parentNode);
				m_initialOffsetForSpacing.x = m_elemRect.left + m_borderLeft;
				m_initialOffsetForSpacing.y = m_elemRect.top + m_borderTop;
				m_maxLineRight = m_elemRect.right - m_borderRight;
				m_crtOffsetForSpacing.x = m_initialOffsetForSpacing.x;
				m_crtOffsetForSpacing.y = m_initialOffsetForSpacing.y;
				m_lineWidth = m_elemRect.right - m_borderRight - (m_elemRect.left + m_borderLeft);
				m_lineHeight = gcontext.GetIntCssProperty(m_srcStyle, "line-height", "px", 0);
				m_totalTextHeight = m_lineHeight;
				gcontext.TraceMessage("BeginAccumulateTextRectInfo: m_lineHeight=" + m_lineHeight);
				gcontext.TraceMessage("BeginAccumulateTextRectInfo: m_maxLineRight=" + m_maxLineRight);
				gcontext.TraceMessage(
					"BeginAccumulateTextRectInfo: m_initialOffsetForSpacing=" +
						gcontext.EnumObjectProps(m_initialOffsetForSpacing, true)
				);
				gcontext.TraceMessage("BeginAccumulateTextRectInfo: m_elemRect=" + m_elemRect.toString());
				gcontext.TraceMessage(
					"BeginAccumulateTextRectInfo: border LTR = (" + m_borderLeft + " " + m_borderTop + " " + m_borderRight + ")"
				);
				return true;
			},
			GetRects: function () {
				return out_textRectInfos;
			},
			EndAccumulateTextRectInfo: function () {
				if (m_srcStyle != null) {
					var i = 0;
					var borderTopCorrection = 0;
					var verticalAlign = m_srcStyle.getPropertyValue("vertical-align");
					if (verticalAlign === "middle") {
						var centeredBorderTop = (m_elemRect.getHeight() - m_totalTextHeight) / 2;
						gcontext.TraceMessage(
							"GetTextBorderTopCorrectionFromCss: totalTextHeight=" +
								m_totalTextHeight +
								" centeredBorderTop=" +
								centeredBorderTop
						);
						borderTopCorrection = centeredBorderTop - m_borderTop;
					} else if (verticalAlign === "baseline" || verticalAlign === "bottom") {
						var bottomAlignedBorderTop = m_elemRect.getHeight() - m_totalTextHeight;
						gcontext.TraceMessage(
							"GetTextBorderTopCorrectionFromCss: totalTextHeight=" +
								m_totalTextHeight +
								" bottomAlignedBorderTop=" +
								bottomAlignedBorderTop
						);
						borderTopCorrection = bottomAlignedBorderTop - m_borderTop;
					}
					if (borderTopCorrection !== 0) {
						for (i = 0; i < out_textRectInfos.length; ++i)
							out_textRectInfos[i].rect = out_textRectInfos[i].rect.Offset(0, borderTopCorrection);
					}
				}
				if (out_textRectInfos.length !== 0) out_textRectInfos[out_textRectInfos.length - 1].endsWithWhitespace = true;
				if (m_spanElem != null) {
					element.ownerDocument.body.removeChild(m_spanElem);
					m_spanElem = null;
				}
				gcontext.TraceMessage("EndAccumulateTextRectInfo: return");
				return out_textRectInfos;
			},
			AdvanceTextOffsets: function (advanceX) {
				var newOffsetX = m_crtOffsetForSpacing.x + advanceX;
				var lineOverflow = newOffsetX - m_maxLineRight;
				if (lineOverflow >= LINE_OVERFLOW_TOLERANCE) {
					m_crtOffsetForSpacing.x = m_initialOffsetForSpacing.x;
					m_crtOffsetForSpacing.y += m_lineHeight;
					m_totalTextHeight += m_lineHeight;
				} else m_crtOffsetForSpacing.x = newOffsetX;
			},
			AccumulateTextRectInfo: function (text) {
				if (text == null || text.length === 0) return false;
				if (m_spanElem == null) return false;
				var m_crtWordForSpacing = "",
					m_crtWord = "";
				var CharType = {
					WORD: 0,
					SEPARATOR: 1,
					WHITESPACE: 2,
				};

				function GetCharType(ch) {
					if (gcontext.IsWhiteSpaceCharacter(ch)) return CharType.WHITESPACE;
					if (separators.indexOf(ch) !== -1) return CharType.SEPARATOR;
					return CharType.WORD;
				}

				function RectContains(rect, point) {
					return point.x >= rect.left && point.x < rect.right && point.y >= rect.top && point.y < rect.bottom;
				}

				function CheckNewLineAndUpdateSpacingOffsets() {
					var out_wordExtForSpacing = GetWordExtentsUsingSpan(m_crtWordForSpacing);
					if (m_lineHeight === 0 && out_wordExtForSpacing.height > m_lineHeight) {
						m_lineHeight = out_wordExtForSpacing.height;
						m_totalTextHeight = m_lineHeight;
						gcontext.TraceMessage(
							"AccumulateTextRectInfo::CheckNewLineAndUpdateSpacingOffsets: m_lineHeight=" + m_lineHeight
						);
					}
					var wordExt = GetWordExtentsUsingSpan(m_crtWord);
					var checkOverlappingElements = true;
					var INNER_TOLERANCE = 2;
					if (wordExt.width < 2 * INNER_TOLERANCE || wordExt.height < 2 * INNER_TOLERANCE) {
						checkOverlappingElements = false;
					}
					while (checkOverlappingElements === true) {
						checkOverlappingElements = false;
						if (m_crtWord.length > 0) {
							var points = [
								{
									x: m_crtOffsetForSpacing.x + wordExt.width / 2,
									y: m_crtOffsetForSpacing.y + wordExt.height / 2,
									name: "middle",
								},
								{
									x: m_crtOffsetForSpacing.x + INNER_TOLERANCE,
									y: m_crtOffsetForSpacing.y + INNER_TOLERANCE,
									name: "left-top",
								},
								{
									x: m_crtOffsetForSpacing.x + wordExt.width - INNER_TOLERANCE,
									y: m_crtOffsetForSpacing.y + INNER_TOLERANCE,
									name: "right-top",
								},
								{
									x: m_crtOffsetForSpacing.x + INNER_TOLERANCE,
									y: m_crtOffsetForSpacing.y + wordExt.height - INNER_TOLERANCE,
									name: "left-bottom",
								},
								{
									x: m_crtOffsetForSpacing.x + wordExt.width - INNER_TOLERANCE,
									y: m_crtOffsetForSpacing.y + wordExt.height - INNER_TOLERANCE,
									name: "right-bottom",
								},
							];
							for (var i = 0; i < points.length; ++i) {
								var crtPoint = points[i];
								if (crtPoint.x <= m_maxLineRight) {
									var elemAtPoint = element.ownerDocument.elementFromPoint(crtPoint.x, crtPoint.y);
									if (elemAtPoint != null) {
										var htmlRectAtPoint = elemAtPoint.getBoundingClientRect();
										var customIdAtPoint = gcontext.GetCustomIdForElement(elemAtPoint);
										if (
											htmlRectAtPoint != null &&
											htmlRectAtPoint.left > -5 &&
											htmlRectAtPoint.top > -5 &&
											htmlRectAtPoint.width > 0 &&
											htmlRectAtPoint.height > 0 &&
											RectContains(htmlRectAtPoint, crtPoint) &&
											customIdAtPoint !== m_elemCustomId &&
											customIdAtPoint !== m_parentElemCustomId
										) {
											var spacingGapX = gcontext.GetElementMarginFromParent(htmlWindow, elemAtPoint);
											gcontext.TraceMessage(
												"AccumulateTextRectInfo::CheckNewLineAndUpdateSpacingOffsets: crtWord=[" +
													m_crtWord +
													"]: there is an element with tag [" +
													elemAtPoint.tagName +
													"]"
											);
											m_crtOffsetForSpacing.x = htmlRectAtPoint.right + spacingGapX;
											checkOverlappingElements = true;
											break;
										}
									}
								}
							}
						}
						var lineOverflow = m_crtOffsetForSpacing.x + wordExt.width - m_maxLineRight;
						if (lineOverflow >= LINE_OVERFLOW_TOLERANCE) {
							gcontext.TraceMessage(
								"AccumulateTextRectInfo::CheckNewLineAndUpdateSpacingOffsets: [" +
									m_crtWord +
									"] overflows the right margin by " +
									lineOverflow +
									" pixels"
							);
							m_crtOffsetForSpacing.x = m_initialOffsetForSpacing.x;
							m_crtOffsetForSpacing.y += m_lineHeight;
							gcontext.TraceMessage(
								"AccumulateTextRectInfo::CheckNewLineAndUpdateSpacingOffsets: m_crtOffsetForSpacing after correction " +
									gcontext.EnumObjectProps(m_crtOffsetForSpacing, true)
							);
							m_totalTextHeight += m_lineHeight;
							if (m_crtOffsetForSpacing.y >= m_elemRect.bottom) {
								gcontext.TraceMessage(
									"AccumulateTextRectInfo::CheckNewLineAndUpdateSpacingOffsets: m_crtOffsetForSpacing.y=" +
										m_crtOffsetForSpacing.y +
										" overflows the bottom side " +
										m_elemRect.bottom +
										" of the element rectangle"
								);
								break;
							}
							checkOverlappingElements = true;
						}
					}
					return out_wordExtForSpacing;
				}
				if (separators == null || separators.length === 0) separators = "`;:'\",.!?/\\|";
				var i = 0;
				var parserState = CharType.WORD;
				var crtXOffsetInWord = 0;
				for (i = 0; i < text.length; ++i) {
					var ch = text.charAt(i);
					var chType = GetCharType(ch);
					if (parserState === CharType.WORD) {
						if (chType === CharType.SEPARATOR || chType === CharType.WHITESPACE) {
							if (m_crtWord.length > 0) {
								var wordExt = CheckNewLineAndUpdateSpacingOffsets();
								var wordInfo = gcontext.TextRectInfo(
									m_crtWord,
									gcontext.UiRect(m_crtOffsetForSpacing.x, m_crtOffsetForSpacing.y, wordExt.width, wordExt.height),
									m_lineWidth,
									chType === CharType.WHITESPACE
								);
								out_textRectInfos.push(wordInfo);
								gcontext.TraceMessage(
									"AccumulateTextRectInfo: adding word [" + wordInfo.text + "] rect " + wordInfo.rect.toString()
								);
								m_crtWordForSpacing += ch;
								m_crtWord = ch.toString();
								crtXOffsetInWord = wordExt.width;
								parserState = chType;
							} else {
								m_crtWordForSpacing = m_crtWord = ch.toString();
								crtXOffsetInWord = 0;
								parserState = chType;
							}
						} else {
							m_crtWordForSpacing += ch;
							m_crtWord += ch;
						}
					} else if (parserState === CharType.SEPARATOR) {
						if (chType === CharType.WORD || chType === CharType.WHITESPACE) {
							var spacingExt = CheckNewLineAndUpdateSpacingOffsets();
							var wordExt = GetWordExtentsUsingSpan(m_crtWord);
							var wordInfo = gcontext.TextRectInfo(
								m_crtWord,
								gcontext.UiRect(
									m_crtOffsetForSpacing.x + crtXOffsetInWord,
									m_crtOffsetForSpacing.y,
									wordExt.width,
									wordExt.height
								),
								m_lineWidth,
								chType === CharType.WHITESPACE
							);
							out_textRectInfos.push(wordInfo);
							m_crtWordForSpacing = m_crtWord = ch.toString();
							m_crtOffsetForSpacing.x += spacingExt.width;
							crtXOffsetInWord = 0;
							parserState = chType;
						} else {
							CheckNewLineAndUpdateSpacingOffsets();
							var wordExt = GetWordExtentsUsingSpan(m_crtWord);
							var wordInfo = gcontext.TextRectInfo(
								m_crtWord,
								gcontext.UiRect(
									m_crtOffsetForSpacing.x + crtXOffsetInWord,
									m_crtOffsetForSpacing.y,
									wordExt.width,
									wordExt.height
								),
								m_lineWidth,
								false
							);
							out_textRectInfos.push(wordInfo);
							m_crtWordForSpacing += ch;
							m_crtWord = ch.toString();
							crtXOffsetInWord += wordExt.width;
						}
					} else if (parserState === CharType.WHITESPACE) {
						if (chType === CharType.WORD || chType === CharType.SEPARATOR) {
							var spacingExt = CheckNewLineAndUpdateSpacingOffsets();
							m_crtWordForSpacing = m_crtWord = ch.toString();
							m_crtOffsetForSpacing.x += spacingExt.width;
							crtXOffsetInWord = 0;
							parserState = chType;
						} else {
							CheckNewLineAndUpdateSpacingOffsets();
							m_crtWordForSpacing += ch;
							m_crtWord = "";
							crtXOffsetInWord = 0;
						}
					}
				}
				var spacingExt = CheckNewLineAndUpdateSpacingOffsets();
				if (parserState !== CharType.WHITESPACE && m_crtWord.length > 0) {
					var wordExt = GetWordExtentsUsingSpan(m_crtWord);
					var wordInfo = gcontext.TextRectInfo(
						m_crtWord,
						gcontext.UiRect(
							m_crtOffsetForSpacing.x + crtXOffsetInWord,
							m_crtOffsetForSpacing.y,
							wordExt.width,
							wordExt.height
						),
						m_lineWidth,
						false
					);
					out_textRectInfos.push(wordInfo);
					gcontext.TraceMessage(
						"AccumulateTextRectInfo: adding last word [" + wordInfo.text + "] rect " + wordInfo.rect.toString()
					);
				}
				m_crtOffsetForSpacing.x += spacingExt.width;
				return true;
			},
		};
	};
	gcontext.FormattedTextInfoResult = function () {
		function TextLine(lineWidth) {
			return {
				textInfos: [],
				lineWidth: lineWidth,
				AddTextInfo: function (textInfo) {
					this.textInfos.push(textInfo);
				},
				AddTextInfoArray: function (textInfoArray) {
					this.textInfos = this.textInfos.concat(textInfoArray);
				},
				PushTextInfosAtTheStart: function (additionalTextInfos) {
					var out_overflowingWordsAtTheEnd = [];
					if (additionalTextInfos.length === 0 || this.textInfos.length === 0) return out_overflowingWordsAtTheEnd;
					gcontext.TraceMessage("PushTextInfosAtTheStart: additionalTextInfos[0]=" + additionalTextInfos[0].text);
					gcontext.TraceMessage("PushTextInfosAtTheStart: this.textInfos[0]=" + this.textInfos[0].text);
					var i = 0;
					var totalWidth = additionalTextInfos[0].rect.getWidth();
					for (i = 1; i < additionalTextInfos.length; ++i) totalWidth += additionalTextInfos[i].rect.getWidth();
					gcontext.TraceMessage("PushTextInfosAtTheStart: totalWidth=" + totalWidth);
					var startTrimIdx = -1;
					for (i = 0; i < this.textInfos.length; ++i) {
						this.textInfos[i].rect = this.textInfos[i].rect.Offset(totalWidth, 0);
						if (this.textInfos[i].rect.right - this.textInfos[0].rect.left > lineWidth) {
							startTrimIdx = i;
							break;
						}
					}
					if (startTrimIdx !== -1)
						out_overflowingWordsAtTheEnd = this.textInfos.splice(startTrimIdx, this.textInfos.length - startTrimIdx);
					this.textInfos = additionalTextInfos.concat(this.textInfos);
					return out_overflowingWordsAtTheEnd;
				},
			};
		}
		return {
			lines: [],
			AddLine: function (lineWidth) {
				this.lines.push(TextLine(lineWidth));
			},
			AddTextInfo: function (textInfo) {
				if (this.lines.length === 0) return;
				this.lines[this.lines.length - 1].AddTextInfo(textInfo);
			},
			AddTextInfoArray: function (textInfoArray) {
				if (this.lines.length === 0) return;
				this.lines[this.lines.length - 1].AddTextInfoArray(textInfoArray);
			},
			ShiftTextInfosAndReformat: function (lineIdxToShift, numWordsToShift) {
				if (lineIdxToShift >= this.lines.length || numWordsToShift <= 0) return;
				var line = this.lines[lineIdxToShift];
				if (numWordsToShift > line.textInfos.length) return;
				var wordsToShift = line.textInfos.splice(line.textInfos.length - numWordsToShift, numWordsToShift);
				var i = 0,
					j = 0;
				for (i = lineIdxToShift + 1; i < this.lines.length; ++i) {
					line = this.lines[i];
					if (line.textInfos.length !== 0) {
						var shiftWidth = -(wordsToShift[0].rect.left - line.textInfos[0].rect.left);
						var shiftHeight = -(wordsToShift[0].rect.top - line.textInfos[0].rect.top);
						gcontext.TraceMessage(
							"ShiftTextInfosAndReformat: shiftWidth=" + shiftWidth + " shiftHeight=" + shiftHeight
						);
						for (j = 0; j < wordsToShift.length; ++j)
							wordsToShift[j].rect = wordsToShift[j].rect.Offset(shiftWidth, shiftHeight);
					}
					wordsToShift = line.PushTextInfosAtTheStart(wordsToShift);
					if (wordsToShift.length === 0) break;
				}
				if (wordsToShift.length !== 0) {
					line = this.lines[this.lines.length - 1];
					if (line.textInfos.length !== 0) {
						var shiftWidth = -(wordsToShift[0].left - line.textInfos[0].left);
						var shiftHeight = -(wordsToShift[0].top - line.textInfos[0].top);
						for (j = 0; j < wordsToShift.length; ++j)
							wordsToShift[j].rect = wordsToShift[j].rect.Offset(shiftWidth, shiftHeight);
					}
					this.AddLine(line.lineWidth);
					this.AddTextInfoArray(wordsToShift);
				}
			},
			GetFilteredText: function (filterRect) {
				var out_text = "";
				var out_textRectInfo = [];
				var lineIdx = 0;
				for (lineIdx = 0; lineIdx < this.lines.length; ++lineIdx) {
					var crtLine = this.lines[lineIdx];
					var textInfoIdx = 0;
					for (textInfoIdx = 0; textInfoIdx < crtLine.textInfos.length; ++textInfoIdx) {
						textInfo = crtLine.textInfos[textInfoIdx];
						if (filterRect.Intersects(textInfo.rect)) {
							out_textRectInfo.push(textInfo);
							out_text += textInfo.text;
							if (textInfo.endsWithWhitespace) out_text += " ";
						}
					}
					if (lineIdx !== this.lines.length - 1) out_text += "\r\n";
				}
				return {
					text: out_text,
					textRectInfo: out_textRectInfo,
				};
			},
		};
	};
	gcontext.FormatTextRectInfoArray = function (textRectInfo, newLineTolerance, runStopwatch) {
		var out_formattedTextInfo = gcontext.FormattedTextInfoResult();
		textRectInfo.sort(function (e1, e2) {
			var rc1 = e1.rect;
			var rc2 = e2.rect;
			if (rc1.top >= rc2.bottom - newLineTolerance) return 1;
			if (rc2.top >= rc1.bottom - newLineTolerance) return -1;
			if (rc1.left >= rc2.right - newLineTolerance) return 1;
			if (rc2.left >= rc1.right - newLineTolerance) return -1;
			return 0;
		});
		var timeoutCheckCounter = 0;
		var i = 0,
			j = 0,
			startLineIdx = 0;
		while (startLineIdx < textRectInfo.length) {
			if (timeoutCheckCounter >= 300) {
				if (runStopwatch.TimeoutElapsed()) break;
				timeoutCheckCounter = 0;
			}
			var startLineInfo = textRectInfo[startLineIdx];
			var maxLineWidth = startLineInfo.lineWidth;
			var endLineIdx = startLineIdx + 1;
			while (endLineIdx < textRectInfo.length) {
				var endLineInfo = textRectInfo[endLineIdx];
				if (endLineInfo.rect.top >= startLineInfo.rect.bottom - newLineTolerance) break;
				if (endLineInfo.lineWidth > maxLineWidth) maxLineWidth = endLineInfo.lineWidth;
				++endLineIdx;
			}
			out_formattedTextInfo.AddLine(maxLineWidth);
			for (i = startLineIdx; i < endLineIdx; ++i) {
				var srcTextInfo = textRectInfo[i];
				var destTextInfo = gcontext.TextRectInfo(
					srcTextInfo.text,
					srcTextInfo.rect,
					maxLineWidth,
					srcTextInfo.endsWithWhitespace
				);
				timeoutCheckCounter += 1;
				out_formattedTextInfo.AddTextInfo(destTextInfo);
			}
			startLineIdx = endLineIdx;
		}
		for (i = 0; i < out_formattedTextInfo.lines.length - 1; ++i) {
			if (timeoutCheckCounter >= 100) {
				if (runStopwatch.TimeoutElapsed()) break;
				timeoutCheckCounter = 0;
			}
			var crtLine = out_formattedTextInfo.lines[i];
			if (crtLine.textInfos.length !== 0) {
				var lastTextWithSpaceIdx = crtLine.textInfos.length - 1;
				while (lastTextWithSpaceIdx >= 0) {
					if (crtLine.textInfos[lastTextWithSpaceIdx].endsWithWhitespace === true) break;
					--lastTextWithSpaceIdx;
				}
				if (lastTextWithSpaceIdx >= 0 && lastTextWithSpaceIdx < crtLine.textInfos.length - 1) {
					var numWordsToShift = crtLine.textInfos.length - lastTextWithSpaceIdx - 1;
					gcontext.TraceMessage(
						"FormatTextRectInfoArray: starting to shift with word [" +
							crtLine.textInfos[lastTextWithSpaceIdx + 1].text +
							"]"
					);
					timeoutCheckCounter += 1;
					out_formattedTextInfo.ShiftTextInfosAndReformat(i, numWordsToShift);
				}
			}
		}
		return out_formattedTextInfo;
	};
	gcontext.GetSelectedItems = function (selectElement, getAll) {
		getAll = getAll !== 0;
		if (gcontext.SapFioriIsElementSelectable(selectElement)) {
			return gcontext.SapFioriGetSelectedItems(selectElement, getAll);
		}
		var out_selectedItems = [];
		var options = selectElement.getElementsByTagName("option");
		for (var i = 0; i < options.length; ++i) {
			var option = options.item(i);
			if (option.text != null) {
				if (getAll === true || (getAll === false && option.selected)) {
					out_selectedItems.push(option.text);
				}
			}
		}
		return out_selectedItems;
	};
	gcontext.AddHiddenSpansForInputValues = function (htmlDoc) {
		var out_addedNodes = [];
		var i;
		var collection = htmlDoc.getElementsByTagName("input");
		for (i = 0; i < collection.length; ++i) {
			var elem = collection.item(i);
			var type = elem.type;
			var value = elem.value;
			if (type !== "hidden" && type !== "checkbox" && type !== "radio" && type !== "image" && value != null) {
				var tempElem = htmlDoc.createElement("span");
				tempElem.innerText = value;
				if (tempElem.style) tempElem.style.display = "none";
				if (elem.parentNode) {
					var newNode = elem.parentNode.insertBefore(tempElem, elem);
					if (newNode) out_addedNodes.push(newNode);
				}
			}
		}
		collection = htmlDoc.getElementsByTagName("textarea");
		for (i = 0; i < collection.length; ++i) {
			var elem = collection.item(i);
			var type = elem.type;
			var value = elem.value;
			if (value != null) {
				var tempElem = htmlDoc.createElement("span");
				tempElem.innerText = value;
				if (tempElem.style) tempElem.style.display = "none";
				if (elem.parentNode) {
					var newNode = elem.parentNode.insertBefore(tempElem, elem);
					if (newNode) out_addedNodes.push(newNode);
				}
			}
		}
		return out_addedNodes;
	};

	gcontext.SendKeysToHtmlElement = function (targetElement, htmlWindow, text, append, delayBetweenKeys, done) {
		gcontext.RaiseUiEvent(targetElement, "focus", htmlWindow);
		var tagName = targetElement.tagName.toLowerCase();
		var setValue = (tagName === "input" || tagName === "textarea") && targetElement.value !== undefined;
		var isAppendingValue = append;
		var upperCaseText = text.toUpperCase();

		function typeChar(index) {
			var keyCode = upperCaseText.charCodeAt(index);
			var charCode = text.charCodeAt(index);
			var letter = text[index];
			if (gcontext.RaiseKeyEvent(targetElement, "keydown", htmlWindow, keyCode, 0, letter)) {
				gcontext.RaiseKeyEvent(targetElement, "keypress", htmlWindow, charCode, charCode, letter);
			}
			gcontext.RaiseInputEvent(targetElement, "beforeinput", "insertText", letter, htmlWindow);
			gcontext.RaiseTextEvent(targetElement, "textInput", letter, htmlWindow);
			var lastValue = targetElement.value;
			if (setValue === true) {
				if (isAppendingValue) {
					targetElement.value = targetElement.value + letter;
				} else {
					targetElement.value = letter;
				}
			}
			isAppendingValue = N_TRUE;
			gcontext.RaiseInputEvent(targetElement, "input", "insertText", letter, htmlWindow, lastValue);
			gcontext.RaiseKeyEvent(targetElement, "keyup", htmlWindow, keyCode, 0, letter);
		}

		function finalizeTyping(success) {
			if (setValue === true) {
			} else if (targetElement.isContentEditable) {
				if (append) {
					targetElement.innerText = targetElement.innerText + text;
				} else {
					targetElement.innerText = text;
				}
			}
			gcontext.RaiseUiEvent(targetElement, "change", htmlWindow);

			if (done) {
				done(success);
			}
		}

		const delayConfig = gcontext.GetValidDelayBetweenEvents(delayBetweenKeys);
		if (!delayConfig.valid) {
			try {
				for (var i = 0; i < text.length; ++i) {
					typeChar(i);
				}
				finalizeTyping(true);
			} catch (e) {
				gcontext.TraceError("Error while sending keys: " + e.message);
				finalizeTyping(false);
			}
		} else {
			let currentIndex = 0;
			function startTypingChar() {
				let index = currentIndex++;
				if (index < text.length) {
					setTimeout(() => {
						try {
							typeChar(index);
							startTypingChar();
						} catch (e) {
							gcontext.TraceError("Error while sending keys: " + e.message);
							finalizeTyping(false);
						}
					}, gcontext.RandomInt(delayConfig.from, delayConfig.to));
				} else {
					finalizeTyping(true);
				}
			}

			startTypingChar();
		}
	};

	gcontext.ClearInputElement = function (targetElement, htmlWindow, textLength, delayBetweenKeys, done) {
		gcontext.RaiseUiEvent(targetElement, "focus", htmlWindow);
		var tagName = targetElement.tagName.toLowerCase();
		var setValue = (tagName === "input" || tagName === "textarea") && targetElement.value !== undefined;

		function typeChar() {
			const letter = "Backspace";
			gcontext.RaiseKeyEvent(targetElement, "keydown", htmlWindow, 8, 0, letter);
			gcontext.RaiseInputEvent(targetElement, "beforeinput", "deleteContentBackward", letter, htmlWindow);
			gcontext.RaiseTextEvent(targetElement, "textInput", letter, htmlWindow);
			const lastValue = targetElement.value;
			if (setValue) {
				targetElement.value = lastValue.substring(0, lastValue.length - 1);
			}
			gcontext.RaiseInputEvent(targetElement, "input", "deleteContentBackward", letter, htmlWindow, lastValue);
			gcontext.RaiseKeyEvent(targetElement, "keyup", htmlWindow, 8, 0, letter);
		}

		function finalizeTyping(success) {
			if (setValue) {
			} else if (targetElement.isContentEditable) {
				targetElement.innerText = "";
			}
			gcontext.RaiseUiEvent(targetElement, "change", htmlWindow);

			if (done) {
				done(success);
			}
		}

		const delayConfig = gcontext.GetValidDelayBetweenEvents(delayBetweenKeys);
		if (!delayConfig.valid) {
			try {
				for (let i = 0; i < textLength; ++i) {
					typeChar();
				}
				finalizeTyping(true);
			} catch (e) {
				gcontext.TraceError("Error while deleting input: " + e.message);
				finalizeTyping(false);
			}
		} else {
			let currentIndex = 0;
			function startTypingChar() {
				let index = currentIndex++;
				if (index < textLength) {
					setTimeout(() => {
						try {
							typeChar();
							startTypingChar();
						} catch (e) {
							gcontext.TraceError("Error while deleting input: " + e.message);
							finalizeTyping(false);
						}
					}, gcontext.RandomInt(delayConfig.from, delayConfig.to));
				} else {
					finalizeTyping(true);
				}
			}

			startTypingChar();
		}
	};

	gcontext.RaiseMouseEvent = function (
		type,
		element,
		view,
		button,
		screenX,
		screenY,
		clientX,
		clientY,
		ctrlOn,
		altOn,
		shiftOn
	) {
		var doc = element.ownerDocument;
		var canBubble = true;
		var cancelable = true;
		var detail = 1;
		var relatedTarget = null;

		try {
			var event = doc.createEvent("MouseEvents");
			if (event == null) return false;
			event.initMouseEvent(
				type,
				canBubble,
				cancelable,
				view,
				detail,
				screenX,
				screenY,
				clientX,
				clientY,
				ctrlOn,
				altOn,
				shiftOn,
				false,
				button,
				relatedTarget
			);
			element.dispatchEvent(event);
			return true;
		} catch (err) {
			gcontext.TraceMessage("RaiseMouseEvent exception: " + err.message);
			return false;
		}
	};

	gcontext.RaiseClickEvent = function (
		element,
		view,
		button,
		clickType,
		screenX,
		screenY,
		clientX,
		clientY,
		ctrlOn,
		altOn,
		shiftOn,
		wait,
		delayBetweenEvents,
		done
	) {
		if (view == null || element == null) {
			done(false);
			return;
		}
		var doc = element.ownerDocument;
		if (doc == null) {
			done(false);
			return;
		}
		var types = [];
		if (button == 2 && clickType == gcontext.HTML_CLICK_SINGLE) {
			types = ["mouseover", "mousemove", "mousedown", "mouseup", "contextmenu"];
		} else if (clickType === gcontext.HTML_CLICK_SINGLE) {
			types = ["mouseover", "mousemove", "mousedown", "mouseup", "click"];
		} else if (clickType === gcontext.HTML_CLICK_DOUBLE) {
			types = ["mouseover", "mousemove", "mousedown", "mouseup", "click", "mousedown", "mouseup", "click", "dblclick"];
		} else if (clickType === gcontext.HTML_CLICK_HOVERONLY) {
			types = ["mouseover", "mouseenter", "mousemove"];
		} else if (clickType === gcontext.HTML_CLICK_DOWN) {
			types = ["mouseover", "mousemove", "mousedown"];
		} else if (clickType === gcontext.HTML_CLICK_UP) {
			types = ["mouseover", "mousemove", "mouseup"];
		}

		function raiseEvent(index) {
			return gcontext.RaiseMouseEvent(
				types[index],
				element,
				view,
				button,
				screenX,
				screenY,
				clientX,
				clientY,
				ctrlOn,
				altOn,
				shiftOn
			);
		}

		function raiseEventsImmediately() {
			for (var i = 0; i < types.length; ++i) {
				if (!raiseEvent(i)) {
					done(false);
					return;
				}
			}
			done(true);
		}

		const delayConfig = gcontext.GetValidDelayBetweenEvents(delayBetweenKeys);

		let currentIndex = 0;
		function raiseEventsDelay() {
			let index = currentIndex++;
			if (index < types.length) {
				setTimeout(() => {
					if (!raiseEvent(index)) {
						done(false);
					} else {
						raiseEventsDelay();
					}
				}, gcontext.RandomInt(delayConfig.from, delayConfig.to));
			} else {
				done(true);
			}
		}

		if (!delayConfig.valid) {
			if (wait) {
				raiseEventsImmediately();
			} else {
				setTimeout(raiseEventsImmediately);
			}
		} else {
			raiseEventsDelay();
		}
	};

	gcontext.RaiseKeyEvent = function (element, type, view, keyCode, charCode, charStr) {
		if (view == null || element == null) {
			return true;
		}
		var canBubble = true;
		var cancelable = true;
		try {
			var event = new KeyboardEvent(type, {
				bubbles: canBubble,
				cancelable: cancelable,
				view: view,
				key: charStr,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				charCode: charCode,
				keyCode: keyCode,
			});
			return element.dispatchEvent(event);
		} catch (err) {
			gcontext.TraceMessage("RaiseKeyEvent exception: " + err.message);
			return false;
		}
	};
	gcontext.RaiseUiEvent = function (element, type, view) {
		if (view == null || element == null) return false;
		var doc = element.ownerDocument;
		if (doc == null) return false;
		var canBubble = true;
		var cancelable = false;
		var detail = 1;
		var event = doc.createEvent("UIEvents");
		if (event == null) return false;
		try {
			event.initUIEvent(type, canBubble, cancelable, view, detail);
			element.dispatchEvent(event);
		} catch (err) {
			gcontext.TraceMessage("RaiseUiEvent exception: " + err.message);
		}
		return true;
	};
	gcontext.RaiseInputEvent = function (element, type, inputType, data, view, lastValue) {
		if (view == null || element == null) return false;
		try {
			var event = new InputEvent(type, {
				inputType: inputType,
				data: data,
			});
			try {
				event.simulated = true;
				var tracker = element._valueTracker;
				if (lastValue && tracker) {
					tracker.setValue(lastValue);
				}
			} catch (err) {
				gcontext.TraceMessage("RaiseInputEvent exception: " + err.message);
			}
			element.dispatchEvent(event);
		} catch (err) {
			gcontext.TraceMessage("RaiseInputEvent exception: " + err.message);
		}
		return true;
	};
	gcontext.RaiseTextEvent = function (element, type, data, view) {
		if (view == null || element == null) return false;
		var doc = element.ownerDocument;
		if (doc == null) return false;
		var bubbles = true;
		var cancelable = true;
		var detail = 0;
		var event = doc.createEvent("TextEvent");
		try {
			event.initTextEvent(type, bubbles, cancelable, view, data, null, null);
			element.dispatchEvent(event);
		} catch (err) {
			gcontext.TraceMessage("RaiseTextEvent exception: " + err.message);
		}
		return true;
	};
	gcontext.getCssSelector = function (e) {
		var cssSel = "";
		while (true) {
			var t = e.tagName.toLowerCase();
			t = t.replace(/:/g, "\\:");
			if (cssSel === "") {
				cssSel = t;
			} else {
				cssSel = t + ">" + cssSel;
			}
			if (t === "body") {
				break;
			}
			var p = e.parentElement;
			if (p === null) {
				break;
			}
			e = p;
		}
		return cssSel;
	};
	gcontext.getBetterCssSelector = function (node) {
		// phase 1: generation
		var path = [];
		while (node) {
			name = node.localName;
			if (!name) break;
			name = name.toLowerCase();

			if (node.id && node.id !== "") {
				path.unshift("#" + node.id);
				break;
			}

			var parent = node.parentElement;
			if (!parent) break;
			if (node.classList.length > 0) {
				for (var i = 0; i < node.classList.length; i++) {
					var className = node.classList[i];
					var sameClassSiblings = [].filter.call(parent.children, function (e) {
						return [].indexOf.call(e.classList, className) > 0;
					});
					if (sameClassSiblings.length == 1) {
						name = "." + className;
						break;
					}
				}
			} else {
				var sameTagSiblings = [].filter.call(parent.children, function (e) {
					return e.localName.toLowerCase() == name;
				});
				if (sameTagSiblings.length > 1) {
					allSiblings = parent.children;
					var index = [].indexOf.call(allSiblings, node) + 1;
					if (index > 1) {
						name += ":nth-child(" + index + ")";
					}
				}
			}

			path.unshift(name);
			node = parent;
		}

		// phase 2: simplification
		var results = 0,
			tempPath,
			origPath = path.slice(0);
		for (var i = path.length - 1; i >= 0; i--) {
			// tempPath = path[i] + (tempPath ? '>' + tempPath : '');
			tempPath = path.slice(i).join(" ");
			var newResults = document.querySelectorAll(tempPath).length;
			if (newResults == results) {
				path.splice(i, 1);
			} else {
				results = newResults;
			}
		}
		// simplification failed
		if (results != 1) {
			path = origPath;
		}

		return path.join(" > ");
	};
	gcontext.ElementIsFrame = function (e) {
		var out_isFrame = N_FALSE;
		if (e && e.tagName) {
			var tagName = e.tagName.toLowerCase();
			if (tagName === "frame" || tagName === "iframe") out_isFrame = N_TRUE;
		}
		return out_isFrame;
	};
	gcontext.IsMainFrame = function (frameWindow) {
		return frameWindow.parent === frameWindow || frameWindow.parent === null;
	};
	gcontext.GetCheckedAttribute = function (elem) {
		var targetElement = gcontext.TryGetCheckableFromElement(elem);
		var type = gcontext.TryGetAttributeLowercase(targetElement, "type");
		if (type === "checkbox" || type === "radio") {
			return targetElement.checked;
		} else if (gcontext.SapFioriIsElementCheckable(elem)) {
			return gcontext.SapFioriGetChecked(elem);
		}
		return null;
	};
	gcontext.TryGetCheckableFromElement = function (elem) {
		var targetElement = elem;
		var tagName = gcontext.TryGetAttributeLowercase(elem, "tagName");
		if (tagName === "label") {
			var forId = elem.htmlFor;
			if (forId != null && forId.length !== 0) {
				var labelTarget = elem.ownerDocument.getElementById(forId);
				var type = gcontext.TryGetAttributeLowercase(labelTarget, "type");
				if ((type === "checkbox" || type === "radio") && labelTarget.checked != null) {
					targetElement = labelTarget;
				}
			}
		}
		return targetElement;
	};
	gcontext.TryGetAttributeLowercase = function (target, property) {
		if (target == undefined || target[property] == undefined) {
			return undefined;
		}
		return target[property].toLowerCase();
	};
	gcontext.ForEachAncestor = function (targetElement, onEachAncestorCb) {
		if (targetElement == null) {
			return;
		}
		var crtElement = targetElement.parentElement;
		while (crtElement != null) {
			if (!onEachAncestorCb(crtElement)) {
				break;
			}
			crtElement = crtElement.parentElement;
		}
	};
	gcontext.HtmlElementToString = function (elem) {
		if (elem == null) {
			return "<null element>";
		}
		var maxInnertextLen = 30;
		var innerText = gcontext.GetAttributeValue(elem, "innertextshort");
		innertext = gcontext.TrimWhiteSpaces(innerText);
		if (innerText.length > maxInnertextLen) {
			innerText = innerText.slice(0, maxInnertextLen) + "...";
		}
		var className = gcontext.GetAttributeValue(elem, "class");
		var htmlId = gcontext.GetAttributeValue(elem, "id");
		return (
			"<" +
			elem.tagName +
			(innerText !== "" ? " innertext='" + innerText + "'" : "") +
			(className !== "" ? " class='" + className + "'" : "") +
			(htmlId !== "" ? " id='" + htmlId + "'" : "") +
			">"
		);
	};
	gcontext.GetUniqueElementsFromArray = function (arr) {
		var uniquenessFilter = function (value, index, self) {
			return self.indexOf(value) === index;
		};
		return arr.filter(uniquenessFilter);
	};

	gcontext.getElementText = function (elem) {
		let node;
		let ret = "";
		let i = 0;
		const nodeType = elem.nodeType;

		if (!nodeType) {
			// If no nodeType, this is expected to be an array
			while ((node = elem[i++])) {
				// Do not traverse comment nodes
				if (node.nodeType !== Node.COMMENT_NODE) ret += gcontext.getElementText(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			return elem.textContent;
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		}

		return ret;
	};

	gcontext.getAttributes = function (element) {
		const attributeNames = element.getAttributeNames();
		const ret = {};
		for (const attributeName of attributeNames) {
			const value = element.getAttribute(attributeName);
			ret[attributeName] = value;
		}
		return ret;
	};

	gcontext.simulateLeftClick = function (
		rootDocument,
		rootWindow,
		targetElement,
		windowLeft,
		windowTop,
		delayBetweenEvents,
		done
	) {
		const cssRect = gcontext.GetElementClientBoundingCssRectangle(rootDocument, targetElement);
		const clientRect = gcontext.CssToClientRect(cssRect, rootWindow.devicePixelRatio);
		const clientX = clientRect.left + gcontext.CLICK_OFFSET_X;
		const clientY = clientRect.top + gcontext.CLICK_OFFSET_Y;
		const screenX = clientX + windowLeft;
		const screenY = clientY + windowTop;
		gcontext.RaiseClickEvent(
			targetElement,
			rootWindow,
			gcontext.HTML_LEFT_BUTTON,
			gcontext.HTML_CLICK_SINGLE,
			screenX,
			screenY,
			clientX,
			clientY,
			false,
			false,
			false,
			true,
			delayBetweenEvents,
			done
		);
	};
});
