'use strict';

angular.module('plm360.typeahead', [])
/**
 * @ngdoc directive
 * @name Directives.typeaheadWidget
 * @restrict E
 *
 * @description A simple typeahead widget that receives data and returns a filtered array of that data
 * ####- data: The array with all the objects to filter on
 * ####- filter: The key to use for the search
 * ####- matched: The array containing the objects that matched the filtering
 * ####- caseSensitive: Boolean val to determine if the filter should take into account the case of the typed val
 * ####- typedVal: The string that was typed in the input box
 * ####- remote: The function to be called for remote filtering. This property will also be used to identify whether we want local or remote filtering.
 * ####- waitTime: The number of milliseconds to wait before filtering the data. This is an optional property.
 * ####- filterDropdownData: The data to populate dropdown. This is an optional property.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *        <typeahead-widget data="Array" matched="Array" filter="String" case-sensitive="String" typed-val="Object"></typeahead-widget>
 *   </doc:source>
 * </doc:example>
 */

.directive('typeaheadWidget', [
	'$rootScope',
	'$compile',
	'$document',
	'$parse',
	'$log',
	'$timeout',
	'$window',
	function ($rootScope, $compile, $document, $parse, $log, $timeout, $window) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				data: '=',
				filter: '@',
				matched: '=',
				caseSensitive: '@',
				typedVal: '=',
				waitTime: '@',
				remoteFilter: '&',
				isRemote: '@',
				optionChanged: '&',
				filterDropdownData: '=',
				percentage: '@'
			},
			templateUrl: 'components/typeahead/typeaheadWidget.html',
			link: function (scope, element, attributes) {
				// Handles error
				if (angular.isUndefined(scope.typedVal)) {
					$log.error('You must supply a typedVal to begin with, even if empty, for the TypeaheadWidget!');
					return;
				}

				/**
				 * @ngdoc property
				 * @name Directives.typeaheadWidget#waitTime
				 * @propertyOf Directives.typeaheadWidget
				 * @description The wait time in milliseconds to be used.
				 */
				var waitTime = scope.$eval(attributes.waitTime) || 0;

				/**
				 * @ngdoc property
				 * @name Directives.typeaheadWidget#timeoutPromise
				 * @propertyOf Directives.typeaheadWidget
				 * @description The timeout promise to allow stacked calls to be cancelled later.
				 */
				var timeoutPromise;

				/**
				 * @ngdoc property
				 * @name Directives.typeaheadWidget#parentEl
				 * @propertyOf Directives.typeaheadWidget
				 * @description The parent element of the element used with adjustMaxHeight.
				 */
				scope.parentEl = element;

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#toggled
				 * @propertyOf Directives.typeaheadWidget
				 * @description The status of the filter dropdown.
				 */
				scope.toggled = function (open) {
					scope.dropdownStatus = open;
				};

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#init
				 * @propertyOf Directives.typeaheadWidget
				 * @description Initialization function
				 */
				var init = function () {
					var dropdownCaretEl;
					var searchEl;

					if (angular.isDefined(scope.filterDropdownData) &&
						angular.isDefined(scope.filterDropdownData.selectedItemId)) {

						/**
						 * @ngdoc property
						 * @name Directives.typeaheadWidget#selectedOptionId
						 * @propertyOf Directives.typeaheadWidget
						 * @description The selected item id in the dropdown.
						 */
						scope.selectedOptionId = scope.filterDropdownData.selectedItemId;

						/**
						 * @ngdoc method
						 * @name Directives.typeaheadWidget#selectOption
						 * @methodOf Directives.typeaheadWidget
						 * @description Changes the selected option according to the index being passed.
						 */
						scope.onSelectionChange = function () {
							scope.selectedOptionId = scope.selectedOption.link;
							scope.placeholder = $rootScope.bundle.text.search + ' ' + scope.selectedOption.title;
							scope.optionChanged({selectedId: scope.selectedOption.link});
						};

						/**
						 * @ngdoc property
						 * @name Directives.typeaheadWidget#placeholder
						 * @propertyOf Directives.typeaheadWidget
						 * @description Text for the placeholder in search bar.
						 */
						scope.placeholder = $rootScope.bundle.text.search + ' ' + scope.filterDropdownData.itemList[0].title;
					} else {
						scope.placeholder = $rootScope.bundle.text.search;
					}
				};

				init();

				scope.$watch('filterDropdownData', function () {
					init();
				});

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#removeTypedVal
				 * @methodOf Directives.typeaheadWidget
				 * @description A method to clear the search input.
				 */
				scope.removeTypedVal = function () {
					scope.typedVal = '';
				};

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#scheduleSearchWithTimeout
				 * @methodOf Directives.typeaheadWidget
				 * @description A private method to schedule filter with timeout.
				 *
				 * @param {String} inputValue Input value to be used for filtering.
				 * @private
				 */
				var scheduleFilterWithTimeout = function (inputValue) {
					timeoutPromise = $timeout(function () {
						filterValue(inputValue);
					}, waitTime);
				};

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#cancelPreviousTimeout
				 * @methodOf Directives.typeaheadWidget
				 * @description A private method to cancel a scheduled filter.
				 *
				 * @private
				 */
				var cancelPreviousTimeout = function () {
					if (timeoutPromise) {
						$timeout.cancel(timeoutPromise);
					}
				};

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#localFilter
				 * @methodOf Directives.typeaheadWidget
				 * @description A private method to filter data locally.
				 *
				 * @param {String} inputValue Input value to be used for filtering.
				 * @private
				 */
				var localFilter = function (inputValue) {
					var caseSensitiveness = (scope.caseSensitive === 'true');

					scope.matched = _.filter(scope.data, function (value) {
						var stringToCheck = caseSensitiveness ? value[scope.filter] : String(value[scope.filter]).toLowerCase();
						var typedVal = caseSensitiveness ? inputValue : String(inputValue).toLowerCase();

						return (stringToCheck.indexOf(typedVal) !== -1);
					});
				};

				/**
				 * @ngdoc method
				 * @name Directives.typeaheadWidget#filterValue
				 * @methodOf Directives.typeaheadWidget
				 * @description A triage method for filter.
				 *
				 * @param {String} inputValue Input value to be used for filtering.
				 * @private
				 */
				var filterValue = function (inputValue) {
					if (scope.isRemote === 'true') {
						scope.remoteFilter({searchValue: inputValue});
					} else {
						localFilter(inputValue);
					}
				};

				// Watches for changes in the input
				scope.$watch('typedVal', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						if (waitTime > 0) {
							cancelPreviousTimeout();
							scheduleFilterWithTimeout(newVal);
						} else {
							filterValue(newVal);
						}
					}
				});
			}
		};
	}
]);
