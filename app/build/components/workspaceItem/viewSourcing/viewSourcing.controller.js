System.registerModule("com/autodesk/components/workspaceItem/viewSourcing/viewSourcing.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewSourcing/viewSourcing.controller.js";
  var SCOPE = new WeakMap();
  var ROOT_SCOPE = new WeakMap();
  var STATE = new WeakMap();
  var PLM_PERMISSIONS = new WeakMap();
  var EVENT_SVC = new WeakMap();
  var MODELS_MGR = new WeakMap();
  var UNDERSCORE = new WeakMap();
  var ViewSourcingController = function() {
    function ViewSourcingController($scope, $rootScope, $location, $state, PLMPermissions, EventService, ModelsManager, _) {
      var $__3 = this;
      this.$location = $location;
      SCOPE.set(this, $scope);
      ROOT_SCOPE.set(this, $rootScope);
      STATE.set(this, $state);
      PLM_PERMISSIONS.set(this, PLMPermissions);
      EVENT_SVC.set(this, EventService);
      MODELS_MGR.set(this, ModelsManager);
      UNDERSCORE.set(this, _);
      this.sourcingsListenerId;
      this.supplierStateListenerId;
      this.sourcingQuotesListenerId;
      this.bundle = $rootScope.bundle;
      this.viewState = 'sourcing-view';
      this.SourcingsObj = null;
      this.SourcingsQuotesObj = null;
      this.selectedSourcing = null;
      this.sourcingsList = null;
      this.itemQuantity = 100;
      this.addSupplierHref = $state.href('supplier-add', {});
      this.addQuoteHref = $state.href('quote-add', {supplierId: this.selectedSourcing && this.selectedSourcing.supplier.link});
      this.suppliersTableData = {
        columns: [{
          displayName: this.bundle.sourcing.supplier,
          field: 'title',
          cellTemplate: 'suppliersRenderer',
          enableSorting: false
        }],
        rows: []
      };
      this.quotesTableData = {
        columns: [{
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
        }],
        rows: []
      };
      this.sourcingsListenerId = EventService.listen(("sourcings:" + $location.search().itemId + ":done"), function(event, SourcingsObj) {
        EventService.unlisten($__3.sourcingsListenerId);
        $__3.SourcingsObj = SourcingsObj;
        $__3.parseSuppliersList();
      });
      ModelsManager.getSourcings($location.search().itemId);
    }
    return ($traceurRuntime.createClass)(ViewSourcingController, {
      parseSuppliersList: function() {
        var $__3 = this;
        var first = true;
        this.sourcingsList = {};
        UNDERSCORE.get(this).each(this.SourcingsObj.json.sourcings, function(sourcing) {
          if (sourcing && sourcing.quotes) {
            delete sourcing.quotes.quotes;
            if (sourcing.quotes.__self__.indexOf('/') === 0) {
              sourcing.quotes.__self__ = sourcing.quotes.__self__.substring(1) || null;
            }
          }
          $__3.sourcingsList[sourcing.supplier.link] = sourcing;
          if (first) {
            first = false;
            $__3.selectedSourcing = sourcing;
            $__3.selectedSourcing.selected = true;
            $__3.getSourcingQuotesData($__3.selectedSourcing.quotes.__self__);
            $__3.getSupplierStateData($__3.selectedSourcing.supplier.link);
          }
          $__3.suppliersTableData.rows.push({title: {
              val: sourcing.supplier.title,
              id: sourcing.supplier.link
            }});
        });
      },
      getSupplierStateData: function(link) {
        var $__3 = this;
        try {
          var resourceId = this.retrieveResourceIdFromSelfLink(link);
          this.supplierStateListenerId = EVENT_SVC.get(this).listen(("itemTransitions:" + resourceId + ":done"), function(event, SupplierTransitionsObj) {
            EVENT_SVC.get($__3).unlisten($__3.supplierStateListenerId);
            if (SupplierTransitionsObj && SupplierTransitionsObj.transitions) {
              $__3.retrieveState(SupplierTransitionsObj.transitions);
            }
          });
          MODELS_MGR.get(this).getTransitions(resourceId);
        } catch (err) {
          console.log('Error in ViewSourcingController:selectSupplier', err);
        }
      },
      getSourcingQuotesData: function() {
        var $__3 = this;
        var itemId = STATE.get(this).params.itemId;
        var quotesLink = this.selectedSourcing.quotes.__self__;
        this.sourcingQuotesListenerId = EVENT_SVC.get(this).listen(("sourcingQuotes:" + itemId + ":done"), function(event, SourcingQuotesObj) {
          EVENT_SVC.get($__3).unlisten($__3.sourcingQuotesListenerId);
          $__3.SourcingQuotesObj = SourcingQuotesObj;
          $__3.showQuotesForSelectedSourcing();
        });
        MODELS_MGR.get(this).getSourcingQuotes(itemId, quotesLink);
      },
      selectSupplier: function(data) {
        try {
          var id = data.row.entity.title.id;
          if (id !== this.selectedSourcing.supplier.link) {
            this.selectedSourcing = this.sourcingsList[id];
            this.getSourcingQuotesData(id);
            this.getSupplierStateData(id);
          }
        } catch (err) {
          console.log('Error in ViewSourcingController:selectSupplier', err);
        }
      },
      retrieveState: function(transitions) {
        this.selectedSourcing.state = (transitions && transitions[0]) ? transitions[0].fromState.title : 'Not found';
      },
      retrieveResourceIdFromSelfLink: function(link) {
        var wsId;
        var itemId;
        var linkParts = link && link.split('/');
        if (linkParts && linkParts.length === 7) {
          wsId = linkParts[4];
          itemId = linkParts[6];
          if (wsId.length && itemId.length && !isNaN(wsId) && !isNaN(itemId)) {
            return wsId.concat('@').concat(itemId);
          }
        }
        return null;
      },
      showQuotesForSelectedSourcing: function() {
        var $__3 = this;
        if (this.selectedSourcing !== null) {
          this.quotesTableData.rows = [];
          if (this.selectedSourcing.quotes && this.selectedSourcing.quotes.__self__) {
            this.selectedSourcing.quotes.quotes = this.SourcingQuotesObj.json || [];
            UNDERSCORE.get(this).each(this.selectedSourcing.quotes.quotes, function(quote) {
              $__3.quotesTableData.rows.push({
                minAmount: {val: quote.minAmount},
                maxAmount: {val: quote.maxAmount},
                leadTime: {val: quote.leadTime},
                unitPrice: {val: quote.unitPrice},
                comments: {val: quote.quote_comments}
              });
            });
          }
        }
      },
      triggerCancel: function() {
        STATE.go(this.viewState, {itemId: STATE.params.itemId});
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewSourcingController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewSourcing/viewSourcing.controller.js
