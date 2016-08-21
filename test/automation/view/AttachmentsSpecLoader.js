/**
 * @ngdoc object
 * @name ViewTestsSpecs.AttachmentsSpecLoader
 *
 * @description This is the loader which points to the respective attachments
 * view tests spec.
 */
var helper = require('../util/Helper');

helper.isFeatureEnabled('wip.attachment').then(function (isFeatureEnabled) {
	if (isFeatureEnabled) {
		require('./ViewWipAttachmentsViewSpec');
		require('./ViewWipAttachmentsEditSpec');
	} else {
		require('./ViewAttachmentsViewSpec');
	}
});
