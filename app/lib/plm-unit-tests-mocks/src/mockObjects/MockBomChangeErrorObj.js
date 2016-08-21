'use strict';

angular.module('plm360.mockObjects').factory('MockBomChangeErrorObj', function () {
	return function () {
		return sinon.stub({
			getErrorFieldId: function () {},
			getFormattedMessage: function () {}
		});
	};
});
