'use strict';

/**
 * @ngdoc directive
 * @name Directives.infiniteScroll
 * @restrict A
 *
 * @description This directive handles infinite scrolling
 * It expects the following attributes/parameters:
 * ####- update: a function to be called on scroll to the end of current list
 * ####- context: an optional parameter bounding the scroll event.  if this is not set, the scroll even will be binded to the element, if this is set, assume the context is window
 * ####- infiniteScrollDisabled: an optional parameter that can be used to conditionally disable infinite scroll.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<div infinite-scroll="" update="doScroll" context="window"/>
 *   </doc:source>
 * </doc:example>
 *
 * TODO: should also add logic to detect scrolling up. Ideally, when infinite scrolling is used the client will only have a snapshot of the whole data.
 * For example, if we have 10000 records, and used is scrolling down and we are keep adding a batch of 100 records on scroll down. Ideally, the user
 * of the infinite scroll also removed some of the records when moving down. Therefore, we need to add logic to tell the user of the infinite scroll
 * that user is scrolling up (as they might need to fetch data from server again). There is a ticket for it  https://jira.autodesk.com/browse/PLM-2219.
 */
/* global plm360 */
plm360.directive('infiniteScroll', function ($window) {
	return {
		restrict: 'A',
		scope: {
			context: '=context', // optional
			update: '&',
			infiniteScrollDisabled: '='
		},
		link: function (scope, element, attrs) {
			var handler = scope.update();

			/**
			* set up condition test for scroll
			* by default we use the current element for scroll binding
			*/
			var raw = element[0];
			var elem = element;

			/**
			 * @ngdoc method
			 * @name Directives.infiniteScroll#conditionMet
			 * @methodOf Directives.infiniteScroll
			 * @description A private helper method that tests for scroll
			 */
			var conditionMet = function (raw) {
				return (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight);
			};

			/**
			* if context is set, we assume it's window and we'll use it for scroll binding
			*/
			if (angular.isDefined(scope.context)) {
				raw = scope.context[0];
				elem = scope.context;

				/**
				 * @ngdoc method
				 * @name Directives.infiniteScroll#conditionMet
				 * @methodOf Directives.infiniteScroll
				 * @description A private helper method that tests for scroll with context
				 */
				conditionMet = function (raw) {
					return (raw.innerHeight + raw.pageYOffset >= angular.element(document)[0].body.scrollHeight);
				};
			}

			/**
			 * @ngdoc method
			 * @name Directives.infiniteScroll#scrollHandler
			 * @methodOf Directives.infiniteScroll
			 * @description A private helper method to check for infinite scroll condition.
			 */
			var scrollHandler = function () {
				var isScrollEnabled = (angular.isUndefined(scope.infiniteScrollDisabled) || scope.infiniteScrollDisabled === false);
				if (isScrollEnabled === true && conditionMet(raw)) {
					handler();
				}
			};

			/**
			* now bind the scroll
			*/
			elem.bind('scroll', scrollHandler);

			scope.$on('$destroy', function () {
				elem.unbind('scroll');
			});
		}
	};
});
