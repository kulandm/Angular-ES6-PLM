'use strict';

angular.module('plm360.mockObjects').factory('MockFilteredPicklistFieldService', function () {
	return function () {
		return sinon.stub({
			register: function () {},
			unregister: function () {},
			getOptions: function () {},
			saveValue: function () {},
			notifyRelatedFpls: function () {},
			extractIdFromLink: function () {}
		});
	};
});