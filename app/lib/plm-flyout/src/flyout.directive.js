'use strict';

/**
 * @ngdoc directive
 * @name Directives.flyoutWindow
 * @restrict EA
 *
 * @description A flyout window directive that can be used to display contents
 * in a floating window that can be anchored to any control.
 * This directive is used in conjunction with {@link Services.FlyoutService}.
 *
 * ####-anchorEl: A reference to the anchor element associated with this flyout window.
 * ####-placement: A string containing information about how to position flyout according to anchor element.
 * It also supports secondary placement option that can be used for shifting width or height.
 * For example: "bottom-left" or "left-top" etc. Default to "bottom".
 * ####-showArrow: Boolean true, to show arrow pointing towards the anchored element. This is an optional property.
 * ####-flyoutId: The id to uniquely identify flyout (in the case of multiple flyouts).
 * ####-flyoutOrder: The order of the flyout (only useful when multiple flyouts are opened).
 * ####-backdropOption: Number which determines the backdrop behaviour:
 * 0 = hide backdrop, 1 = show backdrop with auto close, 2 = show backdrop without autoclose.
 * ####-baseClass: The name of the class that will be applied to the flyout window elements.
 * This is an optional property and should only be used when flyout window style needs to be customized.
 * ####-disableDefaultZIndexAllocation Boolean true, to disable z-index allocation.
 * This is an optional property and should be used carefully, as disabling z-index allocation
 * will make multiple flyout items hard to coexist. It should be used when we only need to
 * create a single flyout of a particular type (for example main menu flyout).
 *
 * ##Dependencies
 * - Requires {@link Services/FlyoutService}
 *
 * @example
 * <flyout-window>
 *     <div>contents to be transclude</div>
 * </flyout-window>
 *
 * TODO Reevaluate positioning calculation logic. Currently, we are relying
 * on watches to do that. Not at all appropriate.
 */
/* global plm360 */
class FlyoutWindow {

	constructor($timeout, FlyoutService, FlyoutWindowConstants, $q, _) {
		this.$timeout = $timeout;
		this.FlyoutService = FlyoutService;
		this.FlyoutWindowConstants = FlyoutWindowConstants;
		this.$q = $q;
		this._ = _;

		this.restrict = 'EA';
		this.replace = true;
		this.transclude = true;
		this.scope = {
			anchorEl: '=',
			placement: '@',
			showArrow: '@',
			flyoutId: '@',
			flyoutOrder: '@',
			backdropOption: '@',
			baseClass: '@',
			flyoutClass: '@',
			disableDefaultZIndexAllocation: '@',
			flyoutRendered: '&'
		};
		this.templateUrl = 'flyout.html';
	}

