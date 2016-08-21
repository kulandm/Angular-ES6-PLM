'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewSourcingController
 *
 * @description This controller corresponds to the sourcing view
 *
 * ##Dependencies
 *
 */
const SCOPE = new WeakMap();
const ROOT_SCOPE = new WeakMap();
const STATE = new WeakMap();
const PLM_PERMISSIONS = new WeakMap();
const EVENT_SVC = new WeakMap();
const MODELS_MGR = new WeakMap();
const UNDERSCORE = new WeakMap();

class ViewSourcingController {
	constructor($scope, $rootScope, $location, $state, PLMPermissions, EventService, ModelsManager, _) {
		this.$location = $location;

		SCOPE.set(this, $scope);
		ROOT_SCOPE.set(this, $rootScope);
		STATE.set(this, $state);
		PLM_PERMISSIONS.set(this, PLMPermissions);
		EVENT_SVC.set(this, EventService);
		MODELS_MGR.set(this, ModelsManager);
		UNDERSCORE.set(this, _);

		// Listener IDs
		this.sourcingsListenerId;
		this.supplierStateListenerId;
		this.sourcingQuotesListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#bundle
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description `private` Assigns the rootScope's bundle (with localization) to this controller's bundle.
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#viewState
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The name of the view state for this tab
		 *
		 */
		this.viewState = 'sourcing-view';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#SourcingsObj
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The reference of {@link Models#Sourcings} associated with this view.
		 *
		 */
		this.SourcingsObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#SourcingsQuotesObj
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The reference of {@link Models#SourcingQuotes} associated with this view.
		 *
		 */
		this.SourcingsQuotesObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#selectedSourcing
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The reference to the selected sourcing/supplier whose data is being shown.
		 *
		 */
		this.selectedSourcing = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#sourcingsList
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The list of suppliers for this items' sourcing.
		 *
		 */
		this.sourcingsList = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#itemQuantity
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description Amount of items to fetch.
		 */
		this.itemQuantity = 100;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#addSupplierHref
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The href for the add supplier button
		 */
		this.addSupplierHref = $state.href('supplier-add', {});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#addQuoteHref
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description The href for the add quote button
		 */
		this.addQuoteHref = $state.href('quote-add', {
			supplierId: this.selectedSourcing && this.selectedSourcing.supplier.link
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description Stores table column header and rows for the tableData
		 */
		this.suppliersTableData = {
			columns: [
				{
					displayName: this.bundle.sourcing.supplier,
					field: 'title',
					cellTemplate: 'suppliersRenderer',
					enableSorting: false
				}
			],
			rows: []
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewSourcingController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewSourcingController
		 * @description Stores table column header, and rows, for the tableData
		 */
		this.quotesTableData = {
			columns: [
				{
					displayName: this.bundle.sourcing.min,
					field: 'minAmount',
					cellTemplate: 'quotesRenderer',
					enableSorting: false
				}, {
					displayName: this.bundle.sourcing.max,
					field: 'maxAmount',
					cellTemplate: 'quotesRenderer',
					enableSorting: false
				}, {
					displayName: this.bundle.sourcing.leadTime,
					field: 'leadTime',
					cellTemplate: 'quotesRenderer',
					enableSorting: false
				}, {
					displayName: this.bundle.sourcing.unitCost,
					field: 'unitPrice',
					cellTemplate: 'quotesRenderer',
					enableSorting: false
				}, {
					displayName: this.bundle.sourcing.comments,
					field: 'comments',
					cellTemplate: 'quotesRenderer',
					enableSorting: false
				}
			],
			rows: []
		};

		// This is the first call, to populate the data initially
		this.sourcingsListenerId = EventService.listen(`sourcings:${$location.search().itemId}:done`, (event, SourcingsObj) => {
			EventService.unlisten(this.sourcingsListenerId);
			this.SourcingsObj = SourcingsObj;
			this.parseSuppliersList();
		});

		ModelsManager.getSourcings($location.search().itemId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#parseSupplierList
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Parse the data retrieved from the endpoint
	 */
	parseSuppliersList() {
		let first = true;
		this.sourcingsList = {};

		UNDERSCORE.get(this).each(this.SourcingsObj.json.sourcings, (sourcing) => {

			/**
			 * Small tweaks
			 */
			if (sourcing && sourcing.quotes) {
				// Just for the sake of testing properly the feature that retrieves the quotes collection
				// This collection should not exist here
				delete sourcing.quotes.quotes;

				// The endpoint returns a link that starts with a / and breaks the request
				if (sourcing.quotes.__self__.indexOf('/') === 0) {
					sourcing.quotes.__self__ = sourcing.quotes.__self__.substring(1) || null;
				}
			}
			this.sourcingsList[sourcing.supplier.link] = sourcing;

			/* Set the first element as selected and show its quotes list */
			if (first) {
				first = false;
				this.selectedSourcing = sourcing;
				this.selectedSourcing.selected = true;
				this.getSourcingQuotesData(this.selectedSourcing.quotes.__self__);
				this.getSupplierStateData(this.selectedSourcing.supplier.link);
			}

			this.suppliersTableData.rows.push({
				title: {
					val: sourcing.supplier.title,
					id: sourcing.supplier.link
				}
			});

		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#getSupplierStateData
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Request the specific state data for the selected supplier.
	 */
	getSupplierStateData(link) {
		try {
			let resourceId = this.retrieveResourceIdFromSelfLink(link);
			this.supplierStateListenerId = EVENT_SVC.get(this).listen(`itemTransitions:${resourceId}:done`, (event, SupplierTransitionsObj) => {
				EVENT_SVC.get(this).unlisten(this.supplierStateListenerId);
				if (SupplierTransitionsObj && SupplierTransitionsObj.transitions) {
					this.retrieveState(SupplierTransitionsObj.transitions);
				}
			});
			MODELS_MGR.get(this).getTransitions(resourceId);
		} catch (err) {
			console.log('Error in ViewSourcingController:selectSupplier', err);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#getSourcingQuotesData
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Request the quotes of a specific sourcing of the item.
	 */
	getSourcingQuotesData() {
		let itemId = STATE.get(this).params.itemId;
		let quotesLink = this.selectedSourcing.quotes.__self__;

		this.sourcingQuotesListenerId = EVENT_SVC.get(this).listen(`sourcingQuotes:${itemId}:done`, (event, SourcingQuotesObj) => {
			EVENT_SVC.get(this).unlisten(this.sourcingQuotesListenerId);
			this.SourcingQuotesObj = SourcingQuotesObj;
			this.showQuotesForSelectedSourcing();
		});

		MODELS_MGR.get(this).getSourcingQuotes(itemId, quotesLink);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#selectSupplier
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Triggered by selecting a supplier from the suppliers' list
	 */
	selectSupplier(data) {
		try {
			let id = data.row.entity.title.id;
			/* The condition avoids to process twice the request for change. The ui-grid component seems to
			 * trigger the row change function once for the row that we are unselecting and once for the row we are selecting.
			 * Taking in account that we want to process only the row where we are landing, the first run is avoided.
			 */

			if (id !== this.selectedSourcing.supplier.link) {
				this.selectedSourcing = this.sourcingsList[id];
				this.getSourcingQuotesData(id);
				this.getSupplierStateData(id);
			}
		} catch (err) {
			console.log('Error in ViewSourcingController:selectSupplier', err);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#retrieveState
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Set the current state of the supplier
	 *
	 * @param {Object}	transitions The transitions object
	 */
	retrieveState(transitions) {
		this.selectedSourcing.state = (transitions && transitions[0]) ? transitions[0].fromState.title : 'Not found';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#retrieveResourceFromSelfLink
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Returns the resourceId from its URI / _self_ link.
	 * @param {String} link	The _self_ link of the supplier item
	 */
	retrieveResourceIdFromSelfLink(link) {
		let wsId;
		let itemId;
		let linkParts = link && link.split('/');

		if (linkParts && linkParts.length === 7) {
			wsId = linkParts[4];
			itemId = linkParts[6];

			if (wsId.length && itemId.length && !isNaN(wsId) && !isNaN(itemId)) {
				return wsId.concat('@').concat(itemId);
			}
		}

		return null;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#showQuotesForSelectedSourcing
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Show the proper list of quotes for the selected supplier
	 */
	showQuotesForSelectedSourcing() {
		if (this.selectedSourcing !== null) {
			this.quotesTableData.rows = [];
			if (this.selectedSourcing.quotes && this.selectedSourcing.quotes.__self__) {
				this.selectedSourcing.quotes.quotes = this.SourcingQuotesObj.json || [];
				UNDERSCORE.get(this).each(this.selectedSourcing.quotes.quotes, (quote) => {
					this.quotesTableData.rows.push({
						minAmount: {val: quote.minAmount},
						maxAmount: {val: quote.maxAmount},
						leadTime: {val: quote.leadTime},
						unitPrice: {val: quote.unitPrice},
						comments: {val: quote.quote_comments}
					});
				});
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Triggered by clicking cancel button - NOTE: name has to be
	 * triggerCancel
	 */
	triggerCancel() {
		STATE.go(this.viewState, {
			itemId: STATE.params.itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewSourcingController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewSourcingController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}
}

export default ViewSourcingController;
