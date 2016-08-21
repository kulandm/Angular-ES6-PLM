import ViewWorkflowActionsController from './viewWorkflowActions.controller.js';

angular.module(__moduleName, [
	'com/autodesk/UnderscoreService.js',
	'com/autodesk/EventService.js',
	'ngMaterial'
])
.controller('ViewWorkflowActionsController', ViewWorkflowActionsController);
