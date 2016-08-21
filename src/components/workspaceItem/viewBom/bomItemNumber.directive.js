'use strict';

/**
 * @ngdoc directive
 * @name Directives.BomItemNumber
 * @restrict E
 *
 * @description This directive is for the item numbers in the bom table
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *     <bom-item-number
 *         field-data="Object"
 *         expand-row="Function"
 *         collpase-row="Function"
 *         is-expandable="Boolean"
 *         is-collapsed="Boolean"
 *		   edit-view="Boolean">
 *     </bom-item-number>
 *   </doc:source>
 * </doc:example>
 */
function BomItemNumber() {
	return {
		restrict: 'E',
		templateUrl: 'build/components/workspaceItem/viewBom/bomItemNumber.html',
		scope: {
			fieldData: '=',
			expandRow: '&',
			collapseRow: '&',
			isExpandable: '=',
			isCollapsed: '=',
			editView: '@'
		},
		link: function (scope, element, attrs) {
			scope.internalExpandRow = (event) => {
				event.stopPropagation();
				scope.expandRow();
			};
			scope.internalCollapseRow = (event) => {
				event.stopPropagation();
				scope.collapseRow();
			};

			if (scope.fieldData && angular.isUndefined(scope.fieldData.originalValue)) {
				let {depth, itemNumber} = scope.fieldData.value;
				scope.fieldData.originalValue = {depth: depth, itemNumber:itemNumber};
			}
			scope.$watch('fieldData', (newVal) => {
				if (newVal && angular.isUndefined(scope.fieldData.originalValue)) {
					let {depth, itemNumber} = scope.fieldData.value;
					scope.fieldData.originalValue = {depth: depth, itemNumber:itemNumber};
				}
			});
		}
	};
}

export default BomItemNumber;