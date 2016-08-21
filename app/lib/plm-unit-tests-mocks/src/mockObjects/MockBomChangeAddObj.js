'use strict';

angular.module('plm360.mockObjects').factory('MockBomChangeAddObj', () => {
	return function () {
		return sinon.stub({
			targetsSameItemAddition: function () {},
			getEdgeId: function () {},
			getItemJson: function () {}
		});
	};
});