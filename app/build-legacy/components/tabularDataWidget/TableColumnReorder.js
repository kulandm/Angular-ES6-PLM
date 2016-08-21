'use strict';

/**
 * @ngdoc directive
 * @name Directives.tableColumnReorder
 * @restrict A
 *
 * @description A feature of tabular data widget to support column re-ordering. This should be used with {@link TabularDataWidgetDirective}.
 *
 * ##Dependen
 * - Requires {@link Controllers/Controller.TabularDataWidgetController}
 *
 * @example
 * <doc:example>
 *     <doc:source>
 *          <tabular-data-widget columns="tableColumns" data="tableData" sorting="server" sort-change="sortChange(column, order)"
 *              perform-action="openFlyoutWindow(event, row, field)" table-column-reorder />
 *     </doc:source>
 * </doc:example>
 *
 * TODO: styling the drag drop process.
 */
angular.module('plm360.tabularDataWidget').directive('tableColumnReorder', ['$document', '$compile', '$timeout', '$q', function ($document, $compile, $timeout, $q) {
	return {
		priority: 2,
		restrict: 'A',
		replace: true,
		require: '^tabularDataWidget',
		link: function link(scope, element, attrs, tabularDataWidgetCtrl) {

			// observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
			// In order to use this way of finding whether DOM is ready, we need to observe a scope property used by TDW in its template.
			attrs.$observe('tableRender', function (value) {
				$timeout(function () {
					triggerInit();
				}, 0);
			});

			/**
    * @ngdoc method
    * @name Directives.tableColumnReorder#triggerInit
    * @methodOf Directives.tableColumnReorder
    * @description Initialization function
    */
			var triggerInit = function triggerInit() {
				element.addClass('reorder-columns');

				var columnHeaderElementList = element.find('th');
				var columnList = tabularDataWidgetCtrl.getColumnList();

				// Add resizer to the columns that supports resizing.
				for (var i = 0; i < columnList.length; i++) {
					if (columnList[i].enableColumnReordering !== true) {
						continue;
					}

					columnHeaderElementList.eq(i).attr('draggable', 'true');

					columnHeaderElementList.eq(i).unbind('dragstart').bind('dragstart', (function () {
						var columnId = columnList[i].field;
						return function (event) {
							event.dataTransfer.setData('text', columnId);
						};
					})());

					columnHeaderElementList.eq(i).bind('dragend', function (event) {
						// Add style related stuff here (if needed).
					});

					columnHeaderElementList.eq(i).bind('dragover', function (event) {
						event.preventDefault();
						// Add style related stuff here (if needed).
					});

					columnHeaderElementList.eq(i).bind('dragenter', function (event) {
						// Add style related stuff here (if needed).
					});

					columnHeaderElementList.eq(i).bind('dragleave', function (event) {
						// Add style related stuff here (if needed).
					});

					columnHeaderElementList.eq(i).unbind('drop').bind('drop', (function () {
						var columnId = columnList[i].field;
						return function (event) {
							event.preventDefault();
							event.stopPropagation();

							var sourceColumnId = event.dataTransfer.getData('text');
							var destinationColumnId = columnId;

							tabularDataWidgetCtrl.reOrderColumns(sourceColumnId, destinationColumnId);
						};
					})());
				}
			};

			scope.$on('$destroy', function () {
				// check if there is a need to for any clean up.
			});
		}
	};
}]);
//# sourceMappingURL=TableColumnReorder.js.map
