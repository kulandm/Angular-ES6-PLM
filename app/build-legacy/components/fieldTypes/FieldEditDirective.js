/**
 * FIELDEDIT WILL BE DEPRECATED.
 * If you are modifying it, please do so in the new FieldSelector component.
 */
'use strict';

/**
 * @ngdoc directive
 * @name Directives.fieldEdit
 * @restrict A
 *
 * @description This directive is used anytime you have to display a item's field in the application, in VIEW (i.e., non-editable) mode, printing the value and necessary elements
 * ####- fieldData: {Object} contains the data, properly parsed by the WorkspaceItemDetailsService.getItemDetailsFields method
 * ####- onChange: {Function} call back to the method that's going to be called every time the form element is updated
 * ####- mode: {String} can be 'EDIT', when editing item details, or 'CREATE', when creating a new item
 * ####- waiting: {Boolean} two-way binded to a boolean var in the controller that controls when saving is underway, as to disable controls and block editing
 * ####- placeholder: {String} string used as placeholder text for inputs that support it (if not supplied, it will be ignored by the HTML binding)
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<field-edit field-data="Object" onChange="Function" mode="String" />
 *   </doc:source>
 * </doc:example>
 */

angular.module('plm360.fieldTypes').directive('fieldEdit', ['$rootScope', '$compile', '$log', '$timeout', '$filter', 'LocalizationService', 'ModelsManager', 'RESTWrapperService', 'EventService', '_', function ($rootScope, $compile, $log, $timeout, $filter, LocalizationService, ModelsManager, RESTWrapperService, EventService, _) {
	return {
		restrict: 'E',
		scope: {
			fieldData: '=',
			onChange: '=',
			mode: '@',
			waiting: '=',
			placeholder: '@'
		},
		replace: true,
		templateUrl: 'components/fieldTypes/fieldEdit.html',
		link: function link(scope, element, attrs) {

			/**
   * @ngdoc property
   * @name Directives.fieldEdit#bundle
   * @propertyOf Directives.fieldEdit
   * @description Localization bundle
   *
   */
			scope.bundle = {};

			// listeners
			var currentUserListenerId;

			// search text
			var searchText;

			// Initializes LocalizationService
			LocalizationService.init().then(function () {
				scope.bundle = $rootScope.bundle;
			});

			// Converts a null value to empty string
			if (scope.fieldData.value === null) {
				scope.fieldData.value = '';
			}

			// If it's in CREATE ITEM mode, assign the defaultValue to value
			if (scope.fieldData.defaultValue !== null && scope.mode === 'CREATE') {
				scope.fieldData.value = scope.fieldData.defaultValue;
			}

			// If it's a PARAGRAPH or PARAGRAPH_NO_LINE_BREAK field type, ignore the fieldLength, and use the
			// MAX_LENGTH validation instead of fieldLength (per business requirements/changes for NextPLM - PLM-2343)
			// this is a (somewhat) temporary measure, until we get rid of the fieldLength for all field types
			if (scope.fieldData.fieldTypeId === 'PARAGRAPH' || scope.fieldData.fieldTypeId === 'PARAGRAPH_NO_LINE_BREAK') {
				scope.maxFieldLength = _.chain(scope.fieldData.validations).find(function (validation) {
					return validation.type === 'MAX_LENGTH';
				}).pick('settings').pluck('maxlength').first().value();
			} else {
				// all other field types - might be null for types which don't use it (such as picklists)
				scope.maxFieldLength = scope.fieldData.fieldLength;
			}

			// If it's a DATE, create the necessary scope vars for the widget
			if (scope.fieldData.fieldTypeId === 'DATE') {

				/**
     * @ngdoc property
     * @name Directives.fieldEdit#dateFormat
     * @propertyOf Directives.fieldEdit
     * @description The current user's selected date format
     *
     */
				scope.dateFormat = null;

				/**
     * @ngdoc property
     * @name Directives.fieldEdit#parsedDateValue
     * @propertyOf Directives.fieldEdit
     * @description The "ng-model"-binded var for this directive, used so we can always pass a
     * ISO-8601-compliant string back to the Item model (if it was binded to fieldData.value, we
     * would have to inject date format data into the model, which is not a very good approach)
     *
     */
				scope.formattedDate = {
					value: null
				};

				// Retrieves the timezone data
				// ModelsManager.getCurrentUser().then(function (data) {
				// 	return data.getTimeZone();
				// }).then(function (tzData) {
				// 	console.log(tzData);
				// });

				// Retrieves the date format for the current logged in user
				ModelsManager.getCurrentUser();
				currentUserListenerId = EventService.listen('currentUser:currentUser:done', function (event, data) {
					scope.dateFormat = data.getDateFormat();

					// parses the existing date string to date object, so it's properly parsed by the datepicker
					// otherwise, when opening the datepicker, it's going to be one day behind
					if (angular.isDefined(scope.fieldData.value) && scope.fieldData.value !== '' && scope.fieldData.value !== null) {

						// When creating a new item, strip out the zeroes
						if (scope.fieldData.value.constructor !== Date && scope.fieldData.value.indexOf('00') !== -1) {
							scope.fieldData.value = scope.fieldData.value.substr(0, scope.fieldData.value.indexOf('00') - 1);
						}

						scope.formattedDate.value = $filter('date')(scope.fieldData.value, scope.dateFormat);
					}
				});

				// Watch for changes on the external, binded object (in case of revert buttons, and other actions that can change
				// the binded value for some reason, such as the "revert" button in Affected Items)
				scope.$watch('fieldData.value', function (newVal, oldVal) {
					scope.formattedDate.value = $filter('date')(newVal, scope.dateFormat);
				});

				/**
     * @ngdoc property
     * @name Directives.fieldEdit#isDatePickerOpen
     * @propertyOf Directives.fieldEdit
     * @description Holds the current state (open/closed) of the datepicker using Angular's "One Dot"
     *
     */
				scope.datePickerStatus = {
					open: false
				};

				/**
     * @ngdoc property
     * @name Directives.fieldEdit#dateOptions
     * @propertyOf Directives.fieldEdit
     * @description Fixed PLM-specific customizations for the date picker widget
     */
				scope.dateOptions = {
					formatYear: 'yy',
					startingDay: 0,
					showWeeks: false,
					formatDayHeader: 'EEE'
				};

				// Disable weekend selection (left here as reference code for a while)
				// date-disabled="disableWeekends(date, mode)" in the view
				// scope.disableWeekends = function (date, mode) {
				// 	return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
				// };

				/**
     * @ngdoc method
     * @name Directives.fieldEdit#handleDatePicker
     * @methodOf Directives.fieldEdit
     * @description Handles opening/closing the calendar for the datepicker
     */
				scope.handleDatePicker = function (event) {
					// Prevents the user from opening the datepicker in case it's saving the data
					if (!scope.waiting) {
						// Prevents the datepicker from closing if: it's already open, and the user is clicking the input field to type something
						if (event.type === 'click' && !scope.datePickerStatus.open || event.srcElement.nodeName !== 'INPUT' || event.type === 'focus') {
							// Note: Relaying on event's 'preventDefault' and 'stopPropagation' will cause issues when we
							// have multiple date fields on the same view. This can lead to multiple calendar popups .
							// To avoid that, we need to let go of event suppression, so that bootstrap UI can detect click outside.
							$timeout(function () {
								scope.datePickerStatus.open = !scope.datePickerStatus.open;
							}, 100);
						}
					}
					element.addClass('datepicker-active');
				};

				/**
     * @ngdoc method
     * @name Directives.fieldEdit#parseToISODate
     * @methodOf Directives.fieldEdit
     * @description When user changes date, parses it back to an ISO-8601-compliant string that's going to be used by the Item model
     *
     */
				scope.parseToISODate = function (newVal) {
					if (angular.isDefined(newVal) && newVal !== null) {
						// Same string as before (or something else), so un-localize it to prepare for the endpoint
						if (newVal.constructor !== Date && newVal.indexOf(',') === -1 && newVal !== '') {
							// The check for commas is for descriptive dates, such as Nov 21, 2014
							var day = newVal.substr(scope.dateFormat.indexOf('dd'), 2);
							var month = newVal.substr(scope.dateFormat.indexOf('MM'), 2);
							var year = newVal.substr(scope.dateFormat.indexOf('yyyy'), 4);

							scope.fieldData.value = new Date(year, Number(month) - 1, day);
						} else {
							// new string, Date Object
							scope.fieldData.value = newVal;
						}
					} else {
						scope.fieldData.value = null;
					}
				};
				element.removeClass('datepicker-active');
			}

			/**
    * @ngdoc method
    * @name Directives.fieldEdit#isArray
    * @methodOf Directives.fieldEdit
    * @description Checks if a certain value is an array
    *
    * @param {Array/String} value 	The value to check for
    *
    */
			scope.isArray = function (value) {
				return angular.isArray(value);
			};

			/**
    * @ngdoc method
    * @name Directives.fieldEdit#isEditable
    * @methodOf Directives.fieldEdit
    * @description Checks if a certain field is editable according to the current mode
    *
    */
			scope.isEditable = function () {
				if (scope.mode === 'EDIT') {
					switch (scope.fieldData.editability) {
						case 'NEVER':
						case 'CREATE_ONLY':
							return false;
						default:
							return true;
					}
				} else if (scope.mode === 'CREATE') {
					switch (scope.fieldData.editability) {
						case 'ALWAYS':
						case 'CREATE_ONLY':
							return true;
						default:
							return false;
					}
				} else {
					$log.error('Mode not supported - only EDIT or CREATE are supported!');
				}
			};

			/**
    * @ngdoc method
    * @name Directives.fieldEdit#isFieldNotImplementedYet
    * @methodOf Directives.fieldEdit
    * @description Checks for other field types that shouldn't have editing on in this current implementation
    * (this method will change as more field types become available, and eventually will be change name to just check for those types that are NEVER editable, such as AUTO_NUMBER)
    *
    * @param {String} value 	The field type to check
    *
    */
			scope.isFieldNotImplementedYet = function (value) {
				switch (value) {
					case 'AUTO_NUMBER':
						return true;
					default:
						return false;
				}
			};

			/**
    * @ngdoc method
    * @name Directives.fieldEdit#isSingleLineFieldEdit
    * @methodOf Directives.fieldEdit
    * @description Checks if the field editing is done in a single line
    *
    * @param {String} value 	The field type to check
    *
    */
			scope.isSingleLineFieldEdit = function (value) {
				switch (value) {
					case 4: // single line text
					case 2: // float
					case 30: // long
					case 'DECIMAL':
					case 31: // money extended
					case 16: // url
					case 18: // email
					case 19:
						// csv
						return true;
					default:
						return false;
				}
			};

			scope.$on('$destory', function () {
				EventService.unlisten(currentUserListenerId);
			});

			// let's focus on the element
			scope.$evalAsync(function () {
				var ele = element[0].querySelector('input, textarea');
				if (ele) {
					ele.focus();
				}
			});

			/**
    * @ngdoc method
    * @name Directives.fieldEdit#doSearch
    * @methodOf Directives.fieldEdit
    * @description Performs a search with given text
    *
    * @param {String} text 	The text to search for
    * @param {Object} ele 		The dropdown element to update
    *
    */
			scope.doSearch = function (text, ele) {
				searchText = text;
				$timeout(function () {
					if (searchText === text && searchText !== '') {
						var url = scope.fieldData.fieldMetadata.picklist.replace('picklists', 'lookups');

						// do search
						// update the scope.fieldData.options.item array
						ele.dropdown('refresh');
						ele.dropdown('show');
					}
				}, 1500);
			};

			scope.fieldData.uid = scope.fieldData.link.replace(/\//g, '_');
			$timeout(function () {

				// for single select and set the default value
				$('#' + scope.fieldData.uid + '.ui.single.dropdown').dropdown({
					onChange: function onChange(value, text, $choice) {
						// data-value, text, html ele
						scope.fieldData.value.title = text;
						scope.fieldData.value.link = value;
						// console.log(value, text, $choice);
					}
				}).dropdown('set selected', scope.fieldData.value ? _.isString(scope.fieldData.value) ? scope.fieldData.value : scope.fieldData.value.title : undefined);

				// for multiple select
				$('#' + scope.fieldData.uid + '.ui.multiple.dropdown').dropdown({
					onAdd: function onAdd(addedValue, addedText, $addedChoice) {
						// data-value, text, html ele
						var added = false;
						_.each(scope.fieldData.value, function (ele, key) {
							if (ele.link === addedValue) {
								added = true;
							}
						});
						if (!added) {
							scope.fieldData.value.push({
								link: addedValue,
								title: addedText
							});
						}
						// console.log(addedValue, addedText, $addedChoice);
					},
					onRemove: function onRemove(removedValue, removedText, $removedChoice) {
						// data-value, text, html ele
						_.each(scope.fieldData.value, function (ele, key) {
							if (ele && ele.link === removedValue) {
								scope.fieldData.value.splice(key, 1);
								return;
							}
						});
						// console.log(removedValue, removedText, $removedChoice);
					}
				});
				// set the default values
				if (_.isArray(scope.fieldData.value)) {
					var args = [];
					_.each(scope.fieldData.value, function (value, key) {
						args.push(value.title);
					});
					$('#' + scope.fieldData.uid + '.ui.multiple.dropdown').dropdown('set selected', args);
				}

				// initialize key up event
				$('#' + scope.fieldData.uid + '.ui.dropdown input.search').keyup('input', function (event) {
					scope.doSearch($('#' + scope.fieldData.uid + '.ui.dropdown input.search').val(), $('#' + scope.fieldData.uid + '.ui.dropdown'));
				});
			}, 0);
		}
	};
}]);
//# sourceMappingURL=FieldEditDirective.js.map
