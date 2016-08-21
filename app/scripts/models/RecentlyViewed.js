'use strict';

/**
 * @ngdoc object
 * @name Models.RecentlyViewed
 *
 * @description This class wraps an outstanding work payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var RecentlyViewed = function (json) {
	this.json = json;
};

RecentlyViewed.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.RecentlyViewed#fetch
	 * @methodOf Models.RecentlyViewed
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload.recentlyViewedItems;
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
	 * @name Models.RecentlyViewed#getDisplayableData
	 * @methodOf Models.RecentlyViewed
	 * @description Returns formatted data of the recently viewed items to be displayed in a tabular widget
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	getDisplayableData: function () {
		var ret = {};
		var that = this;

		if ((angular.isDefined(this.json)) && (this.json !== null)) {
			ret = angular.copy(this.json);

			var toBeSpliced = [];
			angular.forEach(ret, function (value, datalistkey) {
				if (!value.item) {
					toBeSpliced.push(datalistkey);
					return;
				}

				ret[datalistkey].itemdescription = {
					val: value.item.title,
					href: that.$state.href('details', {
						workspaceId: value.workspace.id,
						tab: 'details',
						view: 'full',
						mode: 'view',
						itemId: that.UrnParser.encode(value.item.urn)
					})
				};
				ret[datalistkey].workspace = {
					val: value.workspace.label,
					href: that.$state.href('workspace-items-list', {workspaceId: value.workspace.id})
				};
			});

			var decrementCounter = 0;
			angular.forEach(toBeSpliced, function (value) {
				ret.splice(value - decrementCounter, 1);
				decrementCounter++;
			});
		}

		return {data: ret};
	}
};

angular.module('plm360.models').factory('RecentlyViewed', [
	'RESTWrapperService',
	'$state',
	'$q',
	'UrnParser',
	'EventService',
	function (RESTWrapperService, $state, $q, UrnParser, EventService) {
		var models = {};
		RecentlyViewed.prototype.RESTWrapperService = RESTWrapperService;
		RecentlyViewed.prototype.$state = $state;
		RecentlyViewed.prototype.$q = $q;
		RecentlyViewed.prototype.UrnParser = UrnParser;
		EventService.listen('recentlyViewed:*:get', function (event, params) {
			var model = models[params] || new RecentlyViewed();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('recentlyViewed:' + event.split(':')[1] + ':done', obj);
			});
		});
		return RecentlyViewed;
	}
]);
