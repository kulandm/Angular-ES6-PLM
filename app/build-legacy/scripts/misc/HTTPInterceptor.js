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

httpInterceptor.factory('httpInterceptor', ['$q', '$log', 'AuthenticationService', 'GlobalSettings', 'ADSK.HttpInterceptorService.service', '_', function ($q, $log, AuthenticationService, GlobalSettings, ADSKHttpInterceptor, _) {

	return {
		request: function request(config) {
			// TODO: append the token for each request
			// Use TokenService

			// need to remove the extra originalElement attribute otherwise REST will throw error
			if (angular.isDefined(config.data) && angular.isDefined(config.data.originalElement)) {
				delete config.data.originalElement;
			}

			// If POSTing with a Content-Location header, there should be
			// no post body (e.g. for adding linkable items to the Project
			// Management view)
			if (config.method === 'POST' && 'Content-Location' in config.headers && _.isEmpty(config.data)) {
				config.data = null;
			}

			if (GlobalSettings.debugLevel >= 1) {
				$log.info('Requesting data:', config);
			}

			ADSKHttpInterceptor.handleRequest(config.url, config);

			return config || $q.when(config);
		},

		requestError: function requestError(rejection) {
			if (GlobalSettings.debugLevel >= 0) {
				$log.error('Error on request:', rejection);
			}

			ADSKHttpInterceptor.handleRequestError(rejection.config.url, rejection);

			return $q.reject(rejection);
		},

		response: function response(_response) {
			if (GlobalSettings.debugLevel >= 2) {
				$log.log('Response data:', _response);
			}

			// Intercept different status codes for response types
			if (angular.isDefined(_response)) {
				switch (_response.status) {
					case 204:
						// NO CONTENT, hence, empty object to simulate empty payload
						_response.data = {};
						break;
					default:
						break;
				}
			}

			ADSKHttpInterceptor.handleResponse(_response.config.url, _response);

			return _response || $q.when(_response);
		},

		responseError: function responseError(rejection) {
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
}]);

// configure the interceptor
httpInterceptor.config(function ($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
});
//# sourceMappingURL=HTTPInterceptor.js.map
