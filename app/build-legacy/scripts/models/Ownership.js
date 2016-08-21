'use strict';

/**
 * @ngdoc object
 * @name Models.Ownership
 *
 * @description This class wraps a list of ownership info payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Ownership = function Ownership(json) {
	this.json = json;
};

Ownership.prototype = {
	/**
  * @ngdoc method
  * @name Models.Ownership#fetch
  * @methodOf Models.Ownership
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var _this = this;

		var that = this;

		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			var promises = {
				ownership: _this.getDetails(payload.owners.link),
				audit: _this.getDetails(payload.audit.link)
			};
			return _this.$q.all(promises).then(function (values) {
				that.json = values;
				return that;
			});
		});
	},

	/**
  * @ngdoc method
  * @name Models.Ownership#getFullList
  * @methodOf Models.Ownership
  * @description Returns the details about ownwership and audit
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} A list of ownership and audit data
  */
	getDetails: function getDetails(link) {
		return this.RESTWrapperService.get(link, null, null, {});
	},

	// Just some stubs for later
	getOwners: function getOwners() {},
	getAdditionOwners: function getAdditionOwners() {},

	/**
  * @ngdoc method
  * @name Models.Ownership#getFullList
  * @methodOf Models.Ownership
  * @description Returns the full list of data
  *
  * @returns {Object} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.Ownership#replaceOwner
  * @methodOf Models.Ownership
  * @description Remove Primary user and insert a new Primary User
  *
  * @param {Array} owners The list of owners
  * @param {Object} newOwner The new primary owner
  * @param {Boolean} isNotifyingOwnerByEmail true to send email to new owner
  *
  * @returns {Promise} A Promise when owners have been updated.
  */
	replaceOwner: function replaceOwner(owners, newOwner, isNotifyingOwnerByEmail) {
		var _this2 = this;

		owners = owners.filter(function (owner) {
			return owner.ownerType !== _this2.OWNER_TYPE.PRIMARY;
		});

		var userId = newOwner.__self__.split('/').pop();
		owners.push({
			ownerType: this.OWNER_TYPE.PRIMARY,
			__self__: this.json.ownership.__self__ + '/' + userId,
			notify: !!isNotifyingOwnerByEmail
		});

		return this.RESTWrapperService.put(owners, this.json.ownership.__self__, null, {}, {
			'Content-Type': 'application/json'
		});
	},

	/**
  * @ngdoc method
  * @name Models.Ownership#editAdditionalOwners
  * @methodOf Models.Ownership
  * @description filter Primary users and insert new additional users and groups
  *
  * @param {Array} owners The list of owners
  * @param {Array} additionalOwners a new list of additional owners
  * @param {Array} additionalGroups a new list of additional groups
  *
  * @returns {Promise} A Promise when owners have been updated.
  */
	editAdditionalOwners: function editAdditionalOwners(owners, additionalOwners, additionalGroups) {
		var _this3 = this;

		owners = owners.filter(function (owner) {
			return owner.ownerType === _this3.OWNER_TYPE.PRIMARY;
		});

		additionalOwners.forEach(function (user) {
			var userId = user.__self__.split('/').pop();
			owners.push({
				ownerType: _this3.OWNER_TYPE.ADDITIONAL_USER,
				__self__: _this3.json.ownership.__self__ + '/' + userId
			});
		});

		additionalGroups.forEach(function (user) {
			var groupId = user.__self__.split('/').pop();
			owners.push({
				ownerType: _this3.OWNER_TYPE.ADDITIONAL_GROUP,
				__self__: _this3.json.ownership.__self__ + '/' + groupId
			});
		});

		return this.RESTWrapperService.put(owners, this.json.ownership.__self__, null, {}, {
			'Content-Type': 'application/json'
		});
	}
};

angular.module('plm360.models').factory('Ownership', ['RESTWrapperService', 'EventService', '$q', 'OWNER_TYPE', function (RESTWrapperService, EventService, $q, OWNER_TYPE) {
	var models = {};

	Ownership.prototype.RESTWrapperService = RESTWrapperService;
	Ownership.prototype.$q = $q;
	Ownership.prototype.OWNER_TYPE = OWNER_TYPE;

	EventService.listen('ownership:*:get', function (event, params, requestParams) {
		var model = models[params] || new Ownership();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('ownership:' + event.split(':')[1] + ':done', obj);
		});
	});

	return Ownership;
}]);
//# sourceMappingURL=Ownership.js.map
