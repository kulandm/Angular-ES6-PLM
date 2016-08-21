/**
 * @ngdoc object
 * @name ViewTestsSpecs.AddItemSpec
 *
 * @description This is the spec for create item.
 *
 * ##Dependencies
 */
var ss = require('../../util/screenshoter');
var AddItemFlyout = require('../../components/AddItemFlyout');
var mainDashboardPage = require('../../pages/MainDashboardPage');

function AddItemSpec() {
	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.AddItemSpec#triggerAdd
	 * @methodOf ViewTestsSpecs.AddItemSpec
	 * @description Tests for the adds item flyout.
	 *
	 * @param {String} viewName The view in which add items is being tested.
	 */
	this.triggerAdd = function (viewName) {
		describe('[AddItem]', function () {
			before('open the flyout', function () {
				AddItemFlyout.openAddItemsFlyout();
			});

			after('close the flyout', function () {
				AddItemFlyout.closeAddItemsFlyout();
			});

			it('shows a list of items that can be added', function () {
				this._runnable.ssName = viewName + '-addItemsList';

				expect(AddItemFlyout.isAddItemFlyoutDisplayed()).to.eventually.be.true;
			});

			it('disables the Add button unless an item is selected', function () {
				this._runnable.ssName = viewName + '-disableAddBtn';

				// Check that the button is first disabled
				expect(AddItemFlyout.getAddItemFlyoutBtns('Add').isEnabled())
					.to.eventually.be.false;

				// Select the first enabled item and then check that the button is enabled
				AddItemFlyout.enabledCheckboxes.get(0).click();

				expect(AddItemFlyout.getAddItemFlyoutBtns('Add').isEnabled())
					.to.eventually.be.true;
			});

			it('uses infinite scroll on the list if there are more than 100 items', function () {
				this._runnable.ssName = viewName + '-addItemsInfiniteScroll';

				var initialItemCount = AddItemFlyout.addItemsList.count();

				if (initialItemCount > 100) {
					var scriptFn = function () {
						var element = document.querySelector('.add-item-flyout [infinite-scroll]');

						// Do the scroll (which will load the items)
						element.scrollTop = element.scrollHeight;
					};

					browser.executeScript(scriptFn);

					AddItemFlyout.addItemsList.count().then(function (finalItemCount) {
						expect(initialItemCount).to.eventually.be.lessThan(finalItemCount);
					});

					// Scroll back up
					browser.executeScript('document.querySelector(".add-item-flyout [infinite-scroll]").scrollTop = 0;');
				}
			});

			it('displays the number of items', function () {
				this._runnable.ssName = viewName + '-noOfItems';

				expect(AddItemFlyout.addItemFlyoutInfo.getText()).to
					.eventually.contain('sorted by Item Name');
			});

			it('filters the list of items based on the search criterion', function () {
				this._runnable.ssName = viewName + '-addItemsSearch';

				// Get the number of items displayed, search for a particular item
				// and then compare the number displayed to the original number
				var initialItemCount = AddItemFlyout.addItemsList.count();

				AddItemFlyout.clearSearch();
				AddItemFlyout.addItemsSearchBy('ca');
				AddItemFlyout.addItemsList.count().then(function (finalItemCount) {
					expect(initialItemCount).to.eventually.not.equal(finalItemCount);
				});
			});

			it('shows a \'No items found\' message when search returns no results', function () {
				this._runnable.ssName = viewName + '-noItemsFound';

				AddItemFlyout.clearSearch();
				AddItemFlyout.addItemsSearchBy('zzz');
				expect(AddItemFlyout.addItemsList.count()).to.eventually.equal(0);

				var messageEl = element(by.css('.item-list-empty'));
				expect(messageEl.getText()).to.eventually.equal('No items found');
			});

			it('filters by workspace', function () {
				this._runnable.ssName = viewName + '-workspaceFilter';

				// Enable once related workspaces endpoint is ready for relationships
				if (viewName === 'ViewAffectedItemsView') {
					AddItemFlyout.clearSearch();
					var initialItemCount = AddItemFlyout.addItemsList.count();

					AddItemFlyout.changeWorkspaceFilter();
					AddItemFlyout.addItemsList.count().then(function (finalItemCount) {
						expect(initialItemCount).to.eventually.not.equal(finalItemCount);
					});
				}
			});
		});
	};
}

module.exports = AddItemSpec;
