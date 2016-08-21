module.exports = {  // Concatenate all JS files into one
	options: {
		// Define a string to put between each file in the concatenated output
		separator: ';'
	},
	dist: {
		// The files to concatenate
		src: [
			'app/lib/plm-localization/dist/**/*.js',
			'app/lib/plm-underscore/build/*.js',
			'app/lib/plm-event-service/build/**/*.js',
			'app/lib/plm-dropdown/dist/plm-dropdown.js',
			'app/lib/plm-token-service/dist/**/*.js',
			'app/lib/plm-authentication-service/build/**/*.js',
			'app/lib/plm-classic-redirector/build/**/*.js',
			'app/lib/plm-loading-data-service/build/**/*.js',
			'app/lib/plm-config/build/**/*.js',
			'app/lib/plm-rest-wrapper-service/dist/**/*.js',
			'app/lib/plm-notification/dist/**/*.js',
			'app/lib/plm-ng-filters/build/**/*.js',
			'app/lib/plm-flyout/dist/**/*.js',
			'app/lib/plm-api-models-manager/dist/**/*.js',
			'app/lib/plm-bom/dist/**/*.js',
			'app/lib/plm-table-data/dist/**/*.js',
			'app/lib/plm-dashboard/dist/**/*.js',
			'app/lib/plm-jitterbit/dist/**/*.js',
			'app/lib/plm-search/dist/**/*.js',
			'app/lib/plm-roamer/dist/**/*.js',
			'app/lib/plm-urn-parser/dist/plm-urn-parser.js',
			'app/lib/plm-field-selector/dist/**/*.js',
			'app/lib/plm-users-selector/dist/plm-usersSelector.js',
			'app/lib/plm-cws/dist/**/*.js',
			'app/lib/plm-section-wrapper/build/**/*.js',
			'app/lib/plm-edit-tracker/dist/**/*.js',
			'app/lib/plm-file-overview-service/dist/plm-file-overview-service.js',
			'app/lib/plm-wip-http/dist/plm-wip-http.js',
			'app/lib/plm-wip-file-browser/dist/*.js',
			'app/lib/plm-wip-file-type/dist/*.js',
			'app/lib/plm-navigation-guard/dist/plm-navigation-guard.js',
			'app/lib/plm-commons/*/*.js',
			'app/lib/adsk-commons/*/*.js',
			'app/lib/plm-user-avatar/dist/**/*.js',
			'app/build/**/module.js',
			'app/components/**/module.js',
			'app/build-legacy/scripts/**/module.js',
			'app/build/**/*.js',
			'app/components/**/*.js',
			'app/lib/cpdm-ui/dist/*.min.js',
			'app/build-legacy/scripts/**/*.js',
			'<%=buildPath%>/templates.js'
		],
		// The location of the resulting JS file
		dest: '<%=buildPath%>/scripts/<%= pkg.builtApp %>-<%= version%>.js'
	}
};
