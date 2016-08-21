module.exports = {// Configuration for Copy Task. Moves files to build directory.
	build: {
		files: [{
			expand: true,
			cwd: '',
			src: [
				'translations/**'
			],
			dest: 'build'
		}]
	},
	dist: {
		files: [{
			expand: true,
			cwd: 'build',
			src: ['plm-localization.js', 'translations/**'],
			dest: 'dist'
		}]
	}
};
