import BomFieldFactory from 'com/autodesk/models/bomGraph/bomField.model.js';
import BomGraphBuilder from 'com/autodesk/models/bomGraph/bomGraphBuilder.service.js';

angular.module(__moduleName, [])
    .factory('BomField', BomFieldFactory)
    .service('BomGraphBuilder', BomGraphBuilder);
