'use strict';

/**
 * @ngdoc directive
 * @name Directives.userAvatar
 * @restrict E
 *
 * @description This directive is to render user Avatar or Initial with background image
 * The color logic is taken from <a href="https://git.autodesk.com/A360/Galileo-Web/blob/master/app/directives/user_avatar/user_avatar.dir.js">A360</a>
 * - userName : String that contains the user name
 * - userImage : String that contains the url of user profile image
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<user-avatar
 * 			user-name="String"
 * 			user-image="String"
 * 		></user-avatar>
 *   </doc:source>
 * </doc:example>
 */
function userAvatar(userAvatarColors) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'userAvatar.html',
		scope: {
			userName: '@',
			userImage: '@'
		},
		link: (scope) => {

			let hashCode = function (s) {
				if (!s) {
					return 0;
				}
				return Math.abs(s.split("").reduce(function (a, b) {
					a = ((a << 5) - a) + b.charCodeAt(0);
					return a & a;
				}, 0));
			};

			scope.userInitials = null;
			scope.userBackgroundColor = null;

			if (scope.userName) {
				let words = scope.userName.trim().split(' ');
				words.splice(1, words.length - 2);
				if (words.length === 1) {
					words[words.length] = words[0].substring(1);
				}
				scope.userInitials = _.map(words, word => word.charAt(0).toUpperCase()).join('');

				scope.userBackgroundColor = userAvatarColors[hashCode(scope.userName) % userAvatarColors.length];
			}
		}
	};
}

export default userAvatar;
