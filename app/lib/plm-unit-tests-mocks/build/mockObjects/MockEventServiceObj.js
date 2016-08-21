'use strict';

angular.module('plm360.mockObjects').factory('MockEventService', function () {
	return function () {
		return sinon.stub({
			send: function () {},
			listen: function () {},
			unlisten: function () {}
		});
	}
});