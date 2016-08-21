System.get('com/autodesk/UnderscoreService.js');

import availableOptions from 'com/autodesk/availableOptions.filter.js';
import convertLineBreaks from 'com/autodesk/convertLineBreaks.filter.js';
import escapeHtmlEntities from 'com/autodesk/escapeHtmlEntities.filter.js';
import highlightText from 'com/autodesk/highlightText.filter.js';
import itemDetailsSection from 'com/autodesk/itemDetailsSection.filter.js';
import lineBreak from 'com/autodesk/lineBreak.filter.js';
import listBySection from 'com/autodesk/listBySection.filter.js';
import selectedOption from 'com/autodesk/selectedOption.filter.js';
import truncateFieldValue from 'com/autodesk/truncateFieldValue.filter.js';
import UTC from 'com/autodesk/UTC.filter.js';

angular.module(__moduleName, [
	'com/autodesk/UnderscoreService.js'
])
.filter('availableOptions', [
	'_',
	function (_) {
		return availableOptions;
	}
])
.filter('convertLineBreaks', function () {
	return convertLineBreaks;
})
.filter('escapeHtmlEntities', function () {
    return escapeHtmlEntities;
})
.filter('HighlightText', function () {
	return highlightText;
})
.filter('itemDetailsSectionFilter', function () {
	return itemDetailsSection;
})
.filter('lineBreakFilter', function () {
    return lineBreak;
})
.filter('listBySectionFilter', [
	'_',
	function (_) {
		return listBySection;
	}
])
.filter('selectedOption', [
	'_',
	function (_) {
		return selectedOption;
	}
])
.filter('truncateFieldValue', [
	'_',
	function (_) {
		return truncateFieldValue;
	}
])
.filter('UTC', function () {
	return UTC;
})
;
