'use strict';

/**
 * @ngdoc object
 * @name Models.RelatedBomItem
 *
 * @description Wraps a RelatedBomItem, giving it some useful methods.
 */

var RelatedBomItem = function RelatedBomItem(json) {
  this.json = json;
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getItemId
 * @methodOf Models.RelatedBomItem
 * @description Returns item id
 *
 * @returns {String} item id
 */
RelatedBomItem.prototype.getItemId = function () {
  return this.getItemLink().substring(this.getItemLink().lastIndexOf('/') + 1);
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getItemLink
 * @methodOf Models.RelatedBomItem
 * @description Returns item link
 *
 * @returns {String} item link
 */
RelatedBomItem.prototype.getItemLink = function () {
  return this.json.__self__;
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getItemTitle
 * @methodOf Models.RelatedBomItem
 * @description Returns item title
 *
 * @returns {String} item title
 */
RelatedBomItem.prototype.getItemTitle = function () {
  return this.json.title;
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getItemVersion
 * @methodOf Models.RelatedBomItem
 * @description Returns item version
 *
 * @returns {String} item version
 */
RelatedBomItem.prototype.getItemVersion = function () {
  return this.json.version || '';
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getItemDescriptor
 * @methodOf Models.RelatedBomItem
 * @description Returns item descriptor (item title and item version)
 *
 * @returns {String} item descriptor
 */
RelatedBomItem.prototype.getItemDescriptor = function () {
  return this.getItemTitle() + ' ' + this.getItemVersion();
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getLifecycle
 * @methodOf Models.RelatedBomItem
 * @description Returns lifecycle of the item
 *
 * @returns {String} Lifecycle state
 */
RelatedBomItem.prototype.getLifecycle = function () {
  return this.json.lifecycle.title;
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getWorkingHasChanged
 * @methodOf Models.RelatedBomItem
 * @description Returns the status of working has changed
 *
 * @returns {Boolean} working has changed or not
 */
RelatedBomItem.prototype.getWorkingHasChanged = function () {
  return this.json.workingHasChanged;
};

/**
 * @ngdoc method
 * @name Models.RelatedBomItem#getWorkflowReference
 * @methodOf Models.RelatedBomItem
 * @description Returns the status of workflow reference
 *
 * @returns {Boolean} workflow reference status
 */
RelatedBomItem.prototype.getWorkflowReference = function () {
  return this.json.workflowReference;
};

angular.module('plm360.models').factory('RelatedBomItem', [function () {
  return RelatedBomItem;
}]);
//# sourceMappingURL=RelatedBomItem.js.map
