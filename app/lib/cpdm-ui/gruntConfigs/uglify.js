module.exports = {
	options: {
		mangle: false
	},
	dist: {
		files: [{
			expand: true,
			cwd: 'build',
			src: ['cpdm-ui.js'],
			dest: 'dist',
			ext: '.min.js'
		}]
	}
};