	link(scope, element, attrs) {
		let that = FlyoutWindow.instance;

		if (!scope.anchorEl) {
			throw new Error('anchorEl is required.');
		}

		if (!scope.placement) {
			throw new Error('placement is required.');
		}

		if (!scope.flyoutId) {
			throw new Error('flyout id is required.');
		}

		if (scope.disableDefaultZIndexAllocation !== 'true') {
			scope.flyoutDefaultStyle = {'z-index': scope.flyoutOrder + '10'};
			scope.backDropDefaultStyle = {'z-index': scope.flyoutOrder + '00'};
		}

		/**
		 * @ngdoc property
		 * @name Directives.flyoutWindow#showBackdrop
		 * @propertyOf Directives.flyoutWindow
		 * @description True, if backdrop is needed for a flyout.
		 * Note: This is more of a secondary property which depends on
		 * {@link #hideBackdrop} property. The reason we are not using
		 * {@link #hideBackdrop} directly is because it is a local scope
		 * property '@' and hence a string value.
		 */
		scope.backdropOption = scope.$eval(attrs.backdropOption);

		// Reference of the flyout dialog
		let flyoutDialog = element.children().eq(0);
		// Initial position of anchor element
		let anchorPositionInfo;

		let flyoutDialogWidth = 0;
		let flyoutDialogHeight = 0;

		// Applying classes to the flyout element
		let flyoutClass = scope.baseClass || that.FlyoutWindowConstants.DEFAULT_BASE_CLASS;
		element.addClass(`${flyoutClass}-window`);

		element.children().eq(0).addClass(flyoutClass);
		element.children().eq(0).addClass(scope.flyoutClass || '');

		element.children().eq(0).children().eq(0).addClass(`${flyoutClass}-arrow`);
		element.children().eq(0).children().eq(1).addClass(`${flyoutClass}-content`);

		element.children().eq(1).addClass(`${flyoutClass}-backdrop`);

		// Deferred object that will be resolved when tabular data widget is rendered
		let flyoutRenderDeferObj = that.$q.defer();

		// Observe function will be called on next digest cycle after compilation,
		// ensuring that the DOM is ready. In order to use this way of finding
		// whether DOM is ready, we need to observe a scope property used by TDW in its template.
		attrs.$observe('flyoutRender', value => {
			if (value.toString() === 'true') {
				flyoutRenderDeferObj.resolve();
			}
		});

		flyoutRenderDeferObj.promise.then(() => {
			positionFlyout();
			scope.flyoutRendered({flyoutId: scope.flyoutId});
		});

		// Currently, we are using scope watch to update the position of the flyout
		// when 1) anchor position or 2) flyout dimensions change. In angular,
		// there is no straight forward way to do that (other then using watch
		// or interval). This needs to be re-evaluated in future.
		let anchorEl = angular.element(scope.anchorEl);

		/**
		 * Watch for any change in the position of anchor. If there is any,
		 * we need to reposition the flyout.
		 */
		scope.$watch(() => {
			// Note: Using getBoundingClientRect as a return value is
			// causing error in FF.
			let anchorRectObj = anchorEl[0].getBoundingClientRect();
			return {
				width: anchorEl.prop('offsetWidth'),
				height: anchorEl.prop('offsetHeight'),
				top: anchorRectObj.top,
				left: anchorRectObj.left
			};
		}, (newValue, oldValue) => {
			if (!that._.isEqual(newValue, oldValue) || !anchorPositionInfo) {
				anchorPositionInfo = newValue;
				positionFlyout();
			}
		}, true);

		/**
		 * Watch for any change in the dimensions of the flyout. If there is any,
		 * we need to reposition the flyout. This watch will be useful for flyout
		 * with no fixed width or height.
		 */
		scope.$watch(() => {
			return {
				width: flyoutDialog.prop('offsetWidth'),
				height: flyoutDialog.prop('offsetHeight')
			};
		}, (newValue, oldValue) => {
			if (newValue.width !== oldValue.width || newValue.height !== oldValue.height) {
				flyoutDialogWidth = newValue.width;
				flyoutDialogHeight = newValue.height;
				positionFlyout();
			}
		}, true);

		/**
		 * @ngdoc method
		 * @name Directives.flyoutWindow#close
		 * @methodOf Directives.flyoutWindow
		 * @description Click event handler for flyout window element.
		 * This method is responsible to close the flyout, if backdrop is present.
		 *
		 * @param {Object} event The event object.
		 *
		 * TODO Support of dirty checking before closing.
		 */
		scope.close = (event) => {
			if (parseInt(scope.backdropOption) !== 0 && event.target === event.currentTarget) {
				event.preventDefault();
				event.stopPropagation();

				if (parseInt(scope.backdropOption) === 1) {
					that.FlyoutService.cancel(scope.flyoutId, 'click outside the dialog.');
				}
			}
		};

		/**
		 * @ngdoc method
		 * @name Directives.flyoutWindow#positionFlyout
		 * @methodOf Directives.flyoutWindow
		 * @description A method that positions flyout according to anchor
		 * and placement option.
		 */
		let positionFlyout = () => {
			let placementInfo = scope.placement.split('-');
			scope.primaryPlacement = placementInfo[0];
			let secondaryPlacement = placementInfo[1] || 'center';

			flyoutDialogWidth = flyoutDialog.prop('offsetWidth');
			flyoutDialogHeight = flyoutDialog.prop('offsetHeight');

			let anchorPosition;
			let marginDiff;

			// TODO These calculations needs to be revisited to support RTL layout (if needed).
			switch (scope.primaryPlacement) {
				case 'top':
					that.removePositionClasses(element.children().eq(0));
					element.children().eq(0).addClass('top');

					anchorPosition = that.anchorToTop(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);

					// The position of arrow should be according to the anchor
					// element rather than the flyout. Ideally the arrow should
					// be centered according to anchor element.
					marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
					scope.arrowStyle = {'margin-left': `${marginDiff}px`};
					break;

				case 'left':
					that.removePositionClasses(element.children().eq(0));
					element.children().eq(0).addClass('left');

					// TODO Meed to revisit the positioning in this scenario
					anchorPosition = that.anchorToLeft(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);

					marginDiff = (anchorPositionInfo.top + anchorPositionInfo.height / 2) - anchorPosition.y;
					scope.arrowStyle = {'margin-top': `${marginDiff}px`};
					break;

				case 'right':
					throw new Error('no support for right placement, yet');

				default:
					let pageHeight = document.body.offsetHeight;

					// Show the flyout at the top if there is not enough space
					// to show at the bottom of the page
					if (parseInt(pageHeight - angular.element(scope.anchorEl)[0].getBoundingClientRect().top) < parseInt(flyoutDialogHeight)) {
						that.removePositionClasses(element.children().eq(0));
						element.children().eq(0).addClass('top');

						anchorPosition = that.anchorToTop(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);

						marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
						scope.arrowStyle = {'margin-left': `${marginDiff}px`};
					} else {
						// Default is 'bottom'
						that.removePositionClasses(element.children().eq(0));
						element.children().eq(0).addClass('bottom');

						anchorPosition = that.anchorToBottom(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);

						marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
						scope.arrowStyle = {'margin-left': `${marginDiff}px`};
					}
					break;
			}

			flyoutDialog.css({
				left: `${anchorPosition.x}px`,
				top: `${anchorPosition.y}px`,
				display: 'block'
			});
		};

		// This property is only added to the scope for the purpose of detecting
		// when this directive is rendered. We can detect that by using this
		// in the template associated with this directive and then use
		// {@link Attribute#$observe} on it.
		// For more details please see {@link TableColumnResize}.
		scope.$isRendered = true;
	}

