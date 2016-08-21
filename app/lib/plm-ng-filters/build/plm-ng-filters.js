System.registerModule("com/autodesk/UTC.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/UTC.filter.js";
  var $__default = function(val) {
    if (!angular.isDefined(val)) {
      return '';
    }
    var date = new Date(val);
    if (isNaN(date.getTime())) {
      var splitDate = val.split(/\D/);
      date = new Date(Date.UTC(splitDate[0], --splitDate[1] || '', splitDate[2] || '', splitDate[3] || '', splitDate[4] || '', splitDate[5] || '', splitDate[6] || ''));
    }
    return date.toISOString();
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/UTC.filter.js
;

System.registerModule("com/autodesk/availableOptions.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/availableOptions.filter.js";
  var $__default = function(optionsArr, selectedOptionId) {
    var parsedItems = [];
    parsedItems = _.filter(optionsArr, function(option) {
      return (option.id !== selectedOptionId);
    });
    return parsedItems;
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/availableOptions.filter.js
;

System.registerModule("com/autodesk/convertLineBreaks.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/convertLineBreaks.filter.js";
  var $__default = function(html, type) {
    if (angular.isDefined(html)) {
      if (type === 'PARAGRAPH') {
        return html.replace(/\n/g, '<br>');
      } else {
        return html;
      }
    } else {
      return null;
    }
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/convertLineBreaks.filter.js
;

System.registerModule("com/autodesk/escapeHtmlEntities.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/escapeHtmlEntities.filter.js";
  var $__default = function(htmlStr) {
    if (!htmlStr) {
      return '';
    }
    var entitiesTable = {
      34: 'quot',
      38: 'amp',
      39: 'apos',
      60: 'lt',
      62: 'gt',
      160: 'nbsp',
      161: 'iexcl',
      162: 'cent',
      163: 'pound',
      164: 'curren',
      165: 'yen',
      166: 'brvbar',
      167: 'sect',
      168: 'uml',
      169: 'copy',
      170: 'ordf',
      171: 'laquo',
      172: 'not',
      173: 'shy',
      174: 'reg',
      175: 'macr',
      176: 'deg',
      177: 'plusmn',
      178: 'sup2',
      179: 'sup3',
      180: 'acute',
      181: 'micro',
      182: 'para',
      183: 'middot',
      184: 'cedil',
      185: 'sup1',
      186: 'ordm',
      187: 'raquo',
      188: 'frac14',
      189: 'frac12',
      190: 'frac34',
      191: 'iquest',
      192: 'Agrave',
      193: 'Aacute',
      194: 'Acirc',
      195: 'Atilde',
      196: 'Auml',
      197: 'Aring',
      198: 'AElig',
      199: 'Ccedil',
      200: 'Egrave',
      201: 'Eacute',
      202: 'Ecirc',
      203: 'Euml',
      204: 'Igrave',
      205: 'Iacute',
      206: 'Icirc',
      207: 'Iuml',
      208: 'ETH',
      209: 'Ntilde',
      210: 'Ograve',
      211: 'Oacute',
      212: 'Ocirc',
      213: 'Otilde',
      214: 'Ouml',
      215: 'times',
      216: 'Oslash',
      217: 'Ugrave',
      218: 'Uacute',
      219: 'Ucirc',
      220: 'Uuml',
      221: 'Yacute',
      222: 'THORN',
      223: 'szlig',
      224: 'agrave',
      225: 'aacute',
      226: 'acirc',
      227: 'atilde',
      228: 'auml',
      229: 'aring',
      230: 'aelig',
      231: 'ccedil',
      232: 'egrave',
      233: 'eacute',
      234: 'ecirc',
      235: 'euml',
      236: 'igrave',
      237: 'iacute',
      238: 'icirc',
      239: 'iuml',
      240: 'eth',
      241: 'ntilde',
      242: 'ograve',
      243: 'oacute',
      244: 'ocirc',
      245: 'otilde',
      246: 'ouml',
      247: 'divide',
      248: 'oslash',
      249: 'ugrave',
      250: 'uacute',
      251: 'ucirc',
      252: 'uuml',
      253: 'yacute',
      254: 'thorn',
      255: 'yuml',
      402: 'fnof',
      913: 'Alpha',
      914: 'Beta',
      915: 'Gamma',
      916: 'Delta',
      917: 'Epsilon',
      918: 'Zeta',
      919: 'Eta',
      920: 'Theta',
      921: 'Iota',
      922: 'Kappa',
      923: 'Lambda',
      924: 'Mu',
      925: 'Nu',
      926: 'Xi',
      927: 'Omicron',
      928: 'Pi',
      929: 'Rho',
      931: 'Sigma',
      932: 'Tau',
      933: 'Upsilon',
      934: 'Phi',
      935: 'Chi',
      936: 'Psi',
      937: 'Omega',
      945: 'alpha',
      946: 'beta',
      947: 'gamma',
      948: 'delta',
      949: 'epsilon',
      950: 'zeta',
      951: 'eta',
      952: 'theta',
      953: 'iota',
      954: 'kappa',
      955: 'lambda',
      956: 'mu',
      957: 'nu',
      958: 'xi',
      959: 'omicron',
      960: 'pi',
      961: 'rho',
      962: 'sigmaf',
      963: 'sigma',
      964: 'tau',
      965: 'upsilon',
      966: 'phi',
      967: 'chi',
      968: 'psi',
      969: 'omega',
      977: 'thetasym',
      978: 'upsih',
      982: 'piv',
      8226: 'bull',
      8230: 'hellip',
      8242: 'prime',
      8243: 'Prime',
      8254: 'oline',
      8260: 'frasl',
      8472: 'weierp',
      8465: 'image',
      8476: 'real',
      8482: 'trade',
      8501: 'alefsym',
      8592: 'larr',
      8593: 'uarr',
      8594: 'rarr',
      8595: 'darr',
      8596: 'harr',
      8629: 'crarr',
      8656: 'lArr',
      8657: 'uArr',
      8658: 'rArr',
      8659: 'dArr',
      8660: 'hArr',
      8704: 'forall',
      8706: 'part',
      8707: 'exist',
      8709: 'empty',
      8711: 'nabla',
      8712: 'isin',
      8713: 'notin',
      8715: 'ni',
      8719: 'prod',
      8721: 'sum',
      8722: 'minus',
      8727: 'lowast',
      8730: 'radic',
      8733: 'prop',
      8734: 'infin',
      8736: 'ang',
      8743: 'and',
      8744: 'or',
      8745: 'cap',
      8746: 'cup',
      8747: 'int',
      8756: 'there4',
      8764: 'sim',
      8773: 'cong',
      8776: 'asymp',
      8800: 'ne',
      8801: 'equiv',
      8804: 'le',
      8805: 'ge',
      8834: 'sub',
      8835: 'sup',
      8836: 'nsub',
      8838: 'sube',
      8839: 'supe',
      8853: 'oplus',
      8855: 'otimes',
      8869: 'perp',
      8901: 'sdot',
      8968: 'lceil',
      8969: 'rceil',
      8970: 'lfloor',
      8971: 'rfloor',
      9001: 'lang',
      9002: 'rang',
      9674: 'loz',
      9824: 'spades',
      9827: 'clubs',
      9829: 'hearts',
      9830: 'diams',
      338: 'OElig',
      339: 'oelig',
      352: 'Scaron',
      353: 'scaron',
      376: 'Yuml',
      710: 'circ',
      732: 'tilde',
      8194: 'ensp',
      8195: 'emsp',
      8201: 'thinsp',
      8204: 'zwnj',
      8205: 'zwj',
      8206: 'lrm',
      8207: 'rlm',
      8211: 'ndash',
      8212: 'mdash',
      8216: 'lsquo',
      8217: 'rsquo',
      8218: 'sbquo',
      8220: 'ldquo',
      8221: 'rdquo',
      8222: 'bdquo',
      8224: 'dagger',
      8225: 'Dagger',
      8240: 'permil',
      8249: 'lsaquo',
      8250: 'rsaquo',
      8364: 'euro'
    };
    return htmlStr.replace(/[\u00A0-\u2666<>\&]/g, function(charStr) {
      return '&' + (entitiesTable[charStr.charCodeAt(0)] || '#' + charStr.charCodeAt(0)) + ';';
    });
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/escapeHtmlEntities.filter.js
;

System.registerModule("com/autodesk/filters.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/filters.js";
  System.get('com/autodesk/UnderscoreService.js');
  var availableOptions = System.get("com/autodesk/availableOptions.filter.js").default;
  var convertLineBreaks = System.get("com/autodesk/convertLineBreaks.filter.js").default;
  var escapeHtmlEntities = System.get("com/autodesk/escapeHtmlEntities.filter.js").default;
  var highlightText = System.get("com/autodesk/highlightText.filter.js").default;
  var itemDetailsSection = System.get("com/autodesk/itemDetailsSection.filter.js").default;
  var lineBreak = System.get("com/autodesk/lineBreak.filter.js").default;
  var listBySection = System.get("com/autodesk/listBySection.filter.js").default;
  var selectedOption = System.get("com/autodesk/selectedOption.filter.js").default;
  var truncateFieldValue = System.get("com/autodesk/truncateFieldValue.filter.js").default;
  var UTC = System.get("com/autodesk/UTC.filter.js").default;
  angular.module(__moduleName, ['com/autodesk/UnderscoreService.js']).filter('availableOptions', ['_', function(_) {
    return availableOptions;
  }]).filter('convertLineBreaks', function() {
    return convertLineBreaks;
  }).filter('escapeHtmlEntities', function() {
    return escapeHtmlEntities;
  }).filter('HighlightText', function() {
    return highlightText;
  }).filter('itemDetailsSectionFilter', function() {
    return itemDetailsSection;
  }).filter('lineBreakFilter', function() {
    return lineBreak;
  }).filter('listBySectionFilter', ['_', function(_) {
    return listBySection;
  }]).filter('selectedOption', ['_', function(_) {
    return selectedOption;
  }]).filter('truncateFieldValue', ['_', function(_) {
    return truncateFieldValue;
  }]).filter('UTC', function() {
    return UTC;
  });
  ;
  return {};
});
//# sourceURL=com/autodesk/filters.js
;

System.registerModule("com/autodesk/highlightText.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/highlightText.filter.js";
  var HIGHTLIGTH_TAG = '<span class="highlight-text-filter">{term}</span>';
  var TERM_KEY = '{term}';
  var removeValuesFromArray = function(array, values) {
    return array.filter(function(element) {
      return !values.map(function(value) {
        return value.toUpperCase() === element.toUpperCase();
      }).reduce(function(prev, current) {
        return prev || current;
      });
    });
  };
  var getSingleTerms = function(searchTerms, termsToAvoid) {
    if (searchTerms === null || searchTerms === '' || searchTerms === undefined) {
      return [];
    }
    var searchTermsArray = searchTerms.match(/\S+/g);
    return removeValuesFromArray(searchTermsArray, termsToAvoid);
  };
  var highlightResult = function(toHighlight, whereTo) {
    if (whereTo === null || whereTo === undefined || toHighlight === null || toHighlight === undefined) {
      return highlightWords(whereTo, toHighlight);
    }
    var highlighted = whereTo.toString();
    var singleTerms = getSingleTerms(toHighlight, ['or', 'and', 'OR', 'AND']);
    var phrases = toHighlight.match(/"(?:\\?[\S\s])*?"/g);
    var regexTerm = '';
    if (phrases !== null) {
      phrases.forEach(function(phrase) {
        phrase = phrase.trim().replace(/\"/g, '');
        if (phrase !== '') {
          regexTerm += phrase + '|';
        }
      });
    }
    singleTerms.forEach(function(term, i) {
      term = term.trim();
      if (term !== '') {
        regexTerm += term.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        if (i < singleTerms.length - 1) {
          regexTerm += '|';
        }
      }
    });
    var reg = new RegExp(regexTerm, 'gi');
    var wordsToHighlight = highlighted.match(reg);
    return highlightWords(highlighted, wordsToHighlight);
  };
  var highlightWords = function(original, words) {
    var spanNode = '';
    if (words === null || words === undefined || words.length === 0) {
      return original;
    }
    var firstWord = words[0];
    var nonHighlightedParts = original.split(firstWord);
    var wordsWithoutFirst = words.slice(1, words.length);
    nonHighlightedParts.forEach(function(nonHighlightedPart, i) {
      spanNode += highlightWords(nonHighlightedPart, wordsWithoutFirst);
      if (i < nonHighlightedParts.length - 1) {
        spanNode += HIGHTLIGTH_TAG.replace(TERM_KEY, firstWord);
      }
    });
    return spanNode;
  };
  var $__default = function(haystack, needle) {
    if (angular.isDefined(haystack) && angular.isDefined(needle)) {
      return highlightResult(needle, haystack);
    }
    return haystack;
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/highlightText.filter.js
;

System.registerModule("com/autodesk/itemDetailsSection.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/itemDetailsSection.filter.js";
  var $__default = function(items, section) {
    var parsedItems = {};
    var itemsArray = [];
    try {
      _.each(items, function(value, i) {
        _.each(section, function(val, key) {
          if (value.fieldType === section[key].toString()) {
            itemsArray.push(value);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
    return itemsArray;
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/itemDetailsSection.filter.js
;

System.registerModule("com/autodesk/lineBreak.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/lineBreak.filter.js";
  var $__default = function(input) {
    return input ? input.replace(/\r?\n/g, '<br>') : '';
  };
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/lineBreak.filter.js
;

System.registerModule("com/autodesk/listBySection.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/listBySection.filter.js";
  var $__default = function(sectionList, sectionId) {
    var parsedItems = {};
    parsedItems = _.filter(sectionList, function(section) {
      return ((sectionId === -1) ? true : section.id === sectionId);
    });
    return parsedItems;
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/listBySection.filter.js
;

System.registerModule("com/autodesk/selectedOption.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/selectedOption.filter.js";
  var $__default = function(optionsArr, selectedOptionId) {
    try {
      var selectedItem = _.find(optionsArr, function(option) {
        return option.id === selectedOptionId;
      });
      return selectedItem.label;
    } catch (e) {}
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/selectedOption.filter.js
;

System.registerModule("com/autodesk/truncateFieldValue.filter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/truncateFieldValue.filter.js";
  var $__default = function(value, length, enabled) {
    if (enabled) {
      if (angular.isDefined(length) && angular.isDefined(value) && value !== null) {
        return value.substring(0, length);
      }
    }
    return value;
  };
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/truncateFieldValue.filter.js
