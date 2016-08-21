module.exports = {  // Clean build folder
	dev: {
		src: ['app/build', 'app/build-legacy']
	},
	devtmpfiles: {
		src: ['app/<%=tmpIndexFile%>']
	},
	stage: {
		src: ['<%=buildPath%>']
	},
	stagetmpfiles: {
		src: [
			'<%=buildPath%>/<%=tmpIndexFile%>',
			'<%=buildPath%>/<%=tplFile%>',
			'<%=buildPath%>/<%=tplFileProd%>',
			'<%=buildPath%>/templates.js'
		]
	},
	commons: {
		src: [
			
		]
	},
	e2e: {
		src: ['instrumented']
	},
	sasscache: {
		src: ['.sass-cache']
	},
	doc: {
		src: ['doc']
	},
	testCoverage: {
		src: ['test/coverage']
	}
};
