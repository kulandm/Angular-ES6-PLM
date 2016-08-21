'use strict';

angular.module('plm360.mockObjects').factory('MockSourcingsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			getQuotes: function () {},
			getSupplierTransitions: function () {}
		});
	};
});
