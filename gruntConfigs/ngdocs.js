module.exports = {  // NgDocs config, documentation
	options: {
		dest: 'doc'
		/*analytics: {
			account: 'UA-08150815-0',
			domainName: 'my-domain.com'
		},*/
		/*discussions: {
			shortName: 'my',
			url: 'http://my-domain.com',
			dev: false
		}*/
	},
	all: {
		src: [
			'app/scripts/**/*.js',
			'app/components/**/*.js',
			'src/**/*.js',
			'test/e2e/pages/*.js'
		]
	}
};