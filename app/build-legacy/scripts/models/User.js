'use strict';

/**
 * @ngdoc object
 * @name Models.User
 *
 * @description This class wraps a user payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var User = function User(json) {
	this.json = json;
	this.permissions = {};
};

User.prototype = {
	/**
  * @ngdoc method
  * @name Models.User#fetch
  * @methodOf Models.User
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
  * @name Models.User#getDateFormat
  * @methodOf Models.User
  * @description Returns the date format of the current user
  *
  * @returns {string} A string representation of the date format of the current user
  */
	getDateFormat: function getDateFormat() {
		if (this.json && this.json.dateFormat && this.json.dateFormat.indexOf('.') !== -1) {
			var convertedDateFormat = this.json.dateFormat;
			return convertedDateFormat.replace(/[.]/g, '/');
		} else {
			return this.json.dateFormat;
		}
	},

	/**
  * @ngdoc method
  * @name Models.User#setPermissions
  * @methodOf Models.User
  * @description Sets the permissions object
  *
  * @param {Object} permissions The permission object to be associated with this user
  *
  */
	setPermissions: function setPermissions(permissions) {
		this.permissions = permissions;
	},

	/**
  * @ngdoc method
  * @name Models.User#hasPermission
  * @methodOf Models.User
  * @description Returns whether the user has permission perm
  *
  * @param {Number} perm The permission to be checked (@see plm360.permissions.PLMPermissions)
  *
  * @returns {Boolean} True if user has permission
  */
	hasPermission: function hasPermission(perm) {
		return this.permissions.hasPermission && this.permissions.hasPermission(perm);
	},

	/**
  * @ngdoc method
  * @name Models.User#getId
  * @methodOf Models.User
  * @description Returns the id of the current user
  *
  * @returns {String} A string representation of the id of the current user
  */
	getId: function getId() {
		return this.json.id;
	},

	/**
  * @ngdoc method
  * @name Models.User#getDisplayName
  * @methodOf Models.User
  * @description Returns the display name of the current user
  *
  * @returns {string} A string representation of the display name of the current user
  */
	getDisplayName: function getDisplayName() {
		return this.json.displayName;
	},

	/**
  * @ngdoc method
  * @name Models.User#getEmail
  * @methodOf Models.User
  * @description Returns the email of the current user
  *
  * @returns {string} A string representation of the email of the current user
  */
	getEmail: function getEmail() {
		return this.json.email;
	},

	/**
  * @ngdoc method
  * @name Models.User#getProfileImage
  * @methodOf Models.User
  * @description Returns the profile image paths
  *
  * @returns {Object} The profile image paths
  */
	getProfileImage: function getProfileImage() {
		return {
			small: this.json.imageSizeSmall || 'images/avatar_generic_x20.png',
			medium: this.json.imageSizeMedium || 'images/avatar_generic_x35.png'
		};
	},

	/**
  * @ngdoc method
  * @name Models.User#getInterfaceStyle
  * @methodOf Models.User
  * @description Returns the selected interface style (NextPLM360|ClassicPLM360) for the current user
  *
  * @returns {string} A string representation of the interface style of the current user
  */
	getInterfaceStyle: function getInterfaceStyle() {
		return this.json.interfaceStyle;
	},

	/**
  * @ngdoc method
  * @name Models.User#getTimeZone
  * @methodOf Models.User
  * @description Returns the selected timezone for the current user
  *
  * @returns {string} A string representation of the timezone of the current user
  */
	getTimeZone: function getTimeZone() {
		return this.json.timezone;
	},

	/**
  * @ngdoc method
  * @name Models.User#setDefaultInterface
  * @methodOf Models.User
  * @description Sets the default interface style of the user
  *
  * @returns {Promise} A promise that waits for the response from the endpoint
  */
	setDefaultInterface: function setDefaultInterface(interfaceName, link) {
		var data = [{ op: 'replace', path: '/interfaceStyle', value: interfaceName }];
		var headers = { 'Content-Type': 'application/json-patch+json' };
		return this.RESTWrapperService.patch(data, link, null, null, headers);
	}
};

angular.module('plm360.models').factory('User', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	User.prototype.RESTWrapperService = RESTWrapperService;
	User.prototype.EventService = EventService;
	EventService.listen('user:*:get', function (event, params) {
		var model = models[params] || new User();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('user:' + event.split(':')[1] + ':done', obj);
		});
	});
	return User;
}]);
//# sourceMappingURL=User.js.map
