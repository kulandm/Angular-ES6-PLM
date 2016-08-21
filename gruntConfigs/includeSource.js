module.exports = { // Dynamically adds JS files into index.html
	options: {
		basePath: '<%=buildPath%>',
		baseUrl: '',
		templates: {
			html: {
				js: '\t\t<script type="text/javascript" src="{filePath}"></script>\r\n'
			}
		}
	},
	dev: {
		options: {
			basePath: 'app'
		},
		files: {
			'app/<%=indexFile%>': 'app/<%=tmpIndexFile%>'
		}
	},
	stage: {
		files: {
			'<%=buildPath%>/<%=indexFile%>': '<%=buildPath%>/<%=tmpIndexFile%>'
		}
	}
};