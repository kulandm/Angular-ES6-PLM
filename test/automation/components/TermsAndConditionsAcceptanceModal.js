/**
 * @ngdoc object
 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal
 *
 * @description This component corresponds to the terms and conditions acceptance modal .
 *
 */
function TermsAndConditionsAcceptanceModal() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal#acceptedCheckbox
	 * @propertyOf ViewTestsComponents.TermsAndConditionsAcceptanceModal
	 * @description `private` The accepted checkbox of the modal.
	 */
	var acceptedCheckbox = by.css('input#accepted-checkbox');

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal#okButton
	 * @propertyOf ViewTestsComponents.TermsAndConditionsAcceptanceModal
	 * @description `private` The OK button of the modal.
	 */
	var okButton = by.css('div.agreement-acceptance-dialog-actions button.md-primary');

	/**
	 * @ngdoc function
	 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal#acceptAndClose
	 * @description Check the accepted checkbox and click the ok button for accepting the agreement
	 */
	function acceptAndClose() {
		var EC = protractor.ExpectedConditions;
		var acceptTermsCheckboxEl = element(acceptedCheckbox);
		var acceptTermsButtonEl = element(okButton);
		var isClickable = EC.elementToBeClickable(acceptTermsCheckboxEl);
		browser.wait(isClickable, 5000);
		acceptTermsCheckboxEl.click();
		return acceptTermsButtonEl.click();
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal#acceptAndClose
	 * @description Check the accepted checkbox and click the ok button for accepting the agreement
	 *
	 * @param {Promise} The promise to resolve when the buttons is clicked
	 * @param {Number} A counter for the times the checkbox is searched
	 */
	function check(deferred, counter) {
		browser.driver.isElementPresent(acceptedCheckbox).then(function (present) {
			/*
			* @todo HACKY
			* Perhaps in future releases of protractor accessing this element won't be so tricky,
			* we should revisit this approach.
			*
			* This is needed for being able to access the modal elements.
			* If the checkbox element is not found, so not present, we discount the counter
			* and call again this function every half second recursively, all instances of this function
			* use the same deferred object and counter.
			*
			* This will be repeated several times, eventually the element will be present or not.
			*
			*/
			if (!present) {
				if (counter--) {
					setTimeout(function () {
						check(deferred, counter);
					}, 500);
				} else {
					deferred.fulfill(true);
				}
			} else {
				deferred.fulfill(acceptAndClose());
			}
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.TermsAndConditionsAcceptanceModal#checkAndDismiss
	 * @propertyOf ViewTestsComponents.checkAndDismiss
	 * @description Checks whether the modal is being shown and dismiss it
	 *
	 * @returns {Boolean} True, if the task can be completed.
	 */
	this.checkAcceptAndClose = function (time) {
		// Quantity of times the element must be searched until continue
		/*
			Note: {@link #check} method is causing issues when running tests on server.
			Temporary solution is added to address the build concerned. {@link #check} method needs to be revisited.

		var counter = 30;
		return browser.driver.wait(function () {
			return check(protractor.promise.defer(), counter);
		});*/

		// This approach is taken from {@link LoginLandingPage#signIn} method.
		var deferred = protractor.promise.defer();
		var timer = (new Date()).getTime();
		var milliseconds = time || 15000;

		var loop = function () {
			if ((new Date()).getTime() - timer > milliseconds) {
				deferred.fulfill(true);
				return;
			}

			browser.driver.isElementPresent(acceptedCheckbox).then(function (isPresent) {
				if (isPresent === true) {
					acceptAndClose().then(function () {
						browser.params.acceptedAgreement = true;
						deferred.fulfill(browser.params.acceptedAgreement);
					});
				} else {
					loop();
				}
			}, function () {
				loop();
			});
		};
		loop();
		return deferred.promise;
	};
}

module.exports = new TermsAndConditionsAcceptanceModal();