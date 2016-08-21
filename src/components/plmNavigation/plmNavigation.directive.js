/**
 * @ngdoc directive
 * @name Directives.plmNavigation
 * @restrict E
 *
 * @description This directive is the main menu of PLM360 (sidebar)
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<plm-navigation />
 *   </doc:source>
 * </doc:example>
 */

function PLMNavigationDirective() {
	let directive = {
		restrict: 'E',
		transclude: true,
		replace: true,
		controller: 'PLMNavigationController',
		controllerAs: 'plmNavigationCtrl',
		templateUrl: 'build/components/plmNavigation/plmNavigation.html',
		scope: {},
		link: function (scope, element, attrs, plmNavigationCtrl) {
			// Passes element to the controller
			// plmNavigationCtrl.init(element);
		}
	};

	return directive;

	// function link (scope, element, attrs) {...}
}

// inject DI
// PLMNavigationDirective.$inject = [];

export default PLMNavigationDirective;
