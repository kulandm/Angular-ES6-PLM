module.exports = { // Pass info out into html, e.g. version
	dev: {
		src: 'app/<%=tplFile%>',
		dest: 'app/<%=tmpIndexFile%>',
		options: {
			data: {
				version: '<%=version%>',
				buildPath: 'app',
				sources: '<!-- include: "type":"js","files":"build/**/*.js" -->\r\n<!-- include: "type":"js","files":"build-legacy/scripts/**/*.js" -->',
				urlSubPath: 'app'
			}
		}
	},
	stage: {
		src: '<%=buildPath%>/<%=tplFileProd%>',
		dest: '<%=buildPath%>/<%=tmpIndexFile%>',
		options: {
			data: {
				version: '<%=version%>',
				buildPath: '<%=buildPath%>',
				sources: '<!-- include: "type":"js","files":"scripts/builtApp-<%= version %>.js" -->',
				urlSubPath: 'plm'
			}
		}
	}
};
