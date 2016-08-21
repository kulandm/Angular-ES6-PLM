'use strict';

/**
 * @ngdoc object
 * @name Models.Workspaces
 *
 * @description This class wraps a list of workspaces payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Workspaces = function Workspaces() {
	var that = this;
};

/**
 * @ngdoc property
 * @name Models.Workspaces#iconMapping
 * @propertyOf Models.Workspaces
 * @description This is the icon mapping from the old endpoint to new font icons
 */
Workspaces.iconMapping = {
	'wicon7_24.png': 'icon-plm-stamp',
	'wiconcheck_24.png': 'icon-plm-inconclusive_task',
	'datastaylogo_24.png': 'icon-plm-gears_group',
	'community_24.png': 'icon-plm-monitor_view',
	'folder_24.png': 'icon-plm-folder',
	'franchise_24.png': 'icon-plm-particles',
	'log_24.png': 'icon-plm-task_finished',
	'npi_solution_24.png': 'icon-plm-cubes',
	'plm_solution_24.png': 'icon-plm-geometric_group',
	'point_click_24.png': 'icon-plm-add_mouse_action',
	'train_24.png': 'icon-plm-graduate',
	'vault_24.png': 'icon-plm-safe_box',
	'wicon2_24.png': 'icon-plm-document',
	'wicon4_24.png': 'icon-plm-users',
	'wicon5_24.png': 'icon-plm-spanner',
	'wiconbulb_24.png': 'icon-plm-lamp',
	'wiconfaid_24.png': 'icon-plm-medical',
	'adminicon_24.png': 'icon-plm-secure_session',
	'approval_24.png': 'icon-plm-gear_stamp_document',
	'blogicon_24.png': 'icon-plm-content_balloon',
	'bpm_solution_24.png': 'icon-plm-move_into',
	'caliper_24.png': 'icon-plm-precision_tool', // not sure about this one
	'catalog_solution_24.png': 'icon-plm-top_rank',
	'centralize_24.png': 'icon-plm-miscellaneous',
	'drillicon_24.png': 'icon-plm-drill',
	'newsletter_24.png': 'icon-plm-letter',
	'partners_24.png': 'icon-plm-avatars',
	'profileicon_24.png': 'icon-plm-user_document_attach',
	'quality_solution_24.png': 'icon-plm-put_into',
	'reporticon_24.png': 'icon-plm-document_stats',
	'reports_24.png': 'icon-plm-gear_stats',
	'share_24.png': 'icon-plm-safe_hands_squeeze',
	'structure_24.png': 'icon-plm-hierarchy',
	'timeline_24.png': 'icon-plm-time_reached',
	'wicon1_24.png': 'icon-plm-gears',
	'wicon3_24.png': 'icon-plm-truck',
	'wicon6_24.png': 'icon-plm-safe_gear'
};

