/**
 * @ngdoc directive
 * @name Component.PLMTableCheckbox
 * @restrict E
 *
 * @description This component builds the checkbox similar to A360
 * It can have the following attributes:
 * - isSelected: boolean value to make it selected
 * - isDisabled: boolean value to make it disabled
 * - addHoverClass: boolean value to indicate whether the checkbox should appear only on mouse hover
 * - onClick: callback function when checkbox is clicked
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<plm-table-checkbox 
 *			is-selected=""
 *			is-disabled=""
 *			add-hover-class=""
 *			on-click="">
 *		</plm-table-checkbox>
 *   </doc:source>
 * </doc:example>
 */

let PLMTableCheckbox = {
	bindings: {
		isSelected: '<',
		isDisabled: '<',
		addHoverClass: '<',
		onClick: '&'
	},
	templateUrl: 'build/components/plmTableCheckbox/plmTableCheckbox.html'
};

export default PLMTableCheckbox;