System.get('com/autodesk/usersSelector.js');
import ChangeOwnerController from './changeOwner.controller.js';
import EditAdditionalOwnersController from './editAdditionalOwners.controller.js';

angular.module(__moduleName, [
	'com/autodesk/usersSelector.js'
])
.controller('ChangeOwnerController', ChangeOwnerController)
.controller('EditAdditionalOwnersController', EditAdditionalOwnersController)
.constant('OWNER_TYPE', {
	PRIMARY: 'PRIMARY',
	ADDITIONAL_USER: 'ADDITIONAL_USER',
	ADDITIONAL_GROUP: 'ADDITIONAL_GROUP'
});
