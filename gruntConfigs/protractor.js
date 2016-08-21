module.exports = { // Configurations for E2E/View tests
	options: {
		//keepAlive: false
	},
	dev: {
		options: {
			configFile: 'test/protractor.conf.js',
			args: {
				baseUrl: '<%=localConfig.baseUrl%>',
				params: {
					plmBaseUrl: '<%=localConfig.plmBaseUrl%>',
					baseName: '<%=localConfig.baseName%>',
					tenant: '<%=localConfig.customer%>',
					pristineFirst: '<%=localConfig.pristineFirst%>',
					userId: '<%=localConfig.userId%>',
					password: '<%=localConfig.password%>'
				}
			}
		}
	}
};
