'use strict';

angular.module('plm360.mockData').value('MockBomRowArguments', (() => {
    let fieldsMapA = new Map();
    let fieldsMapB = new Map();

    let field1 = {
        title: 'This is field1'
    };
    let field2 = {
        title: 'This is field2'
    };
    let field3 = {
        title: 'This is field3'
    };
    let field4 = {
        title: 'This is field4'
    };

    fieldsMapA.set('field1', field1);
    fieldsMapA.set('field2', field2);
    fieldsMapB.set('field3', field3);
    fieldsMapB.set('field4', field4);

    return {
        notRootRowArgs: {
            node: {
                itemId: '123',
                item: {
                    link: 'This is a link',
                    urn: 'This is an urn'
                },
                nodeProperties: {
                    fields: fieldsMapA
                },
                hasChildren: true
            },
            edge: {
                link: 'This is a link',
                bomId: '999',
                edgeProperties: {
                    itemNumber: '888',
                    fields: fieldsMapB
                }
            },
            expectedDisplayProperties: {
                field1: field1,
                field2: field2,
                field3: field3,
                field4: field4
            }
        },
        rootRowArgs: {
            node: {
                itemId: '123',
                item: {
                    link: 'This is a link',
                    urn: 'This is an urn'
                },
                nodeProperties: {
                    fields: fieldsMapA
                },
                hasChildren: true
            },
            expectedDisplayProperties: {
                field1: field1,
                field2: field2
            }
        }
    };
})());
