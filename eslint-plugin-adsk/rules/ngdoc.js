module.exports = function (context) {
	var noDocs = [];
	var lineDocs = [];

	function reportBadUses () {
		//context.report(...., '')
		noDocs.forEach(function (noDoc) {
			context.report(noDoc.stmt, '{{name}} has no documentation whatsoever.  Please properly document it.  ', {
				name: noDoc.name
			});
		});
		lineDocs.forEach(function (lineDoc) {
			context.report(lineDoc.stmt, '{{name}} has at leaset 1 line of documentation, but who can understand it with just one line?  Please properly document it.  ', {
				name: lineDoc.name
			});
		});
	}

	function checkComments(stmt, node, name) {
		if (!node.leadingComments) {
			noDocs.push({name: name, stmt: stmt});
		} else {
			if (node.leadingComments && node.leadingComments[0].type === 'Line') {
				lineDocs.push({name: name, stmt: stmt});
			}
		}
	}

	var comments = context.getAllComments();
	comments.forEach(function (comment) {
		//console.log(comment);
		//console.log(comment.loc); comment.start.line, comment.end.line
	});

	return {
		
		'CallExpression:exit': function(node) {
			// if(utils.isAngularControllerDeclaration(node)) {
			// 	controllerFunctions.push(utils.getControllerDefinition(context, node));
			// }
		},
		//Function delcalarations
		'FunctionDeclaration': function (stmt) {
			checkComments(stmt, stmt, stmt.id.name);
		},
		'FunctionExpression': function (stmt) {
			if (stmt.parent.type === 'MethodDefinition') {
				checkComments(stmt, stmt.parent, stmt.parent.key.name);
			} else if (stmt.parent.type === 'AssignmentExpression' && stmt.parent.parent.type === 'ExpressionStatement') {
				checkComments(stmt, stmt.parent.parent, stmt.parent.parent.expression.left.name || stmt.parent.parent.expression.left.property.name);
			} else if (stmt.parent.type === 'VariableDeclarator') {
				checkComments(stmt, stmt.parent.parent, stmt.parent.id.name);
			}
		},
		'ArrowExpression': function (stmt) {
			//console.log('arrow', stmt);
		},
		'Program:exit': function () {
			reportBadUses();
		}
	}
}
