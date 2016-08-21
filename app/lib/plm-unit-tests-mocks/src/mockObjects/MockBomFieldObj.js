'use strict';

angular.module('plm360.mockObjects').factory('MockBomFieldObj', () => {
	return () => {
		return sinon.stub({
			getViewDefFieldInfo: () => {},
			getId: () => {},
            getFieldSemantics: () => {},
            updateFieldValue: () => {},
            generateHref: () => {},
            ItemNumberField: () => {},
            FromViewDefField: () => {}
		});
	};
});
