'use strict';

angular.module('plm360.mockObjects').factory('MockBomConfigurationStateMachineObj', () => {
	return () => {
        return sinon.stub({
    		setState: () => {},
    		setInitialState: () => {},
    		setViewDefId: () => {},
            setEffectiveDate: () => {},
            getEffectiveDate: () => {},
            setItemId: () => {},
            setRevisionBias: () => {},
            setIsWorkingRevision: () => {},
            viewChanged: () => {},
            configurationChanged: () => {},
            dateChanged: () => {},
            biasChanged: () => {},
            shouldRefresh: () => {},
            getFullConfiguration: () => {},
            getTopLineQueryParams: () => {}
        });
	};
});
