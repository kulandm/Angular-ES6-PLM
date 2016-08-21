System.registerModule("com/autodesk/components/workspaceItem/viewAffectedItems/bulkEdit.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAffectedItems/bulkEdit.controller.js";
  var BulkEditController = function() {
    function BulkEditController($q, $rootScope, $mdDialog, workspaceObj, selectedItems, ModelsManager, EventService, UrnParser, _, $filter, $mdDateLocale) {
      var $__3 = this;
      var todaysDate = new Date();
      this.minDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;
      this._ = _;
      this.selectedItems = selectedItems;
      this.UrnParser = UrnParser;
      this.stateLifecycle = [];
      this.effectivity = {
        enabled: false,
        data: {datePickerMinDate: new Date()}
      };
      this.meta = {
        isDisabled: true,
        datePickerMinDate: new Date()
      };
      this.itemMap = {};
      this.itemPromiseList = this._.map(selectedItems, function(affectedItem) {
        return $q(function(resolve) {
          var itemURN = UrnParser.encode(affectedItem.getItemUrn());
          EventService.listen(("itemInstance:" + itemURN + ":done"), function(event, itemObj) {
            resolve($__3.itemMap[itemURN] = itemObj);
          });
          ModelsManager.getItem(itemURN);
        });
      });
      $q.all(this.itemPromiseList).then(function(itemList) {
        var stateList = $__3._.map(itemList, function(item) {
          return item.getLifecycleState();
        });
        var distinctStateList = $__3._.uniq(stateList, false, function(stateObj) {
          return stateObj.urn;
        });
        $__3._.each(distinctStateList, function(stateObj) {
          var splitURN = stateObj.urn.split('.');
          var stateId = splitURN[splitURN.length - 1];
          var stateListener = EventService.listen(("itemState:" + stateId + ":done"), function(event, stateModelObj) {
            EventService.unlisten(stateListener);
            stateObj.useEffectivity = stateModelObj.getFullList().useEffectivity;
            ModelsManager.getTransitionsByLink(stateId, workspaceObj.getLifecycleWorkflowStateTransitionsLink(stateId));
          });
          var transitionListener = EventService.listen(("itemTransitions:" + stateId + ":done"), function(event, transitionsObj) {
            EventService.unlisten(transitionListener);
            stateObj.value = null;
            stateObj.transitions = transitionsObj.transitions;
            stateObj.options = {items: $__3._.map(stateObj.transitions, function(transition) {
                transition.title = transition.name;
                transition.link = transition.__self__;
                return transition;
              })};
            stateObj.options.items.unshift({title: $rootScope.bundle.affectedItems.pleaseSelect});
            stateObj.value = $__3._.clone(stateObj.options.items[0]);
            $__3.stateLifecycle.push(stateObj);
          });
          ModelsManager.getStateByLink(stateId, workspaceObj.getLifecycleWorkflowStateLink(stateId));
        });
      });
    }
    return ($traceurRuntime.createClass)(BulkEditController, {
      getAffectedItemsByState: function(stateURN) {
        var $__3 = this;
        return this._.filter(this.selectedItems, function(affectedItemObj) {
          var itemURN = $__3.UrnParser.encode(affectedItemObj.getItemUrn());
          return $__3.itemMap[itemURN].getLifecycleState().urn === stateURN;
        });
      },
      closeBulkTransition: function() {
        this.$mdDialog.cancel();
      },
      updateBulkTransition: function() {
        var $__3 = this;
        var modifiedAffectedItems = [];
        this._.each(this.stateLifecycle, function(stateInfo) {
          if (stateInfo.value && stateInfo.value.link) {
            modifiedAffectedItems = modifiedAffectedItems.concat($__3._.map($__3.getAffectedItemsByState(stateInfo.urn), function(affectedItemObj) {
              affectedItemObj.setLifecycle(stateInfo.value);
              if ($__3.effectivity.enabled === true && stateInfo.useEffectivity === true) {
                affectedItemObj.setEffectivity($__3.effectivity.data.value ? new Date($__3.effectivity.data.value) : null);
              }
              return affectedItemObj;
            }));
          }
        });
        this.$mdDialog.hide(modifiedAffectedItems);
      },
      effectivityChanged: function(val) {
        if (val === true) {
          this.meta.isDisabled = false;
        } else {
          this.meta.isDisabled = true;
          this.effectivity.data = {};
        }
      }
    }, {});
  }();
  var $__default = BulkEditController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAffectedItems/bulkEdit.controller.js
