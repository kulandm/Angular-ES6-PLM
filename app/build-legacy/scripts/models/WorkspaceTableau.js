'use strict';

/**
 * @ngdoc object
 * @name Models.WorkspaceTableau
 *
 * @description This class wraps a WorkspaceTableau object.
 * You can create a new workspace tableau object
 * Update existing one
 * Fetch for existing ones
 *  *
 * ##Dependencies
 *
 */

// Define the constructor
var WorkspaceTableau = function WorkspaceTableau() {
	this.groups = null;
};

/**
 * @param  {Object} visible [description]
 * @param  {Array} all     [description]
 * @return {Object}         [description]
 */
var mergeTableauDefinition = function mergeTableauDefinition(visible, all) {
	var groups = {};
	// get the urn of each field (so we can search the visible field
	// into the all fields array)
	var visibleUrn = _.map(visible.columns, function (value) {
		return value.field.urn;
	});

	// adding displayOrder object
	_.each(visible.columns, function (columnVisible) {
		_.each(all, function (columnAll, index) {
			if (columnVisible.field.urn === columnAll.field.urn) {
				if (angular.isDefined(columnVisible.displayOrder)) {
					all[index].displayOrder = columnVisible.displayOrder;
					if (angular.isDefined(columnVisible.sort)) {
						all[index].sort = columnVisible.sort;
					}
				}
				if (angular.isDefined(columnVisible.sort)) {
					all[index].sort = columnVisible.sort;
				}
				if (angular.isDefined(columnVisible.filter)) {
					all[index].filter = columnVisible.filter;
				}
			}
		});
	});

	_.each(all, function (column) {
		// look if the column is visible or not.
		column.visible = _.indexOf(visibleUrn, column.field.urn) !== -1;
		addToGroup(groups, column);
	});

	return groups;
};

/**
 * @param {Object} groups  [description]
 * @param {Object} element [description]
 */
var addToGroup = function addToGroup(groups, element) {
	var groupLabel = element.group.label;
	if (!groups[groupLabel]) {
		groups[groupLabel] = {
			collapsed: false,
			name: element.group.name,
			fields: []
		};
	}

	groups[groupLabel].fields.push(element);
};

