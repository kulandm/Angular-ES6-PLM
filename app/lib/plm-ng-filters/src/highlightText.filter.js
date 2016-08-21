'use strict';

const HIGHTLIGTH_TAG = '<span class="highlight-text-filter">{term}</span>';
const TERM_KEY = '{term}';

/**
 * @ngdoc filter
 * @name Filters.HighlightText
 * @description Injects html content into a string to mark it as highlighted
 *
 * @param {String} haystack The string where to look
 * @param {String} needle The string i'm looking to highlight
 *
 * @returns {String} The string with html injected to highlight content
 *
 * @example
 * <doc:example>
 * 		<doc:source>
 *
 * 		</doc:source>
 * </doc:example>
 */

/*
 * @ngdoc method
 * @name Filters.HighlightText#removeValuesFromArray
 * @methodOf Filters.HighlightText
 * @param  {Array} target array for removing elements
 * @param  {Array} elements to be removed in the first array
 * @description The function removes from an array specific values.
 */
let removeValuesFromArray = (array, values) => {
	return array.filter(element => {
		return !values.map(value => value.toUpperCase() === element.toUpperCase()).reduce((prev, current) => prev || current);
	});
};

 /*
 * @ngdoc method
 * @name Filters.HighlightText#getSingleTerms
 * @methodOf Filters.HighlightText
 * @param  {String} text
 * @param  {Array} elements to be avoided
 * @description The function returns an array with all the terms of a text, avoiding
 * the ones you specified in the array of the second parameter.
 */
let getSingleTerms = (searchTerms, termsToAvoid) => {
	if (searchTerms === null || searchTerms === '' || searchTerms === undefined) {
		return [];
	}

	let searchTermsArray = searchTerms.match(/\S+/g);
	return removeValuesFromArray(searchTermsArray, termsToAvoid);
};

 /*
 * @ngdoc method
 * @name Filters.HighlightText#highlightResult
 * @methodOf Filters.HighlightText
 * @param  {string} Words should be highlighted in whereTo param
 * @param  {string} text to highlight the works
 * @description Returns whereTo param with the words highlighted.
 */
let highlightResult = (toHighlight, whereTo) => {

	if (whereTo === null || whereTo === undefined || toHighlight === null || toHighlight === undefined) {
		return highlightWords(whereTo, toHighlight);
	}

	// People can search phrases surrounded by quotes, or simple terms, and they can work together with a boolean operator
	let highlighted = whereTo.toString();
	let singleTerms = getSingleTerms(toHighlight, ['or','and','OR','AND']);
	let phrases = toHighlight.match(/"(?:\\?[\S\s])*?"/g);
	let regexTerm = '';

	// Adding phrases to regex
	if (phrases !== null) {
		phrases.forEach(phrase => {
			phrase = phrase.trim().replace(/\"/g, '');
			if (phrase !== '') {
				regexTerm += phrase + '|';
			}
		});
	}

	// Adding single terms to regex
	singleTerms.forEach((term, i) =>{
		term = term.trim();
		if (term !== '') {
			regexTerm += term.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

			if (i < singleTerms.length - 1) { // not the last item
				regexTerm += '|';
			}
		}
	});

	let reg = new RegExp(regexTerm,'gi');
	let wordsToHighlight = highlighted.match(reg);

	return highlightWords(highlighted, wordsToHighlight);
};

/*
 * @ngdoc method
 * @name Filters.HighlightText#highlightWords
 * @methodOf Filters.HighlightText
 * @param  {string} text to highlight the works
 * @param  {Array} Words should be highlighted
 * @description Returns whereTo param with the words highlighted.
 */
let highlightWords = (original, words) => {
	let spanNode = '';

	if (words === null || words === undefined || words.length === 0) {
		return original;
	}

	let firstWord = words[0];
	let nonHighlightedParts = original.split(firstWord);
	let wordsWithoutFirst = words.slice(1,words.length);

	nonHighlightedParts.forEach((nonHighlightedPart, i) => {
		spanNode += highlightWords(nonHighlightedPart, wordsWithoutFirst);
		if (i < nonHighlightedParts.length - 1) {
			spanNode += HIGHTLIGTH_TAG.replace(TERM_KEY, firstWord);
		}
	});

	return spanNode;
};
export default (haystack, needle) => {
	if (angular.isDefined(haystack) && angular.isDefined(needle)) {
		return highlightResult(needle, haystack);
	}
	return haystack;
};
