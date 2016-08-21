// Concatenate all JS files into one
module.exports = {
	options: {
		// Define a string to put between each file in the concatenated output
		separator: ';\n\n'
	},
	dist: {
		// The files to concatenate
		src: [
			'build/!(templates)*.js',
			'build/components/**/*.js',
			'build/models/**/*.js',
			'build/filters/**/*.js',
			'build/services/**/*.js',
			'build/templates.js'
		],
		// The location of the resulting JS file
		dest: 'build/cpdm-ui.js'
	}
};
