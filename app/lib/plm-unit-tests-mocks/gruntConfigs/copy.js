module.exports = {// Configuration for Copy Task. Moves files to build directory.
	build: {
		files: [{
			expand: true,
			cwd: 'src',
			src: ['mock*/*'],
			dest: 'build'
		}]
	}
};
