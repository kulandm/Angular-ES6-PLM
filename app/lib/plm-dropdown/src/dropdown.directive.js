'use strict';

/**
 * @ngdoc directive
 * @name Directives.dropdownWidget
 * @restrict E
 *
 * @description This directive is a simple PLM-customized dropdown widget that contains
 * transcluded content
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<dropdown-widget></dropdown-widget>
 *   </doc:source>
 * </doc:example>
 */
class DropdownWidget {

	/*
	 * @ngdoc method
	 * @name Directives.dropdownWidget#constructor
	 * @methodOf Directives.dropdownWidget
	 * @description The class constructor.
	 *
	 */
	constructor() {

		this.restrict = 'E';
		this.replace = true;
		this.transclude = true;
		this.controller = 'DropdownWidgetController';
		this.controllerAs = 'dropdownWidgetCtrl';
		this.templateUrl = 'dropdown.html';
		this.scope = {
			anchor: '@',
			hPos: '@',
			closeWith: '@',
			stopEventPropagation: '@'
		};
	}

	/**
	 * @ngdoc method
	 * @name Directives.dropdownWidget#link
	 * @methodOf Directives.dropdownWidget
	 * @description The link function
	 *
	 * @param {Object} Scope directive's scope
	 * @param {Object} element directive's element
	 * @param {Object} attrs The attributes of the element
	 * @param {Object} dropdownWidgetCtrl directive's controller
	 */
	link(scope, element, attrs, dropdownWidgetCtrl) {
		// Send the element to the controller
		dropdownWidgetCtrl.init(element);
	}

	/**
	* @ngdoc directive
	* @name Directives.dropdownWidget:directiveFactory
	*/
	static directiveFactory() {
		DropdownWidget.instance = new DropdownWidget();
		return DropdownWidget.instance;
	}
}

DropdownWidget.directiveFactory.$inject = [];

export default DropdownWidget;
