'use strict';

var SEARCH_PATH = '/search?query=';
var SELECTORS = {

};

var util = require('util');
var GenericPage = require('../pages/GenericPage');

/**
 * @ngdoc object
 * @name SearchPage
 * @description Page object for search result page
 */
function SearchPage() {

	this.url = '/' + browser.params.baseName + SEARCH_PATH;
	
	/*
	 * @ngdoc method
	 * @name SearchPage#get
	 * @methodOf SearchPage
	 * @param  {RESTWrapperService} RESTWrapperService Rest client
	 * @description perform a get .
	 */
	this.get = function (query) {
		browser.get(this.url + query);
	};
}

util.inherits(SearchPage, GenericPage);

module.exports = new SearchPage();