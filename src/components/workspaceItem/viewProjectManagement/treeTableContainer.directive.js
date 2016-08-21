'use strict';

/**
 * @ngdoc directive
 * @name Directives.treeTableContainer
 *
 * @description The container directive that will be used with gantt plugin to provide tree table component.
 * This directive doesn't create a child scope and relies on parent scope for key attributes.
 * See {@link #link} method for more details.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 * 	<doc:source>
 * 		<tree-table-container/>
 * 	</doc:source>
 * </doc:example>
 *
 * TODO: unit tests
 * TODO: not sure this is the right place for this container.
 */
function TreeTableContainerDirective() {
	/**
	 * @ngdoc property
	 * @name Directives.treeTableContainer.pluginScope
	 * @propertyOf Directives.treeTableContainer
	 * @description The scope property set by the parent component,
	 * that contains properties to be used by tree view and table components.
	 */
	let directive = {
		controller: 'ViewProjectManagementController',
		controllerAs: 'viewProjectManagementCtrl',
		templateUrl: 'build/components/workspaceItem/viewProjectManagement/treeTableContainer.html',
		link: (scope) => {}
	};

	return directive;
}

export default TreeTableContainerDirective;
