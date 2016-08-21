import WipAttachmentsListController from './wipAttachmentsList.controller.js';
import WipAttachmentsListDirective from './wipAttachmentsList.directive.js';
import AttachmentModel from '../../models/wipAttachments/attachment.model.js';
import 'com/autodesk/wipFileTypeIcon.js';

angular.module(__moduleName, [
	AttachmentModel.name,
	'com/autodesk/wipFileTypeIcon.js'
])
.controller('WipAttachmentsListController', WipAttachmentsListController)
.directive('wipAttachmentsList', WipAttachmentsListDirective);
