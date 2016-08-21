/**
 * @ngdoc directive
 * @name Directives.commandBar
 * @restrict E
 *
 * @description This directive builds the command bar at the header of each tab/view
 * It expects the following attribute:
 * - workspaceId: the current workspaceId
 * - itemId: the current itemId
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<command-bar workspace-id="" item-id=""></command-bar>
 *   </doc:source>
 * </doc:example>
 */
function CommandBarDirective(/* inject DI*/) {
	let directive = {
		restrict: 'E',
		transclude: true,
		replace: true,
		controller: 'CommandBarController',
		controllerAs: 'commandBarCtrl',
		templateUrl: 'build/components/workspaceItem/commandBar/commandBar.html',
		scope: {
			parentCtrl: '='
		},
		link: function (scope, element, attrs, commandBarCtrl) {}
	};

	return directive;
}

// inject DI
// CommandBarDirective.$inject = [];

export default CommandBarDirective;
