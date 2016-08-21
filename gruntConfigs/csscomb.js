module.exports = {  // Sorts CSS/SCSS properties
	dev: {
		options: {
			config: 'csscomb.json'
		},
		expand: true,
		cwd: 'app/scss/',
		src: [
			'**/*.scss',
			'!**/bootstrap/**',
			'!**/fonts/**',
			'!**/animate.css-scss/**',
			'!**/_plm-ui-grid.scss'
		],
		dest: 'app/scss/',
		ext: '.scss'
	}
};