WorkspaceTableau.prototype = {

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#getWorkspaceTableausAllDefinitions
  * @methodOf Models.WorkspaceTableau
  * @description Given the link of the workspace tableau, it returns all the tableaus configurations for the workspace
  *
  * @param  {String} link The REST link resource to the workspace tableau endpoint for current workspace
  * @return {Object} Promise Object containing array of tableaus
  */
	getWorkspaceTableausAllDefinitions: function getWorkspaceTableausAllDefinitions(link) {
		return this.RESTWrapperService.get(link, null, null, { skipCache: true }, {
			ACCEPT: this.HTTP_META_VALUES.SIMPLE
		});
	},

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#getWorkspaceTableausAllGroups
  * @methodOf Models.WorkspaceTableau
  * @description Given the link of the workspace tableau, it returns all the tableaus groups, fields and filters for the current workspace
  *
  * @param  {String} link The REST link resource to the workspace tableau endpoint for current workspace
  * @return {Object} Promise Array of all groups, fields & filters
  */
	getWorkspaceTableausAllGroups: function getWorkspaceTableausAllGroups(link) {
		return this.RESTWrapperService.get(link, null, null, { skipCache: true }, {
			ACCEPT: this.HTTP_META_VALUES.EXTENDED
		});
	},

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#getWorkspaceTableauDefinition
  * @methodOf Models.WorkspaceTableau
  * @description Given the link of a workspace tableau, it returns it configuration-
  *
  * @param  {String} wtLink The REST link resource
  * @return {Object} Promise Object containing array of columns
  */
	getWorkspaceTableauDefinition: function getWorkspaceTableauDefinition(wtLink) {
		return this.RESTWrapperService.get(wtLink, null, null, { skipCache: true }, {
			ACCEPT: this.HTTP_META_VALUES.EXTENDED
		});
	},

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#getTableau
  * @methodOf Models.WorkspaceTableau
  * @description Returns a rich object containing all the tableau configuration
  *
  * @param  {String} link The REST link resource
  * @param  {Number} viewId The tableau ID
  * @return {Object} Promise Object containing array of columns
  */
	getTableau: function getTableau(link, viewId) {
		var deferred = this.$q.defer();
		var that = this;
		var defaultTableau = null;
		var allGroups = null;

		defaultTableau = that.getWorkspaceTableausAllDefinitions(link).then(function (definitions) {
			defaultTableau = _.filter(definitions.tableaus, function (tableau) {
				return viewId === parseInt(tableau.link.slice(tableau.link.lastIndexOf('/') + 1, tableau.link.length));
			});
			if (defaultTableau.length === 1) {
				defaultTableau = defaultTableau.pop();
				return that.getWorkspaceTableauDefinition(defaultTableau.link.slice(1, defaultTableau.link.length));
			} else {
				console.info('There is no default tableau');
				return null;
			}
		});

		// get all groups (groups, fields & filters)
		allGroups = that.getWorkspaceTableausAllGroups(link);

		that.$q.all([defaultTableau, allGroups]).then(function (results) {
			defaultTableau = results.shift();
			if (!defaultTableau) {
				deferred.resolve({});
			} else {
				allGroups = results.shift();

				deferred.resolve(mergeTableauDefinition(defaultTableau, allGroups));
			}
		});

		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#fetchAllWorkspaceTableau
  * @methodOf Models.WorkspaceTableau
  * @description Returns a rich object containing all the tableau configuration
  *
  * @param  {String} link The REST link resource
  * @return {Object} Promise Object containing array of tableaus
  */
	fetchAllWorkspaceTableau: function fetchAllWorkspaceTableau(link) {
		// get all tableaus of workspace
		return this.getWorkspaceTableausAllDefinitions(link).then(function (response) {
			return response.tableaus;
		});
	},

	/**
  * @ngdoc method
  * @name Models.WorkspaceTableau#update
  * @methodOf Models.WorkspaceTableau
  * @description Update an existing tableau configuration
  *
  * @param  {String} link The REST link resource
  * @param  {Object} tableau The tableau configuration
  * @return {Object} Promise Object containing array of tableaus
  */
	update: function update(link, tableau) {
		var deferred = this.$q.defer();
		var that = this;
		var payloadBuilder;
		that.getWorkspaceTableauDefinition(link).then(function (currentTableau) {
			payloadBuilder = that.TableauPayloadBuilder(currentTableau, tableau, _);

			that.RESTWrapperService.put(payloadBuilder, link, null, null, {
				'Content-Type': that.HTTP_META_VALUES.EXTENDED
			}, {}).then(function (result) {
				deferred.resolve(result);
			}, function (error) {
				deferred.reject(error);
			});
		}, function (error) {
			deferred.reject(error);
		});

		return deferred.promise;
	},

	createDefault: function createDefault(link) {
		return this.RESTWrapperService.post(null, link, null, null, {
			'Content-Type': this.HTTP_META_VALUES.SIMPLE
		});
	}
};

angular.module('plm360.models').factory('WorkspaceTableau', ['RESTWrapperService', 'EventService', 'TableauPayloadBuilder', 'WORKSPACE_TABLEAU_TYPES', 'HTTP_META_VALUES', '$q', '_', function (RESTWrapperService, EventService, TableauPayloadBuilder, WORKSPACE_TABLEAU_TYPES, HTTP_META_VALUES, $q, _) {
	var models = {};
	WorkspaceTableau.prototype.RESTWrapperService = RESTWrapperService;
	WorkspaceTableau.prototype.TableauPayloadBuilder = TableauPayloadBuilder;
	WorkspaceTableau.prototype.WORKSPACE_TABLEAU_TYPES = WORKSPACE_TABLEAU_TYPES;
	WorkspaceTableau.prototype.HTTP_META_VALUES = HTTP_META_VALUES;
	WorkspaceTableau.prototype.$q = $q;
	WorkspaceTableau.prototype._ = _;
	EventService.listen('workspaceTableau:*:getTableau', function (event, link, viewId) {
		// var model = models[link] || new WorkspaceTableau();
		var model = new WorkspaceTableau();
		// models[link] = model;
		model.getTableau(link, viewId).then(function (obj) {
			var done = 'workspaceTableau:' + event.split(':')[1] + ':getTableauDone';
			EventService.send(done, obj);
		});
	});

	EventService.listen('workspaceTableau:*:getAllTableau', function (event, link) {
		// var model = models[link] || new WorkspaceTableau();
		var model = new WorkspaceTableau();
		// models[link] = model;
		model.fetchAllWorkspaceTableau(link).then(function (arrayTableaus) {
			if (!angular.isDefined(arrayTableaus)) {
				// no default tableau, let's create one
				var workspaceId = link.split('/').splice(3, 1);
				var listenerId = EventService.listen('workspaceTableau:*:createDefaultDone', function (event) {
					EventService.unlisten(listenerId);
					// Recursive call
					EventService.send('workspaceTableau:' + workspaceId + ':getAllTableau', [link]);
				});
				EventService.send('workspaceTableau:' + workspaceId + ':createDefault', [link]);
			} else {
				var done = 'workspaceTableau:' + event.split(':')[1] + ':getAllTableauDone';
				EventService.send(done, { tableaus: arrayTableaus });
			}
		});
	});

	EventService.listen('workspaceTableau:*:updateTableau', function (event, link, tableau) {
		// var model = models[link] || new WorkspaceTableau();
		var model = new WorkspaceTableau();
		// models[link] = model;
		model.update(link, tableau).then(function (result) {
			var done = 'workspaceTableau:' + event.split(':')[1] + ':updateDone';
			EventService.send(done, result);
		});
	});

	EventService.listen('workspaceTableau:*:createDefault', function (event, link) {
		var model = new WorkspaceTableau();

		model.createDefault(link).then(function (result) {
			var done = 'workspaceTableau:' + event.split(':')[1] + ':createDefaultDone';
			EventService.send(done, result);
		});
	});

	return WorkspaceTableau;
}]).constant('WORKSPACE_TABLEAU_TYPES', {
	DEFAULT: 'DEFAULT'
}).constant('HTTP_META_VALUES', {
	SIMPLE: 'application/json',
	EXTENDED: 'application/vnd.autodesk.plm.meta+json'
});
//# sourceMappingURL=WorkspaceTableau.js.map
