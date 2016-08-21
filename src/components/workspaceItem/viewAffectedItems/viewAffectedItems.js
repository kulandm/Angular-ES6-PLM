import ViewAffectedItemsController from './viewAffectedItems.controller.js';
import AddLinkableItemsController from '../addLinkableItems/addLinkableItems.controller.js';
import AddRelatedBomController from './addRelatedBom.controller.js';
import BulkEditController from './bulkEdit.controller.js';

angular.module(__moduleName, [])

.controller('ViewAffectedItemsController', ViewAffectedItemsController)
.controller('AddLinkableItemsController', AddLinkableItemsController)
.controller('AddRelatedBomController', AddRelatedBomController)
.controller('BulkEditController', BulkEditController)

.constant('ManagedItemColumnIndex', {
	ROW_STATUS: 0,
	SELECTION: 1,
	ROW_ID: 2,
	ITEM_DESCRIPTOR: 3,
	LIFECYCLE: 4,
	EFFECTIVITY: 5,
	FROM: 6,
	TO: 7
});
