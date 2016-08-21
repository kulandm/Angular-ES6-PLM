/**
 * @ngdoc directive
 * @name Directives.BomPinning
 * @restrict E
 *
 * @description A directive that wraps the 'pin' for pinned rows in the bom
 *	Allows for toggling the pinning by clicking the pin in edit mode
 *
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<bom-pinning></bom-pinning>
 *   </doc:source>
 * </doc:example>
 */
function BomPinning() {
	let directive = {
		restrict: 'E',
		templateUrl: 'build/components/workspaceItem/viewBom/bomPinning.html',
		scope: {
			fieldData: '=',
            editView: '@',
			onToggle: '&'
		},
		link: function (scope, element, attrs) {
			scope.internalOnToggle = () => {
                scope.fieldData.value = scope.fieldData.value === 'true' ? 'false' : 'true';
                scope.onToggle();
            };

            scope.isPinned = () => {
                return scope.fieldData.value === 'true';
            };
		}
	};

	return directive;
}

export default angular.module(__moduleName, []).directive('bomPinning', BomPinning);
