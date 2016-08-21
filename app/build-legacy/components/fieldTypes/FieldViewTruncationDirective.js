'use strict';

/**
 * @ngdoc directive
 * @name Directives.fieldViewTruncation
 * @restrict A
 *
 * @description This directive is to be used inside fieldView, just to display a truncated value
 * ####- shouldTruncate {Boolean} If the truncation should happen
 * ####- value: {String} the plain string
 * ####- length: {Integer} the length
 * ####- preformatted: {Boolean} If should wrap the string using <pre> instead of <span>, to respect "\n"
 * ####- html: {Boolean} If should display the passed string as HTML
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<field-view-truncation value="String" length="Integer" preformatted="Boolean" html="Boolean" />
 *   </doc:source>
 * </doc:example>
 */

angular.module('plm360.fieldTypes').directive('fieldViewTruncation', ['$compile', '$timeout', '$window', '_', function ($compile, $timeout, $window, _) {
	return {
		restrict: 'E',
		scope: {
			value: '@',
			length: '@',
			preformatted: '@',
			html: '@'
		},
		replace: true,
		templateUrl: 'components/fieldTypes/fieldViewTruncation.html',
		link: function link(scope, element, attrs) {

			/**
    * @ngdoc property
    * @name Directives.fieldViewTruncation#fullValue
    * @propertyOf Directives.fieldViewTruncation
    * @description `private` Stores the full value of this field, for truncation purposes
    *
    */
			var fullValue = scope.value;

			/**
    * @ngdoc property
    * @name Directives.fieldViewTruncation#isHTML
    * @propertyOf Directives.fieldViewTruncation
    * @description `private` Default line height size for bootstrap theme
    *
    */
			var themeLineHeight = 24;

			/**
    * @ngdoc property
    * @name Directives.fieldViewTruncation#isHTML
    * @propertyOf Directives.fieldViewTruncation
    * @description Set to true whenever the supplied string should be rendered as HTML, or false for everything else
    *
    */
			scope.isHTML = scope.html === 'false' || angular.isUndefined(scope.html) ? false : true;

			/**
    * @ngdoc property
    * @name Directives.fieldViewTruncation#isPreformatted
    * @propertyOf Directives.fieldViewTruncation
    * @description Set to true whenever user is hovering elements relative to the field (such as the arrow for expanding/collapsing)
    *
    */
			scope.isPreformatted = scope.preformatted === 'false' || angular.isUndefined(scope.preformatted) ? false : true;

			/**
    * @ngdoc property
    * @name Directives.fieldViewTruncation#isHovering
    * @propertyOf Directives.fieldViewTruncation
    * @description Set to true whenever user is hovering elements relative to the field (such as the arrow for expanding/collapsing)
    *
    */
			scope.isHovering = false;

			/**
    * @ngdoc method
    * @name Directives.fieldViewTruncation#checkForTruncation
    * @methodOf Directives.fieldViewTruncation
    * @description Checks if a certain value should be truncated according to the scrollHeight/clientHeight
    *
    * @returns {Boolean} If the string should be truncated or not
    *
    */
			scope.checkForTruncation = function () {
				// if this evaluates to true, then there's more content than one line (24 is the default height for this theme across browsers)
				if (angular.element(element[0].querySelector('.fieldvalue-wrapper'))[0].scrollHeight > themeLineHeight) {
					return true;
				} else {
					return false;
				}
			};

			// this delay is necessary because we have to wait for the DOM to be rendered,
			// to then calculate the scrollHeight in checkForTruncation
			$timeout(function () {

				/**
     * @ngdoc property
     * @name Directives.fieldViewTruncation#isArray
     * @propertyOf Directives.fieldViewTruncation
     * @description Stores the status of truncation for the current value of this field
     *
     */
				scope.isTruncated = scope.checkForTruncation();

				/**
     * @ngdoc property
     * @name Directives.fieldViewTruncation#displayTruncationControl
     * @propertyOf Directives.fieldViewTruncation
     * @description Controls the displaying of the truncation control (arrow, or string)
     *
     */
				scope.displayTruncationControl = scope.isTruncated;
			}, 0);

			/**
    * @ngdoc method
    * @name Directives.fieldViewTruncation#setTruncation
    * @methodOf Directives.fieldViewTruncation
    * @description Sets the scope's truncation flag to true or not
    *
    * @param {Boolean} flag 	sets the scope's truncation flag to the boolean value passed to this method
    *
    */
			scope.setTruncation = function (flag) {
				scope.isTruncated = !flag;
			};

			// hook up a listener to the window for resizes, to display/hide the truncation controls (and field truncation) accordingly
			// this is VERY expensive to do, unfortunately
			angular.element($window).bind('resize', function () {
				scope.isTruncated = false; // sets as false, so the truncation level can be recalculated
				scope.displayTruncationControl = false; // idem

				$timeout(function () {
					// sets scope variables again according to the rendered UI
					scope.isTruncated = scope.checkForTruncation();
					scope.displayTruncationControl = scope.isTruncated;
				}, 0);
			});
		}
	};
}]);
//# sourceMappingURL=FieldViewTruncationDirective.js.map
