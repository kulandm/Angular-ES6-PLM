'use strict';

/**
 * @ngdoc object
 * @name Services.WorkspaceTabsService
 *
 * @description Returns the list of tabs from the
 *
 * ##Dependencies
 * - Requires {@link Miscellaneous.RESTWrapperService}
 */
/* global plm360 */
plm360.factory('WorkspaceTabsService', [
	'RESTWrapperService',
	'$q',
	'_',
	function (RESTWrapperService, $q, _) {

		return {

			/**
			 * @ngdoc method
			 * @name Services.WorkspaceTabsService#getWorkspaceItemGridData
			 * @methodOf Services.WorkspaceTabsService
			 * @description Returns the data containing the workspace item details information
			 *
			 * @param 	{integer} 		workspaceId 	The workspace id to retrieve data from
			 *
			 * @returns {Array} 			Data of current selected item
			 */
			getWorkspaceTabsData: function (workspaceId) {
				return RESTWrapperService.get('api/v3', [{
					workspaces: workspaceId
				}, 'tabs']);
			}
		};
	}
]);
