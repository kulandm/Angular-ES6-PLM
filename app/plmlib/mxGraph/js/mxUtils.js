/*
 * Defines the editor custom behavior for this particular application.
 * 
 * @author: Ismael Machado
 *
 */
{
		
	mxConstants.DEFAULT_HOTSPOT = 1;
		
	// Enables adding control points
	mxEdgeHandler.prototype.addEnabled = true;
	
	// Enables removing control points
	mxEdgeHandler.prototype.removeEnabled = true;
	
	// Enables snapping waypoints to terminals
	mxEdgeHandler.prototype.snapToTerminals = true;
	
	//Overlay image shown when hovering over states that allows to connect them with transitions. 
	mxConnectionHandler.prototype.connectImage = new mxImage('plmlib/mxGraph/images/connector.gif', 16, 16);
	
	// Event used for transition loops elbow creation.
	mxEvent.AFTER_CELL_CONNECTED = 'afterCellConnected';

	
	mxResources.resourcesEncoded=true; //Resourcs files are encoded, not UTF-8
	mxResources.get =  function(key, params, defaultValue)
	{
		if(!key||key==null) return '';
		var value = ''
		var chunks = key.split('.');
		var estr = '_plm.messages.mxworkflow';
		for(var i=0;i<chunks.length;i++){
			if(window[chunks[i]]){
				estr += '[\''+chunks[i]+'\']';
			}else{
				estr += '.'+chunks[i];
			}
		}
		estr += '()';
		try{
			value = eval(estr);
		}catch(e){
			value = mxResources.resources[key];
		}
		
		// Applies the default value if no resource was found
		if (value == null)
		{
			value = defaultValue;
		}
		
		// Replaces the placeholders with the values in the array
		if (value != null &&
			params != null)
		{
			var result = [];
			var index = null;
			
			for (var i = 0; i < value.length; i++)
			{
				var c = value.charAt(i);

				if (c == '{')
				{
					index = '';
				}
				else if (index != null && 	c == '}')
				{
					index = parseInt(index)-1;
					
					if (index >= 0 && index < params.length)
					{
						result.push(params[index]);
					}
					
					index = null;
				}
				else if (index != null)
				{
					index += c;
				}
				else
				{
					result.push(c);
				}
			}
			
			value = result.join('');
		}

		//Use HTML to do escaping. lots of code may rely on this so I'm not returning a text string for now.
		return $("<div/>").text(value).html();
		//return value;
	};
	
	
	
	/**
	 * Function: addText
	 * 
	 * Overrides function to add ID to the input field.
	 */
	mxForm.prototype.addText = function(id, name, value)
	{
		var input = document.createElement('input');
		
		input.setAttribute('id', 'txt_' + id);
		input.setAttribute('type', 'text');
		input.value = value;
		
		return this.addField(name, input);
	};
	
	/**
	 * Function: addTextarea
	 * 
	 * Overrides function to add ID to the input field.
	 */
	mxForm.prototype.addTextarea = function(id, name, value, rows)
	{
		var input = document.createElement('textarea');
		
		if (mxClient.IS_NS)
		{
			rows--;
		}
		
		input.setAttribute('id', 'txt_' + id);
		input.setAttribute('rows', rows || 2);
		input.className = 'textAreaResizeVertical';
		input.value = value;
		
		return this.addField(name, input);
	};
	
	/**
	 * Function: addSelect
	 * 
	 * Wrapper to standarize the combo insertion with text fields insertion functions. 
	 */
	mxForm.prototype.addSelect = function(id, name, value, cell) 
	{
		var input = this.addCombo(name, false, 1, cell, id);
		input.setAttribute('id', 'cmb_' + id);
		return input;
	};
	
	/**
	 * Function: addInlineSelect
	 * 
	 * Wrapper to standarize the combo insertion with text fields insertion functions, minus the label
	 */
	mxForm.prototype.addInlineSelect = function(id, value, cell)
	{	
		var select = document.createElement('select');
		select.setAttribute('id', 'cmb_' + id);
		select.setAttribute('size', 1);
		return select;
	};

	/**
	 * Function: addCombo
	 * 
	 * Adds a combo for the given name and returns the combo.
	 */
	mxForm.prototype.addCombo = function(name, isMultiSelect, size, cell, id)
	{
		var select = document.createElement('select');
		
		if (size != null)
		{
			select.setAttribute('size', size);
		}
		
		if (isMultiSelect)
		{
			select.setAttribute('multiple', 'true');
		}
		
		return this.addField(name, select, cell, id);
	};
	
	/**
	 * Function: addField
	 * 
	 * Adds a new row with the name and the input field in two columns and
	 * returns the given input.
	 */
	mxForm.prototype.addField = function(name, input, cell, id)
	{
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		
		mxUtils.write(td, name);
		tr.appendChild(td);
		
		td = document.createElement('td');
		td.appendChild(input);
		tr.appendChild(td);
		
		var iconAdded = appendIcon(cell, id, tr);
		if(iconAdded)
			input.setAttribute('class', 'selectSmall');
		
		this.body.appendChild(tr);
		
		return input;
	};
	
	/**
	 * Function: appendIcon
	 * 
	 * This function adds an icon next to the precondition or action and when hover 
	 * will show the legacy script
	 * 
	 */
	function appendIcon(cell, id, tr){
		
		var added = false;
		
		if(id == 'scriptConditionId'){
			var attribute = cell.getAtt('preCondition');
				if (attribute != undefined) {
					if(attribute.value!=''){
				
						var img = document.createElement('img');
						img.setAttribute('src', 'plmlib/mxGraph/images/icons/script_icon.png');
						img.setAttribute('class', 'imageCustom');
						img.setAttribute('title', attribute.value);
						
						tr.appendChild(img);
						added = true;
						
					}
				}
		}
		if(id == 'scriptValidationId'){
			var attribute = cell.getAtt('validatorClassName');
			if (attribute != undefined) {
				if(attribute.value!=''){
									
					var img = document.createElement('img');
					img.setAttribute('src', 'plblib/mxGraph/images/icons/script_icon.png');
					img.setAttribute('class', 'imageCustom');
					img.setAttribute('title', attribute.value);
					
					tr.appendChild(img);
					added = true;
				}
			}
		}
		return added;
	}

	/**
	 * Function: addTableCell
	 * 
	 * Adds a new row with an empty cell to the given form.
	 */
	mxForm.prototype.addTableCell = function(colspan) 
	{
		colspan = colspan == undefined ? 1 : colspan;
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.setAttribute('colspan', colspan);
		tr.appendChild(td);
		if (colspan == 1) {
			td = document.createElement('td');
			tr.appendChild(td);
		}
		this.body.appendChild(tr);
		return td;
	};
	
	/**
	 * Function: addCheckbox
	 * 
	 * Overrides function to add a new checkbox to given form with the 
	 * given name as label and sets its value with a boolean variable
	 * using jQuery.
	 */
	mxForm.prototype.addCheckbox = function(id, label, name, value) 
	{
		var lbl = document.createElement('label');
		lbl.setAttribute('id', 'lbl_' + id);
		lbl.setAttribute('for', 'chk_' + name);
		mxUtils.write(lbl, label);
		
		var input = document.createElement('input');
		input.setAttribute('id', 'chk_' + id)
		input.setAttribute('name', name);
		input.setAttribute('type', 'checkbox');
		
		var cell = this.addTableCell(); 
		cell.appendChild(input);
		cell.appendChild(lbl);

		// IE can only change the checked value if the input is inside the DOM
		if (value === 'true') 
		{
			$(input).attr("checked", "checked");
		}
		
		return input;
	};

	/**
	 * Function: addInlineCheckbox
	 * 
	 * Overrides function to add a new checkbox to given form
	 * and sets its value with a boolean variable using jQuery.
	 */
	mxForm.prototype.addInlineCheckbox = function(id, name, value) 
	{	
		var input = document.createElement('input');
		input.setAttribute('id', 'chk_' + id)
		input.setAttribute('name', name);
		input.setAttribute('type', 'checkbox');

		// IE can only change the checked value if the input is inside the DOM
		if (value === 'true') 
		{
			$(input).attr("checked", "checked");
		}
		
		return input;
	};

	/**
	 * Function: addNumberInput
	 * 
	 * Overrides function to add new input of type number counter,
	 * setting the allowed range (min and max values)
	 */
	mxForm.prototype.addNumberInput = function(id, label, name, value, min, max, length, suffix) 
	{
		var lbl = document.createElement('label');
		lbl.setAttribute('id', 'lbl_' + id);
		lbl.setAttribute('for', 'cmb_' + name);
		mxUtils.write(lbl, label);
		
		var input = document.createElement('input');
		input.setAttribute('id', 'cmb_' + id)
		input.setAttribute('name', name);
		input.setAttribute('type', 'number');
		input.setAttribute('min', min);
		input.setAttribute('max', max);
		input.setAttribute('pattern', '[0-9]*');
		input.style.width = (length*12) + 'px';
		if (value != '') {
			input.setAttribute('value', value);
		};

		// sets the amount to max/min when changing, to avoid invalid values
		input.addEventListener('input', function(e) {
		    var self = $(this);
		    var reg = new RegExp('^[0-9]+$');
		    // test to check if the user has typed invalid chars (letters, symbols, etc.)
		    if ((self.val() != '') && (reg.test(self.val()) == false)) {
		    	self.val(min);
		    } else {
				if (self.val() != '') {
					if (self.val() < min) {
						self.val(min);
					} else if (self.val() > max) {
						self.val(max);
					};
				};
			};
			self.click(); // trigger validation
		}, false);

		var cont = $('<div />').append(input).append(' ' + suffix);

		this.addField(label,cont[0]);
		
		return input;
	};
	
	/**
	 * Function: addSliderCheckbox
	 * 
	 * new function to add a new checkbox to given form with the 
	 * given name as label and sets its value with a boolean variable
	 * using jQuery.
	 */
	mxForm.prototype.addSliderCheckbox = function(id, label, name, value) 
	{
		var cont = document.createElement('div');
		cont.className = 'sliderCheckboxCont sliderCheckbox'+(value=='true'?' checked':'');
		
		var lbl = document.createElement('label');
		lbl.setAttribute('id', 'lbl_' + id);
		lbl.setAttribute('for', 'chk_' + name);
		mxUtils.write(lbl, label);
		
		var input = document.createElement('input');
		input.setAttribute('id', 'chk_' + id)
		input.setAttribute('name', name);
		input.setAttribute('type', 'checkbox');
		
		this.addField(label,cont);
		cont.appendChild(input);

		// IE can only change the checked value if the input is inside the DOM
		if (value === 'true') 
		{
			$(input).attr("checked", "checked");
		}
		
		return input;
	};
	
	/**
	 * Function: addButton
	 * 
	 * Adds a new button to the given form with the indicated name.
	 */
	mxForm.prototype.addButton = function(id, label, name) 
	{
		var button = document.createElement('button');
		button.setAttribute('id', 'btn_' + id);
		button.setAttribute('name', name);
		
		var span = document.createElement('span');
		mxUtils.write(span, label);
		button.appendChild(span);
		
		var cell = this.addTableCell(); 
		cell.appendChild(button);
		return button;
	};

	/**
	 * Function: addButtonOnly
	 * 
	 * Creates a new button and returns the element, not attaching it to the panel
	 */
	mxForm.prototype.addButtonOnly = function(id, label, name) 
	{
		var button = document.createElement('button');
		button.setAttribute('id', 'btn_' + id);
		button.setAttribute('name', name);
		button.setAttribute('class', 'inline');
		
		var span = document.createElement('span');
		mxUtils.write(span, label);
		button.appendChild(span);
		
		return button;
	};

	/**
	 * Function: addButtonOnly
	 * 
	 * Creates a new button and returns the element, not attaching it to the panel
	 */

	
	/**
	 * Function: onLeaveEditor
	 * 
	 * If the user has unsaved changes, then returns a message to 
	 * confirm discarding them
	 */
	mxUtils.onLeaveEditor = function (util) {
		if (editor.undoManager.canUndo()) {
			mxUtils.confirm(mxResources.get('unsavedChanges'), mxResources.get('saveAndClose'), 300, true, mxResources.get('save'), mxResources.get('donotsave'), mxResources.get('cancel'), true, function(doSave) {
				if(doSave){
					editor.save(function(){
						util.hideModal("workspaceModal");
					});
				}else{
					util.hideModal("workspaceModal");
				}
			});		
		}
		else
			util.hideModal("workspaceModal");
	}
	
	
	/**
	 * Function: alert
	 * 
	 * Overrides function to show nicer error messages.
	 */
	mxUtils.alert = function(message)
	{
		mxUtils.error(message, 320, true, 'plmlib/mxGraph/images/icons/errortriangle_16.png');
		
	};
	
	
	/**
	 * This function must receive an html message
	 * 
	 * */
	mxUtils.showError = function(message, xPos, yPos, convertMessage)
	{
		
		var width = 400;
		var close = true;
		var icon = 'plmlib/mxGraph/images/icons/errortriangle_16.png';
		var div = document.createElement('div');
		div.style.padding = '20px';

		var img = document.createElement('img');
		img.setAttribute('src', icon || mxUtils.errorImage);
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		//div.appendChild(img);

		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		if(convertMessage)
			mxUtils.write(div, message);
		else{
			div.appendChild(message);
		}
		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(mxResources.get('error.error'), div, xPos, yPos, width, null,
			false, true);

		if (close)
		{
			mxUtils.br(div);
			
			var tmp = document.createElement('p');
			var button = document.createElement('button');

			if (mxClient.IS_IE)
			{
				button.style.cssText = 'float:right';
			}
			else
			{
				button.setAttribute('style', 'float:right');
				button.setAttribute('class', "button");
			}
		
			$(button).on('click', function(){
				
				warn.destroy();
				$("#modalMask").hide();							
			});

			mxUtils.write(button, mxResources.get('label.close'));
			
			tmp.appendChild(button);
			div.appendChild(tmp);
			
			mxUtils.br(div);
			
			warn.setClosable(true);
		}
		
		warn.setVisible(true);
		$('#modalMask').fadeTo("fast",0.5);
		
		return warn;
	};
	
	
	/**
	 * Function: confirm
	 * 
	 * Overrides function to show errors in a mxWindow instead of a browser 
	 * dialog.
	 */
	mxUtils.showConfirm = function(message, width, close,xPos, yPos, callback )
	{
		var acceptPopup = false;
		var div = document.createElement('div');
		div.style.padding = '10px';
	
		var img = document.createElement('img');
		img.setAttribute('src', 'plmlib/mxGraph/images/icons/warning_16.png');
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		div.appendChild(img);
				
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		mxUtils.write(div, message);

		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(mxResources.get('confirm'), div, xPos, yPos, width, null,
			false, true, 'mxWindow2');

		if (close)
		{
			mxUtils.br(div);
			
			var tmp = document.createElement('p');
			var button = document.createElement('button');
			var buttonAccept = document.createElement('button');
			
			if (mxClient.IS_IE)
			{
				button.style.cssText = 'float:right';
				buttonAccept.style.cssText = 'float:right';
			}
			else
			{
				button.setAttribute('style', 'float:right');
				button.setAttribute('id', 'btn_close');
				
				buttonAccept.setAttribute('style', 'float:right');
				buttonAccept.setAttribute('id', 'btn_accept');
				
			}

					
			$(button).on('click', function(){
				
				warn.destroy();
				$('#modalMask').hide();										
			});
						
			$(buttonAccept).on('click' , function(){
				
				acceptPopup = true;
				callback(acceptPopup);
				warn.destroy();				
											
			});

			mxUtils.write(buttonAccept, mxResources.get('accept'));
			mxUtils.write(button, mxResources.get('cancel'));
			tmp.appendChild(button);
			tmp.appendChild(buttonAccept);
			
			div.appendChild(tmp);
			
			mxUtils.br(div);
			
			warn.setClosable(true);
		}
		
				
		warn.setVisible(true);
		
		var dialog = document.getElementsByClassName('mxWindow');
				
		return warn;
		
	};
	
	/**
	 * TODO: consider merging the 2
	 * Function: confirm
	 * 
	 * Overrides function to show errors in a mxWindow instead of a browser 
	 * dialog.
	 */
	mxUtils.confirm = function(title, message, width, close, button1text, button2text, button3text, showButton2, callback)
	{
		var acceptPopup = false;
		var div = document.createElement('div');
		div.style.padding = '20px';
	
		var img = document.createElement('img');
		img.setAttribute('src', 'plmlib/mxGraph/images/icons/warning_16.png');
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		div.appendChild(img);
				
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		mxUtils.write(div, message);

		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(title, div, (w-width)/2, h/4, width, null,
			false, true, 'mxWindow2');

		if (close)
		{
			mxUtils.br(div);
			
			var tmp = document.createElement('p');
			var button = document.createElement('button');
			var buttonAccept = document.createElement('button');
			var buttonReject = document.createElement('button');
			
			if (mxClient.IS_IE)
			{
				button.style.cssText = 'float:right';
				buttonAccept.style.cssText = 'float:right';
				buttonReject.style.cssText = 'float:right';
			}
			else
			{
				button.setAttribute('style', 'float:right');
				button.setAttribute('id', 'btn_close');
				buttonAccept.setAttribute('style', 'float:right');
				buttonAccept.setAttribute('id', 'btn_accept');
				buttonReject.setAttribute('style', 'float:right');
				buttonReject.setAttribute('id', 'btn_reject');
			}

			mxEvent.addListener(button, 'click', function(evt)
			{
				warn.destroy();
			});
			mxEvent.addListener(buttonAccept, 'click', function(evt)
			{
				acceptPopup = true;
				callback(acceptPopup);
				warn.destroy();
				
			});
			mxEvent.addListener(buttonReject, 'click', function(evt)
			{
				acceptPopup = false;
				callback(acceptPopup);
				warn.destroy();
				
			});

			mxUtils.write(buttonAccept, button1text);
			mxUtils.write(buttonReject, button2text);
			mxUtils.write(button, button3text);
			tmp.appendChild(button);
			if(showButton2){
				tmp.appendChild(buttonReject);
			}
			tmp.appendChild(buttonAccept);
			
			div.appendChild(tmp);
			
			mxUtils.br(div);
			
			warn.setClosable(true);
		}
		
		
				
		warn.setVisible(true);
		
		var dialog = document.getElementsByClassName('mxWindow');
				
		return warn;
		
	};
	
	/**
	 * Function: getEdgeStyle
	 * 
	 * Overrides function to avoid using a different style for loop 
	 * transitions.
	 */
	mxGraphView.prototype.getEdgeStyle = function(edge, points, source, target)
	{
		var edgeStyle = (!mxUtils.getValue(
				edge.style,  mxConstants.STYLE_NOEDGESTYLE, false
			) ?
			edge.style[mxConstants.STYLE_EDGE] :
			null);
	
		// Converts string values to objects
		if (typeof(edgeStyle) == "string")
		{
			var tmp = mxStyleRegistry.getValue(edgeStyle);
			
			if (tmp == null && this.isAllowEval())
			{
	 			tmp = mxUtils.eval(edgeStyle);
			}
			
			edgeStyle = tmp;
		}
		
		if (typeof(edgeStyle) == "function")
		{
			return edgeStyle;
		}
		
		return null;
	};


	/**
	 * Function: createMarker
	 * 
	 * Overrides function to allow changing the target for an existing 
	 * edge, even when allowDanglingEdges is true.
	 */
	mxEdgeHandler.prototype.createMarker = function()
	{
		var marker = new mxCellMarker(this.graph);
		var self = this; // closure
	
		// Only returns edges if they are connectable and never returns
		// the edge that is currently being modified
		marker.getCell = function(me)
		{
			var cell = mxCellMarker.prototype.getCell.apply(this, arguments);
	
			if (!self.isConnectableCell(cell))
			{
				return null;
			}
			
			var model = self.graph.getModel();
			
			if (cell == self.state.cell || (cell != null &&
				!self.graph.connectableEdges && model.isEdge(cell)))
			{
				cell = null;
			}
			
			return cell;
		};
	
		// Sets the highlight color according to validateConnection
		marker.isValidState = function(state)
		{
			var model = self.graph.getModel();
			var otherCell = model.getTerminal(self.state.cell, !self.isSource);
			var source = (self.isSource) ? state.cell : otherCell;
			var target = (self.isSource) ? otherCell : state.cell;
			
			// Updates the error message of the handler
			self.error = self.validateConnection(source, target);
	
			return self.error == null;
		};
		
		return marker;
	};
	
	/**
	 * Function: isAddPointEvent
	 * 
	 * Overrides function to use Control instead of Shift for creating new 
	 * elbow points on a transition.
	 */
	mxEdgeHandler.prototype.isAddPointEvent = function(evt) 
	{
		return mxEvent.isControlDown(evt);
	};		
	
	/**
	 * Function: isRemovePointEvent
	 * 
	 * Overrides function to use Control instead of Shift for deleting 
	 * elbow points on a transition.
	 */
	mxEdgeHandler.prototype.isRemovePointEvent = function(evt) 
	{
		return mxEvent.isControlDown(evt);
	};
		
	/**
	 * Function: getAtt
	 * 
	 * Finds an attribute object by name for the current cell. 
	 */
	mxCell.prototype.getAtt = function(name) 
	{
		return this.value.attributes.getNamedItem(name);
	}

	mxCell.errors = [];
	
	/**
	 * Function: clearErrors
	 * 
	 * Removes all the error messages from the local array.
	 */
	mxCell.prototype.clearErrors = function() 
	{
		this.errors = [];
	}
	
	mxCell.prototype.setErrors = function(errors) 
	{
		this.errors = errors;
	}
	
	mxCell.prototype.getErrors = function() 
	{
		return this.errors;
	}

	/**
	 * Function: update
	 * 
	 * Overrides function to fix bug on SVG size.
	 */
	mxOutline.prototype.update = function(revalidate)
	{
		var sourceScale = this.source.view.scale;
		var scaledGraphBounds = this.source.getGraphBounds();
		var unscaledGraphBounds = new mxRectangle(scaledGraphBounds.x / sourceScale,
				scaledGraphBounds.y / sourceScale, scaledGraphBounds.width / sourceScale,
				scaledGraphBounds.height / sourceScale);
	
		var x0 = Math.min(0, unscaledGraphBounds.x);
		var y0 = Math.min(0, unscaledGraphBounds.y);
		var unscaledFinderBounds = new mxRectangle(-x0, -y0,
			this.source.container.clientWidth / sourceScale,
			this.source.container.clientHeight / sourceScale);
		
		var union = unscaledGraphBounds;
		union.add(unscaledFinderBounds);
	
		// Zooms to the scrollable area if that is bigger than the graph
		var completeWidth = Math.max(this.source.container.scrollWidth / sourceScale, union.width + union.x);
		var completeHeight = Math.max(this.source.container.scrollHeight/ sourceScale, union.height + union.y);
	
		var availableWidth = Math.max(0, this.outline.container.clientWidth - this.border);
		var availableHeight = Math.max(0, this.outline.container.clientHeight - this.border);
		
		var outlineScale = Math.min(availableWidth / completeWidth, availableHeight / completeHeight);
		var scale = outlineScale;
		
		if (scale > 0)
		{
			if (this.outline.getView().scale != scale)
			{
				this.outline.getView().scale = scale;
				revalidate = true;
			}
		
			var navView = this.outline.getView();
			
			if (navView.currentRoot != this.source.getView().currentRoot)
			{
				navView.setCurrentRoot(this.source.getView().currentRoot);
			}
			
			var t = this.source.view.translate;
			var tx = t.x;
			var ty = t.y;
			
			if (unscaledGraphBounds.x < 0)
			{
				tx = t.x - unscaledGraphBounds.x;
			}
			if (unscaledGraphBounds.y < 0)
			{
				ty = t.y - unscaledGraphBounds.y;
			}
			
			if (navView.translate.x != tx ||
					navView.translate.y != ty)
			{
				navView.translate.x = tx;
				navView.translate.y = ty;
				revalidate = true;
			}
		
			// Prepares local variables for computations
			var t2 = navView.translate;
			var scale = this.source.getView().scale;
			var scale2 = scale / navView.scale;
			var scale3 = 1.0 / navView.scale;
			var container = this.source.container;
			
			// Updates the bounds of the viewrect in the navigation
			this.bounds = new mxRectangle(
				(t2.x - t.x) / scale3,
				(t2.y - t.y) / scale3,
				(container.clientWidth / scale2),
				(container.clientHeight / scale2));
			
			// Adds the scrollbar offset to the finder
			this.bounds.x += this.source.container.scrollLeft * navView.scale / scale;
			this.bounds.y += this.source.container.scrollTop * navView.scale / scale;
			
			this.selectionBorder.bounds = this.bounds;
			this.selectionBorder.redraw();

			// Updates the bounds of the zoom handle at the bottom right
			var b = this.sizer.bounds;
			this.sizer.bounds = new mxRectangle(this.bounds.x + this.bounds.width - b.width / 2,
				this.bounds.y + this.bounds.height - b.height / 2, b.width, b.height);
			this.sizer.redraw();
			
			if (revalidate)
			{
				this.outline.view.revalidate();
			}
			
			//SVG DIMENSIONS FIX
			var container = this.outline.container;
			var root = this.outline.getView().getDrawPane().ownerSVGElement;
			root.setAttribute('width', container.offsetWidth);
			root.setAttribute('height', container.offsetHeight);
		
		}
	};

	/**
	 * Function: moveLabel
	 * 
	 * Overrides function to fix dragging of absolute-positioned labels.
	 */
	mxEdgeHandler.prototype.moveLabel = function(edgeState, x, y)
	{
		var model = this.graph.getModel();
		var geometry = model.getGeometry(edgeState.cell);
		
		if (geometry != null)
		{
			geometry = geometry.clone();
			
			if (geometry.relative)
			{
				// Resets the relative location stored inside the geometry
				var pt = this.graph.getView().getRelativePoint(edgeState, x, y);
				geometry.x = pt.x;
				geometry.y = pt.y;
				
				// Resets the offset inside the geometry to find the offset
				// from the resulting point
				var scale = this.graph.getView().scale;
				geometry.offset = new mxPoint(0, 0);
				var pt = this.graph.view.getPoint(edgeState, geometry);
				geometry.offset = new mxPoint((x - pt.x) / scale, (y - pt.y) / scale);
		
				model.setGeometry(edgeState.cell, geometry);
			}
			else
			{
				geometry.offset = calculateLabelAbsolutePosition(edgeState, x, y, false);
				model.setGeometry(edgeState.cell, geometry);
			}
		}
	};

	/**
	 * Function: calculateLabelAbsolutePosition
	 * 
	 * Finds out what is the absolute position from the center of the 
	 * given transition (edgeState) and returns it as an mxPoint.
	 */
	function calculateLabelAbsolutePosition(edgeState, x, y, centerLabel) 
	{
		var bb = edgeState.text.boundingBox;
		var labelCenterX = 0;
		var labelCenterY = 0;
		if (centerLabel) 
		{
			labelCenterX = Math.round(bb.width / 2);
			labelCenterY = Math.round(bb.height / 2);
		}

		var pointCount = edgeState.absolutePoints.length;
		var p0 = edgeState.absolutePoints[0];
		var pe = edgeState.absolutePoints[pointCount - 1];
		edgeCenterX = (pe.x - p0.x) / 2 - (edgeState.x - p0.x);
		edgeCenterY = (pe.y - p0.y) / 2 - (edgeState.y - p0.y);
		
		x -= edgeState.x + edgeCenterX - labelCenterX;
		y -= edgeState.y + edgeCenterY - labelCenterY;
		return new mxPoint(Math.round(x), Math.round(y));
	}
	
	var mxCellRendererInitializeShape = mxCellRenderer.prototype.initializeShape;
	mxCellRenderer.prototype.initializeShape = function(state)
	{
	  mxCellRendererInitializeShape.apply(this, arguments);
	
	  if (state.shape.node != null && state.cell.id != null)
	  {
	    state.shape.node.setAttribute('id', 'shape-' + state.cell.id);
	  }
	};
	
	var mxCellRendererInitializeLabel = mxCellRenderer.prototype.initializeLabel;
	mxCellRenderer.prototype.initializeLabel = function(state)
	{
	  mxCellRendererInitializeLabel.apply(this, arguments);
	
	  if (state.text.node != null && state.cell.id != null)
	  {
	    state.text.node.setAttribute('id', 'label-' + state.cell.id);
	  }
	  
	  mxConnectionHandler.prototype.createIcons = function(state)
		{
			var image = this.getConnectImage(state);
			
			if (image != null && state != null)
			{
				this.iconState = state;
				var icons = [];
		
				// Cannot use HTML for the connect icons because the icon receives all
				// mouse move events in IE, must use VML and SVG instead even if the
				// connect-icon appears behind the selection border and the selection
				// border consumes the events before the icon gets a chance
				var bounds = new mxRectangle(0, 0, image.width, image.height);
				var icon = new mxImageShape(bounds, image.src, null, null, 0);
				icon.preserveImageAspect = false;
				
				if (this.isMoveIconToFrontForState(state))
				{
					icon.dialect = mxConstants.DIALECT_STRICTHTML;
					icon.init(this.graph.container);
				}
				else
				{
					icon.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ?
						mxConstants.DIALECT_SVG :
						mxConstants.DIALECT_VML;
					icon.init(this.graph.getView().getOverlayPane());
		
					// Move the icon back in the overlay pane
					if (this.moveIconBack && icon.node.previousSibling != null)
					{
						icon.node.parentNode.insertBefore(icon.node, icon.node.parentNode.firstChild);
					}
				}
		
				icon.node.setAttribute('id', 'icon_' + state.cell.id); 
				icon.node.style.cursor = mxConstants.CURSOR_CONNECT;
		
				// Events transparency
				var getState = mxUtils.bind(this, function()
				{
					return (this.currentState != null) ? this.currentState : state;
				});
				
				// Updates the local icon before firing the mouse down event.
				var mouseDown = mxUtils.bind(this, function(evt)
				{
					if (!mxEvent.isConsumed(evt))
					{
						this.icon = icon;
						this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN,
							new mxMouseEvent(evt, getState()));
					}
				});
		
				mxEvent.redirectMouseEvents(icon.node, this.graph, getState, mouseDown);
				
				icons.push(icon);
				this.redrawIcons(icons, this.iconState);
				
				return icons;
			}
			
			return null;
		};
	};
	
	
	/**
	 * Function: getEditorBounds
	 * 
	 * Overrides function to fit the textarea to the note's shape.
	 */
	mxCellEditor.prototype.getEditorBounds = function(state)
	{
		var isEdge = this.graph.getModel().isEdge(state.cell);
		var scale = this.graph.getView().scale;
	 	var minHeight = 10;
		var minWidth = 10;
		
		var spacing = parseInt(state.style[mxConstants.STYLE_SPACING] || 2) * scale;
		var spacingTop = (parseInt(state.style[mxConstants.STYLE_SPACING_TOP] || 0)) * scale + spacing;
		var spacingRight = (parseInt(state.style[mxConstants.STYLE_SPACING_RIGHT] || 0)) * scale + spacing;
		var spacingBottom = (parseInt(state.style[mxConstants.STYLE_SPACING_BOTTOM] || 0)) * scale + spacing;
		var spacingLeft = (parseInt(state.style[mxConstants.STYLE_SPACING_LEFT] || 0)) * scale + spacing;

	 	var result = new mxRectangle(state.x, state.y,
	 		 Math.max(minWidth, state.width - spacingLeft - spacingRight),
	 		 Math.max(minHeight, state.height - spacingTop - spacingBottom));

		if (isEdge)
		{
			result.x = state.absoluteOffset.x;
			result.y = state.absoluteOffset.y;

			if (state.text != null && state.text.boundingBox != null)
			{
				if (state.text.boundingBox.x > 0)
				{
					result.x = state.text.boundingBox.x;
				}
				
				if (state.text.boundingBox.y > 0)
				{
					result.y = state.text.boundingBox.y;
				}
			}
		}
		else if (state.text != null && state.text.boundingBox != null)
		{
			result.x = Math.min(result.x, state.text.boundingBox.x);
			result.y = Math.min(result.y, state.text.boundingBox.y);
		}

		result.x += spacingLeft;
		result.y += spacingTop;

		if (state.text != null && state.text.boundingBox != null)
		{
			if (!isEdge)
			{
				//result.width = Math.max(result.width, state.text.boundingBox.width);
				//result.height = Math.max(result.height, state.text.boundingBox.height);
				
				// Fix for padding
				result.width -= (mxClient.IS_MT ? 4 : 6) / (1 / scale);
				result.height -= 10 / (1 / scale);
			}
			else
			{
				result.width = Math.max(minWidth, state.text.boundingBox.width);
				result.height = Math.max(minHeight, state.text.boundingBox.height);
			}
		}
		
		if (this.graph.getModel().isVertex(state.cell))
		{
			var horizontal = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);

			if (horizontal == mxConstants.ALIGN_LEFT)
			{
				result.x -= state.width;
			}
			else if (horizontal == mxConstants.ALIGN_RIGHT)
			{
				result.x += state.width;
			}

			var vertical = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

			if (vertical == mxConstants.ALIGN_TOP)
			{
				result.y -= state.height;
			}
			else if (vertical == mxConstants.ALIGN_BOTTOM)
			{
				result.y += state.height;
			}
		}
		
		return result;
	};
	
	
	/**
	 * Function: updateTableWidth
	 * 
	 * Overrides function to properly adjust long words wrapping inside 
	 * the table cell.
	 */
	mxText.prototype.updateTableWidth = function(table)
	{
		var td = table.firstChild.firstChild.firstChild;
	
		if (this.wrap && this.bounds.width > 0 && this.dialect != mxConstants.DIALECT_SVG)
		{
			var space = ((this.horizontal || mxUtils.isVml(this.node)) ?
					this.bounds.width : this.bounds.height) / this.scale;
			
			if (mxClient.IS_OP)
			{
				space *= this.scale;
			}

			table.style.width = Math.round(space) + 'px';
		}
		else
		{
			table.style.width = '';
		}

		if (!this.wrap)
		{
			td.style.whiteSpace = 'nowrap';
		}
		else
		{
			//Fix for long words
			table.style.tableLayout = 'fixed';
			td.style.whiteSpace = 'normal';
			td.style.wordWrap = 'break-word';
			
			if(mxClient.IS_SVG)
			{
				td.style.wordBreak = 'hyphenate';
				
			}
		}
	};
	
}

