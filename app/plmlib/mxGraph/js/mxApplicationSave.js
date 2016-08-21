/*
 * Obtains the model graph object and send them to the back-end 
 * in the appropriate format.
 * 
 * @author: Farid Elias
 * @author: Ismael Machado
 * @author: Gabriel Yaffe
 *
 */
{

	function getStatesFromGraph(graph) {
		var states = [];
		stateCells = obtainCells(graph, "state");
		for (var i = 0; i < stateCells.length; i++){
			var state = {};
			var diagramState = stateCells[i];
			var attributes = diagramState.value.attributes;
			for (var j = 0; j < attributes.length; j++) {
				var attribute = attributes[j];
				state[attribute.name] = attribute.value;
			}
			if (diagramState.id.indexOf("@") != -1){
				state.newStateID = diagramState.id;
			}
			state.coordinateX = diagramState.geometry.x;
			state.coordinateY = diagramState.geometry.y;
			state.width = diagramState.geometry.width;
			state.height = diagramState.geometry.height;
			states.push(state);
		}
		return states;
	}
	
	function escalationChanged(state){
		if(!mxConstants.escalationEvents[formatCellId(state.id)]||!mxConstants.escalationEvents[formatCellId(state.id)][mxConstants.escalationEventIds[formatCellId(state.id)]]){
			return true;
		}
		var escalationEvent = mxConstants.escalationEvents[formatCellId(state.id)][mxConstants.escalationEventIds[formatCellId(state.id)]];
		var includeWeekendSame = (state.getAttribute('includeWeekends') == (escalationEvent.scheduleMask=="skipWeekends"?"false":"true"));
		switch(state.getAttribute('action')){
 	        case '1': //choose user list
 	        case '2': //escalate to
 	        	return !(parseInt(state.getAttribute('escalationDelay'))*86400==escalationEvent.startDelay
 	        			//&&state.getAttribute('transition')==escalationEvent.settings[0].value
 	        			&&state.getAttribute('escalationNotifyAll')==escalationEvent.notify.toString()
 	        			&&includeWeekendSame);
 	        	break;
 	        case '3': //transition
 	        	return !(parseInt(state.getAttribute('escalationDelay'))*86400==escalationEvent.startDelay
 	        			&&(escalationEvent.settings.length==0 || state.getAttribute('transition')==escalationEvent.settings[0].value)
 	        			&&state.getAttribute('escalationNotify')==escalationEvent.notify.toString()
 	        			&&includeWeekendSame);
 	        	break;
 	        case '4': //script
 	        	return !(parseInt(state.getAttribute('escalationDelay'))*86400==escalationEvent.startDelay
 	        			&&(escalationEvent.settings.length==0 || state.getAttribute('escalationScript')==escalationEvent.settings[0].value)
 	        			&&state.getAttribute('escalationNotify')==escalationEvent.notify.toString()
 	        			&&includeWeekendSame);
 	        	break;
			}
	}
	
	function reminderChanged(state){
		if(!mxConstants.reminderEvents[formatCellId(state.id)]||!mxConstants.reminderEvents[formatCellId(state.id)][mxConstants.reminderEventIds[formatCellId(state.id)]]){
			return true;
		}
		var reminderEvent = mxConstants.reminderEvents[formatCellId(state.id)][mxConstants.reminderEventIds[formatCellId(state.id)]];
		var includeWeekendSame = (state.getAttribute('reminderIncludeWeekends') == (reminderEvent.scheduleMask=="skipWeekends"?"false":"true"));
		return !(parseInt(state.getAttribute('reminderInterval'))*86400==reminderEvent.repeatInterval&&parseInt(state.getAttribute('reminderRepeat'))==reminderEvent.runCount&&includeWeekendSame);
	}
	
	function saveEscalationConfig(graph,state,cb){
		var param = {};
		switch(state.getAttribute('action')){
        case '1': //choose user list
        case '2': //escalate to
        	param = {
				"eventType": "WF_ESCALATION",
				"resourceId": formatCellId(state.id),
				"startDelay": parseInt(state.getAttribute('escalationDelay'))*86400,
				"notify": state.getAttribute("escalationNotifyAll"),
				"settings" : []
        	};
        	break;
        case '3': //transition
        	param = {
				"eventType": "WF_TRANSITION",
				"resourceId": formatCellId(state.id),
				"startDelay": parseInt(state.getAttribute('escalationDelay'))*86400,
				"notify" : state.getAttribute("escalationNotify"),
				"settings": [ { "name": "transitionId", "value": state.getAttribute('transition') } ]
        	};
        	break;
        case '4': //script
        	param = {
				"eventType": "WF_SCRIPT",
				"resourceId": formatCellId(state.id),
				"startDelay": parseInt(state.getAttribute('escalationDelay'))*86400,
				"notify" : state.getAttribute("escalationNotify"),
				"settings": [ { "name": "scriptName", "value": state.getAttribute('escalationScript') } ]
        	};
        	break;
		}
		if(mxConstants.escalationEventIds[formatCellId(state.id)]){
			param.id = mxConstants.escalationEventIds[formatCellId(state.id)];
		}
		if(!state.getAttribute('includeWeekends') || state.getAttribute('includeWeekends') == 'false'){
    		param.scheduleMask = "skipWeekends";
    	}
		showStatusSaving();
		$.ajax({
    		url:'api/v2/schedulers',
    		type:'POST',
    		data:JSON.stringify(param),
    		dataType:"json",
			contentType:"application/json",
			cache:false,
			success:function(data){
				mxConstants.escalationEventIds[formatCellId(state.id)] = data.id;
				if(!mxConstants.escalationEvents[formatCellId(state.id)]){
					mxConstants.escalationEvents[formatCellId(state.id)] = new Object();
				}
				mxConstants.escalationEvents[formatCellId(state.id)][data.id] = data;
				if(cb){
					cb();
					showStatusSaved();
				}
			},
			fail:function(){
				
			}
    	});
	}
	
	function removeEscalationConfig(graph,state,cb){
		if(mxConstants.escalationEventIds[formatCellId(state.id)]){
			showStatusSaving();
			$.ajax({
				url:'api/v2/schedulers/'+mxConstants.escalationEventIds[formatCellId(state.id)],
				type:'DELETE',
				success:function(){
					mxConstants.escalationEventIds[formatCellId(state.id)] = undefined;
					mxConstants.escalationEvents[formatCellId(state.id)][mxConstants.escalationEventIds[formatCellId(state.id)]] = undefined;
					if(cb){
						cb();
						showStatusSaved();
					}
				}
			});
		}
	}
	
	function saveReminderConfig(graph,state,cb){
		showStatusSaving();
		var param = {
			"eventType":"WF_REMINDER",
			"resourceId":formatCellId(state.id),
			"repeatInterval":parseInt(state.getAttribute('reminderInterval'))*86400,
			"runCount":parseInt(state.getAttribute('reminderRepeat'))
		};
		if(mxConstants.reminderEventIds[formatCellId(state.id)]){
			param.id = mxConstants.reminderEventIds[formatCellId(state.id)];
		}
		if(!state.getAttribute('reminderIncludeWeekends') || state.getAttribute('reminderIncludeWeekends') == 'false'){
    		param.scheduleMask = "skipWeekends";
    	}
		$.ajax({
    		url:'api/v2/schedulers',
    		type:'POST',
    		data:JSON.stringify(param),
    		dataType:"json",
			contentType:"application/json",
			cache:false,
			success:function(data){
				mxConstants.reminderEventIds[formatCellId(state.id)] = data.id;
				if(!mxConstants.reminderEvents[formatCellId(state.id)]){
					mxConstants.reminderEvents[formatCellId(state.id)] = new Object();
				}
				mxConstants.reminderEvents[formatCellId(state.id)][data.id] = data;
				if(cb){
					cb();
					showStatusSaved();
				}
			},
			fail:function(){
				
			}
    	});
	}
	
	function removeReminderConfig(graph,state,cb){
		if(mxConstants.reminderEventIds[formatCellId(state.id)]){
			showStatusSaving();
			$.ajax({
				url:'api/v2/schedulers/'+mxConstants.reminderEventIds[formatCellId(state.id)],
				type:'DELETE',
				success:function(){
					mxConstants.reminderEventIds[formatCellId(state.id)] = undefined;
					mxConstants.reminderEvents[formatCellId(state.id)][mxConstants.reminderEventIds[formatCellId(state.id)]] = undefined;
					if(cb){
						cb();
					}
				}
			});
		}
	}
	

	function getNotesFromGraph(graph) {
		var notes = [];
		noteCells = obtainCells(graph, "note");
		for (var i = 0; i < noteCells.length; i++) {
			var note = {};
			var diagramNote = noteCells[i];
			var attributes = diagramNote.value.attributes;
			
			for(var j = 0; j < attributes.length; j++) {
				var attribute = attributes[j];
				note[attribute.name] = attribute.value;
			}
			
			if (diagramNote.id.indexOf("@") != -1) {
				note.newNoteID = diagramNote.id;
			}
			
			note.coordinateX = diagramNote.geometry.x;
			note.coordinateY = diagramNote.geometry.y;
			note.width = diagramNote.geometry.width;
			note.height = diagramNote.geometry.height;
			notes.push(note);
		}
		return notes;
	}
	
	
	function getNoteLinksFromGraph(graph) {
		var noteLinks = [];
		noteLinkCells = obtainCells(graph, "edgeNote");
		for (var i = 0; i < noteLinkCells.length; i++) {
			var noteLink = {};
			var diagramNoteLink = noteLinkCells[i];
			
			if(diagramNoteLink.source.value.tagName == 'note'){
				noteLink.sourceTypeNote = true;
				noteLink.sourceID = getNoteID(diagramNoteLink.source.id).noteID;
				noteLink.targetID = getStateIDforNoteLink(diagramNoteLink.target.id).stateID;
			}
			else{
				noteLink.sourceTypeNote = false;
				noteLink.sourceID = getStateIDforNoteLink(diagramNoteLink.source.id).stateID;
				noteLink.targetID = getNoteID(diagramNoteLink.target.id).noteID;
				
			}
						
			pointsList = [];
			diagramPoints = diagramNoteLink.geometry.points;
			if (diagramPoints != null) {
				for (var j = 0; j < diagramPoints.length; j++) {
					diagramPoint = diagramPoints[j];
					pointsList.push({
						//noteLinkID: noteLink.noteLinkID, 
						coordinateX : diagramPoint.x, 
						coordinateY : diagramPoint.y
					});
				}
			}
			if (pointsList.length > 0) {
				noteLink.pointsList = pointsList;
			}
			noteLinks.push(noteLink);
		}
		return noteLinks;
	}
	
	function getTransitionsFromGraph(graph){
		//var graphPan = graph.getView().getGraphBounds();
		graph.getView().scaleAndTranslate(1, 0, 0);
		
		var transitions = [];
		transitionCells = obtainCells(graph, "transition");
		for (var i = 0; i < transitionCells.length; i++) {
			var transition = {};
			var diagramTransition = transitionCells[i];
			var attributes = diagramTransition.value.attributes;
			for (var j = 0; j < attributes.length; j++) {
				var attribute = attributes[j];
				transition[attribute.name] = attribute.value;
			}
			
			transition.labelPositionA = 0;
			transition.labelPositionB = 0;
			var edgeState = graph.view.getState(diagramTransition);
			if (edgeState.text != null) {
				var bb = edgeState.text.boundingBox;
				transition.labelPositionA = bb.x;
				transition.labelPositionB = bb.y;
			}
			
			if (transition.permissionID.indexOf("@") != -1) {
				transition.newPermissionID = transition.permissionID;
				transition.permissionID = "";
			}
			if (transition.escalationPermissionId.indexOf("@") != -1) {
				transition.newEscalationPermissionID = transition.escalationPermissionId;
				transition.escalationPermissionId = "";
			}

			transition.fromState = getStateID(diagramTransition.source.id);
			transition.toState = getStateID(diagramTransition.target.id);
			setTransitionID(transition, diagramTransition);
			pointsList = [];
			diagramPoints = diagramTransition.geometry.points;
			if (diagramPoints != null) {
				for (var j = 0; j < diagramPoints.length; j++) {
					diagramPoint = diagramPoints[j];
					pointsList.push({
						transitionID: transition.transitionID, 
						coordinateX : diagramPoint.x, 
						coordinateY : diagramPoint.y
					});
				}
			}
			if (pointsList.length > 0) {
				transition.pointsList = pointsList;
			}
			transitions.push(transition);
		}
		
		return transitions;
	}
	
	function getStateID(stateID){
		if(stateID == "init-cell") {
			return;
		}
		if (stateID.indexOf("state_") != -1) {
			return { stateID: stateID.substring(6) };
		} else {
			return { newStateID : stateID };
		}
	}
	
	function getNoteID(noteID){
		
		if (noteID.indexOf("note_") != -1) {
			return { noteID: noteID.substring(5) };
		} else {
			return { noteID : noteID };
		}
	}
	
	function getStateIDforNoteLink(stateID){
		if(stateID == "init-cell") {
			return;
		}
		if (stateID.indexOf("state_") != -1) {
			return { stateID: stateID.substring(6) };
		} else {
			return { stateID : stateID };
		}
	}
	
	function setTransitionID(transition, diagramTransition){
		var transitionID = diagramTransition.id; 
		if (transitionID.indexOf("transition_") != -1) {
			transition.transitionID = transitionID.substring(11);
		} else {
			transition.newTransitionID = transitionID;
		}
	}
	
	function showErrors() {
		$('#mxErrors').show();
	}

	/**
	 * Function: createWorkflow
	 * 
	 * Receives a map of keys/values and checks if each of values is an 
	 * array and has any elements before adding it to the object returned. 
	 */
	function createWorkflow(args) {
		var workflowData = {};
		
		for (var item in args) {
			if (typeof(args[item]) != 'object' || args[item].length > 0) {
				workflowData[item] = args[item];
			}
	    }
		
		return workflowData;
	}
	
	var workspaceParsedData;
	mxEditor.prototype.save = function (cb) {
		
		var graph = editor.graph;
		if (graph.isEnabled()) {
			
			if (mxPermissionsPanel.hasErrors()) {
				alert(mxResources.get('save.permissions.error'));
				return;
			}

			if (graph.getGraphValidationErrors() == null) {
				
				$('#btn_save').enable(false);
				var encoder = new mxCodec();
				var node = encoder.encode(graph.getModel());
				var workspaceIdNode = encoder.document.createElement('workspace');

				var initialState = editor.graph.model.getCell("init-cell");
				
				var workflowData = createWorkflow({
					states: 		getStatesFromGraph(graph), 
					notes: 			getNotesFromGraph(graph), 
					noteLinks: 		getNoteLinksFromGraph(graph), 
					transitions: 	getTransitionsFromGraph(graph), 
					permissions: 	mxConstants.permissions, 
					initialStateX: 	initialState.geometry.x, 
					initialStateY: 	initialState.geometry.y
				});
				
				workspaceParsedData = _plm.callFunc('util', 'jsonToString', [workflowData])
				doAjaxSaveCall(cb);
			} else {
				alert(mxResources.get('save.errors'));
				showErrors();
			}
			
		}
		
	};

	function doAjaxSaveCall(cb){
		var workspaceId = $("#workspaceId").val();
		showStatusSaving();
		$.ajax({
			url : "api/rest/workflows/" + workspaceId,
			data: workspaceParsedData,
			contentType : "application/json",
			type: "PUT",
			success : function(response) {
				var doneAllStates = function(){
					donecount++;
					if(donecount==0){
						parseDocumentAndRender(response);
					}
				}
				if(response.exceptions == null) {
					showStatusSaved();
					var newIDs = new Object();
					for(var i=0;response.workflow.states !=null && i<response.workflow.states.length;i++){
						newIDs[response.workflow.states[i].customID] = 'DUMMY_'+response.workflow.states[i].stateID;
					}
					var graph = editor.graph;
					stateCells = obtainCells(graph, "state");
					var donecount = 0;
					for (var i = 0; i < stateCells.length; i++){
						var diagramState = stateCells[i];
						diagramState.id = newIDs[diagramState.getAttribute('customID')];
						if(diagramState.getAttribute('escalationEnabled') == 'true'){
							if(escalationChanged(diagramState)){
								donecount--;
								saveEscalationConfig(graph,diagramState,doneAllStates);
							}
						}else{
							if(mxConstants.escalationEvents[formatCellId(diagramState.id)]){
								donecount--;
								removeEscalationConfig(graph,diagramState,doneAllStates);
							}
						}
						
						if(diagramState.getAttribute('reminderNotifications') == 'true'){
							if(reminderChanged(diagramState)){
								donecount--;
								saveReminderConfig(graph,diagramState,doneAllStates);
							}
						}else{
							if(mxConstants.reminderEvents[formatCellId(diagramState.id)]){
								donecount--;
								removeReminderConfig(graph,diagramState,doneAllStates);
							}
						}
					}
					if(donecount==0){
						parseDocumentAndRender(response);
					}
				} else {
					alert(mxResources.get('server.error'));
				}
			},
			error: function(jqXHR, exception, thrownError) {
				$('#saveStatus img').remove();
				 if (jqXHR.status == 401) {
					_datastay.onAjaxLogin = doAjaxSaveCall;
					_plm.callFunc('util', 'doModalLogin');
				 } 
				 else {
					 alert(mxResources.get('server.error'));
				 }
            }   
		}).always(function(){
			if(cb){
				cb();
			}
		});
		
	}
	
}
