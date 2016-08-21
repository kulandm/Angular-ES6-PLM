'use strict';

angular.module('plm360.mockObjects').factory('MockFileBrowserObj', () => {
	return function () {
		return sinon.stub({
			getFolders: function () {},
			getVersionedFiles: function () {}
		});
	};
});