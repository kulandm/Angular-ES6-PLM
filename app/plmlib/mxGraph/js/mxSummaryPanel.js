/**
 * Defines the behavior of the summary panel.
 */
mxSummaryPanel = {

	wnd : null,
	visible: false,
	 
	hide: function() {
		this.visible = false;
	},
	
	createSummaryPanel: function() {
		if (editor.properties != null) {
			editor.properties.hide();
		}
		if (mxPermissionsPanel.isVisible()) {
			if (!mxPermissionsPanel.hasErrors()) {
				mxPermissionsPanel.hide();
			} else {
				return;
			}
		}
		
	    var content = $("#summary-clone").clone();
	    content.find("#summary-clone").attr("id","summary");
	    content.find("#summaryTable-clone").attr("id","summaryTable");
	    content.find("#summaryTableBody-clone").attr("id","summaryTableBody");
		var summaryContainer = document.getElementById('summary');
	    
	    $("#summary").show();  
	    mxSummaryPanel.visible = true;
	    _plm.callFunc('util','showModal',['summaryPreview']);
	    _plm.callFunc('util','populateModal',['summaryPreview',content.contents(),{css:{width:'920px', height:'300px'}}]);
		mxSummaryPanel.visible =false;

	    var summaryTable = $("#summaryTable");
	    this.type = editor.graph.showIds;
	    this.createHeaders(this.type);
	    this.createTable("#summaryTableBody", this.type);

	    var btnShowIdsOnSummary = $(".showIdsOnSummary"),
	        oldSpan =btnShowIdsOnSummary.find("span:first-child").remove();
	    btnShowIdsOnSummary
	    	.removeAttr('disabled')
	    	.append($('<span>').text(mxResources.get('showIds')))
	    	.click(this.toggleShowIds);
	    if (this.type) {
	    	btnShowIdsOnSummary.addClass("on");
	    }
	    //check if the 'showIds' button has the class 'on' before open the dialog, by default it doesn't have it
	    ( btnShowIdsOnSummary.hasClass('on') ) ? btnShowIdsOnSummary.removeClass('on'):'';
	 	   
	    var languageLocator = this.getLanguageLocator();
	   
	    summaryTable.dataTable({
			"bPaginate": false,
			"bScrollCollapse": true, 
			"bRetrieve":false,
			"bDestroy" : true,
			"bSort" : true,
			"aaSorting": [],
			"oLanguage": {
                "sUrl": languageLocator
            }
		});

		// This is a ugly hack for IE9 support, since it doesn't support setting
		// overflow and height of tbody elements
		// $.browser has been deprecated in jQuery 1.9 - when we upgrade to it, we have to find an
		// alternative method of rendering this summary table
		if ($.browser.msie && parseInt($.browser.version) <= 9){
			 var _ie9Timeout = setTimeout(function () {
		    	var _target = $('.summary-table-container').find('#summaryTable');
				_target.wrap('<div class="table-wrapper" />');
		  	 	 console.log($.support.tbody);
		    }, 1000);
		}
	   
	    $("#summary").show();
	},
	
	/**
	 * This method is in charge of getting all data from the diagram and 
	 * populating the table.
	 */
	createTable: function(container,type) {
		var graph = editor.graph;
		var containerElement = $(container);
		containerElement.empty();
		transitionCells = obtainCells(graph, "transition");
		for (var i = 0; i < transitionCells.length; i++) {
			var tr = $("<tr>");
			var transition = transitionCells[i];
			var transitionName = transition.getAttribute("shortName");
			if (transitionName == null) {
				transitionName = "";
			}
			
			var transitionId = transition.id;
			if (transitionId.indexOf("transition_")>-1) {
				transitionId = transitionId.substring(transitionId.indexOf("transition_")+11);
			}
			var transitionCustomID = transition.getAttribute("customID");
			var fromState = transition.source.getAttribute("shortName");
			var fromStateId = transition.source.id;
			if (fromStateId.indexOf("state_")>-1) {
				fromStateId = fromStateId.substring(fromStateId.indexOf("state_")+6);
			}
			if (fromStateId == "init-cell") {
				fromStateId = "";
			}
			var fromStateCustomID = transition.source.getAttribute("customID");
			if (fromStateCustomID == null) {
				fromStateCustomID = "";
			}
			if (fromState == null) {
				fromState = "<img src='../scripts/mxGraph/images/workflow/start.svg' class='summaryStart'>";
			}
			var toStateName = transition.target.getAttribute("shortName");
			var toStateId = transition.target.id;
			if (toStateId.indexOf("state_")>-1) {
				toStateId = toStateId.substring(toStateId.indexOf("state_")+6);
			}
			var toStateCustomID = transition.target.getAttribute("customID");
			var permissionId = transition.getAttribute("newPermissionID");
			if (permissionId == null) {
					permissionId = transition.getAttribute("permissionID");
			}
			if (permissionId != null) {
				var permission = this.getPermissionById(mxConstants.permissions, permissionId);
				permissionName = permission.shortName;
			} else {
				permissionName = "";
			}
			var systemIdLabel = mxResources.get('id');
			var transitionCustomIDLabel = mxResources.get('transition.customID');
			var stateCustomIDLabel = mxResources.get('state.customID');
			var transitionIds = systemIdLabel + ": "+ transitionId + "</br> " + transitionCustomIDLabel + ": " + transitionCustomID;
			var fromStateIds = systemIdLabel + ": "+ fromStateId + "</br> " + stateCustomIDLabel + ": " + fromStateCustomID;
			var toStateIds = systemIdLabel + ": "+ toStateId + "</br> " + stateCustomIDLabel + ": " + toStateCustomID;
			
			var transitionCell = transitionName;
			var fromStateCell = fromState;
			var toStateCell = toStateName;
			if (type) {
				transitionCell = "<b>"+transitionName+"</b>";
				transitionCell += "</br>" + transitionIds;
				toStateCell = "<b>"+toStateName+"</b>";
				fromStateCell = "<b>"+fromState+"</b>";
				if (transition.source.getAttribute("shortName") != undefined) {
					fromStateCell += "</br>" + fromStateIds;
				}
				toStateCell += "</br>" + toStateIds;
			}
			tr.append("<td class='second-cell'>"+transitionCell+"</td>")
			tr.append("<td class='second-cell'>"+fromStateCell+"</td>")
			tr.append("<td class='second-cell'>"+toStateCell+"</td>")
			tr.append("<td class='second-cell'>"+permissionName+"</td>")
			tr.find("td:last").removeClass("second-cell");
			tr.find("td:last").addClass("last-cell");
			containerElement.append(tr);
		}
	},
	
	isVisible: function() {
		return this.visible;
	},
	
	getPermissionById: function(permissions, permissionId) {
		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i].permissionID == permissionId) {
				return permissions[i];
			}
		}
	},
	
	createHeaders: function(type) {
		headers = [];
		headers.push(mxResources.get('transition.transition'));
		headers.push(mxResources.get('summary.header.fromState'));
		headers.push(mxResources.get('summary.header.toState'));
		headers.push(mxResources.get('transition.permissionID'));
		
		$("#summaryTable thead tr th").each(function() {
			$(this).remove();
		})
		var clonableHeader = $("<th><span><img src='../images/icons/btn_up_down_arrows.png'></span></th>")
		clonableHeader.addClass("second-cell");
		for(var i=0;i<4;i++) {
			var clonedColumnHeader = clonableHeader.clone();
			clonedColumnHeader.show();
			clonedColumnHeader.find("span").before(headers[i]);
			$("#summaryTable thead tr").append(clonedColumnHeader);
		}
		
		$("#summaryTable thead tr th:last").removeClass("second-cell");
		$("#summaryTable thead tr th:last").addClass("last-cell");
	},
	
	toggleShowIds: function(evt) {
		mxSummaryPanel.type = !mxSummaryPanel.type;
		mxSummaryPanel.rerenderSummary();
	},
	
	rerenderSummary: function() {
		if (mxSummaryPanel.type) {
			$(".showIdsOnSummary").addClass("on");
		} else {
			$(".showIdsOnSummary").removeClass("on");
		}
		$("#summaryTableBody").empty();
		mxSummaryPanel.createTable("#summaryTableBody",mxSummaryPanel.type);
	},
	
	/**
	 * Simple function that load a special txt file for the dataTable localization
	 */
	getLanguageLocator: function() {
	   var sourceRoot = '/scripts/mxGraph/resources/'; 
	   var resourcesToLoad = 'dataTable.' + "en" + '.txt';
	   if (mxClient.language != null) {
		  if (mxClient.language == 'cs' || mxClient.language == 'zh' || mxClient.language == 'en' 
			  || mxClient.language == 'de' || mxClient.language =='it' || mxClient.language=='fr') {
			  resourcesToLoad = 'dataTable.' + mxClient.language + '.txt';
		  }
	   }
	  	   
	   var languageLocator = sourceRoot + resourcesToLoad + ""; 
	   
	   return languageLocator;
	}
	
}
