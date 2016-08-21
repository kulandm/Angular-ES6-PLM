'use strict';

angular.module('plm360.mockData').value('MockConfigurations', [{
        'link': '/api/v3/configurations/someConfiguration',
        'title': 'SomeValue',
        'urn': 'urn:adsk.plm:tenant.configuration:DEVINDMACHINEVIEW.someConfiguration',
        'permissions': []
    }, {
        'link': '/api/v3/configurations/someOtherConfiguration',
        'title': '47',
        'urn': 'urn:adsk.plm:tenant.configuration:DEVINDMACHINEVIEW.someOtherConfiguration',
        'permissions': []
    }
]);