window.jQuery = window.$;

(function($) {
	
	$.fn.enable = function(enable) {
		return this.each(function() {
			var $this = $(this);
			if (enable == 'undefined') {
				return $this.attributeHas(attribute);
			}
			
			if (enable) { 
				$this.removeAttr('disabled');
				$this.removeClass('disabled');
			} else {
				$this.attr('disabled', 'disabled');
				$this.addClass('disabled');
			}
		});
	}
		
	
})(jQuery);

/**
 * Function: ISODateString
 * 
 * Converts the given date into a ISO8601 timestamp.
 */
function ISODateString(date) {
	
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	
	return date.getUTCFullYear() + '-'
		+ pad(date.getUTCMonth() + 1) + '-'
		+ pad(date.getUTCDate()) + 'T'
		+ pad(date.getUTCHours()) + ':'
		+ pad(date.getUTCMinutes()) + ':'
		+ pad(date.getUTCSeconds()) + 'Z';
}

function permissionsWithUnsavedChanges(){
	var changes = false;
	if(mxConstants.permissions.length != mxConstants.permissionsOnDB.length)
		return true;
	$.each(mxConstants.permissions,function(){
		var permission = this;
		var permissionId = String(permission.permissionID);
		if(permissionId.indexOf("@") > -1){
			changes = true;
			return false;
		}
		else{
			$.each(mxConstants.permissionsOnDB,function(){
				if(this.permissionID == permission.permissionID){
					changes = 	this.shortName != permission.shortName || this.longName != permission.longName;
					if(changes){
						return false;
					}
				}
			})
			if(changes)
				return false;
		}
	});
	return changes;
}

