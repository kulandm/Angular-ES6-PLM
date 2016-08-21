System.registerModule("com/autodesk/models/bomEdit/bomChangeList.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeList.model.js";
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var BomChangeCompiled = System.get("com/autodesk/models/bomEdit/bomChangeCompiled.model.js").default;
  var AbstractChangeList = System.get("com/autodesk/models/editTracker/abstractChangeList.model.js").default;
  var BomChangeListTypes = System.get("com/autodesk/models/bomEdit/bomChangeListTypes.js").default;
  var BomChangeList = function($__super) {
    function BomChangeList(edgeId) {
      $traceurRuntime.superConstructor(BomChangeList).call(this);
      this.BomChangeListTypes = BomChangeListTypes;
      this.BomChangeTypes = BomChangeTypes;
      this.edgeId = edgeId;
    }
    return ($traceurRuntime.createClass)(BomChangeList, {
      acceptanceFunction: function(newChange) {
        return $traceurRuntime.superGet(this, BomChangeList.prototype, "acceptanceFunction").call(this, newChange) && true;
      },
      acceptEditChange: function(newChange) {
        var list = this.changes.get(newChange.changeType);
        var filteredList = list.filter(function(oldChange) {
          return !newChange.targetsSameField(oldChange);
        });
        if (!newChange.isRevertingChange()) {
          filteredList.push(newChange);
        }
        this.changes.set(newChange.changeType, filteredList);
      },
      acceptRemoveChange: function(newChange) {
        this.changes.set(newChange.changeType, [newChange]);
      },
      acceptChange: function(newChange) {
        if (newChange.changeType === this.BomChangeTypes.FIELDEDIT) {
          this.acceptEditChange(newChange);
        } else if (newChange.changeType === this.BomChangeTypes.REMOVEITEM) {
          this.acceptRemoveChange(newChange);
        } else {
          this.changes.get(newChange.changeType).push(newChange);
        }
      },
      getChangeType: function() {
        if (this.changes.has(this.BomChangeTypes.REMOVEITEM) && this.changes.get(this.BomChangeTypes.REMOVEITEM).length > 0) {
          return this.BomChangeListTypes.REMOVE;
        } else if (this.changes.has(this.BomChangeTypes.ADDITEM) && this.changes.get(this.BomChangeTypes.ADDITEM).length > 0) {
          return this.BomChangeListTypes.ADD;
        } else if (this.changes.has(this.BomChangeTypes.FIELDEDIT) && this.changes.get(this.BomChangeTypes.FIELDEDIT).length > 0) {
          return this.BomChangeListTypes.EDIT;
        } else {
          return this.BomChangeListTypes.NOCHANGE;
        }
      },
      getEditState: function() {
        var changeType = this.getChangeType();
        var isInvalid = false;
        if (changeType === this.BomChangeListTypes.REMOVE) {
          isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.REMOVEITEM));
        } else if (changeType === this.BomChangeListTypes.ADD) {
          isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.ADDITEM)) || this.hasInvalidChange(this.changes.get(this.BomChangeTypes.FIELDEDIT));
        } else if (changeType === this.BomChangeListTypes.EDIT) {
          isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.FIELDEDIT));
        }
        return {
          changeType: changeType,
          isInvalid: isInvalid
        };
      },
      hasInvalidChange: function() {
        var changeList = arguments[0] !== (void 0) ? arguments[0] : [];
        return _.some(changeList, function(change) {
          return change.isInvalid();
        });
      },
      compilationFunction: function() {
        var changeType = this.getChangeType();
        if (changeType !== this.BomChangeListTypes.NOCHANGE) {
          return new BomChangeCompiled(changeType, this.edgeId, this.changes);
        }
        return null;
      }
    }, {}, $__super);
  }(AbstractChangeList);
  var $__default = BomChangeList;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeList.model.js
