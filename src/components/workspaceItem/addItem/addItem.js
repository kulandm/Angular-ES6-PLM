import AddItemController from './addItem.controller.js';

angular.module(__moduleName, [
	// 'src/_base/UnderscoreService.js',
	// 'src/services/EventService.js'
])
.controller('AddItemController', AddItemController)
.constant('SECTION_TYPES', {FIELD_CONTAINER: 'FIELDCONTAINER', CLASSIFICATION: 'CLASSIFICATION'});