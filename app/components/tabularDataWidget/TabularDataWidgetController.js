'use strict';

/**
 * @ngdoc object
 * @name Controllers.TabularDataWidgetController
 * @description This controller corresponds to the Tabular Data Widget Directive.
 *
 * See {@link Directives.tabularDataWidget}.
 */

angular.module('plm360.tabularDataWidget').controller('TabularDataWidgetController', [
	'$scope',
	'_',
	'$log',
	function ($scope, _, $log) {
		/**
		 * @ngdoc property
		 * @name Controllers.TabularDataWidgetController#that
		 * @propertyOf Controllers.TabularDataWidgetController
		 * @description `private` Reference to the controller.
		 *
		 */
		var that = this;

		/**
		 * @ngdoc method
		 * @name Controllers.TabularDataWidgetController#getColumnList
		 * @methodOf Controllers.TabularDataWidgetController
		 * @description The list of columns, i.e. column headers.
		 *
		 * @returns {Object []} The list of column headers.
		 */
		that.getColumnList = function () {
			return $scope.tableColumns;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.TabularDataWidgetController#reOrderColumns
		 * @methodOf Controllers.TabularDataWidgetController
		 * @description Re-order columns according to the given column IDs.
		 *
		 * @param {String} sourceColumnId		The ID of the source column.
		 *
		 * Note: ID is another name of <code>field</code> property when used to uniquely identify column.
		 *
		 * @param {String} destinationColumnId	The ID of the destination column.
		 *
		 * Note: ID is another name of <code>field</code> property when used to uniquely identify column.
		 */
		that.reOrderColumns = function (sourceColumnId, destinationColumnId) {
			var sourceColumnIndex = -1;
			var destinationColumnIndex = -1;

			for (var i = 0, column; column = $scope.tableColumns[i]; i++) {
				if (column.field === sourceColumnId) {
					sourceColumnIndex = i;
					break;
				}
			}

			for (i = 0, column = null; column = $scope.tableColumns[i]; i++) {
				if (column.field === destinationColumnId) {
					destinationColumnIndex = i;
					break;
				}
			}

			if (sourceColumnIndex >= 0 && destinationColumnIndex >= 0) {
				$scope.$evalAsync(function () {
					var tempCol = $scope.tableColumns[sourceColumnIndex];
					$scope.tableColumns[sourceColumnIndex] = $scope.tableColumns[destinationColumnIndex];
					$scope.tableColumns[destinationColumnIndex] = tempCol;
				});
			} else {
				$log.error('Column reordering failed as source column or destination column is not found.');
			}
		};

		/**
		 * @ngdoc method
		 * @name Controller.TabularDataWidgetController#actionToPerform
		 * @methodOf Controllers.TabularDataWidgetController
		 * @description Calls the function defined in the scope.
		 *
		 * @param {Object} event	The event object.
		 * @param {Object} row		The row on which the event takes place.
		 * @param {String} field	The field of a row on which the event takes place.
		 */
		$scope.actionToPerform = function (event, row, field) {
			$scope.performAction({
				event: event,
				row: row,
				field: field
			});
		};

		/**
		 * @ngdoc method
		 * @name Controllers.TabularDataWidgetController#isEqualValue
		 * @methodOf Controllers.TabularDataWidgetController
		 * @description Compare whether the two are equal.
		 *
		 * @param {String} newValue			The new value that is changed to.
		 * @param {String} originalValue	The original value.
		 *
		 * @return {Boolean} True if both values are equal in content.
		 */
		$scope.isEqualValue = function (newValue, originalValue) {
			// var tmpNewValue = newValue.replace(/[^\w]/g, '');
			// var tmpOriginalValue = originalValue.replace(/[^\w]/g, '');
			// return tmpNewValue == tmpOriginalValue;
			return String(newValue) === String(originalValue);
		};

		/**
		 * @ngdoc method
		 * @name Controllers.TabularDataWidgetController#getWidth
		 * @methodOf Controllers.TabularDataWidgetController
		 * @description Calculate width based on the column's config options.
		 *
		 * @param {Object} column An object containing the column's configuration options.
		 *
		 * @return {String} Width of the column.
		 */
		$scope.getWidth = function (column) {
			if (!column.width) {
				return '';
			} else if (column.isFixedWidth === true) { // Use pixel width if column is fixed
				return column.width + 'px';
			}

			return column.width + '%';
		};
	}
]);