	/**
	 * @ngdoc method
	 * @name Directives.flyoutWindow#removePositionClasses
	 * @methodOf Directives.flyoutWindow
	 * @description Helper method to remove all position classes.
	 * This is used to update the flyout arrow when the flyout position changes
	 * after opening.
	 *
	 * @param {Object} element The flyout element
	 */
	removePositionClasses(element) {
		element.removeClass('top');
		element.removeClass('bottom');
	}

	/**
	 * @ngdoc method
	 * @name Directives.flyoutWindow#anchorToTop
	 * @methodOf Directives.flyoutWindow
	 * @description A private helper method that can be used to position target
	 * element at the top of the host element.
	 *
	 * @param {Number} targetElWidth Width of the target element.
	 * @param {Number} targetElHeight Height of the target element.
	 * @param {Object} hostSizeInfo Size information of the host element to which the target element will be anchored.
	 *                              For details about the properties of this object, please see {@link Services.FlyoutService#open}.
	 * @param {String} secondaryPlacement The secondary placement option that will dictate the shift in height or width (depending on the primary placement).
	 *
	 * @returns {Object} Object containing the anchor positions. {{x: number, y: number}}
	 */
	anchorToTop(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
		let anchorPositionX;
		let anchorPositionY;

		// Edge case: when flyout width exceeds page width
		let pageWidth = document.body.offsetWidth;

		switch (secondaryPlacement) {
			case 'left':
				anchorPositionX = hostSizeInfo.left;
				if ((hostSizeInfo.left + targetElWidth) > pageWidth) {
					// Based on the equation: flyoutPositionX = flyoutPositionX + ((hostSizeInfo.left + hostSizeInfo.width) - (flyoutPositionX + flyoutWidth))
					anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
				}
				break;

			case 'right':
				anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
				break;

			default:
				// Default is 'center'
				anchorPositionX = hostSizeInfo.left + (hostSizeInfo.width / 2) - (targetElWidth / 2);
				if ((hostSizeInfo.left + hostSizeInfo.width / 2) + (targetElWidth / 2) > pageWidth) {
					anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
				}
				break;
		}

		anchorPositionY = hostSizeInfo.top - targetElHeight;

		return {
			x: anchorPositionX,
			y: anchorPositionY
		};
	}

