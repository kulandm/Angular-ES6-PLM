(function (module) {
	'use strict';

	/**
	 * @ngdoc object
	 * @name Models.BomNested
	 *
	 * @description This class wraps a list of BomNested payload into an object
	 *
	 * ##Dependencies
	 *
	 */
	function BomNested(json) {
		this.json = json;
		this.bomItems = [];

		if (this.json) {
			var index = 0;
			for (index = 0; index < this.json[0].items.length; index++) {
				var bomItem = this.json[0].items[index];
				bomItem.id = this.extractBomItemIdsFromLink(bomItem.link);
				this.bomItems.push(bomItem);
			}
		}
	}

	BomNested.prototype = {};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#fetch
	 * @methodOf Models.BomNested
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	BomNested.prototype.fetch = function (link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {
			skipCache: true
		}).then(function (payload) {
			return new BomNested(payload);
		});
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#extractBomItemIdsFromLink
	 * @methodOf Models.BomNested
	 * @description Extracts BomItem identifier from a given link
	 *
	 * @returns {String} The id for this bomitem
	 */
	BomNested.prototype.extractBomItemIdsFromLink = function (link) {
		return link.split('/').pop();
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#getSelfLink
	 * @methodOf Models.BomNested
	 * @description Returns the api link for this item
	 *
	 * @returns {Object} Link to object's api endpoint
	 */
	BomNested.prototype.getSelfLink = function () {
		return this.json[0].__self__.replace(/^\//, '');
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#getBomItems
	 * @methodOf Models.BomNested
	 * @description Returns the full list of bom items
	 *
	 * @returns {Array} Collection of bom items
	 */
	BomNested.prototype.getBomItems = function () {
		return this.bomItems;
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#getBomMetaObj
	 * @methodOf Models.BomNested
	 * @description Returns the bom meta object
	 *
	 * @returns {Object} the bom meta data
	 */
	BomNested.prototype.getBomMetaObj = function () {
		return this.json[0];
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#getBomConfigObj
	 * @methodOf Models.BomNested
	 * @description Returns the bom configuration object
	 *
	 * @returns {Object} the bom configuration
	 */
	BomNested.prototype.getBomConfigObj = function () {
		return this.json[1];
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#find
	 * @methodOf Models.BomNested
	 * @description Returns the requested BomNestedItem object
	 *
	 * @param {Number} id The ID of the bom nested item to be found
	 *
	 * @returns {BomNestedItem} The bom nested item object
	 */
	BomNested.prototype.find = function (id) {
		return _.find(this.getBomItems(), function (item) {
			return item.id === id;
		});
	};

	/**
	 * @ngdoc method
	 * @name Models.BomNested#BomNestedFactory
	 * @methodOf Models.BomNested
	 * @description Factory to create a BomNested Model
	 *
	 * @returns {Object} BomNested Object
	 */
	function BomNestedFactory(RESTWrapperService, EventService) {
		var models = {};
		BomNested.prototype.RESTWrapperService = RESTWrapperService;
		// get
		EventService.listen('bomNested:*:get', function (event, eventId, params) {
			var model = models[eventId] || new BomNested();
			models[eventId] = model;
			if (eventId) {
				model.fetch(eventId, params).then(function (obj) {
					EventService.send('bomNested:' + event.split(':')[1] + ':done', obj);
				});
			} else {
				EventService.send('bomNested:' + event.split(':')[1] + ':failed', null);
			}
		});

		return BomNested;
	}

	module.factory('BomNested', ['RESTWrapperService', 'EventService', BomNestedFactory]);

}(angular.module('plm360.models')));
