module.exports = {  // Zip the assets for artifactory
	main: {
		cwd: 'build/',
		src: ['build/cpdm-ui.js'],  // any assets such as js, css, images, bundles, text, that needs to be packaged
		dest: 'build/cpdm-ui.zip'
	}
};
