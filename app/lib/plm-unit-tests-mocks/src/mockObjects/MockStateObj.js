'use strict';

angular.module('plm360.mockObjects').factory('MockStateObj', function () {
	return function () {
		return sinon.stub({
			go: function () {},
			href: function () {}
		});
	}
});
