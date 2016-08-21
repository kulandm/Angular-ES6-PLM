/**
 * FIELDWRAPPER WILL BE DEPRECATED.
 * If you are modifying it, please do so in the new FieldSelector component.
 */
'use strict';

/**
 * @ngdoc directive
 * @name Directives.fieldWrapper
 * @restrict A
 *
 * @description This directive wraps fieldView and fieldEdit,
 * branching to the proper directive based on `isEdit`.
 *
 * - useTruncation <span class="label">Boolean</span> If truncation should happen.
 * - fieldData <span class="label">Object</span> Contains the data.
 * - isEdit <span class="label">Boolean</span> Flag for whether the view is in
 * editing mode. For Affected Items, this flag is also determined by other
 * conditions, e.g. editability, lifecycle transition, etc.
 * - isEditActive <span class="label">Boolean</span> Flag for whether the
 * current field is being edited.
 * - isVisible <span class="label">Boolean</span> For Affected Items - Flag for
 * whether a custom column is visible.
 * - editMode <span class="label">Boolean</span> For Affected Items - Since
 * `isEdit` is determined by other conditions, this is a flag for whether the
 * view is in edit mode.
 * - uom <span class="label">String</span> For Affected Items - A string for
 * `uom` in custom columns.
 * - onChange <span class="label">Function</span> Callback to the method that's
 * going to be called every time the form element is updated.
 * - waiting <span class="label">Boolean</span> Two-way binded to a boolean var
 * in the controller that controls when saving is underway, so as to disable
 * controls and block editing.
 * - placeholder <span class="label">String</span> String used as placeholder
 * text for inputs that support it (if not supplied, it will be ignored).
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<field-wrapper field-data="Object" is-edit="Boolean"/>
 *   </doc:source>
 * </doc:example>
 */

angular.module('plm360.fieldTypes').directive('fieldWrapper', ['$compile', '$location', '_', function ($compile, $location, _) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      useTruncation: '=',
      fieldData: '=',
      isEdit: '=',
      isEditActive: '=',
      isVisible: '=',
      isCreate: '@',
      editMode: '=',
      uom: '@',
      onChange: '=',
      waiting: '=',
      placeholder: '@'
    },
    templateUrl: 'components/fieldTypes/fieldWrapper.html',
    link: function link(scope, element, attrs) {
      scope.isDetailsEdit = function () {
        return $location.search().tab === 'workspace-item-details';
      };
    }
  };
}]);
//# sourceMappingURL=FieldWrapperDirective.js.map
