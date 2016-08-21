module.exports = {// Configuration for Curl Task. Download files from artifactory repo.
	'cpdm-ui-release': {
		src: '<%= constants.cpdmUIFiles%>',
		router: function (url) {
			// Map urls to custom filepaths to ensure. Without 'router' all the files will be mapped to the dist folder instead of
			// in the respective folders.
			return url.replace(/(.*cpdm-ui-release\/.*?\/)/, '');
		},
		dest: '<%=buildPath%>/lib/cpdm-ui/dist'
	}
};