/**
 * Function: generateCustomID
 * 
 * Generates an unique CustomID for the given cell shortName. Examples:
 * shortName = 'Ab C1-2ñ+d_e' 	=> 'AB_C12D_E',
 * shortName = 'Ab C12_e' 		=> 'AB_C12D_E_2',
 * shortName = '"|?$.#*' 		=> '1',
 */
function generateCustomID(allCells, shortName, cellId) {
	if (shortName == null || shortName.length == 0) {
		return '';
	}
	
	var customID = shortName
		.replaceAll(' ', '_')
		.replace(/[^a-zA-Z0-9_ ]+/g, '')
		.toUpperCase();
	
	customID = makeUniqueCustomID(allCells, customID, cellId);
	return customID;
}

/**
 * Function: makeUniqueCustomID
 * 
 * Given a generated CustomID, it runs through all the given cells
 * looking for repeated IDs adding an underscore and a counter
 * if the ID already exists.
 */
function makeUniqueCustomID(allCells, customID, cellId) {
	var index = findCustomIDIndex(allCells, customID, cellId);
	if (index > 0 || customID.length == 0) {
		if (customID.length > 0) {
			customID += '_';
		}
		customID += (index + 1);
	}
	return customID;
}

/**
 * Function: findCellsByCustomID
 * 
 * Looks for transitions with an equal customID and a different ID of 
 * the given cellId in the cells array.
 */
