/**
 * @ngdoc object
 * @name ViewTestsSpecs.CommandBarSpec
 *
 * @description This is the spec for command bar transcluded buttons.
 *
 * ##Dependencies
 */
var ss = require('../../util/screenshoter');
var AddItemFlyout = require('../../components/AddItemFlyout');
var CommandBar = require('../../components/CommandBar');

function CommandBarSpec() {
	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.CommandBarSpec#displaysEditAddRemove
	 * @methodOf ViewTestsSpecs.CommandBarSpec
	 * @description Tests for the transcluded buttons in the command bar.
	 *
	 * @param {String} viewName The view in which command bar buttons are tested.
	 */
	this.displaysEditAddRemove = function (viewName) {
		describe('[CommandBar]', function () {
			it('displays the command bar', function () {
				this._runnable.ssName = viewName + '-commandBar';

				expect(CommandBar.isCommandBarDisplayed()).to.eventually.be.true;
			});

			it('displays the Edit, Add and Remove buttons', function () {
				this._runnable.ssName = viewName + '-transcludedButtons';

				// Three buttons should be displayed
				expect(CommandBar.isTranscludedBtnsDisplayed(3)).to.eventually.be.true;

				// The first button should be the Edit button
				expect(CommandBar.getTranscludedButton(0).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Edit');

				// The second button should be the Add button
				expect(CommandBar.getTranscludedButton(1).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Add');

				// The third button should be the Remove button
				expect(CommandBar.getTranscludedButton(2).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Remove');
			});

			it('has Edit as the only primary button', function () {
				this._runnable.ssName = viewName + '-primaryButton';

				expect(CommandBar.getTranscludedButton(0).getCssValue('background-color'))
					.to.eventually.equal('rgba(5, 167, 223, 1)');

				expect(CommandBar.getTranscludedButton(1).getCssValue('background-color'))
					.to.eventually.equal('rgba(250, 250, 250, 1)');
			});

			it('should not display multiple flyouts when add button is clicked multiple times', function () {
				AddItemFlyout.openAddItemsFlyout();
				expect(AddItemFlyout.isAddItemFlyoutDisplayed()).to.eventually.be.true;

				AddItemFlyout.openAddItemsFlyout();
				AddItemFlyout.closeAddItemsFlyout();

				expect(AddItemFlyout.isAddItemFlyoutPresent()).to.eventually.be.false;
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.CommandBarSpec#displaysEdit
	 * @methodOf ViewTestsSpecs.CommandBarSpec
	 * @description Tests for the transcluded buttons in the command bar.
	 *
	 * @param {String} viewName The view in which command bar buttons are tested.
	 */
	this.displaysEdit = function (viewName) {
		describe('[CommandBar]', function () {
			it('displays the command bar', function () {
				this._runnable.ssName = viewName + '-commandBar';

				expect(CommandBar.isCommandBarDisplayed()).to.eventually.be.true;
			});

			it('displays the Edit button', function () {
				this._runnable.ssName = viewName + '-transcludedButtons';

				expect(CommandBar.isTranscludedBtnsDisplayed(1)).to.eventually.be.true;

				expect(CommandBar.getTranscludedButton(0).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Edit');
			});

			it('has Edit as the only primary button', function () {
				this._runnable.ssName = viewName + '-primaryButton';

				expect(CommandBar.getTranscludedButton(0).getCssValue('background-color'))
					.to.eventually.equal('rgba(5, 167, 223, 1)');
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.CommandBarSpec#doesntDisplayAnyCommandBarButtons
	 * @methodOf ViewTestsSpecs.CommandBarSpec
	 * @description Tests to ensure no buttons are displayed on the command bar
	 *
	 * @param {String} viewName The view in which command bar buttons are tested.
	 */
	this.emptyCommandBar = function (viewName) {
		describe('[CommandBar]', function () {
			it('displays the command bar', function () {
				this._runnable.ssName = viewName + '-commandBar';

				expect(CommandBar.isCommandBarDisplayed()).to.eventually.be.true;
			});

			it('does not display the Edit button', function () {
				this._runnable.ssName = viewName + '-transcludedButtons';

				expect(CommandBar.isTranscludedBtnsDisplayed(1)).to.eventually.false;
			});

		});
	};
}

module.exports = CommandBarSpec;
