'use strict';

angular.module('plm360.mockObjects').factory('MockBomFieldDataOutputObj', () => {
	return function () {
		return sinon.stub({
			isConsequentialChange: () => {},
			getValue: () => {},
            updateValue: () => {},
			isDirty: () => {},
            getFieldId: () => {},
            getFieldSemantics: () => {},
            getViewDefFieldInfo: () => {}
		});
	};
});
