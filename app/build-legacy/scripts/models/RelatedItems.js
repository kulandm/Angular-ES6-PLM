'use strict';

/**
 * @ngdoc object
 * @name Models.RelatedItems
 *
 * @description This class wraps a list of RelatedItems payload into an object
 *
 * ##Dependencies
 *
 */

var RelatedItems = function RelatedItems() {};

RelatedItems.prototype = {
	/**
  * @ngdoc method
  * @name Models.RelatedItems#fetch
  * @methodOf Models.RelatedItems
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = [];

			angular.forEach(payload, function (item, index) {
				/* global RelatedItem */
				that.json[index] = new RelatedItem(item);
			}, that);

			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.RelatedItems#getFullList
  * @methodOf Models.RelatedItems
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.RelatedItems#save
  * @methodOf Models.RelatedItems
  * @description Saves the newly added and modified items.
  *
  * @param {Array} List of items which can be a mixture of newly added and
  * modified items.
  *
  * @returns {Promise} Result of saving all the items. If some or all the
  * items are *not* saved, the promise is rejected.
  */
	save: function save(items) {
		var _this = this;

		var promises = this._.map(items, function (item) {
			// Call the appropriate method based on whether the item is newly
			// added (has an `associateItem` property) or has been modified
			if (item.associateItem) {
				return _this.saveAddedItem(item).then(function () {
					return {
						title: item.item.title,
						urn: item.item.urn,
						isSaved: true,
						isAdded: true
					};
				}, function () {
					return {
						title: item.item.title,
						urn: item.item.urn,
						isSaved: false
					};
				});
			} else if (item.descriptionField.value !== item.descriptionField.originalValue) {
				return _this.saveExistingItem(item).then(function () {
					return {
						title: item.item.title,
						urn: item.item.urn,
						isSaved: true
					};
				}, function () {
					return {
						title: item.item.title,
						urn: item.item.urn,
						isSaved: false
					};
				});
			}
		});

		// Filter out undefineds (since _.map is used)
		return this.$q.all(_.filter(promises));
	},

	/**
  * @ngdoc method
  * @name Models.RelatedItems#saveExistingItem
  * @methodOf Models.RelatedItems
  * @description Saves an existing item (PUT request).
  *
  * @param {Object} The item to be saved.
  *
  * @returns {Promise} Result of saving the item.
  */
	saveExistingItem: function saveExistingItem(item) {
		var data = {
			direction: item.direction,
			description: item.descriptionField.value
		};

		return this.RESTWrapperService.put(data, item.__self__.substring(1), null, null, null, {});
	},

	/**
  * @ngdoc method
  * @name Models.RelatedItems#saveAddedItem
  * @methodOf Models.RelatedItems
  * @description Saves a newly added item (POST request).
  *
  * @param {Object} The item to be saved.
  *
  * @returns {Promise} Result of saving the item.
  */
	saveAddedItem: function saveAddedItem(item) {
		var locationUrl = item.__self__;
		var data = {
			direction: {
				type: item.directionField.value.link
			},
			description: item.descriptionField.value
		};
		var base = 'api/v3';
		var path = [{ workspaces: item.associateItem.workspaceId }, { items: item.associateItem.itemId }, 'views/10'];
		var params = null;
		var headers = {
			'Content-Location': locationUrl
		};
		var options = {};

		return this.RESTWrapperService.post(data, base, path, params, headers, options);
	}
};

angular.module('plm360.models').factory('RelatedItems', ['RESTWrapperService', 'EventService', 'ModelsManager', '$q', '_', function (RESTWrapperService, EventService, ModelsManager, $q, _) {
	var models = {};
	RelatedItems.prototype.RESTWrapperService = RESTWrapperService;
	RelatedItems.prototype.$q = $q;
	RelatedItems.prototype._ = _;

	EventService.listen('relatedItems:*:get', function (event, params) {
		var model = models[params] || new RelatedItems();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('relatedItems:' + event.split(':')[1] + ':done', obj);
		});
	});

	EventService.listen('relatedItems:*:save', function (event, obj, itemList) {
		obj.save(itemList).then(function (results) {
			ModelsManager.resetModels();
			EventService.send('relatedItems:' + event.split(':')[1] + ':saveDone', results);
		});
	});

	return RelatedItems;
}]);
//# sourceMappingURL=RelatedItems.js.map
