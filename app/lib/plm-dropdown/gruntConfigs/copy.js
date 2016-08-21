module.exports = {// Configuration for Copy Task. Moves files to build directory.
	build: {
		files: [{
			expand: true,
			cwd: '',
			src: ['css/*'],
			dest: 'build'
		}]
	},
	dist: {
		files: [{
			expand: true,
			cwd: 'build',
			src: ['plm-dropdown.js'],
			dest: 'dist'
		}]
	},
	cssdist: {
		files: [{
			expand: true,
			cwd: 'css',
			src: ['*'],
			dest: 'dist'
		}]
	}
};
