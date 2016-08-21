'use strict';

/**
 * @ngdoc directive
 * @name Directives.tableColumnSort
 * @restrict A
 *
 * @description To get the default sort column of tabular data widget.<br>
 * This should be used with {@link Directives.tabularDataWidget}.
 *
 * ##Dependencies
 * - Requires {@link Controllers.TabularDataWidgetController}
 *
 */
angular.module('plm360.tabularDataWidget').directive('tableColumnSort', [
	'$document',
	'$compile',
	'$timeout',
	'$log',
	'$q',
	'_',
	function ($document, $compile, $timeout, $log, $q, _) {
		return {
			priority: 3,
			restrict: 'A',
			replace: true,
			require: '^tabularDataWidget',
			link: function (scope, element, attrs, tabularDataWidgetCtrl) {

				/**
				 * @ngdoc property
				 * @name Directives.tableColumnSort#columnHeaders
				 * @propertyOf Directives.tableColumnSort
				 * @description `private` The list of table header, corresponds to <code>tableColumns</code> in TDWCtrl.
				 */
				var columnHeaders;

				/**
				 * @ngdoc property
				 * @name Directives.tableColumnSort#columnHeadersElements
				 * @propertyOf Directives.tableColumnSort
				 * @description `private` The list of actual table header elements.
				 */
				var columnHeadersElements;

				/**
				 * @ngdoc property
				 * @name Directives.tableColumnSort#columnScopeMap
				 * @propertyOf Directives.tableColumnSort
				 * @description The map to trace each column to its respective column scope.
				 */
				scope.columnScopeMap = {};

				// Observe function will be called on next digest cycle after compilation,
				// ensuring that the DOM is ready. In order to use this way of finding whether
				// DOM is ready, we need to observe a scope property used by TDW in its template.
				attrs.$observe('tableRender', function (value) {
					triggerInit();
				});

				/**
				 * @ngdoc method
				 * @name Directives.tableColumnSort#triggerInit
				 * @methodOf Directives.tableColumnSort
				 * @description Initialization function
				 */
				var triggerInit = function () {

					// Destroy all the previously stored column scopes
					// since the triggerInit function is called multiple times
					_.each(scope.columnScopeMap, function (childScope) {
						childScope.$destroy();
					});

					/**
					 * @ngdoc property
					 * @name Directives.tableColumnSort#currentSortColId
					 * @propertyOf Directives.tableColumnSort
					 * @description The current column that is being sorted.
					 */
					scope.currentSortColId = null;

					/**
					 * @ngdoc property
					 * @name Directives.tableColumnSort#sortConfig
					 * @propertyOf Directives.tableColumnSort
					 * @description The sort configuration from respective controllers.<br>
					 * <code>disableInitialSort</code>: True, to disable the initial sorting and remove the sort carets.<br>
					 * <code>applySort</code>: The actual sort function from the respective controllers.
					 */
					scope.sortConfig = scope.$eval(attrs.tableColumnSort);

					if (!scope.sortConfig) {
						$log.error('TableColumnSort is missing attrs!');
					}

					columnHeaders = tabularDataWidgetCtrl.getColumnList();
					columnHeadersElements = element.find('th');

					// Check if there is a user-defined default sort column
					var defaultColumn = _.find(columnHeaders, function (column) {
						return column.defaultSortColumn === true;
					});

					// If user did not define a default sort column,
					// set default to first column with enableColumnSorting
					if (!defaultColumn) {
						defaultColumn = _.find(columnHeaders, function (column) {
							return column.enableColumnSorting === true;
						});
					}

					// Find the sortable table columns
					if (defaultColumn && scope.sortConfig) {
						_.each(columnHeaders, function (column, index) {
							if (column.enableColumnSorting === true) {
								// Set the current column to be sorted as the default column
								scope.currentSortColId = defaultColumn.field;

								// Create a scope for each sortable column
								var columnScope = scope.$new();

								columnScope.data = column;
								// There are three options for sortOrder: 'asc', 'desc', and '' (no sort).
								// The sort order for each column defaults to 'asc' unless specified.
								// If disableInitialSort is true, sort order should be '' for all columns.
								if (scope.sortConfig.initialSortOrder === 'desc') {
									var descending = scope.sortConfig.disableInitialSort ? '' : 'desc';
									columnScope.sortOrder = column === defaultColumn ? descending : '';
								} else {
									var ascending = scope.sortConfig.disableInitialSort ? '' : 'asc';
									columnScope.sortOrder = column === defaultColumn ? ascending : '';
								}

								// $compile cannot be performed on <th> as it affects ng-repeat,
								// therefore, perform $compile on the <span> child of <th>
								var spanChild = columnHeadersElements.eq(index).children().eq(0);

								spanChild.attr('table-header-cell-sort', '');
								spanChild.attr('data', 'data');
								spanChild.attr('sort-order', 'sortOrder');
								spanChild.attr('do-sort', 'doSort(column, sortOrder)');

								var el = $compile(spanChild)(columnScope);

								// Save the columnScope to the map
								scope.columnScopeMap[column.field] = columnScope;
							}
						});
					} else {
						$log.error('No column enabled for sorting!');
					}
				};

				/**
				 * @ngdoc method
				 * @name Directives.tableColumnSort#doSort
				 * @methodOf Directives.tableColumnSort
				 * @description Determines the current column to be sorted and
				 * calls the sort function in the respective controllers.
				 *
				 * @params {Object} column		The object of the current column to be sorted.
				 * @params {String} sortOrder	The sort order - can either 'asc' or 'desc'.
				 */
				scope.doSort = function (column, sortOrder) {
					// If the column to be sorted is a new column,
					// reset the sort order of the previous column,
					// and the set new column to the current sort column.
					if (column.field !== scope.currentSortColId) {
						scope.columnScopeMap[scope.currentSortColId].sortOrder = '';
						scope.currentSortColId = column.field;
					}

					if (scope.sortConfig.applySort) {
						scope.sortConfig.applySort(column.field, sortOrder, scope);
					} else {
						$log.error('Sort function is not defined in controller!');
					}
				};
			}
		};
	}
]);
