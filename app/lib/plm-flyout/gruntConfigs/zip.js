module.exports = {  // Zip the assets for artifactory
	main: {
		cwd: 'build/',
		src: [],  // any assets such as js, css, images, bundles, text, that needs to be packaged
		dest: 'build/plm-flyout.zip'
	}
};
