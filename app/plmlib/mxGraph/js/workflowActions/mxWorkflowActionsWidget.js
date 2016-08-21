/*
 * 
 * @author: Gabriel Yaffe
 *
 */
{
	/**
	 * This creates a div that contains a dropdown and a span with instructional text
	 * Only one of these will be visible
	 * 
	 * 
	 * */
	function createDropDownWidget(){
		
		
		var dropDownContainer = $('<div/>').addClass("dropdownActive");
		
		var instructonal = $('<span/>').addClass("instructional").css('display', 'none');
		var dropDownSelect = $('<select/>').css('display', 'none').attr('id', 'workflowTransList').addClass('dropdownlist');
		dropDownSelect.addClass("__transitionSelect");
		instructonal.appendTo(dropDownContainer);
		dropDownSelect.appendTo(dropDownContainer);
		
		return dropDownContainer;
	
		
	};
	
	
	/**
	 * Function: createHistoryWidget
	 * 
	 * Entire History generation. Gets the history steps and builds up the history
	 * 
	 * */
	function createHistoryWidget(historySteps){
						
		var contentWrapper = $('<div/>').addClass('historyContent');
		
		if(historySteps !=undefined){						
					
			var historyTableContent = $('<div/>');
			historyTableContent.appendTo(contentWrapper);
			
			for ( var i = 0; i < historySteps.length; i++) {
				
				currHistoryStep = historySteps[i];
			
				var imageSrc = currHistoryStep.imageSource;
				
				var tableContainer = $('<table/>');
				var tableTr = $('<tr/>');
				
				//If there is an image, we add it.
				if(imageSrc != undefined){
					
					var tableTd = $('<td/>').addClass('firstTableColumn');
					var profileImg = $('<img/>').attr('src', currHistoryStep.imageSource);
					
					profileImg.appendTo(tableTd);
					tableTd.appendTo(tableTr);
					
				}
				tableTr.appendTo(tableContainer);
				tableContainer.appendTo(historyTableContent);
				
				var tableTdInformation = $('<td/>');
				var currentHistoryContentWrapper = $('<div/>');
				currentHistoryContentWrapper.appendTo(tableTdInformation);
				tableTdInformation.appendTo(tableTr);
				
				var hyperlinkDate = $('<div/>');
				var hyperlinkUserName = $('<a/>').text(currHistoryStep.actualUserDisplayName);
				hyperlinkUserName.on('click', {userID : currHistoryStep.userID}, function(e) {

					_plm.callFunc('util', 'contactInfoPopup',[ e.data.userID ]);
					e.stopPropagation();

					return false;

				});
				
				var dateContainer = $('<div/>').text(currHistoryStep.timestampFormatted).addClass('historyDate');
			
				var stepPerformedContainer = $('<div/>').addClass('titleText').text(currHistoryStep.transitionName);
						
				hyperlinkUserName.appendTo(currentHistoryContentWrapper);
				stepPerformedContainer.appendTo(currentHistoryContentWrapper);
				
				dateContainer.appendTo(currentHistoryContentWrapper);
				
				var commentsContainer = $('<div/>').text(currHistoryStep.comments).addClass('commentsText');
				commentsContainer.appendTo(currentHistoryContentWrapper);
				
				if (currHistoryStep.actualUserID != currHistoryStep.userID){
					var delegationInfoContainer = $('<div/>').text(_plm.messages.delegation.log.onbehalf(currHistoryStep.userDisplayName)).addClass('delegationInfo');
					delegationInfoContainer.appendTo(currentHistoryContentWrapper);
				}
			}
		
		}
				
		return contentWrapper;
		
		
	};
	
	
		/**
	 * Function: createRequiredField
	 * 
	 * Creates a red asterisk to show as required field warning
	 * 
	 */
	function createRequiredField(){
		
		var requiredFieldsAsterisk = document.createElement('span');
		requiredFieldsAsterisk.setAttribute('class','validationerror');
		mxUtils.write(requiredFieldsAsterisk, mxResources.get('asterisk'));
		
		return requiredFieldsAsterisk;
	};
	
	/**
	 * Function: createTitleTableDiv
	 * 
	 * This generates a text with specific style to be included in top of elements inside Dialogs
	 * 
	 * */	
	function createTitleTableDiv(titleText){
		
		var container = $('<div/>').addClass('titleText');
		var commentsImgSrc = "/scripts/mxGraph/images/icons/wfmap/comment_16.png";
		var commentsImg = $('<img/>').attr("src", commentsImgSrc).addClass('imagePadding');
		var titleContainer = $('<span/>').text(titleText);//.before(commentsImg);
		
		titleContainer.prepend(commentsImg);
		
		titleContainer.appendTo(container);
		
		
		return container;
		
		
	};
	
	function createHistoryTitle(){
		
		
		var container = $('<div/>').addClass('historyToolbar');
		var historyImgSrc = "/scripts/mxGraph/images/icons/wfmap/workflow_history24-02.png";
		historyImgBtn = $('<button/>').addClass('mxToolbarItem').prop('title', _plm.messages.tooltip.workflowactions.showhistory);
		var historyImg = $('<img/>').prop("src", historyImgSrc).appendTo(historyImgBtn)
		
		$(historyImgBtn).on('click', function(){			
			createOLDHistoryTable();										
		});

		var titleContainer = $('<span/>').addClass('historyTitle').text(mxResources.get('dialog.title.workflowHistory') + ' ('+mxConstants.historySteps.length+')');
		titleContainer.appendTo(container);
		historyImgBtn.appendTo(container);
		
		return container;
	
	};
	
	/**
	 * Function: createHistoryTable
	 * 
	 * Entire History generation
	 * 
	 * */
	function createOLDHistoryTable(){
		
		createMxHistoryPopup();
		
		var TABLE_CLASS = "datatable";
	    var ROW_DATA = "datatable-row-data";
	    
		var contentWrapper = document.createElement('div');
		var historySteps = mxConstants.historySteps;
		
		var table;
		
		if(historySteps !=undefined){
						
			var headerInfo = ["step", "timestampFormatted" , "action", "userDisplayName", "comments"];
			
			table = document.createElement('table');
			table.className = TABLE_CLASS;
				
			contentWrapper.appendChild(createTitleTableDivOLD(mxResources.get('title.performedActions')));
			
			table.appendChild(createHeader(headerInfo));

			//Step 	Date Time 	Action 	Performed By
			var tbdy = document.createElement('tbody');
			for ( var i = 0; i < historySteps.length; i++) {
				historyStep = historySteps[i];

				var row = document.createElement('tr');
				row.className = ROW_DATA;
				tbdy.appendChild(row);

				for ( var j = 0; j < headerInfo.length; j++) {

					var cell = document.createElement('td');

					var headerValue = headerInfo[j];
					if (headerValue == "action") {
						headerValue = historyStep.transitionName;
						$(cell).text(headerValue);
						row.appendChild(cell);
					}
					else if(headerValue == "userDisplayName"){
						
						var hyperlinkUserName = document.createElement('a');
						mxUtils.write(hyperlinkUserName, historyStep[headerValue]);
						
						var delegationInfo = document.createElement('span');
						mxUtils.write(delegationInfo, historyStep['delegationInfo']);

						$(hyperlinkUserName).on('click', {userID: historyStep['userID']}, function(e){
							
							_plm.callFunc('util', 'contactInfoPopup', [e.data.userID]);
														
						});					
						cell.appendChild(hyperlinkUserName);

						// adds the line about the delegation having been performed on behalf of another user
						if (historyStep['delegationInfo'] != '') {
							cell.appendChild(document.createElement('br'));
							cell.appendChild(delegationInfo);
						};

						row.appendChild(cell);
						
					} else if(headerValue == "comments"){
						$(cell).text(historyStep[headerValue]);
						cell.width = '42%';
						row.appendChild(cell);
					}/* else if(headerValue == "delegationInfo"){
						$(cell).text(historyStep[headerValue]);
						cell.width = '42%';
						row.appendChild(cell);
					}*/
					else if(headerValue == "step"){
						$(cell).text(historyStep[headerValue]);
						cell.width = '4%';
						row.appendChild(cell);
					}
					else
						{
						$(cell).text(historyStep[headerValue]);
						row.appendChild(cell);
						}
				}
				
			}
			table.appendChild(tbdy);		
			contentWrapper.appendChild(table);			
			applyDataTablePlugin(table);

		}
		var jqSpinner = $(".popupSpinner");
		jqSpinner.empty();
		jqSpinner.append(contentWrapper);
		jqSpinner.removeClass("popupSpinner");
	};
	
	function createMxHistoryPopup(){
		
		var spinnerDivWrapper = document.createElement('div');
		$(spinnerDivWrapper).addClass("popupSpinner");
		
		if(mxClient.IS_IE)	
			spinnerDivWrapper.style.height = '240px';
		
		
		var tableWidth = $("#content").width()-160;
		var tableHeight = 260;
		
		//var xPosR = $("#content").width()/2 - ($("#content").width()/2 -50);
		
		//var xPos = xPosR + $('#mxGraph').offset().left;
		//var yPos = $('#mxGraph').offset().top;
		
		var xPos =  ($("#content").width()/2) - (tableWidth/2);
		var yPos = ($("#content").height()/2) - (tableHeight/2);
		
		//Sanity check to see if screen is too small!
		if(xPos<0)
			xPos=25;
	
		var wnd = new mxWindow(mxResources.get('dialog.title.workflowHistory'), spinnerDivWrapper,xPos,yPos, tableWidth, tableHeight, false, true);
			
		wnd.setMaximizable(false);
		wnd.setClosable(true);
		wnd.setScrollable(true);
		wnd.setResizable(true);
		wnd.setVisible(true);
		
		$('#modalMask').fadeTo("fast",0.5);
		
	};
	
		/**
	 * Function: createTitleTableDiv
	 * 
	 * This generates a text with specific style to be included in top of elements inside Dialogs
	 * 
	 * */	
	function createTitleTableDivOLD(titleText){
		
		var titleDiv = document.createElement('div');
		mxUtils.write(titleDiv, titleText);
		titleDiv.className = "titleText";
		
		return titleDiv;
		
	};
	
	/**
	 * Function: createHeader
	 * 
	 * Generic method that creates header for tables
	 * 
	 * */
	function createHeader(headerInfo) {

				
		var thead = document.createElement('thead');
		var headerRow = document.createElement('tr');

		for ( var i = 0; i < headerInfo.length; i++) {

			var headerContainer = document.createElement('th');
			
			//In case of using and image, use the code below!
			var spanImage = document.createElement('span');
			var imgTag = document.createElement('img');
			
			imgTag.src = '../images/icons/btn_up_down_arrows.png';
			spanImage.appendChild(imgTag);
									
			mxUtils.write(headerContainer, mxResources.get(headerInfo[i]));
			headerContainer.appendChild(spanImage);
						
			headerRow.appendChild(headerContainer);
			thead.appendChild(headerRow);
		}
		
		return thead;

	};	
	
	/**
	 * Function: applyDataTablePlugin
	 * 
	 * This just apply the DataTable plugin to a table element
	 * 
	 * */
	function applyDataTablePlugin(table){
		
		//TODO: language
		
		$(table).dataTable({
			"bScrollCollapse": true,
			"bRetrieve" : false,
			"bDestroy" : true,
			"bInfo" : false,
			"bPaginate" : false,
			"bFilter" : false,
			"aaSorting": [[ 0, "desc" ]]
			
		});		
	}
}