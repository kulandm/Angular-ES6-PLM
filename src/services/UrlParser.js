/**
 * @ngdoc object
 * @name Services.UrlParser
 *
 * @description This service exposes method to parse strings that represent full URLs
 *	and supports all browsers, including I.E
 *
 * ##Dependencies
 *
 */
class UrlParser {

	/*
	 * @ngdoc method
	 * @name Services.UrlParser#constructor
	 * @methodOf Services.UrlParser
	 * @description The class constructor
	 */
	constructor() {

	}

	/**
	 * @ngdoc method
	 * @name Services.UrlParser#parse
	 * @methodOf Services.UrlParser
	 * @description Create an object that holds parts of an URL. This should be a
	 * cross-browser solution, appliable even when URL() is not supported (e.g, when
	 * using Internet Explorer.)
	 *
	 * @TODO Replace this function when URL class is supported - see (PLM-8709)
	 *
	 * @param {String} URL to be parsed
	 *
	 * @returns {Object} HTML Object
	 */
	parse(url) {
		// Check if URL() is supported
		if (angular.isDefined(window.URL) && angular.isDefined(window.URL.prototype)) {
			return new URL(url);
		} else {
			// Create an empty anchor element that holds domain, pathname and other properties
			// the URL constructor provides.
			var anchor = document.createElement('a');
			anchor.href = url;

			return anchor;
		}
	}
	
}

export default angular.module(__moduleName, []).factory('UrlParser', [
	() => new UrlParser()
]);
