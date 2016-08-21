module.exports = {  // Concatenate all JS files into one
	options: {
		// Define a string to put between each file in the concatenated output
		separator: ';\n\n'
	},
	dist: {
		// The files to concatenate
		src: ['build/**/*.js'],
		// The location of the resulting JS file
		dest: 'build/plm-ng-filters.js'
	}
};
