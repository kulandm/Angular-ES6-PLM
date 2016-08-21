/**
 * @ngdoc directive
 * @name Directives.viewBomConfiguration
 * @restrict E
 *
 * @description 
 *
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<bom-configuration-dropdown anchor="", initialDate="", initialBias="", on-save=""></bom-configuration-dropdown>
 *   </doc:source>
 * </doc:example>
 */
function BomConfigurationDropdownDirective() {
	let directive = {
		restrict: 'E',
		templateUrl: 'build/components/workspaceItem/viewBom/bomConfigurationDropdown.html',
		controller: 'BomConfigurationDropdownController',
		controllerAs: 'bomConfigCtrl',
		bindToController: true,
		scope: {
			anchor: '@',
			initialDate: '=',
			initialBias: '=',
			onSave: '&'
		},
		link: function (scope, element, attrs, controller) {
			// Update the dialog before it opens
			$(attrs.anchor).on('click', () => {
				controller.updateDialog();
			});
		}
	};

	return directive;
}
export default BomConfigurationDropdownDirective;
