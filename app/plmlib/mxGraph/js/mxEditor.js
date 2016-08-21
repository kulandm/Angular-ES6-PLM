/*
 * Defines the editor custom behavior for this particular application.
 * 
 * @author: Ismael Machado
 *
 */
{

	//Specifies if the properties dialog should be automatically hidden.
	mxEditor.prototype.dontHideProperties = false;

	//Specifies if the properties dialog should be automatically
	//moved near the cell it is displayed for.
	mxEditor.prototype.movePropertiesDialog = true;
	
	/**
	 * Function: configure
	 * 
	 * Overrides function to define the statusbar container before 
	 * decoding it from the XML file.
	 */
	mxEditor.prototype.configure = function (node)
	{
		if (node != null)
		{
			var status = document.getElementById('mxStatus');
			if (status != undefined) {
				this.statusbar = new mxDefaultStatusbar(status, this);
			}
			
			// Creates a decoder for the XML data
			// and uses it to configure the editor
			var dec = new mxCodec(node.ownerDocument);
			dec.decode(node, this);
			
			// Resets the counters, modified state and
			// command history
			this.resetHistory();
		}
	};
	
	/**
	 * Function: createProperties
	 * 
	 * Shows a custom form for the select cell.
	 */
	mxEditor.prototype.createProperties = function (cell)
	{
		var graph = this.graph;
		
		// Forces focusout in IE
		graph.container.focus();

		var tagName = cell.value.tagName;
		
		if (cell.id != 'init-cell' && tagName != 'edgeNote') {
			
			// Creates the form from the attributes of the user object
			var form = new mxForm('properties');
			var attrs = cell.value.attributes;
			
			if (attrs != undefined && attrs.length > 0) {

				// creates tabs for the state properties panel (and transition properties panel)
				var createTabbedNavigation = function() {
					//create content in tabs
					var generalForm = new mxForm('generalform');
					var escalationForm = new mxForm('escalationform');
					if (tagName == 'state') {
						createStateForm(graph, generalForm, cell, tagName);
					} else if (tagName == 'transition') {
						createTransitionForm(graph, generalForm, cell, tagName);
					};
					
					var tr = $(document.createElement('tr'));
					var td = $(document.createElement('td'));
					$(form.body).append(tr);
					tr.append(td);
					
					var tabHandler = function(e){
						$('.generalTab').removeClass('generalTab_selected');
						$(this).addClass('generalTab_selected');
						$('.generalTabCont').removeClass('generalTabCont_selected');
						$('#'+$(this).attr('__tabid')).addClass('generalTabCont_selected');

						e.preventDefault();
						e.stopPropagation();

					};
					
					//create tabs
					var tabcont = $(document.createElement('div')).addClass('generalTabContainer').appendTo(td);
					$(document.createElement('div')).addClass('generalTab generalTab_selected').attr('__tabid','generalTab').text(_plm.messages.mxworkflow.general()).appendTo(tabcont).on('click',tabHandler);
					if(mxConstants.escalationEnabled){
						$(document.createElement('div')).addClass('generalTab').attr('__tabid','escalationTab').text(_plm.messages.mxworkflow.escalation()).appendTo(tabcont).on('click',tabHandler);
					}
					
					//create tab content containers
					var tabcontentcont = tabcontentcont = $(document.createElement('div')).addClass('generalTabOuterCont').appendTo(td);;
					if (tagName == 'transition') {
						tabcontentcont.addClass('extraHeight');
					};
					$(document.createElement('div')).addClass('generalTabCont generalTabCont_selected').attr('id','generalTab').appendTo(tabcontentcont).append(generalForm.table);
					
					// re-apply this check to display the escalation tab again on the Transition Properties panel
					// if (mxConstants.escalationEnabled) {

					if((mxConstants.escalationEnabled) && (tagName == 'state')){
						var escalationTab = $(document.createElement('div')).addClass('generalTabCont').attr('id','escalationTab').appendTo(tabcontentcont);

						if (tagName == 'state') {
							createEscalationForm(graph, escalationForm, cell, tagName);
						} else if (tagName == 'transition') {
							createEscalatedTransitionForm(graph, escalationForm, cell, tagName);
						};
						escalationTab.append(escalationForm.table);
					}
				};

				if(tagName == 'state') {
					createTabbedNavigation();
				} else if(tagName == 'transition') {
					// only create the tab if the transition has been escalated to on the State Properties panel
					// NOTE: the test should be cell.getAttribute('escalationTransitionEnabled'), but since that attribute
					// is created when createTransitionForm is called (by the same comparison below), it's still not true here (always false)
					// this value should be stored on the database
					//if (cell.getAttribute('permissionID') != cell.getAttribute('escalationPermissionId')) {
					//	createTabbedNavigation();
					//} else {
					// disabled as 2013/01/31 (BF-008699)
					createTransitionForm(graph, form, cell, tagName);
					//}					
				} else if (tagName == 'note') {
					createNoteForm(graph, form, cell, tagName);
				}
			}
	
			var errors = document.createElement('div');
			errors.setAttribute('class', 'cellErrors');
			var td = form.addTableCell(2);
			td.appendChild(errors);
			
			showCellErrors(cell, errors);
			return form.table;
		}
		
		return null;
	}

	/**
	 * Function: execute
	 * 
	 * Overrides function to check if the graph is enable before 
	 * executing any action on it.
	 */
	mxEditor.prototype.execute = function (actionname, cell, evt)
	{
		if (this.graph.isEnabled()) 
		{
			var action = this.actions[actionname];
		
			if (action != null)
			{
				try
				{
					// Creates the array of arguments by replacing the actionname
					// with the editor instance in the args of this function
					var args = arguments;
					args[0] = this;
					
					// Invokes the function on the editor using the args
					action.apply(this, args);
				}
				catch (e)
				{
					mxUtils.error(mxResources.get('action.error.execute') + ' '+  actionname +
						': ' + e.message, 280, true);
					
					throw e;
				}
			}
			else
			{
				mxUtils.error(mxResources.get('action.error.find') + ' ' + actionname, 280, true);
			}
		}
	};
	
	/**
	 * Function: showProperties
	 * 
	 * Overrides function to avoid the properties panel from showing 
	 * outside the canvas.
	 */
	mxEditor.prototype.showProperties = function (cell)
	{
		cell = cell || this.graph.getSelectionCell();
		
		// Uses the root node for the properties dialog
		// if not cell was passed in and no cell is
		// selected
		if (cell == null)
		{
			cell = this.graph.getCurrentRoot();
			
			if (cell == null)
			{
				cell = this.graph.getModel().getRoot();
			}
		}
		
		if (mxSummaryPanel.isVisible())
		{
			mxSummaryPanel.hide();
		}
		
		if (mxPermissionsPanel.isVisible() && !mxPermissionsPanel.hasErrors())
		{
			mxPermissionsPanel.hide();
		}
		
		var tagName = cell.value.tagName;

		if (cell != null && !mxPermissionsPanel.hasErrors())
		{
			// Makes sure there is no in-place editor in the
			// graph and computes the location of the dialog
			this.graph.stopEditing(true);
	
			var offset = mxUtils.getOffset(this.graph.container);
			var x = offset.x+10;
			var y = offset.y;
			var bounds = null;
			
			// Avoids moving the dialog if it is already open
			if (this.properties != null && !this.movePropertiesDialog)
			{
				x = this.properties.getX();
				y = this.properties.getY();
			}
			// Places the dialog near the cell for which it
			// displays the properties
			else
			{
				bounds = this.graph.getCellBounds(cell);
				
				if (bounds != null)
				{
					x += bounds.x + bounds.width;
					y += bounds.y;				
				}			
			}
			
			// Hides the existing properties dialog and creates a new one with the
			// contents created in the hook method
			this.hideProperties();
			var node = this.createProperties(cell);
			
			if (node != null)
			{
				// Displays the contents in a window and stores a reference to the
				// window for later hiding of the window
				var title = mxResources.get(tagName + '.' + tagName) + ' ' + 
					mxResources.get(this.propertiesResource) || this.propertiesResource;
				this.properties = new mxWindow(title, node, x, y, this.propertiesWidth, this.propertiesHeight, false);
				this.properties.setVisible(true);
				this.properties.cell = cell;
				
				var canvas = $("#mxGraph");//this.graph.getBorderSizes();
				var div = $(this.properties.div);
				div.addClass('arrow_box');
				var exceedsWidth = (x + div.width()) > canvas.width();
				var exceedsHeight = (y + div.height()) > canvas.height();
				
				if (exceedsWidth) {
					var left = bounds.x - div.width() - 10;
					if (left < 0) {
						left = bounds.x + (bounds.width - div.width()) / 2;
					}
					div.addClass('arrow_box_right');
					div.css('left', left);
				}
				if (exceedsHeight) {
					var top = bounds.y + bounds.height - div.height();
					if (top < 0) {
						top = bounds.y + (bounds.height - div.height()) / 2;
						if (top < 0 || top + div.height() > canvas.height()) {
							top = 0;
						}
						div.addClass('arrow_box_vcenter');
					} else {
						div.addClass('arrow_box_bottom');
					}
					div.css('top', top);
				}
			}
		}
	};
	
	/**
	 * Function: createEdgeLoop
	 * 
	 * Defines the elbows for transition loops, used for creating and 
	 * reconnecting transitions.
	 */
	mxEditor.prototype.createEdgeLoop = function (cell, source) {
		var model = this.graph.getModel();
		var geo = this.graph.getCellGeometry(cell);
		model.beginUpdate();
		
        try {
        	geo = geo.clone();
			var point1 = new mxPoint(
				source.geometry.x + source.geometry.width + 60,
				source.geometry.y + source.geometry.height / 2 - 20
			);
			var point2 = new mxPoint(
				source.geometry.x + source.geometry.width + 60,
				source.geometry.y + source.geometry.height / 2 + 20
			);
			var points = [point1, point2];
			geo.points = points;
			model.setGeometry(cell, geo);

			var edit = new mxGeometryChange(model, cell, geo);
        	model.execute(edit);
        }
        finally {
        	model.endUpdate();
        }
	}
	
	/**
	 * Function: createEdge
	 * 
	 * Overrides function to add custom elbow points to loop transitions.
	 */
	mxEditor.prototype.createEdge = function (source, target)
	{
		// Clones the defaultedge prototype
		var e = null;
		
		if (this.defaultEdge != null)
		{
			var model = this.graph.getModel();
			e = model.cloneCell(this.defaultEdge);
		}
		else
		{
			e = new mxCell('');
			e.setEdge(true);
			
			var geo = new mxGeometry();
			geo.relative = true;
			e.setGeometry(geo);
		}
		
		// Overrides the edge style
		var style = this.getEdgeStyle();
		
		if (style != null)
		{
			e.setStyle(style);
		}
		
		//Creation of transition loops
		if (source == target) {
			var model = this.graph.getModel();
			var cell = e;
			this.createEdgeLoop(e, source);
		}
		
		return e;
	};

	/**
	 * Function: setMode
	 * 
	 * Overrides function to reenable the connection anchors inside 
	 * states when going back to Select mode.
	 */
	mxEditor.prototype.setMode = function(modename)
	{
		if (modename == 'select')
		{
			this.graph.panningHandler.useLeftButtonForPanning = false;
			this.graph.setConnectable(true);
			document.body.style.cursor='default';
			document.body.className='default';
		}
		else if (modename == 'connect')
		{
			this.graph.panningHandler.useLeftButtonForPanning = false;
			this.graph.setConnectable(true);
			document.body.style.cursor='default';
			document.body.className='default';
		}
		else if (modename == 'pan')
		{
			this.graph.panningHandler.useLeftButtonForPanning = true;
			this.graph.setConnectable(false);
			//document.body.style.cursor='pointer';
			document.body.className='handCursor';
			
		}
	};

	/**
	 * Function: showOutline
	 * 
	 * Overrides function to show Outline next to the status bar.
	 */
	mxEditor.prototype.showOutline = function ()
	{
		var width = 200;
		var height = 200;
		var create = this.outline == null;
		
		if (create)
		{
			var div = document.createElement('div');
			div.style.overflow = 'hidden';
			div.style.width = '100%';
			div.style.height = '100%';
			div.style.background = 'white';
			div.style.cursor = 'move';
			
			var y = $('#mxStatus').offset().top - height - 1;
			
			var wnd = new mxWindow(
				mxResources.get(this.outlineResource) ||
				this.outlineResource,
				div, 0, y, width, height, false);
					
			// Creates the outline in the specified div
			// and links it to the existing graph
			var outline = new mxOutline(this.graph, div);			
			wnd.setClosable(true);
			wnd.setResizable(true);
			wnd.destroyOnClose = false;
			
			wnd.addListener(mxEvent.RESIZE_END, function()
			{
				outline.update();
			});
			
			this.outline = wnd;
			this.outline.outline = outline;
		}
		
		// Finally shows the outline
		this.outline.setVisible(true);
		this.outline.outline.update(true);
	};

}