function findCellsByCustomID(cells, customID, cellId) {
	for (var i in cells) {
		var cell = cells[i];
		var cellCustomID = cell.getAttribute('customID');
		if (cellCustomID != null) {
			var match1 = cellCustomID.match('^' + customID + '$');
			var match2 = cellCustomID.match('^' + customID + '[0-9]+$');
			if (match1 || (customID.length == 0 && match2)) {
				if (cellId == null || (cellId != null && cellId != cell.id)) {
					return true;
				}
			}
		}
	}
}

/**
 * Function: findCustomIDIndex
 * 
 * Extracts the highest sub-index for the cells with the same customID 
 * prefix in the given cells array.
 */
function findCustomIDIndex(cells, customID, cellId) {
	var index = 0;
	
	if (findCellsByCustomID(cells, customID, cellId)) {
		for (var i in cells) {
			var cell = cells[i];
			var cellCustomID = cell.getAttribute('customID');
			if (cellCustomID != null) {
				var match = cellCustomID.match('^' + customID + '(_?([0-9]+))?$');
				if (match != null && match.length > 0) {
					if (cellId == null || (cellId != null && cellId != cell.id)) {
						if (index == 0) {
							index = 1;
						}
						if (index < match[2]) {
							index = parseFloat(match[2]);
						}
					}
				}
			}
		}
	}
	return index;
}

