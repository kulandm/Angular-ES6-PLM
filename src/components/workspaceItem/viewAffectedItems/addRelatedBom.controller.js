'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.AddRelatedBomController
 *
 * @description This controller responsible for add related BOM based on selected options
 *
 * ##Dependencies
 *
 */

const MODELS_MGR = new WeakMap();
const EVENT_SVC = new WeakMap();

class AddRelatedBomController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#constructor
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $stateParams, $mdDialog, EventService, urn, ModelsManager) {
		this.urn = urn;
		this.$mdDialog = $mdDialog;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		MODELS_MGR.set(this, ModelsManager);
		EVENT_SVC.set(this, EventService);

		// Listener Id's
		this.relatedBomItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#displayResults
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description A Boolean that Stores display results, default is 'false'.
		 */
		this.displayResults = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#childrenOptions
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description An array that Stores include-children options.
		 */
		this.childrenOptions = [$rootScope.bundle.text.none, $rootScope.bundle.text.directChildren, $rootScope.bundle.text.allChildren];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#childrenSelectedOption
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description A string that Stores selected include-children option, default is 'None'.
		 */
		this.childrenSelectedOption = this.childrenOptions[0];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#parentsOptions
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description An array that Stores include-parents options.
		 */
		this.parentsOptions = [$rootScope.bundle.text.none, $rootScope.bundle.text.directParents];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#parentsSelectedOption
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description A string that Stores selected include-parents option, default is 'None'.
		 */
		this.parentsSelectedOption = this.parentsOptions[0];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#itemsFilterOptions
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description An array that Stores terms filter options.
		 */
		this.itemsFilterOptions = [$rootScope.bundle.text.itemFilter, $rootScope.bundle.text.all];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#itemsFilterSelectedOption
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description A string that Stores selected terms filter option.
		 */
		this.itemsFilterSelectedOption = this.itemsFilterOptions[0];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#selectedRows
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description An array that Stores selected rows.
		 */
		this.selectedRows = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddRelatedBomController#tableData
		 * @propertyOf Controllers.workspaceItem.AddRelatedBomController
		 * @description Stores the details of the table's default fields.
		 */
		this.tableData = {
			columns: [
				{
					field: 'selection',
					enableColumnResizing: false,
					headerCellTemplate: 'bomCheckboxHeaderTemplate',
					cellTemplate: 'bomCheckboxTemplate',
					width: '50'
				},
				{
					displayName: $rootScope.bundle.affectedItems.itemDescriptor,
					field: 'item',
					type: 'object'
				},
				{
					displayName: $rootScope.bundle.affectedItems.currentState,
					field: 'currentState',
					type: 'object'
				}
			],
			rows: []
		};
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#searchRelatedBom
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description confirmation of removal
	 *
	 */
	searchRelatedBom() {
		this.tableData.rows = [];
		this.relatedBomItemsListenerId = EVENT_SVC.get(this).listen('relatedBomItems:' + this.urn + ':done', (event, ...relatedBomItemsObj) => {
			this.parseRelatedBomItems(relatedBomItemsObj);
		});

		if (this.childrenSelectedOption !== this.$rootScope.bundle.text.none || this.parentsSelectedOption !== this.$rootScope.bundle.text.none) {
			if (this.childrenSelectedOption === this.$rootScope.bundle.text.directChildren) {
				MODELS_MGR.get(this).getDirectChildrenBOMItems(this.urn);
			}
			if (this.childrenSelectedOption === this.$rootScope.bundle.text.allChildren) {
				MODELS_MGR.get(this).getAllChildrenBOMItems(this.urn);
			}
			if (this.parentsSelectedOption === this.$rootScope.bundle.text.directParents) {
				MODELS_MGR.get(this).getRelatedParentBOMItems(this.urn);
			}
		}
		this.displayResults = true;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#parseRelatedBomItems
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description Initialize the table data.
	 *
	 * @param {Object} relatedBomItems The items to be added to tableData.
	 *
	 * @return {Object} A promise that will be resolved when the table data is loaded.
	 */
	parseRelatedBomItems(relatedBomItems) {
		// Iterate through each related BOM item
		_.each(relatedBomItems, (relatedBomItem, elementIndex) => {
			if (!relatedBomItem.getWorkflowReference() &&
					(this.itemsFilterSelectedOption === this.$rootScope.bundle.text.all || (this.itemsFilterSelectedOption !== this.$rootScope.bundle.text.all && relatedBomItem.getWorkingHasChanged()))) {
				this.tableData.rows.push({
					item: relatedBomItem.getItemDescriptor(),
					currentState: relatedBomItem.getLifecycle(),
					itemId: relatedBomItem.getItemId(),
					ref: relatedBomItem,
					selection: {
						isSelected: true
					}
				});
			}
		});

		// Filter the repeated items
		this.tableData.rows = _.uniq(this.tableData.rows, (row, key) => {
			return row.itemId;
		});

		this.selectedRows = this.tableData.rows;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#clearResults
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description the data table is cleared and rdirects to filter page of the modal window.
	 *
	 */
	clearResults() {
		this.displayResults = false;
		EVENT_SVC.get(this).unlisten(this.relatedBomItemsListenerId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#cancel
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description cancel the process of removal.
	 *
	 */
	cancel() {
		this.$mdDialog.cancel();
		EVENT_SVC.get(this).unlisten(this.relatedBomItemsListenerId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#selectRow
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description filters the table row based on selection.
	 *
	 */
	selectRow() {
		this.selectedRows = _.filter(this.tableData.rows, function (obj) {
			return obj.selection.isSelected === true;
		});
	}

	/**
	 * @ngdoc property
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#toggleAllSelection
	 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description toggle all selection state of the grid.
	 */
	toggleAllSelection() {
		if (this.tableData.rows.length !== this.selectedRows.length) {
			_.each(this.tableData.rows, (tableRow) => {
				tableRow.selection.isSelected = true;
			});
			this.selectedRows = this.tableData.rows;
		} else {
			_.each(this.tableData.rows, (tableRow) => {
				tableRow.selection.isSelected = false;
			});
			this.selectedRows = [];
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddRelatedBomController#add
	 * @methodOf Controllers.workspaceItem.AddRelatedBomController
	 * @description Add the selected items to the affected item.
	 */
	add() {
		EVENT_SVC.get(this).send('relatedBomItems:added', this.selectedRows);
		this.selectedRows = [];
	}
}

export default AddRelatedBomController;
