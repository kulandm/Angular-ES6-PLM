module.exports = {  // Zip the assets for artifactory
	main: {
		cwd: 'build/',
		src: ['build/plm-underscore.js'],  //any assets such as js, css, images, bundles, text, that needs to be packaged
		dest: 'build/plm-underscore.zip'
	}
};
