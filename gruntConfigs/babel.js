module.exports = {
	options: {
		sourceMap: true
	},
	dist: {
		files: [
			{
				expand: true,
				cwd: 'app',
				src: ['scripts/**/*.js', 'components/**/*.js'],
				dest: 'app/build-legacy'
			}
		]
	}
};
