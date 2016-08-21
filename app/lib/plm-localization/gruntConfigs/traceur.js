module.exports = {  // build ES6 with traceur
	options: {
		experimental: true, // all experimental features
		blockBinding: true, // support for let and const
		moduleNames: true, // generate named module
		moduleNaming: {
			stripPrefix: "build", // strip specified prefix from generated module names
			addPrefix: 'com/autodesk' // add specified prefix to generated module names
		}
		//copyRuntime: 'app/lib' // copy traceur_runtime.js to location
	},
	build: {
		files: [
			{
				expand: true,
				cwd: 'src',
				src: ['**/*.js'],
				dest: 'build'
			}
		]
	}
};