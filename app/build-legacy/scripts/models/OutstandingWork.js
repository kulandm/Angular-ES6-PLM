'use strict';

/**
 * @ngdoc object
 * @name Models.OutstandingWork
 *
 * @description This class wraps an outstanding work payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var OutstandingWork = function OutstandingWork() {};

OutstandingWork.prototype = {
	/**
  * @ngdoc method
  * @name Models.OutstandingWork#fetch
  * @methodOf Models.OutstandingWork
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Boolean} recalculate If true the call won't use ifModifiedSince option; otherwise a conditional get will be sent
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, recalculate) {
		var that = this;
		var options = {
			skipCache: true,
			ifModifiedSince: !recalculate
		};
		return this.RESTWrapperService.get(link, null, null, options).then(function (payload) {
			that.json = payload;
			var deferred = that.$q.defer();
			var promises = [];

			// The main request
			angular.forEach(payload.outstandingWork, function (item, key) {
				var localPromise = null;
				var inboxItem = item.inboxItem;
				var milestonesEndpoint;
				if (inboxItem && inboxItem.item && inboxItem.item.link) {
					localPromise = that.$q.defer();
					inboxItem.workspace.id = inboxItem.workspace.link.substring(inboxItem.workspace.link.lastIndexOf('/') + 1);
					inboxItem.workspace.label = inboxItem.workspace.title;

					// The item request
					that.RESTWrapperService.get(inboxItem.item.link.substring(1), null, null, { skipCache: true, hideError: true }).then(function (masterPayload) {
						inboxItem.workflowStateName = masterPayload.currentState.title;
						// A required request to retrieve the milestones for each item
						if (masterPayload.milestones && masterPayload.milestones.link) {
							milestonesEndpoint = masterPayload.milestones.link;

							// The milestones request
							that.RESTWrapperService.get(milestonesEndpoint.substring(1), null, null, { hideError: true }).then(function (milestonesPayload) {
								if (milestonesPayload && milestonesPayload.milestones) {
									inboxItem.milestoneList = milestonesPayload.milestones;
								}
								localPromise.resolve();
							}, function () {
								localPromise.resolve();
							});
						} else {
							localPromise.resolve();
						}
					}, function () {
						localPromise.resolve();
					});
					promises.push(localPromise.promise);
				}
			});
			that.$q.all(promises).then(function () {
				deferred.resolve(that);
			});
			return deferred.promise;
		});
	},

	/**
  * @ngdoc method
  * @name Models.OutstandingWork#getDisplayableData
  * @methodOf Models.OutstandingWork
  * @description Returns formatted data of the outstanding work to be displayed in a tabular widget
  *
  * @param {Object} $filter The angularJS filter object to provide access to filters
  * @param {Function} parseDueDate The function to format the date string to be displayed
  * @param {String} dateFormat The format of date the user has set
  * @param {Object} FlyoutService The object to provide access to flyout service (for user profile summary)
  *
  * @returns {Object} An object representation of the formatted data
  */
	getDisplayableData: function getDisplayableData($filter, parseDueDate, dateFormat, FlyoutService) {
		var ret = {};
		var that = this;

		if (angular.isDefined(this.json) && this.json !== null) {
			ret = angular.copy(this.json.outstandingWork);

			var toBeSpliced = [];
			angular.forEach(ret, function (value, key) {
				ret[key] = value.inboxItem;
				var inboxItem = value.inboxItem;
				var lastHistoryStep = value.lastHistoryStep;

				if (!ret[key].urn) {
					toBeSpliced.push(key);
					return;
				}

				ret[key].escalations = ret[key].escalated ? '<span class="md icon-plm-task_finished"></span>' : '';
				ret[key].delegations = ret[key].delegated ? '<span class="md icon-plm-users"></span>' : '';

				var wsId = inboxItem.item && inboxItem.item.link && inboxItem.item.link.split('/')[4] || null;
				var itemUrn = inboxItem.item && inboxItem.item.urn && that.UrnParser.encode(inboxItem.item.urn) || null;
				var wsTitle = inboxItem.workspace && inboxItem.workspace.label;

				ret[key].itemdescription = {
					val: inboxItem.item.title,
					href: that.$state.href('details', {
						workspaceId: wsId,
						tab: 'details',
						view: 'full',
						mode: 'view',
						itemId: itemUrn
					})
				};
				ret[key].workspace = {
					val: wsTitle,
					href: that.$state.href('workspace-items-list', { workspaceId: wsId })
				};

				ret[key].workflowStateName = inboxItem.workflowStateName;

				if (lastHistoryStep) {

					ret[key].statesetdate = {
						val: lastHistoryStep.created || '',
						dateFormat: dateFormat
					};
					ret[key].user = lastHistoryStep.user || '';
					ret[key].user.userId = ret[key].user.link && ret[key].user.link.substring(ret[key].user.link.lastIndexOf('/') + 1) || '';

					if (ret[key].milestoneList !== undefined) {

						ret[key].milestone = parseDueDate(ret[key].milestoneList);

						// stateDate will be null if work item is completed.
						if (ret[key].milestone.stateDate) {
							ret[key].duedate = {
								val: ret[key].milestone.stateDate,
								dateFormat: dateFormat
							};
							var milestonecolor = ret[key].milestone.stateColor;

							var toolTip = '';

							switch (milestonecolor) {
								case 'red':
									toolTip = that.$rootScope.bundle.text.milestoneLate;
									break;
								case 'orange':
									toolTip = that.$rootScope.bundle.text.milestoneCloseToLate;
									break;
								case 'green':
									toolTip = that.$rootScope.bundle.text.milestoneOnTime;
									break;
								default:
									break;
							}

							ret[key].iconflag = '<span class="md md-flag ' + milestonecolor + '" title="' + toolTip + '"></span>';
						} else {
							ret[key].duedate = {
								val: ''
							};
							ret[key].iconflag = '';
						}
					} else {
						ret[key].duedate = '';
						ret[key].iconflag = '';
					}
				}
			});

			var decrementCounter = 0;
			angular.forEach(toBeSpliced, function (value) {
				ret.splice(value - decrementCounter, 1);
				decrementCounter++;
			});
		}

		return { data: ret };
	}
};

angular.module('plm360.models').factory('OutstandingWork', ['RESTWrapperService', '$rootScope', '$state', '$q', 'EventService', 'UrnParser', function (RESTWrapperService, $rootScope, $state, $q, EventService, UrnParser) {
	var models = {};
	OutstandingWork.prototype.RESTWrapperService = RESTWrapperService;
	OutstandingWork.prototype.$rootScope = $rootScope;
	OutstandingWork.prototype.$state = $state;
	OutstandingWork.prototype.$q = $q;
	OutstandingWork.prototype.UrnParser = UrnParser;

	EventService.listen('outstandingWork:*:get', function (event, url, recalculate) {
		var model = models[url] || new OutstandingWork();
		models[url] = model;
		model.fetch(url, recalculate).then(function (obj) {
			EventService.send('outstandingWork:' + event.split(':')[1] + ':done', obj);
		});
	});

	return OutstandingWork;
}]);
//# sourceMappingURL=OutstandingWork.js.map
