/**
 * @ngdoc object
 * @name ViewTestsSpecs.BomConfigurationDropdownSpec
 *
 * @description This is the spec for the Bom Configuration dropdown
 *
 * ##Dependencies
 */
var ss = require('../../util/screenshoter');

function BomConfigurationDropdownSpec(dropdownComponent) {
	var bomConfigurationDropdown = dropdownComponent;

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.BomConfigurationDropdownSpec#testDropdownFunctionality
	 * @methodOf ViewTestsSpecs.BomConfigurationDropdownSpec
	 * @description Test the functionality of the dropdown
	 * 	Note: These tests expect the dropdown to have the following initial state:
	 * 			 - Bias dropdown has 'released' revision selected
	 * @param {String} viewName the name of the current view
	 */
	this.testDropdownFunctionality = function (viewName) {
		describe('<BomConfigurationDropdown>', function () {
			afterEach('Mark the screenshot under the current view', function () {
				if (this.currentTest.state === 'failed') {
					this.currentTest.ssName = viewName + '-' + this.currentTest.ssName;
				}
			});

			describe('[Opening and Closing]', function () {
				it('Opens the dropdown on clicking the anchor element', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-dropdownOpen';

					bomConfigurationDropdown.anchor.click();
					expect(bomConfigurationDropdown.isDisplayed()).to.eventually.be.true;
				});

				it('Displays the cancel button when open', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-cancelButton';

					expect(bomConfigurationDropdown.cancelButton.isDisplayed()).to.eventually.be.true;
				});

				it('Closes the dropdown when clicking the cancel button', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-cancelButtonCloses';

					bomConfigurationDropdown.cancelButton.click();
					expect(bomConfigurationDropdown.isDisplayed()).to.eventually.be.false;
				});

				it('Displays the save button when open', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-saveButton';

					bomConfigurationDropdown.anchor.click();
					expect(bomConfigurationDropdown.saveButton.isDisplayed()).to.eventually.be.true;
				});

				it('Closes the dropdown when clicking the save button', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-saveButtonCloses';

					bomConfigurationDropdown.saveButton.click();
					expect(bomConfigurationDropdown.isDisplayed()).to.eventually.be.false;
				});
			});

			describe('[Components]', function () {
				before(function () {
					bomConfigurationDropdown.open();
					expect(bomConfigurationDropdown.isDisplayed()).to.eventually.be.true;
				});

				after(function () {
					bomConfigurationDropdown.cancel();
					expect(bomConfigurationDropdown.isDisplayed()).to.eventually.be.false;
				});

				it('Displays datepicker open button when open', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-datepickerButton';

					expect(bomConfigurationDropdown.effectivityDatepicker.button.isDisplayed()).to.eventually.be.true;
				});

				xit('Displays the datepicker upon clicking the button', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-datepickerDisplays';

					bomConfigurationDropdown.effectivityDatepicker.button.click();
					expect(bomConfigurationDropdown.effectivityDatepicker.picker.isDisplayed()).to.eventually.be.true;
				});

				xit('Closes the open datepicker upon clicking outside of it', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-datepickerCloses';

					// The button to open datepicker will never be obscured by datepicker, so we can use it as a click target
					bomConfigurationDropdown.effectivityDatepicker.button.click();
					expect(bomConfigurationDropdown.effectivityDatepicker.picker.isDisplayed()).to.eventually.be.false;
				});

				it('Displays the bias dropdown button when open', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-biasDropdownButton';

					expect(bomConfigurationDropdown.biasDropdown.button.isDisplayed()).to.eventually.be.true;
				});

				it('Displays the bias dropdown upon clicking the button', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-biasDropdownOpens';

					bomConfigurationDropdown.biasDropdown.button.click();
					expect(bomConfigurationDropdown.biasDropdown.dropdown.isDisplayed()).to.eventually.be.true;
				});

				it('Closes the open bias dropdown upon clicking the button again', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-biasDropdownCloses';

					bomConfigurationDropdown.biasDropdown.button.click();
					bomConfigurationDropdown.biasDropdown.dropdown.waitForClose();
					expect(bomConfigurationDropdown.biasDropdown.dropdown.isDisplayed()).to.eventually.be.false;
				});

				it('Closes the open bias dropdown upon selecting an option', function () {
					this._runnable.ssName = 'BomConfigurationDropdown-biasDropdownClosesOnSelection';

					bomConfigurationDropdown.biasDropdown.setSelectedBias('working');
					expect(bomConfigurationDropdown.biasDropdown.dropdown.isDisplayed()).to.eventually.be.false;

					// cleanup
					bomConfigurationDropdown.biasDropdown.setSelectedBias('release');
				});
			});
		});
	};
}

module.exports = BomConfigurationDropdownSpec;
