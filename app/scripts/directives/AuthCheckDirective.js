'use strict';

/**
 * @ngdoc directive
 * @name Directives.authCheck
 * @restrict E
 *
 * @description This directive is dump on the page for checking authentication status.
 * It registers a global listener for $stateChangeStart event, and fires for relogin if user is not authenticated
 *
 * ##Dependencies
 * - Requires {@link Services/Services.AuthenticationService}
 * - Requires {@link Services/Services.TokenService}
 *
 * @example
 * <doc:example>
 *	<doc:source>
 *		<authCheck></authCheck>
 *	</doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.directive('authCheck', [
	'$rootScope',
	'AuthenticationService',
	'TokenService',
	function ($rootScope, AuthenticationService, TokenService) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			// DO NOT DO THIS, THIS IS SPECIAL CASE
			template: '<div></div>',
			link: function (scope, element, attrs, ctrl) {

				// register the listener
				$rootScope.$on('$stateChangeSuccess', function (event, toState) {
					if (angular.isDefined(toState.name)) {
						var params = toState;
						// if the state config has access parameter, and the parameter is not 'unrestricted', and user is not authenticated, we ask for relogin
						if ((!params.access || !params.access.unrestricted) && !AuthenticationService.isLogged()) {
							TokenService.unset();
							AuthenticationService.requestRelogin();
						}
					}
				});
			}
		};
	}
]);
