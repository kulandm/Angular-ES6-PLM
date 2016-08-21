/* eslint-disable */
import WorkspaceTableauFlyoutController from './workspaceTableauFlyout.controller.js';
import WorkspaceTableauFlyoutDirective from './workspaceTableauFlyout.directive.js';
import WorkspaceTableauFlyoutBox from './workspaceTableauFlyoutBox.controller.js';
import TableauPayloadBuilder from './TableauPayloadBuilder.js';

angular.module(__moduleName, [
	])
.value('TableauPayloadBuilder', TableauPayloadBuilder)
.controller('WorkspaceTableauFlyoutController', WorkspaceTableauFlyoutController)
.controller('WorkspaceTableauFlyoutBox', WorkspaceTableauFlyoutBox)
.directive('workspaceTableauFlyout', WorkspaceTableauFlyoutDirective);
