/*
 * Defines the startup sequence of the wf map viewer.
 * 
 * @author: Gabriel Yaffe
 *
 */
//{
	//mxWindow.prototype.closeImage='/images/icons/clearitem_16.png';

	var changeStateWidgetObj = null;

	

	function drawInitState(x, y, graph) {
		var initStateTemplate = editor.templates.initstate.clone();
		var cell = graph.insertVertex(
			graph.getDefaultParent(),
			"init-cell",
			initStateTemplate.value,
			Number(x),
			Number(y),
			45, 31, "ellipse"
		);
	
		configureStylesheetForNoneSVG(graph);
	}
	
	/**
	 * Function: configureStylesheetForNoneSVG
	 * 
	 * We call this method to change the initial state icon for non SVG browsers
	 * 
	 */
	function configureStylesheetForNoneSVG(graph)
	{		
			if(!mxClient.IS_SVG){	
				var style = new Object();
			
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
				style[mxConstants.STYLE_IMAGE] = '/scripts/mxGraph/images/workflow/start.png';
				style[mxConstants.STYLE_DELETABLE] = '0';
				graph.getStylesheet().putCellStyle('ellipse', style);
			} 			
			
	};

	
	function drawStates(states, graph) {
		if (states != undefined) {
			function getProps(cell){
				var param = {"eventCategory":"WORKFLOW","resourceId":formatCellId(cell.id)};
				$.ajax({
					url: "/api/v2/schedulers/eventCategory/WORKFLOW/resource/"+formatCellId(cell.id),
					type:"GET",
					dataType:"json",
					contentType:"application/json",
					success:function(data){
						if(data.length > 0){
							for(var j=0;j<data.length;j++){
								var datum = data[j];
								if(datum.eventType=='WF_REMINDER'){
									mxConstants.reminderEventIds[formatCellId(cell.id)] = datum.id;
									if(!mxConstants.reminderEvents[formatCellId(cell.id)]){
										mxConstants.reminderEvents[formatCellId(cell.id)] = new Object();
									}
									mxConstants.reminderEvents[formatCellId(cell.id)][datum.id] = datum;
									cell.setAttribute('reminderNotifications',"true");
									cell.setAttribute('reminderRepeat',datum.runCount);
									cell.setAttribute('reminderInterval',parseInt(datum.repeatInterval)/86400);
									cell.setAttribute('reminderIncludeWeekends',(datum.scheduleMask=="skipWeekends"?"false":"true"));
								}else{
									mxConstants.escalationEventIds[formatCellId(cell.id)] = datum.id;
									if(!mxConstants.escalationEvents[formatCellId(cell.id)]){
										mxConstants.escalationEvents[formatCellId(cell.id)] = new Object();
									}
									mxConstants.escalationEvents[formatCellId(cell.id)][datum.id] = datum;
									cell.setAttribute('escalationEnabled',"true");
									cell.setAttribute('includeWeekends',(datum.scheduleMask=="skipWeekends"?"false":"true"));
									cell.setAttribute('escalationDelay',parseInt(datum.startDelay)/86400);
									var settings = datum.settings;
									switch(datum.eventType){
									// case 'WF_ADD_OWNERS':
									// 	var users = new Array();
									// 	cell.setAttribute('action',2);
									// 	for(var i=0;i<settings.length;i++){
									// 		if(settings[i].name=='user'){
									// 			users.push('u'+settings[i].value);
									// 		}else if(settings[i].name=='group'){
									// 			users.push('g'+settings[i].value);
									// 		}
									// 	}
									// 	cell.setAttribute('notify',users.join(','));
									// 	break;
									case 'WF_ESCALATION':
										cell.setAttribute('action',2);
										cell.setAttribute('transition','');
										cell.setAttribute('escalationScript','');
										cell.setAttribute('escalationNotify','');
										cell.setAttribute('escalationNotifyAll',datum.notify);
										break;
									case 'WF_TRANSITION':
										cell.setAttribute('action',3);
										cell.setAttribute('transition',settings[0].value);
										cell.setAttribute('escalationNotify',datum.notify);
										break;
									case 'WF_SCRIPT':
										cell.setAttribute('action',4);
										cell.setAttribute('escalationScript',settings[0].value);
										cell.setAttribute('escalationNotify',datum.notify);
										break;
									}
								}
							}
						}
						showStateOverlays(graph,cell);
					},
					fail:function(){
						
					}
				});
			}
			for (var i = 0; i < states.length; i++) {
				state = states[i];
				
				var style = 'defaultVertex';
				
				if (editor.currentState == state.stateID) {
					style = 'currentVertex';
				}

				if (state.hidden) {
					continue;
				}
				
				var stateTemplate = editor.templates.state.clone();
										
				var cell = graph.insertVertex(
					graph.getDefaultParent(),
					"state_" + state.stateID,
					stateTemplate.value,
					state.coordinateX,
					state.coordinateY,
					state.width,
					state.height, 
					style 
				);
				for (property in state) {
					cell.setAttribute(property, state[property]);
				}
				
				getProps(cell);
								
				if((mxClient.IS_IE && !mxClient.IS_SVG) && editor.isMap){
					var x = 0;
					if (state.reminderNotifications) {
						addStateOverlay(graph, state, 'notifications.svg', 'state.reminderNotifications', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.escalationEnabled) {
						addStateOverlay(graph, state, 'escalations.svg', 'state.escalationEnabledLabel', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.cmStateID) {
						addStateOverlay(graph, cell, 'gears_16.svg', 'state.cmStateID', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.lockStateID) {
						addStateOverlay(graph, cell, 'Locked.svg', 'state.lockStateID', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
					}
				}
				
			}
			
		}
	}
	
	function drawTransitions(transitions, graph) {
		if (transitions != undefined) {
			var cells = [];
			for (var i = 0; i < transitions.length; i++) {
				transition = transitions[i];
				
				isHiddenTransition = false;
				if (transition.hidden) {
					isHiddenTransition = true;
				}
				
				var transitionTemplate = editor.templates.edge.clone();
				
				var sourceState;
				if (transition.fromState == null) {
					sourceState = graph.getModel().getCell("init-cell");
				} else {
					sourceState = graph.getModel().getCell("state_" + transition.fromState.stateID);	
				}
				
				var targetState = graph.getModel().getCell("state_" + transition.toState.stateID);
				var cell = graph.insertEdge(
					graph.getDefaultParent(),
					"transition_" + transition.transitionID,
					transitionTemplate.value,
					sourceState,
					targetState
					
				);				
				if (transition.fromState != null) {
					cell.fromState = transition.fromState.stateID;
				}
				cell.toState = transition.toState.stateID;
				for (property in transition) {
					if (property != "pointsList") {
						cell.setAttribute(property,transition[property]);
					}
				}

				var oldPoints = transition.pointsList;
				if (oldPoints != null) {
					oldPoints = oldPoints.sort(function(p1,p2){return p1.pointID - p2.pointID;});
					var newPoints = [];
					for (var j = 0; j < oldPoints.length; j++) {
						var x = oldPoints[j].coordinateX;
						var y = oldPoints[j].coordinateY;
						newPoints.push(new mxPoint(x,y));
					}
					cell.getGeometry().points = newPoints;
				}
				var customValidator = transition.validatorClassName;
				var customPrecondition = transition.preCondition;
						
				if(isTransitionAvailableForUser(cell.getAttribute('transitionID'))){
					cell.style = "currentEdge";
				}
				else
					cell.style = "edge";
				
				if (isHiddenTransition) {
					cell.style = "hiddenMapEdge";
				}
				
				else
					cells.push(cell);
				
			}
			return cells;
		}
	}
	
	function findCellById(cells, id) {
		for (var i in cells) {
			var cell = cells[i];
			if (cell.id == 'transition_' + id) {
				return cell;
			}
		}
		return null;
	}
	
	/**
	 * Function: drawTransitionsLabels
	 * 
	 * Receives a list of transition objects to read data from and a list 
	 * of drew edge cells to sets its labels positions.
	 */
	function drawTransitionsLabels(transitions, cells, graph) {
		if (transitions != undefined) {
			graph.getModel().beginUpdate();
			
			for (var i in transitions) {
				transition = transitions[i];
				
				if (transition.hidden) {
					continue;
				
				}
				var cell = findCellById(cells, transition.transitionID);
				
				if (cell != null) {
					var edgeState = editor.graph.view.getState(cell, true);
					
					var x = transition.labelPositionA;
					var y = transition.labelPositionB;
					var geometry = graph.getCellGeometry(cell);
	
					if (geometry != null && edgeState.text != null) {
						geometry = geometry.clone();
						geometry.relative = false;
						geometry.offset = calculateLabelAbsolutePosition(edgeState, x, y, true);
						graph.model.setGeometry(cell, geometry);
					}
				}
			}
			graph.getModel().endUpdate();
		}
	}
	
	function drawNotes(notes, graph) {
		if (notes != null) {
			for (var i = 0; i < notes.length; i++) {
				note = notes[i];
				
				var noteTemplate = editor.templates.note.clone();
				var cell = graph.insertVertex(
					graph.getDefaultParent(),
					"note_" + note.noteID,
					noteTemplate.value,
					note.coordinateX,
					note.coordinateY,
					note.width,
					note.height, 'note' 
				);
				
				var style = cell.getStyle();
												
				for (property in note) {
					cell.setAttribute(property,note[property]);
				}
			}
		}
	}
	
	function drawNoteLinks(noteLinks, graph){
		if (noteLinks!=null){
			for (var i = 0; i < noteLinks.length; i++) {
				noteLink = noteLinks[i];
				var noteLinkTemplate = editor.templates.edgeNote.clone();
				
				if (noteLink.sourceTypeNote == true) {
					var sourceElement = graph.getModel().getCell("note_" + noteLink.sourceID);	
					var targetState = graph.getModel().getCell("state_" + noteLink.targetID);
				} else {
					var sourceElement = graph.getModel().getCell("state_" + noteLink.sourceID);	
					var targetState = graph.getModel().getCell("note_" + noteLink.targetID);				
				}
				
				var cell = graph.insertEdge(
					graph.getDefaultParent(),
					"edgeNote_" + noteLink.noteLinkID,
					noteLinkTemplate.value,
					sourceElement,
					targetState
				);
				for (property in noteLink) {
					if (property != "pointsList") {
						cell.setAttribute(property,noteLink[property]);
					}
				}
				cell.style = 'edgeNote';
				points = noteLink.pointsList;
				if (points != null) {
					var Points = [];
					for (var j = 0; j < points.length; j++) {
						var x = points[j].coordinateX;
						var y = points[j].coordinateY;
						Points.push(new mxPoint(x,y));
					}
					cell.getGeometry().points = Points;
				}
			}
		}
	};
	
	
	function parseDocumentAndRender(data) {
		var graph = editor.graph;
		
		graph.getModel().beginUpdate();
		//Clear all elements before rendering the page
		graph.getModel().clear();
		editor.currentState = data.workflowMap.currentStateId;
		var workflow = data.workflowMap.workflow;
		
		//Reset the constants
		mxConstants.historySteps = undefined;
		mxConstants.transitionWithUsers = undefined;
		mxConstants.transitionList = undefined;
		mxConstants.isWFStepOpened = false;
		mxConstants.escalationEnabled = '1';
		
		mxConstants.reminderEventIds = new Object();
		mxConstants.reminderEvents = new Object();
		mxConstants.escalationEventIds = new Object();
		mxConstants.escalationEvents = new Object();
		
		var performersForTransition = data.workflowMap.transitionWithUsers;
		var workflowTransitionList = data.workflowMap.workflowTransList;
					
		if(workflowTransitionList != undefined){
			mxConstants.transitionList = workflowTransitionList;			
		}
		else{
			mxConstants.transitionList = [];
		}
		
		
		mxConstants.showUndo = data.workflowMap.showUndo;
						
		drawInitState(workflow.initialStateX,workflow.initialStateY, graph);
		drawStates(workflow.states, graph);
		drawNotes(workflow.notes, graph);
		drawNoteLinks(workflow.noteLinks, graph);
		var cells = drawTransitions(workflow.transitions, graph);
		graph.getModel().endUpdate();
		
		if(mxClient.IS_SVG){
			showStateOverlays(graph);
		}
		
		drawTransitionsLabels(workflow.transitions, cells, graph);
		
		//$("#nextSteps").empty();
		//$("#historyPanel").empty();
		//appendTransitionDropDown();
		
		//populateTransitionDropDown();
		//doAjaxLoadWorkflowHistoy();
		
		//Removes the spinner
		$('#loader').fadeOut("fast");

		
	};
	
	
	
	/**
	 * This is just for the datacard map preview
	 * 
	 */
	function initDataCardMap(config, mapDmsID, mapWorkspaceID){
		
		try {
			if (!mxClient.isBrowserSupported()) {
				mxUtils.error(mxResources.get('browserNotSupported'), 200,	false);
			} else {

				var node = mxUtils.load(config).getDocumentElement();
				editor = new mxEditor(node);
				var graph = editor.graph;
				graph.setEnabled(false);

				graph.setTooltips(false);
				// Enables HTML labels as wrapping
				graph.htmlLabels = true;
				graph.isWrapping = function(state) {
					return (state.value.tagName != 'transition');
				};

				editor.isMapForPreview = true;
				editor.isMap = true;
				
				doAjaxLoadWorkflow(mapDmsID, mapWorkspaceID);
				mxConstants.actionNumber = 0;

			}
		} catch (e) {
			// Shows an error message if the editor cannot
			// start
			mxUtils.alert(mxResources.get('cannotStartApp')
					+ e.message);
			throw e; // for debugging
		}
	};
	
	/**
	 * Constructs a new application (note that this returns an mxEditor
	 * instance).
	 */
	function initMxWorkflowMap(config, mapDmsID, mapWorkspaceID, scope){
		
		try {
			/*if (!mxClient.isBrowserSupported()) {
				mxUtils.error(mxResources.get('browserNotSupported'), 200, false);
			} else {*/

				//Show the spinner	
				$('#loader').fadeTo("fast");
						
				var node = mxUtils.load(config).getDocumentElement()
				editor = new mxEditor(node);
				var graph = editor.graph;

				editor.__workspaceId = mapWorkspaceID;
				editor.__itemId = mapDmsID;
				editor.__scope = scope;
											
				graph.setCellsResizable(false);
				graph.setCellsMovable(false);
				graph.setCellsEditable(false);
				graph.setCellsSelectable(false);
				graph.setTooltips(false);

				editor.isMapForPreview = true;
				editor.isMap = true;
						
				addMouseListener(graph);
				
				graph.panningHandler.useLeftButtonForPanning = true;
													
					graph.addListener(mxEvent.CLICK, function(sender, evt) {
						
						var cell = evt.getProperty('cell');

						if (cell != null)
						{
							if(cell.style == "currentVertex"){
																				
								var xPos = evt.properties.event.clientX+5;
								var yPos = evt.properties.event.clientY-15;

								doAjaxLoadNextStepPerformers(cell, xPos, yPos);
								
								evt.consume();
							
							}
							
							else{
								if(cell.value.tagName == "transition"){
									if(isTransitionFromState(cell)){
										
										var transitionID = cell.getAttribute("transitionID");
										
										if(cell.style == "currentEdge"){
											var xPos = evt.properties.event.clientX+15;
											var yPos = evt.properties.event.clientY-30;
											var transitionName = cell.getAttribute('shortName');
											//TODO: Plug it into the existing workflow transition widget
											scope.performTransition(transitionID, cell);

											/*_datastay.require(['changeStateWidget','workspaceutil'], function(changeStateWidget,workspaceutil){
												changeStateWidget.setItem($("#current-dms-id").val(), workspaceutil.getWorkspaceID	());
												changeStateWidget.populateTransitionDropDown();
												var content = changeStateWidget.createSaveStepWidget(transitionID);
												openWorkflowStepDialog(xPos, yPos, content, transitionName);
											})*/
											evt.consume();
										}
									}
								}
							}
						}
										
					});
					
				    // Enables HTML labels as wrapping is only available for those
				    graph.htmlLabels = true;
				    graph.isWrapping = function(state) {
				    	return (state.value.tagName != 'transition');
				    };
				    
					editor.isMap = true;
																		
					initButtonsEvent(graph);
					
					mxConstants.actionNumber = 0;
					
					doAjaxLoadWorkflow(mapDmsID, mapWorkspaceID);
									
					editor.addListener(mxEvent.ROOT, function(sender) {	
						window.setTimeout(function() {		
							

							 $(".trigger").click(function(){
								        $(".panel").toggle("fast");
								        $(this).toggleClass("active");
								        return false;
								    });
							 
							
							var transitions = getAllTransitionsAndFilterByCurrentState();
							
							graph.getCursorForCell = function(cell) {
									if (cell != null)
										if ((cell.style == "currentVertex" && transitions.length>0 )
												|| cell.style=="currentEdge" ) {
										
																				
											return 'pointer';
										}
								};
								
																
								var currentCell = sourceState = graph.getModel().getCell("state_" + editor.currentState);
								graph.scrollCellToVisible(currentCell, true);
															
								var undoActionButton = document.getElementById('undo');
								var undoSeparador = $("#undoSeparator");
								var expandStyleName = "expandMarginControl";
													
								if(mxConstants.showUndo)
								{
									
									addRemoveClassOnButtons(expandStyleName);
																	
									$(undoActionButton).show();
									$(undoSeparador).show();
																	
									$(undoActionButton).off('click');
	
									$(undoActionButton).on('click', function(event){
										//Top middle of the screen
										var xPos =  $('#mxGraph').offset().left + $("#mxGraph").width()/2 - 150;
										var yPos = $('#mxGraph').offset().top;
										
										$('#modalMask').fadeTo("fast",0.5);
										mxUtils.showConfirm(mxResources.get('message.confirm.undo'), 300, true, xPos, yPos,  function(acceptPopup)  {
											doAjaxRollbackLastStep();
											$('#modalMask').hide();
										});											
										
									});
								}
								else
									{
									
									addRemoveClassOnButtons(expandStyleName, true);
									
									$(undoActionButton).hide();
									$(undoSeparator).hide();
																	
									}
								
								//TODO:Need to test of Iphone to add this "fix"
								//Problem: conteiner width expanding to svg width
								/*if(mxClient.IS_TOUCH){
									$("#mxGraph").width(800);
								}*/
						
							
						}, 0);
					});
		
			//}
		} catch (e) {
			// Shows an error message if the editor cannot start
			mxUtils.showError(mxResources.get('cannotStartApp'), coordinateX()-150, coordinateY() + ($("#mxGraph").height()/2)-40, true);
			throw e; // for debugging
		}
	};	
	
	
	/**
	 * Function: addRemoveClassOnButtons
	 * 
	 * Function that adds or removes a class passed as arguments to the positioning buttons
	 * 
	 * */
	function addRemoveClassOnButtons(styleName, add){
		
		var zoomInBtn = $("#zoomIn");
		var zoomOutBtn = $("#zoomOut");
		var fitBtn = $("#fit");
		var centerScreenBtn = $("#centerCurrent");
		
		if(add){
			
			$(zoomInBtn).addClass(styleName);
			$(zoomOutBtn).addClass(styleName);
			$(fitBtn).addClass(styleName);
			$(centerScreenBtn).addClass(styleName);
		}
		
		else
			{
			
			$(zoomInBtn).removeClass(styleName);
			$(zoomOutBtn).removeClass(styleName);
			$(fitBtn).removeClass(styleName);
			$(centerScreenBtn).removeClass(styleName);
		
		}
	}
	
	/**
	 * Function: openWorkflowStepDialog
	 * 
	 * Called when selecting an element from the dropdown list or when clicking on a transition
	 * 
	 * */
	function openWorkflowStepDialog(xPos, yPos, content, transitionName, transitionID){
		
		//Show panel if hidden
		var isPanelHidden= !$("#rightNavContent").is(':visible');
		if(isPanelHidden)
		{
			$("#rightNavContent").show('slide',{direction:'right'},500);
			$("#mxToolbar").removeClass('hiddenToolbar');
			$('#showHidePanel').attr('title', mxResources.get('title.rightnav.hidePanel'));
			$("#mxToolbar").css('opacity', 1);
			var currentCell = sourceState = editor.graph.getModel().getCell("state_" + editor.currentState);
			editor.graph.scrollCellToVisible(currentCell, true, true);			
						
		}		

		//changeStateWidgetObj.removeImpersonationWidget();

		var saveStepContainer = $("#saveStepContainerWidget");
		
		if(saveStepContainer.length>0){
			saveStepContainer.remove();
		}
		
		$(content).appendTo($(".dropdownActive"));
				
		var temp;
	    temp=$('#commentsTextArea').val();
	    $('#commentsTextArea').val('');
	    if(isPanelHidden){
	    	 window.setTimeout(function() {		
	 			$('#commentsTextArea').focus();
	 		}, 550);
	    }
	    else
	    	$('#commentsTextArea').focus();
	    
	    $('#commentsTextArea').val(temp);
	    
	    _plm.callFunc('workflowactions', 'resizeHeight');
	
	};


		
	/**
	 * Function: createPerformersTable
	 * 
	 * Entire This table is created when you click on the current state
	 * 
	 * */
	function createPerformersTableContent(cell) {

		var contentWrapper = document.createElement('div');
		var table;

		var performersForTransition = mxConstants.transitionWithUsers;
		var transitionsForCurrentState = getAllTransitionsAndFilterByCurrentState();

		for ( var i = 0; i < transitionsForCurrentState.length; i++) {
			currentTransition = transitionsForCurrentState[i];
			var availablePerformers = getAvailablePerformersForCurrentTransition(currentTransition, performersForTransition);
			transitionsForCurrentState[i].availablePerformers = availablePerformers;
		}

		editor.__scope.showPerformersTable(transitionsForCurrentState, mxResources.get('title.workflowActions') +  cell.getAttribute("shortName"));
		return;
		var topUlElements = document.createElement('ul');
		topUlElements.className = 'ulHeader';

		for ( var i = 0; i < transitionsForCurrentState.length; i++) {

			currentTransition = transitionsForCurrentState[i];

			if (currentTransition.transitionID != -99) {

				var mainLiElements = document.createElement('li');
				var spanHeader = document.createElement('h4');
				mxUtils.write(spanHeader, currentTransition
						.getAttribute('shortName'));
				mainLiElements.appendChild(spanHeader);
				mainLiElements.className = 'accordionHeader';

				var elementsUl = document.createElement('ul');
				elementsUl.className = 'accordionBody';
				mainLiElements.appendChild(elementsUl);

				$(mainLiElements).toggle(function() {
					$(this).find('ul').hide();
					$(this).find('h4').addClass('accordionHeaderHide');

				}, function() {
					$(this).find('ul').show();
					$(this).find('h4').removeClass('accordionHeaderHide');
				});

				var availablePerformers = getAvailablePerformersForCurrentTransition(
						currentTransition, performersForTransition);

				if (availablePerformers.length > 0) {

					for ( var j = 0; j < availablePerformers.length; j++) {

						var performer = availablePerformers[j];
						var nameLiTag = $('<li></li>');
						var nameHyperlink = $('<a></a>');
						var performerName = " " + performer.firstName + " "
								+ performer.lastName;

						nameHyperlink.on('click', {userID : performer.ID}, function(e) {

							_plm.callFunc('util', 'contactInfoPopup',[ e.data.userID ]);
							e.stopPropagation();

							return false;

						});
						nameLiTag.append(nameHyperlink);

						mxUtils.write(nameHyperlink[0], performerName);
						elementsUl.appendChild(nameLiTag[0]);

					}

				} else {
					var noPerformers = $('<span></span>');
					mxUtils.write(noPerformers[0], mxResources.get('messages.noperformers'));
					elementsUl.appendChild(noPerformers[0]);
				}

				topUlElements.appendChild(mainLiElements);
				contentWrapper.appendChild(topUlElements);
			}
		}
		var jqSpinner = $(".popupSpinner");
		jqSpinner.empty();
		jqSpinner.append(contentWrapper);
		jqSpinner.removeClass("popupSpinner");

	};
	
	function createMxPerformersPopup(cell, xPos, yPos){
		
		var spinnerDivWrapper = document.createElement('div');
		$(spinnerDivWrapper).addClass("popupSpinner");
		
		if(mxClient.IS_IE)	
			spinnerDivWrapper.style.height = '180px';
		
		var xPosR = recalculateXpos(xPos, 460);
		var yPosR = recalculateYpos(yPos, 220);
		
		var wnd = new mxWindow(mxResources.get('title.workflowActions') +  cell.getAttribute("shortName"), spinnerDivWrapper, xPosR, yPosR, 460, 220, false, true);
	
		wnd.setMaximizable(false);
		wnd.setClosable(true);
		wnd.setScrollable(true);
		wnd.setResizable(true);
		wnd.setVisible(true);
		$('#modalMask').fadeTo("fast",0.5);
	
	};
	
	
	function getAvailablePerformersForCurrentTransition(currentTransition, performersForTransition){
				
		var transitionID = currentTransition.getAttribute("transitionID");
		var performers = [];
		
		if(performersForTransition!=undefined){
		
			for(var i =0; i< performersForTransition.length ; i++){
				currentMapValue = performersForTransition[i];
				if(transitionID == currentMapValue.transition.transitionID){
					performers = currentMapValue.usersList;
					break;
				}
			}		
		}
		return performers;	
				
	};
	
	
	/**
	 * Function: isTransitionFromState
	 * 
	 * We check here is the transition passed has the currentState as source node.
	 * 
	 * */
	function isTransitionFromState(transitionCell){
				
		var currentCellId = editor.currentState;
		var source = transitionCell.source;
		if(source != null && source.getAttribute("stateID") == currentCellId){
			return true;
		}				
		return false;
			
	};	
	
	/**
	 * Function: isTransitionFromState
	 * 
	 * We check here is the transition passed has the currentState as source node.
	 * 
	 * */
	function isTransitionAvailableForUser(transitionID){
				
		var transitions = mxConstants.transitionList;
		for(var i =0; i< transitions.length ; i++){
			transition = transitions[i];
			if(transition.transitionID == transitionID){
				return true;
			}
		}
		return false;
			
	};
	
	
	/**
	 * Function: isTransiotionFromUser
	 * 
	 * */
	function isTransitionFromUser(transition, transitionsFromUser){
		
		for(var i = 0;i<transitionsFromUser.length;i++){
			userTransition = transitionsFromUser[i];
			if(transition.getAttribute('transitionID') == userTransition.transitionID)
				return true;
		}
		return false;
	};
	
	/**
	 * Function: formatCellId
	 * 
	 * Cleans the given internal id for showing it to the user. 
	 */
	function formatCellId(id) {
		return id.replace(/[a-zA-Z]+_/, '');
	};
	
	/**
	 * Function: isHistoryStepForCurrentState
	 * 
	 * Based on a historyStep, we check if the toState element id is the currentState id
	 * This means that the historyStep belongs to the currentState.
	 * 
	 * */
	function isHistoryStepForCurrentState(historyStep){
		
		var currentStateId = editor.currentState;
		if(historyStep.transition.toState.stateID == currentStateId){
			return true;
		}
		return false;
		
	};
	
	
	/**
	 * Function: initButtonsEvent
	 * 
	 * Init the events for the buttons in the toolbar
	 * 
	 * */
	function initButtonsEvent(graph){
		
		var zoomInBtn = document.getElementById('zoomIn');
				
		$(zoomInBtn).on('click', function(){
			graph.zoomIn();
		});
		
		var zoomOutBtn = document.getElementById('zoomOut');
		
		$(zoomOutBtn).on('click', function(){
			graph.zoomOut();
		});		
		
		var centerElementBtn = document.getElementById('centerCurrent');
		
		$(centerElementBtn).on('click', function(){
			var currCell = graph.getModel().getCell("state_" + editor.currentState);
			graph.scrollCellToVisible(currCell, true);
		});
		
		var fitBtn = document.getElementById('fit');
		
		$(fitBtn).on('click', function(){
			graph.fit();
		});
		
		var showHidePanelBtn = document.getElementById('showHidePanel');
		$('#showHidePanel').attr('title', mxResources.get('title.rightnav.hidePanel'));
		
		$(showHidePanelBtn).on('click', function(){
			
			if($("#rightNavContent").is(':visible')){				 
				
				$("#rightNavContent").hide('slide',{direction:'right'},500)
				$("#mxToolbar").addClass('hiddenToolbar');
				$(this).attr('title', mxResources.get('title.rightnav.showPanel'));
				
				var currentCell = sourceState = graph.getModel().getCell("state_" + editor.currentState);
				graph.scrollCellToVisible(currentCell, true, false);			
			}			
			
			else{
				
				$("#rightNavContent").show('slide',{direction:'right'},500);
				$("#mxToolbar").removeClass('hiddenToolbar');
				$(this).attr('title', mxResources.get('title.rightnav.hidePanel'));
				
				var currentCell = sourceState = graph.getModel().getCell("state_" + editor.currentState);
				graph.scrollCellToVisible(currentCell, true, true);
			}
			 		
		});	
		
		
		$("#mxToolbar").hover(function() {
		   	var isPanelHidden= !$("#rightNavContent").is(':visible');
		    if (isPanelHidden) {
		    	$(this).fadeTo( 500,  1 );
		    } 
		}, function() {
		   
			var isPanelHidden= !$("#rightNavContent").is(':visible');
		    if (isPanelHidden) {
		    	$(this).fadeTo( 500,  0.4 );
		    	$(this).addClass('hiddenToolbar');
		    }
		});
		
	};
	
	
	
	/**
	 * Function: hideSaveStepBox
	 * 
	 * Hides comment box when doing a workflow action
	 */
	function hideSaveStepBox(){
		var parentWindow = $('div.mxWindow');
		parentWindow.remove();
		mxConstants.isWFStepOpened = false;
		$("#modalMask").hide();	
	}
	

	
	/**
	 * Function: createFormattedTextError
	 * 
	 * In some cases we might get several error messages. This is just to create those error messages on a
	 * bulleted list way.
	 * 
	 * */
	function createFormattedTextError(messages){
		
		var xPos = coordinateX()-250;
		var yPos = coordinateY();
		 
		var container = document.createElement('div');
		var responseText;
	
		for(var i =0; i< messages.length ; i++){
			var messageTag = document.createElement('li');
			//IE does not like the textContent. It uses the text property
			if(mxClient.IS_IE)
				mxUtils.write(messageTag, messages[i].text + "\n");
			else
				mxUtils.write(messageTag, messages[i].textContent + "\n");
			container.appendChild(messageTag);	
		}
		
		mxUtils.showError(container, xPos, yPos, false); 
		
	};
	

	
	function updateUserMessageForUndo(response){
		
		_plm.callFunc('usermessages','showConfirmation',[mxResources.get('messages.confirm.workflow.rollback'), true]); 
		
		var currentStateID = response.workflowMap.currentStateId;
		var currCell = sourceState = editor.graph.getModel().getCell("state_" + currentStateID);
			
		if(currCell != undefined)
			var currStateName = currCell.getAttribute('shortName');
		
		var milestoneInfo = response.workflowMap.milestoneInfo;
		_plm.callFunc('usermessages','updateCurrentStateText',[currStateName, milestoneInfo]);
		
	};
	
	function updateUserMessageForSaveStep(response){
		
		_plm.callFunc('usermessages','showConfirmation',[mxResources.get('messages.confirm.workflow.savenextstep'), true]); 
		
		//This is to update the current state name
		var currentStateID = response.workflowMap.currentStateId;
		var currCell = sourceState = editor.graph.getModel().getCell("state_" + currentStateID);
		
		if(currCell != undefined)
			var currStateName = currCell.getAttribute('shortName');
			
		var milestoneInfo = response.workflowMap.milestoneInfo;
		_plm.callFunc('usermessages','updateCurrentStateText',[currStateName, milestoneInfo]); 
		
	};
	
	
	/**
	 * Function: recalculateXpos
	 * 
	 * Based on the current middle X and the modal width, we check if the modal has space
	 * if not we recalculate the position.
	 * 
	 * */
	function recalculateXpos(xPos, wndWidth){
		
		var availableWidth = $("#content").width();
						
		if(xPos>availableWidth-wndWidth)
			xPos=availableWidth-wndWidth;
		
		return xPos;
		
	};
	
	/**
	 * Function: recalculateYpos
	 * 
	 * Based on the current middle Y and the modal height, we check if the modal has space
	 * if not we recalculate the position.
	 * 
	 * */
	function recalculateYpos(yPos, wndHeight){
		
		var availableHeight = $("#content").height();
		availableHeight = availableHeight+106;
		
		if((yPos)>availableHeight-wndHeight)
			yPos=availableHeight-wndHeight;
		
		return yPos;
		
	};
		
	/**
	 * Function: getAllTransitionsAndFilterByCurrentState
	 * 
	 * Aux method that tells me if the current state has outgoing transitions or not.
	 * 
	 * */
	function getAllTransitionsAndFilterByCurrentState(){
		
		var allTransitions = obtainCells(editor.graph, 'transition');
		var currentTransitions = [];
		
		if (allTransitions != undefined) {
			
			for (var i = 0; i < allTransitions.length; i++) {
				transition = allTransitions[i];
				if(isTransitionFromState(transition)){
					currentTransitions.push(transition);
				}
				
			}
		}
		
		return currentTransitions;
		
	};
	
	function coordinateX(){
		return $('#mxGraph').offset().left + $('#mxGraph').width()/2;
	};
	
	function coordinateY(){
		return $('#mxGraph').offset().top;
	};
	
		
	
	function appendTransitionDropDown(){
		
		$("#nextSteps").append(createDropDownWidget());		
		
	};
	
	/**
	 * Function: populateTransitionDropDown
	 * 
	 * Called each time the content gets refreshed. It might populate the dropdown with the available transitions
	 * or show a proper message if no transitions can be performed
	 * 
	 * */
	function populateTransitionDropDown(){
				
		var select = document.getElementById('workflowTransList');
		var instructionalText = $(".instructional");
		var transitions = getAllTransitionsAndFilterByCurrentState();

		select.options.length = 0; // clear out existing items
		var workflowTransitionList = mxConstants.transitionList; 
		
		if(workflowTransitionList.length >0){
			$(select).show();
			$(instructionalText).hide();
			//Dummy step
			select.options.add(new Option(mxResources.get("prompt.workflow.dropdown.selectaction"), -99))
			for(var i=0; i < workflowTransitionList.length; i++) {
			    var theTransition = workflowTransitionList[i];
			    var theTransitionID = theTransition.transitionID;
			    //This is to remove hidden transitions from the dropdown menu. Backing out BF-001587
			   // var transitionCell = editor.graph.getModel().getCell("transition_" + theTransitionID);
			    //if(transitionCell != undefined && !transitionCell.hidden){
			    	select.options.add(new Option(theTransition.shortName, theTransitionID));
			   // }
			}
		}
		//Case there are now more steps
		else if(transitions.length == 0){
			//$(instructionalText).hide();
			$(instructionalText).text(mxResources.get('message.noaction'));
			$(instructionalText).show();
			$(select).hide();
			
		}
		else
		{			
			//The user cannot perform. 
			$(instructionalText).text(mxResources.get('message.noaction'));
			$(instructionalText).show();
			$(select).hide();
		}
				
		$(select).change(function(e) {

			if (this.selectedIndex != 0) {
				var transitionID = e.target.value;

				var xPos = 20 + $('#mxGraph').offset().left;
				var yPos = $('#mxGraph').offset().top;// + $("#global_header").height();
				
				var transitionName = $("#workflowTransList option[value='"+transitionID+"']").text()
								
				_datastay.require(['changeStateWidget','workspaceutil'], function(changeStateWidget,workspaceutil){
					changeStateWidgetObj = changeStateWidget;
					changeStateWidget.setItem($("#current-dms-id").val(), workspaceutil.getWorkspaceID());
					changeStateWidget.populateTransitionDropDown();
					var content = changeStateWidget.createSaveStepWidget(transitionID);

					openWorkflowStepDialog(xPos, yPos, content, transitionName,transitionID);
				});																			
				
			}
			//If the saveStep panel is open and I select the default option, hide the panel
			if((this.selectedIndex == 0) && ($("#saveStepContainerWidget").length>0)){
				
				changeStateWidgetObj.removeImpersonationWidget();

				var saveStepContainer = $("#saveStepContainerWidget");
				saveStepContainer.remove();
				
			}
		});
		

	};	
	
	/**
	 * Function: installMoveHandler
	 * 
	 * Override to make the modals not to go off-screen
	 * 
	 * */
	mxWindow.prototype.installMoveHandler = function(){
		this.title.style.cursor = 'move';
		
		var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
		var mm = (mxClient.IS_TOUCH) ? 'touchmove' : 'mousemove';
		var mu = (mxClient.IS_TOUCH) ? 'touchend' : 'mouseup';
		
		mxEvent.addListener(this.title, md, mxUtils.bind(this, function(evt)
		{
			var startX = mxEvent.getClientX(evt);
			var startY = mxEvent.getClientY(evt);
			var x = this.getX();
			var y = this.getY();
			
			var wndWidth = this.getElement().clientWidth;
			var wndHeight = this.getElement().clientHeight;
			
			var availableWidth = $("#content").width();
			var availableHeight = $("#content").height();
					
			// Adds a temporary pair of listeners to intercept
			// the gesture event in the document
			var dragHandler = mxUtils.bind(this, function(evt)
			{
				var dx = mxEvent.getClientX(evt) - startX;
				var dy = mxEvent.getClientY(evt) - startY;
				
				var dx1 = mxEvent.getClientX(evt);
				var dy1 = mxEvent.getClientY(evt) + startY;
				
				
				//This first two are for top and left
				var xPosition = x + dx;
				if(xPosition<0){
					xPosition=0;
					
				}
				else{
					var max = (availableWidth-wndWidth);
					var possibleMax=x+dx+wndWidth;

					if(possibleMax > availableWidth){
						xPosition = max;						
					
					}
				}
				
				var yPosition = y + dy;
				if(yPosition<63){
					yPosition=63;					
				}
				else{					
					var max = (availableHeight-wndHeight);
					var possibleMax=y+dy+wndHeight;
					//106 = aprox size of header + footer
					if(possibleMax > availableHeight+106){
						yPosition = max+106;
						
					}
				}
				
				this.setLocation(xPosition, yPosition);
				
				this.fireEvent(new mxEventObject(mxEvent.MOVE, 'event', evt));
				mxEvent.consume(evt);
			});
						
			
			var dropHandler = mxUtils.bind(this, function(evt)
			{
				mxEvent.removeListener(document, mm, dragHandler);
				mxEvent.removeListener(document, mu, dropHandler);
	
				this.fireEvent(new mxEventObject(mxEvent.MOVE_END, 'event', evt));
				mxEvent.consume(evt);
			});
	
			mxEvent.addListener(document, mm, dragHandler);
			mxEvent.addListener(document, mu, dropHandler);
			
			this.fireEvent(new mxEventObject(mxEvent.MOVE_START, 'event', evt));
			mxEvent.consume(evt);
			
		}));
	};
	
	/**
	 * Function: installCloseHandler
	 *
	 * Adds the <closeImage> as a new image node in <closeImg> and installs the
	 * <close> event.
	 */
	mxWindow.prototype.installCloseHandler = function()
	{
		this.closeImg = document.createElement('img');
		
		this.closeImg.setAttribute('src', this.closeImage);
		this.closeImg.setAttribute('align', 'right');
		this.closeImg.setAttribute('title', 'Close');
		this.closeImg.style.marginLeft = '2px';
		this.closeImg.style.cursor = 'pointer';
		this.closeImg.style.display = 'none';
		
		this.title.insertBefore(this.closeImg, this.title.firstChild);
	
		var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
		mxEvent.addListener(this.closeImg, md, mxUtils.bind(this, function(evt)
		{
			
			$("#modalMask").hide();
			
			this.fireEvent(new mxEventObject(mxEvent.CLOSE, 'event', evt));
			
			if (this.destroyOnClose)
			{
				this.destroy();
			}
			else
			{
				this.setVisible(false);
			}
			
			mxEvent.consume(evt);
		}));
	};
	
	function addMouseListener(graph)
	{
		
		graph.addMouseListener(
				{
				   currentShape: null,
				    previousFill: null,
				    previousStroke: null,
				    mouseDown: function(sender, me)
				    {
				        if (this.currentShape != null)
				        {
				                this.dragLeave(me.getEvent(), this.currentShape);
				                this.currentShape = null;
				        }
				    },
				    mouseMove: function(sender, me)
				    {
				        if (this.currentShape != null && me.getState() == this.currentShape)
				        {
				            return;
				        }

				        var tmp = graph.view.getState(me.getCell());
				     
				        if (tmp != this.currentShape)
				        {
				            if (this.currentShape != null)
				            {
				                this.dragLeave(me.getEvent(), this.currentShape);
				            }

				            this.currentShape = tmp;

				            if (this.currentShape != null)
				            {
				                this.dragEnter(me.getEvent(), this.currentShape);
				            }
				        }
				    },
				    mouseUp: function(sender, me) { },
				    
				    dragEnter: function(evt, cellElement)
				    {
				        if (cellElement != null)
				        {
				          
				        	var chosenColor = '#9AC820';
				        	if(cellElement.cell.style == "currentVertex"){
				        		
				        		var transitions = getAllTransitionsAndFilterByCurrentState();
				        		
				        		if(transitions.length>0)
				        		{
					        		this.previousFill = cellElement.shape.fill;
					        		cellElement.shape.fill = '#fce9c8';
					        		//cellElement.text.color="black";
					        		
					        							        		
					        		cellElement.shape.reconfigure();
					        		cellElement.text.reconfigure();
				        		}
				        	
				        	}
				        	
				        	if(cellElement.cell.style == "currentEdge"){
				        		this.previousStroke = cellElement.shape.stroke;
				        		cellElement.shape.stroke = '#fce9c8';
				        	
				        		cellElement.text.color = '#fce9c8';
				        		
				        		//Underline + Italics
				        		//cellElement.text.fontStyle = '6';
				        						        					        		
				        		cellElement.shape.reconfigure();	
				        		cellElement.text.reconfigure();
				        					        	
				        	}
				        }
				    },
				    dragLeave: function(evt, cellElement)
				    {
				        if (cellElement != null)
				        {
				        	if(cellElement.cell.style == "currentVertex"){
				        		
				        		var transitions = getAllTransitionsAndFilterByCurrentState();
				        		
				        		if(transitions.length>0)
				        		{				        		
				        			cellElement.shape.fill = this.previousFill;		
				        			//cellElement.text.color = '#363636';
				        			
					        		cellElement.shape.reconfigure();
					        		//cellElement.text.reconfigure();
				        		}
				        	}
				        	
				        	if(cellElement.cell.style == "currentEdge"){
				        		cellElement.shape.stroke = this.previousStroke;
				        		
				        		cellElement.text.color =  this.previousStroke;
				        		//cellElement.text.fontStyle = '2';		
				        						        		
					        	cellElement.shape.reconfigure();
					        	cellElement.text.reconfigure();	
				        	}
				        }
				    }
				});
		
	};
	
	mxGraph.prototype.scrollCellToVisible = function(cell, center, isPanelHidden)
		{
			var x = -this.view.translate.x;
			var y = -this.view.translate.y;
		
			var state = this.view.getState(cell);
		
			if (state != null)
			{
				var bounds = new mxRectangle(x + state.x, y + state.y, state.width,
					state.height);
		
				if (center && this.container != null)
				{
					var w = this.container.clientWidth;
					var h = this.container.clientHeight;
		
					if(isPanelHidden!= undefined && isPanelHidden)
						w = w - 300;
					else if(isPanelHidden == undefined && $("#rightNavContent").is(":visible"))
						w = w - 300;
					
					bounds.x = bounds.getCenterX() - w / 2;
					bounds.width = w;
					bounds.y = bounds.getCenterY() - h / 2;
					bounds.height = h;
				}
		
				if (this.scrollRectToVisible(bounds, isPanelHidden))
				{
					// Triggers an update via the view's event source
					this.view.setTranslate(this.view.translate.x, this.view.translate.y);
				}
			}
		};
		
		mxGraph.prototype.scrollRectToVisible = function(rect, isPanelHidden)
		{
			var isChanged = false;
			
			if (rect != null)
			{
				var w = this.container.offsetWidth;
				if(isPanelHidden!= undefined && isPanelHidden)
					w = w - 300;
				else
					if(isPanelHidden == undefined && $("#rightNavContent").is(":visible"))
						w = w - 300;
				
				var h = this.container.offsetHeight;
		
		        var widthLimit = Math.min(w, rect.width);
		        var heightLimit = Math.min(h, rect.height);
		
				if (mxUtils.hasScrollbars(this.container))
				{
					var c = this.container;
					rect.x += this.view.translate.x;
					rect.y += this.view.translate.y;
					var dx = c.scrollLeft - rect.x;
					var ddx = Math.max(dx - c.scrollLeft, 0);
		
					if (dx > 0)
					{
						c.scrollLeft -= dx + 2;
					}
					else
					{
						dx = rect.x + widthLimit - c.scrollLeft - c.clientWidth;
		
						if (dx > 0)
						{
							c.scrollLeft += dx + 2;
						}
					}
		
					var dy = c.scrollTop - rect.y;
					var ddy = Math.max(0, dy - c.scrollTop);
		
					if (dy > 0)
					{
						c.scrollTop -= dy + 2;
					}
					else
					{
						dy = rect.y + heightLimit - c.scrollTop - c.clientHeight;
		
						if (dy > 0)
						{
							c.scrollTop += dy + 2;
						}
					}
		
					if (!this.useScrollbarsForPanning && (ddx != 0 || ddy != 0))
					{
						this.view.setTranslate(ddx, ddy);
					}
				}
				else
				{
					var x = -this.view.translate.x;
					var y = -this.view.translate.y;
		
					var s = this.view.scale;
		
					if (rect.x + widthLimit > x + w)
					{
						this.view.translate.x -= (rect.x + widthLimit - w - x) / s;
						isChanged = true;
					}
		
					if (rect.y + heightLimit > y + h)
					{
						this.view.translate.y -= (rect.y + heightLimit - h - y) / s;
						isChanged = true;
					}
		
					if (rect.x < x)
					{
						this.view.translate.x += (x - rect.x) / s;
						isChanged = true;
					}
		
					if (rect.y  < y)
					{
						this.view.translate.y += (y - rect.y) / s;
						isChanged = true;
					}
		
					if (isChanged)
					{
						this.view.refresh();
						
						// Repaints selection marker (ticket 18)
						if (this.selectionCellsHandler != null)
						{
							this.selectionCellsHandler.refresh();
						}
					}
				}
			}
		
			return isChanged;
		};
	
	
//}
	  
	 	