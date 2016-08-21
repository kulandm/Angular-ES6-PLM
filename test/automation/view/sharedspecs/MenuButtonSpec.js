'use strict';

var AppHeader = require('../../components/AppHeader');

function MenuButtonSpec() {

	/**
	 * @ngdoc method
	 * @name MenuButtonSpec.SharedSpec#run
	 * @methodOf MenuButtonSpec
	 * @description Run the tests for a Main Menu button, it is used from SharedSpecs
	 */
	this.run = (buttonDef) => {
		let innerAnchor, icon, label;

		before(() => {
			innerAnchor = buttonDef.button.element(by.tagName('a'));
			icon = innerAnchor.element(by.css('.icon'));
			label = innerAnchor.element(by.css('.label'));
		});

		it('should be the first button with expectedTitle as title', () => {
			buttonDef.button.getAttribute('title').then(function (title) {
				expect(title).to.equal(buttonDef.expectedTitle);
			});
		});

		it('should have an anchor that triggers the correct method in the controller', () => {
			if (buttonDef.expectedMethod) {
				innerAnchor.getAttribute('ng-click').then((value) => {
					expect(value).to.equal(buttonDef.expectedMethod);
				});
			}
		});

		it('should have the correct target', () => {
			if (buttonDef.expectedTarget) {
				innerAnchor.getAttribute('target').then((value) => {
					expect(value).to.equal(buttonDef.expectedTarget);
				});
			}
		});

		it('should have the correct href value', () => {
			innerAnchor.getAttribute('href').then((value) => {
				expect(value).to.equal(buttonDef.expectedHref);
			});
		});

		it('should have the correct icon', () => {
			icon.getAttribute('class').then((classList) => {
				expect(classList).to.contain('md-2x');
				expect(classList).to.contain(buttonDef.expectedIcon);
			});
		});

		it('should have the correct label', () => {
			label.getInnerHtml().then((text) => {
				expect(text).to.equal(buttonDef.expectedTitle);
			});
		});

		it('should have the label displayed when menu expands', () => {
			AppHeader.showExpandedMenu().then(() => {
				label.isDisplayed().then((visible) => {
					expect(visible).to.be.true;
				});
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name MenuButtonSpec.SharedSpec#testLabelsHidden
	 * @methodOf MenuButtonSpec
	 * @description Checks if the menu labels are hidden when the menu is closed,
	 *			It is used from SharedSpecs
	 */
	this.testLabelsHidden = (args) => {
		it('Should have all labels hidden when menu is closed', () => {
			expect(AppHeader.getBackDrop().isPresent()).to.eventually.be.false;
			args.buttons.all(by.css('.label')).each((label) => {
				expect(label.isDisplayed()).to.eventually.be.false;
			});
		});
	};
}

module.exports = new MenuButtonSpec();
