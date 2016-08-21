module.exports = {
	stage: {
		options: {
			mangle: false
		},
		files: {
			'<%=buildPath%>/scripts/<%= pkg.builtApp %>-<%= version%>.js': ['<%=buildPath%>/scripts/<%= pkg.builtApp %>-<%= version%>.js']
		}
	}
};

