/**
 * @ngdoc object
 * @name Services.ClassicRedirector
 *
 * @description This service redirects to Classic PLM's equivalent of the current path
 *
 * ##Dependencies
 *
 */
const TABMAPPING = {
	'workspace-item-details': 'itemdetails',
	'workspace-item-affected-items': 'linkeditems',
	'workspace-item-grid': 'griddetails',
	'project-management': 'projectmanagement',
	attachments: 'partattachment',
	'workflow-map': 'workflowactions',
	'workspace-item-bom': 'bomviewnested',
	'workspace-item-where-used': 'bomviewwhereused',
	'workspace-item-sourcing': 'sourcing',
	'workspace-item-supplied-items': 'sourcingsupplieditems',
	'workspace-item-relationships': 'relatinoship',
	workflow: 'linkeditemsreferences',
	'workspace-item-milestones': 'milestonesdetails',
	'change-log': 'parthistory'
};

class ClassicRedirector {

	/*
	 * @ngdoc method
	 * @name Services.ClassicRedirector#constructor
	 * @methodOf Services.ClassicRedirector
	 * @description The class constructor
	 */
	constructor() {

	}

	/**
	 * @ngdoc method
	 * @name Services.ClassicRedirector#getUrl
	 * @methodOf Services.ClassicRedirector
	 * @description Constructs the url for redirection given the parameters
	 *
	 * @param {Object} state The current $state object
	 * @param {Object} location The current $location object
	 *
	 * @return {String} The url to navigate to
	 */
	getUrl(state, location) {
		let destinationUrl = '/';
		let stateName = state.current.name;
		let parentName = state.current.parent;
		let queryParams = location.search();
		switch (stateName) {
			case 'dashboard':
				break;
			case 'workspace-items-list':
				let workspaceId = state.params.workspaceId;
				destinationUrl = '/workspace#workspaceid=' + workspaceId;
				if (queryParams.itemId) {
					let idParam = queryParams.itemId;

					let workspaceId = '';
					let itemId = '';

					// old format of item id
					if (idParam.indexOf('@') > -1) {
						let parts = idParam.split('@');
						workspaceId = parts[0];
						itemId = parts[1];
					} else {
						// ============ start of exception of exception of exception =============
						// since we're using URNs in payloads, it'll not be easy to fetch dmsId and workspaceId through /api/v3/urn of an item
						// since this is temporary anyway, I'm falling back to parsing the URN directly, assuming parts[length-1] is item id and parts[length-2] is workspace id
						let parts = idParam.split(',');
						workspaceId = parts[parts.length - 2];
						itemId = parts[parts.length -1];
						// ============ end of exception of exception of exception ==================
					}

					let stateNameAsKey = queryParams.tab;

					destinationUrl = '/workspace#workspaceid=' + workspaceId + '&dmsid=' + itemId + '&tab=' + TABMAPPING[stateNameAsKey];
				}
				break;
			default:
				// if (parentName.indexOf('workspace-item') > -1) {
				// 	let idParam = state.params.itemId;

				// 	let workspaceId = '';
				// 	let itemId = '';

				// 	// old format of item id
				// 	if (idParam.indexOf('@') > -1) {
				// 		let parts = idParam.split('@');
				// 		workspaceId = parts[0];
				// 		itemId = parts[1];
				// 	} else {
				// 		// ============ start of exception of exception of exception =============
				// 		// since we're using URNs in payloads, it'll not be easy to fetch dmsId and workspaceId through /api/v3/urn of an item
				// 		// since this is temporary anyway, I'm falling back to parsing the URN directly, assuming parts[length-1] is item id and parts[length-2] is workspace id
				// 		let parts = idParam.split(',');
				// 		workspaceId = parts[parts.length - 2];
				// 		itemId = parts[parts.length -1];
				// 		// ============ end of exception of exception of exception ==================
				// 	}

				// 	let stateNameAsKey = stateName.substring(0, stateName.lastIndexOf('-'));

				// 	destinationUrl = '/workspace#workspaceid=' + workspaceId + '&dmsid=' + itemId + '&tab=' + TABMAPPING[stateNameAsKey];
				// }
		}
		return destinationUrl;
	}
}

export default angular.module(__moduleName, []).factory('ClassicRedirector', [
	() => new ClassicRedirector()
]);
