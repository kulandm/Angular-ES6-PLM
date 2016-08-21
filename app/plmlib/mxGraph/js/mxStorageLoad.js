/*
 * Methods used to paste the copied information obtained from the localStorage
 * 
 * @author: Gabriel Yaffe
 */
{
	//Global variable that represents the list of copied cells
	var copiedElements = [];
	
	function prevalidatePaste(graph, workflowData, sameSession){
		
		//Empty the copied cells array
		copiedElements = [];
		//Isolated States can be paste, then no check there
						
		var transitions = workflowData.transitionsCopied;
		var states = workflowData.statesCopied;
		
		var canPasteTransitions = true;
		var isSourceCopied = true;
		var isTargetCopied = true;
		if (transitions != undefined) {
			var cells = [];
			for (var i = 0; i < transitions.length; i++) {
				transition = transitions[i];
				
				if (transition.fromState != null) {
					isSourceCopied = checkSourceStateExists(states, transition);
					isTargetCopied = checkTargetStateExists(states, transition);
					
					if((!isTargetCopied && isSourceCopied) || (isTargetCopied && !isSourceCopied) || 
							(!isTargetCopied && !isSourceCopied)){
								if(sameSession== false){
									canPasteTransitions = false;
									break;
																	
								}								
					}					
				}
				else
					{
					//Check for out transition from start state
					var errorInitState = checkStartTansitions(graph);
						if(!errorInitState){
							canPasteTransitions = false;
							break;
						}						
					}
			}
		}
		
		return canPasteTransitions;
			
	}
	
	
	function drawCopiedStates(states, graph, sameSession, copyNumber) {
		
		var id;
		var array = [];
		var offset = copyNumber * 28;
		copiedElements = [];
		var allStates = obtainCells(graph, 'state');
		
		if (states != undefined) {
			for (var i = 0; i < states.length; i++) {
				state = states[i];
				var firstId	= getStateId(state);			
				
				if (sameSession && state.stateID != null) {
					id = "state_" + state.stateID;
				} else {
					id = "init-cell";
				}
					
				var stateTemplate = editor.templates.state.clone();
				var cell = graph.insertVertex(
					graph.getDefaultParent(),
					id,
					stateTemplate.value,
					state.coordinateX+offset,
					state.coordinateY+offset,
					state.width,
					state.height, 'defaultVertex' 
				);
				
				var isTempState = false;
				
				if (firstId.indexOf("@") == 0) {
					isTempState = true;
				}
				
				array.push({ firstID: firstId, givenID: cell.id, isTemp:isTempState });
				
				//For States, we do not copy the manage and lock property
				for (property in state) {
					if (property != 'lockStateID' && property!='cmStateID')
						cell.setAttribute(property,state[property]);
				}
				
				//Generate unique scriptId
				var customID = cell.getAttribute('customID');
				customID = generateCustomID(allStates, customID, cell.id);
            	changeCellAttribute(graph.model, cell, 'customID', customID);
				
				hideCell(cell);				
				copiedElements.push(cell);
			
			}			

		}
		return array;
	}
	
	
	function drawCopiedNotes(notes, graph, sameSession, copyNumber) {
		
		var array = [];
		var offset = copyNumber * 24;
		if (notes != null) {
			for (var i = 0; i < notes.length; i++) {
				note = notes[i];
				
				var firstId	= getNoteId(note);
				
				var noteTemplate = editor.templates.note.clone();
				
				if(sameSession && note.noteID!= null)
					id = "note_" + note.noteID;
				else
					id = "init-cell";
				
				var cell = graph.insertVertex(
					graph.getDefaultParent(),
					id,
					noteTemplate.value,
					note.coordinateX + offset,
					note.coordinateY + offset,
					note.width,
					note.height, 'note' 
				);
				var isTempNote = false;
				
				if(firstId.indexOf("@")==0)
					isTempNote = true;
				
				array.push({ firstID: firstId, givenID: cell.id, isTemp : isTempNote });
				
				for (property in note) {
					cell.setAttribute(property,note[property]);
				}
					
				hideCell(cell);
				copiedElements.push(cell);
			}
		}
		return array;
	}
	
	function drawCopiedTransitions(transitions, permissions, graph, sameSession, mapArray, copyNumber) {
		
		var offset = copyNumber * 28;
		var allTransitions = obtainCells(graph, 'transition');
		
		if (transitions != undefined) {
			
			for (var i = 0; i < transitions.length; i++) {
				transition = transitions[i];
				
				if (editor.isMap && transition.hidden) {
					continue;
				}
				
				var transitionTemplate = editor.templates.edge.clone();
				
				var sourceState;
				var isSourceCopied = false;
				if (transition.fromState == null) {
					sourceState = graph.getModel().getCell("init-cell");
					isSourceCopied = true;
				} else {
					var id = getProperSourceIdFromTransition(transition);
					var givenID = findGivenIdInMap(id, mapArray);
					if (givenID != null) {
						isSourceCopied = true;
						sourceState = graph.getModel().getCell(givenID);
					} else {
						id = getProperSourceIdFromTransitionWithPrefix(transition);
						sourceState = graph.getModel().getCell(id);
					}
								
				}
				var isTargetCopied = false;
				var targetId = getProperTargetIdFromTransition(transition);
				var givenID = findGivenIdInMap(targetId, mapArray);
				if (givenID != null) {
					targetState = graph.getModel().getCell(givenID);
					isTargetCopied = true;
				} else {
					targetId = getProperTargetIdFromTransitionWithPrefix(transition);
					targetState = graph.getModel().getCell(targetId);
				}
				
				var canPasteTransitions  = true;
				if ((!isTargetCopied && isSourceCopied) || (isTargetCopied && !isSourceCopied) || (!isTargetCopied && !isSourceCopied) && !sameSession) {
					canPasteTransitions = false;
				}
			
				//Force id regeneration
				if (sameSession) {
					id = "transition_" + transition.transitionID;
				} else {
					id = "init-cell";
				}
					
				var canPaste = true;				
				if (canPasteTransitions && sourceState.id == "init-cell") {
					canPaste = checkStartTansitions(graph);
				}
							
				if (canPaste && canPasteTransitions) {
					var cell = graph.insertEdge(
						graph.getDefaultParent(),
						id,
						transitionTemplate.value,
						sourceState,
						targetState
					);
									
					for (property in transition) {
						if (property != "pointsList") {
							if (!sameSession && property != 'action' && property != 'preCondition' 
								&& property != 'scriptAction' && property != 'scriptCondition' && property != 'scriptValidation') {
								cell.setAttribute(property,transition[property]);
							} else {
								cell.setAttribute(property,transition[property]);
							}
						}
					}
					
					cell.style = 'edge';
					var oldPoints = transition.pointsList;
					if (oldPoints != null) {
						var newPoints = [];
						for (var j = 0; j < oldPoints.length; j++) {
							var x = oldPoints[j].coordinateX + offset;
							var y = oldPoints[j].coordinateY + offset;
							newPoints.push(new mxPoint(x,y));
						}
						cell.getGeometry().points = newPoints;
					}
					
					//Generate unique scriptId
					var customID = cell.getAttribute('customID');
					customID = generateCustomID(allTransitions, customID, cell.id);
					changeCellAttribute(graph.model, cell, 'customID', customID);
	            	
					hideCell(cell);
					linkPermissionWithTransition(cell, permissions, graph);
									
					copiedElements.push(cell);
				}
			}
			
		}
	}
	
		
	function drawCopiedNoteLinks(noteLinks, graph, sameSession, mapedStatesArray, mapedNotesArray, copyNumber){
	
		var offset = copyNumber * 24;
		if(noteLinks!=null){
			for (var i = 0; i < noteLinks.length; i++) {
				noteLink = noteLinks[i];
				var noteLinkTemplate = editor.templates.edgeNote.clone();
				
				var isSourceCopied = false;
				var isTargetCopied = false;
				if(noteLink.sourceTypeNote == true){
										
					var sourceNoteId = noteLink.sourceID;	
					var targetStateId = noteLink.targetID;
					
					var givenIDNote = findGivenIdInMapForNotes(sourceNoteId, mapedNotesArray);
					if(givenIDNote != null){
						isSourceCopied = true;
						if(givenIDNote.indexOf("@") !=0){
							givenIDNote = "note_" + givenID;
						}
						var sourceElement = graph.getModel().getCell(givenIDNote);
					}
					else
						var sourceElement = graph.getModel().getCell(sourceNoteId);
					
					var givenIDState = findGivenIdInMapForNotes(targetStateId, mapedStatesArray);
					if(givenIDState != null){
						isTargetCopied = true;
						if(givenIDState.indexOf("@") !=0){
							givenIDState = "state_" + givenID;
						}
						var targetElement = graph.getModel().getCell(givenIDState);
					}
									
				}
				else
					{
					
					var sourceStateId = noteLink.sourceID;	
					var targetNoteId = noteLink.targetID;
									
					var givenIDState = findGivenIdInMapForNotes(sourceStateId, mapedStatesArray);
					if(givenIDState != null){
						isSourceCopied = true;
						if(givenIDState.indexOf("@") !=0){
							givenIDState = "state_" + givenID;
						}
						var sourceElement = graph.getModel().getCell(givenIDState);
					}
										
					var givenIDNote = findGivenIdInMapForNotes(targetNoteId, mapedNotesArray);
					if(givenIDNote != null){
						isTargetCopied = true;
						if(givenIDNote.indexOf("@") !=0){
							givenIDNote = "note_" + givenID;
						}
						var targetElement = graph.getModel().getCell(givenIDNote);
					}					
					
				}
				
				var canPasteLink  = true;
				if((!isTargetCopied && isSourceCopied) || (isTargetCopied && !isSourceCopied) || (!isTargetCopied && !isSourceCopied)){
					if(sameSession== false)
						canPasteLink = false;
				}
				var pasteBoth = true;
				if((sourceElement == undefined) || (targetElement==undefined) ){
					pasteBoth = false;
				}			
				if(pasteBoth && canPasteLink){
					var cell = graph.insertEdge(
						graph.getDefaultParent(),
						"edgeNote_" + noteLink.noteLinkID,
						noteLinkTemplate.value,
						sourceElement,
						targetElement
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
							var x = points[j].coordinateX+offset;
							var y = points[j].coordinateY+offset;
							Points.push(new mxPoint(x,y));
						}
						cell.getGeometry().points = Points;
					}
					copiedElements.push(cell);
				}
				
			}
		}
	}
	function linkPermissionWithTransition(cell, permissions, graph){
		
		var permissionId;
		if(cell.value.attributes.newPermissionID != undefined)
			permissionId = cell.value.attributes.newPermissionID;
		else
			permissionId = cell.value.attributes.permissionID;
		
		var permissionName;
		if(permissionId != undefined){
			for(var i=0;i<permissions.length;i++) {
				if (permissions[i].permissionID == permissionId.value) {
					permissionName = permissions[i].shortName;
					break;
				}
			}			
		}	
		
		linkOrCreate(cell, permissionName, permissionId, graph);
		
	}
	
	function linkOrCreate(cell, permissionName, permissionId, graph){
		
		var notUnique = mxPermissionsPanel.isUniquePermissionName(permissionName, permissionId);
				
		if(permissionName != undefined && notUnique){
		
			//Link
			var permissions = mxConstants.permissions;
			for(var i=0;i<permissions.length;i++) {
				if (permissions[i].shortName == permissionName) {
					if(permissions[i].newPermissionID !=null){
						cell.setAttribute('permissionID',permissions[i].newPermissionID);
						
					}
					else{
						cell.setAttribute('permissionID',permissions[i].permissionID);
						
					}
					permissions[i].transactionsUsingThisPermission++;
					
				}				
			}
		}
		else{
			//Create
			var nextId = graph.model.prefix + graph.model.nextId;
			graph.model.nextId++;
			var permission = {
					'longName': '',
					'newPermissionID': nextId, 
					'permissionID': nextId,  
					'permissionString': '',
					'shortName': permissionName,
					'transactionsUsingThisPermission' : 1
				};
			mxConstants.permissions.push(permission);
			cell.setAttribute('permissionID',permission.newPermissionID);
		
			
		}
	}
	
	/**
	 * Function used by the prevalidator to check if the source state of a transition got copied
	 * 
	 * @return true if state got founds
	 */
	function checkSourceStateExists(states, transition){
		
		var exists = false;
		var id = getProperSourceIdFromTransition(transition);
		if (states != undefined) {
			for (var i = 0; i < states.length; i++) {
				state = states[i];
				var firstId	= getStateId(state);
				if(firstId==id){
					exists = true;
					break;
				}
			}
		}
		return exists;
		
	}
	
	/**
	 * Function used by the prevalidator to check if the target state of a transition got copied
	 * 
	 * @return true if state got founds
	 */
	function checkTargetStateExists(states, transition){
		
		var exists = false;
		var id = getProperTargetIdFromTransition(transition);
		if (states != undefined) {
			for (var i = 0; i < states.length; i++) {
				state = states[i];
				var firstId	= getStateId(state);
				if(firstId==id){
					exists = true;
					break;
				}
			}
		}
		return exists;
		
	}
	
	/**
	 * Function user for transitions to find the source state id
	 * 
	 * @return id, id of source state element
	 *  
	 * */
	function getProperSourceIdFromTransition(transition){
		
		var id;
		if(transition.fromState.newStateID == null)
			id = transition.fromState.stateID;
		else
			id = transition.fromState.newStateID;
		
		return id;
		
	}
		
	function getProperSourceIdFromTransitionWithPrefix(transition){
		
		var id;
		if(transition.fromState.newStateID == null)
			id = "state_" + transition.fromState.stateID;
		else
			id = transition.fromState.newStateID;
		
		return id;
		
	}
	
	/**
	 * Function user for transitions to find the target state id
	 * 
	 * @return id, id of target state element
	 *  
	 * */
	function getProperTargetIdFromTransition(transition){
		
		var id;
		if(transition.toState.newStateID == null)
			id = transition.toState.stateID;
		else
			id = transition.toState.newStateID;
		
		return id;
		
	}
	
	function getProperTargetIdFromTransitionWithPrefix(transition){
		
		var id;
		if(transition.toState.newStateID == null)
			id = "state_" + transition.toState.stateID;
		else
			id = transition.toState.newStateID;
		
		return id;
		
	}
	//STATE ID
	function getStateId(state){
		
		if(state.newStateID == null){
			return state.stateID;			
		}
		else
			return state.newStateID;
	}
	
	//NOTE ID
	function getNoteId(note){
		
		if(note.newNoteID == null){
			return note.noteID;
			
		}
		else
			return note.newNoteID;
	}
	
	/**
	 * Given an id, we search for it on the map created after the state insertion
	 * 
	 * @return givenID, id generated
	 *  
	 * */
	function findGivenIdInMap(primaryID, mapArray){
		
		var givenID = null;
		for (var i = 0; i < mapArray.length; i++) {
			if(mapArray[i].firstID == primaryID){
				givenID = mapArray[i].givenID;
				break;
			}
		}

		return givenID;
		
	}
	
	/**
	 * Given a note id, we search for it on the map created after the notes insertion
	 * 
	 * @return givenID, id generated
	 *  
	 * */	
	function findGivenIdInMapForNotes(primaryID, mapArray){
		
		var givenID = null;
		for (var i = 0; i < mapArray.length; i++) {
			if(mapArray[i].isTemp){
				primaryID = "@" + primaryID;
			}
			
			if(mapArray[i].firstID == primaryID){
			
				givenID = mapArray[i].givenID;
				break;
			}
		}

		return givenID;		
	}

	/**
	 * Function that detects if the graph contains a transition from the start cell
	 * 
	 * @return true, if transition founds
	 *  
	 * */
	function checkStartTansitions(graph){
			
		transitionCells = obtainCells(graph, "transition");
		for (var i = 0; i < transitionCells.length; i++) {
			var diagramTransition = transitionCells[i];
			if(diagramTransition.source!=null){
				if(diagramTransition.source.id == "init-cell")
				
					return false;
			}
		}
		return true;
	}		
}
