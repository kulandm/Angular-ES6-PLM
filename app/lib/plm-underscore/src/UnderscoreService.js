/**
 * @ngdoc object
 * @name Miscellaneous.underscore
 *
 * @description This is the bridge for underscore and angular
 *
 * ##Dependencies
 *
 */

export default angular.module(__moduleName, []).factory('_', function () {
	return window._;
});
