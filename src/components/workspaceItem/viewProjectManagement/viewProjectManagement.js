import ViewProjectManagementController from './viewProjectManagement.controller.js';
import AddLinkableItemsController from '../addLinkableItems/addLinkableItems.controller.js';

angular.module(__moduleName, [
	'gantt',
	'gantt.progress',
	'gantt.tooltips'
])
.controller('ViewProjectManagementController', ViewProjectManagementController)
.controller('AddLinkableItemsController', AddLinkableItemsController);
