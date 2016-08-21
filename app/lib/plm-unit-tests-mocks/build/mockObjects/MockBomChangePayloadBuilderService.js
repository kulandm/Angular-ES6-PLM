'use strict';

angular.module('plm360.mockObjects').factory('MockBomChangePayloadBuilderService', () => {
	return sinon.stub({
		convertChangesToEditPayload: () => {},
		convertChangesToAddPayload: () => {},
	});
});
