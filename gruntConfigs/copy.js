module.exports = {// Configuration for Copy Task. Moves files to build directory.
	main: {
		files: [{
			expand: true,
			cwd: 'app',
			src: [
				'css/**',
				'fonts/**',
				'images/**',
				//'partials/**',
				'lib/**',
				//'components/**',
				//'build/**',
				'build-legacy/**',
				'plmlib/**',
				//'templates/**',
				'translations/**',
				'**.**'
			],
			dest: '<%=buildPath%>/'
		}]
	},
	dev: {
		files: [
			{
				expand: true,
				cwd: 'src',
				src: [
					'**/*.html'
				],
				dest: 'app/build'
			}
		]
	},
	deploy_dev: {
		files: [{
			expand: true,
			cwd: 'app',
			src: ['**/*'],
			dest: process.env.CATALINA_HOME + '/webapps/<%= constants.projectName%>/'
		}]
	},
    deploy_stage: {
		files: [{
			expand: true,
			cwd: 'build/',
			src: ['**/*'],
			dest: process.env.CATALINA_HOME + '/webapps/<%= constants.projectName%>/'
		}]
	},
	e2e: {
		files: [{
			expand: true,
			cwd: 'app',
			src: ['**/*', '!components/**/*.js', '!build/**/*.js', '!scripts/**/*.js', '../src/**/*'],
			dest: 'instrumented/app'
		}]
	},
	doc: {
		files:[{
			src: [],
			dest: 'doc'
		}]
	}
};
