'use strict';

/**
 * @ngdoc directive
 * @name Directives.userProfileSummary
 * @restrict E
 *
 * @description This directive displays a specific user's profile
 *
 * ##Dependencies
 *  * - Requires {@link Services.UserProfileService}
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<user-profile-summary user-id="42"></user-profile>
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
var userProfileSummary = plm360.directive('userProfileSummary', [
	'$compile',
	'ModelsManager',
	'EventService',
	function ($compile, ModelsManager, EventService) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'partials/userProfileSummary.html',
			link: function (scope, element, attrs) {
				var userId = attrs.userId;

				var profileItems = [
					{key: 'loginName', icon: 'md-person'},
					{key: 'address1', icon: 'md-pin-drop'},
					{key: 'address2', icon: 'md-pin-drop'},
					{key: 'city', icon: 'md-pin-drop'},
					{key: 'postal', icon: 'md-pin-drop'},
					{key: 'region', icon: 'md-pin-drop'},
					{key: 'country', icon: 'md-pin-drop'},
					{key: 'industry', icon: 'md-person'},
					{key: 'aboutMe', icon: 'md-person'}
				];

				EventService.listen('user:' + userId + ':done', function (event, obj) {
					var profileItemsListLength = _.filter(profileItems, function (item) {
						return obj.json[item.key];
					}).length;

					if (profileItemsListLength > 4) { // 4 because email is always displayed
						scope.collapsible = true;
						scope.isCollapsed = true;
					}

					/**
					 * @ngdoc property
					 * @name Directives.userProfileSummary#profileItems
					 * @propertyOf Directives.userProfileSummary
					 * @description Specifies the items to be displayed in the user profile and their respective icons
					 */
					scope.profileItems = profileItems;

					/**
					 * @ngdoc property
					 * @name Directives.userProfileSummary#data
					 * @propertyOf Directives.userProfileSummary
					 * @description User profile data
					 */
					scope.data = obj.json;

					// profile image
					var profileImages = obj.getProfileImage();
					/**
					 * @ngdoc property
					 * @name Directives.userProfileSummary#avatarSrc
					 * @propertyOf Directives.userProfileSummary
					 * @description The URL of the user's avatar image
					 */
					scope.avatarSrc = profileImages.medium;
				});

				/**
				* @ngdoc property
				* @name Directives.userProfileSummary#userObj
				* @propertyOf Directives.userProfileSummary
				* @description The Promise resolving to user object providing information about the user
				*/
				ModelsManager.getUser(userId);
			}
		};
	}
]);
