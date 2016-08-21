'use strict';

angular.module('plm360.mockObjects').factory('MockAbstractChangeObj', () => {
	return function () {
		return sinon.stub({
			isInvalid: function () {}
		});
	};
});
