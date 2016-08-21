'use strict';

angular.module('plm360.mockObjects').factory('MockADSKHttpInterceptor', function () {
	return function () {
		return {
			handleResponseError: function () {},
			handleResponse: function () {},
			handleRequestError: function () {},
			handleRequest: function () {},
			setHandler: function () {}
		};
	}
});