'use strict';

/**
 * @ngdoc directive
 * @name Directives.tableColumnResize
 * @restrict A
 *
 * @description A feature of tabular data widget to support column resizing. This should be used with {@link TabularDataWidgetDirective}.
 * The concept is based on ng-grid.
 *
 * ##Dependencies
 * - Requires {@link Controllers/Controller.TabularDataWidgetController}
 *
 * @example
 * <doc:example>
 *     <doc:source>
 *          <tabular-data-widget columns="tableColumns" data="tableData" sorting="server" sort-change="sortChange(column, order)"
 *              perform-action="openFlyoutWindow(event, row, field)" table-column-resize />
 *     </doc:source>
 * </doc:example>
 *
 * TODO: need to revisit this directive once column re-ordering feature is implemented.
 * TODO: need to revisit this directive if we support hidding columns.
 * TODO: need to revisit this directive if we support min-width, max-width or fixed columns.
 */
angular.module('plm360.tabularDataWidget').directive('tableColumnResize', ['$document', '$compile', '$q', function ($document, $compile, $q) {
	/**
  * @ngdoc property
  * @name Directives.tableColumnResize#resizeOverlay
  * @propertyOf Directives.tableColumnResize
  * @description a resizeOverlay element that will be added to the table component when resize is in-process.
  */
	var resizeOverlay = angular.element('<div class="resize-overlay"></div>');

	/**
  * @ngdoc method
  * @name Directives.tableColumnResize#getAdjacentColumnIndex
  * @methodOf Directives.tableColumnResize
  * @description Find an index of the adjacent 'non-fixed' column based on the given start index.
  *
  * @param {Object[]} columnList : List of columns
  * @param {Number} startIndex : index from where the search will begin.
  *
  * @returns {Number/null} index of the adjacent column. Null in case no column found.
  */
	var getAdjacentColumnIndex = function getAdjacentColumnIndex(columnList, startIndex) {
		if (columnList.length <= 1 || startIndex < 0 || startIndex >= columnList.length) {
			return null;
		} else {
			for (var i = startIndex + 1; i < columnList.length; i++) {
				if (columnList[i].isFixedWidth !== true) {
					return i;
				}
			}

			for (i = startIndex - 1; i >= 0; i--) {
				if (columnList[i].isFixedWidth !== true) {
					return i;
				}
			}

			return null;
		}
	};

	return {
		priority: 1,
		restrict: 'A',
		replace: true,
		require: '^tabularDataWidget',
		link: function link(scope, element, attrs, tabularDataWidgetCtrl) {

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#resizerStartX
    * @propertyOf Directives.tableColumnResize
    * @description keep the starting position of the resizer when resizing process started.
    */
			scope.resizerStartX = 0;

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#resizerCurrentX
    * @propertyOf Directives.tableColumnResize
    * @description keep the current position of the resizer during resizing process.
    */
			scope.resizerCurrentX = 0;

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#currentColumnIndex
    * @propertyOf Directives.tableColumnResize
    * @description keep the current column index during resizing process.
    */
			scope.currentColumnIndex = -1;

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#tableLeft
    * @propertyOf Directives.tableColumnResize
    * @description reference of the left position of the table component.
    */
			scope.tableLeft = 0;

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#columnHeaderElementList
    * @propertyOf Directives.tableColumnResize
    * @description list of column header elements.
    */
			scope.columnHeaderElementList = null;

			/**
    * @ngdoc property
    * @name Directives.tableColumnResize#resizerList
    * @propertyOf Directives.tableColumnResize
    * @description list of resizers associated with the table header columns.
    */
			scope.resizerList = [];

			// observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
			// In order to use this way of finding whether DOM is ready, we need to observe a scope property used by TDW in its template.
			attrs.$observe('tableRender', function (value) {
				triggerInit();
			});

			scope.$watch(attrs.columns, function () {
				// TODO: use watch to update resizers whenever columns are changed. Will be needed when we support re-ordering.
			});

			/**
    * @ngdoc method
    * @name Directives.tableColumnResize#triggerInit
    * @methodOf Directives.tableColumnResize
    * @description Initialization function
    */
			var triggerInit = function triggerInit() {
				element.addClass('resizable-columns');
				scope.columnHeaderElementList = element.find('th');

				var columnList = tabularDataWidgetCtrl.getColumnList();

				// Add resizer to the columns that supports resizing.
				for (var i = 0; i < columnList.length; i++) {
					if (columnList[i].enableColumnResizing !== true) {
						continue;
					}

					var columnEl = scope.columnHeaderElementList.eq(i);

					var resizerEl = angular.element('<div class="column-resizer" position="right">');
					resizerEl.prop('column-index', i);
					columnEl.append(resizerEl);
					$compile(resizerEl);

					scope.resizerList.push(resizerEl);

					resizerEl.on('mousedown', function (event, args) {
						event.stopPropagation();

						// Get the left offset of the table
						scope.tableLeft = element[0].getBoundingClientRect().left;
						// Get the starting X position, which is the X coordinate of the click minus the table's offset
						scope.resizerStartX = event.clientX - scope.tableLeft;

						scope.currentColumnIndex = event.currentTarget['column-index'];

						// Append the resizer overlay
						element.append(resizeOverlay);
						// Place the resizer overlay at the start position
						resizeOverlay.css({ left: scope.resizerStartX + 'px' });

						// Add handlers for mouse move and up events
						$document.on('mouseup', mouseUp);
						$document.on('mousemove', mouseMove);
					});
				}
			};

			/**
    * @ngdoc method
    * @name Directives.tableColumnResize#mouseMove
    * @methodOf Directives.tableColumnResize
    * @description mouse move event handler. It will update the position of the resize overlay.
    *
    * @params {Object} event event object associated with the mouse move event.
    * @params {Object} args arguments associated with the event.
    */
			function mouseMove(event, args) {
				event.preventDefault();

				scope.resizerCurrentX = event.clientX - scope.tableLeft;

				if (scope.resizerCurrentX < 0) {
					scope.resizerCurrentX = 0;
				} else if (scope.resizerCurrentX > element[0].getBoundingClientRect().width) {
					scope.resizerCurrentX = element[0].getBoundingClientRect().width;
				}
				// move resize overlay's position
				resizeOverlay.css({ left: scope.resizerCurrentX + 'px' });
			}

			/**
    * @ngdoc method
    * @name Directives.tableColumnResize#mouseUp
    * @methodOf Directives.tableColumnResize
    * @description mouse up event handler. It will update the width of the columns.
    *
    * @params {Object} event event object associated with the mouse up event.
    * @params {Object} args arguments associated with the event.
    */
			function mouseUp(event, args) {
				event.preventDefault();
				resizeOverlay.remove();

				// Resize the column
				scope.resizerCurrentX = event.clientX - scope.tableLeft;
				var xDiff = scope.resizerCurrentX - scope.resizerStartX;

				if (xDiff === 0) {
					$document.off('mouseup', mouseUp);
					$document.off('mousemove', mouseMove);
					return;
				}

				// The other column to resize (the one next to this one)
				var col = scope.columnHeaderElementList.eq(scope.currentColumnIndex);

				// Get the new width
				var newWidth = col[0].getBoundingClientRect().width + xDiff;

				var newWidthInPercentage = Math.floor(newWidth / element[0].getBoundingClientRect().width * 100);
				col.css('width', newWidthInPercentage + '%');

				var columnToAdjust = getAdjacentColumnIndex(scope.columnHeaderElementList, scope.currentColumnIndex);

				if (columnToAdjust) {
					var newWidthForAdjacentCol = scope.columnHeaderElementList[columnToAdjust].getBoundingClientRect().width - xDiff;
					var newWidthForAdjacentColInPercentage = Math.floor(newWidthForAdjacentCol / element[0].getBoundingClientRect().width * 100);

					scope.columnHeaderElementList.eq(columnToAdjust).css('width', newWidthForAdjacentColInPercentage + '%');
				}

				$document.off('mouseup', mouseUp);
				$document.off('mousemove', mouseMove);
			}

			scope.$on('$destroy', function () {
				for (var i = 0; i < scope.resizerList.length; i++) {
					scope.resizerList[i].off('mousedown');
					scope.resizerList[i].remove();
				}
				scope.resizerList = null;

				$document.off('mousemove', mouseMove);
				$document.off('mouseup', mouseUp);
			});
		}
	};
}]);
//# sourceMappingURL=TableColumnResize.js.map
