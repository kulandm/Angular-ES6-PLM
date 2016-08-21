// Configuration for Copy Task. Moves files to build directory.
module.exports = {
	build: {
		files: [{
			expand: true,
			cwd: '',
			src: ['css/*.css'],
			dest: 'build'
		}]
	},
	dist: {
		files: [
			{
				expand: true,
				cwd: 'build',
				src: ['cpdm-ui.js'],
				dest: 'dist'
			},
			{
				expand: true,
				cwd: 'build/css',
				src: ['cpdm-ui.css'],
				dest: 'dist'
			},
			{
				expand: true,
				cwd: '',
				src: ['icons/*.png'],
				dest: 'dist'
			}
		]
	}
};
