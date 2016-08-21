'use strict';

/**
 * @ngdoc directive
 * @name Directives.loadingBarWidget
 * @restrict E
 *
 * @description This directive is wonderfully fabulously awesome for telling the user it's loading something
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<loadingBarWidget/>
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.constant('LoadingBarWidgetConfig', {
	DEFAULT_DELAY: 500,	// the default delay for animations and waiting for requests/responses to stop happening
	ANIMATION_DURATION_PER_REQUEST: 2000,  // the number of milliseconds for duration of animation per request, eg. 2 requests will be 2 * 2000 = 4000
	ANIMATION_DURATION_FOR_ERROR: 200 // the number of milliseconds for duration if there's an error
});

var loadingBarWidget = plm360.directive('loadingBarWidget', [
	'$compile',
	'$rootScope',
	'$timeout',
	'$log',
	'GlobalSettings',
	'AuthenticationService',
	'LoadingBarWidgetConfig',
	'EventService',
	'_',
	function ($compile, $rootScope, $timeout, $log, GlobalSettings, AuthenticationService, LoadingBarWidgetConfig, EventService, _) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'partials/loadingBar.html',
			link: function (scope, element, attrs) {

				var progressBarElement = angular.element(element);

				var pageWidth = document.body.offsetWidth; // total width of the browser

				var isLoading = false; // is in the middle of the loading process?

				/**
				 * @ngdoc property
				 * @name Directives.loadingBarWidget#isLogged
				 * @propertyOf Directives.loadingBarWidget
				 * @description {boolean} Flag for whether user is logged in
				 */
				scope.isLogged = AuthenticationService.isLogged();

				/**
				 * @ngdoc method
				 * @name Directives.loadingBarWidget#completeAnimation
				 * @methodOf Directives.loadingBarWidget
				 * @description `private` Handles finishing animation
				 */
				var completeAnimation = function () {
					resetLoadingProcess();
				};

				/**
				 * @ngdoc method
				 * @name Directives.loadingBarWidget#updateAnimation
				 * @methodOf Directives.loadingBarWidget
				 * @description `private` Handles updating animations taking into account current number of requests
				 */
				var updateAnimation = function (requestsCount) {
					/* global $ */
					$(progressBarElement).stop();
					$(progressBarElement).animate({
						width: '100%'
					}, {
						duration: (angular.isDefined(requestsCount) ? (requestsCount * LoadingBarWidgetConfig.ANIMATION_DURATION_PER_REQUEST + LoadingBarWidgetConfig.DEFAULT_DELAY) : LoadingBarWidgetConfig.ANIMATION_DURATION_FOR_ERROR),
						complete: function () {
							completeAnimation();
						}
					});
				};

				/**
				 * @ngdoc method
				 * @name Directives.loadingBarWidget#resetLoadingProcess
				 * @methodOf Directives.loadingBarWidget
				 * @description `private` Resets all loading process (cleaning up timeouts and setting proper flags)
				 */
				var resetLoadingProcess = function () {
					isLoading = false; // resets variable, since loading has stopped

					// removes the class that shows the spinner on the cursor
					angular.element(document.getElementById('wrapper')).removeClass('loading');

					progressBarElement.css({
						width: '0%'
					});
				};

				/**
				 * Listens for data requests
				 */
				EventService.listen('data:request', function (event, args) {
					// $log.log('__dataRequest', args.requests, args.url, args.requestsArr);
					scope.isLogged = AuthenticationService.isLogged();

					// runs the loading animation for the first time, avoiding adding classes multiple types
					if (!isLoading) {
						isLoading = true;

						// adds the class to the wrapper that displays a spinner alongside the cursor
						angular.element(document.getElementById('wrapper')).addClass('loading');

						updateAnimation(args.requests);
					}
				});

				/**
				 * Listens for data responses
				 */
				EventService.listen('data:response', function (event, args) {
					updateAnimation(args.requests);
				});

				/**
				 * Listens for the call to change the state, when everything is loaded (most of the time)
				 */
				EventService.listen('state:change:start', function () {
					resetLoadingProcess();
				});

				/**
				 * Listens for the call to change the state, mid-change (i.e. in-between the start and sucess)
				 */
				EventService.listen('state:change:switch', function () {
					// reset the loading process, in case user navigates away in the middle of loading process, hence interrupting
					resetLoadingProcess();
				});

				/**
				 * Listens for the successfully changing the state
				 */
				EventService.listen('state:change:done', function () {});

				/**
				 * Listens for the error when attempting to change the state
				 */
				EventService.listen('state:change:error', function () {
					updateAnimation();
				});

				/**
				 * Listens for login
				 */
				$rootScope.$on('__logging', function () {
					scope.isLogged = AuthenticationService.isLogged();
				});
			}
		};
	}
]);
