/**
 * @ngdoc directive
 * @name Directives.itemViewer
 * @restrict E
 *
 * @description This directive is the item viewer of PLM360 (right side nav)
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<item-viewer />
 *   </doc:source>
 * </doc:example>
 */
function ItemViewerDirective() {
	let directive = {
		restrict: 'E',
		transclude: true,
		controller: 'ItemViewerController',
		controllerAs: 'itemViewerCtrl',
		templateUrl: 'build/components/itemViewer/itemViewer.html',
		scope: {},
		link: function (scope, element, attrs, itemViewerCtrl) {
			itemViewerCtrl.init(element);
		}
	};

	return directive;

	// function link (scope, element, attrs) {...}
}

// inject DI
// ItemViewerDirective.$inject = [];

export default ItemViewerDirective;
