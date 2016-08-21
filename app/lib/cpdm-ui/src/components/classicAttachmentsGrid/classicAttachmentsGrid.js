import ClassicAttachmentsGridController from './classicAttachmentsGrid.controller.js';
import ClassicAttachmentsGridDirective from './classicAttachmentsGrid.directive.js';
import FileSizeFilter from '../../filters/fileSizeFilter.js';

angular.module(__moduleName, [
	'ui.grid',
	'ui.grid.selection',
	'ui.grid.treeView',
	'ui.grid.autoResize'
])
.controller('ClassicAttachmentsGridController', ClassicAttachmentsGridController)
.directive('classicAttachmentsGrid', ['$timeout', ClassicAttachmentsGridDirective.directiveFactory])
.filter('fileSizeFilter', FileSizeFilter);
