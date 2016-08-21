'use strict';

/**
 * @ngdoc object
 * @name Models.Tabs
 *
 * @description This class wraps a list of Tabs payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Tabs = function Tabs() {};

Tabs.prototype = {
	/**
  * @ngdoc method
  * @name Models.Tabs#fetch
  * @methodOf Models.Tabs
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.Tabs#getFullList
  * @methodOf Models.Tabs
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	}
};

angular.module('plm360.models').factory('Tabs', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Tabs.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('itemTabs:*:get', function (event, params) {
		var model = models[params] || new Tabs();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('itemTabs:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Tabs;
}])
// These constants maps to the actionName of the tabs payload.
.constant('TabActionNameTypes', {
	ITEM_DETAILS: 'itemDetails',
	LINKED_ITEMS: 'linkedItems',
	PROJECT_MANAGEMENT: 'projectManagement',
	RELATIONSHIPS: 'relationships',
	PART_ATTACHMENTS: 'partAttachment',
	WORKFLOW_ACTIONS: 'workflowActions',
	PART_HISTORY: 'partHistory',
	NAMED_RELATIONSHIPS: 'namedRelationshipsTab'
});
//# sourceMappingURL=Tabs.js.map
