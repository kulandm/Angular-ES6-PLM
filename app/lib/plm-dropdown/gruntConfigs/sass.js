module.exports = {  // Compile scss files
	dev: {
		files: [{
			expand: true,
			cwd: 'scss',
			src: ['*.scss'],
			dest: 'css',
			ext: '.css'
		}]
	}
};
