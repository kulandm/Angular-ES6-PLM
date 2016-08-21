(function(module) {
    'use strict';

    module.factory('MockViewDefinitionFieldObj', () => {
        return () => {
            return sinon.stub({
                determineSemantics: () => {},
                getSelf: () => {},
                getUrn: () => {},
                getLink: () => {},
                getId: () => {},
                getDisplayOrder: () => {},
                getType: () => {},
                getTypeId: () => {},
                buildTypeId: () => {},
                getBusinessAspect: () => {},
                isBomField: () => {},
                getFieldSemantics: () => {},
                isAlwaysEditable: () => {},
                isOnlyEditableOnCreate: () => {},
                isEditableOnCreate: () => {},
                getName: () => {},
                fetch: () => {}
            });
        };
    });
}(angular.module('plm360.mockObjects')));
