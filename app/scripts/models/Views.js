'use strict';

/**
 * @ngdoc object
 * @name Models.Views
 *
 * @description This class wraps a list of views payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Views = function () {
};

/**
 * @ngdoc method
 * @name Models.Views#getViewId
 * @methodOf Models.Views
 * @description Parse the id of a view using the link
 *
 * @param {String} link The URL where the id is extracted from
 *
 * @returns {Integer} Id of the View
 */
function getViewId(link) {
	return parseInt(link.substring(link.lastIndexOf('/') + 1));
}

Views.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.Views#fetch
	 * @methodOf Models.Views
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			if (angular.isDefined(that.json) && angular.isDefined(that.json.items)) {
				that.json.items.forEach(function (view) {
					view.link = 'api/v3/workspaces/[workspaceId]/reports/' + getViewId(view.link);
					view.id = getViewId(view.link);
				});
			}
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.Views#getFullList
	 * @methodOf Models.Views
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		if (angular.isDefined(this.json.items)) {
			return angular.copy(this.json.items);
		} else {
			return [];
		}
	},

	/**
	 * @ngdoc method
	 * @name Models.Views#getDefaultViewId
	 * @methodOf Models.Views
	 * @description Returns the view that was set as default, first one if none
	 *
	 * @returns {Object} The view id of the default view
	 */
	getDefaultViewId: function () {
		if (angular.isUndefined(this.json) || angular.isUndefined(this.json.items)) {
			return {};
		}
		return getViewId(this.json.items[0].link);
	},

	/**
	 * @ngdoc method
	 * @name Models.Views#getViewLink
	 * @methodOf Models.Views
	 * @description Returns the view items link
	 *
	 * @param {Number} viewId The ID of the view whose items to retrieve
	 *
	 * @returns {String} The link for the view whose items to retrieve
	 */
	getViewLink: function (viewId) {
		if (angular.isUndefined(this.json) || angular.isUndefined(this.json.items)) {
			return '';
		}
		var viewObj = '';

		this.json.items.forEach(function (view) {
			if (getViewId(view.link) === parseInt(viewId)) {
				viewObj = view.link;
			}
		});

		return viewObj;
	},

	/**
	 * @ngdoc method
	 * @name Models.Views#getViewLink
	 * @methodOf Models.Views
	 * @description Returns the view items link
	 *
	 * @param {Number} viewId The ID of the view whose items to retrieve
	 * @param {Object} obj The object to be stored
	 *
	 */
	setViewObj: function (viewId, obj) {
		if (angular.isUndefined(this.json) || angular.isUndefined(this.json.items)) {
			return '';
		}
		var viewObj = '';

		this.json.items.forEach(function (view) {
			if (getViewId(view.link) === viewId) {
				view.obj = obj;
			}
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.Views#getView
	 * @methodOf Models.Views
	 * @description Returns the view that was set as default, first one if none
	 *
	 * @param {Number} viewId The ID of the view to retrieve
	 *
	 * @returns {Object} The view definition of the default view
	 */
	getView: function (viewId) {
		if (angular.isUndefined(this.json) || angular.isUndefined(this.json.items)) {
			return {};
		}
		var viewObj = {};
		this.json.items.forEach(function (view) {
			if (getViewId(view.link) === viewId) {
				viewObj = view;
			}
		});

		return viewObj;
	}
};

angular.module('plm360.models').factory('Views', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		Views.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('views:*:get', function (event, params) {
			var model = models[params] || new Views();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('views:' + event.split(':')[1] + ':done', obj);
			});
		});
		return Views;
	}
]);
