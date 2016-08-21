/**
 * FIELDView WILL BE DEPRECATED.
 * If you are modifying it, please do so in the new FieldSelector component.
 */
'use strict';

/**
 * @ngdoc directive
 * @name Directives.fieldView
 * @restrict A
 *
 * @description This directive is used anytime you have to display a item's field in the application, in VIEW (i.e., non-editable) mode, printing the value and necessary elements
 * ####- useTruncation {Boolean} If the truncation should happen
 * ####- isEditable {Boolean} If the field is editable
 * ####- fieldData: {Object} contains the data, properly parsed by the WorkspaceItemDetailsService.getItemDetailsFields method
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<field-view field-data="Object" use-truncation="Boolean" />
 *   </doc:source>
 * </doc:example>
 */

angular.module('plm360.fieldTypes').directive('fieldView', [
	'$compile',
	'$rootScope',
	'$location', 
	'$state',
	'ModelsManager',
	'EventService',
	'LocalizationService',
	'$stateParams',
	'$mdDialog',
	'_',
	function ($compile, $rootScope, $location, $state, ModelsManager, EventService, LocalizationService, $stateParams, $mdDialog, _) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				fieldData: '=',
				isEditable: '=',
				placeholder: '@'
			},
			templateUrl: 'components/fieldTypes/fieldView.html',
			link: function (scope, element, attrs) {
				if ((angular.isDefined(scope.fieldData)) && (scope.fieldData.value === null)) { // check if scope.fieldData is undefined
					scope.fieldData.value = scope.placeholder || '';
				}

				// Check the value of field and apply placeholder if necessary. This is important, if value changes after
				// this directive is linked.
				scope.$watch('fieldData.value', function (value) {
					if (value === null) {
						scope.fieldData.value = scope.placeholder || '';
					}
				});

				// Initializes LocalizationService
				LocalizationService.init().then(function () {
					scope.bundle = $rootScope.bundle;
				});

				// if useTruncation wasn't supplied, set it as false
				// if (angular.isDefined(scope.useTruncation) && ((scope.useTruncation) || (scope.useTruncation === 'true'))) {
				// 	scope.useTruncation = true;
				// } else {
				// 	scope.useTruncation = false;
				// }

				// append UOM if it's one of the supported field types, and if there's a value present
				if (angular.isDefined(scope.fieldData) 
						&& angular.isDefined(scope.fieldData.fieldMetadata)
						&& angular.isDefined(scope.fieldData.fieldMetadata.unitOfMeasure) 
						&& (scope.fieldData.fieldMetadata.unitOfMeasure !== null) && (scope.fieldData.value !== '')
						&& angular.isDefined(scope.fieldData.metadata)) {
					switch (scope.fieldData.metadata.dataTypeId) {
						case 4: // single line text
						case 8: // paragraph
						case 17: // paragraph without line breaks
						case 2: // float
						case 30: // long
						case 31: // money extended
						case 19: // CSV
						case 11: // auto number
							scope.fieldData.value = scope.fieldData.value + ' (' + scope.fieldData.fieldMetadata.unitOfMeasure + ')';
							break;
						default:
							break;
					}
				}

				/**
				 * @ngdoc property
				 * @name Directives.fieldView#hrefValue
				 * @propertyOf Directives.fieldView
				 * @description The value for the href attribute in the link when field is an URL
				 *
				 */
				scope.hrefValue = null;

				// if URL, use a RegExp to check if the user filled http or https in the value
				var httpRegExp = new RegExp(/^(http|https):\/\//gm);

				if (angular.isDefined(scope.fieldData) &&
					angular.isDefined(scope.fieldData.metadata) &&
					(scope.fieldData.metadata.dataTypeId === 16)) {
					if (scope.fieldData.value.match(httpRegExp) === null) {
						scope.hrefValue = 'http://' + scope.fieldData.value;
					} else {
						scope.hrefValue = scope.fieldData.value;
					}
				}

				/**
				 * @ngdoc method
				 * @name Directives.fieldView#isArray
				 * @methodOf Directives.fieldView
				 * @description Checks if a certain value is an array
				 *
				 * @param {Array/String} value 	The value to check for
				 *
				 */
				scope.isArray = function (value) {
					return angular.isArray(value);
				};

				/**
				 * @ngdoc property
				 * @name Directives.fieldView#dateFormat
				 * @propertyOf Directives.fieldView
				 * @description The current user's selected date format
				 *
				 */
				scope.dateFormat = null;

				// Retrieves the date format for the current logged in user (only when this field is a date)
				if (angular.isDefined(scope.fieldData) &&
					angular.isDefined(scope.fieldData.metadata) &&
					(scope.fieldData.metadata.dataTypeId === 3)) {
					var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function (event, userObj) {
						EventService.unlisten(currentUserListenerId);
						scope.dateFormat = userObj.getDateFormat();
					}, true);

					ModelsManager.getCurrentUser();
				}

				/**
				 * @ngdoc property
				 * @name Directives.fieldView#formatToPrecision
				 * @propertyOf Directives.fieldView
				 * @description Format a float or money value for displaying purposes from the backend according to precision rules from the field's metadata
				 * This is strictly for VIEWING purposes - it doesn't change the value in the payload in any way
				 *
				 * @param {String} floatVal The value that should be formatted
				 * @param {Integer} precisionLength The amount of digits after the decimal point
				 *
				 * @returns {Number} The formatted float or money value according to precision rules
				 */
				scope.formatToPrecision = function (floatVal, precisionLength) {
					if (isNaN(floatVal)) {
						return floatVal;
					}

					if (angular.isUndefined(precisionLength) || precisionLength === null) {
						return floatVal; // Return the value, don't do any prepending/appending/rounding (edge case)
					} else if (((floatVal + '').indexOf('.') > -1 && precisionLength > ((floatVal + '').split('.')[1]).length) || (floatVal + '').indexOf('.') === -1) {
						return Number(floatVal).toFixed(precisionLength); // This is rounding the value up/down in case precision is lowered (desired behaviour)
					} else {
						return floatVal;
					}

				};

				/**
				 * @ngdoc property
				 * @name Directives.fieldView#formatToMoney
				 * @propertyOf Directives.fieldView
				 * @description Format a money value for displaying purposes from the backend according to precision rules from the field's metadata
				 * This is strictly for VIEWING purposes - it doesn't change the value in the payload in any way
				 *
				 * @param {String} moneyVal The value that should be formatted
				 *
				 * @returns {String} The formatted money value according to precision rules
				 */
				scope.formatToMoney = function (moneyVal) {
					if (isNaN(moneyVal)) {
						return moneyVal;
					}

					var parsedMoneyArr = moneyVal.split('.');
					
					return parsedMoneyArr.join('.');
				};

				/**
				 * @ngdoc method
				 * @name Directives.fieldView#isPlainText
				 * @methodOf Directives.fieldView
				 * @description Checks if a certain value is plain text (in the context of PLM)
				 * Comment out the fields that should be rendered as a simple string, without special treatment
				 *
				 * @param {String/Array} value 	The value to test
				 *
				 */
				scope.isPlainText = function (value) {
					switch (value) {
						case 9: // boolean
						case 15: // image
						case 3: // date
						case 31: // money
						// case 19: // CSV
						case 2: // float
						// case 30: // long (integer)
						// case 11: // auto number
						// case 4: // single line text.  this is a special case, because SLTs can have truncation (i.e. they're not "plain")
						case 8: // paragraph
						// case 17: // paragraph without line breaks
						case 16: // url
						case 18: // email
						case 10: // radio
						case 14: // customer picklist with search filter
						case 25: // radio linked
						case 6: // picklist first default
						case 7: // picklist linked first default
						case 13: // multi select
						case 20: // picklist
						case 22: // picklist latest version
						case 23: // picklist linked
						case 24: // picklist lrl
						case 26: // picklist filter
						case 27: // multi select linked picklists
						case 28: // uom
						case 29: // filtered picklists
						case 21: // flash
						case -999: // dropdown
							return false;
						default:
							return true;
					}
				};

				/**
				 * @ngdoc method
				 * @name Directives.fieldView#openImage
				 * @methodOf Directives.fieldView
				 * @description Opens the image in a modal
				 *
				 * @param {String} imagePath 	The path to the image
				 *
				 */
				scope.openImage = function (imagePath) {
					$mdDialog.show({
						controller: function ($scope, $mdDialog) {
							$scope.imagePath = imagePath;
							$scope.closeDialog = function () {
								$mdDialog.hide();
							};
						},
						templateUrl: 'components/fieldTypes/imageModal.html'
					}).finally(function () {
						isPermissionDeniedShown = false;
					});
				};

				/**
				 * @ngdoc method
				 * @name Directives.fieldView#goToItem
				 * @methodOf Directives.fieldView
				 * @description Navigate to an item
				 *
				 * @param {String} resourceId 	The urn of the item to navigate to
				 *
				 */
				scope.goToItem = function (resourceId) {
					// $state.current.reloadOnSearch = true;
					$location.search({
						tab: 'workspace-item-details',
						view: 'full',
						mode: 'view',
						itemId: resourceId
					});
					// $timeout(function () {
					// 	$state.current.reloadOnSearch = false;
					// }, 2000);
				};
			}
		};
	}
]);
