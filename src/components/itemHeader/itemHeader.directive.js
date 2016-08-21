/**
 * @ngdoc directive
 * @name Directives.itemHeader
 * @restrict E
 *
 * @description This directive builds the item header on each tab
 * It expects the following attribute:
 * - workspaceId: the current workspaceId
 * - itemId: the current itemId
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<item-header workspace-id="" item-id=""></item-header>
 *   </doc:source>
 * </doc:example>
 */
function ItemHeaderDirective() {
	let directive = {
		restrict: 'E',
		transclude: true,
		replace: true,
		controller: 'ItemHeaderController',
		controllerAs: 'itemHeader',
		templateUrl: 'build/components/itemHeader/itemHeader.html',
		// link: link,
		scope: {
			workspaceId: '=',
			itemId: '='
		}
	};

	return directive;

	// function link (scope, element, attrs) {...}
}

// inject DI
// ItemHeaderDirective.$inject = [];

export default ItemHeaderDirective;
