'use strict';

/**
 * @ngdoc directive
 * @name Directives.TreeView
 * @restrict E
 *
 * @description The basic implementation of tree view. It supports lazy loading of child nodes.
 * ####- rootNodes: An array of root nodes (one or more). Node object will have the following properties
 * [
 *      {
 *          isExpandable : true, if node has children. Note: This property will control whether a node will have an expander control with it.
 *          children : the list of child nodes of the node.
 *          collapsed : true, if node is currently in collapsed state.
 *          valueRenderer : the template responsible for rendering node value.
 *      },
 *      ... // other nodes
 * ];
 * ####- title: String, the header title of the tree view. This is optional.
 * ####- displayField: String, the field that will be displayed in the tree view.
 * ####- toggleNode: The function that's going to be called on parent scope when node collapsed state changes.
 * ####- treeSummary: An optional summary that can be displayed at the end of the tree view.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *     <doc:source>
 *         <tree-view root-nodes='Array' title='String' displayField='String' toggle-node='Function' />
 *     </doc:source>
 * </doc.example>
 *
 */
function TreeViewDirective() {

	let directive = {
		restrict: 'E',
		replace: true,
		controller: 'ViewProjectManagementController',
		controllerAs: 'viewProjectManagementCtrl',
		scope: {
			rootNodes: '=',
			treeTitle: '@',
			displayField: '@',
			toggleNode: '&',
			treeSummary: '@'
		},
		templateUrl: 'build/components/workspaceItem/viewProjectManagement/treeView.html',
		link: (scope) => {
			/**
			 * @ngdoc method
			 * @name Directives.TreeView#toggle
			 * @methodOf Directives.TreeView
			 * @description calls {@link scope#toggleNode} method.
			 *
			 * @param {Object} node Node to be toggled.
			 */
			scope.toggle = (node) => {
				if (node.isExpandable === true) {
					scope.toggleNode({
						collapsed: node.collapsed === true ? false : true,
						node: node
					});
				}
			};
		}
	};

	return directive;
}

export default TreeViewDirective;
