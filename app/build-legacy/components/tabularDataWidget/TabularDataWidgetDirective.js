'use strict';

/**
 * @ngdoc directive
 * @name Directives.tabularDataWidget
 * @restrict E
 *
 * @description This directive is for the tabular data widget.
 *
 * - ##columns:
 * An Array with the following structure:
 * <pre>[
 *     {
 *         displayName: String, label that is going to be displayed in the header.
 *         field:       String, id of this column.
 *         width:       Number, the width of the column (in percentage).
 *                      // The default width will be 100/number of columns.
 *         enableColumnResizing:   true, to enable column resizing on a column.
 *                                 // The default value is false.
 *         enableColumnReordering: true, to enable column reordering on a column.
 *                                 // The default value is false.
 *                                 // Note: setting it true on a column will allow the
 *                                 // column to be dragged to other reorder-enabled
 *                                 // column and vice versa.
 *         enableColumnSorting:    true, to enable column sorting based on a column.
 *                                 // The default value is false.
 *         defaultSortColumn:      true, to set the default column to sort on.
 *                                 // The default value is false.
 *         renderer:     the template responsible for rendering the column.
 *         cellRenderer: the template responsible for rendering cells of the columns.
 *                       // The concept is similar to 'renderer'
 *                       // but in this case it is dynamic and
 *                       // can be used to handle scenarios of edit cell etc.
 *         isFixedWidth: true, if column width needs to be fixed.
 *     },
 *     {
 *         ... // Another column
 *     },
 * ];</pre>
 *
 * - ##data:
 * An Array of the following structure:
 * <pre>[
 *     {
 *         <String, matching 'field' in the column>: String, content of the cell.
 *         ... // For each column, you need to supply a key/pair value
 *         linkUrl: String, link for the href if linkPresent is set to true.
 *     },
 *     {
 *         // Another row of the table
 *     },
 * ];</pre>
 *
 * - ##customVars:
 *       The object that holds any variables that is needed across multiple renderers,
 *       supplied from the caller of this directive.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<tabular-data-widget columns="Object" data="Object" sorting="String" order="String" column="String" sort-change="Function"  />
 *   </doc:source>
 * </doc:example>
 *
 */
angular.module('plm360.tabularDataWidget').directive('tabularDataWidget', function ($compile) {
  return {
    priority: 100,
    restrict: 'E',
    controller: 'TabularDataWidgetController',
    replace: true,
    scope: {
      tableColumns: '=columns',
      tableData: '=data',
      performAction: '&',
      customVars: '='
    },
    templateUrl: 'components/tabularDataWidget/tabularDataWidget.html',
    link: function link(scope, element, attrs, TabularDataWidgetController) {

      // This property is only added to the scope for the purpose of detecting when this directive is rendered.
      // We can detect that by using this property in the template associated with this directive and then use
      // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}
      // scope.$isRendered = true;
      scope.$watchCollection('tableColumns', function () {
        // Changing this guy to allow call for rerendering of columns and headers
        scope.$isTableDataChanged = !scope.$isTableDataChanged;
      });
    }
  };
});
//# sourceMappingURL=TabularDataWidgetDirective.js.map
