import ViewAttachedItemsController from './viewAttachedItems.controller.js';

import 'com/autodesk/WipApiService.js';
import 'com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js';

angular.module(__moduleName, [
	'com/autodesk/WipApiService.js',
	'com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js'
])
.controller('ViewAttachedItemsController', ViewAttachedItemsController);
