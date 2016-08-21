'use strict';

/**
 * @ngdoc object
 * @name Models.AffectedItem
 *
 * @description This class wraps a list of AffectedItems payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var AffectedItem = function AffectedItem(json) {
	this.json = json;

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getItemTitle
  * @methodOf Models.AffectedItem
  * @description Returns item title
  *
  * @returns {String} Item title
  */
	this.getItemTitle = function () {
		return this.json.item.title;
	};

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getWorkspaceId
  * @methodOf Models.AffectedItem
  * @description Returns workspace id
  *
  * @returns {String} Workspace id
  *
  * TODO: this is a hack. The server should return workspace information.
  */
	this.getWorkspaceId = function () {
		var urnTokens = this.json.item.urn.split('.');
		return urnTokens[urnTokens.length - 2];
	};
};

AffectedItem.prototype = {
	/**
  * @ngdoc method
  * @name Models.AffectedItem#fetch
  * @methodOf Models.AffectedItem
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {String} eTag A unique string that can be used to determine whether the object to be fetch is modified
  * or not. Note: This is an optional parameter. If eTag is not provided that this function will behave like a simple
  * fetch function.
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, eTag) {
		var that = this;

		// TODO: This header should be part of the core, so that it is applied for all supported requests.
		var header = {};
		if (eTag) {
			header['If-None-Match'] = eTag;
		}

		// TODO: enable 'setFullResponse' to allow access of header information.
		return this.RESTWrapperService.get(link, null, null, { skipCache: true }, header).then(function (payload) {
			if (payload.originalElement) {
				that.json = payload;
				return that;
			} else {
				// Since, we don't have access to response header, we have to convey (somehow) that the object is not
				// modified
				return null;
			}
		});
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getItemUrn
  * @methodOf Models.AffectedItem
  * @description Returns item's urn
  *
  * @returns {String} The urn
  */
	getItemUrn: function getItemUrn() {
		return this.json.item.urn;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getObject
  * @methodOf Models.AffectedItem
  * @description Returns a copy of the object's JSON
  *
  * @returns {Object} The item object
  */
	getObject: function getObject() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getSelfLink
  * @methodOf Models.AffectedItem
  * @description Returns the api link for this item
  *
  * @returns {Object} Link to object's api endpoint
  */
	getSelfLink: function getSelfLink() {
		return this.json.__self__.replace(/^\//, '');
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getId
  * @methodOf Models.AffectedItem
  * @description Returns the ID for this item
  *
  * @returns {Object} Item's ID
  */
	getId: function getId() {
		return +this.getSelfLink().match(/\/(\d+)$/)[1];
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getETag
  * @methodOf Models.AffectedItem
  * @description Returns the ETag for this item
  *
  * @returns {Object} Item's ETag
  */
	getETag: function getETag() {
		return this.json.restangularEtag;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#setTo
  * @methodOf Models.AffectedItem
  * @description Updates the to column of an item
  *
  * @param {String} toRelease The to release value
  */
	setTo: function setTo(toRelease) {
		this.json.toRelease = toRelease;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#setLifecycle
  * @methodOf Models.AffectedItem
  * @description Updates the lifecycle state of an item
  *
  * @param {Object} transition The transition object
  * (contains a name and transition link)
  */
	setLifecycle: function setLifecycle(transition) {
		// `null` implies 'On Release'
		if (!transition || transition.title === 'Please Select') {
			this.json.targetTransition = null;
		} else {
			this.json.targetTransition = {
				link: transition.link || transition.__self__, // Required for endpoint
				title: transition.title || transition.name // Required to update view
			};
		}
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getLifecycle
  * @methodOf Models.AffectedItem
  * @description Returns a target transition of an item
  *
  * @return {Object} A target transition of this item
  */
	getLifecycle: function getLifecycle() {
		return this.json.targetTransition;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#setEffectivity
  * @methodOf Models.AffectedItem
  * @description Updates the effectivity date of an item
  *
  * @param {Date} effectivityDate The new effectivity date
  * (`null` implies 'On Release')
  */
	setEffectivity: function setEffectivity(effectivityDate) {
		this.json.effectivityDate = effectivityDate ? this.$filter('date')(effectivityDate, 'yyyy-MM-dd') : null;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getEffectivity
  * @methodOf Models.AffectedItem
  * @description Returns an effectivity date of the revision of this item
  *
  * @return {String} An effectivity date of the revision of this item
  */
	getEffectivity: function getEffectivity() {
		return this.json.effectivityDate;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#setCustomColumnData
  * @methodOf Models.AffectedItem
  * @description Updates a linked field of a custom column
  *
  * @param {String} fieldID ID of a custom column
  * @param {Object} data The modified linked field object
  * @param {Object} col The custom column
  */
	setCustomColumnData: function setCustomColumnData(fieldId, data, col) {
		var _this = this;

		var linkedFields = this.json.linkedFields;

		var linkedFieldToUpdate = _.find(linkedFields, function (field) {
			return _this.getLinkedFieldId(field) === fieldId;
		});

		if (!linkedFieldToUpdate) {
			linkedFieldToUpdate = {
				value: col.isPicklist ? {} : null
			};
		}

		if (col.isPicklist) {
			linkedFieldToUpdate.value.link = data.value.link;
			linkedFieldToUpdate.value.title = data.value.title || linkedFieldToUpdate.value.title;
		} else if (col.dataType === this.FieldTypes.DATE.toString()) {
			linkedFieldToUpdate.value = data.value ? this.$filter('date')(new Date(data.value), 'yyyy-MM-dd') : null;
		} else {
			linkedFieldToUpdate.value = data.value;
		}

		if (!linkedFieldToUpdate.urn && !linkedFieldToUpdate.__self__) {
			linkedFieldToUpdate.__self__ = col.fieldMetadata.__self__;
			linkedFieldToUpdate.title = col.fieldMetadata.name;
			linkedFieldToUpdate.type = col.fieldMetadata.type;
			linkedFieldToUpdate.urn = col.fieldMetadata.urn;
			linkedFields.push(linkedFieldToUpdate);
		}
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getLinkedFieldLink
  * @methodOf Models.AffectedItem
  * @description Returns the self link of a custom column
  *
  * @param {Object} field The linked field of an item
  *
  * @return {String} Self link of a custom column
  */
	getLinkedFieldLink: function getLinkedFieldLink(field) {
		return field.__self__;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getLinkedFieldUrn
  * @methodOf Models.AffectedItem
  * @description Returns the urn of a custom column
  *
  * @param {Object} field The linked field of an item
  *
  * @return {String} Field urn of a custom column
  */
	getLinkedFieldUrn: function getLinkedFieldUrn(field) {
		return field.urn;
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getLinkedFieldId
  * @methodOf Models.AffectedItem
  * @description Returns the field ID of a custom column
  *
  * @param {Object} field The linked field of an item
  *
  * @return {String} Field ID of a custom column
  */
	getLinkedFieldId: function getLinkedFieldId(field) {
		return field.urn && field.urn.split('.').pop();
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#getLinkedFieldDataTypeId
  * @methodOf Models.AffectedItem
  * @description Returns the data type ID of a custom column
  *
  * @param {Object} field The linked field of an item
  *
  * @return {String} Data type ID of a custom column
  */
	getLinkedFieldDataTypeId: function getLinkedFieldDataTypeId(field) {
		return field.type.urn && field.type.urn.split('.').pop();
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#save
  * @methodOf Models.AffectedItem
  * @description Updates this item
  *
  * @returns {Promise} The put request promise
  */
	save: function save() {
		var that = this;
		var data = this.getObject();
		var url = this.getSelfLink();
		var headers = {
			'Content-Type': 'application/json',
			ETag: this.getETag()
		};
		var options = {};

		return this.RESTWrapperService.put(data, url, null, {}, headers, options);
	},

	/**
  * @ngdoc method
  * @name Models.AffectedItem#delete
  * @methodOf Models.AffectedItem
  * @description Deletes this item
  *
  * @returns {Promise} The delete request promise (currently a fake promise)
  */
	'delete': function _delete(selfLink) {
		var that = this;
		var options = {};

		return this.RESTWrapperService['delete'](selfLink.substr(1), null, null, { 'Content-Type': 'application/json' }, options);
	}
};

angular.module('plm360.models').factory('AffectedItem', ['$filter', 'RESTWrapperService', 'EventService', '$q', 'FieldTypes', function ($filter, RESTWrapperService, EventService, $q, FieldTypes) {
	var models = {};
	AffectedItem.prototype.RESTWrapperService = RESTWrapperService;
	AffectedItem.prototype.$q = $q;
	AffectedItem.prototype.$filter = $filter;
	AffectedItem.prototype.FieldTypes = FieldTypes;

	// Get
	EventService.listen('affectedItem:*:get', function (event, url, eTag) {
		var model = models[url] || new AffectedItem();
		models[url] = model;
		model.fetch(url, eTag).then(function (obj) {
			EventService.send('affectedItem:' + event.split(':')[1] + ':done', obj);
		});
	});

	// Save
	EventService.listen('affectedItem:*:saveItem', function (event, obj) {
		obj.save().then(function () {
			EventService.send('affectedItem:' + event.split(':')[1] + ':saveDone', true);
		}, function (error) {
			if (error.status === 409) {
				EventService.send('affectedItem:' + event.split(':')[1] + ':saveConflict');
			} else {
				EventService.send('affectedItem:' + event.split(':')[1] + ':saveDone', false, error);
			}
		});
	});

	// Delete
	EventService.listen('affectedItem:*:deleteItem', function (event, selfLink) {
		var model = new AffectedItem();
		model['delete'](selfLink).then(function () {
			EventService.send('affectedItem:' + event.split(':')[1] + ':deleteDone', true);
		}, function () {
			// TODO support for concurrency?
			EventService.send('affectedItem:' + event.split(':')[1] + ':deleteDone', false);
		});
	});

	return AffectedItem;
}]);
//# sourceMappingURL=AffectedItem.js.map
