'use strict';

angular.module('plm360.mockObjects').factory('MockTokenService', function () {
	return function () {
		return {
			tok: 1,
			unset: function () {
				this.tok = 2;
			}
		};
	}
});