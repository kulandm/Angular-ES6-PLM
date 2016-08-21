/*
 * 
 * @author: Gabriel Yaffe
 *
 */
{
	

	function doAjaxLoadWorkflow(mapDmsID, mapWorkspaceID) {
		/*This here	is because we must be sure that the styles load.
		In some cases when a page refresh happen, we had issues with this xml
		so we load it and assign it to the graph. Later we render*/
						    
						    var dmsId = mapDmsID;
						    var workspaceId = mapWorkspaceID;
													    
							if (workspaceId != -1) {
								
							
								var request = $.ajax({
									url : "/api/rest/v1/workflowMap/" + workspaceId + ".json" + "?" + "dmsId="+dmsId,
									type: "GET",
									cache: false,
									contentType : "application/json"
									
								});

								request.success(function(response) {
									$("#content").removeClass("loading");
									if(response.exceptions == null) {
										parseDocumentAndRender(response);
										
										if(mxConstants.actionNumber == 1){
											updateUserMessageForSaveStep(response);										
										}
										if(mxConstants.actionNumber == 2){
											updateUserMessageForUndo(response);
										}
																				
			
									} else {
										mxUtils.showError(mxResources.get('server.error'), coordinateX()-150, coordinateY(), true);
									}
								});

								request.fail(function(jqXHR, textStatus, errorThrown) {
									
																		
									if (jqXHR.status == 400) {
									  	createFormattedTextError(jqXHR.responseXML.getElementsByTagName('message'));
									}
									else
										{
										handleAjaxError(jqXHR, textStatus, errorThrown);
										}
														
								});
										
							}
			
	};
	
	
	/**
	 * Function: loadNextStepPerformers
	 * 
	 * For a particular state loads the next step performers on demand
	 * 
	 * */
	function doAjaxLoadNextStepPerformers(cell, xPos, yPos) {
		var workspaceId = -1;
		var dmsId = -1;
	
			if (editor.isMapForPreview) {
				workspaceId = editor.__workspaceId;
				dmsId = editor.__itemId;
			}
	
			//Valid workspace and state has outgoing transitions
			if (workspaceId != -1 && getAllTransitionsAndFilterByCurrentState().length>0) {
	
				//Creates a popup with a spinner in it.
				//createMxPerformersPopup(cell, xPos, yPos);
				
				if(mxConstants.transitionWithUsers==undefined){
					
					var request = $.ajax({
						url : "/api/rest/v1/workflowMap/nextstep/" + workspaceId + ".json" + "?"
								+ "dmsId=" + dmsId,
						type : "GET",
						cache : false,
						contentType : "application/json"
		
					});
		
					request.success(function(response) {
						if (response.exceptions == null) {
							
							if(response.list==null){
								mxConstants.transitionWithUsers = [];
							}							
							else{								
								mxConstants.transitionWithUsers = response.list.transitionWithUsers;
							}
							
							createPerformersTableContent(cell);
							
							
						} else {
							mxUtils.showError(mxResources.get('server.error'),
									coordinateX() - 150, coordinateY(), true);
						}
					});
		
					request.fail(function(jqXHR, textStatus, errorThrown) {
							
						handleAjaxError(jqXHR, textStatus, mxResources.get('error.fetch.performers'));
											
					});
			
				}				
				else
					{
					createPerformersTableContent(cell);
					}
		
			}
	
	};
	
	
	function doAjaxRollbackLastStep(){		
		
		$("#content").addClass("loading"); 
				
		var request = $.ajax({
			url : "api/rest/v1/workspaces/"+workspaceId+"/items/"+dmsId+"/workflows/transitions/",
			contentType : "application/json",
			type: "DELETE"
		});
		
		
		request.success(function(data, textStatus, jqXHR){
			mxConstants.actionNumber = 2;
			doAjaxLoadWorkflow();
		});

		request.fail(function(jqXHR, textStatus, errorThrown) {
			$("#content").removeClass("loading"); 
			
			
			if (jqXHR.status == 400) {
				createFormattedTextError(jqXHR.responseXML.getElementsByTagName('message'));
			}
			else
				{
				handleAjaxError(jqXHR, textStatus, errorThrown);
				}
						
		});
		
	};
	
	
	/**
	 * Function: loadNextStepPerformers
	 * 
	 * For a particular state loads the next step performers on demand
	 * 
	 * */
	function doAjaxLoadWorkflowHistoy() {
					
					
			var request = $.ajax({
				url : "/api/rest/v1/workspaces/"+workspaceId+"/items/"+dmsId+"/workflows/history/",
				type : "GET",
				cache : false,
				contentType : "application/json"
			});
				
			request.success(function(data, textStatus, jqXHR) {
			
				if(data.list != null)
					mxConstants.historySteps = data.list.historySteps;
				else
					mxConstants.historySteps = [];
				
				$("#rightNavContent").removeClass("popupSpinner");
				
				
				var historyTitleDiv = createHistoryTitle();
				historyTitleDiv.appendTo($("#historyPanel"));
				
				
				var history = createHistoryWidget(mxConstants.historySteps);
				$("#historyPanel").append(history);
						
			});
				
			request.fail(function(jqXHR, textStatus, errorThrown) {
							
				handleAjaxError(jqXHR, textStatus, mxResources.get('error.fetch.history'));
						
			});
			
	};
	
	function getUrlVars() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	        vars[key] = value;
	    });
	    return vars;
	};
	
	
	function handleAjaxError(jqXHR, textStatus, errorThrown){
		
		if (jqXHR.status == 401) {
			
		}		
		else {
			
		}
		
	};
	
	
	/**
	 * Function: makeBaseAuth
	 * 
	 * Converts username and password into Basic access Authentication's Authorization header string
	 */
	function makeBaseAuth(username, password) {
	  var tok = username + ':' + password;
	  	  	  
	  
		
	  return "Basic " + hash;
	
	};
	
		
	/**
	 * Function: createErrorContent
	 * 
	 * Function to create formatted text errors and show them in the errorContent div
	 * 
	 * */
	function createErrorContent(messages){
		$("#errorContent").empty();
		var messageTagList = document.createElement('ul');
		for(var i = 0; i < messages.length ; i++){
			var messageTag = document.createElement('li');
			mxUtils.write(messageTag, messages[i] + "\n");
			messageTagList.appendChild(messageTag);	
		}
		$('#errorContent').append(messageTagList);	
		$('#errorContent').removeClass('hiddenDiv');
	
	};
	
	
	
}