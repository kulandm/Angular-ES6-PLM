import ItemHeaderController from './itemHeader.controller.js';
import ItemHeaderDirective from './itemHeader.directive.js';
import WorkflowTransitionController from './workflowTransition.controller.js';

angular.module(__moduleName, [
	'com/autodesk/UnderscoreService.js',
	'com/autodesk/EventService.js'
])
.controller('ItemHeaderController', ItemHeaderController)
.directive('itemHeader', ItemHeaderDirective)
.controller('WorkflowTransitionController', WorkflowTransitionController)
.constant('WorkflowTransitionFormDefaultWidth', '350')
.constant('MaxCommentsLength', '2000')
.filter('workflowTransitionPermission', (_) => {
	return (transitions, userPermissionsObj) => {
		if (angular.isDefined(userPermissionsObj) && angular.isDefined(userPermissionsObj.hasPermission)) {
			return _.filter(transitions, (transition) => {
				return true;
				// return transition.permission ? userPermissionsObj.hasPermission(parseInt(transition.permission.link.substring(transition.permission.link.lastIndexOf('/') + 1))) : true;
			});
		} else {
			return transitions;
		}
	};
});
