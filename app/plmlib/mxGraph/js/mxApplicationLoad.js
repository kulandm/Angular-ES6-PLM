 /*
 * Defines the startup sequence of the application.
 * 
 * @author: Farid Elias
 * @author: Ismael Machado
 * @author: Gabriel Yaffe
 *
 */
{

	function drawInitState(x,y, graph) {
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
	function configureStylesheetForNoneSVG(graph) {		
			if (!mxClient.IS_SVG){	
				var style = new Object();
			
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
				style[mxConstants.STYLE_IMAGE] = '/plmlib/mxGraph/images/workflow/start.png';
				style[mxConstants.STYLE_DELETABLE] = '0';
				graph.getStylesheet().putCellStyle('ellipse', style);
			}
				
			
	};
	
	/**
	 * Function: hideCells
	 * 
	 * Goes through all the given cells styling them as hidden, if 
	 * they're marked as "Hide in online map".
	 */
	function hideCells(cells) {
		if (cells != undefined) {
			for (var i in cells) {
				hideCell(cells[i]);
			}
		}
	};
	
	function drawStates(states, graph) {
		if (states != undefined) {
			var cells = [];
			function getProps(cell){
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
										cell.setAttribute('escalationNotifyAll','');
										break;
									case 'WF_SCRIPT':
										cell.setAttribute('action',4);
										cell.setAttribute('escalationScript',settings[0].value);
										cell.setAttribute('escalationNotify',datum.notify);
										cell.setAttribute('escalationNotifyAll','');
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
				if (editor.isMap) {
					if (editor.currentState == state.stateID) {
						style = 'currentVertex';
					}
					if (state.hidden) {
						continue;
					}
				}
					
				var stateTemplate = editor.templates.state.clone();
				
				var hiddenIE8;
				if (mxClient.IS_IE && !mxClient.IS_SVG){
					hiddenIE8 = state.hidden;
				}
				
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
				hideCell(cell, hiddenIE8);
				
				if ((mxClient.IS_IE && !mxClient.IS_SVG) && editor.isMap){
					var x = 0;
					if (state.reminderNotifications) {
						addStateOverlay(graph, state, 'email_16.png', 'state.reminderNotifications', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.escalationEnabled) {
						addStateOverlay(graph, state, 'escalations_16.svg', 'state.escalationEnabledLabel', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.cmStateID) {
						addStateOverlay(graph, cell, 'gears_16.svg', 'state.cmStateID', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
						x -= 16;
					}
					if (state.lockStateID) {
						addStateOverlay(graph, cell, 'lock_16.svg', 'state.lockStateID', 16, 16, x, 0, mxConstants.ALIGN_RIGHT);
					}
				}
				cells.push(cell);
			}
			
		}
	}
	
	function drawTransitions(transitions, graph) {
		if (transitions != undefined) {
			var cells = [];
			for (var i = 0; i < transitions.length; i++) {
				transition = transitions[i];
				if (editor.isMap) {
					if (transition.hidden) {
						continue;
					}
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
				for (property in transition) {
					if (property != "pointsList") {
						cell.setAttribute(property,transition[property]);
					}
				}
				markPermissionAsUsed(mxConstants.permissions,transition.permissionID);

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
				
				var hiddenIE8;
				if (mxClient.IS_IE && !mxClient.IS_SVG){
					hiddenIE8 = transition.hidden;
				}
				
				hideCell(cell, hiddenIE8);
				cells.push(cell);
			}

			return cells;
		}
	}

	function findCellById(cells, id) {
		for (var i in cells) {
			var cell = cells[i];
			if (cell.id == id) {
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
				var cell = findCellById(cells, 'transition_' + transition.transitionID);
				
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
				for (property in note) {
					cell.setAttribute(property,note[property]);
				}
				
				var hiddenIE8;
				if (mxClient.IS_IE && !mxClient.IS_SVG){
					hiddenIE8 = note.hidden;
				}
				
				hideCell(cell, hiddenIE8);
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
	
	/**
	 * Function: classifyScripts
	 * 
	 * Receives a list with all different types of scripts and stores them 
	 * by type on an matrix of mxConstants.
	 */
	function classifyScripts(scripts) {
		mxConstants.scripts = {
			condition: [],
			validation: [],
			action: []
		};
		if (scripts != null) {
			for (var i = 0; i < scripts.length; i++) {
				var script = scripts[i];
				var scriptType = script.scriptType.toLowerCase();
				if (mxConstants.scripts[scriptType] == null) {
					mxConstants.scripts[scriptType] = [];
				} 
				mxConstants.scripts[scriptType].push(script);
			}
		}
	};
	
	/**
	 * Function: createCommentOptions
	 * 
	 * Creates a list containing the options for comments.
	 * The comment object has a value (the value on the enum), and a name (the text to be shown on the frontend) 
	 */
	function createCommentOptions() {
		mxConstants.commentoptions = [{ID: 0, name: mxResources.get('transition.commentOptional')},
		                               {ID: 1, name: mxResources.get('transition.commentRequired')}, 
		                               {ID: 2, name: mxResources.get('transition.commentDisabled')}];
	};
	
	/**
	 * Function: initSaveStatus
	 * 
	 * Initializes the Save Status area on the status bar.
	 */
	function initSaveStatus() {
		var right = 172;
		if ($('#btn_validation').width() > 170) {
			right = $('#btn_validation').width() + 17;
		}
		
		var lastStatusSeparator = $('#lastStatusSeparator');
		lastStatusSeparator.css('right', right);
		
		$('#saveStatus')
			.css('right', right)
			.empty()
			.append(getSavedIcon())
			.append($('<span>').addClass('status'));
			
		showStatusSaved(true);
	};
	
	/**
	 * Function: showSaveStatus
	 * 
	 * Shows the given message on the status bar.
	 */
	function showSaveStatus(message, hideDate, date) {
		var statusSpan = $('#saveStatus .status');
		statusSpan.text(mxResources.get(message));

	};
	
	/**
	 * Function: getSavedIcon
	 *
	 * Element for indicating that the diagram is fully saved.
	 */
	function getSavedIcon() {
		return $('<img>')
			.attr('src', '/plmlib/mxGraph/images/icons/save_16.png')
			.addClass('saved');
	};
	
	/**
	 * Function: getUnsavedIcon
	 * 
	 * Image element for warning the user of unsaved changes.
	 */
	function getUnsavedIcon() {
		return $('<img>')
			.attr('src', '/plmlib/mxGraph/images/icons/warning_16.png')
			.addClass('unsaved');
	};
	
	/**
	 * Function: showStatusSaved
	 * 
	 * Shows the last time the diagram was saved or updates the last save time.
	 */
	function showStatusSaved(updateDate) {
		var now = updateDate ? ISODateString(new Date()) : null;
		showSaveStatus('saved', false, now);
		
		$('#saveStatus img.unsaved')
			.removeClass('changed')
			.replaceWith(getSavedIcon());
	};
	
	/**
	 * Function: showStatusUnsaved
	 * 
	 * Warns the user that there are unsaved changes on the editor.
	 */
	function showStatusUnsaved() {
		showSaveStatus('unsavedChanges');
		
		var img = $('#saveStatus img')
		if (!img.hasClass('animating')) {
			img.replaceWith(getUnsavedIcon());
		}
	};
	
	/**
	 * Function: showStatusSaving
	 * 
	 * Animates the Save icon while saving.
	 */
	function showStatusSaving() {
		showSaveStatus('saving', true);
		
		$('#saveStatus img').replaceWith(getSavedIcon());
		
		var img = $('#saveStatus img'); 
		var style1 = { width: '16px', marginRight: '0px', marginTop: '0px' };
		var style2 = { width: '12px', marginRight: '2px', marginTop: '2px' };
		var t = 200;
		img.addClass('animating')
			.animate(style2, t, null, function() {
			img.animate(style1, t, null, function() {
				img.animate(style2, t, null, function() {
					img.animate(style1, t, null, function() {
						img.animate(style2, t, null, function() {
							img.animate(style1, t, null, function() {
								var img = $('#saveStatus img');
								img.removeClass('animating');
							});
						});	
					});
				});	
			});
		});	
	}
	
	function parseDocumentAndRender(data) {
		window.focus();
		var graph = editor.graph;
		
		graph.getModel().beginUpdate();
		//Clear all elements before rendering the page
		graph.getModel().clear();
		mxConstants.permissions = data.workflow.permissions != undefined ? 
				data.workflow.permissions : 
				[];
		
		mxConstants.permissionsOnDB = [];
		mxConstants.escalationEnabled = $('#__escalationEnabled').text()=='1';
		mxConstants.reminderEventIds = new Object();
		mxConstants.reminderEvents = new Object();
		mxConstants.escalationEventIds = new Object();
		mxConstants.escalationEvents = new Object();
		$.each(mxConstants.permissions,function() {
			var permissionCopy = {};
			$.extend(permissionCopy,this);
			mxConstants.permissionsOnDB.push(permissionCopy);
		})
		initTransactionsUsingPermissionsCounter(mxConstants.permissions);
		drawInitState(data.workflow.initialStateX,data.workflow.initialStateY, graph);
		drawStates(data.workflow.states, graph);
		drawNotes(data.workflow.notes, graph);
		drawNoteLinks(data.workflow.noteLinks, graph);
		var cells = drawTransitions(data.workflow.transitions, graph);
		graph.getModel().endUpdate();
		
		if (mxClient.IS_SVG) {
			showStateOverlays(graph);
		}
		
		drawTransitionsLabels(data.workflow.transitions, cells, graph);
		classifyScripts(data.workflow.scripts);
		editor.resetHistory();
		
		createCommentOptions();
		
		// Shows the application
		hideSplash();
	}
	
	function loadWorkflow() {

		var workspaceId = $("#workspaceId").val();
		if (workspaceId != -1) {
			$("#splash").show();
			$.ajax({
				url : "/api/rest/workflows/" + workspaceId + ".json",
				type: "GET",
				cache: false,
				success : function(response) {
					if (response.exceptions == null) {
						parseDocumentAndRender(response);
					} else {
						alert(mxResources.get('server.error'));
					}
				},
				error:function (xhr, ajaxOptions, thrownError) {
					_plm.callFunc('errorhandler', 'handleAjaxError',[xhr.responseText,thrownError,'loading map']);
				}
									
			});
		}
		editor.graph.zoomActual();
		
	}
	
	function hideSplash() {
		
		// Fades-out the splash screen
		var splash = document.getElementById('splash');
		
		if (splash != null) {
			try {
				mxEvent.release(splash);
				mxEffects.fadeOut(splash, 100, true);
			}
			catch (e) {
				splash.parentNode.removeChild(splash);
			}
		}
	};
	
	/**
	 * Function: printErrors
	 * 
	 * Converts an array into a list of LI elements and inserts them 
	 * into the element given as a parent.
	 */
	function printErrors(parent, errors, showLocation) {
		if (errors.length > 0) {
			
			if (showLocation) {
				$('<h1>')
					.text(mxResources.get('validationTitle'))
					.appendTo(parent);
			}
			
			var ul = $('<ul>')
				.addClass('errors')
				.appendTo(parent);

			for (var i in errors) {
				var error = errors[i];
				var li = $('<li>');
				var message = error.message;
				var span = $('<span>');
				
				if (showLocation) {

					/*var params = [ 
		               mxResources.get(error.tagName + '.'+ error.tagName),
		               formatCellId(error.cellId)
		            ];*/
					//message += ' ' + mxResources.get('error.location', params);
					//span.text(message)
					//li.append(span);
					
					$('<a>')
						.appendTo(li)
						.attr('href', '#')
						.text(message)
						.data('cellId', error.cellId)
						.data('tagName', error.tagName)
						.data('fieldName', error.fieldName)
						.click(function() {
							var cellId = $(this).data('cellId');
							var tagName = $(this).data('tagName');
							var fieldName = $(this).data('fieldName');
							viewItem(tagName, cellId, fieldName);
						});
					
				} else {
					span.text(message)
					li.append(span);
				}
				
				li.appendTo(ul);
			}
			
		}
	};
	
	/**
	 * Function: showCellErrors
	 * 
	 * Shows the errors corresponding to the selected element on the 
	 * properties panel, used from mxGraph.prototype.getGraphValidationErrors. 
	 */
	function showCellErrors(cell, div) {
		var messages = cell.getErrors();
		var divErrors = div == null ? $('.mxWindow .cellErrors') : $(div);
		divErrors.empty();
		printErrors(divErrors, messages, false);
	}
	
	/**
	 * Function: obtainGlobalErrors
	 * 
	 * Checks if exists any errors in the diagram and formats them to show 
	 * on the errors div, this is called for every change on the diagram.
	 */
	function obtainGlobalErrors() {
		var graph = editor.graph;
		var messages = graph.getGraphValidationErrors();
		var divErrors = $('#mxErrors').empty();
		var btnValidation = $('#btn_validation img');
		
		if (graph.errorCount > 0) {
			btnValidation.attr('src', '/plmlib/mxGraph/images/icons/warning_16.png');
			printErrors(divErrors, messages, true);
			return true;
		} else {
			btnValidation.attr('src', '/plmlib/mxGraph/images/check.png');
		}
	};
	
	/**
	 * Function: toggleErrors
	 * 
	 * Shows/hide the errors div.
	 */
	function toggleErrors() {
		$('#mxErrors').toggle();
	};
	
	function validatePaste(graph) {
		var selectedCells = graph.getSelectionModel().cells.slice();
		for (var i in selectedCells) {
			var selectedCell = selectedCells[i];
			if (selectedCell != null) {
				showStateOverlays(graph, graph.model, selectedCell);
			}
		}
	};
	
	function findPermissionByName(name) {
		for (var i in mxConstants.permissions) {
			var permission = mxConstants.permissions[i];
			if (permission.shortName == name) {
				return permission.permissionID;
			}
		}
	}
	
	/**
	 * Function: onBlurProperties
	 * 
	 * Creates a new permission for a transition if it was provided.
	 */
	function onBlurProperties() {
		var graph = editor.graph;
		
		if (editor.properties != null) {
			var cell = editor.properties.cell;
			if (cell.value.tagName == 'transition') {

				// iterates through all the possible permissions created on this transition
				var newPermissionInputsArr = ['permissionID', 'escalationPermissionId'];
				$.each(newPermissionInputsArr, function(index, element) {

					var cmb = $('#cmb_' + element + '_hidden_select');
					var input =  $('input#cmb_' + element);
					var current_text = input.val();
					var current_value = $('option:selected', cmb).attr('value');

					if (cmb.length > 0) {
						if (current_value != undefined && current_value != '' && current_text != '') {
							changePermission(graph, cell, current_value);
						}
						if (current_value == '' && current_text != '' && current_text != input.attr('title')) {
							var permissionId = findPermissionByName(current_text);
							if (permissionId) {
								if (element == 'permissionID') {
									changePermission(graph, cell, permissionId);
								} else if (element == 'escalationPermissionId') {
									changeEscalationPermission(graph, cell, permissionId);
								};
							} else {
								var nextId = graph.model.prefix + graph.model.nextId;
								graph.model.nextId++;
								var permission = {
										'longName': '',
										'newPermissionID': nextId, 
										'permissionID': nextId,  
										'permissionString': '',
										'shortName': current_text,
										'transactionsUsingThisPermission' : 0
									};
								mxConstants.permissions.push(permission);
								if (element == 'permissionID') {
									changePermission(graph, cell, nextId);
								} else if (element == 'escalationPermissionId') {
									changeEscalationPermission(graph, cell, nextId);
								};
							}
						}
					}
				});
			} else if (cell.value.tagName == 'state') { // for new permissions created in "Escalate to..."

				// list all permissions that were created
				var createdEscalations = $('#escalateto-table').find('tbody').find('tr');
				// change/create permissions for all escalated transitions
				$.each(createdEscalations, function(index, element) {
					var cmb = $(element).find('#cmb_escalationPermissionId_hidden_select');
					var input =  $(element).find('input#cmb_escalationPermissionId');
					var current_text = input.val();
					var current_value = $(element).find('option:selected', cmb).attr('value');
					
					var transitionCell = null;
					if (element.getAttribute('id') != null) {
						if (element.getAttribute('id').indexOf('@') != -1) {
							transitionCell = graph.getModel().getCell(element.getAttribute('id'));
						} else {
							transitionCell = graph.getModel().getCell('transition_' + element.getAttribute('id'));
						};
					};
					if (cmb.length > 0) {
						
						if (current_value != undefined && current_value != '' && current_text != '') {
							changeEscalationPermission(graph, transitionCell, current_value);
						}
						if (current_value == '' && current_text != '' && current_text != input.attr('title')) {
							var escalatePermissionId = findPermissionByName(current_text);
							if (escalatePermissionId) {
								changeEscalationPermission(graph, transitionCell, escalatePermissionId);
							} else {
								var nextId = graph.model.prefix + graph.model.nextId;
								graph.model.nextId++;
								var permission = {
										'longName': '',
										'newPermissionID': nextId, 
										'permissionID': nextId,  
										'permissionString': '',
										'shortName': current_text,
										'transactionsUsingThisPermission' : 0
									};
								mxConstants.permissions.push(permission);
								changeEscalationPermission(graph, transitionCell, nextId);
							}
						}
					}
				});
			}
			//console.log('Data before SAVE:', 'states:', getStatesFromGraph(graph), 'transitions:', getTransitionsFromGraph(graph), 'permissions:', mxConstants.permissions);
			$('input, select, textarea', editor.properties.table).blur();
		}
	};
	
	function initTransactionsUsingPermissionsCounter(permissions) {
		for (var j = 0; j < permissions.length; j++) {
			permissions[j].transactionsUsingThisPermission = 0;
		}
	};
	
	function markPermissionAsUsed(permissions, permissionID) {
		for (var j = 0; j < permissions.length; j++) {
			var permission = permissions[j];
			if (permission.permissionID == permissionID) {
				permission.transactionsUsingThisPermission++;
			}
		}
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
	 * Function: getItemById
	 * 
	 * Searches in the items array for the element with the given id.
	 */
	function getItemById(items, itemId) {
		for (var i in items) {
			var item = items[i];
			if (item.id == itemId) {
				return item;
			}
		}
		return null;
	};
	
	/**
	 * Function: viewItem
	 * 
	 * Selects the object from the diagram with the given id 
	 * and focuses the given field.
	 */
	function viewItem(tagName, itemId, fieldName) {
		var graph = editor.graph;
		var items = obtainCells(graph, tagName);
		var itemFound = getItemById(items, itemId);
		
		if (itemFound != null) {
			graph.getSelectionModel().clear();
			graph.getSelectionModel().addCell(itemFound);
			if (tagName == 'note') {
				graph.startEditingAtCell(itemFound);
			} else {
				if (fieldName == 'customID') {
					$('#btn_showAdvancedMode').click();
				}
				$('#txt_' + fieldName).focus();
			}
		}
	};
	
	/**
	 * Function: onDiagramChange
	 * 
	 * Invoked every time any change is made on the editor diagram by 
	 * direct user interaction, undo/redo actions and diagram load.
	 */
	function onDiagramChange() {
		var canUndo = editor.undoManager.canUndo();
		var canRedo = editor.undoManager.canRedo();
		var errorExist = editor.graph.errorCount > 0;

		$('#btn_save').enable(canUndo && !errorExist);
		$('#btn_undo').enable(canUndo);
		$('#btn_redo').enable(canRedo);

		var saveStatus = $('#saveStatus');
		if (canUndo) {
			showStatusUnsaved();
		} else {
			showStatusSaved(true);
		}
	};
	
	/**
	 * Function: onUndoOrRedo
	 * 
	 * Refreshes the locked/managed states overlays when undoing or 
	 * redoing actions.
	 */
	function onUndoOrRedo() {
		var graph = editor.graph;
		
		showStateOverlays(graph);
		hideCells(obtainCells(graph, "state"));
		hideCells(obtainCells(graph, "transition"));
		
		onDiagramChange();
		graph.getSelectionModel().clear();
	};
	
	/**
	 * Function: onSelectionChange
	 * 
	 * Executed when the user changes the selection.
	 */
	function onSelectionChange() {
		var graph = editor.graph;
		var selectedCells = graph.getSelectionModel().cells.slice();
		var isSelected = selectedCells.length > 0;
		
		$('#btn_cut').enable(isSelected);
		$('#btn_copy').enable(isSelected);
		$('#btn_delete').enable(isSelected);
		
		graph.showIdsTemp = graph.showIds;
	};
	
	/**
	 * Constructs a new application (note that this returns an mxEditor
	 * instance).
	 */
	function mxApplication(config) {
		
		try {
			
			if (!mxClient.isBrowserSupported()) {
				mxUtils.error(mxResources.get('browserNotSupported'), 200, false);
			} else {
				
				var node = mxUtils.load(config).getDocumentElement();
				editor = new mxEditor(node);
				editor.defaultEdge.style = 'edge';
			
				
				editor.popupHandler.createConditions = function(editor, cell, evt) {
					var conditions = mxDefaultPopupMenu.prototype.createConditions.call(this, editor, cell, evt);
					conditions['deletable'] = editor.graph.isCellDeletable(cell); 
					return conditions;
				};
				
				editor.addAction('reloadWorkflow', function(editor) {
					var canUndo = editor.undoManager.canUndo();
					if (canUndo) {
						mxUtils.confirm(mxResources.get('unsavedChanges'), mxResources.get('changesLost'), 300, true, mxResources.get('accept'), '', mxResources.get('cancel'), false, function(acceptCancel) {
							loadWorkflow();
						});		
					} else {
						loadWorkflow();
					}
				});
						
				editor.addAction('exportImage', function(editor) {
					this.graph.getSelectionModel().clear();
					
					var url = editor.getUrlImage();
					
					if (url == null || mxClient.IS_LOCAL) {
						editor.execute('show');
					} else {
						var node = mxUtils.getViewXml(editor.graph, 1);
						var xml = mxUtils.getXml(node, '\n');

						mxUtils.submit(url, editor.postParameterName + '=' +
							encodeURIComponent(xml), document, '_blank');
					}
				});

				editor.addAction('cut', function(editor) {
					if (editor.graph.isCellDeletable(cell)) {
						copyElements(cell, true);
					} 
				});
				
				editor.addAction('elbow', function(editor,cell, evt) {
					var handler = editor.graph.selectionCellsHandler.getHandler(cell);
					if (handler instanceof mxEdgeHandler) {					
						handler.addPoint(handler.state, evt);
					}
				});
				
				
				editor.addAction('copy', function(editor, evt) {
					if (editor.graph.isCellDeletable(cell)) {
						copyElements(cell, false);
					}
				});
				
				editor.addAction('paste', function(editor, evt, mouseup) {
					if (editor.graph.isEnabled()) {
						var workflowLocalData = localStorage.getItem('data');
						var sessionData = sessionStorage.getItem('data');
						var copyNumber = localStorage.getItem('copyNumber');
						var workflowData = JSON.parse(workflowLocalData);
						var originalWorkspaceId = workflowData.workspaceIdCopied;
						var currentId = $("#workspaceId").val();
						var sameSession = ((workflowLocalData == sessionData) && (originalWorkspaceId==currentId));
						
						//Not used for the moment....
						var clientX; 
						var clientY; 
						if (mouseup!=undefined) {
							clientX = mouseup.clientX;
							clientY = mouseup.clientY;
						}
						
						pasteElements(editor.graph, workflowData, sameSession, copyNumber);
					}
				});
				
				editor.addAction('workflowSummary', function(editor) {
					if (!mxSummaryPanel.isVisible()) {
						mxSummaryPanel.createSummaryPanel();
					}
				});
				
				editor.addAction('permissionsSummary', function(editor) {
					if (!mxPermissionsPanel.isVisible()) {
						mxPermissionsPanel.createPermissionsPanel();
					}
				});
				
				editor.addAction('zoomIn', function(editor) {
					graph.zoomIn();
					this.toolbar.updateZoomInput();
				});
				
				editor.addAction('zoomOut', function(editor) {
					graph.zoomOut();
					this.toolbar.updateZoomInput();
				});
				
				editor.addAction('actualSize', function(editor) {
					graph.zoomActual();
					this.toolbar.updateZoomInput();
				});
				
				editor.addAction('fit', function(editor) {
					graph.fit();
					this.toolbar.updateZoomInput();
				});
				
				editor.addAction('validation', function(editor) {
					toggleErrors();
				});
				
				editor.addAction('toggleShowIds', function() {
					toggleAdvancedMode(graph, false);
				});
				
				editor.validating = true;
				
				editor.graph.model.prefix = "@";
				
				editor.addListener(mxEvent.AFTER_ADD_VERTEX, function(sender, evt) {
					var vertex = evt.getProperty('vertex');

					if ((/^@.*/).test(vertex.id) && editor.graph.isCellEditable(vertex)) {
						this.graph.startEditingAtCell(vertex);
					}
				});
				
				editor.hideProperties = function() {
					if (!mxClient.IS_IE) {
						if (document.activeElement.blur != null) { 
							document.activeElement.blur();
						}
					}
					onBlurProperties();
					mxEditor.prototype.hideProperties.call(this);
				};
				
				editor.undoManager.addListener(mxEvent.ADD, onDiagramChange);
				editor.undoManager.addListener(mxEvent.UNDO, onUndoOrRedo);
				editor.undoManager.addListener(mxEvent.REDO, onUndoOrRedo);
				editor.undoManager.addListener(mxEvent.CLEAR, onDiagramChange);
								
				var graph = editor.graph;
				graph.setConnectable(true);
				graph.setGridEnabled(true);

				graph.connectionHandler.marker.validColor = '#99ccff';
				//graph.connectionHandler.marker.invalidColor = 'red';
				
				mxConstants.HANDLE_FILLCOLOR = '#99ccff';
				mxConstants.HANDLE_STROKECOLOR = '#0088cf';
				mxConstants.HIGHLIGHT_COLOR = '#0088cf';
				mxConstants.CONNECT_HANDLE_FILLCOLOR = '#0088cf'; 
				mxConstants.EDGE_SELECTION_COLOR = '#0088cf';
				mxConstants.VERTEX_SELECTION_COLOR = '#0088cf';
				mxConstants.DEFAULT_VALID_COLOR = '#0088cf';
				mxConstants.VALID_COLOR = '#0088cf';
				
				
				//Validates that only one outgoing transition is allowed from the start state
				graph.multiplicities.push(new mxMultiplicity(
						   true, 'initstate', null, null, 0, 1, ['state'],
						   mxResources.get('error.transitionFromStart'),
						   null));
				
			    // Enables HTML labels as wrapping is only available for those
			    graph.htmlLabels = true;
			    
				graph.isWrapping = function(state) {
					return (state.value.tagName != 'transition');
				};
				
				graph.validateGraph = function(cell, context) {
					mxGraph.prototype.validateGraph.call(this, cell, context);
					obtainGlobalErrors();
				};
				
				// Implements a properties panel that uses
				// mxCellAttributeChange to change properties
				graph.getSelectionModel().addListener(mxEvent.ON_CHANGE, function(sender, evt) {
					onSelectionChange();
					editor.hideProperties();
					var cell = graph.getSelectionCell();
					if (cell != null)  {
						//Show only modal with one click on elements with errors
						if (cell.errors.length > 0) {
							editor.showProperties(cell);
						}
					}
					
				});
		
				// Implements a properties panel that uses
				// mxCellAttributeChange to change properties
				graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
					var cell = graph.getSelectionCell();
					if (cell == null)  {
						editor.hideProperties();
					} else {
						editor.showProperties(cell);
					}
				});
					
				//Defines different transitions for notes
				graph.addListener(mxEvent.CELL_CONNECTED, function(sender, evt) {
										
					var e = evt.getProperty('event'); // mouse event
					var edge = evt.getProperty('edge'); // edge may be null
					
					if (!evt.isConsumed()) {
						if (edge != null) {
							var source = edge.getTerminal(true);
							var destiny = edge.getTerminal(false);
							if ((source != undefined && source.value.tagName == 'note')
								|| (destiny != undefined && destiny.value.tagName == 'note')) {
								edge.style = 'edgeNote';
								edge.value = {tagName: 'edgeNote', nodeName: 'edgeNote'};
							} else {
								edge.style = 'edge';
							}
							evt.consume();
						}
					}					
					
				});
				
				//Defines transition loops elbows
				graph.addListener(mxEvent.AFTER_CELL_CONNECTED, function(sender, evt) {
					
					var e = evt.getProperty('event'); // mouse event
					var edge = evt.getProperty('edge'); // edge may be null
					
					if (!evt.isConsumed()) {
						if (edge != null) {
							var source = edge.getTerminal(true);
							var destiny = edge.getTerminal(false);
							if (source == destiny) {
								editor.createEdgeLoop(edge, source);
							}
							evt.consume();
						}
					}					
					
				});
				
				graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt) {
					var usedTransitions = [];
					var removedCells = evt.properties.cells;
					for (var i = 0; i < removedCells.length; i++) {
						
						var removedCell = removedCells[i];
						if (removedCell.value.nodeName == "transition") {
							if (usedTransitions.indexOf(removedCell.id) == -1) {
								usedTransitions.push(removedCell.id);
								var permissionID = removedCell.getAttribute("permissionID");
								var permission = mxPermissionsPanel.getPermissionById(mxConstants.permissions, permissionID);
								if (permission != null) {
									permission.transactionsUsingThisPermission--;
								}
							}
						}
					}
				});


				//Guidance
				if (!mxClient.IS_IE) {
					mxGraphHandler.prototype.guidesEnabled = true;
					mxEdgeHandler.prototype.snapToTerminals = true;
		
				}
				
				// Changes the zoom on mouseWheel events (Google maps style)
			    mxEvent.addMouseWheelListener(function(evt, up) {
			    	
			    	var summary = !mxSummaryPanel.isVisible();
			    	var permissions = !mxPermissionsPanel.isVisible();
			    	var result = (summary && permissions); 
			    	var numX = evt.pageX;
			 		var numY = evt.pageY;
					var width = graph.container.clientWidth;
					var height = graph.container.clientHeight;
						
					if ((0 <= numX && numX <= width) && (20 <= numY  && numY <= height) && result) {
			 			if (up) {
			 				graph.zoomIn();
							editor.toolbar.updateZoomInput();
							evt.preventDefault();			
						} else {
							graph.zoomOut();
							editor.toolbar.updateZoomInput();
							evt.preventDefault();
						}
					}
				});

				loadWorkflow();
				toggleErrors();
				initSaveStatus();
				onSelectionChange();
				initContextMenu();
				mxPermissionsPanel.init();
			}
		} catch (e) {
			hideSplash();

			// Shows an error message if the editor cannot start
			mxUtils.alert(mxResources.get('cannotStartApp') + e.message);
			throw e; // for debugging
		}
								
		return editor;
	}
	
	
	/**
	 * Function: initContextMenu
	 * 
	 * Init the context menu of the editor.
	 * 
	 */
	function initContextMenu() {
		
		editor.graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
			if (cell != null && editor.graph.isCellDeletable(cell)) {
				if (cell.value.tagName == 'transition') {
					var isPath = evt.target.tagName == 'path';
					
					if (isPath) {
						
						menu.addItem(mxResources.get('addElbow'), '/plmlib/mxGraph/images/icons/node_plus16.png', function() {
							var handler = editor.graph.selectionCellsHandler.getHandler(cell);
							if (handler instanceof mxEdgeHandler) {								
								handler.addPoint(handler.state, evt);
							}
						});
				
					} else {
						
						menu.addItem(mxResources.get('removeElbow'), '/plmlib/mxGraph/images/icons/node_minus16.png', function() {
							var handler = editor.graph.selectionCellsHandler.getHandler(cell);
							var pt = mxUtils.convertPoint(handler.graph.container, mxEvent.getClientX(evt),
							mxEvent.getClientY(evt));
							
							var listPoints = handler.state.absolutePoints;
							var index =  findPointIndex(pt, listPoints, handler);
							
							if (handler instanceof mxEdgeHandler) {
								handler.removePoint(handler.state, index);							
							}
		
						});
						
					}
				}
				menu.addItem(mxResources.get('cut'), '/plmlib/mxGraph/images/icons/cut_16.png', function() {

					if (editor.graph.isCellDeletable(cell)) {
						copyElements(cell, true);
				 }
			});
			
			menu.addItem(mxResources.get('copy'), '/plmlib/mxGraph/images/icons/copy_16.png', function() {
				if (editor.graph.isCellDeletable(cell)) {
					copyElements(cell, false);
				}
			});
			
			}
			
			if (cell == null) {
			
				menu.addItem(mxResources.get('paste'), 'plmlib/mxGraph/images/icons/paste_16.png', function() {
					if (editor.graph.isEnabled()) {
						var workflowLocalData = localStorage.getItem('data');
						var sessionData = sessionStorage.getItem('data');
						var copyNumber = localStorage.getItem('copyNumber');
						var workflowData = JSON.parse(workflowLocalData);
						var originalWorkspaceId = workflowData.workspaceIdCopied;
						var currentId = $("#workspaceId").val();
						var sameSession = ((workflowLocalData == sessionData) && (originalWorkspaceId==currentId));
						pasteElements(editor.graph, workflowData, sameSession, copyNumber);
					}
				});
				
			}
	
		}		
	}
	
	
	/**
	 * Function: findPointIndex
	 * 
	 * Custom method to find the point index so we pass it to the removePoint.
	 * 
	 */
	function findPointIndex(point, listPoints, handler) {
		var index = 0;
		
		for (var i = 1; i < listPoints.length-1; i++) {
			var pointInList = listPoints[i];
			var pt = mxUtils.convertPoint(handler.graph.container, point.x, point.y);
			
			if (point.x >= pointInList.x-4 && point.x <= pointInList.x+4) {
				if (point.y >= pointInList.y-4 && point.y <= pointInList.y+4) {
						index = i;
						break;
				}
			}
		}
				
		return index;
	}
	
	/**
	 * Function: copyElements
	 * 
	 * Executed when the user copy or cut elements
	 */
	function copyElements(cell, isCut) {
		
		var messages = editor.graph.getGraphValidationErrors();
	
		if (messages == null) {
			
			var workspaceId = $("#workspaceId").val();
			var copiedCells = editor.graph.selectionModel.cells;
						
			var statesCopied = getCopiedStatesFromGraph(copiedCells);
			var notesCopied = getCopiedNotesFromGraph(copiedCells);
			var transitionsCopied = getCopiedTransitionsFromGraph(copiedCells, editor.graph);
			var noteLinksCopied = getCopiedNoteLinksFromGraph(copiedCells, editor.graph);
			var permissions = mxConstants.permissions;						
						
			var workflowData = {
				workspaceIdCopied : workspaceId,
				statesCopied : statesCopied,
				notesCopied : notesCopied, 
				transitionsCopied : transitionsCopied,
				noteLinksCopied : noteLinksCopied, 
				permissions : permissions
			};
			
			var workflowDataParsed = _plm.callFunc('util', 'jsonToString', [workflowData]);
			localStorage.setItem('data', workflowDataParsed);
			sessionStorage.setItem('data', workflowDataParsed);
			
			//Used to know how many times the same information gets copied.
			localStorage.setItem('copyNumber', '1');
			
			if (isCut) {
				mxClipboard.cut(editor.graph)
			}
		} else {
			mxUtils.alert(mxResources.get('error.beforeCopy'));
		}
			
	}
	
	
	/**
	 * Function: pasteElements
	 * 
	 * Paste elements selected by the user
	 * 
	 */
	function pasteElements(graph, workflowData, sameSession, copyNumber) {
		
		graph.getModel().beginUpdate();		
		var mapArray = drawCopiedStates(workflowData.statesCopied, graph, sameSession, copyNumber);
		var mapedNotesArray = drawCopiedNotes(workflowData.notesCopied, graph, sameSession, copyNumber);
		drawCopiedTransitions(workflowData.transitionsCopied, workflowData.permissions, graph, sameSession, mapArray, copyNumber);
		drawCopiedNoteLinks(workflowData.noteLinksCopied, graph, sameSession , mapArray, mapedNotesArray, copyNumber);
									
		graph.getModel().endUpdate();
		graph.clearSelection();
		copyNumber++;
		localStorage.setItem('copyNumber', copyNumber);
	
		graph.selectionModel.changeSelection(copiedElements);
		validatePaste(editor.graph);
		
	}

}
