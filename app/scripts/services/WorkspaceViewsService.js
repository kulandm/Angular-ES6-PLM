'use strict';

/**
 * @ngdoc object
 * @name Services.WorkspaceViewsService
 *
 * @description Returns the list of views created for a specific workspace
 *
 * ##Dependencies
 * - Requires {@link Miscellaneous.RESTWrapperService}
 */
/* global plm360 */
plm360.factory('WorkspaceViewsService', [
	'RESTWrapperService',
	function (RESTWrapperService) {

		return {

			/**
			 * @ngdoc method
			 * @name Services.WorkspaceViewsService#getAvailableFields
			 * @methodOf Services.WorkspaceViewsService
			 * @description Returns the available fields for this view
			 * @param 	{Integer} 		workspaceId 	The workspace id to retrieve data from
			 *
			 * @returns {Object} 		A promise of the GET request
			 */
			getAvailableFields: function (workspaceId) {
				return RESTWrapperService.post(null, 'report/getFields.form?workspaceID=' + workspaceId + '&' + (new Date()).getTime(), null, null, null);
			},

			/**
			 * @ngdoc method
			 * @name Services.WorkspaceViewsService#getViewData
			 * @methodOf Services.WorkspaceViewsService
			 * @description Returns the metadata for the view
			 * @param {Integer}			viewId			The view id to retrieve metadata from
			 *
			 * @returns {Object} 		A promise of the GET request
			 */
			getViewData: function (viewId) {
				return RESTWrapperService.get('report/getViewData.form?reportId=' + viewId);
			},

			/**
			 * @ngdoc method
			 * @name Services.WorkspaceViewsService#saveViewData
			 * @methodOf Services.WorkspaceViewsService
			 * @description Saves the view
			 * @param 	{Object} 		data 			The data to be saved
			 *
			 * @returns {Object} 		A promise of the GET request
			 */
			saveViewData: function (data) {
				return RESTWrapperService.post(data, 'report/store.form', null, null, null);
			},

			/**
			 * @ngdoc method
			 * @name Services.WorkspaceViewsService#getFilterTypes
			 * @methodOf Services.WorkspaceViewsService
			 * @description Returns the metadata for the view
			 * @param {Integer}			fieldType			The id of the type of field
			 *
			 * @returns {Object} 		A promise of the GET request
			 */
			getFilterTypes: function (fieldType) {
				return RESTWrapperService.get('report/getFilters.form?fieldType=' + fieldType);
			}
			/*
			SAMPLE POST
			{
				"reportID": -1,
				"defaultWorkspaceViewReport": true|false,
				"reportOnDeletedItems": "DELETED_ONLY|NON_DELETE_ONLY",
				"reportName": "test view",
				"workspaceID": "7",
				"displayFieldsList": [
					{
						"fieldID": "WF_ITEM_LAST_TIMESTAMP",
						"fieldTypeID": 14,
						"aggregation": "",
						"displayOrder": 0
					}
				],
				"advancedFilterString": "",
				"filtersFieldsList": [
					{
						"fieldID": "NAME",
						"fieldTypeID": 0,
						"filterType": {
							"filterID": 5
						},
						"filterValue": "huiiuh"
					}
				]
			}*/
		};
	}
]);
