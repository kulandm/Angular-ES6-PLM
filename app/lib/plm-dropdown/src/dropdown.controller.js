System.get('com/autodesk/UnderscoreService.js');

'use strict';

/**
 * @ngdoc object
 * @name Controllers.DropdownWidgetController.dropdownUID
 * @description Unique identifier for each dropdown
 */
let dropdownUID = 0;

/**
 * @ngdoc object
 * @name Controllers.DropdownWidgetController
 *
 * @description
 * ##Dependencies
 *
 */
class DropdownWidgetController {
	/*
	 * @ngdoc method
	 * @name Controllers.SearchPlmController#constructor
	 * @methodOf Controllers.SearchPlmController
	 * @description The class constructor.
	 */
	constructor($scope, $timeout, _) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this._ = _;

		++dropdownUID;
		/**
		 * @ngdoc property
		 * @name Controllers.DropdownWidgetController#dropdownUID
		 * @propertyOf Controllers.DropdownWidgetController
		 * @description The unique identifier for this dropdown
		 */
		this.dropdownUID = dropdownUID;

		/**
		 * @ngdoc property
		 * @name Controllers.DropdownWidgetController#isOpen
		 * @propertyOf Controllers.DropdownWidgetController
		 * @description Boolean var that controls whether the dropdown widget is open
		 */
		this.isOpen = false;

		/**
		 * @ngdoc property
		 * @name Controllers.DropdownWidgetController#anchorElement
		 * @propertyOf Controllers.DropdownWidgetController
		 * @description `private` The anchor element in the page
		 */
		this.anchorElement;

		/**
		 * @ngdoc property
		 * @name Controllers.DropdownWidgetController#element
		 * @propertyOf Controllers.DropdownWidgetController
		 * @description `private` This DOM element
		 */
		this.element;

		/**
		 * @ngdoc property
		 * @name Controllers.DropdownWidgetController#eventNamespace
		 * @propertyOf Controllers.DropdownWidgetController
		 * @description `private` The namespace for events the this dropdown registers
		 */
		this.eventNamespace = `dropdown_${this.dropdownUID}`;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#init
	 * @methodOf Controllers.DropdownWidgetController
	 * @description `private` Initializes the controller from the directive
	 *	and adds the open event to the anchor
	 *
	 * @param {Object} element The DOM element corresponding to this directive
	 *
	 */
	init(element) {
		this.element = $(element);

		// creating anchor element in near future to ensure that anchor element is DOM ready.
		this.$scope.$applyAsync(() => {
			this.anchorElement = document.querySelector(this.$scope.anchor);

			$(this.anchorElement).on('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				let wasOpen = this.isOpen;

				$(document).trigger('dropdownClose', [this.element.get(0)]);

				if (!wasOpen) {
					this.openDropdown(event);
				}
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#openDropdown
	 * @methodOf Controllers.DropdownWidgetController
	 * @description Opens the dropdown, positions it correctly,
	 *	and and adds the close events
	 *	Events are namespaced to the dropdown,
	 *		to avoid multiple dropdowns intefering wih one another
	 *
	 *	Events:
	 *		if the dropdown itself recieves a click,
	 *			if the dropdown is not a plain list
	 *				- Prevent the click from propagating further
	 *				- If the click hit a close-with element, close the dropdown and any nested dropdowns
	 *			Otherwise, just trigger a dropdown close
	 *		if the document recieves the click,
	 *			- Allow the click to propagate to trigger other document level events
	 *				preventing propagation might not stop those events from triggering anyways,
	 *					since they might have registered after the dropdown opened
	 *			- Close the dropdown and any nested dropdowns
	 *		if the document recieves a 'dropdownClose' event,
	 *			- if the event was fired by an opening dropdown and the opening dropdown is a subelement of this dropdown,
	 *					don't close this dropdown
	 *				Otherwise close the dropdown
	 *
	 * @param {Object} openEvent the event that triggered the open
	 */
	openDropdown(openEvent) {
		this.isOpen = true;
		this.setDropdownHorizontalPosition();
		angular.element(this.anchorElement).addClass('rotateCaretVertical');

		this.element.on(`click.${this.eventNamespace}`, (clickEvent) => {
			if (this.shouldStopClickEventPropagation()) {
				clickEvent.stopPropagation();
				if (this.isClickOnCloseWith(clickEvent.target)) {
					$(document).trigger(`dropdownClose`, [this.element.get(0)]);
				}
			} else {
				$(document).trigger(`dropdownClose`, [this.element.get(0)]);
			}
		});

		$(document).on(`click.${this.eventNamespace}`, (clickEvent) => {
			$(document).trigger(`dropdownClose`);
		});

		$(document).on(`dropdownClose.${this.eventNamespace}`, (event, openingDropdown) => {
			if (openingDropdown && $.contains(this.element.get(0), openingDropdown)) {
				return;
			}

			this.closeDropdown();
		});

		this.$scope.$digest();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#closeDropdown
	 * @methodOf Controllers.DropdownWidgetController
	 * @description Closes the dropdown and removes its events
	 */
	closeDropdown() {
		$(this.element).off(`.${this.eventNamespace}`);
		$(document).off(`.${this.eventNamespace}`);

		angular.element(this.anchorElement).removeClass('rotateCaretVertical');

		this.isOpen = false;
		this.$scope.$digest();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#shouldStopClickEventPropagation
	 * @methodOf Controllers.DropdownWidgetController
	 * @description Determines whether a click event should be able
	 *		to propagate beyond the dropdown itself
	 * @returns {Boolean} True if the dropdown should catch click events
	 */
	shouldStopClickEventPropagation() {
		return this.$scope.stopEventPropagation === 'true';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#isClickOnCloseWith
	 * @methodOf Controllers.DropdownWidgetController
	 * @description Determines if the click event occured on an element
	 *	in the dropdown that should close the dropdown
	 * @param {Object} clickedElement the element clicked
	 *
	 * @returns {Boolean} True the clicked element is within an element marked with closeWith
	 */
	isClickOnCloseWith(clickedElement) {
		let closeWithElements = $(this.$scope.closeWith.toString());
		return this._.some(closeWithElements, el => (el === clickedElement || $.contains(el, clickedElement)));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.DropdownWidgetController#setDropdownHorizontalPosition
	 * @methodOf Controllers.DropdownWidgetController
	 * @description Updates the dropdown's horizontal position
	 */
	setDropdownHorizontalPosition() {
		// Sets the position of the dropdown according to the anchor element, and the hPos
		this.$timeout(() => {
			// The child wrapper element for the ULs
			let dropdownWidgetWrapper = this.element.get(0).children[0];

			// This widget's width
			let dropdownWidgetWidth = parseInt($(dropdownWidgetWrapper).innerWidth(), 10);

			switch (this.$scope.hPos) {
				case 'left':
					angular.element(dropdownWidgetWrapper).css({
						left: -(dropdownWidgetWidth - this.anchorElement.offsetWidth) + 'px'
					});
					break;

				case 'right':
					angular.element(dropdownWidgetWrapper).css({
						left: '0px'
					});
					break;

				case 'center':
				default:
					angular.element(dropdownWidgetWrapper).css({
						left: -(dropdownWidgetWidth / 2 - this.anchorElement.offsetWidth / 2) + 'px'
					});
					break;
			}
		}, 0);
	}
}

export default DropdownWidgetController;
