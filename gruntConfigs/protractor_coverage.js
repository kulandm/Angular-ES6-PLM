module.exports = {  // protractor coverage config
	options: {
		configFile: 'test/protractor-cc.conf.js',
		keepAlive: true,
		noColor: false,
		coverageDir: "test/coverage/e2e",
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
	},
	all: {
		options: {

		}
	}
};