/*
 * Methods used by the local storage save
 * 
 * @author: Gabriel Yaffe
 */
{

	function getCopiedStatesFromGraph(copiedCells) {
		var states = [];
				
		for (var i = 0; i < copiedCells.length; i++){
		
				var state = {};
				var diagramState = copiedCells[i];
				if(diagramState.value.tagName == "state"){
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
		}
		return states;
	}
	
	function getCopiedNotesFromGraph(copiedCells) {
		
		var notes = [];
		for(var i=0;i<copiedCells.length;i++) {
			var note = {};
			var diagramNote = copiedCells[i];
			if(diagramNote.value.tagName == "note"){
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
		}
		return notes;
	}
	
	function getCopiedTransitionsFromGraph(copiedCells, graph){
		var transitions = [];
		for (var i = 0; i < copiedCells.length; i++) {
			var transition = {};
			var diagramTransition = copiedCells[i];
			if(diagramTransition.value.tagName=="transition"){
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
					transition.labelPositionX = bb.x;
					transition.labelPositionY = bb.y;
				}
				
				if (transition.permissionID.indexOf("@") != -1) {
					transition.newPermissionID = transition.permissionID;
					transition.permissionID = "";
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
		}
		
		return transitions;
	}
	
	function getCopiedNoteLinksFromGraph(copiedCells) {
		var noteLinks = [];
		for (var i = 0; i < copiedCells.length; i++) {
			var noteLink = {};
			var diagramNoteLink = copiedCells[i];
			if(diagramNoteLink.value.tagName == "edgeNote"){
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
		}
		return noteLinks;
	}
	
}
