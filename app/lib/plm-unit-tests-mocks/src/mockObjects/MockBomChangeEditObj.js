'use strict';

angular.module('plm360.mockObjects').factory('MockBomChangeEditObj', () => {
	return function () {
		return sinon.stub({
			targetsSameField: function () {},
			isRevertingChange: function () {}
		});
	};
});
