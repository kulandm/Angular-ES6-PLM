/**
 * @ngdoc directive
 * @name Directives.WorkspaceTableauFlyout
 * @restrict E
 *
 * @description This directive is the component for configure current view of columns in workspace items view
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<workspace-tableau-flyout columns="ObjectConfig" callback="StringEvent" />
 *   </doc:source>
 * </doc:example>
 */
function WorkspaceTableauFlyoutDirective() {
	let directive = {
		restrict: 'E',
		transclude: true,
		controller: 'WorkspaceTableauFlyoutController',
		controllerAs: 'ctrl',
		templateUrl: 'build/components/workspaceTableauFlyout/workspaceTableauFlyout.html',
		scope: {
			columns: '=',
			callback: '='
		},
		bindToController: true
	};

	return directive;
}

export default WorkspaceTableauFlyoutDirective;
