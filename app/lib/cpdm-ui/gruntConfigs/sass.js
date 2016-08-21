// Compile scss files
module.exports = {
	dist: {
		files: [{
			expand: true,
			cwd: 'scss',
			src: ['*.scss'],
			dest: 'css',
			ext: '.css'
		}]
	}
};
