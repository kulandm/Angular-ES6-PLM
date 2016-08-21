import ConfigurationsFactory from 'com/autodesk/models/configurations/configurations.model.js';
import ConfigurationsListeners from 'com/autodesk/models/configurations/configurationsListeners.service.js';

angular.module(__moduleName, [])
    .factory('Configurations', ConfigurationsFactory)
    .service('ConfigurationsListeners', ConfigurationsListeners);
