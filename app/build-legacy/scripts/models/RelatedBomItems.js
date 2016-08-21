'use strict';

/**
 * @ngdoc object
 * @name Models.RelatedBomItems
 *
 * @description This class wraps a list of RelatedBomItems payload into an object
 *
 * ##Dependencies
 *
 */

var RelatedBomItems = function RelatedBomItems() {
	var that = this;
};

RelatedBomItems.prototype = {
	/**
  * @ngdoc method
  * @name Models.RelatedBomItems#fetch
  * @methodOf Models.RelatedBomItems
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return that.RESTWrapperService.get(link, null, null, { skipCache: true }).then(function (bomItemsPayload) {
			// Need to pass Option 'Skip cache' as the data may frquently change
			that.json = bomItemsPayload[0].items;
			var promises = _.map(that.json, function (bomitem, index) {
				var workspaceId = bomitem.item.link.split('/workspaces/')[1].split('/items/')[0];
				return this.PermissionService.hasPermissions([this.PLMPermissions.VIEW_ITEMS], workspaceId).then(function (hasPermission) {
					if (hasPermission) {
						return that.RESTWrapperService.get(bomitem.item.link.substring(1), null, null, { skipCache: true }).then(function (itemDetailsPayload) {
							that.itemDetail = itemDetailsPayload;
							return new RelatedBomItem(itemDetailsPayload);
						});
					} else {
						return null;
					}
				});
			}, that);
			return that.$q.all(promises).then(function (results) {
				return _.filter(results);
			});
		});
	},

	/**
  * @ngdoc method
  * @name Models.RelatedBomItems#getAllChildren
  * @methodOf Models.RelatedBomItems
  * @description Make a call to get all bom-items recursively untill the items becomes empty
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Array} bomItems The array to store the link of all children
  *
  * @returns {Object} An object representation of the formatted data
  */
	getAllChildren: function getAllChildren(link, bomItems, isRootBOM) {
		var that = this;
		var workspaceId = link.split('/workspaces/')[1].split('/items/')[0];
		return this.PermissionService.hasPermissions([this.PLMPermissions.VIEW_ITEMS, this.PLMPermissions.VIEW_BOM], workspaceId).then(function (hasPermission) {
			if (hasPermission) {
				return that.RESTWrapperService.get(link, null, null, {}).then(function (bomItemsPayload) {
					if (!isRootBOM) {
						bomItems.push(bomItemsPayload[0].__self__);
					}
					var items = bomItemsPayload[0].items;
					if (!items.length) {
						return Promise.resolve();
					}
					return Promise.all(_.map(items, function (bomitem, index) {
						return that.getAllChildren(bomitem.item.link.substring(1) + '/bom-items?limit=999&revisionBias=working', bomItems, false);
					}));
				});
			} else {
				return null;
			}
		});
	},

	/**
  * @ngdoc method
  * @name Models.RelatedBomItems#getItemDetails
  * @methodOf Models.RelatedBomItems
  * @description Make a call to get item details
  *
  * @param {Array} The Array of url
  *
  * @returns {Object} An object representation of the formatted data
  */
	getItemDetails: function getItemDetails(itemLinkArr) {
		var that = this;
		var promises = _.map(itemLinkArr, function (itemLink, index) {
			var workspaceId = itemLink.split('/workspaces/')[1].split('/items/')[0];
			return this.PermissionService.hasPermissions([this.PLMPermissions.VIEW_ITEMS], workspaceId).then(function (hasPermission) {
				if (hasPermission) {
					return that.RESTWrapperService.get(itemLink.split('/bom-items?')[0].substring(1), null, null, { skipCache: true }).then(function (itemDetailsPayload) {
						that.itemDetail = itemDetailsPayload;
						return new RelatedBomItem(itemDetailsPayload);
					});
				} else {
					return null;
				}
			});
		}, that);
		return that.$q.all(promises).then(function (results) {
			return _.filter(results);
		});
	},

	/**
  * @ngdoc method
  * @name Models.RelatedBomItems#getFullList
  * @methodOf Models.RelatedBomItems
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	}
};

angular.module('plm360.models').factory('RelatedBomItems', ['RESTWrapperService', 'EventService', 'PermissionService', 'PLMPermissions', '$q', function (RESTWrapperService, EventService, PermissionService, PLMPermissions, $q) {
	var models = {};
	RelatedBomItems.prototype.RESTWrapperService = RESTWrapperService;
	RelatedBomItems.prototype.PermissionService = PermissionService;
	RelatedBomItems.prototype.PLMPermissions = PLMPermissions;
	RelatedBomItems.prototype.$q = $q;

	EventService.listen('relatedBomItemsAllChildren:*:get', function (event, params) {
		var model = models[params] || new RelatedBomItems();
		var bomItems = [];
		models[params] = model;
		model.getAllChildren(params, bomItems, true).then(function () {
			model.getItemDetails(bomItems).then(function (obj) {
				EventService.send('relatedBomItems:' + event.split(':')[1] + ':done', obj);
			});
		});
	});

	EventService.listen('relatedBomItems:*:get', function (event, params) {
		var model = models[params] || new RelatedBomItems();
		var bomItems = [];
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('relatedBomItems:' + event.split(':')[1] + ':done', obj);
		});
	});
	return RelatedBomItems;
}]);
//# sourceMappingURL=RelatedBomItems.js.map
