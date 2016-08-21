import userAvatar from './userAvatar.directive.js';

angular.module(__moduleName, [
])
.directive('userAvatar', userAvatar)
.constant('userAvatarColors', [
	'#55A559',
	'#8AB656',
	'#BFCB49',
	'#E8CB49',
	'#E5A819',
	'#E18919',
	'#E86238',
	'#E15348',
	'#D43269',
	'#9234A2',
	'#6A46AA',
	'#4A59A9',
	'#3593DE',
	'#1B9FDB',
	'#15ABBE',
	'#0F877B',
	'#607D8B',
	'#9E9E9E'
]);
