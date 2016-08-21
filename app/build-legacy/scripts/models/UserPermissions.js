'use strict';

/**
 * @ngdoc object
 * @name Models.UserPermissions
 *
 * @description This class wraps a user permissions payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var UserPermissions = function UserPermissions() {};

UserPermissions.prototype = {
	/**
  * @ngdoc method
  * @name Models.UserPermissions#fetch
  * @methodOf Models.UserPermissions
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		var deferred = this.$q.defer();
		this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			deferred.resolve(that);
		});
		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.UserPermissions#hasPermission
  * @methodOf Models.UserPermissions
  * @description Returns whether the permission is in the object
  *
  * @param {Number} perm The permission to be checked (@see plm360.permissions.PLMPermissions)
  *
  * @returns {Boolean} True if the permission exists
  */
	hasPermission: function hasPermission(perm) {
		var ret = false;

		if (this.json.permissions) {
			this._.each(this.json.permissions, function (permission) {
				if (parseInt(permission.link.substring(permission.link.lastIndexOf('/') + 1)) === perm) {
					ret = true;
				}
			});
		}
		return ret;
	}
};

angular.module('plm360.models').factory('UserPermissions', ['RESTWrapperService', 'EventService', '$q', '_', function (RESTWrapperService, EventService, $q, _) {
	var models = {};
	UserPermissions.prototype.RESTWrapperService = RESTWrapperService;
	UserPermissions.prototype.$q = $q;
	UserPermissions.prototype._ = _;
	EventService.listen('userPermissions:*:get', function (event, params) {
		var model = models[params] || new UserPermissions();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('userPermissions:' + event.split(':')[1] + ':done', obj);
		});
	});
	return UserPermissions;
}]);
//# sourceMappingURL=UserPermissions.js.map
