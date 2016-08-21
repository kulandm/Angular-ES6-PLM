/*
 * Defines the behavior of the Properties Panel
 * 
 * @author: Farid Elias
 * @author: Ismael Machado
 * @author: Gabriel Yaffe
 *
 */
{

	/**
	 * Function convertObjectsToOptions
	 * 
	 * Returns a list of objects with label and value to insert in a 
	 * select for the given objects and corresponding attributes.
	 */
	function convertObjectsToOptions(objects, att1, att2) {
		var options = [];
		if (objects != undefined) {
			for (var i = 0; i < objects.length; i++) {
				var object = objects[i];
				var id = object[att1];
				var name = object[att2];
				options.push({value: id, label: name});
			}
		}
		return options;
	}
	
	/**
	 * Function: createStateForm
	 * 
	 * Add the necessary input elements to the properties form to fill 
	 * in the states related data.
	 */
	function createStateForm(graph, form, cell, tagName) {
		var txtCustomID, txtShortName, shortNameChanged, reminderOn=false;
		
		//if is a new state, then it will create a customID automatically.
		if (cell.id.indexOf('@') == 0) {
			var cells = obtainCells(graph, 'state');
			shortNameChanged = function() {
				shortNameChangedHandler(cells, 'state', graph, cell, 'shortName', txtShortName, true, txtCustomID);
			};
		}
		
		reminderOn = (cell.getAtt('reminderNotifications').nodeValue=='true');
		// handles the disabled attribute of all inputs
		var toggleInputs = function(){
			$(cmbInterval).prop('disabled',!reminderOn);
			$(chkWkends).prop('disabled',!reminderOn);
			$(cmbRepeat).prop('disabled',!reminderOn);
		};
		
		if (graph.showIdsTemp) {
			createIdField(graph, form, cell);
		}
		
		txtShortName = createTextField(graph, form, cell, 'shortName', 'addText', tagName, null, null, true, shortNameChanged);
		
		if (graph.showIdsTemp) {
			txtCustomID = createTextField(graph, form, cell, 'customID', 'addText', tagName, null, function() {
				customIDChangedHandler('state', graph, cell, 'customID', txtCustomID);
			});
		}
		
		createTextField(graph, form, cell, 'longName', 'addTextarea', tagName);
		createCheckboxField(graph, form, cell, 'lockStateID', tagName, showStateOverlays);
		createCheckboxField(graph, form, cell, 'cmStateID', tagName, showStateOverlays);
		createCheckboxField(graph, form, cell, 'hidden', tagName, onClickHide);
		
		var button = createButtonField(graph, form, cell, 'showAdvancedMode', 'showIds', function() {
			toggleAdvancedMode(graph, true);
		});
		
		if (graph.showIdsTemp) {
			$(button).addClass('on');
		}
		
		var chkReminder = createCheckboxField(graph, form, cell, 'reminderNotifications', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'reminderNotifications', chkReminder.checked);
			}
			finally {
				model.endUpdate();
			}
		   showStateOverlays(graph, model);
			reminderOn = chkReminder.checked;
			toggleInputs();
		});
		
		// number value for interval
		var arr = new Array();
		for(var i=1;i<=10;i++){
			arr.push({val:i,name:i+' '+mxResources.get('days')});
		}
		for(var i=15;i<=30;i+=5){
			arr.push({val:i,name:i+' '+mxResources.get('days')});
		}
		var numOptions = convertObjectsToOptions(arr, 'val', 'name');
		var cmbInterval = createTextField(graph, form, cell, 'reminderInterval', 'addSelect', tagName, numOptions);
		
		// weekend inclusion switch
		var chkWkends = createCheckboxField(graph, form, cell, 'reminderIncludeWeekends', tagName);
		
		// number value for repeat
		arr = new Array();
		for(var i=1;i<10;i++){
			arr.push({val:i,name:i+' '+mxResources.get('times')});
		}
		numOptions = convertObjectsToOptions(arr, 'val', 'name');
		var cmbRepeat = createTextField(graph, form, cell, 'reminderRepeat', 'addSelect', tagName, numOptions);
		
		toggleInputs();
	}
	
	/**
	 * Function: createEscalationForm
	 * 
	 * Add the necessary input elements to the properties form to fill 
	 * in the states related data.
	 */
	function createEscalationForm(graph, form, cell, tagName) {
		var isEnabled = false;
		var actionVal = -1;
		var workspaceId = $("#workspaceId").val();
		
		//if is a new state, then it will create a customID automatically.
		if (cell.id.indexOf('@') == 0) {
			
		}

		isEnabled = (cell.getAtt('escalationEnabled').nodeValue=='true');
		// handles the disabled attribute of all inputs
		var toggleInputs = function(){
			$(cmbDelay).prop('disabled',!isEnabled);
			$(chkWkends).prop('disabled',!isEnabled);
			$(chkEscalationNotify).prop('disabled',!isEnabled);
			$(cmbAction).prop('disabled',!isEnabled);
			$(cmbScript).prop('disabled',!isEnabled);
			$(cmbTrans).prop('disabled',!isEnabled);
			$(cmbField).prop('disabled',!isEnabled);
			$(cmbAddTransition).prop('disabled',!isEnabled);
			//$('.'+form.table.className+' #token-input-txt_transitions').prop('disabled',!isEnabled);
		};
		
		actionVal = cell.getAtt('action').nodeValue;
		// handles the toggling of input elements based on action
		var switchTo = function(){
			var escalateToRow = $(cmbAddTransition).parentsUntil('tbody');
			switch(actionVal){
			case '1': // NOT BEING USED
				$($(cmbScript).parents('tr')[0]).hide();
				$($(cmbTrans).parents('tr')[0]).hide();
				$($(cmbField).parents('tr')[0]).show();
				$($(chkEscalationNotify).parents('tr')[0]).hide();
				escalateToRow.hide().next().hide().next().hide();
				$('table.mxWindow').removeClass('extraWidth');
				$('div.mxWindow').removeClass('extraWidth');
				// $($('.'+form.table.className+' #token-input-txt_notify').parents('tr')[0]).show();
				//$($('.'+form.table.className+' #token-input-txt_transitions').parents('tr')[0]).show();
				break;
			case '2':
				$($(cmbScript).parents('tr')[0]).hide();
				$($(cmbTrans).parents('tr')[0]).hide();
				$($(cmbField).parents('tr')[0]).hide();
				$($(chkEscalationNotify).parents('tr')[0]).hide();
				escalateToRow.show().next().show().next().show();
				$('table.mxWindow').addClass('extraWidth');
				$('div.mxWindow').addClass('extraWidth');
				//$($('.'+form.table.className+' #token-input-txt_transitions').parents('tr')[0]).show();
				break;
			case '3':
				$($(cmbScript).parents('tr')[0]).hide();
				$($(cmbTrans).parents('tr')[0]).show();
				$($(cmbField).parents('tr')[0]).hide();
				$($(chkEscalationNotify).parents('tr')[0]).show();
				escalateToRow.hide().next().hide().next().hide();
				$('table.mxWindow').removeClass('extraWidth');
				$('div.mxWindow').removeClass('extraWidth');
				//$($('.'+form.table.className+' #token-input-txt_transitions').parents('tr')[0]).hide();
				break;
			case '4':
				$($(cmbScript).parents('tr')[0]).show();
				$($(cmbTrans).parents('tr')[0]).hide();
				$($(cmbField).parents('tr')[0]).hide();
				$($(chkEscalationNotify).parents('tr')[0]).show();
				escalateToRow.hide().next().hide().next().hide();
				$('table.mxWindow').removeClass('extraWidth');
				$('div.mxWindow').removeClass('extraWidth');
				//$($('.'+form.table.className+' #token-input-txt_transitions').parents('tr')[0]).hide();
				break;
			default:
				$($(cmbScript).parents('tr')[0]).hide();
				$($(cmbTrans).parents('tr')[0]).hide();
				$($(cmbField).parents('tr')[0]).hide();
				$($(chkEscalationNotify).parents('tr')[0]).hide();
				escalateToRow.hide().next().hide().next().hide();
				$('table.mxWindow').removeClass('extraWidth');
				$('div.mxWindow').removeClass('extraWidth');
				//$($('.'+form.table.className+' #token-input-txt_transitions').parents('tr')[0]).hide();
				break;
			}
		};
		
		// enabled switch
		var chkEnabled = createSliderCheckboxField(graph, form, cell, 'escalationEnabled', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'escalationEnabled', chkEnabled.checked);
			}
			finally {
				model.endUpdate();
			}
			showStateOverlays(graph, model);
			isEnabled = chkEnabled.checked;
			toggleInputs();
		});
		
		// number counter for delay
		var cmbDelay = createNumberCounterField(graph, form, cell, 'escalationDelay', tagName, 1, 60, 3, mxResources.get('days'), function(){
			var model = graph.getModel();
			model.beginUpdate();
			try {
				changeCellAttribute(model, cell, 'escalationDelay', cmbDelay.value);
			}
			finally {
				model.endUpdate();
			}
		});
		
		// weekend inclusion switch
		var chkWkends = createCheckboxField(graph, form, cell, 'includeWeekends', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'includeWeekends', chkWkends.checked);
			}
			finally {
				model.endUpdate();
			}
		});
		
		// action select
		var actionOptions = convertObjectsToOptions([
			/*{val:'1',name:mxResources.get('chooseUser')}
			,*/{val:'2',name:mxResources.get('escalateTo')}
			,{val:'3',name:mxResources.get('execTransition')}
			,{val:'4',name:mxResources.get('runScript')}
		], 'val', 'name');
		var cmbAction = createTextField(graph, form, cell, 'action', 'addSelect', tagName, actionOptions, function() {
			var model = graph.getModel();
			model.beginUpdate();
			try {
				changeCellAttribute(model, cell, 'action', cmbAction.value);
			}
			finally {
				model.endUpdate();
			}
			actionVal = cmbAction.value;
			switchTo();
		});
		
		// script select
		var scriptOptions = convertObjectsToOptions(mxConstants.scripts.action, 'uniqueName', 'uniqueName');
		var cmbScript = createTextField(graph, form, cell, 'escalationScript', 'addSelect', tagName, scriptOptions, function() {
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'escalationScript', cmbScript.value);
			}
			finally {
				model.endUpdate();
			}
		});
		$($(cmbScript).parents('tr')[0]).hide();
		
		// notification
		var chkEscalationNotify = createCheckboxField(graph, form, cell, 'escalationNotify', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'escalationNotify', chkEscalationNotify.checked);
			}
			finally {
				model.endUpdate();
			}
		});
		
		// transition select
		var transOptions,cmbTrans;
		
		// field select
		var fieldOptions,cmbField;
		
		$.get('/api/v2/workspaces/'+workspaceId,function(data){
			var fields = data.itemFieldDefinitions;
			var fieldsarr = new Array();
			for(var i=0;i<fields.length;i++){
				var field = fields[i];
				if(field.fieldTypeId=='PICK_LIST_FIRST_VALUE_DEFAULT'&&field.visible=='ALWAYS'){
					fieldsarr.push({
						val:field.id,
						name:field.displayName
					});
				}
			}
			fieldOptions = convertObjectsToOptions(fieldsarr, 'val', 'name');
			cmbField = createTextField(graph, form, cell, 'field', 'addSelect', tagName, fieldOptions, function() {
				var model = graph.getModel();
				model.beginUpdate();
				try {
					changeCellAttribute(model, cell, 'field', cmbField.value);
				}
				finally {
					model.endUpdate();
				}
			});
			$($(cmbField).parents('tr')[0]).insertAfter($($(cmbAction).parents('tr')[0]))
			$($(cmbField).parents('tr')[0]).hide();
			switchTo();
		});

		/*
		 * "escalate to" ui
		 *
		 */
		// get a list of all available transitions and sort them
		var getAndSortAvailableTransitions = function(stateId) {
			// checks if transition has been added to the DOM (list of transitions that are going to be escalated - BEFORE saving the panel)
			var targetTransitions = $(form.table).find('#escalateto-table').find('tbody').children('tr');

			var escalatedTransitions = $.map(targetTransitions, function(element, index) {
				return $(element).attr('id');
			});

			// parse the raw array (the one contaning the list of all transitions), adding to a new
			// array only those who are outbound from this state and those who haven't been created as having an escalated state yet
			var transitionsRawArr = getTransitionsFromGraph(graph);
			var transitionsParsedArr = $.grep(transitionsRawArr, function(element, index) {
				// breaks out if found that this transition has already been added to the list of the ones to be escalated
				for (var node in escalatedTransitions) {
					if (element.transitionID == escalatedTransitions[node]) {
						return false;
					}
				}

				// it's not in the list of transitions to be escalated, and it's outbound from this state, so add it to the list of valid transitions to pick from
				if (element.fromState != undefined) {
					if (element.fromState.stateID == stateId) {
						return true;
					};
				};
			});

			transitionsParsedArr.sort(function(a, b){
				if(a.shortName < b.shortName) {
					return -1;
				};
				if (a.shortName > b.shortName) {
					return 1;
				};
				return false;
			});

			return transitionsParsedArr;
		};

		// creates the rows for transitions
		var createEscalateTransition = function(type, transition) {
			if (type == 'header') {
				var escalateRow = form.addTableCell(1);
				
				var table = $('<table id="escalateto-table" />'),
					tr = $('<tr />'),
					td1 = $('<td />').append(_plm.messages.mxworkflow.escalateto.header.transition()),
					td2 = $('<td />').append(_plm.messages.mxworkflow.escalateto.header.permission()),
					ipsIcon = $('<img />').attr('src', '/images/icons/ignore_preconditionscript_16.png').attr('title', _plm.messages.mxworkflow.escalateto.header.ignoreprecondscripts()),
					td3 = $('<td />').append(ipsIcon),
					td4 = $('<td />').append('&nbsp;');
				tr.append(td1).append(td2).append(td3).append(td4);
				table.append(tr);

				$(escalateRow).append(table);
			} else if (type == 'row') {
				var targetTable = $(form.table).find('#escalateto-table');

				if (transition == null) { // no transitions, table is empty
					var tr = $('<tr />'),
						td = $('<td colspan="4" />').addClass('no-escalations').text(_plm.messages.mxworkflow.escalateto.emptystate());
					tr.append(td);
					targetTable.append(tr);
				} else {
					// remove empty state row (if it exists)
					targetTable.find('.no-escalations').parent().remove();

					var transitionCell = graph.getModel().getCell('transition_' + transition.transitionID);
					var targetTransitionId = transition.transitionID;
					//var transitionAttr = null;
					// if (transition.transitionID == undefined) {
					// 	transitionAttr = transition.newTransitionID;
					// 	transitionCell = graph.getModel().getCell(transition.newTransitionID);
					// } else {
					// 	transitionAttr = transition.transitionID;
					// 	transitionCell = graph.getModel().getCell('transition_' + transition.transitionID);
					// };
					if (transitionCell == undefined) {
						transitionCell = graph.getModel().getCell(transition.newTransitionID);
						targetTransitionId = transition.newTransitionID;
					};
					// adds new row with components
					var tr = $('<tr />').attr('id', targetTransitionId),
						td1 = $('<td />').text(transition.shortName);

					var	permissionsOptions = convertObjectsToOptions(mxConstants.permissions, 'permissionID', 'shortName');
					// adds the "create permission" separator and item to the end of the list
					permissionsOptions.push({
						label: '――――――――――',
						value: '-'
					},
					{
						label: mxResources.get('newPermission'),
						value: 'create_new_permission'
					});

					// remove the transition's permission ("permissionID") from the dropdown by default (therefore, forcing the user to select/create a different one)
					for (var p in permissionsOptions) {
						if (transition.permissionID == permissionsOptions[p].value) {
							permissionsOptions.splice(p, 1);
						};

						// remove the newly-created permission for the escalated permission
						if ((transition.newPermissionID != undefined) && (permissionsOptions[p].value != '-')) {
							if ((transition.newPermissionID).indexOf('@') != -1) {
								permissionsOptions.splice(p, 1);
							};
						};
					};
					
					var cmbPermissionsDropdown = createInlineSelect(graph, form, transitionCell, 'escalationPermissionId', 'addInlineSelect', permissionsOptions, function() {
							if (cmbPermissionsDropdown.value != 'create_new_permission') {

								setErrorForEscalatedTransitions(graph, form, cell);

								// now change the permission
								changeEscalationPermission(graph, transitionCell, cmbPermissionsDropdown.value);
							} else {
								// code copied from onClickCreatePermission, customized for this single row
								$(cmbPermissionsDropdown).hide();
								var cmb = $(this);
								$('option:selected', cmb).removeAttr("selected");
								// removes "create new permission" option and its divider
								cmb.find('option[value="-"]').remove();
								cmb.find('option[value="create_new_permission"]').remove();
								// converts to editable select
								cmb.editableSelect({ 
									hint: mxResources.get('permission.name.tip'),
									items_then_scroll: 5,
									onBlur: function() {
										setErrorForEscalatedTransitions(graph, form, cell);
										graph.validateGraph(cell);
									}
								});
								$(this).parent().find('#cmb_escalationPermissionId.editable-select').inputHints();
								$(this).parent().find('#cmb_escalationPermissionId').show();
								changeEscalationPermission(graph, transitionCell, '');
								
							};
						}, true),
						td2 = $('<td />').append(cmbPermissionsDropdown),

						ignoreEscalatedPreconditions = createInlineCheckboxField(graph, form, transitionCell, 'ignoreEscalatedPreconditions'),
						td3 = $('<td />').append(ignoreEscalatedPreconditions),

						deleteIcon = $('<img />').attr('src', '/images/icons/deleteitem_16.png').attr('title', _plm.messages.mxworkflow.escalateto['delete']()).on('click', function(event) {
							addTransitionToSelect($(event.target).parent().parent(), transitionCell);
						}),
						td4 = $('<td />').append(deleteIcon);

					tr.append(td1).append(td2).append(td3).append(td4);
					targetTable.find('tbody').append(tr);

					var _t = window.setTimeout(function() { // small delay to allow for rendering (FF/IE)
						setErrorForEscalatedTransitions(graph, form, cell);
						window.clearTimeout(_t);
					}, 100);

					// call method to remove the transition from the dropdown
					removeTransitionFromSelect(transition.customID);
				};
			}; 			
		};

		// remove transitions from the select, add it to the list of escalated transitions
		var removeTransitionFromSelect = function(transitionId) {
			var targetSelect = $(form.table).find('#cmb_addTransition');
			targetSelect.find('option[value="' + transitionId + '"]').remove();
			// disable the dropdown if there are no remaining options on it
			if (targetSelect.children().length == 1) {
				var _t = window.setTimeout(function() { // small delay to allow for rendering 
					targetSelect.attr('disabled', 'disabled');
					window.clearTimeout(_t);
				}, 100);
			};
		};

		// remove transitions from the list of escalated transitions, add it back to the select
		var addTransitionToSelect = function(row, transitionCell) {
			var targetSelect = $(form.table).find('#cmb_addTransition');

			// reset "escalationPermissionId" for the transition back to its "permissionID"
			changeEscalationPermission(graph, transitionCell, transitionCell.getAttribute('permissionID'));

			// reset "ignoreEscalatedPreconditions" to false
			changeCellAttribute(graph.getModel(), transitionCell, 'ignoreEscalatedPreconditions', 'false');

			// remove row from the DOM
			row.remove();

			// rebuild select, since the transition was removed from the list
			var availableTransitions = getAndSortAvailableTransitions(formatCellId(cell.id));
			var transitionOptions = convertObjectsToOptions(availableTransitions, 'customID', 'shortName');

			fillInOptions(form, targetSelect[0], transitionOptions, '');

			// re-enables the select
			targetSelect.removeAttr('disabled');

			// re-validates the remaining escalated transitions
			setErrorForEscalatedTransitions(graph, form, cell);
			
		};

		var availableTransitions = getAndSortAvailableTransitions(formatCellId(cell.id));
		var transitionOptions = convertObjectsToOptions(availableTransitions, 'customID', 'shortName');
		// add an attribute to the cell just configure the dropdown
		cell.setAttribute('addTransition', '');
		var cmbAddTransition = createTextField(graph, form, cell, 'addTransition', 'addSelect', tagName, transitionOptions, function(event) {

			if ((event.type == 'change')) {
				// retrieves the selected transition on the dropdown from the json
				var targetTransition = $.grep(getTransitionsFromGraph(graph), function(element, index) {
					if (cmbAddTransition.value == element.customID) {
						return true;
					};
				});
				// calls the method to create the row (and remove it from the dropdown) with the selected transition
				createEscalateTransition('row', targetTransition[0]);
			};
			$(cmbAddTransition).blur(); // forces unselection the dropdown
		});

		// creates the table header for the 'escalate to' option (and a row to accomodate the table for the transitions
		createEscalateTransition('header', null);

		// create a temporary array of transitions that should be in the list of ones that were already escalated
		var transitionsToCreateOnLoad = $.grep(getTransitionsFromGraph(graph), function(element, index) {
			// it's not in the list of transitions to be escalated, and it's outbound from this state, so add it to the list of valid transitions to pick from
			if (element.fromState != undefined) {
				//console.log(element, element.fromState.stateID, formatCellId(cell.id), element.escalationPermissionId, element.permissionID);
				if ((element.fromState.stateID == formatCellId(cell.id)) && (element.escalationPermissionId != element.permissionID)) {
					return true;
				};
			};
		});
		
		// adds the existing escalated transitions to the list (in case any exist)
		if (transitionsToCreateOnLoad.length == 0) {
			createEscalateTransition('row', null);
		} else {
			$.each(transitionsToCreateOnLoad, function(index, element) {
				createEscalateTransition('row', element);
			});
		};

		//console.log('Data being loaded:', 'states:', getStatesFromGraph(graph), 'transitions:', getTransitionsFromGraph(graph), 'permissions:', mxConstants.permissions, 'escalationEvents', mxConstants.escalationEvents);

		// notification flag for 'escalate to'
		var chkEscalationNotifyAll = createCheckboxField(graph, form, cell, 'escalationNotifyAll', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'escalationNotifyAll', chkEscalationNotifyAll.checked);
			}
			finally {
				model.endUpdate();
			}
		});
		
		var transitionsdata = getTransitionsFromGraph(graph);
		var transitionsOptions = new Array();
		var preOpts = new Array();
		var selected = cell.getAtt('transitions').nodeValue;
		selected = selected.split(',');
		for(var i=0;i<transitionsdata.length;i++){
			if(transitionsdata[i].fromState){
				var obj = {
					id:transitionsdata[i].customID,
					name:transitionsdata[i].shortName
				};
				if(transitionsdata[i].fromState.stateID==formatCellId(cell.id)){
					transitionsOptions.push(obj);
					for(var j=0;j<selected.length;j++){
						if(selected[j]==obj.id){
							preOpts.push(obj);
							break;
						}
					}
				}
			}
		}

		transOptions = convertObjectsToOptions(transitionsOptions, 'id', 'name');
		cmbTrans = createTextField(graph, form, cell, 'transition', 'addSelect', tagName, transOptions, function() {
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'transition', cmbTrans.value);
			}
			finally {
				model.endUpdate();
			}
		});
		$($(cmbTrans).parents('tr')[0]).insertAfter($($(cmbAction).parents('tr')[0]));
		$($(cmbTrans).parents('tr')[0]).hide();
		// toggle disabled once more for transitions
		toggleInputs();
		switchTo();
		
		// set disabled of inputs
		toggleInputs();
		switchTo();
	}

	/**
	 * Function: createEscalatedTransitionForm
	 * 
	 * Add the escalated state form for the transition (user still has to enable/disable from the State Properties panel)
	 */
	function createEscalatedTransitionForm(graph, form, cell, tagName) {

		// get the state from where this transition is coming out
		var allTransitions = getTransitionsFromGraph(graph);
		var thisTransition = null,
			transitionAttr = null;

		if (cell.getAttribute('transitionID') == undefined) {
			transitionAttr = 'newTransitionID';
		} else {
			transitionAttr = 'transitionID';
		};
		for (var i in allTransitions) {
			if (allTransitions[i][transitionAttr] == formatCellId(cell.id)) {
				thisTransition = allTransitions[i];
			};
		};

		// if this is still null at this point, either the user clicked on the first transition (the one that comes out from the blue box)
		// or a transition couldn't be found
		if ((thisTransition == null) || (thisTransition.fromState == undefined)) {
			console.error('ERROR, SHOULD BREAK HERE');
		};
		var stateCell = graph.getModel().getCell('state_' + thisTransition.fromState.stateID);

		// changes the attribute for this transition to "true" if a state was escalated to this transition (for validation purposes)
		if (cell.getAttribute('permissionID') != cell.getAttribute('escalationPermissionId')) {
			changeCellAttribute(graph.getModel(), cell, 'escalationTransitionEnabled', 'true');
		};

		// change escalatepermission for this escalation
		var permissionsOptions = convertObjectsToOptions(mxConstants.permissions, 'permissionID', 'shortName');
		// remove "permissionID" option from the list (since "escalationPermissionId" HAS to be different)
		for (var p in permissionsOptions) {
			if (cell.getAttribute('permissionID') == permissionsOptions[p].value) {
				permissionsOptions.splice(p, 1);
			}
		};
		var cmbPermissions = createTextField(graph, form, cell, 'escalationPermissionId', 'addSelect', tagName, permissionsOptions, function() {
			changeEscalationPermission(graph, cell, cmbPermissions.value);
		});
		createButtonField(graph, form, cell, 'newEscalationPermission', 'newEscalationPermission', onClickCreateEscalationPermission);

		// ignore pre-condition scripts
		var chkIgnorePreconditionScripts = createCheckboxField(graph, form, cell, 'ignoreEscalatedPreconditions', tagName, function(){
			var model = graph.getModel();
			model.beginUpdate(); 	        
			try {
				changeCellAttribute(model, cell, 'ignoreEscalatedPreconditions', chkIgnorePreconditionScripts.checked);
			}
			finally {
				model.endUpdate();
			}
		});
	};
	
	/**
	 * Function: createTransitionForm
	 * 
	 * Add the necessary input elements to the properties form to fill 
	 * in the transitions related data.
	 */
	function createTransitionForm(graph, form, cell, tagName) {
		var txtCustomID, txtShortName, shortNameChanged;
		
		//if is a new transition, then it will create a customID automatically.
		if (cell.id.indexOf('@') == 0) {
			var cells = obtainCells(graph, 'transition');
			shortNameChanged = function() {
				shortNameChangedHandler(cells, 'transition', graph, cell, 'shortName', txtShortName, true, txtCustomID);
			};
		}
		
		if (graph.showIdsTemp) {
			createIdField(graph, form, cell);
		}
		
		txtShortName = createTextField(graph, form, cell, 'shortName', 'addText', tagName, null, null, true, shortNameChanged);
		
		if (graph.showIdsTemp) {
			txtCustomID = createTextField(graph, form, cell, 'customID', 'addText', tagName, null, function() {
				customIDChangedHandler('transition', graph, cell, 'customID', txtCustomID);
			});
		}

		createTextField(graph, form, cell, 'longName', 'addTextarea', tagName);
		createCheckboxField(graph, form, cell, 'hidden', tagName, onClickHide);
		
		var permissionsOptions = convertObjectsToOptions(mxConstants.permissions, 'permissionID', 'shortName');
		var cmbPermissions = createTextField(graph, form, cell, 'permissionID', 'addSelect', tagName, permissionsOptions, function() {
			changePermission(graph, cell, cmbPermissions.value);
		});
		
		createButtonField(graph, form, cell, 'newPermission', 'newPermission', onClickCreatePermission);
		
		var scriptConditionOptions = convertObjectsToOptions(mxConstants.scripts.condition, 'ID', 'uniqueName');
		createTextField(graph, form, cell, 'scriptConditionId', 'addSelect', tagName, scriptConditionOptions);
		createLockedTextField(graph, form, cell, 'precondition', tagName);

		//createScriptField(graph, form, cell, 'preCondition', 'addText', tagName);
		
		var scriptvalidationOptions = convertObjectsToOptions(mxConstants.scripts.validation, 'ID', 'uniqueName');
		createTextField(graph, form, cell, 'scriptValidationId', 'addSelect', tagName, scriptvalidationOptions);
		createLockedTextField(graph, form, cell, 'validator', tagName);
		
		//createScriptField(graph, form, cell, 'validatorClassName', 'addText', tagName);
		
		var titleTransitionPerformed = $(form.addTableCell(2));
		titleTransitionPerformed
			.text(mxResources.get('title.performed'))
			.addClass('titleText');
		
		var scriptActionOptions = convertObjectsToOptions(mxConstants.scripts.action, 'ID', 'uniqueName');
		createTextField(graph, form, cell, 'scriptActionId', 'addSelect', tagName, scriptActionOptions);
		createLockedTextField(graph, form, cell, 'action', tagName);
		
		createCheckboxField(graph, form, cell, 'email', tagName);
		
		var titleTransitionAvailable = $(form.addTableCell(2));
		titleTransitionAvailable
			.text(mxResources.get('title.available'))
			.addClass('titleText');		
		
		createCheckboxField(graph, form, cell, 'outstanding', tagName);
		createCheckboxField(graph, form, cell, 'notifyPerformers', tagName);
		createCheckboxField(graph, form, cell, 'passwordApproval', tagName);
		
		var commentOptions = convertObjectsToOptions(mxConstants.commentoptions, 'ID', 'name');
		createTextField(graph, form, cell, 'commentsForApproval', 'addSelect', tagName, commentOptions);
		
		var saveStepLabel = createTextField(graph, form, cell, 'saveStepLabel', 'addText', tagName, null, null, true, null);
		
		var button = createButtonField(graph, form, cell, 'showAdvancedMode', 'showIds', function() {
			toggleAdvancedMode(graph, true);
		});
		
		if (graph.showIdsTemp) {
			$(button).addClass('on');
		}
	}
	
	/**
	 * Function: onClickCreatePermission
	 * 
	 * Runs when user clicks on Create Permission button on a 
	 * transition's Properties Panel
	 */
	function onClickCreatePermission(graph, form, cell, input) {
		$(input).hide();
		var cmb = $('#cmb_permissionID');
		$("option:selected", cmb).removeAttr("selected");
		cmb.editableSelect({ 
			hint: mxResources.get('permission.name.tip'),
			items_then_scroll: 5,
			onBlur: function() {
				graph.validateGraph(cell);
			}
		});
		$('#cmb_permissionID.editable-select').inputHints();
		changePermission(graph, cell, '');
	}

	/**
	 * Function: onClickCreateEscalationPermission
	 * 
	 * Runs when user clicks on Create Permission button on a 
	 * transition's Properties Panel
	 */
	function onClickCreateEscalationPermission(graph, form, cell, input) {
		$(input).hide();
		var cmb = $('#cmb_escalationPermissionId');
		$("option:selected", cmb).removeAttr("selected");
		cmb.editableSelect({ 
			hint: mxResources.get('permission.name.tip'),
			items_then_scroll: 5,
			onBlur: function() {
				graph.validateGraph(cell);
			}
		});
		$('#cmb_escalationPermissionId.editable-select').inputHints();
		changeEscalationPermission(graph, cell, '');
	}
	
	/**
	 * Function: setErrorForEscalatedTransitions
	 *
	 * Checks if all escalated transitions have permissions assigned to them, creating an attribute that's going to be observed for validation
	 */
	function setErrorForEscalatedTransitions(graph, form, cell) {
		var targetTable = $(form.table).find('#escalateto-table'),
			targetSelects = targetTable.find('select#cmb_escalationPermissionId'),
			targetInputs = targetTable.find('input#cmb_escalationPermissionId');

		// reset validations to 'false'
		cell.setAttribute('escalatedTransitionsError', 'false');

		$.each(targetSelects, function(index, element) {
			var _value = $(element).find('option:selected').val();
			if (( _value== '') || (_value == '0') || (_value == undefined)) {
				cell.setAttribute('escalatedTransitionsError', 'true');
			};
		});

		$.each(targetInputs, function(index, element) {
			var _value = $(element).val();
			if ((_value == mxResources.get('permission.name.tip')) || ( _value== '') || (_value == '0') || (_value == undefined)) {
				cell.setAttribute('escalatedTransitionsError', 'true');
			};
		});
		
		graph.validateGraph(cell);
	};

	/**
	 * Function: onClickHide
	 *
	 * Runs when user checks the "Hide in online map" property.
	 */
	function onClickHide(model, graph, cell){
		hideCell(cell);
	}
		
	/**
	 * Function: hideCell
	 * 
	 * Styles as hidden the given state or transition.
	 */
	function hideCell(cell, hiddenIE8) {
		var styles = {
			state: {
				visible: 'defaultVertex',
				hidden: 'hiddenVertex'
			},
			transition: {
				visible: 'edge',
				hidden: 'hiddenEdge'
			},
			note: {
				visible: 'note',
				hidden: 'hiddenNote'
			}
		};
		
		if (cell != undefined) {
			var tagName = cell.value.tagName;
			var status = cell.getAttribute('hidden') == 'false' ? 'visible' : 'hidden';
			if (cell.style != 'currentVertex') {
				editor.graph.getModel().setStyle(cell, styles[tagName][status]);
			}
			
			if(hiddenIE8!=undefined && cell.style != 'currentVertex'){
				if(hiddenIE8)
					status= 'hidden';
				else
					status = 'visible';
				
				editor.graph.getModel().setStyle(cell, styles[tagName][status]);
			}
		}	
	}
	
	/**
	 * Function: createNoteForm
	 * 
	 * Add the necessary input elements to the properties form to fill 
	 * in the notes related data.
	 */
	function createNoteForm(graph, form, cell, tagName) {
		createTextField(graph, form, cell, 'text', 'addTextarea', tagName, null, null, true);
		createCheckboxField(graph, form, cell, 'hidden', tagName, onClickHide);
	}
	
	/**
	 * Function: changePermission
	 * 
	 * Modifies a transition cell with the given permissionID
	 */
	function changePermission(graph, cell, permissionID) {
		updateTransitionsCounter(cell,permissionID);
		var model = graph.getModel();
		model.beginUpdate();
		
		try {
			// var oldValue = cell.getAttribute('permissionID');
			// var escValue = cell.getAttribute('escalationPermissionId');

			changeCellAttribute(model, cell, 'permissionID', permissionID);
			
			// if there's no escalation, keep the two permission values in sync
			if (cell.getAttribute('escalationTransitionEnabled') == 'false') {
				changeCellAttribute(model, cell, 'escalationPermissionId', permissionID);
			};

		}
		finally {
			model.endUpdate();
		}
	}

	/**
	 * Function: changeEscalationPermission
	 * 
	 * Modifies a transition cell with the given escalationPermissionId
	 */
	function changeEscalationPermission(graph, cell, escalationPermissionId) {
		updateTransitionsCounter(cell, escalationPermissionId);

		var model = graph.getModel();
		model.beginUpdate();
		
		try {
			changeCellAttribute(model, cell, 'escalationPermissionId', escalationPermissionId);
		}
		finally {
			model.endUpdate();
		};
	}
	
	/**
	 * Function: createSliderCheckboxField
	 * 
	 * Creates the checkbox with slider background for the given property.
	 */
	function createSliderCheckboxField(graph, form, cell, att, labelPrefix, callback) {
		var attribute = cell.getAtt(att);
				
		if (attribute != undefined) {
			var label = mxResources.get(labelPrefix + '.' + attribute.nodeName) || '';
			var input = form.addSliderCheckbox(attribute.nodeName, label, attribute.nodeName, attribute.nodeValue);
			
			var applyHandler = function(evt) {
				var model = graph.getModel();
				var newValue = $(input).is(':checked');
				$(input).parent().toggleClass('checked');
				var oldValue = cell.getAttribute(attribute.nodeName);
	
				model.beginUpdate();
				
				try {
					changeCellAttribute(model, cell, attribute.nodeName, newValue);
					
					if (callback != undefined) {
						callback(graph, model, cell);
					}
				}
				finally {
					model.endUpdate();
				}
			}; 
	
			mxEvent.addListener(input, 'keypress', function (evt) {
				if (evt.keyCode == /*space*/32) {
					input.click();
				}
			});
	
			//FIX ME ON IE
			mxEvent.addListener(input, 'click', applyHandler);
			return input;
		}
	}

	/**
	 * Function: createCheckboxField
	 * 
	 * Creates the checkbox for the given property.
	 */
	function createCheckboxField(graph, form, cell, att, labelPrefix, callback) {
		var attribute = cell.getAtt(att);
				
		if (attribute != undefined) {
			var label = mxResources.get(labelPrefix + '.' + attribute.nodeName) || '';
			var input = form.addCheckbox(attribute.nodeName, label, attribute.nodeName, attribute.nodeValue);
			
			var applyHandler = function(evt) {
				var model = graph.getModel();
				var newValue = $(input).is(':checked');
				var oldValue = cell.getAttribute(attribute.nodeName);
	
				model.beginUpdate();
				
				try {
					changeCellAttribute(model, cell, attribute.nodeName, newValue);
					
					if (callback != undefined) {
						callback(graph, model, cell);
					}
				}
				finally {
					model.endUpdate();
				}
			}; 
	
			mxEvent.addListener(input, 'keypress', function (evt) {
				if (evt.keyCode == /*space*/32) {
					input.click();
				}
			});
	
			//FIX ME ON IE
			mxEvent.addListener(input, 'click', applyHandler);
			return input;
		}
	}
	
	/**
	 * Function: createInlineCheckboxField
	 * 
	 * Creates the inline checkbox for the given property (without a label)
	 */
	function createInlineCheckboxField(graph, form, cell, att, callback) {
		var attribute = cell.getAtt(att);
		if (attribute != undefined) {
			var input = form.addInlineCheckbox(attribute.nodeName, attribute.nodeName, attribute.nodeValue);
			
			var applyHandler = function(evt) {
				var model = graph.getModel();
				var newValue = $(input).is(':checked');
				var oldValue = cell.getAttribute(attribute.nodeName);
	
				model.beginUpdate();
				
				try {
					changeCellAttribute(model, cell, attribute.nodeName, newValue);
					
					if (callback != undefined) {
						callback(graph, model, cell);
					}
				}
				finally {
					model.endUpdate();
				}
			}; 
	
			mxEvent.addListener(input, 'keypress', function (evt) {
				if (evt.keyCode == /*space*/32) {
					input.click();
				}
			});
	
			//FIX ME ON IE
			mxEvent.addListener(input, 'click', applyHandler);
			return input;
		}
	}

	/**
	 * Function: createTextField
	 * 
	 * Creates the field for the given property with the given type (input, textarea or select).
	 */	
	function createTextField(graph, form, cell, att, inputType, labelPrefix, options, handler, resize, keypressHandler) {
		var attribute = cell.getAtt(att);
		if (attribute != undefined) {
			var label = mxResources.get(labelPrefix + '.' + attribute.nodeName) || '';
			var input = form[inputType].call(form, attribute.nodeName, label, attribute.nodeValue, cell);
			if (options != undefined) {
				fillInOptions(form, input, options, attribute.nodeValue);
			}
			//Restrict the max length of the input field to avoid SQL exceptions
			if(att == 'shortName' && labelPrefix == 'state'){
				input.maxLength = 75;
			}
			if(att == 'shortName' && labelPrefix == 'transition'){
				input.maxLength = 150;	
			}
			if(att == 'saveStepLabel' && labelPrefix == 'transition'){
				input.maxLength = 50;
			}
			
			var applyHandler = handler != undefined ? handler : function() {
				var model = graph.getModel();
				var newValue = input.value || '';
				var oldValue = cell.getAttribute(attribute.nodeName, '');
	
				if (newValue != oldValue)  {
					model.beginUpdate();
					
					try {
						changeCellAttribute(model, cell, attribute.nodeName, newValue);
					}
					finally {
						model.endUpdate();
					}
					if (resize) {
						graph.updateCellSize(cell);
					}
				}
			}; 

//			//This does not work on IE
//			mxEvent.addListener(input, 'keypress', function (evt) {
//				// Needs to take shift into account for textareas
//				if (evt.keyCode == /*enter*/13 &&
//					!mxEvent.isShiftDown(evt)) {
//					input.blur();
//				}
//			});
	
			if (mxClient.IS_IE) {
				mxEvent.addListener(input, 'focusout', applyHandler);
			}
			else {
				// Note: Known problem is the blurring of fields in
				// Firefox by changing the selection, in which case
				// no event is fired in FF and the change is lost.
				// As a workaround you should use a local variable
				// that stores the focused field and invoke blur
				// explicitly where we do the graph.focus above.
				mxEvent.addListener(input, 'blur', applyHandler);
			}
			
			if(inputType == 'addSelect') {
				mxEvent.addListener(input,'change',applyHandler);
			}
			
			if (keypressHandler != null) {
				mxEvent.addListener(input, 'keyup', keypressHandler);
			}

			return input;
		}
	}

	/**
	 * Function: createInlineSelect
	 * 
	 * Creates the inline select (without label)
	 */	
	function createInlineSelect(graph, form, cell, att, inputType, options, handler, canCreateNewPermission, resize, keypressHandler) {
		var attribute = cell.getAtt(att);

		if (attribute != undefined) {
			var input = form.addInlineSelect(attribute.nodeName, attribute.nodeValue, cell);
			if (options != undefined) {
				fillInOptions(form, input, options, attribute.nodeValue);
			}
			
			var applyHandler = handler != undefined ? handler : function() {
				var model = graph.getModel();
				var newValue = input.value || '';
				var oldValue = cell.getAttribute(attribute.nodeName, '');
	
				if (newValue != oldValue)  {
					model.beginUpdate();
					
					try {
						changeCellAttribute(model, cell, attribute.nodeName, newValue);
					}
					finally {
						model.endUpdate();
					}
					if (resize) {
						graph.updateCellSize(cell);
					}
				}
			};
	
			if (mxClient.IS_IE) {
				mxEvent.addListener(input, 'focusout', applyHandler);
			} else {
				// see the note for createTextField
				mxEvent.addListener(input, 'blur', applyHandler);
			}
			
			if(inputType=='addInlineSelect'){
				mxEvent.addListener(input,'change',applyHandler);
			}
			
			if (keypressHandler != null) {
				mxEvent.addListener(input, 'keyup', keypressHandler);
			}

			return input;
		}
	}

	/**
	 * Function: create a number counter input
	 * 
	 */
	function createNumberCounterField(graph, form, cell, att, labelPrefix, minVal, maxVal, length, labelSuffix, callback) {
		var attribute = cell.getAtt(att);
				
		if (attribute != undefined) {
			var label = mxResources.get(labelPrefix + '.' + attribute.nodeName) || '';
			var suffix = (labelSuffix) || '';
			var input = form.addNumberInput(attribute.nodeName, label, attribute.nodeName, attribute.nodeValue, minVal, maxVal, length, suffix);
			
			var applyHandler = function(evt) {
				var model = graph.getModel();
				var value = cell.getAttribute(attribute.nodeValue);
	
				model.beginUpdate();
				
				try {
					changeCellAttribute(model, cell, attribute.nodeName, value);
					
					if (callback != undefined) {
						callback(graph, model, cell);
					}
				}
				finally {
					model.endUpdate();
				}
			};
	
			//FIX ME ON IE
			mxEvent.addListener(input, 'click', applyHandler);
			return input;
		}
	}
	
	/**
	 * Function: createScriptField
	 * 
	 * Creates the field for the given property 
	 */
	function createScriptField(graph, form, cell, att, inputType, labelPrefix) {
		var attribute = cell.getAtt(att);
		if (attribute != undefined) {
			if(attribute.value!=''){
								
				var input = form.addText('', '', attribute.nodeValue);
				input.setAttribute('disabled', 'disabled');
			}
		}
	}
	
	
	/**
	 * Function: createIdField
	 * 
	 * Creates a non-editable text field for the cell id. 
	 */
	function createIdField(graph, form, cell) {
		var label = mxResources.get('id');
		var value = formatCellId(cell.id);
		var input = form.addText('ID', label, value);
		input.setAttribute('disabled', 'disabled');
		return input;
	}
	
	/**
	 * Function: fillInOptions
	 * 
	 * Puts the given options in the indicated select (input) and selects 
	 * the correct value.
	 */
	function fillInOptions(form, input, options, value) {
		while (input.hasChildNodes()) {
			input.removeChild(input.firstChild);
		}
		//Since in the comments select we have a default value, we remove the blank option.
		if(input.id != "cmb_commentsForApproval"){
			form.addOption(input, '', '');
		}
		for (var i in options) {
			var option = options[i];
			form.addOption(input, option.label, option.value, (option.value == value));

			// if one of the options is a divider, disable it
			if (option.value == '-') {
				$(input).find('option[value="-"]').attr('disabled', 'disabled');
			};
		}
	}
	
	/**
	 * Function: createButtonField
	 * 
	 * Creates a button in the given form linked to the given cell 
	 * attribute and calls the handler function on click.
	 */
	function createButtonField(graph, form, cell, id, text, handler) {
		var label = mxResources.get(text) || '';
		var input = form.addButton(id, label, id);
		
		var applyHandler = function() {
			handler(graph, form, cell, input);
		};
		
		mxEvent.addListener(input, 'click', applyHandler);
		return input;
	}

	/**
	 * Function: createButtonsField
	 * 
	 * Creates multiple buttons on the same row, in the given form linked to the given cell 
	 * attribute, and calls the handler function on click.
	 */
	function createButtonsField(graph, form, cell, id, text, handler) {

		var buttonContainer = form.addTableCell(1);

		$.each(id, function(i, e) {
			var label = mxResources.get(text[i]) || '';
			var input = form.addButtonOnly(id[i], label, id[i]);
			
			var applyHandler = function() {
				var _handler = handler[i];
				_handler(graph, form, cell, input);
			};
			
			mxEvent.addListener(input, 'click', applyHandler);

			$(buttonContainer).append(input);
		});

		return buttonContainer;
	}	
	
	/**
	 * Function: createLockedTextField
	 * 
	 * Creates an uneditable textfield for the given cell attribute.
	 */
	function createLockedTextField(graph, form, cell, att) {
		var attribute = cell.getAtt(att);
		if (attribute != undefined && attribute.nodeValue != '') {
			var input = form.addText('', attribute.nodeValue);
			input.setAttribute('disabled', 'disabled');
		}
	}
	
	/**
	 * Function: obtainCells
	 * 
	 * Runs through the graph model looking for a particular type of cell 
	 * value (tagname).
	 */
	function obtainCells(graph, tagName) {
		var model = graph.getModel();
		var filter = function(cell) {
			if (cell.value != undefined) {
				return (cell.value.tagName == tagName);
			}
			return false;
		}
		return model.filterDescendants(filter);
	}
	
	/**
	 * Function: addStateOverlay
	 * 
	 * Creates and adds the given image as an overlay for the indicated state.
	 */
	function addStateOverlay(graph, state, imageName, tooltip, width, height, x, y, align) {
		var img = new mxImage('/scripts/mxGraph/images/workflow/' + imageName, width, height);
		
		if(!mxClient.IS_SVG){
			imageName = imageName.substring(0,imageName.lastIndexOf('.'))+'.png';
			var img = new mxImage('/scripts/mxGraph/images/workflow/' + imageName, width, height);
		}
		var overlay = new mxCellOverlay(
			img, 
			mxResources.get(tooltip), 
			align, 
			mxConstants.ALIGN_TOP, 
			new mxPoint(x, y)
		);
		//If this is the WF Map, we remove the help cursor since we don´t want the tooltip
		if (editor.isMap) {
			overlay.cursor = 'default';
		}
		
		graph.addCellOverlay(state, overlay);
	}
	
	function changeCellAttribute(model, cell, attributeName, attributeValue) {
		//console.log("Changing cell attribute:", arguments);
		edit = new mxCellAttributeChange(
				cell, attributeName,
				attributeValue);
		model.execute(edit);
	}
	
	/**
	 * Function: showStateOverlays
	 * 
	 * Runs through the states in the graph showing the corresponding 
	 * overlay for managed and locked states, making sure that only one of 
	 * each exists at the time.
	 */
	function showStateOverlays(graph, model, editingState) {
		var states = obtainCells(graph, 'state');
		for (var i=0; i<states.length;i++) {
			var state = states[i];
			var x = 0;
			graph.clearCellOverlays(state);
			if (editingState != undefined && state.id != editingState.id) {
				if (editingState.getAttribute('cmStateID') == 'true') {
					changeCellAttribute(model, state, 'cmStateID', 'false');
				} 
				if (editingState.getAttribute('lockStateID') == 'true') {
					changeCellAttribute(model, state, 'lockStateID', 'false');
				} 
			}
			if (state.getAttribute('reminderNotifications')=='true') {
				addStateOverlay(graph, state, 'notifications.svg', 'state.reminderNotifications', 20, 20, x, 0, mxConstants.ALIGN_RIGHT);
				x -= 20;
			}
			if (state.getAttribute('escalationEnabled') == 'true'&&mxConstants.escalationEnabled) {
				addStateOverlay(graph, state, 'escelations.svg', 'state.escalationEnabledLabel', 20, 20, x, 0, mxConstants.ALIGN_RIGHT);
				x -= 20;
			}
				if (state.getAttribute('cmStateID') == 'true') {
					addStateOverlay(graph, state, 'managed_state.svg', 'state.cmStateID', 20, 20, x, 0, mxConstants.ALIGN_RIGHT);
					x -= 20;
				}
				if (state.getAttribute('lockStateID') == 'true') {
					addStateOverlay(graph, state, 'Locked.svg', 'state.lockStateID', 20, 20, x, 0, mxConstants.ALIGN_RIGHT);
				}
			
		}
	};
	
	function updateTransitionsCounter(cell, permissionID){
		var previousPermissionID = cell.getAttribute("permissionID");

		//no permission previously selected and no permission currently selected
		if(previousPermissionID == null && permissionID == "")
			return;
		
		//no changes
		if(previousPermissionID != null && permissionID == previousPermissionID)
			return;
		
		if(previousPermissionID != null){
			var previousPermission = mxPermissionsPanel.getPermissionById(mxConstants.permissions, previousPermissionID);
			previousPermission.transactionsUsingThisPermission--;
		}
		
		if(permissionID != ""){
			var currentPermission = mxPermissionsPanel.getPermissionById(mxConstants.permissions, permissionID);
			currentPermission.transactionsUsingThisPermission++;
		}
			
	};

	/**
	 * Function: toggleAdvancedMode
	 * 
	 * Shows or hides the ID and Script Id fields in the Properties Panel.
	 */
	function toggleAdvancedMode(graph, temp) {
		if (temp) {
			graph.showIdsTemp = !graph.showIdsTemp;
		} else {
			graph.showIds = !graph.showIds;
			$('#btn_showIds').toggleClass('on');
			graph.showIdsTemp = graph.showIds;
			if(mxSummaryPanel.isVisible()){
				mxSummaryPanel.type =  graph.showIds;
				mxSummaryPanel.rerenderSummary();
			}
		}
		$('#btn_showAdvancedMode').toggleClass('on');
		//Reopen properties panel, if it was visible.
		var cells = graph.getSelectionModel().cells;
		if (cells != null && cells.length == 1) {
			editor.dontHideProperties = true;
			editor.showProperties(cells[0]);
		}
	}
	
	/**
	 * Function: shortNameChangedHandler
	 * 
	 * Called when a key is pressed up on the shortName textbox to 
	 * generate an according customID on the fly.
	 */
	function shortNameChangedHandler(cells, tagName, graph, cell, attributeName, input, resize, txtCustomID) {
		var model = graph.getModel();
		var newValue = input.value || '';
		var oldValue = cell.getAttribute(attributeName, '');

		if (newValue != oldValue)  {
			model.beginUpdate();
			try {
				changeCellAttribute(model, cell, attributeName, newValue);

				var customID = generateCustomID(cells, newValue, cell.id);
				changeCellAttribute(model, cell, 'customID', customID);
				if (txtCustomID != null) {
					txtCustomID.value = customID;
				}
			}
			finally {
				model.endUpdate();
			}
		   /* if (resize) {
				graph.updateCellSize(cell);
			}*/
		}
	}
	
	/**
	 * Function: customIDChangedHandler
	 * 
	 * Called when the customID textbox focus is lost to validate 
	 * special characters and to make sure it is unique.
	 */
	function customIDChangedHandler(tagName, graph, cell, attributeName, input) {
		var model = graph.getModel();
		var newValue = input.value || '';
		var oldValue = cell.getAttribute(attributeName, '');
		var cells = obtainCells(graph, tagName);
		
		if (newValue != oldValue)  {
			newValue = generateCustomID(cells, newValue, cell.id);
			input.value = newValue;
			
			if (newValue != oldValue)  {
				model.beginUpdate();
				try {
					changeCellAttribute(model, cell, attributeName, newValue);
				}
				finally {
					model.endUpdate();
				}
			}
		}
	}
}
