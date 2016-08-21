'use strict';

angular.module('plm360.mockObjects').factory('MockAbstractChangeListObj', () => {
	return function () {
		return sinon.stub({
			acceptanceFunction: function () {},
			acceptChange: function () {},
			compilationFunction: function () {},
			tryAddChange: function () {},
			getCompiled: function () {}
		});
	};
});
