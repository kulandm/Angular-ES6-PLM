'use strict';

/**
 * @ngdoc object
 * @name Models.Transitions
 *
 * @description This class wraps a list of Transitions payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Transitions = function Transitions() {};

Transitions.prototype = {
	/**
  * @ngdoc method
  * @name Models.Transitions#fetch
  * @methodOf Models.Transitions
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		/* Note: hideError is passed as true to the RESTWrapperServive to suppress the 403 forbidden error when origination from
     transitions. The issue was when the viewWorkflow permission was taken off and the user tries to land on the item details tab,
     relationship tab, affected items tab and the attachment tab. The user was shown the notification of Permission Error.
     By passing this option-- hideError: true, the RESTWrapperService will know to suppress these errors in this case
  */
		return this.RESTWrapperService.get(link, null, null, { hideError: true }).then(function (payload) {
			that.transitions = [];
			// Note: Angular.forEach or _.each will not work here, as server is responding with list of transitions and
			// if there are no transitions, this list will be empty. This is causing problem, as payload contain lots of
			// restangular related stuff.
			for (var i = 0, transition; transition = payload[i]; i++) {
				that.transitions.push(transition);
			}
			return that;
		});
	}
};

angular.module('plm360.models').factory('Transitions', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Transitions.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('itemTransitions:*:get', function (event, params) {
		var model = models[params] || new Transitions();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('itemTransitions:' + event.split(':')[1] + ':done', obj);
		}, function () {
			// If user has no 'view workflow' permission then server will throw 403 error, which results in the rejection
			// of the promise.
			// Send an event to indicate that fetching transition is not successful.
			EventService.send('itemTransitions:' + event.split(':')[1] + ':failed');
		});
	});
	return Transitions;
}]);
//# sourceMappingURL=Transitions.js.map
