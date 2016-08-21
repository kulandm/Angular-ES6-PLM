// 'use strict';

// /**
//  * @ngdoc object
//  * @name SearchPlm
//  *
//  * @description This component corresponds to the SearchPlm
//  *
//  * ##Dependencies 
//  *	protractor
//  *
//  */
// class SearchPlm {

// 	/*
// 	 * @ngdoc method
// 	 * @name SearchPlm#constructor
// 	 * @methodOf SearchPlm
// 	 * @description The class constructor
// 	 */
// 	constructor() {
// 		let SELECTORS = {
// 			root: '.searchPLM',
// 			searchInput: '.searchPLM input',
// 			searchButton: '.searchPLM span.md-search',
// 			crossButton: '.searchPLM span.md-close'
// 		};
// 		this.root = element(by.css(SELECTORS.root));
// 		this.searchBox = element(by.css(SELECTORS.searchInput));
// 		this.searchButton = element(by.css(SELECTORS.searchButton));
// 		this.crossButton = element(by.css(SELECTORS.crossButton));
// 	}

// 	/**
// 	 * @ngdoc method
// 	 * @name SearchPlm#isSearchInputFocused 
// 	 * @methodOf SearchPlm
// 	 * @description 
// 	 *
// 	 * @returns true if the input is focused
//	 */
// 	isSearchInputFocused() {
// 		return this.searchBox.getAttribute('id').then((searchBoxId) => {
// 			return browser.driver.switchTo().activeElement().getAttribute('id').then((activeElementId) => {
// 				return searchBoxId && searchBoxId === activeElementId;
// 			});
// 		});
// 	}

// 		/**
// 	 * @ngdoc method
// 	 * @name SearchPlm#clickOnSearchButton 
// 	 * @methodOf SearchPlm
// 	 * @description clicks on search button
// 	 *
// 	 * @returns 
// 	 */
// 	clickOnSearchButton() {
// 		return this.searchButton.click();
// 	}

// 	/**
// 	 * @ngdoc method
// 	 * @name SearchPlm#isPresent 
// 	 * @methodOf SearchPlm
// 	 * @description tells us whether or not the notification is shown or not.
// 	 *
// 	 * @returns 
// 	 */
// 	isDisplayed() {
// 		return this.root.isDisplayed().then((result)=>{
// 			return this.searchButton.isDisplayed().then((value)=>{
// 				return value;
// 			});
// 		});
// 	}

// }

// module.exports = new SearchPlm();