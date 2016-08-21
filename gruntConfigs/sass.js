module.exports = {  // Compile scss files
	dev: {
		files: [{
			expand: true,
			cwd: 'app/scss',
			src: ['*.scss'],
			dest: 'app/css',
			ext: '.css'
		}]
	},
	stage: {
		files: [{
			expand: true,
			cwd: 'app/scss',
			src: ['*.scss'],
			dest: '<%=buildPath%>/css',
			ext: '.css'
		}]
	},
	prod: {
		files: [{
			expand: true,
			cwd: 'app/scss',
			src: ['*.scss'],
			dest: '<%=buildPath%>/css',
			ext: '.css'
		}]
	}
};