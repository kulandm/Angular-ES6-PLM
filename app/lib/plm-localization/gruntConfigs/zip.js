module.exports = {  // Zip the assets for artifactory
	main: {
		cwd: 'build/',
		src: ['build/translations/*','build/plm-localization.js'],
		dest: 'build/plm-localization.zip'
	}
};
