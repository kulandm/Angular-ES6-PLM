import CreateItemDialogController from './createItemDialog.controller.js';
import CreateItemController from './createItem.controller.js';
import CreateItemPayloadBuilder from './CreateItemPayloadBuilder.js';
import ManagedItemController from './managedItem.controller.js';
import CreateItemDirective from './createItem.directive.js';
import ManagedItemDirective from './managedItem.directive.js';

angular.module(__moduleName, [
])
.value('CreateItemPayloadBuilder', CreateItemPayloadBuilder)
.controller('CreateItemDialogController', CreateItemDialogController)
.controller('CreateItemController', CreateItemController)
.controller('ManagedItemController', ManagedItemController)
.directive('createItem', CreateItemDirective)
.directive('managedItem', ManagedItemDirective)

// Constants for the different types of Create Item
.constant('CreateTypes', {
	CONTEXTUAL: 1,
	FULL: 2,
	QUICK: 3
})
.constant('SECTION_TYPES', {FIELD_CONTAINER: 'FIELDCONTAINER', CLASSIFICATION: 'CLASSIFICATION'})
.constant('CLASSIFICATION_FIELD_TYPES', {TEXT: 'text', NUMBER: 'number', PICKLIST: 'picklist'})
.constant('DATA_SOURCE_TYPES', {cws: 'CWS', plm: 'PLM'});
