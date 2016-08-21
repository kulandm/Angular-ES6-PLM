import ClassicAttachmentsActionButtonController from './classicAttachmentsActionButton.controller.js';
import ClassicAttachmentsActionButtonDirective from './classicAttachmentsActionButton.directive.js';
import OnFilesSelectedDirective from './onFilesSelected.directive.js';

angular.module(__moduleName, [])
.controller('ClassicAttachmentsActionButtonController', ClassicAttachmentsActionButtonController)
.directive('classicAttachmentsActionButton', [ClassicAttachmentsActionButtonDirective.directiveFactory])
.directive('onFilesSelected', [OnFilesSelectedDirective.directiveFactory]);
