/**
 * @ngdoc object
 * @name ViewTestsPage.DataNavigatorViewPage
 *
 * @description This page corresponds to the Data navigator view - the roamer-tree.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');

function DataNavigatorViewPage() {

	DataNavigatorViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#route
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName +
		'/roamer/urn`adsk,plm`tenant,workspace,item`' +
		browser.params.tenant + ',47,2694';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#urlRegex
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/roamer');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#urlContains
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'roamer';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#clickableItemName
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The clickable Item Name of the element
	 */
	this.clickableItemName = element(by.css('.item-name'));

	/**
 	* @ngdoc property
 	* @name ViewTestsPage.DataNavigatorViewPage#closeButton
 	* @propertyOf ViewTestsPage.DataNavigatorViewPage
 	* @description The close button of Data Navigator view
 	*/
	this.closeButton = element(by.css('.dataNavigatorCloseBtn'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#parentGNode
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The parent node of items: first g.node.
	 */
	this.parentGNode = element(by.css('.node'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#symbol
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The text symbol inside the node: first g.node.symbol.
	 */
	this.symbol = element(by.css('.symbol'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.DataNavigatorViewPage#isMyElementPresent
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description Method to check if the roamer-tree element is present
	 */
	this.roamerTreeIsPresent = function () {
		return element(by.css('.roamer-tree')).isPresent();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#numItems
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description Gets the total number of items displayed in the Roamer Tree
	 */
	this.numItems = element.all(by.css('.node'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.DataNavigatorViewPage#BOMItem
	 * @propertyOf ViewTestsPage.DataNavigatorViewPage
	 * @description The BOM item
	 */
	this.BOMItem = element.all(by.css('.rel-type.item-name')).get(2);
}

util.inherits(DataNavigatorViewPage, GenericPage);

module.exports = new DataNavigatorViewPage();
