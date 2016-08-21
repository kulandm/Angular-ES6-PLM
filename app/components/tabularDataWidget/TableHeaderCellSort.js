'use strict';

/**
 * @ngdoc directive
 * @name Directives.tableHeaderCellSort
 * @restrict A
 *
 * @description To set the sort order on the sortable table headers.<br>
 * This should be used with {@link Directives.tabularDataWidget} and {@link Directives.tableColumnSort}.
 *
 * - ##data
 * The column data.
 *
 * - ##sortOrder
 * The sort order - can either be 'asc' or 'desc'.
 *
 * - ##doSort
 * The sort function from the respective controllers.
 *
 * ##Dependencies
 * - Requires {@link Controllers.TabularDataWidgetController}
 *
 * TODO: Use ng-transclude with this directive.<br>
 * Currently, ng-transclude is not working well with ng-repeat and the column scopes we are creating.
 *
 */
angular.module('plm360.tabularDataWidget').directive('tableHeaderCellSort', function () {
	return {
		replace: false,
		templateUrl: 'components/tabularDataWidget/tableHeaderCellSort.html',
		scope: {
			data: '=',
			sortOrder: '=',
			doSort: '&'
		},
		link: function (scope, element, attrs) {
			/**
			 * @ngdoc method
			 * @name Directives.tableHeaderCellSort#callSort
			 * @methodOf Directives.tableHeaderCellSort
			 * @description Toggles the sort order upon click.
			 */
			scope.callSort = function () {
				var flipSort = scope.sortOrder === 'asc' ? 'desc' : 'asc';
				scope.sortOrder = scope.sortOrder === '' ? 'asc' : flipSort;
				scope.doSort({column: scope.data, sortOrder: scope.sortOrder});
			};
		}
	};
});
