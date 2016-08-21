import ViewDetailsController from './viewDetails.controller.js';

angular.module(__moduleName, [
	// 'src/_base/UnderscoreService.js',
	// 'src/services/EventService.js'
])
.controller('ViewDetailsController', ViewDetailsController)
.constant('SECTION_TYPES', {FIELD_CONTAINER: 'FIELDCONTAINER', CLASSIFICATION: 'CLASSIFICATION'})
.constant('CLASSIFICATION_FIELD_TYPES', {TEXT: 'text', NUMBER: 'number', PICKLIST: 'picklist'})
.constant('DATA_SOURCE_TYPES', {cws: 'CWS', plm: 'PLM'});