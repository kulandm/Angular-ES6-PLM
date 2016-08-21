'use strict';

/**
 * @ngdoc object
 * @name Models.View
 *
 * @description This class wraps a list of views payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var View = function View(json) {
	this.json = json;
};

View.prototype = {
	/**
  * @ngdoc method
  * @name Models.View#getFullList
  * @methodOf Models.View
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json.workspaceViewDefinitionList.list);
	}
};

/* global plm360models */
plm360models.value('View', View);
//# sourceMappingURL=View.js.map
