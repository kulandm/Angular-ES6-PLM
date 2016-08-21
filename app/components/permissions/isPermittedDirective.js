'use strict';

/**
 * @ngdoc directive
 * @name Directives.isPermitted
 * @restrict A
 *
 * @description Hides the element if user does not have permission to see,
 * or if the permission hasn't been supplied.
 *
 * -workspaceId: This is an optional attribute that can be used with this
 * directive to apply permission for the workspace, the id of which is provided
 * as a value of this attribute. This is very useful to control visibility of
 * the element based on other workspaces. Possible usage in global quick create.
 *
 * -applyLock: This is an optional attribute that can be used with this
 * directive to take workspace locking in to consideration while evaluating the
 * visibility of the element. Possible usage for Add/Edit/Delete buttons on
 * Item Details / Managed View / Grid and Relationship view.
 *
 * -applyRevisionOverrideLock: This is an optional attribute that can be used
 * with this directive to take revision override locking in to consideration
 * while evaluating the visibility of the element. Note: This attribute is only
 * applicable for revision controlled workspace item, for the rest this will be
 * ignored. Possible usage for Add/Edit/Delete buttons on Item Details /
 * Managed View / Grid and Relationship view.
 *
 * ##Dependencies
 * - Requires {@link Services/PermissionService}
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<div is-permitted="{{PLMPermissions.VIEW_ITEM}}"
 * 			workspace-id="{{workspaceId}}"
 * 			apply-lock="{{Boolean}}">
 * 		</div>
 *   </doc:source>
 * </doc:example>
 */
angular.module('plm360.permissions').directive('isPermitted', [
	'$stateParams',
	'$parse',
	'PermissionService',
	'UrnParser',
	function ($stateParams, $parse, PermissionService, UrnParser) {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				/**
				 * @ngdoc method
				 * @name Directives.isPermitted#updateVisibility
				 * @methodOf Directives.isPermitted
				 * @description A helper method to remove the element based on
				 * whether user has permissions. It is safe to remove since
				 * permissions will not change mid-view. When the element is
				 * removed, we can then use CSS selectors to style the primary
				 * button on the command bar.
				 *
				 * @param {Boolean} isVisible True to display the element.
				 */
				var updateVisibility = function (isVisible) {
					if (!isVisible) {
						ele.remove();
					}
				};

				/**
				 * @ngdoc property
				 * @name Directives.isPermitted#applyLock
				 * @propertyOf Directives.isPermitted
				 * @description Reflects a value of an OPTIONAL attribute that
				 * can be used with this directive to add workspace locking
				 * check while evaluating workspace id.
				 */
				scope.applyLock = $parse(attrs.applyLock)(scope);

				/**
				 * @ngdoc property
				 * @name Directives.isPermitted#applyRevisionOverrideLock
				 * @propertyOf Directives.isPermitted
				 * @description Reflects a value of an OPTIONAL attribute that
				 * can be used with this directive to add workspace revision
				 * control locking check while evaluating workspace id.
				 */
				scope.applyRevisionOverrideLock = $parse(attrs.applyRevisionOverrideLock)(scope);

				if (angular.isDefined(attrs.workspaceId) ||
					angular.isDefined($stateParams.workspaceId)) {
					PermissionService
						.hasPermissions([parseInt(attrs.isPermitted)], attrs.workspaceId || $stateParams.workspaceId)
						.then(updateVisibility);

					attrs.$observe('workspaceId', function (value) {
						PermissionService
							.hasPermissions([parseInt(attrs.isPermitted)], value)
							.then(updateVisibility);
					});
				}

				if (ele.length && angular.isDefined($stateParams.itemId)) {
					PermissionService
						.checkPermissionByItemId(UrnParser.encode($stateParams.itemId), parseInt(attrs.isPermitted), scope.applyLock, scope.applyRevisionOverrideLock)
						.then(updateVisibility);
				}
			}
		};
	}
]);
