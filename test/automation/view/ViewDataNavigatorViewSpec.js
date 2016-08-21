'use strict';

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var dataNavigatorViewPage = require('../pages/DataNavigatorViewPage');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDataNavigatorViewSpec
 *
 * @description This is the view tests for the DataNavigatorViewPage.
 *
 * ##Dependencies
 *
 */
function ViewDataNavigatorViewSpec() {
	
	describe('[DataNavigatorView]', function () {
		this.timeout(120000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					dataNavigatorViewPage.go();
					browser.sleep(20000);
					return true;
				});
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('navigates to the Data Navigator view page', function () {
			this._runnable.ssName = 'landingOnDataNavigatorView';

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('roamer');
		});

		it('should display title of Data Navigator', function () {
			var title = element(by.css('.title-wrapper h1 span'));
			expect(title).to.exist;
			expect(title.getText()).to.eventually.equal('Data Navigator');
		});

		it('should display item name', function () {
			var itemName = element(by.css('.item-name'));
			expect(itemName).to.exist;
			expect(itemName.getText()).to.eventually.be.a('string');
		});

		it('should show the fullname title when the mouse is over the rect', function () {
			var titleTag = element('title');
			browser.actions().mouseMove(dataNavigatorViewPage.parentGNode).perform();
			expect(titleTag).to.exist;
		});

		it('should display the close button', function () {
			expect(dataNavigatorViewPage.closeButton).to.exist;
			expect(dataNavigatorViewPage.closeButton.getText()).to.eventually.be.a('string');
			expect(dataNavigatorViewPage.closeButton.getText()).to.eventually.equal('Close');
		});

		describe('[branches]', () => {

			let subElements;
			let subElementsCount;
			let subElementsTitles = [];

			before(() => {
				element(by.css('.symbol')).click().then(() => {
					browser.sleep(5000);

					subElements = element.all(by.css('.node'));
					subElements.count().then(count => {
						subElementsCount = count;
					});
					subElements.each(el => {
						el.element(by.css('.item-name')).getText().then(txt => {
							subElementsTitles.push(txt);
						});
					});
				});
			});

			it('should check the quantity branches from the original item', () => {
				expect(subElementsCount).to.be.above(18); // i won't be able to maintain this if i use equals
			});

			it.skip('should have related BOM and Relationships nodes', () => {
				var found = subElementsTitles.filter(function (entry) {
					return (entry.indexOf('BOM') > -1) || (entry.indexOf('Relationships') > - 1);
				});
				expect(found).to.have.length.equal(2);
			});

			it('should find a same vertical separation between siblings', function () {
				var subElements = element.all(by.css('.node.depth_2'));
				subElements.getAttribute('transform').then(function (allTxt) {
					var childNode1 = Number(allTxt[0].split(',')[1].split(')')[0]);
					var childNode2 = Number(allTxt[1].split(',')[1].split(')')[0]);
					expect(childNode1).to.equal(childNode2 + 73);
				});
			});

			it('should find a same horizontal separation between siblings', function () {
				dataNavigatorViewPage.roamerTreeIsPresent().then(function () {
					var subElements = element.all(by.css('.node.depth_2'));
					subElements.getAttribute('transform').then(function (txt) {
						var childNode1 = Number(txt[1].split(',')[0].split('(')[1]);
						var childNode2 = Number(txt[2].split(',')[0].split('(')[1]);
						expect(childNode1).to.equal(childNode2);
					});
				});
			});

			describe('[Open sub items branch]', () => {
				// expand a 3rd level
				before(() => {
					var subElements = element.all(by.css('.node.depth_2'));
					var subElementsCount = 0;
					subElements.get(12).element(by.css('.symbol')).click().then(() => {
						subElements = element.all(by.css('.node'));
						subElements.count().then(count => {
							subElementsCount = count;
						});
					});
				});

				it('should check the current quantity of items once an additional branch is opened', () => {
					expect(subElementsCount).to.be.above(1);
				});

				it('should find the BOM item', () => {
					expect(dataNavigatorViewPage.BOMItem).to.exist;
					expect(dataNavigatorViewPage.BOMItem.getText()).to.eventually.contain('Bill of');
				});

				it('should find a +/- symbol for each item', () => {
					element.all(by.css('.symbol')).then(function (elems) {
						expect(dataNavigatorViewPage.numItems.count()).to.eventually.equal(elems.length);
					});
				});
			});
		});

		it('should display item-state', function () {
			var itemState = element(by.css('.item-state'));
			expect(itemState).to.exist;
			expect(itemState.getText()).to.eventually.be.a('string');
			expect(itemState.getText()).to.eventually.not.be.empty;
			expect(itemState.getText()).to.eventually.not.equal('Not fetched');
		});

		it('should display item-workspace', function () {
			var itemWorkspace = element(by.css('.item-workspace'));
			expect(itemWorkspace).to.exist;
			expect(itemWorkspace.getText()).to.eventually.be.a('string');
			expect(itemWorkspace.getText()).to.eventually.not.be.empty;
			expect(itemWorkspace.getText()).to.eventually.not.equal('Not fetched');
		});
		
		describe('[Clicking on item]', () => {
			it('should display split view when item name is clicked', () => {
				dataNavigatorViewPage.clickableItemName.click().then(() => {
					browser.sleep(1000);
					browser.driver.getCurrentUrl().then(function (val) {
						expect(val).to.contain('itemDetails?view=split');
					});
				});
			});
		});
	});
}

util.inherits(ViewDataNavigatorViewSpec, SharedSpec);

module.exports = new ViewDataNavigatorViewSpec();
