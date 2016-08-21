'use strict';

angular.module('plm360.mockObjects').factory('MockLocalizationServiceObj', function () {
	return () => {
		return sinon.stub({
			init: () => {}
		});
	};
});