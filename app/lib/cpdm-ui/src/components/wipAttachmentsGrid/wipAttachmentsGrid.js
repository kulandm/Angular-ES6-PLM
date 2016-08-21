import WipAttachmentsGridController from './wipAttachmentsGrid.controller.js';
import WipAttachmentsGridDirective from './wipAttachmentsGrid.directive.js';
import AttachmentModel from '../../models/wipAttachments/attachment.model.js';
import AttachmentVersionModel from '../../models/wipAttachments/attachmentVersion.model.js';
import FileSizeFilter from '../../filters/fileSizeFilter.js';
import 'com/autodesk/wipFileTypeIcon.js';
import 'com/autodesk/wipFileTypeName.js';

angular.module(__moduleName, [
	AttachmentModel.name,
	AttachmentVersionModel.name,
	'com/autodesk/fileOverview.js',
	'com/autodesk/wipFileTypeIcon.js',
	'com/autodesk/wipFileTypeName.js'
])
.controller('WipAttachmentsGridController', WipAttachmentsGridController)
.directive('wipAttachmentsGrid', WipAttachmentsGridDirective)
.filter('fileSizeFilter', FileSizeFilter);
