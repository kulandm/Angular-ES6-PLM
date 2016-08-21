module.exports = {  // Zip the assets for artifactory
	main: {
		cwd: 'build/',
		src: ['build/plm-rest-wrapper-service.js'],  //any assets such as js, css, images, bundles, text, that needs to be packaged
		dest: 'dist/plm-rest-wrapper-service.zip'
	}
};
