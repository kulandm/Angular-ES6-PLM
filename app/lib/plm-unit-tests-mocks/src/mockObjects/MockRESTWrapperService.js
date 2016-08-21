'use strict';

angular.module('plm360.mockObjects').factory('MockRESTWrapperService', function () {
	return function () {
		return sinon.stub({
			get: function () {},
			put: function () {},
			post: function () {},
			delete: function () {},
			patch: function () {},
			allSettled: function () {}
		});
	}
});