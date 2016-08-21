/*
 * Defines the editor custom behavior for this particular application.
 * 
 * @author: Ismael Machado
 *
 */
{

	// Specifies if edge control points should be reset after the the edge has been reconnected.
	mxGraph.prototype.resetEdgesOnConnect = true;
	// Holds the number of existing validation errors on the diagram.
	mxGraph.prototype.errorCount = 0;
	// Determines if the ID and Script ID fields are shown in the Properties Panel.
	mxGraph.prototype.showIds = false;
	// Determines if the ID and Script ID fields are temporarily shown in the Properties Panel.
	mxGraph.prototype.showIdsTemp = false;


	/**
	 * Function: unselectUndeletable
	 * 
	 * Removes the undeletable objects from the current selection prior to
	 * deleting, cutting or copying cells.
	 */
	mxGraph.prototype.unselectUndeletable = function() {
		var selectedCells = this.getSelectionModel().cells.slice();
		for (var i in selectedCells) {
			var selectedCell = selectedCells[i];
			if (selectedCell != null) {
				state = this.view.getState(selectedCell);
				style = (state != null) ? state.style : this.getCellStyle(selectedCell);
				if (style[mxConstants.STYLE_DELETABLE] == 0) {
					this.removeSelectionCell(selectedCell);
				}
			}
		}
	};
	
	/**
	 * Function: isCellDeletable
	 * 
	 * Overrides the original function to unselect undeletable objects, 
	 * before finding out if the given cell can be deleted.
	 */
	mxGraph.prototype.isCellDeletable = function(cell) 
	{
		this.unselectUndeletable();
		
		var state = this.view.getState(cell);
		var style = (state != null) ? state.style : this.getCellStyle(cell);
		var isSeleted = this.getSelectionCount() >= 1;
		
		return isSeleted && style[mxConstants.STYLE_DELETABLE] != 0;
	};
	

	/**
	 * Function: getTooltipForCell
	 * 
	 * Overrides function to show cell ids as tooltips.
	 */
	mxGraph.prototype.getTooltipForCell = function(cell)
	{
		var tip = null;
		
		if (cell != null)
		{
			if (cell.getTooltip != null)
			{
				tip = cell.getTooltip();
			}
			else
			{
				if (cell.value != null)
				{
					var tagName = cell.value.tagName;
					if (tagName == 'state' || tagName == 'transition' || tagName == 'note')
					{
						tagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
						tip = tagName + ': ' + formatCellId(cell.id);					
					}
				}
			}
		}
		
		return tip;
	};

	/**
	 * Function: convertValueToString
	 * 
	 * Overrides function to use the shortName for states and transitions 
	 * and the text for notes as labels.
	 */
	mxGraph.prototype.convertValueToString = function(cell)
	{
		var value = this.model.getValue(cell);
		var labelText = '';
		if (value != null)
		{
			if (value.tagName == 'note') {
				labelText = cell.getAttribute('text', '');
			}else {
				labelText = cell.getAttribute('shortName', '');
			}
		}

		//Using html for escaping
		return $("<div/>").text(labelText).html();
	};
	
	/**
	 * Map of mandatory fields to validate.
	 */
	mxGraph.prototype.allRequiredFields = {
		state: ['shortName', 'customID'],
		transition: ['shortName', 'customID', 'permissionID'],
		note: ['text']
	};
	
	/**
	 * Function: validateEscalatedTransitions
	 * 
	 * Escalated transitions need a special validation, since they're configured on the state (cell)
	 * but their properties are changed on the transition (cell) - when the validation is triggered,
	 * it has to check if all transitions that were escalated to have permissions assigned to them
	 * returns an object that is added to the list of errors
	 */
	function validateEscalatedTransitions(cell, tagName) {
		var flag = cell.getAttribute('escalatedTransitionsError');

		if (flag == 'true') {
			return {
				cellId: cell.id,
				tagName: tagName,
				fieldName: '',
				message: mxResources.get('warning.escalationTransitionList')
			};
		};
		// everything's valid, returns undefined
		return;
	};

	/**
	 * Map of mandatory fields relative to other fields
	 */
	mxGraph.prototype.relativeRequiredFields = {
		escalationEnabled: {
			'true':['escalationDelay','action']
		},
		escalationTransitionEnabled: {
			'true':['escalationPermissionId']
		},
		action: {
			'pre':{escalationEnabled:'true'},
			'1':['field'],
			//'2':['escalationTransitionList'],
			'2':[this.validateEscalatedTransitions],
			'3':['transition'],
			'4':['escalationScript']
		},
		reminderNotifications: {
			'true':['reminderInterval','reminderRepeat']
		}
	};
	
	/**
	 * Map of fields with limited length to validate.
	 */
	mxGraph.prototype.allLimitedFields = {
		state: {'shortName': 75, 'longName': 250},
		transition: {'shortName': 150, 'longName': 250},
		note: {'text': 2000}
	};
	
	/**
	 * Function: findKeyByValue
	 * 
	 * Returns the index key for the given value in the indicated array.
	 */
	function findKeyByValue(array, value) {
		for (var i in array) {
			var v = array[i];
			if (v == value) {
				return i;
			}
		}
	}
	
	/**
	 * Function: removeValue
	 * 
	 * Removes the element with the given value from the indicated array.
	 */
	function removeValue(array, value) {
		array.splice(findKeyByValue(array, value), 1);
	}
	
	/**
	 * Function: getRequiredFields
	 * 
	 * Returns a list of mandatory lists for the provided tagName.
	 */
	mxGraph.prototype.getRequiredFields = function(tagName) {
		//Obtain and clone array
		var requiredFields = this.allRequiredFields[tagName];
		if (requiredFields != null) {
			requiredFields = requiredFields.slice(0);
			
			var input = $('input#cmb_permissionID');
			if (input.length > 0) {
				//If new permission entered
				if (input.val() != '' && input.val() != input.attr('title')) {
					//Remove permissionID validation
					removeValue(requiredFields, 'permissionID');
				}
			}
		}
		return requiredFields;
	};
	
	/**
	 * Function: getRelativeRequiredFields
	 * 
	 * Returns a list of mandatory lists for the provided field.
	 */
	mxGraph.prototype.getRelativeRequiredFields = function(field) {
		//Obtain and clone array
		var requiredFields = this.relativeRequiredFields[field];
		return requiredFields;
	};
	
	/**
	 * Function: validateCell
	 * 
	 * Model objects validation.
	 */
	mxGraph.prototype.validateCell = function(cell, context) {
		var errors = [];
		if(cell.value != null){
			var tagName = cell.value.tagName;
			cell.clearErrors();
			
			var requiredFields = this.getRequiredFields(tagName); 
			var limitedFields = this.allLimitedFields[tagName];
			
			for (var i in requiredFields) {
				var requiredField = requiredFields[i];
				if (cell.getAttribute(requiredField) == undefined) {
					var params = [ mxResources.get(tagName + '.' + requiredField) ];
					errors.push({
						cellId: cell.id,
						tagName: tagName,
						fieldName: requiredField,
						message: mxResources.get('warning.required', params)
					});
				}
			}
			var attributes = cell.value.attributes||[]; /* not all nodes (e.g. note links) have attributes */
			for(var i=0;i<attributes.length;i++){
				var att = attributes[i].nodeName;
				var attVal = attributes[i].nodeValue;
				var relativeRequiredFields = this.getRelativeRequiredFields(att);
				if(relativeRequiredFields){
					for(var j in relativeRequiredFields[attVal]){
						var relativeRequiredField = relativeRequiredFields[attVal][j];
						var preTrue = true;
						for(var k in relativeRequiredFields['pre']){
							if(cell.getAttribute(k)!=relativeRequiredFields['pre'][k]){
								preTrue = false;
								break;
							}
						}
						if (preTrue && (typeof relativeRequiredField == 'function')) {
							// calls the function specified on the error list, expecting to return an error list
							var errorListArr = relativeRequiredField.call(this, cell, tagName);
							if (errorListArr != undefined) {
								errors.push(errorListArr);
							};
						} else if (preTrue && (cell.getAttribute(relativeRequiredField) == undefined || cell.getAttribute(relativeRequiredField) == '' || cell.getAttribute(relativeRequiredField) == 0)) {
							var params = [ mxResources.get(tagName + '.' + relativeRequiredField) ];
							errors.push({
								cellId: cell.id,
								tagName: tagName,
								fieldName: relativeRequiredField,
								message: mxResources.get('warning.required', params)
							});
						}
					}
				}
			}

			for (var limitedField in limitedFields) {
				var limit = limitedFields[limitedField];
				if (cell.getAttribute(limitedField) != undefined) {
					if (cell.getAttribute(limitedField).length > limit) {
						var params = [ mxResources.get(tagName + '.' + limitedField) ];
						errors.push({
							cellId: cell.id,
							tagName: tagName,
							fieldName: limitedField,
							message: mxResources.get('warning.limited', params)
						});
					}
				}
			}
			
			/*
			if(tagName == 'state') {
				if (cell.getAttribute('shortName').length > 75) {
					var params = [ mxResources.get('state.shortName') ];
					errors.push({
						cellId: cell.id,
						tagName: tagName,
						fieldName: 'shortName',
						message: mxResources.get('warning.required', params)
					});
				}
			}
			*/
		}

		cell.setErrors(errors);
		return errors.length > 0 ? errors : null;
	};

	/**
	 * Function: validateEdge
	 * 
	 * Transitions drawing validation.
	 */
	mxGraph.prototype.validateEdge = function(edge, source, target) {
		if (target.id == 'init-cell') { 
			return mxResources.get('error.transitionToStart');
		}
		
		if (target.id == 'init-cell' && source.value.tagName=="note" || source.id == 'init-cell'  && target.value.tagName=="note") { 
			if(source.edges == null || source.edges.length==0){
				return mxResources.get('error.transitionStartAndNote');
			}
		}
		
		if(target.value.tagName == 'note' && source.value.tagName=="note"){
			return mxResources.get('error.transitionFromNoteToNote');
		}
		if (edge != null) {
			var tagName = edge.value.tagName;
			var sourceTagName = source.value.tagName;
			var targetTagName = target.value.tagName;
			
			if(tagName == 'transition' && (sourceTagName == 'note' || targetTagName == 'note')) {
				return mxResources.get('error.transitionToNote');
			}
			if(tagName == 'edgeNote' && sourceTagName == 'note' && targetTagName == 'note') {
				return mxResources.get('error.transitionFromNoteToNote');
			}
			
		}
		
		return null;
	}		
	
	/**
	 * Function: getValidatationErrors
	 * 
	 * Goes through all the diagram cells and collects their validation errors.
	 */	
	mxGraph.prototype.getGraphValidationErrors = function(cell, context)
	{
		cell = (cell != null) ? cell : this.model.getRoot();
		context = (context != null) ? context : new Object();
		
		var isValid = true;
		var childCount = this.model.getChildCount(cell);
		var warning = [];

		for (var i = 0; i < childCount; i++)
		{
			var tmp = this.model.getChildAt(cell, i);
			var ctx = context;
			
			if (this.isValidRoot(tmp))
			{
				ctx = new Object();
			}
			
			var warn = this.getGraphValidationErrors(tmp, ctx);
			
			if (warn != null)
			{
				for (var j in warn) 
				{
					warning.push(warn[j]);
				}
			}
		}
		
		var w = '';
		// Checks edges and cells using the defined multiplicities
		if (this.model.isEdge(cell))
		{
			w = this.getEdgeValidationError(cell,
					this.model.getTerminal(cell, true),
					this.model.getTerminal(cell, false)) || '';
		}
		else
		{
			w = this.getCellValidationError(cell) || '';
		}
		if (w != '') {
			warning.push({
				cellId: cell.id,
				fieldName: '',
				message: w
			});
		}
		
		// Checks custom validation rules
		var err = this.validateCell(cell, context);
		
		if (err != null)
		{
			for (var j in err) 
			{
				warning.push({
					cellId: err[j].cellId,
					tagName: err[j].tagName,
					fieldName: err[j].fieldName,
					message: err[j].message
				});
			}
		}
		
		if (this.getSelectionModel().isSelected(cell)) 
		{
			showCellErrors(cell);
		}
		
		this.errorCount = warning.length;
		return (warning.length > 0) ? warning : null;
	};

	/**
	 * Function: setCellWarning
	 * 
	 * Overrides function to keep removing locked/managed states overlays 
	 * from being removed during validation.
	 */
	mxGraph.prototype.setCellWarning = function(cell, warning, img, isSelect)
	{
		return;
	};

	/**
	 * Function: createHandler
	 * 
	 * Overrides function to use the same handler for loops and straight 
	 * normal transitions.
	 */
	mxGraph.prototype.createHandler = function(state)
	{
		var result = null;
		
		if (state != null)
		{
			if (this.model.isEdge(state.cell))
			{
				result = new mxEdgeHandler(state);
			}
			else
			{
				result = new mxVertexHandler(state);
			}
		}
		
		return result;
	};

	/**
	 * Function: resetEdge
	 * 
	 * Overrides function to reset transitions labels together with elbow 
	 * points.
	 */
	mxGraph.prototype.resetEdge = function(edge)
	{
		var geo = this.model.getGeometry(edge);
		
		// Resets the control points
		if (geo != null)
		{
			if (geo.points != null && geo.points.length > 0)
			{
				geo = geo.clone();
				geo.offset = new mxPoint(0, 0);
				geo.points = [];
				this.model.setGeometry(edge, geo);
			}
		}
		
		return edge;
	};

	/**
	 * Function: cellConnected
	 * 
	 * Overrides function to fire the custom event AFTER_CELL_CONNECTED, 
	 * this is used for transition loops creation.
	 */
	mxGraph.prototype.cellConnected = function(edge, terminal, source, constraint)
	{
		if (edge != null)
		{
			this.model.beginUpdate();
			try
			{
				var previous = this.model.getTerminal(edge, source);
	
				// Updates the constraint
				this.setConnectionConstraint(edge, terminal, source, constraint);
				
				// Checks if the new terminal is a port, uses the ID of the port in the
				// style and the parent of the port as the actual terminal of the edge.
				if (this.isPortsEnabled())
				{
					var id = null;
		
					if (this.isPort(terminal))
					{
						id = terminal.getId();
						terminal = this.getTerminalForPort(terminal, source);
					}
					
					// Sets or resets all previous information for connecting to a child port
					var key = (source) ? mxConstants.STYLE_SOURCE_PORT :
						mxConstants.STYLE_TARGET_PORT;
					this.setCellStyles(key, id, [edge]);
				}
				
				this.model.setTerminal(edge, terminal, source);
				
				if (this.resetEdgesOnConnect)
				{
					this.resetEdge(edge);
				}
	
				this.fireEvent(new mxEventObject(mxEvent.CELL_CONNECTED,
					'edge', edge, 'terminal', terminal, 'source', source,
					'previous', previous));
			}
			finally
			{
				this.model.endUpdate();
			}
			this.fireEvent(new mxEventObject(mxEvent.AFTER_CELL_CONNECTED,
					'edge', edge, 'terminal', terminal, 'source', source,
					'previous', previous));
		}
	};
	
	/**
	 * Function: cellSizeUpdated
	 * 
	 * Overrides function to adjust the shape's height to the text 
	 * contained only if necessary.
	 */
	mxGraph.prototype.cellSizeUpdated = function(cell, ignoreChildren)
	{
		if (cell != null)
		{
			this.model.beginUpdate();				
			try
			{
				//var size = this.getPreferredSizeForCell(cell);
				var size = this.getTextBoudingBoxForCell(cell);
				var geo = this.model.getGeometry(cell);
				
				if (size != null && geo != null)
				{
					var collapsed = this.isCellCollapsed(cell);
					geo = geo.clone();
	
					if (this.isSwimlane(cell))
					{
						var state = this.view.getState(cell);
						var style = (state != null) ? state.style : this.getCellStyle(cell);
						var cellStyle = this.model.getStyle(cell);
	
						if (cellStyle == null)
						{
							cellStyle = '';
						}
	
						if (mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true))
						{
							cellStyle = mxUtils.setStyle(cellStyle,
									mxConstants.STYLE_STARTSIZE, size.height + 8);
	
							if (collapsed)
							{
								geo.height = size.height + 8;
							}
	
							geo.width = size.width;
						}
						else
						{
							cellStyle = mxUtils.setStyle(cellStyle,
									mxConstants.STYLE_STARTSIZE, size.width + 8);
	
							if (collapsed)
							{
								geo.width = size.width + 8;
							}
	
							geo.height = size.height;
						}
	
						this.model.setStyle(cell, cellStyle);
					}
					else
					{
						geo.width = size.width;
						if (geo.height < size.height) {
							geo.height = size.height;
						}
					}
	
					if (!ignoreChildren && !collapsed)
					{
						var bounds = this.view.getBounds(this.model.getChildren(cell));
	
						if (bounds != null)
						{
							var tr = this.view.translate;
							var scale = this.view.scale;
	
							var width = (bounds.x + bounds.width) / scale - geo.x - tr.x;
							var height = (bounds.y + bounds.height) / scale - geo.y - tr.y;
	
							geo.width = Math.max(geo.width, width);
							geo.height = Math.max(geo.height, height);
						}
					}
	
					this.cellsResized([cell], [geo]);
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		}
	};
	
	/**
	 * Function: getTextBoudingBoxForCell
	 * 
	 * Finds the state for the given cell and returns the its bounding 
	 * box as a rectangle.
	 */
	mxGraph.prototype.getTextBoudingBoxForCell = function(cell) {
		var result = {height: 0, width: 0}
		
		if (cell != null)
		{
			var state = this.view.getState(cell);
			if (state.text != null) {
				if(mxClient.IS_IE) {
					result.height = state.text.node.offsetHeight;
					result.width = state.text.node.offsetWidth;
				} else {
					result.height = state.text.boundingBox.height;
					result.width = state.text.boundingBox.width;
				}
			}
		}
		
		return result;
	};
	
}
