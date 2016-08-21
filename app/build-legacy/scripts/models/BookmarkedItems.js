'use strict';

/**
 * @ngdoc object
 * @name Models.BookmarkedItems
 *
 * @description This class wraps a bookmarked items payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var BookmarkedItems = function BookmarkedItems(json) {
	this.json = json;
};

BookmarkedItems.prototype = {
	/**
  * @ngdoc method
  * @name Models.BookmarkedItems#fetch
  * @methodOf Models.BookmarkedItems
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload.bookmarks;

			angular.forEach(that.json, function (item) {
				item.workspace.id = item.workspace.link.substring(item.workspace.link.lastIndexOf('/') + 1);
				// for backwards compatibility, we call "title" label, so we copy value
				item.workspace.label = item.workspace.title;
			});

			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.BookmarkedItems#getDisplayableData
  * @methodOf Models.BookmarkedItems
  * @description Returns formatted data of the bookmarked items to be displayed in a tabular widget
  *
  * @returns {Object} An object representation of the formatted data
  *
  */
	getDisplayableData: function getDisplayableData() {
		var ret = {};
		var that = this;

		if (angular.isDefined(this.json) && this.json !== null) {
			ret = angular.copy(this.json);

			var toBeSpliced = [];

			angular.forEach(ret, function (value, datalistkey) {

				if (!value || !value.item) {
					toBeSpliced.push(datalistkey);
					return;
				}

				var wsId = value.item && value.item.link && value.item.link.split('/')[4] || null;
				var itemUrn = value.item && value.item.urn && that.UrnParser.encode(value.item.urn) || null;
				var wsTitle = value.workspace.label;

				if (wsId && itemUrn) {

					ret[datalistkey].itemdescription = {
						val: value.item.title,
						href: that.$state.href('details', {
							workspaceId: wsId,
							tab: 'details',
							view: 'full',
							mode: 'view',
							itemId: itemUrn
						})
					};
					ret[datalistkey].workspace = {
						val: wsTitle || '',
						href: that.$state.href('workspace-items-list', { workspaceId: wsId })
					};
					ret[datalistkey].actiontext = {
						label: '',
						workspaceId: wsId,
						itemId: itemUrn
					};
				}
			});

			if (Array.isArray(ret)) {
				var decrementCounter = 0;
				angular.forEach(toBeSpliced, function (value) {
					ret.splice(value - decrementCounter, 1);
					decrementCounter++;
				});
			}
		}

		return { data: ret };
	},

	/**
  * @ngdoc method
  * @name Models.BookmarkedItems#isItemBookmarked
  * @methodOf Models.BookmarkedItems
  * @description Returns whether an item is bookmarked
  *
  * @param {Number} itemId The ID of the item to be checked
  *
  * @returns {Boolean} True if item is bookmarked, false otherwise
  */
	isItemBookmarked: function isItemBookmarked(itemId) {
		var that = this;
		var ret = false;
		if (angular.isDefined(this.json) && this.json !== null) {
			_.each(this.json, function (value) {
				if (angular.isObject(value) && value.item && value.item !== null) {
					// Since this item ID format is not used anymore, it should
					// not be necessary to keep this conditional.
					// Left it here just for transition sake.
					if (itemId.indexOf('@') !== -1) {
						var parsedItemId = itemId.split('@')[1];
						var thisId = value.item && value.item.link && value.item.link.split('/')[6] || null;
						if (parseInt(thisId) === parseInt(parsedItemId)) {
							ret = true;
						}
					} else {
						if (value.item.urn === that.UrnParser.decode(itemId)) {
							ret = true;
						}
					}
				}
			});
		}
		return ret;
	}
};

angular.module('plm360.models').factory('BookmarkedItems', ['RESTWrapperService', '$state', '$q', 'UrnParser', 'EventService', 'ModelsManager', function (RESTWrapperService, $state, $q, UrnParser, EventService, ModelsManager) {
	var models = {};
	BookmarkedItems.prototype.RESTWrapperService = RESTWrapperService;
	BookmarkedItems.prototype.$state = $state;
	BookmarkedItems.prototype.$q = $q;
	BookmarkedItems.prototype.UrnParser = UrnParser;
	BookmarkedItems.prototype.EventService = EventService;
	BookmarkedItems.prototype.ModelsManager = ModelsManager;
	EventService.listen('bookmarkedItems:*:get', function (event, params) {
		var model = models[params] || new BookmarkedItems();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('bookmarkedItems:' + event.split(':')[1] + ':done', obj);
		});
	});
	return BookmarkedItems;
}]);
//# sourceMappingURL=BookmarkedItems.js.map
