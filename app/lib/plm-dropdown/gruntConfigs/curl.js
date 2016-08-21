module.exports = {// Configuration for Curl Task. Download files from artifactory repo.
	'plm-underscore': {
		src: 'http://veyron.autodesk.com/artifactory/simple/ext-release-local/com/autodesk/plm/plm-underscore/<%= constants.plmUnderscoreVersion%>/plm-underscore.zip',
		dest: 'lib/plm-underscore/build/plm-underscore.zip'
	},
	'plm-event-service': {
		src: 'http://veyron.autodesk.com/artifactory/simple/ext-release-local/com/autodesk/plm/plm-event-service/<%= constants.plmUnderscoreVersion%>/plm-event-service.zip',
		dest: 'lib/plm-event-service/build/plm-event-service.zip'
	}
};