	/**
	 * @ngdoc method
	 * @name Directives.flyoutWindow#anchorToBottom
	 * @methodOf Directives.flyoutWindow
	 * @description A private helper method that can be used to position target
	 * element at the bottom of the host element.
	 *
	 * @param {Number} targetElWidth Width of the target element.
	 * @param {Number} targetElHeight Height of the target element.
	 * @param {Object} hostSizeInfo Size information of the host element to which the target element will be anchored.
	 *                              For details about the properties of this object, please see {@link Services.FlyoutService#open}.
	 * @param {String} secondaryPlacement The secondary placement option that will dictate the shift in height or width (depending on the primary placement).
	 *
	 * @returns {Object} Object containing the anchor positions. {{x: number, y: number}}
	 */
	anchorToBottom(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
		let anchorPositionX;
		let anchorPositionY;

		// Edge case: when flyout width exceeds page width
		let pageWidth = document.body.offsetWidth;

		switch (secondaryPlacement) {
			case 'left':
				anchorPositionX = hostSizeInfo.left;
				if ((hostSizeInfo.left + targetElWidth) > pageWidth) {
					// Based on the equation: flyoutPositionX = flyoutPositionX + ((hostSizeInfo.left + hostSizeInfo.width) - (flyoutPositionX + flyoutWidth))
					anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
				}
				break;

			case 'right':
				throw new Error('no support for right secondary placement, yet');

			default:
				// Default is 'center'
				anchorPositionX = hostSizeInfo.left + (hostSizeInfo.width / 2) - (targetElWidth / 2);
				if ((hostSizeInfo.left + hostSizeInfo.width / 2) + (targetElWidth / 2) > pageWidth) {
					anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
				}
				break;
		}

		anchorPositionY = hostSizeInfo.top + hostSizeInfo.height;

		return {
			x: anchorPositionX,
			y: anchorPositionY
		};
	}

	/**
	 * @ngdoc method
	 * @name Directives.flyoutWindow#anchorToLeft
	 * @methodOf Directives.flyoutWindow
	 * @description A private helper method that can be used to position target
	 * element on the left of the host element.
	 *
	 * @param {Number} targetElWidth Width of the target element.
	 * @param {Number} targetElHeight Height of the target element.
	 * @param {Object} hostSizeInfo Size information of the host element to which the target element will be anchored.
	 *                              For details about the properties of this object, please see {@link Services.FlyoutService#open}.
	 * @param {String} secondaryPlacement The secondary placement option that will dictate the shift in height or width (depending on the primary placement).
	 *
	 * @returns {Object} Object containing the anchor positions. {{x: number, y: number}}
	 */
	anchorToLeft(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
		let anchorPositionX;
		let anchorPositionY;

		switch (secondaryPlacement) {
			case 'top':
				anchorPositionY = hostSizeInfo.top;
				throw new Error('no support for top secondary placement, yet');

			case 'bottom':
				throw new Error('no support for bottom secondary placement, yet');

			default:
				// Default is 'center'
				anchorPositionY = hostSizeInfo.top + (hostSizeInfo.height / 2) - (targetElHeight / 2);
				break;
		}

		anchorPositionX = hostSizeInfo.left - targetElWidth;

		return {
			x: anchorPositionX,
			y: anchorPositionY
		};
	}

	/**
	 * @ngdoc directive
	 * @name Directives.flyoutWindow#directiveFactory
	 * @methodOf Directives.flyoutWindow
	 * @description The directive factory
	 */
	static directiveFactory($timeout, FlyoutService, FlyoutWindowConstants, $q, _) {
		FlyoutWindow.instance = new FlyoutWindow($timeout, FlyoutService, FlyoutWindowConstants, $q, _);
		return FlyoutWindow.instance;
	}
}

FlyoutWindow.directiveFactory.$inject = [
	'$timeout',
	'FlyoutService',
	'FlyoutWindowConstants',
	'$q',
	'_'
];

export default FlyoutWindow;
