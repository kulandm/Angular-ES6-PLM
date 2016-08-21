'use strict';
angular.module('plm360.mockData').value('MockUserProfile',{
	json: {
		"id" : "PLMAutoTest",
		"displayName" : "PLMAutoTest Selenium1",
		"loginName" : "PLMAutoTest",
		"organization" : "MyCo",
		"licenseType" : "PROFESSIONAL",
		"firstName" : "PLMAutoTest",
		"lastName" : "Selenium1",
		"email" : "plmautotest@autodesk.com",
		"address" : "555 MyAddress1",
		"address2" : "555 MyAddress2",
		"city" : "MyCity",
		"postalCode" : "55555",
		"region" : "MI",
		"country" : "",
		"jobTitle" : "MyTitle",
		"industry" : null,
		"description" : "PLMAutoTest Selenium1",
		"dateFormat" : "MM/dd/yyyy",
		"unitOfMeasureSystem" : "ENGLISH",
		"attachmentThumbnails" : true
	},
	getProfileImage: function () {
		return {small: "images/avatar_generic_x20.png", medium: "images/avatar_generic_x35.png"};
	}
});
