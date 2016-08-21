'use strict';

/**
 * @ngdoc object
 * @name Miscellaneous.httpInterceptor
 *
 * @description This defines the interceptor for all PLM360 ajax requests
 *
 * ##Dependencies
 * - Requires {@link Services/Services.TokenService}
 * - Requires {@link Services/Services.AuthenticationService}
 * - Requires {@link Configs/Configs.GlobalSettings}
 *
 */
var httpInterceptor = angular.module('plm.httpInterceptor', []);

httpInterceptor.factory('httpInterceptor', [
	'$q',
	'$log',
	'AuthenticationService',
	'GlobalSettings',
	'ADSK.HttpInterceptorService.service',
	'_',
	function ($q, $log, AuthenticationService, GlobalSettings, ADSKHttpInterceptor, _) {

		return {
			request: function (config) {
				// TODO: append the token for each request
				// Use TokenService

				// need to remove the extra originalElement attribute otherwise REST will throw error
				if (angular.isDefined(config.data) && angular.isDefined(config.data.originalElement)) {
					delete config.data.originalElement;
				}

				// If POSTing with a Content-Location header, there should be
				// no post body (e.g. for adding linkable items to the Project
				// Management view)
				if (config.method === 'POST' &&
					'Content-Location' in config.headers &&
					_.isEmpty(config.data)) {
					config.data = null;
				}

				if (GlobalSettings.debugLevel >= 1) {
					$log.info('Requesting data:', config);
				}

				ADSKHttpInterceptor.handleRequest(config.url, config);

				return config || $q.when(config);
			},

			requestError: function (rejection) {
				if (GlobalSettings.debugLevel >= 0) {
					$log.error('Error on request:', rejection);
				}

				ADSKHttpInterceptor.handleRequestError(rejection.config.url, rejection);

				return $q.reject(rejection);
			},

			response: function (response) {
				if (GlobalSettings.debugLevel >= 2) {
					$log.log('Response data:', response);
				}

				// Intercept different status codes for response types
				if (angular.isDefined(response)) {
					switch (response.status) {
						case 204: // NO CONTENT, hence, empty object to simulate empty payload
							response.data = {};
							break;
						default:
							break;
					}
				}

				ADSKHttpInterceptor.handleResponse(response.config.url, response);

				return response || $q.when(response);
			},

			responseError: function (rejection) {
				// do something on error
				// if (canRecover(rejection)) {
				// 	return responseOrNewPromise;
				// }
				// pendingRequests--;

				if (GlobalSettings.debugLevel >= 0) {
					$log.error('Error on response:', rejection);
				}

				ADSKHttpInterceptor.handleResponseError(rejection.config.url, rejection);

				return $q.reject(rejection);
			}
		};
	}
]);

// configure the interceptor
httpInterceptor.config(function ($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
});
