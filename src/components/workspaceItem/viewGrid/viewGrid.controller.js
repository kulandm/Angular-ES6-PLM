/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewGridController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/grid.
 *
 * ##Dependencies
 *
 */

const LOCATION = new WeakMap();

class ViewGridController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#constructor
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $location, $state, $stateParams, $timeout, $window, ModelsManager, EventService, ClientSortService, PLMPermissions, _) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$timeout = $timeout;
		this.$window = $window;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.ClientSortService = ClientSortService;
		this.PLMPermissions = PLMPermissions;
		this._ = _;

		LOCATION.set(this, $location);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#that
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#bundle
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` Assigns the rootScope's bundle (with localization) to this controller's bundle.
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The workspace id of the current item.
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The item id of the current item.
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#edit
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description A boolean val that controls if the user is in view or editing mode, to render form elements.
		 */
		this.edit = angular.isDefined($stateParams.edit);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#addState
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The name of the view state for this tab determining the displaying of add button.
		 */
		// this.addState = 'grid-view';

		// Tests to see if it's in EDIT mode
		this.edit = (LOCATION.get(this).search().mode === 'edit');

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The permission to be set to control visibility of display button.
		 */
		this.editPermission = PLMPermissions.EDIT_GRID;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The permission to be set to control visibility of display button.
		 */
		this.addPermission = PLMPermissions.ADD_GRID;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#showContextMenu
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description A boolean val that controls if the context menu is shown.
		 */
		this.showContextMenu = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#canHideContextMenu
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description A boolean val that controls if the context menu can be hidden.
		 * This is to get around using click-outside-element.
		 */
		this.canHideContextMenu = true;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#selectedRowId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Stores the selected row ID for which the context menu has been shown.
		 */
		this.selectedRowId = undefined;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#errors
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The object holding validation errors per row per cell.
		 */
		this.errors = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#scrollContext
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The context for attaching handler for infinite scrolling.
		 */
		this.scrollContext = angular.element($window);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#endOfList
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` A flag holding whether we've reached the end of all items in the workspace.
		 */
		this.endOfList = true; // Set to true, since there's no pagination in the current Grid endpoint

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#customVars
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The object that holds variables that custom fields need for binding ng-model.
		 */
		this.customVars = {
			selectAll: false
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Columns for the tabularDataWidget.
		 */
		this.tableColumns = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Data for the tabularDataWidget.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#sortConfig
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description The sort configurations for grid.
		 */
		this.sortConfig = {
			disableInitialSort: false,
			applySort: that.applySort
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#GridObj
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Reference to grid data model.
		 */
		this.GridObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#gridData
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Row data for grid.
		 */
		this.gridData = {
			rows: []
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#gridMeta
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description Grid meta data.
		 */
		this.gridMeta = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#gridListenerId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` Listener for grid object.
		 */
		ModelsManager.getGrid(this.workspaceId, this.itemId);
		this.gridListenerId = EventService.listen(`grid:${this.itemId}:done`, (event, gridObj) => {
			this.GridObj = gridObj;
			this.gridData = this.GridObj.getFullList();
			ModelsManager.getGridMeta(this.workspaceId, this.itemId);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#gridMetaListenerId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` Listener for grid meta object.
		 */
		this.gridMetaListenerId = EventService.listen(`gridMeta:${this.itemId}:done`, (event, GridMetaObj) => {
			this.gridMeta = GridMetaObj.getFullList();

			this.tableColumns = [
				{
					displayName: '',
					field: 'chkBox',
					renderer: 'chkBoxAll',
					cellRenderer: 'chkBoxRenderer',
					width: 3
				},
				{
					displayName: that.bundle.grid.id,
					field: 'rowId',
					enableColumnSorting: true,
					cellRenderer: 'gridMetaRenderer',
					width: 5
				}
			];

			this._.each(this.gridMeta, (row, rowIndex) => {
				this.tableColumns.push({
					displayName: row.title, // We don't have the properly-formatted string from the endpoint, since it doesn't supply metadata
					field: row.link,
					enableColumnSorting: true,
					cellRenderer: 'gridMetaRenderer'
				});

				this._.each(this.gridData.rows, (dataRow, rowIndex) => {
					if (!angular.isDefined(this.errors[rowIndex])) {
						this.errors[rowIndex] = {};
					}
					this.errors[rowIndex][row.link] = false;
				});
			});

			// If we came from add new row, add one at the end
			if ($state.params.addRow) {
				this.addRow();
				this.parseGridData();
			} else {
				this.parseGridData();
			}
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewGridController#gridValidationListenerId
		 * @propertyOf Controllers.workspaceItem.ViewGridController
		 * @description `private` Listener for grid validation object.
		 */
		this.gridValidationListenerId = null;
		this.gridValidationListenerId = EventService.listen('grid:validationsErrors:present', (event, errs) => {
			this._.each(this.errors, (error, ind) => {
				this._.each(error, (col, colInd) => {
					this.errors[ind][colInd] = false;
				});
			});

			this._.each(errs, (errorArr, rowIndex) => {
				if (!angular.isDefined(this.errors[rowIndex])) {
					this.errors[rowIndex] = {};
				}
				this._.each(errorArr, (error) => {
					this.errors[rowIndex][error.fieldId] = true;
				});
			});

			this._.each(this.tableData, (row, rowIndex) => {
				this._.each(row, (col, fieldId) => {
					if (this._.isObject(col)) {
						col.error = (this.errors[row.rowId] ? this.errors[row.rowId][fieldId] : false);
					}
				});
			});
		}, true);

		EventService.listen('state:change:done', () => {
			this.checkCurrentState();
		});

		$scope.$on('$destroy', () => {
			EventService.unlisten(this.gridValidationListenerId);
			EventService.unlisten(this.gridListenerId);
			EventService.unlisten(this.gridMetaListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#checkCurrentState
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Check the current state of grid view, whether in view, edit or add.
	 */
	checkCurrentState() {
		if (!this.isViewState()) {
			this.edit = true;
		} else {
			this.edit = false;
		}

		this.ModelsManager.getGrid(this.workspaceId, this.itemId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#applySort
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Initiates request for single column sorting.
	 *
	 * @param {String} column	The ID of the column on which to sort - should match <code>columns.field</code>.
	 * @param {String} order	The sort order - can either be 'asc' or 'desc'.
	 * @param {String} scope	The sort scope from TableColumnSort directive.
	 */
	applySort(column, order, scope) {
		// THIS SEEMS LIKE A HACK???
		// TODO: Fix the scope issues regarding TableColumnSort
		var that = scope.viewGridCtrl;

		that.tableData = that.ClientSortService.sort(
			{
				tableHeaders: that.tableColumns,
				tableData: that.tableData
			},
			{
				columnToSort: column,
				sortOrder: order
			}
		);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#parseGridData
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Parses the grid data for the tabularDataWidget.
	 */
	parseGridData() {
		this.tableData = [];

		this._.each(this.gridData.rows, (row, rowIndex) => {
			this.tableData.push(this.parseRow(row, rowIndex));
		});

		// Disabled, we don't have pagination in the current Grid endpoint
		// this.pageNumber++;

		// Code to load the second page of the Grid data here
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#parseRow
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Parses the row to fit for table data.
	 *
	 * @param {Object} row The row with data to be added
	 * @param {Integer} rowIndex The index of the row in grid data
	 */
	parseRow(row, rowIndex) {
		var parsedData = {};
		parsedData.chkBox = {};
		parsedData.rowId = row.rowData[0];
		let rowIdVal = parsedData.rowId.value;
		parsedData.rowId.originalValue = rowIdVal;

		var columns = row.rowData;
		this._.each(this.gridMeta, (column, columnIndex) => {
			let colId = column.link.substring(column.link.lastIndexOf('/') + 1);
			let foundCol = this._.find(columns, (col) => {
				return colId === (col.__self__ ? col.__self__.substring(col.__self__.lastIndexOf('/') + 1) : '');
			});
			let val = (angular.isDefined(foundCol) ? foundCol.value : undefined);

			parsedData[column.link] = {
				value: val,
				originalValue: val,
				metadata: {
					dataTypeId: column.definition.type.dataTypeId
				},
				__self__: column.link,
				title: column.title,
				error: (this.errors[rowIndex] ? this.errors[rowIndex][column.link] : false),
				isEdit: this.edit,
				waiting: false,
				unitOfMeasure: null,
				triggerEdit: () => this.triggerEdit(),
				// test
				interactions: {
					showClear: false,
					overBtn: false,
					setShowClear: function ($event) {
						this.$timeout.cancel(this.testInv);
						this.showClear = true;
						this.overBtn = true;
					},
					testShowClear: function ($event) {
						var that = this;
						if (this.mousePos !== `${$event.clientX}.${$event.clientY}`) {
							this.showClear = true;
						}
						this.mousePos = `${$event.clientX}.${$event.clientY}`;
						this.testInv = this.$timeout(() => {
							if (this.mousePos === `${$event.clientX}.${$event.clientY}` && !this.overBtn) {
								this.showClear = false;
							}
						}, 500);
					}
				},
				// COMPLETE HACK, FIX WITH NEW ENDPOINT
				validations: [
					{
						type: 'MAX_LENGTH',
						settings: {
							maxlength: 512
						}
					}
				]
			};
		});

		parsedData.linkUrl = '#';
		parsedData.triggerContextMenu = this.triggerContextMenu;
		parsedData.isEdit = this.edit;

		var that = this;

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.ViewGridController#hasChanged
		 * @methodOf Controllers.workspaceItem.ViewGridController
		 * @description Checks if data has changed
		 *
		 * @returns {Boolean} True, if data has changed
		 */
		parsedData.hasChanged = function () {
			var changed = false;
			if (this.rowId === '') {
				return true;
			}

			that._.each(this, (col) => {
				if (col.value !== col.originalValue) {
					changed = true;
				}
			});
			return changed;
		};

		return parsedData;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#addRow
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Inserts new rows at the index specified by rowIndex
	 *
	 * @param {Number} rowIndex The index at which a row to be added, if not provided, we add to the end.
	 */
	addRow(rowIndex) {
		var ind = angular.isDefined(rowIndex) ? rowIndex : this._.size(this.tableData);
		var newRow = {
			rowData: [{
				value: ''
			}]
		};

		this._.each(this.gridMeta, (column, columnIndex) => {
			newRow.rowData.push({
				__self__: column.link,
				value: undefined
			});
		});
		this.errors[this._.size(this.errors)] = this.errors[this._.size(this.errors) - 1];

		if (angular.isDefined(rowIndex)) {
			this.gridData.rows.splice(rowIndex, 0, newRow);
		} else {
			this.gridData.rows.push(newRow);
		}

		this.tableData.push(this.parseRow(newRow, ind));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#doScroll
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Scroll event handler for infinite scrolling.
	 */
	doScroll() {
		if (this.endOfList) { // reached the end of the list
			return;
		}

		// Disabled, we don't have pagination in the current Grid endpoint
		// $scope.pageNumber++;

		// Code to load the second page of the Grid data here
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#performAction
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Scroll event handler for clicking inside tabular widget.
	 *
	 * @param {Object} event The event object that was trigger
	 * @param {Object} row The row object of the table data
	 * @param {String} key The column key of the table data row
	 */
	performAction(event, row, key) {
		// row = tableData row
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Triggered by clicking save button. NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		this._.each(this.tableData, (row, key) => {
			row.waiting = true; // sets the var to true, as to block all form elements from editing
		});

		this.EventService.send(`grid:${this.itemId}:saveGrid`, [this.GridObj, this._, this.tableData, this.workspaceId, this.itemId, this.gridMeta]);
		let gridSaveListenerId = this.EventService.listen(`grid:${this.itemId}:saveDone`, (event, flag, obj) => {
			this.EventService.unlisten(gridSaveListenerId);

			if (flag) {
				LOCATION.get(this).search({
					tab: LOCATION.get(this).search().tab,
					view: LOCATION.get(this).search().view,
					mode: 'view',
					itemId: LOCATION.get(this).search().itemId
				});
			}
			this._.each(this.tableData, (row, key) => {
				row.waiting = false; // Sets the var to true, as to block all form elements from editing
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Triggered by clicking cancel button. NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		this.gridData = this.GridObj.getFullList();
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'view',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Triggered by clicking add button.
	 */
	triggerAdd() {
		this.triggerEdit(true);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Triggers edit mode.
	 *
	 * @param {Boolean} addRow A boolean determining whether we should add new row.
	 */
	triggerEdit(addRow) {
		if (!this.edit) {
			LOCATION.get(this).search({
				tab: LOCATION.get(this).search().tab,
				view: LOCATION.get(this).search().view,
				mode: 'edit',
				itemId: LOCATION.get(this).search().itemId
			});
		} else {
			if (addRow) {
				this.addRow();
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#triggerContextMenu
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Triggers context menu on the element.
	 *
	 * @param {Object} event The javascript event
	 * @param {Object} param The parameter passed back from the triggering
	 */
	triggerContextMenu(event, param) {
		// Let's disable context menu for now until we have support for adding rows anywhere
		return;
		if (!this.edit) {
			return;
		}

		this.canHideContextMenu = false;
		this.showContextMenu = true;

		this.$timeout(() => {
			this.canHideContextMenu = true;
		}, 500);

		/* global $ */
		$('.context-menu').css({
			'z-index': 10000,
			left: `${event.clientX}px`,
			top: `${event.clientY}px`
		});

		this.selectedRowId = parseInt(param.rowId) - 1;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#hideContextMenu
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Hides Context Menu
	 */
	hideContextMenu() {
		if (this.canHideContextMenu) {
			this.showContextMenu = false;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewGridController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewGridController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (LOCATION.get(this).search().mode === 'view');
	}
}

export default ViewGridController;
