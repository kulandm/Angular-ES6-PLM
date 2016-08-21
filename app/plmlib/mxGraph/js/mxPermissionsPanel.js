/**
 * Defines the behavior of the permissions panel.
 */
mxPermissionsPanel = {
		
	wnd : null,
	width : 450,
    height : 300,
    headerHeight : 60,
    
	init: function() {
		this.visible = false;
		var _this = this;
		$("#permissionsTableBody tr td").live("dblclick",this.permissionEditHandler);
		$("#permissionsTableBody tr").live("click",this.permissionSelectionHandler);
		$("#permissionsTableBody tr td.editable input").live("change",this.permissionInputChangeHandler);
		$("#permissionsTableBody tr td.editable input").live("keyup",this.editKeyPressHandler);
		$(".createPermissionButton").live("click",this.createNewPermission);
		$(".deletePermissionButton").live("click",this.deletePermission);
	
		$(document).click(function(evt) {
			if(!mxPermissionsPanel.hasErrors()) {
				$(".deletePermissionButton").hide();
			}
			if (!$(evt.target).closest("tr").hasClass("editing") && !$(evt.target).hasClass("editing")) {
				if (!mxPermissionsPanel.hasErrors()) {
					$("#permissionsTable tr td.editable input").each(mxPermissionsPanel.deselectCell);
					$("#permissionsTable tr td.editable").each(mxPermissionsPanel.deselectRow);
				}
			}
		});
	},
	
	hasErrors: function() {
		return $("#permissionErrors li").length > 0;
	},
	
	hide: function(){
		this.visible = false;
	},
	
	deletePermission: function() {
		var selectedPermissionRow = $("tr.editing");
		if (selectedPermissionRow.find("td:first").text()=="false") {
			$("div#modalMask, div#permissionsPreview").css('z-index','1');
			mxUtils.confirm(mxResources.get('confirm'), mxResources.get('permission.delete'), 300, true, mxResources.get('accept'), '', mxResources.get('cancel'), false, function(acceptPopup) {
		
				mxPermissionsPanel.emptyErrors();
				var permissionID = selectedPermissionRow.attr("id").substring(11);
				var permissionIndex = mxPermissionsPanel.getPermissionIndex(mxConstants.permissions, permissionID);
				mxConstants.permissions.splice(permissionIndex,1);
				selectedPermissionRow.remove();
				$(".deletePermissionButton").hide();
				$("#permissionsTableBody tr").each(function(index){
					$(this).removeClass("even").removeClass("odd");
					var rowClass = (index % 2 == 0) ? "even" : "odd";
					$(this).addClass(rowClass);
				});
				
				mxPermissionsPanel.updateHeight(); 
				mxPermissionsPanel.updateSaveStatus();
				
			});	
		}		
	},
		
	updateHeight: function() {
		var windowContentHeight = mxPermissionsPanel.height - mxPermissionsPanel.headerHeight;
		if ($("#permissionsTable").height()>windowContentHeight) {
	    	$("#permissions .summary").height(windowContentHeight);
	    }
	    else{
	    	$("#permissions .summary").height("auto");
	    }
	},
	
	createNewPermission: function(evt) {
		evt.stopPropagation();
		var nextId = editor.graph.model.prefix + editor.graph.model.nextId;
		editor.graph.model.nextId++;
		var permission = {
			'longName': '',
			'newPermissionID': nextId, 
			'permissionID': nextId,  
			'permissionString': '',
			'shortName': '',
			'transactionsUsingThisPermission' : 0
		};
		mxConstants.permissions.push(permission);
		$(".deletePermissionButton").show();
		mxPermissionsPanel.createError(mxResources.get('error.permission.name.notBlank'));
		
		$("#permissionsTableBody tr.editing").removeClass("editing");
		$("#permissionsTableBody tr td.editable input").each(mxPermissionsPanel.deselectCell);
		var newPermissionRow = $("#permission-clone").clone();
		newPermissionRow.show();
		newPermissionRow.attr("id","permission_"+nextId);
		newPermissionRow.addClass("editing");
		newPermissionRow.find("td").each(function() {
			if (!$(this).hasClass("editable")) {
				$(this).text("false");
			}
		})
		newPermissionRow.find("td.editable").each(function() {
			$(this).empty();
			var input=document.createElement('input');
			input.setAttribute('type','text');
			$(this).append(input);
		})
		mxPermissionsPanel.updateSaveStatus();
		var rowClass = mxConstants.permissions.length % 2 == 0 ? "even" : "odd";
		newPermissionRow.addClass(rowClass);
		$("#permissionsTableBody").append(newPermissionRow);
		
		$("#permissionsTableBody").find("td.name input").focus();
		$("#permissionsTableBody").prop({ scrollTop: $("#permissionsTableBody").prop("scrollHeight") });
		
		
	},
	
	editKeyPressHandler: function(evt) {
		if (!$(evt.currentTarget).parent().hasClass("name")) {
			return;
		}
		var value=$(this).val();
		var permissionID = $(this).parent().parent().attr("id").substring(11);
		if (value == "") {
			mxPermissionsPanel.createError(mxResources.get('error.permission.name.notBlank'));
		} else {
			var notUnique = mxPermissionsPanel.isUniquePermissionName(value,permissionID);
			if (notUnique) {
				mxPermissionsPanel.createError(mxResources.get('error.permission.name.unique'));
			} else {
				mxPermissionsPanel.emptyErrors();
			}
		}
		mxPermissionsPanel.updateSaveStatus();
		
	},
	
	permissionInputChangeHandler: function(evt) {
		var cell = $(this).parent();
		var row = cell.parent();
		var value = $(this).val();
		var permissionID = row.attr("id").substring(11);
		var permission = mxPermissionsPanel.getPermissionById(mxConstants.permissions, permissionID);
		if (cell.hasClass("name")) {
			if (value == "") {
				if (permission.shortName == "") {
					return;
				}
			} else {
				permission.shortName = value;
			}
		}
		else if (cell.hasClass("description")) {
			permission.longName = value;
		}
		mxPermissionsPanel.updateSaveStatus();
	},
	
	createError: function(message) {
		$("#permissionErrors").empty();
		$("#permissionErrors").append($("<li>"+message+"</li>"));
		$(".createPermissionButton").attr("disabled","disabled");
	},
	
	emptyErrors: function() {
		$("#permissionErrors").empty();
		$(".createPermissionButton").removeAttr("disabled");
	},
	
	permissionSelectionHandler: function(evt) {
		evt.stopPropagation();
		if (mxPermissionsPanel.hasErrors()) {
			$("tr.editing td.name input").focus();
			return;
		}
		//permissionsPanel = _this;
		if ($(evt.currentTarget).hasClass("editing")) {
			return;
		}
		$(evt.currentTarget).parent().find("tr").each(function() {
			$(this).find("td input").each(mxPermissionsPanel.deselectCell);
			$(this).removeClass("editing");
			
		});
		$(evt.currentTarget).addClass("editing");
		if ($(evt.currentTarget).find("td:first").text() == "true") {
			$(".deletePermissionButton").hide();
		} else {
			$(".deletePermissionButton").show();
		}
	},
	
	permissionEditHandler: function(evt) {
		if (mxPermissionsPanel.hasErrors()) {
			return;
		}
		$(evt.currentTarget).parent().parent().find("td.editable input").each(mxPermissionsPanel.deselectCell);
		$(evt.currentTarget).parent().addClass("editing");
		$(evt.currentTarget).parent().find("td.editable").each(function() {
			var tdData = $(this).text();
			$(this).empty();
			var input = document.createElement("input");
			input.setAttribute('type','text');
			input.setAttribute('value',tdData);
			$(this).append(input);
		})
		$(evt.currentTarget).find("input").focus();
	},
	
	deselectCell: function() {
		$(this).parent().parent().removeClass("editing");
		var tdData = $(this).val();
		var td = $(this).parent();
		td.text(tdData);
	},
	
	deselectRow: function() {
		$(this).parent().removeClass("editing");
	},
	
	createPermissionsPanel: function(e) {
		if (mxPermissionsPanel.hasErrors()) {
			return;
		}
		if (editor.properties != null) {
			editor.properties.hide();
		}
		mxSummaryPanel.hide();
	    var summaryContainer = document.getElementById('permissions');
	    
	    var content = $("#permissions-section").clone();
	    content.find("#permissions-clone").attr("id","permissions");
	    content.find("#permissionsTable-clone").attr("id","permissionsTable");
	    content.find("#permissionsTableBody-clone").attr("id","permissionsTableBody");
	    content.find("#permissionsButtons-clone").attr("id","permissionsButtons");
	    content.find("#permissionErrors-clone").attr("id","permissionErrors");
	    var docWidth = $(document).width();
	    var docHeight = $(document).height();
	    var x = (docWidth / 2) - mxPermissionsPanel.width / 2;
	    var y = (docHeight/ 2) - mxPermissionsPanel.height / 2;
	    this.visible = true;
	    _plm.callFunc('util','showModal',['permissionsPreview']);
	    _plm.callFunc('util','populateModal',['permissionsPreview',content.contents(),{css:{width:'550px', height:'300px'}}]);
		this.visible = false;
		this.createTable("#permissionsTableBody");
	},
	
	closeWindowEventHandler: function(evt) {
		if (mxPermissionsPanel.hasErrors()) {
			return false;
		}
	},
	
	createTable: function(container) {
		var graph = editor.graph;
		var containerElement = $(container);
		containerElement.empty();
		var permissions = mxConstants.permissions; 
		for (var i = 0; i < permissions.length; i++) {
			var trClass =  i % 2 == 0 ? "odd" : "even"; 
			var tr = $("<tr title='"+mxResources.get('permission.editHint')+"'>");
			tr.addClass(trClass);
			var permission = permissions[i];
			var isUsed = permission.transactionsUsingThisPermission > 0;
			tr.attr("id", "permission_" + permission.permissionID);
			var permissionName = permission.shortName;
			var permissionDescription = permission.longName || ""; 
			tr.append("<td class='first-cell'>"+isUsed+"</td>")
			tr.append("<td class='editable name second-cell'>"+permissionName+"</td>")
			tr.append("<td class='editable description last-cell'>"+permissionDescription+"</td>")
			containerElement.append(tr);
		}
	},
	
	getPermissionById: function(permissions, permissionId) {
		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i].permissionID == permissionId) {
				return permissions[i];
			}
		}
	},
	
	getPermissionIndex: function(permissions, permissionId) {
		for(var i=0;i<permissions.length;i++) {
			if (permissions[i].permissionID == permissionId) {
				return i;
			}
		}
	},
	
	
	isUniquePermissionName: function(value, permissionID) {
		var notUnique = false;
		$.each(mxConstants.permissions,function() {
			permissionIDFromArray = this.permissionID || this.newPermissionID;
			if (value.toLowerCase() == this.shortName.toLowerCase() &&
					permissionID != permissionIDFromArray) {
				notUnique = true;
				return false;
			}
		});
		return notUnique;
	},
	
	updateSaveStatus: function(){
		if (permissionsWithUnsavedChanges()) {
			var enableSaveButton = editor.graph.errorCount == 0 && !mxPermissionsPanel.hasErrors();
			$('#btn_save').enable(enableSaveButton);
			showStatusUnsaved();
		} else {
			onDiagramChange();
		}
	},
	
	isVisible: function() {
		return this.visible;
	}	
	
};
