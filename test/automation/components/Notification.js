/**
 * @ngdoc object
 * @name ViewTestsComponents.Notification
 *
 * @description This component corresponds to the create item function.
 *
 * ##Dependencies
 *
 */
function Notification() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.Notification#notification
	 * @propertyOf ViewTestsComponents.Notification
	 * @description `private` WebElement for notification toasts.
	 */
	var notification = element(by.css('.notification-toast'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getNotificationEl
	 * @methodOf ViewTestsComponents.Notification
	 * @description Gets the notification element
	 *
	 * @returns {Object} the notification element
	 */
	this.getNotificationEl = function () {
		return notification;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#isNotificationPresent
	 * @methodOf ViewTestsComponents.Notification
	 * @description Gets whether the notification is displayed.
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its display value is retrieved.
	 */
	this.isNotificationPresent = function () {
		return notification.isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getCSSClasses
	 * @methodOf ViewTestsComponents.Notification
	 * @description Gets the classes for the notification toast.
	 * To determine if it has the 'success' or 'error' class.
	 *
	 * @returns {Object} A promise for the class list for the notification element.
	 */
	this.getCSSClasses = function () {
		return notification.getAttribute('class');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getNotificationText
	 * @methodOf ViewTestsComponents.Notification
	 * @description Gets the notification message in the toast.
	 *
	 * @returns {String} The text of the notification.
	 */
	this.getNotificationText = function () {
		return notification.element(by.css('.notification-content')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getCloseIcon
	 * @methodOf ViewTestsComponents.Notification
	 * @description Returns the close icon.
	 *
	 * @returns {ElementFinder} The close icon.
	 */
	this.getCloseIcon = function () {
		return notification.element(by.css('a[ng-click="close()"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#waitForLink
	 * @methodOf ViewTestsComponents.Notification
	 * @description Wait for the notification 'View Details' link to be displayed
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its display value is retrieved.
	 */
	this.waitForLink = function () {
		browser.wait(function () {
			return notification.element(by.css('a[ng-click="showDetails()"]')).isDisplayed();
		}, 5000, 'Cannot find link on notification.');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getDetailsLink
	 * @methodOf ViewTestsComponents.Notification
	 * @description Returns the link to trigger notification details.
	 *
	 * @returns {ElementFinder} The link.
	 */
	this.getDetailsLink = function () {
		return notification.element(by.css('a[ng-click="showDetails()"]'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.Notification#getDetailsDialog
	 * @methodOf ViewTestsComponents.Notification
	 * @description The notification details dialog.
	 *
	 * @returns {ElementFinder} The dialog.
	 */
	this.getDetailsDialog = function () {
		return element(by.css('.notification-details'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.Notification#getSections
	 * @methodOf ViewTestsComponents.Notification
	 * @description The number of sections in the notification details dialog.
	 *
	 * @returns {ElementFinder} The sections.
	 */
	this.getSections = function () {
		return this.getDetailsDialog().all(by.css('.section'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.Notification#getCloseButton
	 * @methodOf ViewTestsComponents.Notification
	 * @description Returns the close button in the dialog.
	 *
	 * @returns {ElementFinder} The close button.
	 */
	this.getCloseButton = function () {
		return this.getDetailsDialog().element(by.css('a[ng-click="closeDialog()"]'));
	};
}

module.exports = new Notification();
