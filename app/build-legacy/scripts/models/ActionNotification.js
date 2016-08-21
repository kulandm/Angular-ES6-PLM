'use strict';

/**
 * @ngdoc object
 * @name Models.ActionNotification
 *
 * @description This class wraps a list of ActionNotification payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var ActionNotification = function ActionNotification(json, RESTWrapperService) {
	this.json = json;
	this.RESTWrapperService = RESTWrapperService;
};

ActionNotification.prototype = {

	/**
  * @ngdoc method
  * @name Models.ActionNotification#getNotificationId
  * @methodOf Models.ActionNotification
  * @description Returns the Notification Id
  *
  * @returns {String} The Notification Id
  */
	getNotificationId: function getNotificationId() {
		return this.json.id;
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotification#getEventType
  * @methodOf Models.ActionNotification
  * @description Returns the Event Type
  *
  * @returns {String} The Event Type
  */
	getEventType: function getEventType() {
		return this.json.type;
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotification#getNotificationEvent
  * @methodOf Models.ActionNotification
  * @description Returns the Notification Event
  *
  * @returns {String} The Notification Event
  */
	getNotificationEvent: function getNotificationEvent() {
		if (this.json.type === 'State') {
			return {
				name: this.json['workflow-state'].title,
				id: this.json['workflow-state'].link.substr(this.json['workflow-state'].link.lastIndexOf('/') + 1)
			};
		} else {
			return {
				name: this.json['workflow-transition'].title,
				id: this.json['workflow-transition'].link.substr(this.json['workflow-transition'].link.lastIndexOf('/') + 1)
			};
		}
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotification#getNotificationUsers
  * @methodOf Models.ActionNotification
  * @description Returns the full list of Notification Users
  *
  * @returns {Array} The full list of Notification Users data
  */
	getNotificationUsers: function getNotificationUsers() {
		var that = this;
		var userLink = this.json.users;

		return this.RESTWrapperService.get(userLink.substr(1), null).then(function (usersObj) {
			if (_.isArray(usersObj)) {
				that.userList = [];
				angular.forEach(usersObj, function (eachUsers, index) {
					that.RESTWrapperService.get(eachUsers.link.substr(1), null).then(function (userObj) {
						that.userList.push(userObj.displayName);
					});
				});
			}
			return that.userList;
		});
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotification#getNotificationGroups
  * @methodOf Models.ActionNotification
  * @description Returns the full list of Notification Groups
  *
  * @returns {Array} The full list of Notification Groups data
  */
	getNotificationGroups: function getNotificationGroups() {
		var that = this;
		var groupLink = this.json.groups;

		return this.RESTWrapperService.get(groupLink.substr(1), null).then(function (groupObj) {
			that.groupList = [];
			if (_.isArray(groupObj)) {
				angular.forEach(groupObj, function (eachGroup, index) {
					that.groupList.push(eachGroup.title);
				});
			}
			return that.groupList;
		});
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotification#deleteActionNotification
  * @methodOf Models.ActionNotification
  * @description deletes the specific action notification
  *
  * @returns {Promise} The delete request promise
  */
	deleteActionNotification: function deleteActionNotification() {
		var that = this;
		var options = {};
		return this.RESTWrapperService['delete'](this.json.__self__.substr(1), null, null, null, options);
	}
};

angular.module('plm360.models').factory('ActionNotification', ['RESTWrapperService', 'EventService', '$q', function (RESTWrapperService, EventService, $q) {
	ActionNotification.prototype.RESTWrapperService = RESTWrapperService;
	ActionNotification.prototype.$q = $q;
	return ActionNotification;
}]);
//# sourceMappingURL=ActionNotification.js.map
