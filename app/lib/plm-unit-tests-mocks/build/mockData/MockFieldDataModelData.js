'use strict';

angular.module('plm360.mockData').value('MockFieldDataModelData', {
    singleLineTextField: {
        value: 'Some Text',
        typeId: 4,
        fieldMetadata: {
            prop1: 'Some metadata'
        },
        metadata: {
            prop1: 'Some more metadata'
        },
        serverError: 'Some server errors'
    },
    floatField: {
        value: '1.000000001',
        typeId: 2,
        fieldMetadata: {
            prop1: 'Some metadata'
        },
        metadata: {
            fieldPrecision: 3
        },
        serverError: 'Some server errors'
    },
    moneyField: {
        value: '1.000000001',
        typeId: 5,
        fieldMetadata: {
            prop1: 'Some metadata'
        },
        metadata: {
            fieldPrecision: 3
        },
        serverError: 'Some server errors'
    },
    dateField: {
        value: '2001-01-10',
        typeId: 3,
        fieldMetadata: {
            prop1: 'Some metadata'
        },
        metadata: {
            prop1: 'Some more metadata'
        },
        serverError: 'Some server errors'
    },
    filteredPicklistField: {
        value: {
            selected: 'Some Picklist value'
        },
        typeId: 29,
        link: 'A link',
        urn: 'urn.anUrn',
        fieldMetadata: {
            prop1: 'Some metadata'
        },
        metadata: {
            prop1: 'Some more metadata'
        },
        serverError: 'Some server errors'
    },
    selectionField: {
        value: {
            title: 'A title',
            aProperty: 'Some property'
        },
        options: [{
            title: 'A title',
            anotherProperty: 'Some other property'
        }, {
            title: 'Another title',
            anotherProperty: 'Some other other property'
        }],
        typeId: 700,
        serverError: 'Some server errors'
    }
});
