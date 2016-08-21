'use strict';

angular.module('plm360.mockObjects').factory('MockPLMNavigationController', function () {
	return function () {
		return sinon.stub({
			retrieveData: function () {},
			isOpen: function () {},
			toggleMenu: function () {},
			toggleBack: function () {},
			switchToClassic: function () {},
			goToAdministrationUsers: function () {},
			toggleCategory: function () {},
			isLevel: function () {},
			isCategoryOpen: function () {},
			goToWorkspace: function () {}
		});
	}
});
