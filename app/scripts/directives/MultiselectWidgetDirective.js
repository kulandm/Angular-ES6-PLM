'use strict';

/**
 * @ngdoc directive
 * @name Directives.multiselectWidget
 * @restrict E
 *
 * @description This directive is the multiselect widget
 * ####- categories: Array containing objects listing the categories (optional)
 * [{
 *		displayName: 'some String',
 *		id: 'some id as integer or String'
 *	}, ...]
 *
 * ####- data: The data itself for the widget
 * [{
 * 	category: 'some id matching the category's id above',
 * 	displayName: 'some String',
 * 	id: 'some String or, preferably, id',
 * 	selected: 'true/false'
 * }, ...]
 *
 * ####- maxDisplayed: maximum quantity of options that should be displayed before cutting off and showing the warning (optional, default 10)
 * ####- type: String - accepts "checkbox" or "radio"
 * ####- wrapperDisplay: A boolean value that's going to be updated whenever the user clicks CANCEL or DONE (optional)
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<multiselect-widget categories="Array" data="Array" max-displayed="Integer" type="String" wrapper-display="Boolean" ><multiselect-widget />
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
var multiselectWidget = plm360.directive('multiselectWidget', [
	'$compile',
	'LocalizationService',
	'$rootScope',
	function ($compile, LocalizationService, $rootScope) {
		return {
			replace: true,
			restrict: 'E',
			scope: {
				categories: '=',
				data: '=',
				maxDisplayed: '@',
				type: '@',
				wrapperDisplay: '='
			},
			templateUrl: 'partials/multiselectWidget.html',
			link: function (scope, element, attributes) {
				/**
				 * @ngdoc property
				 * @name Directives.multiselectWidget#scopedData
				 * @propertyOf Directives.multiselectWidget
				 * @description Stores the internal list of selected items (to bypass two-way data binding)
				 */
				scope.scopedData = [];

				/**
				 * @ngdoc property
				 * @name Directives.multiselectWidget#typedVal
				 * @propertyOf Directives.multiselectWidget
				 * @description The initial typed value for the typeahead widget
				 */
				scope.typedVal = '';

				/**
				 * @ngdoc property
				 * @name Directives.multiselectWidget#scopedDataFiltered
				 * @propertyOf Directives.multiselectWidget
				 * @description The filtered data from the scoped widget, based on the scopedData
				 */
				scope.scopedDataFiltered = [];

				/**
				 * @ngdoc property
				 * @name Directives.multiselectWidget#displayWarning
				 * @propertyOf Directives.multiselectWidget
				 * @description Displays the warning at the footer (messages for no matches found/too many matches)
				 */
				scope.displayWarning = true;

				// check in case maxDisplayed wasn't passed along
				if (angular.isUndefined(scope.maxDisplayed)) {
					scope.maxDisplayed = 10;
				}

				// localized messages initialization
				LocalizationService.init().then(function () {
					scope.clearSelectMessage = $rootScope.bundle.text.clearSelectedItems;
					scope.nomatchesMessage = $rootScope.bundle.text.noMatches;
					scope.moreResultsMessage = $rootScope.bundle.widget.moreResults;
				});

				// keeps the internal data in sync with changes made to the external binded data source
				scope.$watch('wrapperDisplay', function (newVal, oldVal) {
					scope.scopedData = [];
					scope.scopedDataFiltered = [];
					scope.typedVal = '';

					// scroll the div again to the top if it's constrained by CSS
					element[0].querySelector('#multiselect-content').scrollTop = 0;

					// re-builds scoped data
					scope.scopedData = _.map(scope.data, _.clone);
					_.each(scope.scopedData, function (value, key, list) {
						value.__selected = value.selected;
					});

					// too many results?
					if (scope.scopedData.length > parseInt(scope.maxDisplayed)) {
						displayTooManyResultsWarning(scope.scopedData.length);
					}
				});

				/**
				 * @ngdoc method
				 * @name Directives.multiselectWidget#clearAllSelected
				 * @methodOf Directives.multiselectWidget
				 * @description Removes the selection status of all items
				 *
				 */
				// scope.clearAllSelected = function () {
				// 	_.each(scope.scopedData, function (value, key, list) {
				// 		value.__selected = false;
				// 		value.selected = false;
				// 	});
				// };

				// watched for filtering of data, displaying the proper messages
				scope.$watchCollection('scopedDataFiltered', function (newObj, oldObj) {
					handleFiltering(scope.scopedDataFiltered.length);
				});

				/**
				 * @ngdoc method
				 * @name Directives.multiselectWidget#handleFiltering
				 * @methodOf Directives.multiselectWidget
				 * @description Handle filtering of data, showing the necessary messages
				 */
				var handleFiltering = function (quantity) {
					if (quantity > parseInt(scope.maxDisplayed)) {
						displayTooManyResultsWarning(quantity);
					} else {
						scope.displayWarning = false; // hides by default

						if ((quantity === 0) && (scope.typedVal !== '')) {
							scope.displayWarning = true;

							angular.element(element[0].querySelector('#multiselect-warning')).text(scope.nomatchesMessage);
						}
					}
					// else {
					// 	if (quantity > parseInt(scope.maxDisplayed)) {
					// 		scope.displayWarning = true;
					// 		angular.element(element[0].querySelector('#multiselect-warning')).text((quantity - scope.maxDisplayed) + ' ' + scope.moreResultsMessage);
					// 	} else {
					// 		scope.displayWarning = false;
					// 	}
					// }
				};

				/**
				 * @ngdoc method
				 * @name Directives.multiselectWidget#displayTooManyResultsWarning
				 * @methodOf Directives.multiselectWidget
				 * @description Displays a warning about having too many results in the list
				 */
				var displayTooManyResultsWarning = function (quantity) {
					scope.displayWarning = true;

					angular.element(element[0].querySelector('#multiselect-warning')).text((quantity - scope.maxDisplayed) + ' ' + scope.moreResultsMessage);
				};

				/**
				 * @ngdoc method
				 * @name Directives.multiselectWidget#cancelSelection
				 * @methodOf Directives.multiselectWidget
				 * @description Reverts the values of the selected items, and closes the widget
				 */
				scope.cancelSelection = function () {
					// there's a wrapper for this directive, therefore control the flag
					if (angular.isDefined(scope.wrapperDisplay)) {
						scope.wrapperDisplay = false;
					}
				};

				/**
				 * @ngdoc method
				 * @name Directives.multiselectWidget#submitSelection
				 * @methodOf Directives.multiselectWidget
				 * @description Submit the selection, syncing the scoped object with the binded object
				 */
				scope.submitSelection = function () {
					scope.data = [];

					scope.data = _.map(scope.scopedData, _.clone);
					_.each(scope.data, function (value, key, list) {
						delete value.__selected; // this attribute is not needed anymore
					});

					// there's a wrapper for this directive, therefore control the flag
					if (angular.isDefined(scope.wrapperDisplay)) {
						scope.wrapperDisplay = false;
					}
				};
			}
		};
	}
]);