Workspaces.prototype = {
	/**
  * @ngdoc method
  * @name Models.Workspaces#fetch
  * @methodOf Models.Workspaces
  * @description Make a call to fetch raw data
  *
  * @param {String} menuLink The URL to use for fetching the data from v2 menu endpoint
  * @param {String} workspacesLink The URL to use for fetching data from v3 workspaces endpoint
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(menuLink, workspacesLink) {
		var that = this;
		var deferred = this.$q.defer();
		var promises = [];
		promises.push(this.RESTWrapperService.get(menuLink, null, null, {}).then(function (payload) {
			that.json = payload;
			angular.forEach(that.json.sections, function (section) {
				section.iconResourceUrl = that.getIcon(section);
				angular.forEach(section.workspaces, function (workspace) {
					workspace.link = 'api/v3/workspaces/' + workspace.id;
				});
			});
			return that;
		}));
		var fetchNextWorkspacePage = function fetchNextWorkspacePage(link) {
			return that.RESTWrapperService.get(link.substring(1), null, null, {}).then(function (payload) {
				that._.each(payload.items, function (item) {
					var ret = that._.find(that.workspacesPayload.items, function (existedItem) {
						return existedItem.link === item.link;
					});
					if (!angular.isDefined(ret)) {
						that.workspacesPayload.items.push(item);
					}
				});
				if (payload.next) {
					return fetchNextWorkspacePage(payload.next.link);
				} else {
					return that;
				}
			});
		};
		promises.push(this.RESTWrapperService.get(workspacesLink, null, {
			limit: 100,
			offset: 0
		}, {}).then(function (payload) {
			that.workspacesPayload = payload;
			if (payload.next) {
				return fetchNextWorkspacePage(payload.next.link);
			} else {
				return that;
			}
		}));
		this.$q.all(promises).then(function () {
			deferred.resolve(that);
		});
		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getIcon
  * @methodOf Models.Workspaces
  * @description Returns the mapped font icon for given section
  *
  * @param {Object} section The section object for which the icon to be retrieved
  *
  * @returns {string} A the icon name
  */
	getIcon: function getIcon(section) {
		var oldUrl = section.iconResourceUrl;
		if (oldUrl.indexOf('/') === -1) {
			return oldUrl;
		}
		var oldImage = oldUrl.substr(oldUrl.lastIndexOf('/') + 1);

		var newImage;
		angular.forEach(Workspaces.iconMapping, function (value, key) {
			if (key === oldImage) {
				newImage = value;
			}
		});

		// no image found, use a generic one
		if (newImage === undefined) {
			newImage = 'icon-plm-Cube';
		}
		return newImage;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getSectionIcon
  * @methodOf Models.Workspaces
  * @description Returns the mapped font icon for given workspace
  *
  * @param {Number} workspaceId The id of the current workspace
  *
  * @returns {string} A the icon name
  */
	getSectionIcon: function getSectionIcon(workspaceId) {
		var retVal = '';
		angular.forEach(this.json.sections, function (value, key) {
			angular.forEach(value.workspaces, function (workspace) {
				if (parseInt(workspaceId) === workspace.id) {
					retVal = value.iconResourceUrl;
				}
			});
		});
		return retVal;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getSimpleList
  * @methodOf Models.Workspaces
  * @description Returns the list of workspaces in the form of object with properties id, icon, and displayName
  *
  * @param {String} attr The attribute to sort by
  *
  * @returns {Array} The sorted list of workspaces
  */
	getSimpleList: function getSimpleList(attr) {
		var that = this;
		var workspaceList = [];
		angular.forEach(this.json.sections, function (section) {
			angular.forEach(section.workspaces, function (workspace) {
				workspaceList.push({
					id: workspace.id,
					icon: section.iconResourceUrl,
					displayName: workspace.displayName
				});
			});
		});
		if (angular.isDefined(attr)) {
			workspaceList.sort(function (a, b) {
				return a[attr] > b[attr];
			});
		}
		return workspaceList;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getCategoryList
  * @methodOf Models.Workspaces
  * @description Returns the list of categories (sections) in the form of object with properties id, iconResourceUrl, displayName and workspaces
  *
  * @returns {Array} The list of categories
  */
	getCategoryList: function getCategoryList() {
		return this.json.sections;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getFullList
  * @methodOf Models.Workspaces
  * @description Returns the full list of workspaces with sections and workspaces relationship
  *
  * @returns {Array} The full list of workspaces
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#getWorkspaceLink
  * @methodOf Models.Workspaces
  * @description Returns the REST api link for the workspace given the id
  *
  * @param {Number} workspaceId The ID of the workspace whose link to retrieve
  *
  * @returns {String} The string representation of the REST link
  */
	getWorkspaceLink: function getWorkspaceLink(workspaceId) {
		var retVal;
		angular.forEach(this.json.sections, function (value, key) {
			angular.forEach(value.workspaces, function (workspace) {
				if (parseInt(workspaceId) === workspace.id) {
					retVal = workspace.link;
				}
			});
		});
		return retVal;
	},

	/**
  * @ngdoc method
  * @name Models.Workspaces#setWorkspaceObj
  * @methodOf Models.Workspaces
  * @description Attaches the workspace object to the tree
  *
  * @param {Number} workspaceId The ID of the workspace whose obj to set
  * @param {Object} obj The workspace object
  */
	setWorkspaceObj: function setWorkspaceObj(workspaceId, obj) {
		angular.forEach(this.json.sections, function (value, key) {
			angular.forEach(value.workspaces, function (workspace) {
				if (parseInt(workspaceId) === workspace.id) {
					workspace.obj = obj;
				}
			});
		});
	}
};

angular.module('plm360.models').factory('Workspaces', ['RESTWrapperService', 'EventService', '$q', '_', function (RESTWrapperService, EventService, $q, _) {
	var models = {};
	Workspaces.prototype.RESTWrapperService = RESTWrapperService;
	Workspaces.prototype.$q = $q;
	Workspaces.prototype._ = _;
	EventService.listen('workspaces:*:get', function (event, menuLink, workspacesLink) {
		var model = models[workspacesLink] || new Workspaces();
		models[workspacesLink] = model;
		model.fetch(menuLink, workspacesLink).then(function (obj) {
			EventService.send('workspaces:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Workspaces;
}]);
//# sourceMappingURL=Workspaces.js.map
